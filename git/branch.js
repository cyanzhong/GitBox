const git = require("./core");
const query = $context.query;

git.branch(query).then(() => {
  $jsbox.notify("branch");
}).catch(git.onerror);