const colors = require("../constants/colors");
const bridge = require("../util/bridge");

module.exports = (repo, title, callback) => {

  $ui.push({
    props: {
      title: title,
      navButtons: [
        {
          symbol: "checkmark.circle",
          handler: () => done(repo, callback)
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          data: [
            {
              title: "Authentication (Optional)",
              rows: [
                {
                  type: "input",
                  props: {
                    id: "input-username",
                    type: $kbType.ascii,
                    bgcolor: colors.white,
                    placeholder: "Username"
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
                        ready: sender => {
                          const type = $cache.get("auth-type") || 0;
                          sender.index = type;
                          setAuthType(type);
                        },
                        changed: sender => {
                          const type = sender.index;
                          $cache.set("auth-type", type);
                          setAuthType(type);
                        }
                      }
                    }
                  ]
                },
                {
                  type: "input",
                  props: {
                    id: "input-auth",
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
                        id: "input-format",
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

  bridge.invokeNode(repo, "getConfig", config => {
    if (config.name) {
      $("input-username").text = config.name;
    }
  });
}

function setAuthType(type) {
  const field = $("input-auth");
  if (type === 0) {
    field.placeholder = "Password";
  } else {
    field.placeholder = "Token";
  }
}

function done(repo, callback) {
  const username = $("input-username").text;
  const password = $("input-auth").text;
  const token = $("input-auth").text;
  const format = ["github", "bitbucket", "gitlab"][$("input-format").index];
  const query = {
    repo,
    username,
    format,
    token,
  };

  if ($("auth-type").index === 0) {
    query.password = password;
  } else {
    query.token = token;
  }

  if (callback) {
    callback(query);
  }
}