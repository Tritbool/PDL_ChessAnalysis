/* jshint
    laxcomma:true
    , laxbreak:true
    , node:true
    , loopfunc:true
*/

var promise     = require('es6-promise').Promise
    , express   = require('express')
    , fs        = require('fs')
    , _         = require('lodash')
    , cons      = require('consolidate')
    , database  = require('./database')
    , app       = express()
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
                        var opName = ""
                            , opVar = ""
                            ;
                        while (results.rows[1][0].opening.length > 12){
                            opName += results.rows[1][0].opening.substr(0, 11) + '-<br/>';
                            results.rows[1][0].opening = results.rows[1][0].opening.substr(11, results.rows[1][0].opening.length - 1);
                        }
                        opName += results.rows[1][0].opening;
                        while (results.rows[1][0].variation.length > 12){
                            opVar += results.rows[1][0].variation.substr(0, 11) + '-<br/>';
                            results.rows[1][0].variation = results.rows[1][0].variation.substr(11, results.rows[1][0].variation.length - 1);
                        }
                        opVar += results.rows[1][0].variation;
                        data.game = {
                            event : {
                                name : results.rows[1][0].eventName
                                , city : results.rows[1][0].eventCity
                                , date : results.rows[1][0].date
                            }
                            , players : {
                                white : {
                                    name : results.rows[1][0].whiteName
                                    , elo : results.rows[1][0].whiteElo
                                }
                                , black : {
                                    name : results.rows[1][0].blackName
                                    , elo : results.rows[1][0].blackElo
                                }
                            }
                            , opening : {
                                name : opName.replace('\'','\\\'')//results.rows[1][0].opening
                                , variation : opVar.replace('\'','\\\'')//results.rows[1][0].variation
                                , length : results.rows[1][0].nbMoves
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
                if (typeof depths[i] !== 'function'){
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
        }
        resolve(jsondepths);
    });
};

app.engine('html', cons.lodash);
app.set('view engine', 'html');
app.set('views', './views');
app.use('/static', express.static(__dirname + '/static'));
/*app.get('/', function(req,res){
    res.render('bla');
});*/
app.get('/games/:id', function (req, res) {
    parseMoves(req.params.id)
        .then(function(data){
            // console.log(data);
            res.render('index.html',data);
        })
        .catch(function(error){
            reject(error);
        })
    ;
});

var listener = app.listen(3000, function(){
    console.log('Server running on port ' + listener.address().port);
});
