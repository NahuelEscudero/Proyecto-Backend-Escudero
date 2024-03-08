//FILE SYSTEM
import fs from "fs";

//CLASE: MANEJADOR DE PRODUCTOS
export class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.nextId = 1;
  }

  //Escribir archivos con fs
  async writeFile(path, prods) {
    await fs.promises.writeFile(path, JSON.stringify(prods, null, "\t"));
  }

  //Leer archivos con fs
  async readFile(path) {
    const productos = await fs.promises.readFile(path, "utf-8");
    const prodsParse = JSON.parse(productos);

    return prodsParse; //Retorno productos del archivo
  }

  //Obtengo productos
  async getProducts() {
    try {
      // Intento leer el archivo
      const prodsJson = await this.readFile(this.path);
      return prodsJson; //Retorno productos del archivo
    } catch (error) {
      if (error.code === "ENOENT") {
        // Si el archivo no existe, creo un array vacío y lo escribo en el archivo
        await this.writeFile(this.path, this.products);
        console.log("Archivo de productos creado");

        return [];
      } else {
        console.error(`Error al leer el archivo : ${error}`);
        return [];
      }
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      // Valido que todos los campos sean obligatorios
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.error("Todos los campos son obligatorios");
        return;
      }

      // Valido que no se repita el campo "code"
      if (await this.getProducts().some((product) => product.code === code)) {
        console.error("El código de producto ya está en uso");
        return;
      }

      //Genero base del producto
      const product = {
        id: this.nextId++,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      this.products.push(product); //Agrego producto recibido por parametro al array en memoria

      await this.writeFile(this.path, this.products); //Escribo archivo con los productos almacenados en memoria

      return product;
    } catch (error) {
      console.error(`Error al escribir el archivo : ${error}`);
    }
  }

  //Obtengo procucto por ID
  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((product) => product.id === id); //Obtengo producto por id

    if (!product) {
      console.error("Producto no encontrado");
      return;
    } else {
      return product;
    }
  }

  //Actualizo producto en productos.json pasando id y producto por parametro
  async updateProduct(id, product) {
    try {
      const prodsJson = await this.getProducts(); //Recibo archivo con los productos

      const index = prodsJson.findIndex((product) => product.id === id); //Busco el índice en el array del producto que coincide con el id que paso por parámetro

      if (index != -1) {
        prodsJson[index] = { ...prodsJson[index], ...product }; //Actualizo el producto con el que se le pasa por parametro

        await this.writeFile(this.path, prodsJson); //Escribo el archivo modificado otra vez

        console.log("Producto modificado con exito");
      } else {
        console.error("Producto no modificado (no se encontró)");
      }
    } catch (error) {
      console.error(`Error al actualizar el producto : ${error}`);
    }
  }

  //Elimino producto obtenido por id de productos.json
  async deleteProduct(id) {
    try {
      const prodsJson = await this.readFile(this.path); //Recibo archivo con los productos

      const index = prodsJson.findIndex((product) => product.id === id); //Busco el índice en el array del producto que coincide con el id que paso por parámetro

      if (index !== -1) {
        prodsJson.splice(index, 1); // Elimino el producto del array
        await this.writeFile(this.path, prodsJson); // Escribo el array actualizado al archivo

        console.log("Producto eliminado correctamente");
      } else {
        console.error("Producto no encontrado");
      }
    } catch (error) {
      console.error(`No se pudo eliminar el producto: ${error}`);
    }
  }
}


const PM = new ProductManager("../productos.json");

const run = async () => {
  console.log(await PM.getProducts());
}

run();