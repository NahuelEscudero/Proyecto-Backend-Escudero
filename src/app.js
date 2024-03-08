//EXPRESS
import express from "express";

//PRODUCT MANAGER
import ProductManager from "./ProductManager.js";

const app = express(); //app tiene todas las funcionalidades de express
const PORT = 8080; //defino puerto
const PM = new ProductManager("./productos.json"); //instancio Product Manager

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
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

app.get("/:productId", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto http://localhost:${PORT}`);
});
