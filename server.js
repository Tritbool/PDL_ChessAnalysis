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
    , database  = require('./database')
    , app       = express()
    , connection
    , listener
    ;

var getDatabaseOptions = function() {
    return new Promise(function(resolve, reject) {
        prompt.get([
            {
                name: 'host',
                description: 'Enter your host '.yellow,
                type: 'string',
                default: "localhost",
                required: true
            }
            , {
                name: 'login',
                description: 'Enter your login '.yellow,
                type: 'string',
                default: "root",
                required: true
            }
            , {
                name: 'password',
                description: 'Enter your password '.yellow,
                type: 'string',
                message: 'must be letters',
                default: "",
                hidden: true,
            }
            , {
                name: 'database',
                description: 'Enter the database name '.yellow,
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
        database.createConnection(results.host, results.login, results.pass, results.database)
            .then(function(co){
                connection = co;
                console.log("connection to database on port " + connection.config.port + " succeed");
            })
            .catch(function(error){
                console.log(error);
                process.exit(1);
            })
        ;
        listener = app.listen(3000, function(){
            console.log('Server running on port ' + listener.address().port);
        });

    })
    .catch(function(error){
        console.log(error);
        process.exit(1);
    })
;

app.engine('html', cons.lodash);
app.set('view engine', 'html');
app.set('views', './views');
app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(req,res){
    res.render('index.html');
});
app.get('/games', function (req, res) {
    parse.getAllDataGames(connection)
        .then(function(data){
            res.render('list-games.html',data);
        })
        .catch(function(error){
            console.log(error);
        })
    ;
});
app.get('/games/:id', function (req, res) {
    parse.getDataGame(req.params.id, connection)
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

process.on('SIGINT', function() {
    shuttingDown = true;
    // var port = listener.address().port;
    // listener.close(function(){
    //     console.log("server closed on port " + port);
    //     database.endConnection(connection)
    //         .then(function(properDisconnection){
    //             console.log(properDisconnection);
    //             process.exit(0);
    //         })
    //         .catch(function(error){
    //             console.log(error);
    //             process.exit(1);
    //         })
    //     ;
    // });
    database.endConnection(connection)
        .then(function(properDisconnection){
            console.log(properDisconnection);
            // var port = listener.address().port;
            listener.close(function(){
                // console.log("server closed on port " + port);
                process.exit(0);
            });
        })
        .catch(function(error){
            console.log(error);
            process.exit(1);
        })
    ;
});
