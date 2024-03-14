//FILE SYSTEM
import fs from "fs";

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
      if (error.code === ("ENOENT")) {
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

  async createCart() {
    const carts = await this.getCarts();

    try {
      const newId = carts.length > 0 ? Math.max(...carts.map((cart) => cart.id)) + 1 : 1;

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

  //Obtengo carrito por ID
  async getCartById(id) {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === id); //Obtengo carrito por id
    if (!cart) {
      console.error("Carrito no encontrado");
      return;
    } else {
      return cart.products;
    }
  }

  //Actualizo carrito en carts.json pasando id y carrito por parametro
  async updateCart(id, cart) {
    try {
      const cartsJson = await this.getCarts(); //Recibo archivo con los carritos

      const index = cartsJson.findIndex((cart) => cart.id === id); //Busco el índice en el array del carrito que coincide con el id que paso por parámetro

      if (index != -1) {
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