const git = require("./core");
const query = $context.query;

git.deleteRemote(query).then(() => {
  $jsbox.notify("deleteRemote");
}).catch(git.onerror);