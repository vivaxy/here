/**
 * @since 150201 11:50
 * @author vivaxy
 */

'use strict';

document.body.innerHTML += '<p>js ok</p>';

var ajax = function () {
    var req = new XMLHttpRequest();
    req.open('GET', './mock-server/ajax', true);
    req.addEventListener('readystatechange', function () {
        if (req.readyState === 4 && req.status === 200) {
            var response = JSON.parse(req.responseText);
            console.log(response);
        }
    });
    req.send();
};

let image = new Image();
image.src = 'folder/icon-search.png?_=' + new Date().getTime();
document.body.appendChild(image);
