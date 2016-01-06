/* jshint
    laxcomma:true
    , laxbreak:true
    , node:true
*/

(function($) {
    $.fn.myPlugin = function(data) {
        $(document).ready(function() {
            var table = $('#list-games').DataTable( {
                order           : [[ 1, "desc" ]]
                , data          : data.games
                , scrollY       : '50vh'
                , scrollCollapse: true
                , lengthMenu    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Tous"]]
                , pagingType    : "full_numbers"
                , iDisplayLength: 25
                , columnDefs    : [
                    {
                        className   : "dt-center"
                        , targets   : [0,1,2,3,4,5,6]
                    }
                ]
                , language      : {
                    url             : "/static/json/dataTable.french.json"
                }
                , fnDrawCallback: function( oSettings ) {
                    $('#list-games tbody tr').on('click', function () {
                        var data = table.row( this ).data();
                        window.location.href = "/games/" + data[0];
                    });
                    $('#list-games tbody tr').hover(function(){
                        $(this).css("font-weight","bold");
                        $(this).css('cursor', 'pointer');
                    }, function() {
                        $(this).css("font-weight","normal");
                        $(this).css('cursor','auto');
                    });
                }
            });
        });
    };
})(jQuery);
