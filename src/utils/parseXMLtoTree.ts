const parseXMLToTree = (text: string) => {
  let isReadingTag = false;
  let isReadingClose = false;
  let reader = 0;
  const stack: any[] = [];
  let currentContent = "";
  let currentTag = "";
  const buffer = text.trim();

  while (reader < buffer.length) {
    if (buffer[reader] === "<") {
      currentContent.trim();
      isReadingTag = true;
    } else if (buffer[reader] === "/" && isReadingTag) {
      isReadingClose = true;
    } else if (buffer[reader] === ">") {
      isReadingTag = false;
      currentContent = currentContent.trim();
      currentTag = currentTag.trim();

      if (isReadingClose) {

        currentTag = currentTag.slice(1);
        const elem = stack.pop();

        if (currentContent) {
          elem.value = currentContent;
        }

        let parent = stack.pop();

        if (parent) {
          parent.value.push(elem);
          stack.push(parent);
        } else {
          stack.push(elem); //last read
        }

        currentContent = "";
        currentTag = "";
        isReadingClose = false;
      } else {
        stack.push({ type: currentTag, value: [] });
        currentContent = "";
        currentTag = "";
      }

    }

    if (isReadingTag && buffer[reader] !== "<") {
      currentTag += buffer[reader];
    } else if (!isReadingTag && buffer[reader] !== ">") {
      currentContent += buffer[reader];
    }

    reader++;
  }

  return stack.pop();
}

export default parseXMLToTree