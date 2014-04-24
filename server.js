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
    socket.on('setNickName', function(data) { // Assign nick name for user connected.
        
        
        
        if (userArray.indexOf(data) == -1) {
            socket.set('pseudo', data, function() {
                userArray.push(data);
                socket.emit('status', 'ok');
                socket.emit('luser', returnName(socket));
                console.log("User " + data + " connected!!");
            });
            
        } else {
            socket.emit('status', 'error');
        }
    });
    socket.on('disconnect', function() {
        users -= 1;
        reloadUser();
    });
};

io.sockets.on('connection', run);


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
