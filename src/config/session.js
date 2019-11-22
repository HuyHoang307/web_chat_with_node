import session from "express-session";
import connectMongo from "connect-mongo";

let MongoStore = connectMongo(session);
/**
 * This variable is where save session
 */
let sesionStore = new MongoStore({
  url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoReconnect: true,
  //autoRemove: "native"
})
/**
 * config sesion for app
 * @param app from exactly express modules
 */
let config = (app) => {
  app.use(session({
    key: process.env.SESSION_KEY,
    secret:process.env.SESSION_SECRET, 
    store: sesionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000* 60 * 60 * 24
    }
  }));
}
module.exports = {
  config: config,
  sesionStore: sesionStore
};