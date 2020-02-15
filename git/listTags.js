const git = require("./core");
const query = $context.query;

git.listTags(query).then(tags => {
  $jsbox.notify("listTags", tags);
});