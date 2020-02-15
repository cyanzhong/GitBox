const colors = require("../constants/colors");

module.exports = callback => {
  $ui.push({
    props: {
      title: "Clone",
      navButtons: [
        {
          symbol: "checkmark.circle",
          handler: () => clone(callback)
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          data: [
            {
              title: "Repository",
              rows: [
                {
                  type: "input",
                  props: {
                    id: "clone-name",
                    bgcolor: colors.white,
                    placeholder: "Repository Name"
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
                      const link = $clipboard.link;
                      if (link && link.length) {
                        const components = link.split("/");
                        sender.text = components.pop() || components.pop();
                      }
                    }
                  }
                },
                {
                  type: "input",
                  props: {
                    id: "clone-url",
                    type: $kbType.url,
                    bgcolor: colors.white,
                    placeholder: "Repository URL (http/https only)"
                  },
                  layout: make => {
                    make.left.right.inset(15);
                    make.top.bottom.inset(0);
                  },
                  events: {
                    ready: sender => {
                      const link = $clipboard.link;
                      if (link && link.length) {
                        sender.text = link;
                      }
                    }
                  }
                }
              ]
            },
            {
              title: "Authentication (Optional)",
              rows: [
                {
                  type: "input",
                  props: {
                    id: "clone-username",
                    type: $kbType.ascii,
                    bgcolor: colors.white,
                    placeholder: "Username"
                  },
                  layout: make => {
                    make.left.right.inset(15);
                    make.top.bottom.inset(0);
                  }
                },
                {
                  type: "view",
                  layout: $layout.fill,
                  views: [
                    {
                      type: "label",
                      props: {
                        text: "Auth Type",
                        font: $font(15)
                      },
                      layout: (make, view) => {
                        make.left.equalTo(22);
                        make.centerY.equalTo(view.super);
                      }
                    },
                    {
                      type: "tab",
                      props: {
                        id: "auth-type",
                        items: ["Password", "Token"]
                      },
                      layout: (make, view) => {
                        make.right.inset(8);
                        make.centerY.equalTo(view.super);
                      },
                      events: {
                        changed: sender => {
                          const field = $("clone-auth");
                          if (sender.index === 0) {
                            field.placeholder = "Password";
                          } else {
                            field.placeholder = "Token";
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  type: "input",
                  props: {
                    id: "clone-auth",
                    type: $kbType.ascii,
                    bgcolor: colors.white,
                    placeholder: "Password",
                    secure: true
                  },
                  layout: make => {
                    make.left.right.inset(15);
                    make.top.bottom.inset(0);
                  }
                },
                {
                  type: "view",
                  layout: $layout.fill,
                  views: [
                    {
                      type: "label",
                      props: {
                        text: "OAuth2 Format",
                        font: $font(15)
                      },
                      layout: (make, view) => {
                        make.left.equalTo(22);
                        make.centerY.equalTo(view.super);
                      }
                    },
                    {
                      type: "tab",
                      props: {
                        id: "clone-format",
                        items: ["Github", "Bitbucket", "GitLab"]
                      },
                      layout: (make, view) => {
                        make.right.inset(8);
                        make.centerY.equalTo(view.super);
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        layout: $layout.fill
      }
    ]
  });
}

function clone(callback) {
  const name = $("clone-name").text;
  const url = $("clone-url").text;
  if (name.length == 0 || url.length == 0) {
    $ui.toast("Please provide name and url");
    return;
  }

  const username = $("clone-username").text;
  const password = $("clone-auth").text;
  const token = $("clone-auth").text;
  const format = ["github", "bitbucket", "gitlab"][$("clone-format").index];
  const query = {
    name,
    url,
    username,
    format,
    token,
  };

  if ($("auth-type").index === 0) {
    query.password = password;
  } else {
    query.token = token;
  }

  $ui.toast("Cloning...");
  $ui.loading(true);

  const bridge = require("../util/bridge");
  bridge.invokeNode(name, "clone", query, ({success}) => {
    $ui.loading(false);
    if (success) {
      $ui.pop();
      if (callback) {
        callback();
      }
    }
  });
}