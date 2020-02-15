const git = require("./core");
const query = $context.query;

git.push(query).then(response => {
  $jsbox.notify("push", response);
}).catch(error => {
  git.onerror(error);
  $jsbox.notify("push");
});