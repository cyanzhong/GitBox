const git = require("./core");
const query = $context.query;

git.log(query).then(commits => {
  $jsbox.notify("log", commits);
}).catch(git.onerror);