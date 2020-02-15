const ui = require("ui");
const git = require("./core");
const statusMatrix = require("./util/statusMatrix");
const query = $context.query;

statusMatrix({
  dir: query.dir
}).then(status => {
  const changed = status.unstaged.modified.length > 0 || status.staged.modified.length > 0;
  const pull = () => {
    git.pull(query).then(() => {
      $jsbox.notify("pull");
    }).catch(git.onerror);
  }

  if (changed) {
    ui.alert({
      title: "Destructive",
      message: "There are uncommitted changes, you can commit them first.",
      actions: ["Later", "Discard & Pull"]
    }).then(selected => {
      if (selected.index === 1) {
        pull();
      }
    });
  } else {
    pull();
  }
});