const git = require("./core");
const query = $context.query;

git.addRemote(query).then(() => {
  $jsbox.notify("addRemote");
}).catch(git.onerror);