module.exports = function(req, res) {
    res.render('index.jade');
};

module.exports.about = require('./about');


