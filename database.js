/* jshint
    laxcomma:true
    , laxbreak:true
    , node:true
*/

var promise = require('es6-promise').Promise
    , mysql = require('mysql')
    , Chess = require('chess.js').Chess
    ;

var createConnection = function(host, user, password, database) {
    var connection = mysql.createConnection(
        {
            host                    : host
            , user                  : user
            , password              : password
            , database              : database
            , multipleStatements    : true
        }
    );
    return new Promise(function(resolve,reject){
        connection.connect(function(err){
            if (err){
                reject(err);
            }
        });
        resolve(connection);
    });
};

var request = function(connection, query){
    return new Promise(function(resolve, reject) {
        connection.query(query, function(err, rows, fields) {
            if (err){
                reject(err);
            }
            resolve({fields:fields, rows:rows});
        });
    });
};

var end = function(connection){
    return new Promise(function(resolve, reject) {
        connection.end(function(err){
            if (err){
                reject(err);
            }
            resolve("connection closed on " + connection.config.host + ":" + connection.config.port);
        });
    });
};

var getGame = function(connection, idGame){
    return new Promise(function(resolve, reject) {
        request(connection,
                // get all moves, fens and logs of a game
                "Select m.halfMove, m.move, m.idFen, f.log"
                + " from move m, fen f"
                + " where m.idfen=f.id and m.idGame = " + idGame + " order by halfMove ASC;"
                // get meta-data of a game
                + " Select e.name as eventName, e.city as eventCity, white.name as whiteName, black.name as blackName, g.whiteElo, g.blackElo, g.date, o.opening, o.variation, o.nbMoves"
                + " from game g, player white, player black, event e, opening o"
                + " where white.id=g.whiteId and black.id=g.blackId and e.id=g.eventId and o.id=g.ecoId and g.id=" + idGame +";")
            .then(function(results){
                resolve(results);
            })
            .catch(function(error){
                reject(error);
            })
        ;
    });
};

module.exports = {
    createConnection    : createConnection
    , request           : request
    , end               : end
    , getGame           : getGame
};
