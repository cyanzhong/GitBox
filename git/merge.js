const git = require("./core");
const ui = require("ui");
const query = $context.query;

git.currentBranch(query).then(ours => {
  query.ours = ours;
}).catch(git.onerror);

(async() => {
  
  try {
    const ours = await git.currentBranch(query);
    query.ours = ours;

    const {index} = await ui.alert({
      title: "Merge",
      message: `Do you want to merge '${query.theirs}' into '${ours}'?`,
      actions: ["Merge", "Cancel"]
    });

    if (index === 0) {
      const result = await git.merge(query);
      $jsbox.notify("merge", result);
    }
  } catch (error) {
    git.onerror(error);
  }
})();