//ROUTER
import { Router } from "express";

//PRODUCT MANAGER
import ProductManager from "../managers/ProductManager.js";

//INICIO ROUTER y PM
const router = Router();
const PM = new ProductManager("data/productos.json");

//Valor del dolar
const valorDolar = 1020;


router.get("/", async (req, res) => {
  let productos = await PM.getProducts();
  res.render("home", {
    style: "home.css",
    prods: productos,
    valorDolar: valorDolar
  });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    style: "realTimeProducts.css"
  });
});

export default router;
