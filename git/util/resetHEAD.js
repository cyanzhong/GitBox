const fs = require("fs");
const git = require("../core");

async function reset(dir, ref, branch, soft=false) {
  const match = ref.match(/^HEAD~([0-9]+)$/);
  if (match) {
    const count = +match[1];
    const commits = await git.log({ fs, dir, depth: count + 1 });
    const commit = commits.pop().oid;
    return new Promise((resolve, reject) => {
      fs.writeFile(dir + `/.git/refs/heads/${branch}`, commit, err => {
        if (err) {
          return reject(err);
        }
        if (soft) {
          resolve();
        } else {
          fs.unlink(dir + "/.git/index", err => {
            if (err) {
              return reject(err);
            }
            git.checkout({ dir, fs, ref: branch }).then(resolve).catch(git.onerror);
          });
        }
      });
    });
  }
  return Promise.reject(`Wrong ref ${ref}`);
}

module.exports = reset;