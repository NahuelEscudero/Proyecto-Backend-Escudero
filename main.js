class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    // Valido que todos los campos sean obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    // Valido que no se repita el campo "code"
    if (this.products.some(product => product.code === code)) {
      console.error("El código de producto ya está en uso");
      return;
    }

    const product = {
      id: this.nextId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };

    this.products.push(product);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      console.error("Producto no encontrado");
    }

    return product;
  }
}

//Creo instancia del manejador de productos
const manager = new ProductManager();

//LLamo a getProducts
console.log(manager.getProducts());

//Agrego productos con addProduct;
manager.addProduct("Remera", "REMERA EFECTO INVERNADERO [ NEVADO ]", 40000, "https://firebasestorage.googleapis.com/v0/b/insidia-ind.appspot.com/o/remeras%2FREMERA%20EFECTO%20INVERNADERO%20%5B%20NEVADO%20%5D.png?alt=media&token=5fcd5ef4-cb88-4433-96b4-44c99e721f37", "R1", 10);

manager.addProduct("Remera", "REMERA ENERGÍAS RENOVABLES [ NEGRO ]", 38000, "https://firebasestorage.googleapis.com/v0/b/insidia-ind.appspot.com/o/remeras%2FREMERA%20ENERG%C3%8DAS%20RENOVABLES%20%5B%20NEGRO%20%5D.png?alt=media&token=8e3be9bf-e046-4a3c-843a-99ba97d1b2af", "R2", 15);

manager.addProduct("Remera", "REMERA SUNWAVES [ LS08 ]", 45000, "https://firebasestorage.googleapis.com/v0/b/insidia-ind.appspot.com/o/remeras%2FREMERA%20SUNWAVES%20%5B%20LS08%20%5D.png?alt=media&token=494f2bbc-6806-4467-81a8-db7e367fde33", "R3", 12);

manager.addProduct("Remera", "REMERA SUNWAVES [ LS15 ]", 35000, "https://firebasestorage.googleapis.com/v0/b/insidia-ind.appspot.com/o/remeras%2FREMERA%20SUNWAVES%20%5B%20LS15%20%5D.png?alt=media&token=7b4d7c6e-a310-4f6a-8be5-2e4e44cde4c0", "R4", 8);

//Vuelvo a llamar a getProducts, esta vez con productos dentro
console.log(manager.getProducts());

//Agrego el 4to producto otra vez, lo que devolverá un error
manager.addProduct("Remera", "REMERA SUNWAVES [ LS15 ]", 35000, "https://firebasestorage.googleapis.com/v0/b/insidia-ind.appspot.com/o/remeras%2FREMERA%20SUNWAVES%20%5B%20LS15%20%5D.png?alt=media&token=7b4d7c6e-a310-4f6a-8be5-2e4e44cde4c0", "R4", 8);

//Busco producto 1
console.log(manager.getProductById(1));

//Busco producto inexistente
console.log(manager.getProductById(5));