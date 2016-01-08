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
            serie.push(moves[i].depths[moves[i].depths.length - 1]);
            categories.push(moves[i].position);
        }

        $('#bestmove button').attr('disabled', true);

        var generateMovesTable = function(depth){
            var table = "";
            for (var i in moves) {
                var ind;
                if (depth == "max"){
                    ind = moves[i].depths.length - 1;
                }
                else{
                    ind = parseInt(depth);
                }
                if (i%2 === 0){
                    if (moves[i].depths[ind] * -1 > 0) {
                        table += '<tr><td>' + i/2 + '</td><td id="pos' + i + '">' + moves[i].position + '<p>+' +  moves[i].depths[ind] * -1 + '</p></td>';
                    }
                    else{
                        table += '<tr><td>' + i/2 + '</td><td id="pos' + i + '">' + moves[i].position + '<p>' +  moves[i].depths[ind] * -1 + '</p></td>';
                    }
                }
                else{
                    if (moves[i].depths[ind] > 0) {
                        table += '<td id="pos' + i + '">' + moves[i].position + '<p>+' +  moves[i].depths[ind] + '</p></td></tr>';
                    }
                    else{
                        table += '<td id="pos' + i + '">' + moves[i].position + '<p>' +  moves[i].depths[ind] + '</p></td></tr>';
                    }
                }
            }
            moveTable.find($("table")).html(table);

            moveTable.find($("td")).click(function(){
                moveChange($(this).attr('id').substr(3));
                if (chart.series[0].points[pos].selected === false){
                    chart.series[0].points[pos].select();
                }
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
        generateMovesTable("max");


        var board = ChessBoard('chessboard', {
            pieceTheme	: '/static/img/chesspieces/{piece}.png'
            , position	: 'start'
            , draggable	: false
            , showErrors : 'console'
        });

        var listDepths = "";
        for (var j = 0; j < depth; j++) {
            listDepths += '<li id="depth' + j + '"><a>' + j + '</a></li>';
        }
        $("#depths .dropdown-menu").append(listDepths + '<li id="depthmax"><a>max</a></li>');

        $("#infos #players table").append('<tr><td>Nom</td><td>' + game.players.white.name + '</td>'
                    + '<td><i class="icon icon-adjust"></i></td><td>' + game.players.black.name + '</td></tr>'
                    + '<tr><td>ELO</td><td>' + game.players.white.elo + '</td><td></td><td>' + game.players.black.elo + '</td></tr>');
        $("#infos #ev table").append('<tr><td>Nom</td><td>'+ game.event.name + '</td></tr>' +
            '<tr><td>Ville</td><td>'+ game.event.city + '</td></tr>' +
            '<tr><td>Date</td><td>'+ game.event.date + '</td></tr>'
        );
        $("#title-game").append(game.players.white.name + " contre " + game.players.black.name);


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
            serie = [];
            if ($(this).attr('id') != "depthmax"){
                depth = parseInt($(this).attr('id').substr(5));
                for (var i in moves){
                    serie.push(moves[i].depths[depth]);
                }
            }
            else{
                for (var j in moves){
                    serie.push(moves[j].depths[moves[j].depths.length - 1]);
                }
            }
            $('#depths button').html("Profondeur d'analyse : " + $(this).attr('id').substr(5) + " <span class=\"caret\"></span>");
            generateMovesTable($(this).attr('id').substr(5));
            options.series[0].data = serie;
            chart = new Highcharts.Chart(options);
        });

        $('#bestmove button').on('click', function(){
            if (pos > -1 && pos < moves.length){
                board.move(moves[pos].best);
                $(this).html(moves[pos].best);
                setTimeout(function(){
                    board.position(fens[pos]);
                    $('#bestmove button').html("Meilleur Coup");
                }, 700);
            }
        });

        var moveChange = function(id){
            if (pos >= 0 && pos < fens.length){
                var formTd = moveTable.find($("#pos" + pos));
                formTd.css("background-color","");
                formTd.css("color","black");
                formTd.css("font-weight","normal");
            }
            pos = parseInt(id);
            if (pos >= 0 && pos < fens.length){
                if (moves[pos].best === ""){
                    $('#bestmove button').attr('disabled', true);
                }
                else{
                    $('#bestmove button').attr('disabled', false);
                }
                moveTable.scrollTop(0);
                var actTd = moveTable.find($("#pos" + pos));
                board.position(fens[pos]);
                actTd.css("background-color","#C39F82");
                actTd.css("color","#755F4E");
                actTd.css("font-weight","bold");
                moveTable.scrollTop(actTd.offset().top - 303);
            }
        };
        var stepBegin = function(){
            if (pos > -1){
                board.start();
                chart.series[0].points[pos].select(false);
                var formTd = moveTable.find($("td#pos" + pos));
                formTd.css("background-color","");
                formTd.css("color","black");
                formTd.css("font-weight","normal");
                moveTable.scrollTop(0);
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
            if (pos < fens.length - 1){
                moveChange(fens.length - 1);
                chart.series[0].points[pos].select();
            }
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
    };
})(jQuery);
