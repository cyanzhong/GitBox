const colors = require("../constants/colors");

module.exports = callback => {

  $ui.push({
    props: {
      title: "Add Remote",
      navButtons: [
        {
          symbol: "checkmark.circle",
          handler: () => addRemote(callback)
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          data: [
            {
              title: "Info",
              rows: [
                {
                  type: "input",
                  props: {
                    id: "remote-label",
                    type: $kbType.ascii,
                    bgcolor: colors.white,
                    placeholder: "Remote"
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
                    id: "url-label",
                    type: $kbType.url,
                    bgcolor: colors.white,
                    placeholder: "URL"
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
}

function addRemote(callback) {
  const remote = $("remote-label").text;
  const url = $("url-label").text;
  
  if (remote.length == 0 || url.length == 0) {
    $ui.toast("Please provide remote and url");
    return;
  }
  
  if (callback) {
    $ui.pop();
    callback({remote, url});
  }
}