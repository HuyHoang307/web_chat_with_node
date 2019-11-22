/**
 * 
 * @param {*} io from socket 
 */
let addNewContact = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    let currentUserId = socket.request.user._id;

    if(clients[currentUserId]){
      clients[currentUserId].push(socket.id);
    }else{
      clients[currentUserId]=[socket.id];
    }    
    socket.on("add-new-contact", (data) => {
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar
      };

      //emit notification
      if (clients[data.contactId]) {
        clients[data.contactId].forEach(socketId => {
          io.sockets.connected[socketId].emit("response-add-new-contact", currentUser);
        });
      }
      
    });

    socket.on("disconnect", () => {
      clients[currentUserId] = clients[currentUserId].filter(socketId => {
        return socketId !== socket.id;
      });

      if (!clients[currentUserId].length) {
        delete clients[currentUserId];
      }
    });   
  });
}

module.exports = addNewContact;