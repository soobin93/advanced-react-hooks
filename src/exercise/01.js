// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import React, { useReducer } from 'react'

const countReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + action.step };
    case 'DECREMENT':
      return { count: state.count - action.step };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
};

const Counter = ({ initialCount = 0, step = 1 }) => {
  const [state, dispatch] = useReducer(countReducer, {
    count: initialCount
  });

  const { count } = state;

  const increment = () => dispatch({ type: 'INCREMENT', step });

  return <button onClick={increment}>{count}</button>;
};

const App = () => {
  return <Counter />;
};

export default App
