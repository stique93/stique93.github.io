if (location.hash.indexOf("#access_token=") === 0) {
    localStorage.token = location.hash.substring(14, 99);
    localStorage.session = Date.now() + 86400; //Время жизни токена - 86400 секунд
    location.hash = "";
}

if (localStorage.token) {
    loadFriends();
    $("#guest").hide();
    $("#btnAuth").hide();
    $("#msg").hide();
}

function getUrl(method, params) {
    if (!method) throw new Error('Вы не указали метод!');
    params = params || {};
    params['access_token'] = "a6614eebf21a189c9fcd1de2625609f339d173bc8185ebe6281e235b0f69a828af1ae40b2faecef0d4409";//localStorage.token;//"59534866b62096664f533b7fb74543322f87b5aa185ab3c3b384da9b78b4362d279380ec67f036a2fa779";//localStorage.token;
    return 'https://api.vk.com/method/' + method + '?' + $.param(params) + '&v=5.52';
}
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
    sendRequest('users.get', { fields: 'photo_100' }, function (data) {
        $('#user').html(data.response[0].first_name + " " + data.response[0].last_name);
        $('#userAvatar').html('<img src="' + data.response[0].photo_100 + '"/>');
        $('#btnExit').html(' ' + '<button type="button" class="btn btn-secondary" onclick="localStorage.clear(); location.reload();">Выйти</button>');
        $("#user")[0].hidden = false;
    });
    sendRequest('friends.search', { count: 5, fields: 'photo_100,online,sex,bdate' }, function (data) {
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
        case 0: putSex = '<i class="fas fa-restroom"></i>';
            break;
        case 1: putSex = '<i class="fas fa-female"></i>';
            break;
        case 2: putSex = '<i class="fas fa-male"></i>';
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