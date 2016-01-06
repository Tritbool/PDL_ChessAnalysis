/* jshint
    laxcomma:true
    , laxbreak:true
    , node:true
*/

(function($) {
    $.fn.myPlugin = function(data) {
        $(document).ready(function() {
            var table = $('#list-games').DataTable( {
                order           : [[ 2, "desc" ]]
                , data          : data.players
                , scrollY       : '50vh'
                , scrollCollapse: true
                , lengthMenu    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Tous"]]
                , pagingType    : "full_numbers"
                , iDisplayLength: 25
                , columnDefs    : [
                    {
                        className   : "dt-center"
                        , targets   : [0,1,2]
                    }
                ]
                , columns       : [
                    { width : "7%" }
                    , null
                    , null
                ]
                , language      : {
                    url             : "/static/json/dataTable.french.json"
                }
            });
        });
    };
})(jQuery);
