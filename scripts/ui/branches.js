const colors = require("../constants/colors");
const bridge = require("../util/bridge");
let _branches = [];

exports.open = repo => {

  $ui.push({
    props: {
      title: "Branches",
      navButtons: [
        {
          symbol: "arrow.branch",
          handler: () => {
            createBranch(repo);
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          id: "branch-list",
          template: [
            {
              type: "label",
              props: {
                id: "branch-name",
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
          didSelect: async(sender, indexPath) => {
            const branch = _branches[indexPath.row];
            const options = ["Checkout", "Merge", "Delete"];
            const {index} = await $ui.menu(options);
            if (index === 0) {
              checkoutBranch(repo, branch);
            } else if (index === 1) {
              mergeBranch(repo, branch);
            } else if (index === 2) {
              deleteBranch(repo, branch);
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
  bridge.invokeNode(repo, "listBranches", null, results => {
    _branches = results.branches;
    const view = $("branch-list");
    view.data = results.branches.map(branch => {
      return {
        "branch-name": {
          "text": branch,
          "textColor": branch === results.current ? colors.selectedText : colors.defaultText
        }
      }
    });
    $ui.loading(false);
  });
}

function checkoutBranch(repo, branch) {
  bridge.invokeNode(repo, "checkout", {
    ref: branch
  }, () => {
    $ui.toast("Done");
    refresh(repo);
  });
}

function createBranch(repo) {
  $input.text({
    type: $kbType.ascii,
    placeholder: "Branch Name"
  }).then(name => {
    bridge.invokeNode(repo, "branch", {
      ref: name
    }, () => {
      $ui.toast("Done");
      refresh(repo);
    });
  });
}

function mergeBranch(repo, branch) {
  bridge.invokeNode(repo, "merge", {
    theirs: branch
  }, () => {
    $ui.toast("Done");
  });
}

function deleteBranch(repo, branch) {
  bridge.invokeNode(repo, "deleteBranch", {
    ref: branch
  }, () => {
    $ui.toast("Done");
    refresh(repo);
  });
}