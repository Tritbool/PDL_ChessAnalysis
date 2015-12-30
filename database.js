/* jshint
    laxcomma:true
    , laxbreak:true
    , node:true
*/

var promise = require('es6-promise').Promise
    , Chess = require('chess.js').Chess
    , mysql = require('mysql')
    ;


var createConnection = function(host, user, password, database) {
    var connection = mysql.createConnection(
        {
            host                    : host
            , user                  : user
            , password              : password
            , database              : database
            , multipleStatements    : true
            , dateStrings           : true
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

var endConnection = function(connection){
    return new Promise(function(resolve, reject) {
        connection.end(function(err){
            if (err){
                reject(err);
            }
            resolve("connection closed on port " + connection.config.port);
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

var getPartialGame = function(connection, idGame){
  return new Promise(function(resolve, reject) {
      request(connection,
              // get all moves, fens and logs of a game
              "Select f.log"
              + " from move m, fen f"
              + " where m.idfen=f.id and m.idGame = " + idGame + ";"
              // get meta-data of a game
              + " Select e.name as eventName, e.city as eventCity, white.name as whiteName, black.name as blackName, g.date"
              + " from game g, player white, player black, event e"
              + " where white.id=g.whiteId and black.id=g.blackId and e.id=g.eventId and g.id=" + idGame +";")
          .then(function(results){
              resolve(results);
          })
          .catch(function(error){
              reject(error);
          })
      ;
  });
};

var getIdGames = function(connection){
    return new Promise(function(resolve, reject) {
        request(connection, "Select g.id from game g;")
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
    , endConnection     : endConnection
    , getGame           : getGame
    , getPartialGame    : getPartialGame
    , getIdGames        : getIdGames
};
