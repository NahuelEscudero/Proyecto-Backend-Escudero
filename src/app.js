//EXPRESS
import express from "express";

//PRODUCT MANAGER
import ProductManager from "./ProductManager.js";

//ROUTES
import productsRouter from "./routes/products.router.js";
// import cartsRouter from "./routes/carts.router.js"

//MULTER
//import { uploader } from "./utils.js";

const app = express(); //app tiene todas las funcionalidades de express
const PORT = 8080; //defino puerto

//Middlewares
app.use(express.json()); //Transformo JSON a objeto Js
app.use(express.urlencoded({ extended: true })); //Permito a Express manejar y procesar datos complejos enviados en la URL
app.use("/api/products", productsRouter); 
// app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto http://localhost:${PORT}`);
});
