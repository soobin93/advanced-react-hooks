// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import React, { useEffect, useReducer, useState } from 'react';

import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon';

const asyncReducer = (state, action) => {
  switch (action.type) {
    case 'pending': {
      return { status: 'pending', data: null, error: null }
    }
    case 'resolved': {
      return { status: 'resolved', data: action.data, error: null }
    }
    case 'rejected': {
      return { status: 'rejected', data: null, error: action.error }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
};

const useAsync = (callback, initialState, dependencies) => {
  const [state, dispatch] = useReducer(asyncReducer, initialState);

  useEffect(() => {
    const promise = callback();

    if (!promise) {
      return
    }

    dispatch({ type: 'pending' });

    promise.then(
      data => {
        dispatch({ type: 'resolved', data })
      },
      error => {
        dispatch({ type: 'rejected', error })
      },
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return state;
};

const PokemonInfo = ({ pokemonName }) => {
  const state = useAsync(() => {
    if (!pokemonName) {
      return
    }

    return fetchPokemon(pokemonName);
  }, {
    status: pokemonName ? 'pending' : 'idle',
    data: null,
    error: null,
  }, [pokemonName]);

  const { data, status, error } = state;

  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={data} />
    default:
      throw new Error('This should be impossible')
  };
};

const App = () => {
  const [pokemonName, setPokemonName] = useState('');

  const handleSubmit = (newPokemonName) => setPokemonName(newPokemonName);

  const handleReset = () => setPokemonName('');

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  );
};

const AppWithUnmountCheckbox = () => {
  const [mountApp, setMountApp] = useState(true);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  );
};

export default AppWithUnmountCheckbox;
