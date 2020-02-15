const bridge = require("../util/bridge");
const inputInfo = require("./inputInfo");

exports.show = repo => {

  const options = [
    [
      ["rectangle.stack.badge.plus", "Changes", showChanges],
      ["doc.text.magnifyingglass", "Commits", showCommits],
      ["tuningfork", "Branches", showBranches],
      ["tag", "Tags", showTags],
    ],
    [
      ["arrow.2.circlepath.circle", "Fetch", fetch],
      ["arrow.down.circle", "Pull", pull],
      ["plus.app", "Commit", commit],
      ["arrow.up.circle", "Push", push],
    ]
  ];

  $ui.push({
    props: {
      title: repo,
      navButtons: [
        {
          symbol: "person.circle",
          handler: () => {
            config(repo);
          }
        },
        {
          symbol: "globe",
          handler: () => {
            listRemotes(repo);
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          template: [
            {
              type: "image",
              props: {
                id: "action-icon",
                contentMode: $contentMode.scaleAspectFit
              },
              layout: (make, view) => {
                make.size.equalTo($size(24, 24));
                make.centerY.equalTo(view.super);
                make.centerX.equalTo(view.super.left).offset(24);
              }
            },
            {
              type: "label",
              props: {
                id: "action-label",
                font: $font(17)
              },
              layout: (make, view) => {
                make.centerY.equalTo(view.super);
                make.left.equalTo(48);
              }
            }
          ],
          data: (() => {
            const parse = item => {
              return {
                "action-icon": {
                  "symbol": item[0]
                },
                "action-label": {
                  "text": item[1]
                }
              }
            }
            return [
              {
                title: "View",
                rows: options[0].map(parse)
              },
              {
                title: "Actions",
                rows: options[1].map(parse)
              }
            ]
          })()
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            const handler = options[indexPath.section][indexPath.row][2];
            if (typeof handler === "function") {
              handler(repo);
            }
          }
        }
      }
    ]
  });
}

function showChanges(repo) {
  const changes = require("./changes");
  changes.open(repo);
}

function showCommits(repo) {
  const commits = require("./commits");
  commits.open(repo);
}

function showBranches(repo) {
  const branches = require("./branches");
  branches.open(repo);
}

function showTags(repo) {
  const tags = require("./tags");
  tags.open(repo);
}

function fetch(repo) {
  inputInfo(repo, "Fetch", query => {
    $ui.loading(true);
    bridge.invokeNode(repo, "fetch", query, () => {
      $ui.loading(false);
      $ui.pop();
      $ui.toast("Done");
    });
  });
}

function pull(repo) {
  inputInfo(repo, "Pull", query => {
    $ui.loading(true);
    bridge.invokeNode(repo, "pull", query, () => {
      $ui.loading(false);
      $ui.pop();
      $ui.toast("Done");
    });
  });
}

function commit(repo) {
  const commit = require("./commit");
  commit(repo);
}

function push(repo) {
  const push = require("./push");
  push(repo);
}

function listRemotes(repo) {
  const listRemotes = require("./listRemotes");
  listRemotes(repo);
}

function config(repo) {
  const config = require("./config");
  config(repo);
}