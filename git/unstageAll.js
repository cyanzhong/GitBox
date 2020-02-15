const git = require("./core");
const query = $context.query;
const dir = query.dir;

(async() => {
  try {
    await git.statusMatrix(query).then(status => {
      return Promise.all(
        status.map(([filepath]) => {
          return git.remove({ dir, filepath });
        })
      );
    });
    $jsbox.notify("unstageAll");
  } catch (error) {
    git.onerror(error);
  }
})();