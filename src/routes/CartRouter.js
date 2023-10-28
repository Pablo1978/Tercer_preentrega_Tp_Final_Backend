import BaseRouter from "./BaseRouter.js";
import cartsController from "../controllers/carts.controller.js";

class CartRouter extends BaseRouter {
  init() {
    this.get("/:cid", ["USER"], cartsController.getCartById);

    this.post("/", ["USER"], cartsController.createCart);

    this.put(":cid/products/:pid", ["NO_AUTH"], cartsController.updateCart);

    this.put(
      "/products/:pid",
      ["USER", "ADMIN"],
      cartsController.updateCartUser
    );

    this.delete("/:cid", ["ADMIN"], cartsController.deleteCart);
  }
}
const cartsRouter = new CartRouter();

export default cartsRouter.getRouter();
