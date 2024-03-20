//ROUTER
import { Router } from "express";
//INICIO ROUTER
const router = Router();

//CART MANAGER
import CartManager from "../CartManager.js";
//INICIO CART MANAGER
const CM = new CartManager("carritos.json");

//Rutas GET
router.get("/", async (req, res) => {
  const carts = await CM.getCarts();
  res.send(carts);
});

router.get("/:cartId", async (req, res) => {
  const id = parseInt(req.params.cartId);
  const cart = await CM.getCartById(id);

  res.status(200).send(cart);
});

//Rutas POST
router.post("/", async (req, res) => {
  await CM.createCart();

  res.status(200).send({ message: "Carrito creado correctamente" });
});

router.post("/:cartId/product/:productId", async (req, res) => {
  const idCart = parseInt(req.params.cartId);
  const idProduct = parseInt(req.params.productId);
  try {
    await CM.addProductToCart(idCart, idProduct);
    res
      .status(200)
      .send({ message: "Los parametros se obtuvieron correctamente" });
  } catch (error) {
    console.error(
      `Error al crear el producto id:${idProduct} en el carrito:${idCart}: ${error}`
    );

    res
      .status(400)
      .send({
        error: "No se encontro el producto porque el id no existe",
        error,
      });
  }
});

export default router;
