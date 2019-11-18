import express from "express";
import {home, auth} from "./../controllers/index";
import {authValid} from "./../validation/index";
import passport from "passport";
import initPassprotLocal from "./../controllers/passportController/local";
import initPassprotFacebook from "./../controllers/passportController/facebook";
import initPassprotGoogle from "./../controllers/passportController/google";

//init passport local
initPassprotLocal();
initPassprotFacebook();
initPassprotGoogle();

let router = express.Router();

/**
 * Init all routes
 * @param app from exactly express modules
 */
let initRoutes = (app) => {
  router.get("/login-register",auth.checkLoggedOut, auth.getLoginRegister);
  router.post("/register",auth.checkLoggedOut, authValid.register ,auth.postRegister);
  router.get("/verify/:token", auth.checkLoggedOut, auth.verifyAccount);

  router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash: true
  }));

  router.get("/auth/facebook", auth.checkLoggedOut, passport.authenticate("facebook", {scope: ["email"]}));
  router.get("/auth/facebook/callback", auth.checkLoggedOut, passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  router.get("/auth/google", auth.checkLoggedOut, passport.authenticate("google", {scope: ["email"]}));
  router.get("/auth/google/callback", auth.checkLoggedOut, passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  router.get("/",auth.checkLoggedIn, home.getHome);
  router.get("/logout",auth.checkLoggedIn, auth.getLogout);

  return app.use("/", router);
};

module.exports = initRoutes;
