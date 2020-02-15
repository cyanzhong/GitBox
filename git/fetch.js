const git = require("./core");
const query = $context.query;

git.fetch(query).then(() => {
  $jsbox.notify("fetch");
}).catch(git.onerror);