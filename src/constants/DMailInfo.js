import __dirname from "../utils.js";

export default {
  welcome: {
    subject: "¡Bienvenido!",
    attachments: [
      {
        filename: "id2.png",
        path: `${__dirname}/public/img/id2.png`,
        cid: "gmail",
      },
    ],
  },

  passwordrestore: {
    subject: "Restablecimiento de contraseña",
    attachments: [
      {
        filename: "id2.png",
        path: `${__dirname}/public/img/id2.png`,
        cid: "gmail",
      },
    ],
  },

  order: {
    subject: "Tu pedido ha sido procesado",
    attachments: [
      {
        filename: "id2.png",
        path: `${__dirname}/public/img/id2.png`,
        cid: "gmail",
      },
    ],
  },
};
