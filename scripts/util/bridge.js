const fs = require("../util/fs");

exports.invokeNode = (repo, cmd, query, handler) => {
  if (typeof query === "function") {
    handler = query;
    query = {};
  }
  
  query = query || {};
  query.repo = repo;
  query.dir = `${fs.codeFolder}/${repo}`;

  $nodejs.run({
    path: `git/${cmd}.js`,
    query: query,
    listener: {
      id: cmd,
      handler: handler
    }
  });
  
  $nodejs.listen("onerror", () => {
    $ui.loading(false);
  });
}