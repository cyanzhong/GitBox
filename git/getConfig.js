const git = require("./core");
const query = $context.query;

(async() => {
  try {
    const name = await git.config({
      dir: query.dir,
      path: "user.name"
    });
    const email = await git.config({
      dir: query.dir,
      path: "user.email"
    });
    $jsbox.notify("getConfig", {name, email}); 
  } catch (error) {
    git.onerror(error);
  }
})();