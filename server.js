'use strict';


const express = require('express');
const morgan = require('morgan');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
	res.send('<h1>Hello World</h1>');
});

io.on('connection', function(){ /* … */ });


server.listen(8000, () => {
	console.log('Server is connected to port 8000');
});