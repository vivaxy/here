/**
 * @since 150524 20:36
 * @author vivaxy
 */
new WebSocket('ws://' + location.host).addEventListener('message', function (message) {
    if (message.data === 'reload') {
        location.reload();
    }
});
