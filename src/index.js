// importare las herramietas que necsitare
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/users.js";


// cargar las variables de entorno
//"activate dotenv" para que podamos leer el archivo .env
dotenv.config()// dotenv es la caja fuerte y la URL de la db son las llaves del negocio

//creo una instacia del server (una plantilla) //crear la app
const app = express();//es como llamar al mesero(el intemedio o api ) para que se ponga el delantal


// defino que puerto  => lo puedo tener en el .env  sino usar el 3000
const PORT = process.env.PORT ||   3000; 

//el middleware => le digo a express(framework) que entienda JSON
app.use(express.json());


// montamos las rutas(endpoints)
// /user no existe en fisico o hay carpeta => es solo un prefijo  o una base que express usa para concatenar las rutas del router
// es como decir todo lo que empiece por /isers mandalo o users.js a "/" la raiz 
app.use("/users", userRoutes);//express encadena la ruta desde aqui y luego va a routes para encadenar => eemplo /users es la ruta base de encadenamiento ...luego va a routes y a users.js y encadena la siguiente basandose en el metodo http por ejemplo get "/" eso es users aun pŕque no hay mas pero si pongo en la peticion /users/:id entoces desde aqui(index.js) va y encadena a /:id 
//agrego al menu la section de platos  de usuario

// aqui nos conectamos a mongodb atlas => 
const mongoURI = process.env.MONGO_URI; //accedo al env y en la parte donde este MONGO_URI lo tomo como direccion

// si todo esta ok no estramos al if
if(!mongoURI){
    console.error("No se encontro la variable MONGO_URI en el archivo .env");//si no esta la variable en e env muestro error 
    process.exit(1)//si no hay cadena URL para conectarnos entonces finalizamos el proceso

};

mongoose.connect(mongoURI)//conecto a la cocina con el restaurante
.then(()=>{//esto creo es una promesa y entonces al irse por el lado del resolve o ok se ejecuta el then
    console.log("Conexion establecida Mongo DB Atlas");

    //encendere el server => para que empiecea escuchar pedidos (request o peticiones)
    app.listen(PORT, ()=>{//es como abrir las puertas del local en el puerto indicado
        console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    });

})
.catch((err)=>{
    console.error("Error al conectar Mongo DB: ", err.message);
    process.exit(1);
})
// NODEMON(dinamico) Y SINNODEMOON(estatico) => la diferencia radica en como se actualiza el server
// sin nodemon el server inicia y se ejecuta la primera vez y se queda con lo qeu funciona => toma una foto de lo que sirve
// si agrego  algo o quito no afecto por qeu el server esta "estatico"
// con nodemoon => se reicia a cada cambio cada cosa qeu se haga sera la ultima version por eso el server esta pendiente y no s da errores o muestra lo que hacemos


























































// //la ruta raiz(el endpoint )=Z que vamos a responder cuando el cliente visite ese endpoint
// app.get("/", (req,res)=>{//esta es la ruta raiz o princial y el mesero(expres) si alguien golpea la puerta principial el mesero  responde con un saludo
//     res.send("Hola, el server Express esta listoooo");//esto es la response que enviare al cliete al estar es esa ruta (endpoint) esto es una api=> enviar datos al cliente
// });

// //hare una ruta de prueba => devolvere un ejemplo de datos con JSON
// app.get("/users",(req,res)=>{
//     res.json([
//         {id:1 , nombre: "Camilo", edad:23} //Esta es la response de esa route
//     ]);
// });

// //encendere el server => para que empiecea escuchar pedidos (request o peticiones)
// app.listen(PORT,()=>{
//     console.log(`Seridor corriendo en: http://localhost:${PORT}`);
// })