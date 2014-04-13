module.exports = function(req, res) {
    res.render('main.jade');
};

module.exports.about = require('./about');
module.exports.admin = require('./admin');
