import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParser from "cookie-parser";
import configSocketIo from "./config/socketio";
import events from "events";
import * as configApp from "./config/app";

//Init app
let app = express();

//set max connecting listener
events.EventEmitter.defaultMaxListeners = configApp.app.max_event_listeners;

//Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

//connect to mongo
ConnectDB();

//config session
session.config(app);

//config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

//enable flash message
app.use(connectFlash());

//Use cookie parser
app.use(cookieParser())

//config passprot js
app.use(passport.initialize());
app.use(passport.session());

//init routes
initRoutes(app);

// config for socket.io
configSocketIo(io, cookieParser, session.sesionStore);

//Init all socket
initSockets(io);

server.listen(process.env.APP_PORT, process.env.APP_HOST, ()=>{
  console.log(`Hello Hoang, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}`);

// import pem from "pem";
// import https from "https";

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }
//   let app = express();
// //connect to mongo
// ConnectDB();

// //config session
// configSession(app);

// //config view engine
// configViewEngine(app);

// // Enable post data for request
// app.use(bodyParser.urlencoded({extended: true}));

// //enable flash message
// app.use(connectFlash());

// //config passprot js
// app.use(passport.initialize());
// app.use(passport.session());

// //init routes
// initRoutes(app);

//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, process.env.APP_HOST, ()=>{
//     console.log(`Hello Hoang, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}`);
//   })
});


