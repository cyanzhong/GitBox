const bridge = require("../util/bridge");

exports.open = repo => {

  $ui.push({
    props: {
      titleView: {
        type: "tab",
        props: {
          id: "state-tab",
          items: ["Unstaged", "Staged"],
          bgcolor: $rgb(240, 240, 240)
        },
        events: {
          changed: () => {
            refresh(repo);
          }
        }
      },
      navButtons: [
        {
          symbol: "list.dash",
          handler: async() => {
            const options = ["Stage All", "Unstage All", "Reset All"];
            const {index} = await $ui.menu(options);
            if (index === 0) {
              stageAll(repo);
            } else if (index === 1) {
              unstageAll(repo);
            } else if (index === 2) {
              resetAll(repo);
            }
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          id: "status-list",
          stickyHeader: false,
          template: [
            {
              type: "label",
              props: {
                id: "status-label",
                font: $font(17)
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.centerY.equalTo(view.super);
              }
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: async(sender, indexPath, data) => {
            const type = data["status-label"]["type"];
            const path = data["status-label"]["path"];
            const options = ["Diff", "Reset"];

            if (isUnstagedTab()) {
              options.push("Stage");
            } else {
              options.push("Unstage");
            }

            const {title} = await $ui.menu(options);
            if (title === "Diff") {
              diff(repo, path, type);
            } else if (title === "Reset") {
              reset(repo, path, type);
            } else if (title === "Unstage") {
              unstage(repo, path);
            } else if (title === "Stage") {
              stage(repo, path);
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
  bridge.invokeNode(repo, "statusMatrix", status => {
    const data = [];
    const convert = (type, path) => {
      return {
        "status-label": {
          "text": path,
          "path": path,
          "type": type
        }
      };
    }

    const push = (title, change, type) => {
      const rows = change.map(x => convert(type, x));
      if (rows.length > 0) {
        data.push({
          title: title,
          rows: rows
        });
      }
    }

    const array = isUnstagedTab() ? status.unstaged : status.staged;
    push("Added", array.added, "added");
    push("Modified", array.modified, "modified");
    push("Deleted", array.deleted, "deleted");

    const view = $("status-list");
    view.data = data;
    $ui.loading(false);
  });
}

function isUnstagedTab() {
  return $("state-tab").index === 0;
}

function diff(repo, path, type) {
  bridge.invokeNode(repo, "fileChanges", {
    path, type
  }, diffs => {
    const util = require("../util/rich-text");
    const viewer = require("./diff");
    viewer.open(util.build(diffs));
  });
}

function reset(repo, path, type) {
  bridge.invokeNode(repo, "resetFile", {
    path, type
  }, () => {
    $ui.toast("Done");
    refresh(repo);
  });
}

function stage(repo, path) {
  bridge.invokeNode(repo, "stage", {
    path: path
  }, () => {
    $ui.toast("Done");
    refresh(repo);
  });
}

function unstage(repo, path) {
  bridge.invokeNode(repo, "unstage", {
    path: path
  }, () => {
    $ui.toast("Done");
    refresh(repo);
  });
}

function stageAll(repo) {
  $ui.loading(true);
  bridge.invokeNode(repo, "stageAll", () => {
    $ui.loading(false);
    $ui.toast("Done");
    refresh(repo);
  });
}

function unstageAll(repo) {
  $ui.loading(true);
  bridge.invokeNode(repo, "unstageAll", () => {
    $ui.loading(false);
    $ui.toast("Done");
    refresh(repo);
  });
}

function resetAll(repo) {
  bridge.invokeNode(repo, "resetAll", () => {
    $ui.toast("Done");
    refresh(repo);
  });
}