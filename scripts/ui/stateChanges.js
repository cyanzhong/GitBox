const bridge = require("../util/bridge");

exports.open = (repo, hash1, hash2, data) => {
  $ui.push({
    props: {
      title: hash2
    },
    views: [
      {
        type: "list",
        props: {
          data: data.map(item => `(${item.type}) ${item.path}`)
        },
        layout: $layout.fill,
        events: {
          didSelect: async(sender, indexPath) => {
            const change = data[indexPath.row];
            commitChanges(repo, hash1, hash2, change);
          }
        }
      }
    ]
  });
}

function commitChanges(repo, hash1, hash2, change) {
  bridge.invokeNode(repo, "commitChanges", {
    hash1, hash2, filepath: change.path, type: change.type
  }, diffs => {
    const util = require("../util/rich-text");
    const viewer = require("./diff");
    viewer.open(util.build(diffs));
  });
}