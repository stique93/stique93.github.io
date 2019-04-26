if (location.hash.indexOf("#access_token=") === 0) {
    localStorage.token = location.hash.substring(14, 99);
    localStorage.session = Date.now() + 86400; //Время жизни токена - 86400 секунд
    location.hash = "";
}

if(localStorage.token){
    loadFriends();
    $("#guest").hide();
    $("#btnAuth").hide();
}


function getUrl(method, params) {
    if (!method) throw new Error('Вы не указали метод!');
    params = params || {};
    params['access_token'] = localStorage.token;//"59534866b62096664f533b7fb74543322f87b5aa185ab3c3b384da9b78b4362d279380ec67f036a2fa779";//localStorage.token;
    return 'https://api.vk.com/method/' + method + '?' + $.param(params) + '&v=5.52';
}
//https://oauth.vk.com/authorize?client_id=6959312&redirect_uri=https://stique93.github.io&scope=friends&response_type=token&v=5.52
function sendRequest(method, params, func) {
    $.ajax({
        url: getUrl(method, params),
        method: 'GET',
        dataType: 'JSONP',
        success: func
    });
}

function loadFriends() {
    //var search = window.document.getElementById('search').value;
    sendRequest('users.get', {fields: 'photo_200'},function (data) {
        $('#user').html(data.response[0].first_name + " " + data.response[0].last_name);
        $('#btnExit').html(' '+'<button type="button" class="btn btn-secondary" onclick="localStorage.clear(); location.reload();">Выйти</button>');
        $("#user")[0].hidden = false;
    });
    sendRequest('friends.search', { count: 5, fields: 'photo_100,online,sex,bdate'}, function (data) {
        friendsList = data.response.items;
        drawFriends(friendsList);
    });
}


function drawFriends(friends) {
    var htmltr = '';
    for (var i = 0; i < friends.length; i++) {
        var friend = friends[i];
        var online = getStatus(friend.online); //friend.online ? 'Online' : 'Offline';
        var sex = getSex(friend.sex);
        htmltr += '<tr>'
            + '<td>' + i + '</td>'
            + '<td>' + friend.id + '</td>'
            + '<td>'
            + '<a target="_blank" href="https://vk.com/id' + friend.id + '">'
            + '<img src="' + friend.photo_100 + '"/>' + '</td>'
            + '<td>' + friend.first_name + ' ' + friend.last_name + '</td>'
            + '<td>' + sex + '</td>'
            + '<td>' + online + '</td>'
            + '</tr>';
    }
    $('tbody').html(htmltr);
}

function getSex(sex) {
    var putSex = '';
    switch (sex) {
        case 0: putSex = 'unknown';
            break;
        case 1: putSex = 'female';
            break;
        case 2: putSex = 'male';
            break;
    }
    return putSex;
}

function getStatus(status) {
    var putStatus = '';
    switch (status) {
        case 0: putStatus = 'offline';
            break;
        case 1: putStatus = 'online';
            break;
    }
    return putStatus;
}
function acceptFilter() {
    loadFriends();
}