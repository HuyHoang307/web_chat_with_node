import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param {*} io from socket 
 */
let userOnlineOffline = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);    
    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });
    
  let listUserOnline = Object.keys(clients);
    //step1: Emit to user after login or f5 web page
    socket.emit("server-send-list-user-online", listUserOnline);

    //step2: Emit to all another users when has new user online
    socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);

    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
      clients = removeSocketIdFromArray(clients, group._id, socket);
      });
    //step3: Emit to all another users when has new user offline
    socket.broadcast.emit("server-send-when-new-user-offline", socket.request.user._id);
    });       
  });
}

module.exports = userOnlineOffline;