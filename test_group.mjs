const groupItems = (items) => {
  return items.reduce((acc, item) => {
    if (!acc[item.subcategoryId]) acc[item.subcategoryId] = [];
    acc[item.subcategoryId].push(item);
    return acc;
  }, {});
}
