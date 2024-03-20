//ROUTER
import { Router } from "express";

//MULTER
import { uploader } from "../utils.js";

//PRODUCT MANAGER
import ProductManager from "../ProductManager.js";

//INICIO ROUTER
const router = Router();

//INICIO PRODUCT MANAGER
const PM = new ProductManager("data/productos.json");

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

//Ruta POST
router.post("/", uploader.array("thumbnails"), async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;
  if (!req.files) {
    return res
      .status(400)
      .send({ error: "Se necesita cargar una imagen para crear un producto" });
  }

  if (!title || !code || !price || !stock || !category)
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
    thumbnails: req.files.map(file => file.path),
  };
  await PM.addProduct(newProduct);
  res.status(201).send({ message: "Producto creado correctamente!" });
});

//Ruta PUT
router.put("/:productId", async (req, res) => {
  const id = parseInt(req.params.productId);
  const { title, description, code, price, stock, category } =
    req.body;

  const newProduct = {
    title,
    description,
    code,
    price,
    stock,
    category,
  };

  await PM.updateProduct(id, newProduct);
  res.status(201).send({ message: "Producto modificado correctamente!" });
});

//Ruta DELETE
router.delete("/:productId", async (req, res) => {
  const id = parseInt(req.params.productId);

  await PM.deleteProduct(id);

  res.status(200).send({ message: "Producto eliminado correctamente" });
});

export default router;
