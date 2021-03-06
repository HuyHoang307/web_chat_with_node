import express from "express";
import {home, auth, user, contact, message, groupChat} from "./../controllers/index";
import {authValid, contactValid, messageValid, groupChatValid} from "./../validation/index";
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

  router.put("/user/update-avatar", auth.checkLoggedIn, user.updateAvatar);

  router.get("/contact/find-users/:keyword",auth.checkLoggedIn,contactValid.findUsersContact, contact.findUsersContact);
  router.post("/contact/add-new",auth.checkLoggedIn, contact.addNew);
  router.delete("/contact/remove-contact",auth.checkLoggedIn, contact.removeContact);
  router.delete("/contact/remove-request-contact-sent",auth.checkLoggedIn, contact.removeRequestContactSent);
  router.delete("/contact/remove-request-contact-received",auth.checkLoggedIn, contact.removeRequestContactReceived);
  router.put("/contact/approve-request-contact-received",auth.checkLoggedIn, contact.approveRequestContactReceived);
  router.get("/contact/search-friends/:keyword",auth.checkLoggedIn,contactValid.searchFriends, contact.searchFriends);

  router.post("/message/add-new-text-emoji",auth.checkLoggedIn, messageValid.checkMessageLength, message.addNewTextEmoji);
  router.post("/message/add-new-image",auth.checkLoggedIn, message.addNewImage);

  router.post("/group-chat/add-new",auth.checkLoggedIn,groupChatValid.addNewGroup, groupChat.addNewGroup);

  return app.use("/", router);
};

module.exports = initRoutes;
