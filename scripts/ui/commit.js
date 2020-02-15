const colors = require("../constants/colors");
const bridge = require("../util/bridge");

module.exports = repo => {

  $ui.push({
    props: {
      title: "Commit",
      navButtons: [
        {
          symbol: "checkmark.circle",
          handler: () => {
            commit(repo);
          }
        },
        {
          symbol: "person.circle",
          handler: () => {
            config(repo);
          }
        }
      ]
    },
    views: [
      {
        type: "text",
        props: {
          id: "commit-message",
          bgcolor: colors.lightBackground,
          placeholder: "Commit message...",
          smoothRadius: 6
        },
        layout: (make, view) => {
          make.left.top.right.inset(6);
          make.height.equalTo(240);
        },
        events: {
          ready: sender => {
            $delay(0.5, () => {
              sender.focus();
            });
          }
        }
      }
    ]
  });
}

function config(repo) {
  const config = require("./config");
  config(repo);
}

function commit(repo) {
  const message = $("commit-message").text;
  if (message.length == 0) {
    $ui.toast("Invalid commit message");
    return;
  }

  bridge.invokeNode(repo, "getConfig", config => {
    const name = config.name;
    const email = config.email;

    if (name == null || email == null) {
      $ui.toast("Invalid name or email");
      return;
    }

    const author = {name, email};
    bridge.invokeNode(repo, "commit", {author, message}, sha => {
      if (sha.length > 0) {
        $ui.pop();
        $ui.toast("Done");
      } else {
        $ui.toast("Failed to commit");
      }
    });
  });
}