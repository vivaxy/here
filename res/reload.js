/**
 * @since 150524 20:36
 * @author vivaxy
 */
new WebSocket('ws://127.0.0.1:13000').addEventListener('message', function (message) {
    if (message.data === 'reload') {
        location.reload();
    }
});
