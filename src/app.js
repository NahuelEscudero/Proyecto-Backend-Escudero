//EXPRESS
import express from 'express';

//PRODUCT MANAGER
import { ProductManager } from './ProductManager.js';


const app = express(); //app tiene todas las funcionalidades de express
const PORT = 8080; //defino puerto 
const PM = new ProductManager(); //instancio Product Manager

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", async (req, res) => {
    try {
        const products = await PM.getProducts();
        const productsStringify = JSON.stringify(products);
        res.send({ productsStringify });
    } catch (error) {
        console.error(`Error al obtener los productos: ${error}`);
        res.status(500).send({ error: 'Error al obtener los productos' });
    }
});



app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto http://localhost:${PORT}`);
});