const bridge = require("../util/bridge");
const inputInfo = require("./inputInfo");

module.exports = (repo, ref) => {
  inputInfo(repo, "Push", query => {
    $ui.toast("Pushing...");
    $ui.loading(true);

    if (ref) {
      query.ref = ref;
    }
    
    bridge.invokeNode(repo, "push", query, response => {
      $ui.loading(false);
      if (response.ok) {
        $ui.pop();
        $ui.toast("Done");
      } else if (response.errors) {
        alert(JSON.stringify(response.errors));
      }
    });
  });
}