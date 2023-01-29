// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import React, { createContext, useContext, useState } from 'react'

const CountContext = createContext();

const CountProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  return <CountContext.Provider value={{ count, setCount }}>{children}</CountContext.Provider>
};

const useCount = () => {
  const context = useContext(CountContext);

  if (!context) {
    throw new Error('useCount must be used within the CountProvider');
  }

  return context;
};

const CountDisplay = () => {
  const { count } = useCount();
  return <div>{`The current count is ${count}`}</div>
};

const Counter = () => {
  const { setCount } = useCount();
  const increment = () => setCount(c => c + 1);
  return <button onClick={increment}>Increment count</button>;
};

const App = () => (
  <div>
    <CountProvider>
      <CountDisplay />
      <Counter />
    </CountProvider>
  </div>
);

export default App;
