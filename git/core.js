const fs = require("fs");
const EventEmitter = require("events");
const ui = require("ui");

const git = require("isomorphic-git");
git.plugins.set("fs", fs);

const emitter = new EventEmitter();
git.plugins.set("emitter", emitter);

emitter.on("message", message => {
  console.log(message);
});

git.onerror = error => {
  ui.alert({
    title: error.message,
    actions: ["OK"]
  });
  $jsbox.notify("onerror");
}

module.exports = git;