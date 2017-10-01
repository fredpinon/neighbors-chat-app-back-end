const userModel = require('./models/user.model');
const chatRoom = require('./models/chatRoom.model');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('SOCKET__CONNECT', async (data) => {
      const { address } = data.details;
      socket.join(address);
      const users = await userModel.getAllUsers(address);
      socket.broadcast.to(address).emit('ACTION', {
        type: 'NEW_USER_CONNECTED',
        data
      });
      socket.broadcast.to(address).emit('ACTION', {
        type: 'USER_LIST_STATUS_CHANGE',
        data: users
      });
    })
    socket.on('SOCKET__DISCONNECT', async (address) => {
      const users = await userModel.getAllUsers(address);
      socket.broadcast.to(address).emit('ACTION', {
        type: 'USER_LIST_STATUS_CHANGE',
        data: users
      });
    })
    socket.on('NEW__MESSAGE', async (data) => {
      const conversation = await chatRoom.createNewMessage(data);
      socket.broadcast.to(data.address).emit('ACTION', {
        type: 'REFRESH_MESSAGES',
        data: conversation
      });
      socket.emit('ACTION', {
        type: 'GET-MESSAGES',
        data: conversation
      });
    })
    // socket.on('is-typing', async (info) => {
    //   const email = info.email;
    //   const typingUser = `${info.firstname} ${info.lastname}`;
    //   socket.broadcast.to(info.address).emit('action', {
    //     type: 'USER-TYPING',
    //     data: {
    //       typingUser,
    //       email,
    //     }
    //   });
    // })
    // socket.on('stoped-typing', async (info) => {
    //   const email = info.email;
    //   const typingUser = `${info.firstname} ${info.lastname}`;
    //   socket.broadcast.to(info.address).emit('action', {
    //     type: 'USER-STOPED-TYPING',
    //     data: {
    //       typingUser,
    //       email,
    //     }
    //   });
    // })
    // socket.on('get-messages', async (address) => {
    //   const conversation = await chatRoom.getMessages(address);
    //   socket.emit('action', {
    //     type: 'GET-MESSAGES',
    //     data: conversation
    //   });
    // })
  });
}
