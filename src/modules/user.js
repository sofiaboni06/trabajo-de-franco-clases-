//el modelo(schema) => define como deben verse los datos dentro de mongoDB 
//es como la receta de una plato => especifica que ingredientes lleva , su tipo y si son obligatorios
//se escribe por convecion user.js es singula proque respresntamo un modelo no muchos es una estructura

import mongoose  from "mongoose";

// defino la receta (schema o estructura de los datos)
const userSchema = new mongoose.Schema({//define como deber lucir cada usuario(que campos debe tener ,tipos, ...)
    nombre : {type: String, required:true, trim:true,},
    email : {type: String, required: true, trim:true , unique: true, lowerCase:true},
    password : {type:String, required:true},
    edad : {type: Number, default: null}
}, {timestamps: true});//timestamps=> agrague automaticamente createdAt y updatedAt

// Creamos el modelo (el chef para poder usarlo en la rutas)

// EL model=> es la herramienta que puede crear, buscar, actualizar, eliminar documentos
const User = mongoose.model("User", userSchema);

export default User;