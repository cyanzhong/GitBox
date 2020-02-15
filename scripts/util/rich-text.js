const textFont = $font("Menlo-Regular", 14).ocValue();
const defaultAttributes = createAttributes("#383a42", null);
const deletedAttributes = createAttributes("#c71f24", "#ffebeb");
const insertedAttributes = createAttributes("#007757", "#e8fcf3");

exports.build = diffs => {

  const result = $objc("NSMutableAttributedString").$new();
  let inserted = 0;
  let deleted = 0;

  for (const diff of diffs) {
    let attributes = defaultAttributes;
    if (diff.removed) {
      ++deleted;
      attributes = deletedAttributes;
    } else if (diff.added) {
      ++inserted;
      attributes = insertedAttributes;
    }

    const string = $objc("NSAttributedString").$alloc().$initWithString_attributes(
      diff.value,
      attributes
    );
    
    result.$appendAttributedString(string);
  }

  return {
    text: result,
    inserted: inserted,
    deleted: deleted,
  };
}

function createAttributes(textColor, backgroundColor) {
  const attributes = $objc("NSMutableDictionary").$new();
  attributes.$setObject_forKey(textFont, "NSFont");

  if (textColor) {
    attributes.$setObject_forKey($color(textColor).ocValue(), "NSColor");
  }

  if (backgroundColor) {
    attributes.$setObject_forKey($color(backgroundColor).ocValue(), "NSBackgroundColor");
  }

  return attributes;
}