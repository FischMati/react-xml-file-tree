import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function convertToJSON(element: any): any {
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
      obj[child.type].push(convertToJSON(child));
    } else {
      obj[child.type] = convertToJSON(child);
    }
  });
  return obj;
}

const parseXML = (text: string) => {
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

const fetchApi = async () => {
  const response = await fetch("/api/file-tree");
  const xml = await response.text(); // comes in json format

  console.log(convertToJSON(parseXML(xml)));
}

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetchApi();
  }, [])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
