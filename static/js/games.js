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
                    $('#list-games').find("tbody").find("tr").each(function(){
                        var res = $(this).find(":last-child").text();
                        if (res === "0"){
                            $(this).find(":last-child").html(" 1 - 0 ");
                        }
                        else if (res === "1"){
                            $(this).find(":last-child").html(" 0 - 1 ");
                        }
                        if (res === "2"){
                            $(this).find(":last-child").html("1/2 - 1/2");
                        }
                        $(this).find(":last-child").css('text-align','center');
                    });
                }
            });
        });
    };
})(jQuery);
