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


app.get('/', routes);
app.get('/about', routes.about);
app.get('/main', routes.main);

app.use(function(req, res) {
    res.render('404.jade', {url: req.url});
});


server.listen(appPort);
console.log('Server listening at %s:%s', ip, appPort);
