//FILE SYSTEM
import fs from "fs";

//MANEJADOR DE PRODUCTOS
import ProductManager from "./ProductManager.js";
import { log } from "console";

//Instancio Product Manager
const PM = new ProductManager("productos.json");

//CLASE: MANEJADOR DEL CARRITO
class CartManager {
  constructor(path) {
    this.path = path;
    this.nextId = 1;
  }

  //Escribir archivos con fs
  async writeFile(path, carts) {
    await fs.promises.writeFile(path, JSON.stringify(carts, null, "\t"));
  }

  //Leer archivos con fs
  async readFile(path) {
    const carts = await fs.promises.readFile(path, "utf-8");
    const cartsParse = JSON.parse(carts);

    return cartsParse; //Retorno carritos del archivo
  }

  //Obtengo carritos
  async getCarts() {
    try {
      // Intento leer el archivo
      const cartsJson = await this.readFile(this.path);
      return cartsJson; //Retorno carritos del archivo
    } catch (error) {
      if (error.code === "ENOENT") {
        // Si el archivo no existe, creo un array vacío, lo escribo en el archivo y lo vuelvo a leer
        await this.writeFile(this.path, []);
        console.log("Archivo de carritos creado");

        const carts = await this.readFile(this.path);
        return carts;
      } else {
        console.error(`Error al leer el archivo : ${error}`);
        return [];
      }
    }
  }

  //Creo un carrito nuevo
  async createCart() {
    const carts = await this.getCarts();

    try {
      const newId =
        carts.length > 0 ? Math.max(...carts.map((cart) => cart.id)) + 1 : 1;

      //Genero base del carrito
      const newCart = {
        id: newId,
        products: [],
        // thumbnails,
      };
      carts.push(newCart); //Agrego carrito al array en memoria
      await this.writeFile(this.path, carts); //Escribo archivo con los carritos almacenados en memoria

      return newCart;
    } catch (error) {
      console.error(`Error al escribir el archivo : ${error}`);
    }
  }

  //Agrego producto al carrito
  async addProductToCart(idCart, idProd) {
    //Obtengo carrito/s y producto por id
    let carts = await this.getCarts();
    const cart = await this.getCartById(idCart);
    const product = await PM.getProductById(idProd);

    try {
      if (!product || !product.id) {
        console.error(`Producto con id: ${idProd} no encontrado`);
        return;
      }

      if (!cart) {
        console.error(`Carrito con id: ${idProd} no encontrado`);
        return;
      }

      // Verifico si el producto ya está en el carrito
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === idProd
      );

      if (existingProductIndex !== -1) {
        //Si el producto ya esta en el carrito, aumento la cantidad en 1
        cart.products[existingProductIndex].quantity += 1;
      } else {
        //Si el producto no esta en el carrito, lo agrego con cantidad 1
        cart.products.push({ id: idProd, quantity: 1 });
      }

      //Actualizo el carrito en la lista de carritos
      carts = carts.map((c) => (c.id === idCart ? cart : c));

      //Escribo el archivo con todos los carritos
      await this.writeFile(this.path, carts);
      console.log("Producto agregado al carrito correctamente");
    } catch (error) {
      console.error(`Error al agregar el producto al carrito: ${error}`);
    }
  }

  //Obtengo carrito por ID
  async getCartById(id) {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === id); //Obtengo carrito por id
    if (!cart) {
      console.error("Carrito no encontrado");
      return;
    } else {
      return cart;
    }
  }

  //Actualizo carrito en carts.json pasando id y carrito por parametro
  async updateCart(id, cart) {
    try {
      const cartsJson = await this.getCarts(); //Recibo archivo con los carritos

      const index = cartsJson.findIndex((cart) => cart.id === id); //Busco el índice en el array del carrito que coincide con el id que paso por parámetro

      if (index !== -1) {
        cartsJson[index] = { ...cartsJson[index], ...cart }; //Actualizo el carrito con el que se le pasa por parametro

        await this.writeFile(this.path, cartsJson); //Escribo el archivo modificado otra vez

        console.log("Carrito modificado con exito");
      } else {
        console.error("Carrito no modificado (no se encontró)");
      }
    } catch (error) {
      console.error(`Error al actualizar el carrito : ${error}`);
    }
  }

  //Elimino carrito obtenido por id de carts.json
  async deleteCart(id) {
    try {
      const cartsJson = await this.readFile(this.path); //Recibo archivo con los carritos

      const index = cartsJson.findIndex((cart) => cart.id === id); //Busco el índice en el array del carrito que coincide con el id que paso por parámetro

      if (index !== -1) {
        cartsJson.splice(index, 1); // Elimino el carrito del array
        await this.writeFile(this.path, cartsJson); // Escribo el array actualizado al archivo

        console.log("Carrito eliminado correctamente");
      } else {
        console.error("Carrito no encontrado");
      }
    } catch (error) {
      console.error(`No se pudo eliminar el carrito: ${error}`);
    }
  }
}

export default CartManager;
