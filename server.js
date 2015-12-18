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
    , prompt    = require('prompt')
    , parse     = require('./parse')
    , app       = express()
    , host      = ""
    , login     = ""
    , pass      = ""
    , database  = ""
    ;

var getDatabaseOptions = function() {
    return new Promise(function(resolve, reject) {
        prompt.get([
            {
                name: 'host',
                description: 'Enter your host'.yellow,
                type: 'string',
                default: "localhost",
                required: true
            }
            , {
                name: 'login',
                description: 'Enter your login'.yellow,
                type: 'string',
                default: "root",
                required: true
            }
            , {
                name: 'password',
                description: 'Enter your password'.yellow,
                type: 'string',
                message: 'must be letters',
                default: "",
                hidden: true,
            }
            , {
                name: 'database',
                description: 'Enter the database name'.yellow,
                type: 'string',
                message: 'must be letters',
                default: "chessdb",
                required: true
            }
        ], function (err, results) {
            if (err){
                 reject(err);
             }
            resolve({host:results.host,login:results.login, pass:results.password, database:results.database});
        });
    });
};
prompt.message = "";
prompt.delimiter = "> ".red;
prompt.start();

getDatabaseOptions()
    .then(function(results){
        login = results.login;
        pass = results.pass;
        database = results.database;
        host = results.host;
        var listener = app.listen(3000, function(){
            console.log('Server running on port ' + listener.address().port);
        });

    })
    .catch(function(error){
        console.log(error);
        process.exit(0);
    })
;

app.engine('html', cons.lodash);
app.set('view engine', 'html');
app.set('views', './views');
app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(req,res){
    res.render('index.html');
});
app.get('/games/:id', function (req, res) {
    parse.parseMoves(req.params.id, {host:host, login : login, pass: pass, database: database})
        .then(function(data){
            res.render('game.html',data);
        })
        .catch(function(error){
            console.log(error);
        })
    ;
});
app.get('/about', function(req,res){
    res.render('about.html');
});
app.get('/contact', function(req,res){
    res.render('contact.html');
});
