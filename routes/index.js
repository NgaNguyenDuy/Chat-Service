module.exports = function(req, res) {
    res.render('index.jade');
};

module.exports.about = require('./about');
module.exports.main = require('./main');
