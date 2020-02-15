const fs = require("fs");
const git = require("../core");

async function readFileInBranch(dir, filepath, branch) {
  const base = "refs/remotes/origin/";
  const sha = await git.resolveRef({ fs, dir, ref: base + branch });
  const { object: { tree } } = await git.readObject({ fs, dir, oid: sha });
  
  return (async function loop(tree, path) {
    if (!path.length) {
      throw new Error(`File ${filepath} not found`);
    }

    const name = path.shift();
    const { object: { entries } } = await git.readObject({ fs, dir, oid: tree });
    const packageEntry = entries.find(entry => entry.path === name);
    
    if (!packageEntry) {
      throw new Error(`File ${filepath} not found`);
    } else {
      if (packageEntry.type == "blob") {
        const { object: pkg } = await git.readObject({
          fs,
          dir,
          oid: packageEntry.oid
        });
        return pkg.toString("utf8");
      } else if (packageEntry.type == "tree") {
        return loop(packageEntry.oid, path);
      }
    }
  })(tree, filepath.split("/"));
}

module.exports = readFileInBranch;