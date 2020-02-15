module.exports = async(callback) => {
  const name = await $input.text({
    type: $kbType.ascii,
    placeholder: "Repository Name",
  });

  if (name.length === 0) {
    $delay(0.5, init);
  }

  const bridge = require("../util/bridge");
  bridge.invokeNode(name, "init", () => {
    if (callback) {
      callback();
    }
  });
}