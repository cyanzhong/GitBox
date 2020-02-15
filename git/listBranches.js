const git = require("./core");
const query = $context.query;

(async() => {
  try {
    const branches = await git.listBranches(query);
    const current = await git.currentBranch(query);
    $jsbox.notify("listBranches", {
      branches: branches.filter(branch => branch !== "HEAD"),
      current: current
    });
  } catch (error) {
    git.onerror(error);
  }
})();