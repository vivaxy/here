/**
 * @since 150524 20:52
 * @author vivaxy
 */
var Color = function (options) {

    this.text = options.text;
    this.map = {
        'black': '0',
        'red': '1',
        'green': '2',
        'yellow': '3',
        'blue': '4',
        'magenta': '5',
        'cyan': '6'
    };

}, p = {};

Color.prototype = p;
p.constructor = Color;

p.coloring = function (color) {
    return '\x1b[3' + this.map[color] + 'm' + this.text + '\x1b[0m';
};

module.exports = function (text, color) {
    return new Color({text: text}).coloring(color);
};
