/**
 * @since 150201 11:50
 * @author vivaxy
 */
document.body.innerHTML += '<p>js ok</p>';

var socket = new WebSocket('ws://127.0.0.1:13000');
socket.onopen = function () {
    console.log(arguments);
};
socket.onclose = function () {
    console.log(arguments);
};
socket.onmessage = function (data) {
    console.log(data);
    if (data.data === 'reload'){
        location.reload();
    }
};
socket.onerror = function () {
    console.log(arguments);
};
