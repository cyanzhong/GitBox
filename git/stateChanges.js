const git = require("./core");
const query = $context.query;
const dir = query.dir;

const commitHash1 = query.hash1;
const commitHash2 = query.hash2;
getStateChanges(commitHash1, commitHash2, dir).then(results => {
  $jsbox.notify("stateChanges", results.filter(item => item != null));
});

async function getStateChanges(commitHash1, commitHash2, dir) {
  return git.walkBeta1({
    trees: [
      git.TREE({ dir: dir, ref: commitHash1 }),
      git.TREE({ dir: dir, ref: commitHash2 })
    ],
    map: async function([A, B]) {
      // ignore directories
      if (A.fullpath === ".") {
        return;
      }
      await A.populateStat();
      if (A.type === "tree") {
        return;
      }
      await B.populateStat();
      if (B.type === "tree") {
        return;
      }

      // generate ids
      await A.populateHash();
      await B.populateHash();

      // determine modification type
      let type = "equal";
      if (A.oid !== B.oid) {
        type = "modified";
      }

      if (A.oid === undefined) {
        type = "added";
      }
      
      if (B.oid === undefined) {
        type = "deleted";
      }

      if (type === "equal") {
        return null;
      }

      if (A.oid === undefined && B.oid === undefined) {
        console.log("Something weird happened:");
        console.log(A);
        console.log(B);
      }

      return {
        type: type,
        path: A.fullpath
      };
    }
  });
}