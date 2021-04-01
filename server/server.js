const express = require('express');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const socketManager = require('./socket/socketManager');
const morgan = require('morgan');
const fs = require('fs');

const { ExpressPeerServer } = require('peer')

const app = express();

const server = http.createServer(app);

const io = socketio(server).sockets;

app.use(express.json());

app.use(bodyParser.json({ type: 'application/*+json' }));

const customGenrationFunction = () => {
  return(
    Math.random().toString(36) + "0000000000000"
  ).substr(2,16);
}

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/',
  generateClientId: customGenrationFunction,
  ssl: {
    key: fs.readFileSync('./config/cert.key'),
    cert: fs.readFileSync('./config/cert.crt')
  },
  proxied: true
});

app.use('/mypeer', peerServer);

app.use('/api/v1', require('./routes/firebase'));
app.use('/api/v1/mail', require('./routes/email'));

io.on('connection',socketManager);

io.on('disconnect', function(socket){
  console.log('User with socketId %s disconnected', socket.id);
});

// const port = process.env.PORT || 5000;

// server.listen(port, ()=>console.log(`server is running on port ${port}`));

// start http server
const port = process.env.PORT || 5000;
// let server = http.createServer(app).listen(port);
 
// start https server
let sslOptions = {
   key: fs.readFileSync('./config/cert.key'),
   cert: fs.readFileSync('./config/cert.crt')
};
 
let serverHttps = https.createServer(sslOptions, app);
serverHttps.listen(port, () => {
    console.log(`Clashin Server is listening on port ${port}`);
});