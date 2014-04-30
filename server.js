var appPort = process.env.PORT || 1901,
    ip = process.env.IP || '127.0.0.1';


var routes = require('./routes');


var express = require('express'),
    app = express();

var http = require('http'),
    server = http.createServer(app).listen(appPort, ip, function() {
        console.log('Started socketio');
    }),
    io = require('socket.io').listen(server),
    jade = require('jade');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view option', { layout: false });

app.use(express.static(__dirname + '/public'));


app.get('/', routes);
app.get('/about', routes.about);
app.get('/admin', routes.admin);

app.use(function(req, res) {
    res.render('404.jade', {url: req.url});
});


// Config socketio
// io.set('log level', 1);

server.listen(appPort);
console.log('Server listening at %s:%s', ip, appPort);


var userArray = ['admin'];
var ListClient = new Object();

// Handle socket.io

var users = 0;

var run = function(socket) {
    socket.emit('greeting', "Hello from socket io");
    users += 1;
    reloadUser();
    socket.on('sendMess', function(data) {
        if (userSet(socket)) {
            var transmit = {
                date : new Date().toISOString(),
                name : returnName(socket),
                message : data
            };
            socket.broadcast.emit('message', transmit);
            console.log("Username : " + transmit['name'] + " said " + data);
        }
    });
    
    socket.on('create-room', function(data) {
        socket.broadcast.emit('new-room', data);
    });
    
    
    
    socket.on('setNickName', function(data) { // Assign nick name for user connected.
        
        socket.broadcast.emit('new-user', data);
        
//        if (userArray.indexOf(data) == -1) {
        if (!ListClient.hasOwnProperty(data)) {
            socket.set('pseudo', data, function() {
//                userArray.push(data);
                socket.emit('status', 'ok');
//                socket.emit('luser', returnName(socket));
                socket.emit('luser', ListClient);
                ListClient[data] = socket.id;
                console.log("User " + data + " connected!!");
//                console.log(ListClient);
            });
            
        } else {
            socket.emit('status', 'error');
        }
    });
    socket.on('disconnect', function() {
        users -= 1;
        reloadUser();
        for (var prop in ListClient) {
            if (socket.id == ListClient[prop]) {
                socket.broadcast.emit('remove-user', prop);
                delete ListClient[prop];
            }
        }
    });
};



io.sockets.on('connection', run);


function subcribe(socket, data) {
    var room = getRooms();
    
    if (room.indexOf()) {
        
    }
}

function reloadUser() {
    io.sockets.emit('nUsers', {"nb": users});
}


function userSet(socket) { // Test if the user has a name
    var check;
    socket.get('pseudo', function(err, name) {
        if (name == null) {
            check = false;
        } else check = true;
    });
    return check;
}

function returnName(socket) {
    var userName;
    socket.get('pseudo', function(err, name) {
        if (name == null) {
            userName = false;
        } else userName = name;
    });
    return userName;
}


function getRooms(){
	return Object.keys(io.sockets.manager.rooms);
}
