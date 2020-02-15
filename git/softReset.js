const git = require("./core");
const resetHEAD = require("./util/resetHEAD");
const query = $context.query;
const dir = query.dir;

(async() => {
  try {
    const branch = await git.currentBranch(query);
    await resetHEAD(dir, "HEAD~1", branch || "HEAD", true);
    $jsbox.notify("softReset");
  } catch (error) {
    git.onerror(error);
  }
})();