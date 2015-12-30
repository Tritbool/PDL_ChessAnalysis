/* jshint
    laxcomma:true
    , laxbreak:true
    , node:true
*/

(function($) {
    $.fn.myPlugin = function(data) {
        var dataSet = data.games;
        $(document).ready(function() {
            var table = $('#list-games').DataTable( {
                order           : [[ 1, "desc" ]]
                , data          : dataSet
                , scrollY       : '50vh'
                , scrollCollapse: true
                , lengthMenu    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Tous"]]
                , pagingType    : "full_numbers"
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
                        $(this).css("color","#755F4E");
                        $(this).css('background-color', '#F0D9B5');
                    }, function() {
                        $(this).css("font-weight","normal");
                        $(this).css('cursor','auto');
                        $(this).css("color","black");
                        $(this).css('background-color', '');
                    });
                }
            });
        });
    };
})(jQuery);
