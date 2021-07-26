const path = require('path')
const usernameGen = require("username-generator");
const express = require('express')
const app = express()
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
app.use(express.static(path.join(__dirname, 'client/build')));
app.use((req, res, next) => {
  if (req.header('x-fowarded-proto') !== 'https')
    res.redirect(`https://${req.header('host')}${req.url}`)
  else
    next();
})

const SOCKET_EVENT = {
    CONNECTED: "connected",
    DISCONNECTED: "disconnect",
    USERS_LIST: "users_list",
    REQUEST_SENT: "request_sent",
    REQUEST_ACCEPTED: "request_accepted",
    REQUEST_REJECTED: "request_rejected",
    SEND_REQUEST: "send_request",
    ACCEPT_REQUEST: "accept_request",
    REJECT_REQUEST: "reject_request",
};

const users = {};

// converts users into a list
const usersList = (usersObj)=>{
	const list = [];
	Object.keys(usersObj).forEach(username=>{
		list.push({username, timestamp:usersObj[username].timestamp});
	})
	return list;
};

// console log with timestamp
function Log(message, data){
    console.log((new Date()).toISOString(),message, data);
};


io.on("connection", (socket) => {
    //generate username against a socket connection and store it
    const username = usernameGen.generateUsername("-");
    if (!users[username]) {
      users[username] = { id: socket.id, timestamp: new Date().toISOString() };
    }
    Log(SOCKET_EVENT.CONNECTED, username);
    // send back username
    socket.emit(SOCKET_EVENT.CONNECTED, username);
    // send online users list
    io.sockets.emit(SOCKET_EVENT.USERS_LIST, usersList(users) );
  
    socket.on(SOCKET_EVENT.DISCONNECTED, () => {
      // remove user from the list
      delete users[username];
      // send current users list
      io.sockets.emit(SOCKET_EVENT.USERS_LIST, usersList(users) );
      Log(SOCKET_EVENT.DISCONNECTED, username);
    });
  
    socket.on(SOCKET_EVENT.SEND_REQUEST, ({ username, signal, to }) => {
      // tell user that a request has been sent
      io.to(users[to].id).emit(SOCKET_EVENT.REQUEST_SENT, {
        signal,
        username,
      });
      Log(SOCKET_EVENT.SEND_REQUEST, username);
    });
  
    socket.on(SOCKET_EVENT.ACCEPT_REQUEST, ({ signal, to }) => {
      // tell user the request has been accepted
      io.to(users[to].id).emit(SOCKET_EVENT.REQUEST_ACCEPTED, {signal});
      Log(SOCKET_EVENT.ACCEPT_REQUEST, username);
    });
  
    socket.on(SOCKET_EVENT.REJECT_REQUEST, ({ to }) => {
      // tell user the request has been rejected
      io.to(users[to].id).emit(SOCKET_EVENT.REQUEST_REJECTED);
      Log(SOCKET_EVENT.REJECT_REQUEST, username);
    });
});
const port = process.env.PORT || 7000;
http.listen(port);
Log("server listening on port", port);