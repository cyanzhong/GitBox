exports.codeFolder = (() => {
  const path = $file.absolutePath("/");
  const comps = path.split("/");
  comps.pop();
  return comps.join("/");
})();