const statusMatrix = require("./util/statusMatrix");
const query = $context.query;

statusMatrix(query).then(results => {
  $jsbox.notify("statusMatrix", results);
});