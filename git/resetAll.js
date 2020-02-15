const fs = require("fs");
const ui = require("ui");
const git = require("./core");
const statusMatrix = require("./util/statusMatrix");
const resetHEAD = require("./util/resetHEAD");
const query = $context.query;
const dir = query.dir;

(async() => {
  const {index} = await ui.alert({
    title: "Destructive",
    message: "All uncommitted changes will be lost, including modifications, creations, and deletions.",
    actions: ["Later", "Reset"]
  });

  if (index !== 1) {
    return;
  }

  try {
    const branch = await git.currentBranch(query);
    await resetHEAD(dir, "HEAD~1", branch || "HEAD");
    const status = await statusMatrix(query);

    status.unstaged.added.forEach(name => {
      fs.unlinkSync(dir + "/" + name);
    });

    $jsbox.notify("resetAll");
  } catch (error) {
    git.onerror(error);
  }
})();