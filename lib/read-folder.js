/**
 * @since 2015-11-23 10:13
 * @author vivaxy
 */

const fs = require('fs');

module.exports = (file) => {
  return new Promise((resolve, reject) => {
    return fs.readdir(file, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
};
