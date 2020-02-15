const bridge = require("../util/bridge");
const states = {
  tags: []
};

exports.open = repo => {

  $ui.push({
    props: {
      title: "Tags",
      navButtons: [
        {
          symbol: "tag",
          handler: () => {
            addTag(repo);
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          id: "tags-list"
        },
        layout: $layout.fill,
        events: {
          didSelect: async(sender, indexPath, tag) => {
            const {index} = await $ui.menu(["Push", "Delete"]);
            if (index === 0) {
              pushTag(repo, tag);
            } else if (index === 1) {
              deleteTag(repo, tag);
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
  bridge.invokeNode(repo, "listTags", (tags) => {
    states.tags = tags;
    $("tags-list").data = tags;
    $ui.loading(false);
  });
}

function addTag(repo) {
  $input.text({
    type: $kbType.ascii,
    placeholder: "Tag Name"
  }).then(tag => {
    bridge.invokeNode(repo, "tag", {
      ref: tag
    }, () => {
      $ui.toast("Done");
      refresh(repo);
    });
  });
}

function pushTag(repo, tag) {
  const push = require("./push");
  push(repo, tag);
}

function deleteTag(repo, tag) {
  bridge.invokeNode(repo, "deleteTag", {
    ref: tag
  }, () => {
    refresh(repo);
  });
}