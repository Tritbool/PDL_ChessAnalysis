/* jshint
    laxcomma:true
    , laxbreak:true
    , node:true
    , loopfunc:true
*/
var promise     = require('es6-promise').Promise
    , _         = require('lodash')
    , database  = require('./database')
    ;

var parseMoves = function(idGame, options){
    return new Promise(function(resolve, reject) {
        database.createConnection(options.host,options.login, options.pass, options.database)
            .then(function(connection){
                database.getGame(connection, idGame)
                    .then(function(results){
                        var maxDepth = 100;
                        results.rows[0] = _.forEach(results.rows[0], function(move){
                            parseLog(move.log)
                                .then(function(depths){
                                    if (depths.length < maxDepth){
                                        maxDepth = depths.length;
                                    }
                                    move.maxDepth = maxDepth;
                                    move.depths = depths;
                                })
                                .catch(function(error){
                                    move.maxDepth = maxDepth;
                                    move.depths = _.fill(Array(maxDepth), 0);
                                })
                            ;
                        });
                        return results;
                    })
                    .then(function(results){
                        var maxDepth = results.rows[0][results.rows[0].length - 1].maxDepth;
                        var data = {};
                        data.moves = _.map(results.rows[0], function(move){
                            return {
                                num : move.halfMove
                                , position : move.move
                                , fen : move.idFen
                                , depths : _.slice(move.depths, 0, maxDepth)
                            };
                        });
                        data.game = {
                            event : {
                                name    : results.rows[1][0].eventName.replace('\'','\\\'')
                                , city  : results.rows[1][0].eventCity.replace('\'','\\\'')
                                , date  : results.rows[1][0].date
                            }
                            , players : {
                                white : {
                                    name    : results.rows[1][0].whiteName.replace('\'','\\\'')
                                    , elo   : results.rows[1][0].whiteElo
                                }
                                , black : {
                                    name    : results.rows[1][0].blackName.replace('\'','\\\'')
                                    , elo   : results.rows[1][0].blackElo
                                }
                            }
                            , opening : {
                                name        : results.rows[1][0].opening.replace('\'','\\\'').replace(' ','<br/>')
                                , variation : results.rows[1][0].variation.replace('\'','\\\'').replace(' ','<br/>')
                                , length    : results.rows[1][0].nbMoves
                            }
                        };
                        resolve(data);
                    })
                    .catch(function(error){
                        reject(error);
                    })
                ;
            })
            .catch(function(error){
                reject(error);
            })
        ;
    });
};

var parseLog = function(log){
    return new Promise(function(resolve, reject) {
        var scoreDepths = [];
        if (log !== null && log.search("info depth") > -1){
            var depths = log.split("info depth");
            var length = 0;
            for (var i in depths) {
                var startScoreCp = depths[i].search("score cp");
                var startNodes = depths[i].search("nodes");
                var scoreCp = parseInt(depths[i].slice(startScoreCp + "score cp".length, startNodes));
                if (!isNaN(scoreCp)){
                    scoreDepths.push(scoreCp);
                }
            }
            resolve(scoreDepths);
        }
        else{
            reject();
        }
    });
};

module.exports = {
    parseMoves : parseMoves
};
