'use strict';


const express = require('express');
const morgan = require('morgan');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const users = [];
const connections = []

//*** middleware ***
app.use(morgan('common'));
app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.send('<h1>Hello World</h1>');
});

//***socket***///
io.on('connection', (socket) =>  {
	connections.push(socket);
	console.log(`Connected: ${connections.length} sockets connected`);

	//***Disconnect***//
	socket.on('disconnect',(data) => {
		users.splice(users.indexOf(socket.username), 1);
		console.log(`Disconnect user: ${socket.username}`);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log(`Disconnect: ${connections.length} socket connected`);
	});

	//***Send Message***///
	socket.on('send message', (data) => {
		io.sockets.emit('new message', {msg: data, user:socket.username})
	});

	//***New User***///
	socket.on('new user', (data, callback) =>{
		callback(true);
		socket.username = data;
		console.log(`New user join: ${socket.username}`);
		users.push(socket.username);
		updateUsernames();
	});

	const updateUsernames = () => {
		io.sockets.emit('get users', users);
	}
});

//***run server****
server.listen(process.env.Port || 8000, () => {
	console.log('Server is connected to port 8000');
});