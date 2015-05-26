/**
 * @since 150524 20:36
 * @author vivaxy
 */
new WebSocket('ws://127.0.0.1:13000').onmessage = function (data) {
    if (data.data === 'reload') {
        location.reload();
    }
};
