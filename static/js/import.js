/* jshint
laxcomma:true
, laxbreak:true
, node:true
*/

(function($){

    var chess = require('chesslib')
    ;
    var getPGN = function(){
        var pgn = $('.container-textarea textarea').val();
        var data;
        try{
            data = chess.PGN.parse(pgn);
        }
        catch(e){
            return "";
        }
        return data[0];
    };
    var parsePGN = function(){
        var results = getPGN();
        if (results !== "" && results.ply.length !== 0){
            var data = {
                moves : []
            };
            _.each(results.ply, function(move, i){
                data.moves.push({
                    position    : move.move
                    , num       : i
                    , fen       : chess.FEN.stringify(move.position)
                });
            });

            data.game = {
                result : results.tags.Result
                , event : {
                    name    : (results.tags.Event !== undefined) ? results.tags.Event.replace(/\'/g,'\\\'') : ""
                    , city  : (results.tags.Site !== undefined) ? results.tags.Site.replace(/\'/g,'\\\'') : ""
                    , date  : (results.tags.Date !== undefined) ? results.tags.Date.replace(/\'/g,'\\\'') : ""
                }
                , players : {
                    white : {
                        name    : (results.tags.White !== undefined) ? results.tags.White.replace(/\'/g,'\\\'') : ""
                    }
                    , black : {
                        name    : (results.tags.Black !== undefined) ? results.tags.Black.replace(/\'/g,'\\\'') : ""
                    }
                }
            };
            return {data:data, ok:true};
        }
        else{
            return {data:result, ok:false};
        }
    };

    $('.container-textarea button').on('click', function(){
        var result = parsePGN();
        if (result.ok === true){
            $.ajax({
                type: 'POST',
                url: '/game-import',
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(result.data),
                success: function(json) {
                    if (typeof json.redirect == 'string'){
                        window.location = json.redirect;
                    }
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
        else{
            if (!$('.container-textarea .alert-danger').length){
                $('.container-textarea').prepend('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" '
                + 'aria-label="close">&times;</a><strong>Attention!</strong> PGN non valide</div>');
            }
            console.log(result.data);
        }
    });
})(jQuery);
