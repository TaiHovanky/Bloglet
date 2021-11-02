export const offsetFromCursor = (items: Array<any>, cursor: any, readField: any): number => {
  // Search from the back of the list because the cursor we're
  // looking for is typically the ID of the last item.
  for (let i = items.length - 1; i >= 0; --i) {
    const item = items[i];
    // Using readField works for both non-normalized objects
    // (returning item.id) and normalized references (returning
    // the id field from the referenced entity object), so it's
    // a good idea to use readField when you're not sure what
    // kind of elements you're dealing with.
    if (readField("id", item) === cursor) {
      // Add one because the cursor identifies the item just
      // before the first item in the page we care about.
      return i + 1;
    }
  }
  // Report that the cursor could not be found.
  return -1;
}