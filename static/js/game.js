/* jshint
    laxcomma:true
    , laxbreak:true
    , node:true
*/

(function($) {
    $.fn.myPlugin = function(data) {
        var moves = data.moves;
        var game = data.game;
        var depth = data.depth;
        var pos = -1;
        var moveTable = $(".mytable");
        var fens = [];
        var serie = [];
        var categories = [];
        var table = "";
        for (var i in moves) {
            fens.push(moves[i].fen);
            serie.push(moves[i].depths[depth]);
            categories.push(moves[i].position);
            if (i%2 === 0){
                if (moves[i].depths[depth] * -1 > 0) {
                    table += '<tr><td>' + i/2 + '</td><td id="pos' + i + '">' + moves[i].position + '<p>+' +  moves[i].depths[depth] * -1 + '</p></td>';
                }
                else{
                    table += '<tr><td>' + i/2 + '</td><td id="pos' + i + '">' + moves[i].position + '<p>' +  moves[i].depths[depth] * -1 + '</p></td>';
                }
            }
            else{
                if (moves[i].depths[depth] > 0) {
                    table += '<td id="pos' + i + '">' + moves[i].position + '<p>+' +  moves[i].depths[depth] + '</p></td></tr>';
                }
                else{
                    table += '<td id="pos' + i + '">' + moves[i].position + '<p>' +  moves[i].depths[depth] + '</p></td></tr>';
                }
            }
        }
        var board = ChessBoard('chessboard', {
            pieceTheme	: '/static/img/chesspieces/{piece}.png'
            , position	: 'start'
            , draggable	: false
            , showErrors : 'console'
        });
        moveTable.find($("table")).append(table);
        var listDepths = "";
        for (var j in moves[0].depths) {
            listDepths += '<li id="depth' + j + '"><a>' + j + '</a></li>';
        }
        $("#depths .dropdown-menu").append(listDepths);

        $("#infos #players table").append('<tr><td>Nom<br/>Classement ELO</td><td>' + game.players.white.name + '<br/>' + game.players.white.elo +
                    '</td><td><i class="icon icon-adjust"></i></td><td>' + game.players.black.name + '<br/>' + game.players.black.elo + '</td></tr>');
        $("#infos #event table").append('<tr><td>Nom<br/>Ville</br>Date</td><td>' + game.event.name + '<br/>' + game.event.city + '<br/>' + game.event.date + '</td></tr>');

        var options = {
            chart: {
                type: 'area',
                renderTo: "area",
                height: 400,
                width: 1000,
            },
            title: {
               text: 'Moves score of players'
            },
            xAxis: {
                categories: categories,
                plotBands: [{
                    color: '#F0D9B5',
                    from: -0.5,
                    to: game.opening.length - 0.5,
                    label: {
                       text: game.opening.name + '<br/>' + game.opening.variation
                    }
                }],
            },
            yAxis: {
                title: {
                    text: 'Score'
                }
            },
            series: [{
                name: 'Scores',
                data: serie,
                color: '#F4E4CB',
                negativeColor: '#B58863',
                point: {
                    events: {
                        click: function (e) {
                            moveChange(e.point.index);
                        }
                    }
                },
                allowPointSelect: true,
                marker: {
                    radius: 1,
                    states: {
                        select: {
                           radius: 3,
                           fillColor: '#B58863'
                        }
                    }
                }
           }]
        };

        var chart = new Highcharts.Chart(options);

        $('#depths li').on('click', function(){
            depth = parseInt($(this).attr('id').substr(5));
            serie = [];
            for (var i in moves){
                serie.push(moves[i].depths[depth]);
            }
            options.series[0].data = serie;
            chart = new Highcharts.Chart(options);
        });

        var moveChange = function(id){
            if (pos >= 0 && pos < fens.length){
                var formTd = moveTable.find($("td#pos" + pos));
                formTd.css("background-color","");
                formTd.css("color","black");
                formTd.css("font-weight","normal");
                }
            pos = parseInt(id);
            var actTd = moveTable.find($("td#pos" + pos));
            board.position(fens[pos]);
            actTd.css("background-color","#C39F82");
            actTd.css("color","#755F4E");
            actTd.css("font-weight","bold");
            moveTable.scrollTop(moveTable.find($("td#pos0")).offset().top);
            moveTable.scrollTop(actTd.offset().top - 100);
        };
        var stepBegin = function(){
            if (pos > -1){
                board.start();
                chart.series[0].points[pos].select(false);
                var formTd = moveTable.find($("td#pos" + pos));
                formTd.css("background-color","");
                formTd.css("color","black");
                formTd.css("font-weight","normal");
                moveTable.scrollTop(moveTable.find($('td#pos0')).offset().top - 100);
                pos = -1;
            }
        };
        var stepForward = function(){
            if (pos < fens.length - 1){
                moveChange(pos+1);
                chart.series[0].points[pos].select();
            }
        };
        var stepBackward = function(){
            if (pos > 0){
                moveChange(pos-1);
                chart.series[0].points[pos].select();
            }
            else{
                stepBegin();
            }
        };
        var stepEnd = function(){
            moveChange(fens.length - 1);
            chart.series[0].points[pos].select();
        };

        $('.buttons button').on('click', function(){
            if ($(this).attr("id") == "forward"){
                stepForward();
            }
            if ($(this).attr("id") == "backward"){
                stepBackward();
            }
            if ($(this).attr("id") == "begin"){
                stepBegin();
            }
            if ($(this).attr("id") == "end"){
                stepEnd();
            }
        });

        moveTable.find($("td")).click(function(){
            moveChange($(this).attr('id').substr(3));
            chart.series[0].points[pos].select();
        });

        moveTable.find($("td:last-child, td:nth-last-child(2)")).hover(function(){
            $(this).css('cursor', 'pointer');
            if ($(this).css('background-color') == "rgb(249, 249, 249)" || $(this).css('background-color') == "transparent"){
                $(this).css('background-color', '#F0D9B5');
            }
        }, function() {
            $(this).css('cursor','auto');
            if ($(this).css('background-color') != "rgb(195, 159, 130)"){
                $(this).css('background-color', '');
            }
        });
    };
})(jQuery);
