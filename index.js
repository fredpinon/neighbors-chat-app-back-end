const express = require('express');
const app = express();
const Server = require('http').Server;
const server = Server(app);
const io = require('socket.io')(server);

const bodyParser = require('body-parser');
const cors = require('cors');

const socketEvents = require('./socketEvents');
const router = require('./router.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(async (req, res, next) => {;
  let token = req.headers.token;
  if (!token) {
    req.token = undefined
    return await next();
  } else req.token = token;
  return await next();
});

const corsOptions = {origin: ['http://localhost:3000']};

app.use(cors(corsOptions));

app.use(router);

socketEvents(io);
server.listen(4000, () => console.log('server running'));
