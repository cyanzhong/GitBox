exports.open = diff => {

  $ui.push({
    props: {
      title: `+${diff.inserted} -${diff.deleted}`
    },
    views: [
      {
        type: "text",
        props: {
          editable: false
        },
        layout: $layout.fill,
        events: {
          ready: sender => {
            sender.ocValue().$setAttributedText(diff.text);
          }
        }
      }
    ]
  });
}