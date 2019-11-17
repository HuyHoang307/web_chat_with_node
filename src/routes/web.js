import express from "express";
import {home, auth} from "./../controllers/index";
import {authValid} from "./../validation/index";
import passport from "passport";
import initPassprotLocal from "./../controllers/passportController/local";

//init passport local
initPassprotLocal();

let router = express.Router();

/**
 * Init all routes
 * @param app from exactly express modules
 */
let initRoutes = (app) => {
  router.get("/", home.getHome);
  router.get("/login-register", auth.getLoginRegister);
  router.post("/register",authValid.register ,auth.postRegister);
  router.get("/verify/:token", auth.verifyAccount);

  router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash: true
  }));

  return app.use("/", router);
};

module.exports = initRoutes;
