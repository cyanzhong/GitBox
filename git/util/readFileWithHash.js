const git = require("../core");

async function readFileWithHash(dir, sha, filepath) {
  const { object: blob } = await git.readObject({
    dir: dir,
    oid: sha,
    filepath: filepath,
    encoding: "utf8"
  });
  return blob;
}

module.exports = readFileWithHash;