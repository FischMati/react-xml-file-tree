const transformTreeToJSON = (element: any) => {
  // If the value is a string, it's a leaf node
  if (typeof element.value === "string") {
    return element.value;
  }

  // If the value is an array, it means there are nested elements
  const obj: any = {};
  element.value.forEach((child: any) => {
    if (obj[child.type]) {
      // If this key already exists, convert it to an array to handle multiple items with the same key
      if (!Array.isArray(obj[child.type])) {
        obj[child.type] = [obj[child.type]];
      }
      obj[child.type].push(transformTreeToJSON(child));
    } else {
      obj[child.type] = transformTreeToJSON(child);
    }
  });

  return obj;
}

export default transformTreeToJSON