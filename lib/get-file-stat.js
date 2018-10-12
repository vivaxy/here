/**
 * @since 2015-11-23 10:14
 * @author vivaxy
 */

const fs = require('fs');

module.exports = (file) => {
  return new Promise((resolve, reject) => {
    return fs.lstat(file, (err, stat) => {
      if (err) {
        reject(err);
      } else {
        resolve(stat);
      }
    });
  });
};
