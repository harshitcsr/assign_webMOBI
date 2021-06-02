const express = require('express');
const app = express();

const socket = require("socket.io");
var http = require('http').Server(app);
var io = require('socket.io')(http);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

var path = require('path');

const ejs = require('ejs');
app.set('view engine', 'ejs')


var data = { username: ['Amit', 'Mayank', 'Akash', 'Sachin', 'Harshit'] };
app.get('/', (req, res) => {
   res.render('home', { data: data });
});

app.get('/users', (req, res) => {
   res.render('users', { data: data });
})
app.post('/create-user', (req, res) => {
   console.log("User name" + req.body.username);
   res.sendfile(__dirname + '/views/home.ejs');
});

users = [];
io.on('connection', function (socket) {
   console.log('A user connected');
   socket.on('setUsername', function (data) {
      console.log(data);

      if (users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data);
         socket.emit('userSet', { username: data });
      }
   });

   socket.on('msg', function (data) {
      io.sockets.emit('newmsg', data);
   })
});
http.listen(8888, function () {
   console.log('listening on localhost:8888');
});


