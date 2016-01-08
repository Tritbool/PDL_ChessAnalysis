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

var getDataGame = function(idGame, connection){
    return new Promise(function(resolve, reject) {
        database.getGame(connection, idGame)
        .then(function(results){
            var maxDepth = 100;
            results.rows[0] = _.forEach(results.rows[0], function(move){
                parseLog(move.log)
                .then(function(parsedLog){
                    if (parsedLog.depths.length < maxDepth){
                        maxDepth = parsedLog.depths.length;
                    }
                    move.maxDepth = maxDepth;
                    move.depths = parsedLog.depths;
                    move.best = _.trim(parsedLog.bestmove);
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
            var data = {};
            data.maxDepth = _.min(results.rows[0], function(o){
                return o.maxDepth;
            }).maxDepth;
            data.moves = _.map(results.rows[0], function(move){
                return {
                    position    : move.move
                    , depths    : move.depths
                    , best      : (move.best !== undefined && move.best.match(/\w\d\w\d*/)) ? move.best.substr(0,2) + "-" + move.best.substr(2,2) : ""
                    , num       : move.halfMove
                    , fen       : move.idFen
                };
            });
            data.game = {
                event : {
                    name    : (results.rows[1][0].eventName !== undefined) ? results.rows[1][0].eventName.replace(/\'/g,'\\\'') : ""
                    , city  : (results.rows[1][0].eventCity !== undefined) ? results.rows[1][0].eventCity.replace(/\'/g,'\\\'') : ""
                    , date  : (results.rows[1][0].date !== undefined) ? results.rows[1][0].date.replace(/\'/g,'\\\'') : ""
                }
                , players : {
                    white : {
                        name    : (results.rows[1][0].whiteName !== undefined) ? results.rows[1][0].whiteName.replace(/\'/g,'\\\'') : ""
                        , elo    : (results.rows[1][0].whiteElo !== undefined) ? results.rows[1][0].whiteElo : 0
                    }
                    , black : {
                        name    : (results.rows[1][0].blackName !== undefined) ? results.rows[1][0].blackName.replace(/\'/g,'\\\'') : ""
                        , elo    : (results.rows[1][0].blackElo !== undefined) ? results.rows[1][0].blackElo : 0
                    }
                }
                , opening : {
                    variation   : (results.rows[1][0].variation !== undefined) ? results.rows[1][0].variation.replace(/\'/g,'\\\'').replace(/ /g,'<br/>') : ""
                    , name      : (results.rows[1][0].opening !== undefined) ? results.rows[1][0].opening.replace(/\'/g,'\\\'').replace(/ /g,'<br/>') : ""
                    , length    : (results.rows[1][0].nbMoves !== undefined) ? results.rows[1][0].nbMoves : 0
                }
            };
            resolve(data);
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
        var bestmove = log.split("bestmove")[1].split("ponder")[0];
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
                else{
                  scoreDepths.push(0);
                }
            }
            resolve({depths:scoreDepths, bestmove:bestmove});
        }
        else{
            reject();
        }
    });
};

var getPartialDataGame = function(idGame, connection){
    return new Promise(function(resolve, reject) {
        database.getPartialGame(connection, idGame)
        .then(function(results){
            results.rows[0] = _.forEach(results.rows[0], function(move){
                parsePartialLog(move.log)
                .then(function(score){
                    move.score = Math.abs(score);
                    delete move.log;
                })
                .catch(function(defaultScore){
                    move.score = defaultScore;
                    delete move.log;
                })
                ;
            });
            return results.rows;
        })
        .then(function(results){
            var data = {
                id      : idGame
                , event : {
                    name    : results[1][0].eventName.replace(/\'/g,'\\\'')
                    , city  : results[1][0].eventCity.replace(/\'/g,'\\\'')
                    , date  : results[1][0].date.replace(/-/g,'/')
                }
                , players : {
                    white   :  results[1][0].whiteName.replace(/\'/g,'\\\'')
                    , black :  results[1][0].blackName.replace(/\'/g,'\\\'')
                }
                , score : Math.round((_.sum(results[0], function(o) {
                    return o.score;
                }))/results[0].length)
            };
            resolve(data);
        })
        .catch(function(error){
            reject(error);
        })
        ;
    });
};

var parsePartialLog = function(log){
    return new Promise(function(resolve, reject) {
        if (log !== null && log.search("info depth") > -1){
            var depths = log.split("info depth");
            var last = depths[depths.length - 1];
            var startScoreCp = last.search("score cp");
            var startNodes = last.search("nodes");
            var scoreCp = parseInt(last.slice(startScoreCp + "score cp".length, startNodes));
            if (!isNaN(scoreCp)){
              resolve(scoreCp);
            }
            else{
              reject(0);
            }
        }
        else{
            reject(0);
        }
    });
};

var getAllDataGames = function(connection){
    return new Promise(function(resolve, reject) {
        database.getIdGames(connection)
            .then(function(res){
                return _.map(res.rows, function(o){
                    return getPartialDataGame(o.id, connection);
                });
            })
            .then(function(arrayOfPromises){
                Promise.all(arrayOfPromises).then(function(arrayOfResults) {
                    resolve({games : arrayOfResults});
                });
            })
            .catch(function(error){
                reject(error);
            })
        ;
    });
};

var getDataPlayers = function(connection){
    return new Promise(function(resolve, reject) {
        database.getPlayers(connection)
        .then(function(data){
            var players = _.map(data.rows[0], function(o){
                return {id: o.id, name: o.name.replace(/\'/g,'\\\'')};
            });
            var elo = _.groupBy(_.map(data.rows[1].concat(data.rows[2]), function(o){
                return {id: o.id, elo: o.elo};
            }), 'id');
            _.forEach(elo, function(n, key){
                var i = _.findIndex(players, function(o){
                    return o.id == key;
                });
                if (i > -1){
                    players[i].elo = _.max(n, function(o){
                        return o.elo;
                    }).elo;
                }
                else{
                    players[i].elo = -1;
                }
            });
            resolve({players:players});
        })
        .catch(function(error){
            reject(error);
        })
        ;
    });
};

module.exports = {
    getAllDataGames : getAllDataGames
    , getDataGame   : getDataGame
    , getDataPlayers: getDataPlayers
};
