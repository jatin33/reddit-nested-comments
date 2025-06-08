import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import NestedCommentsApp from './Comment/NestedCommentsApp';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Comment /> */}
      {/* <div>Hello world</div> */}
      <NestedCommentsApp />
    </>
  );
}

export default App;
