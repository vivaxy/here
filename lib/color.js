/**
 * @since 150524 20:52
 * @author vivaxy
 */
var Color = function (options) {

    this.text = options.text;
    this.map = {
        'red': '\x1b[31m',
        'green': '\x1b[36m',
        'clear': '\x1b[0m'
    };

}, p = {};

Color.prototype = p;
p.constructor = Color;

p.coloring = function (color) {
    return this.map[color] + this.text + this.map['clear'];
};

module.exports = function (text, color) {
    return new Color({text: text}).coloring(color);
};
