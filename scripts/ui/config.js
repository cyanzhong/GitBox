const colors = require("../constants/colors");
const bridge = require("../util/bridge");

module.exports = (repo, callback) => {
  bridge.invokeNode(repo, "getConfig", config => {
    $ui.push({
      props: {
        title: "Config",
        navButtons: [
          {
            symbol: "checkmark.circle",
            handler: () => {
              const name = $("name-label").text;
              const email = $("email-label").text;
              
              if (name.length == 0 || email.length == 0) {
                $ui.toast("Please provide name and email");
                return;
              }
  
              config = {
                name: name,
                email: email,
              }

              bridge.invokeNode(repo, "setConfig", config, () => {
                $ui.pop();
                if (callback) {
                  callback();
                }
              });
            }
          }
        ]
      },
      views: [
        {
          type: "list",
          props: {
            data: [
              {
                title: "User",
                rows: [
                  {
                    type: "input",
                    props: {
                      id: "name-label",
                      type: $kbType.ascii,
                      bgcolor: colors.white,
                      placeholder: "user.name",
                      text: config.name
                    },
                    layout: make => {
                      make.left.right.inset(15);
                      make.top.bottom.inset(0);
                    },
                    events: {
                      ready: sender => {
                        $delay(0.5, () => {
                          sender.focus();
                        });
                      }
                    }
                  },
                  {
                    type: "input",
                    props: {
                      id: "email-label",
                      type: $kbType.email,
                      bgcolor: colors.white,
                      placeholder: "user.email",
                      text: config.email
                    },
                    layout: make => {
                      make.left.right.inset(15);
                      make.top.bottom.inset(0);
                    }
                  }
                ]
              }
            ]
          },
          layout: $layout.fill
        }
      ]
    });
  });
}