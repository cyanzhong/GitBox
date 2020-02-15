const git = require("./core");
const query = $context.query;
const dir = query.dir;

(async() => {
  try {
    await git.statusMatrix(query).then(status => {
      return Promise.all(
        status.map(([filepath]) => {
          return git.add({ dir, filepath });
        })
      );
    });
    $jsbox.notify("stageAll");
  } catch (error) {
    git.onerror(error);
  }
})();