var appPort = process.env.PORT || 1901,
    ip = process.env.IP || '127.0.0.1';


var routes = require('./routes');


var express = require('express'),
    app = express();

var http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    jade = require('jade');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view option', { layout: false });

app.use(express.static(__dirname + '/public'));


// app.get('/', function(req, res) {
//     res.render('index.jade');
// });


app.post('/', routes);
app.post('/about', routes.about);


server.listen(appPort);
console.log('Server listening at %s:%s', ip, appPort);
