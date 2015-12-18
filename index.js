/* jshint
    laxcomma:true
    , laxbreak:true
    , node:true
*/

var database    = require('./database')
    , Chess     = require('chess.js').Chess
    ;
    moveTable.find($("table")).append('<% for(var i in moves) { %><% if(i%2 == 0) { %><% if (moves[i].depths[19].scoreCp * -1 > 0) { %><tr><td><%= i/2 %></td><td id="pos<%= i %>"><%= moves[i].position %><p>+' + <%= moves[i].depths[19].scoreCp %> * -1 + '</p></td><% } else if (moves[i].depths[19].scoreCp * -1 <= 0) { %><tr><td><%= i/2 %></td><td id="pos<%= i %>"><%= moves[i].position %><p>' + <%= moves[i].depths[19].scoreCp %> * -1 + '</p></td><% } %><% } else { %><% if ( moves[i].depths[19].scoreCp > 0) { %><td id="pos<%= i %>"><%= moves[i].position %><p>+' + <%= moves[i].depths[19].scoreCp %> + '</p></td></tr><% } else if (moves[i].depths[19].scoreCp <= 0) { %><td id="pos<%= i %>"><%= moves[i].position %><p>' + <%= moves[i].depths[19].scoreCp %> + '</p></td></tr><% } %><% } %><% } %>');


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
