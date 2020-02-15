const fs = require("fs");
const jsdiff = require("diff");
const git = require("./core");
const readFileInBranch = require("./util/readFileInBranch");
const query = $context.query;
const dir = query.dir;

git.currentBranch(query).then(branch => {
  getFileChanges(dir, query.path, branch || "HEAD", query.type).then(results => {
    $jsbox.notify("fileChanges", results);
  });
}).catch(git.onerror);

async function getFileChanges(dir, filepath, branch, type) {
  let oldFile = "";
  let newFile = "";

  if (type === "modified" || type === "deleted") {
    oldFile = await readFileInBranch(dir, filepath, branch);
  }
  
  if (type === "modified" || type === "added") {
    newFile = fs.readFileSync(dir + "/" + filepath, "utf8");
  }
  
  const changes = jsdiff.diffLines(oldFile, newFile, {
    newlineIsToken: true
  });
  return changes;
}