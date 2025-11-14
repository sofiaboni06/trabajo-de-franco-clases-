// Importar las librerías necesarias
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/users.js"; // Ajusta la ruta si tu archivo se llama diferente

// Cargar las variables de entorno
dotenv.config();

// Crear una instancia de Express
const app = express();

// Configurar el puerto
const PORT = process.env.PORT || 3000;

// Middleware para entender JSON en las peticiones
app.use(express.json());

// Usar las rutas definidas en users.js bajo el prefijo /users
app.use("/users", userRoutes);

// Conectar a MongoDB usando la URI del .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conexión establecida con MongoDB Atlas");

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error al conectar MongoDB:", err.message);
    process.exit(1);
  });












































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