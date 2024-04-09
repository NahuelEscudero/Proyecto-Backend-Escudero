//EXPRESS
import express from "express";

//HANDLEBARS
import handlebars from "express-handlebars";

//ROUTES
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import homeViewRouter from "./routes/views.router.js";

//__dirname
import { __dirname } from "./utils.js";

//SERVER PARA SOCKET.IO
import { Server } from "socket.io";

import path from "path";

const app = express(); //app tiene todas las funcionalidades de express
const PORT = 8080; //defino puerto

//Middlewares
app.use(express.json()); //Transformo JSON a objeto Js
app.use(express.urlencoded({ extended: true })); //Permito a Express manejar y procesar datos complejos enviados en la URL
app.use("/static", express.static(`${__dirname}/../public`)); //Configuro el servidor publico de archivos estaticos
// app.use(express.static(path.join(__dirname, 'public')));
app.use("/", homeViewRouter); //Llamo a la ruta con la vista home
app.use("/api/products", productsRouter); //Llamo a la Api de products
app.use("/api/carts", cartsRouter); //Llamo a la Api de carts

//Inicializo motor de plantillas
app.engine("handlebars", handlebars.engine());
//Establezco ruta de vistas
app.set("views", `${__dirname}/views`);
//Establezco motor de renderizado
app.set("view engine", "handlebars");

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {});

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado>>>>>>", socket.id);

  socket.on("message", (data) => {
    console.log("Recibi la siguiente data: ", data);
  });

  socket.emit(
    "socket-individual",
    "Este mensaje solo lo debe recibir el socket"
  );
  socket.broadcast.emit(
    "todos-menos-socket",
    "Este mensaje lo ven todos menos el socket"
  );
  socketServer.emit(
    "socket-para-todos",
    "Este mensaje lo reciben TODOS los sockets conectados"
  );
});
