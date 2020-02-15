const git = require("./core");
const query = $context.query;

git.commit(query).then(sha => {
  $jsbox.notify("commit", sha);
}).catch(git.onerror);