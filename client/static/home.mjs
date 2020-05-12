export function home_page(socket){
    $('form#username_form').submit(function(event){
                var d = $("input#username").val()
                socket.emit("mon_username",{donnees:d})
                return false;
            });
            
}