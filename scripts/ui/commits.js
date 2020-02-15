const bridge = require("../util/bridge");
let _commits = [];

exports.open = repo => {

  $ui.push({
    props: {
      title: "Commits",
      navButtons: [
        {
          symbol: "command",
          handler: async() => {
            const {index} = await $ui.menu(["Soft Reset HEAD~1"]);
            if (index === 0) {
              softResetHEAD1(repo);
            }
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          id: "commits-list",
          rowHeight: 110,
          template: [
            {
              type: "label",
              props: {
                id: "message-line",
                font: $font("bold", 17)
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.height.equalTo(25);
                make.top.equalTo(5);
              }
            },
            {
              type: "label",
              props: {
                id: "commit-line"
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.height.equalTo(25);
                make.top.equalTo(30);
              }
            },
            {
              type: "label",
              props: {
                id: "author-line"
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.height.equalTo(25);
                make.top.equalTo(55);
              }
            },
            {
              type: "label",
              props: {
                id: "date-line"
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.height.equalTo(25);
                make.top.equalTo(80);
              }
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: async(sender, indexPath) => {
            const commit = _commits[indexPath.row];
            const options = ["View Changes", "Checkout", "Copy Commit SHA"];
            const {index} = await $ui.menu(options);
            if (index === 0) {
              changes(repo, commit);
            } else if (index === 1) {
              checkout(repo, commit);
            } else if (index === 2) {
              copySHA(repo, commit);
            }
          }
        }
      }
    ]
  });

  refresh(repo);
}

function refresh(repo) {
  $ui.loading(true);
  bridge.invokeNode(repo, "log", commits => {
    _commits = commits;
    const view = $("commits-list");
    view.data = commits.map(commit => {
      return {
        "message-line": {
          "text": commit.message
        },
        "commit-line": {
          "text": `commit ${commit.oid}`
        },
        "author-line": {
          "text": `Author: ${commit.author.name} <${commit.author.email}>`
        },
        "date-line": {
          "text": `${new Date(commit.author.timestamp * 1000)}`
        }
      }
    });
    $ui.loading(false);
  });
}

function changes(repo, commit) {
  const hash2 = commit.oid;
  const hash1 = commit.parent[0] || hash2;
  bridge.invokeNode(repo, "stateChanges", {
    hash1: hash1,
    hash2: hash2,
  }, results => {
    const stateChanges = require("./stateChanges");
    stateChanges.open(repo, hash1, hash2, results);
  });
}

function checkout(repo, commit) {
  bridge.invokeNode(repo, "checkout", {
    ref: commit.oid
  }, () => {
    $ui.toast("Done");
  });
}

function copySHA(repo, commit) {
  $clipboard.text = commit.oid;
  $ui.toast("Copied");
}

function softResetHEAD1(repo) {
  bridge.invokeNode(repo, "softReset", () => {
    $ui.toast("Done");
    refresh(repo);
  });
}