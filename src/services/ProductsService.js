export default class ProductsService {
  constructor(manager) {
    this.manager = manager;
  }
  getProducts = () => {
    return this.manager.getProducts(products);
  };

  paginateProducts = () => {
    return this.manager.paginateProducts(products, paginateOptions);
  };

  getProductBy = () => {
    return this.manager.getProductBy(products);
  };

  createProduct = () => {
    return this.manager.createProduct(products);
  };

  updateProduct = () => {
    return this.manager.updateProduct(id, products);
  };

  deleteProduct = () => {
    return this.manager.deleteProduct(id);
  };
}
