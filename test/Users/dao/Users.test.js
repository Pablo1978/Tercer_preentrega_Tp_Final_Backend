import mongoose from "mongoose";
import UsersDao from "../../../src/dao/mongo/UsersDao.js";
import { strict as assert } from "assert";

mongoose.connect(
  "mongodb+srv://pabloeltano:tier26@cluster0.6a9bfhe.mongodb.net/ecommerce?retryWrites=true&w=majorit"
);

describe("test unitarios para DAO de usuarios", function () {
  this.timeout(15000);
  before(function () {
    this.usersDao = new UsersDao();
  });

  it("El DAO debe poder devolver a los usuarios en formato de arreglo", async function () {
    const result = await this.usersDao.getUsers();
    assert.equal(Array.isArray(result), true);
  });

  it("El DAO debe poder devolver a un usuario en formato de objeto", async function () {
    const result = await this.usersDao.getUserBy({
      email: "pabloeltano78.pf@gmail.com",
    });
    assert.equal(typeof result, "object");
  });

  it("El DAO debe poder crear un usuario", async function () {
    const mockUser = {
      firstName: "Pablo",
      lastName: "Franco",
      email: "pablofranco@gmail.com",
      password: "123",
    };
    const result = await this.usersDao.createUser(mockUser);
    console.log(`El Id del usuario creado es: ${result._id}`);
    assert.ok(result._id);
  });
});
