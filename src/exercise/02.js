// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import React, { useCallback, useEffect, useReducer, useState } from 'react';

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

const useAsync = (initialState) => {
  const [state, dispatch] = useReducer(asyncReducer, initialState);

  const run = useCallback(async (promise) => {
    if (!promise) {
      return;
    }

    dispatch({ type: 'pending' });

    try {
      const data = await promise;
      dispatch({ type: 'resolved', data });
    } catch (error) {
      dispatch({ type: 'rejected', error });
    }
  }, []);

  return { ...state, run };
};

const PokemonInfo = ({ pokemonName }) => {
  const { data: pokemon, status, error, run } = useAsync({
    status: pokemonName ? 'pending' : 'idle'
  });

  useEffect(() => {
    if (!pokemonName) {
      return
    }

    const pokemonPromise = fetchPokemon(pokemonName)
    run(pokemonPromise)
  }, [pokemonName, run]);

  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
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
