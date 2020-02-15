const git = require("./core");
const query = $context.query;

git.tag(query).then(() => {
  $jsbox.notify("tag");
});