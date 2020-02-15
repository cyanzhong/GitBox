const git = require("../core");

function statusMatrix(query) {

  return new Promise((resolve, reject) => {

    git.statusMatrix(query).then(status => {
      const results = {
        "unstaged": {
          "added": [],
          "modified": [],
          "deleted": []
        },
        "staged": {
          "added": [],
          "modified": [],
          "deleted": []
        }
      };
    
      status.forEach(row => {
        const FILE = row[0];
        const HEAD = row[1];
        const WORKDIR = row[2];
        const STAGE = row[3];
    
        if (HEAD === 0) {
          if (STAGE < 2) {
            results.unstaged.added.push(FILE);
          } else {
            results.staged.added.push(FILE);
          }
        } else if (HEAD === 1) {
          if (WORKDIR === 0) {
            if (STAGE < 2) {
              results.unstaged.deleted.push(FILE);
            } else {
              results.staged.deleted.push(FILE);
            }
          } else if (WORKDIR === 2) {
            if (STAGE < 2) {
              results.unstaged.modified.push(FILE);
            } else {
              results.staged.modified.push(FILE);
            }
          }
        }
      });
    
      resolve(results);
    }).catch(git.onerror);
  });
}

module.exports = statusMatrix;