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

// Handle socket.io

var users = 0;

var run = function(socket) {
    socket.emit('greeting', "Hello from socket io");
    users += 1;
    reloadUser();
    socket.on('setNickName', function(data) { // Assign nick name for user connected.
        if (userArray.indexOf(data) == -1) {
            socket.set('pseudo', data, function() {
                userArray.push(data);
                socket.emit('status', 'ok');
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

