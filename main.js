const explorer = require("./scripts/ui/repoExplorer");
explorer.open();

const updater = require("./scripts/util/updater");
updater.check();