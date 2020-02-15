const bridge = require("../util/bridge");
const states = {
  remotes: []
};

module.exports = repo => {

  $ui.push({
    props: {
      title: "Remotes",
      navButtons: [
        {
          symbol: "plus.circle",
          handler: () => {
            addRemote(repo);
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          id: "remotes-list",
          rowHeight: 52,
          template: [
            {
              type: "label",
              props: {
                id: "label",
                lines: 2
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.centerY.equalTo(view.super);
              }
            }
          ],
          actions: [
            {
              title: "DELETE",
              handler: (sender, indexPath) => {
                const remote = states.remotes[indexPath.row]["remote"];
                deleteRemote(repo, remote);
              }
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            const remote = states.remotes[indexPath.row]["url"];
            $clipboard.text = remote;
            $ui.toast("Copied");
          }
        }
      }
    ]
  });

  refresh(repo);
}

function refresh(repo) {
  $ui.loading(true);
  bridge.invokeNode(repo, "listRemotes", remotes => {
    states.remotes = remotes;
    $("remotes-list").data = remotes.map(item => {
      return {
        "label": {
          "text": `(${item.remote}) ${item.url}`
        }
      };
    });
    $ui.loading(false);
  });
}

function addRemote(repo) {
  const addRemote = require("./addRemote");
  addRemote(info => {
    bridge.invokeNode(repo, "addRemote", info, () => {
      refresh(repo);
    });
  });
}

function deleteRemote(repo, remote) {
  bridge.invokeNode(repo, "deleteRemote", {remote});
}