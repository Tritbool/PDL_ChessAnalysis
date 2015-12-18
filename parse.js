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

var parseMoves = function(idGame){
    return new Promise(function(resolve, reject) {
        database.createConnection("localhost", "root", "", "chessdb")
            .then(function(connection){
                database.getGame(connection, idGame)
                    .then(function(results){
                        results.rows[0] = _.forEach(results.rows[0], function(move){
                            parseLog(move.log)
                                .then(function(depths){
                                    move.depths = depths;
                                })
                                .catch(function(error){
                                    reject(error);
                                })
                            ;
                        });
                        return results;
                    })
                    .then(function(results){
                        var data = {};
                        data.moves = _.map(results.rows[0], function(move){
                            return {
                                num : move.halfMove
                                , position : move.move
                                , fen : move.idFen
                                , depths : move.depths
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
        var jsondepths = [];
        if (log !== null){
            var depths = log.split("info depth");
            for (var i in depths) {
                var depth = {};
                var startSeldepth = depths[i].search("seldepth");
                depth.level = parseInt(depths[i].slice(0,startSeldepth));
                if (!isNaN(depth.level)){
                    var startMultipv = depths[i].search("multipv");
                    var startScoreCp = depths[i].search("score cp");
                    var startNodes = depths[i].search("nodes");
                    var startNps = depths[i].search("nps");
                    var startTime = depths[i].search("time");
                    var startPv = depths[i].search(" pv");
                    depth.seldepth = parseInt(depths[i].slice(startSeldepth + "seldepth".length, startMultipv));
                    depth.multipv = parseInt(depths[i].slice(startMultipv + "multipv".length, startScoreCp));
                    depth.scoreCp = parseInt(depths[i].slice(startScoreCp + "score cp".length, startNodes));
                    depth.nodes = parseInt(depths[i].slice(startNodes + "nodes".length, startNps));
                    depth.nps = parseInt(depths[i].slice(startNps + "nps".length, startTime));
                    depth.time = parseInt(depths[i].slice(startTime + "time".length, startPv));
                    depth.pv = depths[i].slice(startPv + " pv ".length, depths[i].length);
                    jsondepths.push(depth);
                }
            }
        }
        resolve(jsondepths);
    });
};

module.exports = {
    parseMoves : parseMoves
};
