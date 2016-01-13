/* jshint
    laxcomma:true
    , laxbreak:true
    , node:true
*/

(function($) {
    $.fn.myPlugin = function(data) {
        var moves = data.moves;
        var game = data.game;
        var pos = -1;
        var moveTable = $(".mytable");
        var fens = [];
        var categories = [];
        for (var i in moves) {
            fens.push(moves[i].fen);
            categories.push(moves[i].position);
        }

        $('#current a').html(game.players.white.name + " vs " + game.players.black.name);
        $('#current a').attr("href", "#");

        var board = ChessBoard('chessboard', {
            pieceTheme	: '/static/img/chesspieces/{piece}.png'
            , position	: 'start'
            , draggable	: false
            , showErrors : 'console'
        });

        $("#infos #players table").append('<tr><td>Nom</td><td>' + game.players.white.name + '</td>'
                    + '<td><span class="glyphicon glyphicon-adjust"></span></td><td>' + game.players.black.name + '</td></tr>');
        $("#infos #ev table").append('<tr><td>Nom</td><td>'+ game.event.name + '</td></tr>' +
            '<tr><td>Ville</td><td>'+ game.event.city + '</td></tr>' +
            '<tr><td>Date</td><td>'+ game.event.date + '</td></tr>'
        );
        $("#title-game").append(game.players.white.name + " contre " + game.players.black.name);



        var moveChange = function(id, onselect){
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


            var table = "";
            for (var j in moves) {
                table += (j%2 === 0) ?
                        '<tr><td>' + j/2 + '</td><td id="pos' + j + '">' + moves[j].position + '</td>'
                        :
                        '<td id="pos' + j + '">' + moves[j].position + '</td></tr>'
                ;
            }
            moveTable.find($("table")).html(table);

            moveTable.find($("td:last-child, td:nth-last-child(2)")).click(function(){
                moveChange($(this).attr('id').substr(3));
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

        var stepBegin = function(){
            if (pos > -1){
                board.start();
                var formTd = moveTable.find($("td#pos" + pos));
                formTd.css("background-color","");
                formTd.css("color","black");
                formTd.css("font-weight","normal");
                $('#bestmove button').attr('disabled', true);
                moveTable.scrollTop(0);
                pos = -1;
            }
        };
        var stepForward = function(){
            if (pos < fens.length - 1){
                moveChange(pos+1);
            }
        };
        var stepBackward = function(){
            if (pos > 0){
                moveChange(pos-1);
            }
            else{
                stepBegin();
            }
        };
        var stepEnd = function(){
            if (pos < fens.length - 1){
                moveChange(fens.length - 1);
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
