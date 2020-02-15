const git = require("./core");
const query = $context.query;

git.add({
  dir: query.dir,
  filepath: query.path
}).then(() => {
  $jsbox.notify("stage");
}).catch(git.onerror);