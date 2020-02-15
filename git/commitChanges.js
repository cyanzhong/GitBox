const jsdiff = require("diff");
const readFileWithHash = require("./util/readFileWithHash");
const query = $context.query;
const dir = query.dir;

(async() => {
  let oldFile = "";
  let newFile = "";

  if (query.type === "modified" || query.type === "deleted") {
    oldFile = await readFileWithHash(dir, query.hash1, query.filepath);
  }
  
  if (query.type === "modified" || query.type === "added") {
    newFile = await readFileWithHash(dir, query.hash2, query.filepath);
  }

  const changes = jsdiff.diffLines(oldFile, newFile, {
    newlineIsToken: true
  });
  $jsbox.notify("commitChanges", changes);
})();