exports.open = () => {

  $ui.render({
    props: {
      title: "GitBox",
      navButtons: [
        {
          symbol: "ellipsis.circle",
          handler: settings
        },
        {
          symbol: "plus.circle",
          handler: async() => {
            const {index} = await $ui.menu(["Clone repository", "Initialize repository"]);
            if (index === 0) {
              clone();
            } else if (index === 1) {
              init();
            }
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          id: "repo-list",
          template: [
            {
              type: "image",
              props: {
                symbol: "tray.full",
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
                id: "repo-label",
                font: $font(17)
              },
              layout: (make, view) => {
                make.centerY.equalTo(view.super);
                make.left.equalTo(48);
              }
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: async(sender, indexPath, data) => {
            const repo = data["repo-label"]["text"];
            const actions = require("./repoActions");
            actions.show(repo);
          }
        }
      }
    ]
  });

  refresh();
}

function clone() {
  const clone = require("./clone");
  clone(refresh);
}

function init() {
  const init = require("./init");
  init(refresh);
}

function settings() {
  const readme = require("./readme");
  readme.open();
}

function refresh() {
  const fs = require("../util/fs");
  const folder = fs.codeFolder;
  const names = $file.list(folder).sort();
  
  const repos = names.filter(name => {
    return $file.exists(`${folder}/${name}/.git`);
  });

  $("repo-list").data = repos.map(repo => {
    return {
      "repo-label": {
        "text": repo
      }
    };
  });
}