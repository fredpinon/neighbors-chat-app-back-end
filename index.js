const express = require('express');
const app = express();

const cors = require('cors');
const corsOptions = {origin: ['http://localhost:3000']};
app.use(cors(corsOptions))

const bodyParser = require('body-parser');
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

const router = require('./router.js');
app.use(router);

app.listen(4000, () => console.log('server is running'));
