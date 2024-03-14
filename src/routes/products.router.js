//ROUTER
import { Router } from "express";

//PRODUCT MANAGER
import ProductManager from "../ProductManager.js";

//INICIO ROUTER
const router = Router();

//INICIO PRODUCT MANAGER
const PM = new ProductManager("productos.json");

//Rutas GET
router.get("/", async (req, res) => {
  try {
    const querys = req.query;
    const { limit } = querys;
    let products = await PM.getProducts();

    if (limit) {
      products = products.slice(0, parseInt(limit)); // Limitar la lista de productos según el query 'limit'
    }

    res.send(products); // Enviar la lista de productos (limitada si se especifica 'limit') como respuesta
  } catch (error) {
    console.error(`Error al obtener los productos: ${error}`);
    res.status(500).send({ error: "Error al obtener los productos" });
  }
});

router.get("/:productId", async (req, res) => {
  const id = parseInt(req.params.productId);

  if (id) {
    try {
      const foundProduct = await PM.getProductById(id);

      if (foundProduct) {
        res.send(foundProduct);
      } else {
        res.status(404).send({ error: "Producto no encontrado" }); // Envio respuesta 404 si el producto no se encuentra
      }
    } catch (error) {
      console.error(`Error al obtener el producto: ${error}`);
      res.status(500).send({ error: "Error al obtener el producto" });
    }
  }
});

//Rutas POST
router.post("/", async (req, res) => {
  const { title, description, code, price, stock, category /*thumbnails*/ } =
    req.body;

  if (!title || !description || !code || !price || !stock || !category)
    return res
      .status(400)
      .send({ error: "Faltan datos para crear el producto!" });

  const newProduct = {
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    // thumbnails,
  };
  await PM.addProduct(newProduct);
  res.status(201).send({ message: "Producto creado correctamente!" });
});

router.put("/:productId", async (req, res) => {
  const id = parseInt(req.params.productId);
  const { title, description, code, price, stock, category /*thumbnails*/ } =
    req.body;

  const newProduct = {
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    // thumbnails,
  };

  await PM.updateProduct(id, newProduct);
  res.status(201).send({ message: "Producto modificado correctamente!" });
});

router.delete("/:productId", async (req, res) => {
  const id = parseInt(req.params.productId);

  await PM.deleteProduct(id);

  res.status(200).send({message: "Producto eliminado correctamente"});
});

export default router;
