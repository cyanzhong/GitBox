const fs = require("fs");
const git = require("./core");
const readFileInBranch = require("./util/readFileInBranch");
const query = $context.query;
const dir = query.dir;

if (query.type === "added") {
  fs.unlinkSync(dir + "/" + query.path);
  $jsbox.notify("resetFile");
} else {
  git.currentBranch(query).then(branch => {
    const filepath = query.path;
    readFileInBranch(dir, filepath, branch || "HEAD").then(content => {
      const path = dir + "/" + filepath;
      fs.writeFileSync(path, content);
      $jsbox.notify("resetFile");
    });
  }).catch(git.onerror);
}