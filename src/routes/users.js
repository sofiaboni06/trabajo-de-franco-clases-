import express from "express";
import bcrypt from "bcrypt";
import User from "../modules/user.js" //traigo el modelo user que es como estaran estructurados los datos=> como se guardaran los datos es scheme

// una ruta en express define => que pasa cuando alguien accede a cierta direccion ENDPOINT
// example => si voy a /users podria devolverme la lista de usuarios (si uso el GET)
// sí uso el POST => a /users puede crear un nuevo usuario


// creo un enrutador de express esto es => basicamente para el menu de usuarios 
const router = express.Router();

// defino cuantas vueltas de encryptacion usará bycrypt
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;


// ************ esta seta una ruta POST => para crear un nuevo usuario

// si alguien lega a esta truta usando post entra aqui 
router.post("/", async (req, res)=>{
    try{
        const {nombre, email, password, edad} = req.body; //esto es lo que enviaremos en  el body de la peticion
        
        // valido los datos obligatorios
        if(!nombre || !email || !password ){
            return res.status(400).json({error : "nombre , email y password son requeridos"});
        }
        //    verificar si ya existe un user 
        const existente = await User.findOne({email});
        
        if(existente){
            return res.status(409).json({error: "El email ya esta registrado"});
        }

        // encripto la constraseña
        const hashed = await bcrypt.hash(password,SALT_ROUNDS); //aqui le paso la pass y le indico el numero de salto o vueltas de encriptacion
        
        // creo el nuevo user con la pass encriptada
        const nuevoUser = new User({nombre, email, password:hashed, edad});
        await nuevoUser.save();//

        // devolvemos una respuesta => sin incluir la pass
        res.status(201).json({message: "Usuario creado correctamente"});
    }catch(err){
        console.error("Error en POST /users", err);
        res.status(500).json({erro: "Error del servidor"});
    }



    
});

//  ******RUTA PARA EL GET => obtener todos los users

router.get("/", async(req,res)=>{
    try{
        const users = await User.find().select("-password");// No devolvemos las contraseña
        res.json(users);
    }catch(err){
        console.error("Erro en el GET /users", err);
        res.status(500).json({error: "Error del servidor"});
    }
});



// ********* ENDPOINDT PARA EL GET => obtener un solo user (como hacer click a un perfil escpcifico)

router.get("/:id", async(req, res)=>{
    try{
        const {id} = req.params //saco de la req => el id que le paso desde la URL
        
        // Busco el user por su id en la database(mongoose lo busca)
        const user = await User.findById(id).select("-password");

        // si no lo encuentro ,respondo con un 404 (not found) => bad pragramming el peor caso primero
        if(!user){
            return res.status(404).json({error: "Usuario no encontrado"});
        }
        console.log(user);

        // si no entro el if entonces tenemos algo y l retorno
        res.json(user)// res=> respondo al cliente y esa respuesta sera e json y lo que mandare sera el user que encontre con esa id
    
    }catch(err){
        console.error("Error en GET /users/:id", err);
        res.status(500).json({error: "Error en el servidor"});
    }
})


// *********Metodo PUT => actualizar un user

router.put("/:id", async(req,res)=>{
    try{
        // obtenemos el id del usuario
        const {id} = req.params;

        // datos que vamos a actualizar
        const {nombre, email, password, edad} = req.body;

        // Busco si el user existe
        const user = await User.findById(id);//es una isntacia del modelo de mongoose => la version editable del documento que esta en la db

        // compruebo no existe o si  el user
        if(!user){
            return res.status(404).json({error: "Usuario no encontrado"})
        };

        // actualizo el user que encontramos
        if(nombre) user.nombre = nombre; // si el nombre de user existe => lo sobrescribo pór lo que pase en el body de la request
        if(email) user.email = email;
        if(edad) user.edad = edad;

        // si se envia la nueva pass  => la encriptamos
        if(password){
            // encripto la nueva pass 
            const hashed = await bcrypt.hash(password, SALT_ROUNDS);
            user.password = hashed; //la actualizo 
        }

        // guardamos los cambios=> save es un metodo de mongoose => compara lo que habia y lo que hay ahora y envia a la db solo los cambios 
        // espera la confirmacion y se acutaliza el updateAt
        await user.save();

        // Respondemos sin incluir la contraseña
        res.json({
            message : "Usuario actulizado correctamente",
            user:{
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                edad: user.edad,
                updatedAt : user.updatedAt
            }
        });


    }catch(errore){
        console.log("Eror en PUT /users/:id", errore);
        res.status(500).json({errorrr: "Error del server"});
    }

});


// ********** Metodo DELETE => para borrar un usauriooo

router.delete("/:id",async(req, res)=>{
    
    try{
        // sacar la id del URL 
        const {id} = req.params; 

        // buscar si existe en la db esa id
        // user es una instancia de el Modelo de Mongoose User => este solo puede usar user.save() o remove  o modificar el valor de esa instancia antes de guardarla
        const user = await User.findById(id)// lo que econtremos lo guarod en el espacion en memoria llamdo user

        // compruebo si NO existe y retorno (early exit) o si existe el user
        if(!user){
            // sino existe le resopndo al cliente algo que le de a entender que pasa
            res.status(404).json({error:"Usuario NO encontrado"})//la response se la doy con =>un estado a la request se la mando en json y le incluto una nota de que paso 
        }

        // si SI existe LO BORRO(se salto el if anterior por que o era difente de True (era false) que no existia
        // es el Modelo de Mongose(porqeu es desde ahi desde ahi que se elimina)
        // este tiene metodos como .find() o create(data), findByIdAndDelete o findOne()
        await User.findByIdAndDelete(id);//metodo del modelo de mongoose que es el que guarda los datos => colecciones completas mientras que user => seria son un documeto nada mas nopuede acceder a los que estan guardados y borrar

        // le doy la respuesta al cliente de que se elimino el user
        res.json({message: "Usuario eliminado correctamente"}); 

    }catch(err){
        console.log("Error en DELETE /users/:id", err);//para hacer debugging si algo falla se donde fue
        // repuesta si algo fue mal
        res.status(500).json({error: "Error del servidor"});

    }
})

export default router;