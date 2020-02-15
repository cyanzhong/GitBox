const git = require("./core");
const query = $context.query;

(async() => {
  try {
    await git.config({
      dir: query.dir,
      path: "user.name",
      value: query.name
    });
    await git.config({
      dir: query.dir,
      path: "user.email",
      value: query.email
    });
    $jsbox.notify("setConfig");
  } catch (error) {
    git.onerror(error);
  }
})();