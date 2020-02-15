exports.check = async() => {
  const url = "https://xteko.com/store/fetch?id=153";
  const {data} = await $http.get(url);
  const latestVersion = data.extension.version;
  const currentVersion = $file.read("version.conf").string;

  if (latestVersion === currentVersion) {
    return;
  }

  const actions = ["Update", "Cancel"];
  const {index} = await $ui.alert({
    title: "Found new version",
    message: "Update to the latest version?",
    actions: actions
  });

  if (index !== 0) {
    return;
  }

  const pkgURL = data.extension.url;
  const pkgName = $addin.current.name;
  const redirURL = `jsbox://import?url=${encodeURIComponent(pkgURL)}&name=${encodeURIComponent(pkgName)}`;
  $app.openURL(redirURL);
  $app.close();
}