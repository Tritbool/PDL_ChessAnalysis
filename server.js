/* jshint
    laxcomma:true
    , laxbreak:true
    , node:true
    , loopfunc:true
*/

var promise     = require('es6-promise').Promise
    , express   = require('express')
    , _         = require('lodash')
    , cons      = require('consolidate')
    , parse     = require('./parse')
    , app       = express()
    ;


app.engine('html', cons.lodash);
app.set('view engine', 'html');
app.set('views', './views');
app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(req,res){
    res.render('index.html');
});
app.get('/games/:id', function (req, res) {
    parse.parseMoves(req.params.id)
        .then(function(data){
            res.render('game.html',data);
        })
        .catch(function(error){
            reject(error);
        })
    ;
});

var listener = app.listen(3000, function(){
    console.log('Server running on port ' + listener.address().port);
});
