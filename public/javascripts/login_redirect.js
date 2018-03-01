if(!localStorage.getItem('auth_token')){
    $(location).attr('href', '/');
}