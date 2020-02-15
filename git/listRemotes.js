const git = require("./core");
const query = $context.query;

git.listRemotes(query).then(remotes => {
  $jsbox.notify("listRemotes", remotes);
}).catch(git.onerror);