const fs = require("fs");

class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      // Valido que todos los campos sean obligatorios
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.error("Todos los campos son obligatorios");
        return;
      }

      // Valido que no se repita el campo "code"
      if (this.products.some((product) => product.code === code)) {
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

      this.products.push(product);

      const prodsInJsonString = JSON.stringify(this.products);
      const productsPath = "./productos.json";

      await fs.promises.writeFile(productsPath, prodsInJsonString);

      const prods = await fs.promises.readFile(productsPath, "utf-8");

      return prods;
    } catch (error) {
      console.error(`Error al escribir el archivo : ${error}`);
    }
  }

  //Obtengo productos
  async getProducts() {
    const productsPath = "./productos.json";

    try {
      // Intento leer el archivo
      const prodsJsonString = await fs.promises.readFile(productsPath, "utf-8");
      const prodsJsonParse = JSON.parse(prodsJsonString);

      return prodsJsonParse;
    } catch (error) {
      if (error.code === "ENOENT") {
        // Si el archivo no existe, creo un array vacío y lo escribo en el archivo
        await fs.promises.writeFile(productsPath, JSON.stringify(this.products));
        console.log("Archivo de productos creado");
        return [];
      } else {
        console.error(`Error al leer el archivo : ${error}`);
      }
    }
  }

  //Obtengo procucto por ID
  getProductById(id) {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      console.error("Producto no encontrado");
      return;
    } else {
      return product;
    }
  }

  async updateProduct(id, object) {
    try {
      const prodsJsonString = await fs.promises.readFile(
        "./productos.json",
        "utf-8"
      );
      const prodsJsonParse = JSON.parse(prodsJsonString);
      console.log(prodsJsonParse);

      const index = prodsJsonParse.findIndex((product) => product.id === id);

      if (index != -1) {
        prodsJsonParse[index] = { ...prodsJsonParse[index], ...object };

        await fs.promises.writeFile(
          "./productos.json",
          JSON.stringify(prodsJsonParse, null)
        );
      } else {
        console.error("Producto no modificado (no se encontró)");
      }
    } catch (error) {
      console.error(`Error al actualizar el producto : ${error}`);
    }
  }
}

/* ============================================================================== */

//Creo instancia del manejador de productos
const manager = new ProductManager();

// //LLamo a getProducts
console.log(manager.getProducts()); //[]

//Agrego productos con addProduct;
manager.addProduct(
  "Remera",
  "REMERA EFECTO INVERNADERO [ NEVADO ]",
  40000,
  "https://firebasestorage.googleapis.com/v0/b/insidia-ind.appspot.com/o/remeras%2FREMERA%20EFECTO%20INVERNADERO%20%5B%20NEVADO%20%5D.png?alt=media&token=5fcd5ef4-cb88-4433-96b4-44c99e721f37",
  "R1",
  10
);

manager.addProduct(
  "Remera",
  "REMERA ENERGÍAS RENOVABLES [ NEGRO ]",
  38000,
  "https://firebasestorage.googleapis.com/v0/b/insidia-ind.appspot.com/o/remeras%2FREMERA%20ENERG%C3%8DAS%20RENOVABLES%20%5B%20NEGRO%20%5D.png?alt=media&token=8e3be9bf-e046-4a3c-843a-99ba97d1b2af",
  "R2",
  15
);

manager.addProduct(
  "Remera",
  "REMERA SUNWAVES [ LS08 ]",
  45000,
  "https://firebasestorage.googleapis.com/v0/b/insidia-ind.appspot.com/o/remeras%2FREMERA%20SUNWAVES%20%5B%20LS08%20%5D.png?alt=media&token=494f2bbc-6806-4467-81a8-db7e367fde33",
  "R3",
  12
);

manager.addProduct(
  "Remera",
  "REMERA SUNWAVES [ LS15 ]",
  35000,
  "https://firebasestorage.googleapis.com/v0/b/insidia-ind.appspot.com/o/remeras%2FREMERA%20SUNWAVES%20%5B%20LS15%20%5D.png?alt=media&token=7b4d7c6e-a310-4f6a-8be5-2e4e44cde4c0",
  "R4",
  8
);

//Vuelvo a llamar a getProducts, esta vez con productos dentro
// console.log(manager.getProducts()); //[productos]

//Agrego el 4to producto otra vez, lo que devolverá un error
// manager.addProduct(
//   "Remera",
//   "REMERA SUNWAVES [ LS15 ]",
//   35000,
//   "https://firebasestorage.googleapis.com/v0/b/insidia-ind.appspot.com/o/remeras%2FREMERA%20SUNWAVES%20%5B%20LS15%20%5D.png?alt=media&token=7b4d7c6e-a310-4f6a-8be5-2e4e44cde4c0",
//   "R4",
//   8
// );

//Busco producto 1
// console.log(manager.getProductById(1));

// Busco producto inexistente
// console.log(manager.getProductById(5));

//Modifico producto
// manager.updateProduct(4, {title: "Remera modificada", description: "Remera modificada con updateProduct"});

//Vuelvo a llamar a getProducts, esta vez con productos dentro
// console.log(manager.getProducts()); //[productos]
