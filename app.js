var	app = require('express')(),
		server = require('http').createServer(app),
		io = require('socket.io').listen(server),
		ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

//tableau des todo
global.todolist = [];

// Chargement de la page index.html
app.get('/', function (req, res) {
	res.render('index.ejs', {todolist: global.todolist});
});


io.sockets.on('connection', function (socket) {
	// Quand on nous informe d'un nouveau todo
	socket.on('newtodo', function (todo) {
		todo = ent.encode(todo); //on securise la chaine
		index = global.todolist.length; // on prend un nouvelle index
		global.todolist[index] = todo;  // on enregistre le todo
		socket.emit('newtodo' , {index:index, todo: todo}); //on se retourne le todo et l'index
		socket.broadcast.emit('newtodo',  {index:index, todo: todo}); // on retourne le todo et l'index au autres
	});
	// Quand on nous informe de la suppression d'un todo
	socket.on('suptodo',function (index){
		delete global.todolist[index]; // on supprime le todo de la liste
		socket.broadcast.emit('suptodo',index); // on informe les autres
	});
});

server.listen(8080);
