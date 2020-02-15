const ui = require("ui");
const git = require("./core");
const query = $context.query;

(async() => {
  try {
    const {index} = await ui.alert({
      title: "Delete Tag",
      message: `Do you want to delete '${query.ref}'?`,
      actions: ["Delete", "Cancel"]
    });
    if (index === 0) {
      await git.deleteTag(query);
    }
    $jsbox.notify("deleteTag");
  } catch (error) {
    git.onerror(error);
  }
})();