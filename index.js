/* jshint
    laxcomma:true
    , laxbreak:true
    , node:true
*/

var database    = require('./database')
    , Chess     = require('chess.js').Chess
    ;


database.createConnection("localhost", "root", "", "chessdb")
    .then(function(connection){
        getMoves(connection, "1")
            .then(function(results){
                console.log(results);
            })
            .catch(function(error){
                console.log(error);
            })
        ;
        return connection;
    })
    .then(function(connection){
        database.end(connection)
            .catch(function(error){
                console.log(error);
            })
        ;
    })
    .catch(function(error){
        console.log(error);
    })
;
