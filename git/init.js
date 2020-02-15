const git = require("./core");
const query = $context.query;

git.init(query).then(() => {
  const addin = require("addin");
  addin.save({
    name: query.repo,
    path: query.dir
  });
  $jsbox.notify("init");
}).catch(git.onerror);