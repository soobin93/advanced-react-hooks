// useDebugValue: useMedia
// http://localhost:3000/isolated/exercise/06.js

import React, { useDebugValue, useEffect, useState } from 'react'

const useMedia = (query, initialState = false) => {
  const [state, setState] = useState(initialState);
  useDebugValue({ query, state }, ({ query, state }) => `${query} => ${state}`);

  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);

    const onChange = () => {
      if (!mounted) {
        return
      }

      setState(Boolean(mql.matches));
    };

    mql.addListener(onChange);
    setState(mql.matches);

    return () => {
      mounted = false
      mql.removeListener(onChange)
    };
  }, [query])

  return state;
}

const Box = () => {
  const isBig = useMedia('(min-width: 1000px)');
  const isMedium = useMedia('(max-width: 999px) and (min-width: 700px)');
  const isSmall = useMedia('(max-width: 699px)');
  const color = isBig ? 'green' : isMedium ? 'yellow' : isSmall ? 'red' : null;

  return <div style={{ width: 200, height: 200, backgroundColor: color }} />;
}

const App = () => {
  return <Box />;
}

export default App;
