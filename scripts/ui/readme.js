exports.open = () => {
  $ui.push({
    props: {
      title: "README",
      navButtons: [
        {
          symbol: "tray.full",
          handler: () => {
            $app.openURL("http://github.com/cyanzhong/GitBox");
          }
        }
      ]
    },
    views: [
      {
        type: "markdown",
        props: {
          content: $file.read("README.md").string
        },
        layout: $layout.fill
      }
    ]
  });
}