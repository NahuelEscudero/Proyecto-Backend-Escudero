//ROUTER
import { Router } from "express";

//PRODUCT Y CART MANAGER
import CartManager from "../CartManager.js";
import ProductManager from "../ProductManager.js";

//INICIO ROUTER
const router = Router();

//INICIO CART MANAGER
const CM = new CartManager("carts.json");
const PM = new ProductManager("products.json");

//Rutas GET
router.get("/", async (req, res) => {
  const carts = await CM.getCarts();
  res.send(carts);
  
})

router.get("/:cartId", async (req, res) => {
  const id = parseInt(req.params.cartId);
  const cart = await CM.getCartById(id);

  res.status(200).send(cart);
});

//Rutas POST
router.post("/", async (req, res) => {
  const carts = await CM.createCart();

  res.status(200).send({ message: "Carrito creado correctamente" });

  return carts;
});

router.post("/:cartId/product/:productId", async (req, res) => {
  const idCart = parseInt(req.params.cartId);
  const idProduct = parseInt(req.params.productId);
  await CM.addProductToCart(idCart, idProduct);
  res
    .status(200)
    .send({ message: "Los parametros se obtuvieron correctamente" });
  
});

export default router;
