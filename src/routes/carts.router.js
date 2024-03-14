//ROUTER
import { Router } from "express";

//PRODUCT MANAGER
import CartManager from "../CartManager.js";

//INICIO ROUTER
const router = Router();

//INICIO PRODUCT MANAGER
const CM = new CartManager("carts.json");

//Ruta POST
router.post("/", async (req, res) => {
  const carts = await CM.createCart();

  res.status(200).send({ message: "Carrito creado correctamente" });

  return carts;
});

//Ruta GET por Id
router.get("/:cartId", async (req, res) => {
  const id = parseInt(req.params.cartId);
  const cartProds = await CM.getCartById(id);

  res.status(200).send({ products: cartProds});
});

router.put("/:cartId", async (req, res) => {});

router.delete("/:cartId", async (req, res) => {});

export default router;
