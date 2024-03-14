//ROUTER
import { Router } from "express";

//PRODUCT MANAGER
import CartManager from "../CartManager.js";

//INICIO ROUTER
const router = Router();

//INICIO PRODUCT MANAGER
const PM = new CartManager("carts.json");

//Rutas GET
router.get("/:cartId", async (req, res) => {
  
});

//Rutas POST
router.post("/", async (req, res) => {
  
});

router.put("/:cartId", async (req, res) => {
  
});

router.delete("/:cartId", async (req, res) => {
  
});

export default router;
