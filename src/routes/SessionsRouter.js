import jwt from "jsonwebtoken";
import passportCall from "../middlewares/passportCall.js";
import BaseRouter from "./BaseRouter.js";
import config from "../config/config.js";
import { validateJWT } from "../middlewares/jwtExtractor.js";
import authService from "../services/authService.js";
import __dirname__ from "../utils.js";
import MailingService from "../services/MailingService.js";
import TwilioService from "../services/TwilioService.js";

class SessionsRouter extends BaseRouter {
  init() {
    this.post(
      "/register",
      ["NO_AUTH"],
      passportCall("register", { strategyType: "LOCALS" }),
      async (req, res) => {
        res.clearCookie("cart");
        return res.sendSuccess("Registered");
      }
    );
    
    this.post(
      "/login",
      ["NO_AUTH"],
      passportCall("login", { strategyType: "LOCALS" }),
      async (req, res) => {
        const tokenizedUser = {
          name: `${req.user.firstName} ${req.user.lastName}`,
          id: req.user._id,
          role: req.user.role,
          cart: req.user.cart,
          email: req.user.email,
        };
        const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
          expiresIn: "1d",
        });
        res.cookie(config.jwt.COOKIE, token);
        res.clearCookie("cart");
        return res.sendSuccess("Logged In");
      }
    );

    this.get("/logout", ["AUTH"], async (req, res) => {
      res.clearCookie(config.jwt.COOKIE);
      return res.sendSuccess("Logged Out");
    });

    this.get("/current", ["AUTH"], async (req, res) => {
      return res.sendSuccessWithPayload(req.user);
    });

    this.get(
      "/github",
      ["NO_AUTH"],
      passportCall("github", { strategyType: "GITHUB" }),
      async (req, res) => {}
    );

    this.get(
      "/githubcallback",
      ["NO_AUTH"],
      passportCall("github", { strategyType: "GITHUB" }),
      async (req, res) => {
        try {
          const { firstName, lastName, _id, role, cart, email } = req.user;

          const tokenizedUser = {
            name: `${firstName} ${lastName}`,
            id: _id,
            role: role,
            cart: cart,
            email: email,
          };

          const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
            expiresIn: "1d",
          });

          res.cookie(config.jwt.COOKIE, token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 99999999,
          });

          res.clearCookie("cart");

          return res.redirect("/profile");
        } catch (error) {
          console.error("Error in GitHub callback:", error);
          return res.sendError("An error occurred during login");
        }
      }
    );
    this.get(
      "/google",
      ["NO_AUTH"],
      passportCall("google", {
        scope: ["profile", "email"],
        strategyType: "GOOGLE",
      }),
      async (req, res) => {}
    );

    this.get(
      "/googlecallback",
      ["NO_AUTH"],
      passportCall("google", { strategyType: "OAUTH" }),
      async (req, res) => {
        try {
          const { firstName, lastName, _id, role, cart, email } = req.user;
          const tokenizedUser = {
            name: `${firstName} ${lastName}`,
            id: _id,
            role: role,
            cart: cart,
            email: email,
          };
          const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
            expiresIn: "1d",
          });
          res.cookie(config.jwt.COOKIE, token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 99999999,
          });
          res.clearCookie("cart");
          return res.redirect("/profile");
        } catch (error) {
          console.error("Error in Google callback:", error);
          return res.sendError("An error occurred during login");
        }
      }
    );

    this.get("/authFail", async (req, res) => {
      req.logger.error(
        `[${new Date().toISOString()}] Error: Hubo un fallo en la autenticacion del usuario`
      );
      res.status(401).send({ status: "error" });
    });
    this.get("/mails", ["AUTH"], async (req, res) => {
      const mailService = new MailingService();

      const mailRequest = {
        from: "Acuario Pablo´s <pabloeltano78.pf@gmail.com>",
        to: " pabloeltano78.pf@gmail.com",
        subject: "Probando NodeMailer",
        html: `
                <div>
                    <h1>Compra realizada</h1>
                    <br/>
                    <p>Esto es una prueba</p>
                    <br/>
                    <img src="cid:mailing"/>
                    </div>
      `,
        attachments: [
          {
            filename: "Acuario",
            path: `./src/public/img/id10.png`,
            cid: "mailing",
          },
        ],
      };

      const mailResult = await mailService.sendMail(mailRequest);
      console.log(mailResult);
      return res.send({
        status: "success",
        message: "Mail sent",
        payload: mailResult,
      });
    });

    this.get("/twilio", ["AUTH"], async (req, res) => {
      const twilioService = new TwilioService();

      const twilioResult = twilioService.sendSMS(
        "5491168773500",
        "Mensaje de prueba"
      );
      console.log(twilioResult);
      return res.send({
        status: "success",
        message: "SMS sent",
        payload: twilioResult,
      });
    });
  }
}

const sessionsRouter = new SessionsRouter();

export default sessionsRouter.getRouter();

