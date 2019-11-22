import addNewContact from "./contact/addNewContact";

/**
 * 
 * @param {*} io from socket
 */
let initSockets = (io) => {
  addNewContact(io);
}

module.exports = initSockets;