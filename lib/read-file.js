/**
 * @since 2015-11-20 20:09
 * @author vivaxy
 */

const fs = require('fs');

module.exports = (file) => {
  return new Promise((resolve, reject) => {
    return fs.readFile(file, (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
};
