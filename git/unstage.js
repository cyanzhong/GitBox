const git = require("./core");
const query = $context.query;

git.remove({
  dir: query.dir,
  filepath: query.path
}).then(() => {
  $jsbox.notify("unstage");
}).catch(git.onerror);