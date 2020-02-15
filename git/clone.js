const git = require("./core");
const query = $context.query;

git.clone(query).then(() => {
  const addin = require("addin");
  addin.save({
    name: query.name,
    path: query.dir
  });
  $jsbox.notify("clone", {success: true});
}).catch(error => {
  git.onerror(error);
  $jsbox.notify("clone", {success: false});
});