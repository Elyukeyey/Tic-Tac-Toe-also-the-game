import React, {useReducer, createContext} from 'react';
import './App.css';
import Gameboard from './components/Gameboard';
import Select from './components/Select';
import Console from './components/Console';

import {startPosition, playerPositions} from './logic';


const initialState = {
  fields: [    
    {id: 1, taken: ''},
    {id: 2, taken: ''},
    {id: 3, taken: ''},
    {id: 4, taken: ''},
    {id: 5, taken: ''},
    {id: 6, taken: ''},
    {id: 7, taken: ''},
    {id: 8, taken: ''},
    {id: 9, taken: ''}
  ],
  turn: true,
  player: '',
  playerPositions: {
    x: [],
    o: []
  },
  stats: {
    x: 0,
    o: 0
  },
}


export const AppContext = createContext(null);

const reducer = (state,action) => {
  switch(action.type) {
    case 'choosePlayer':
      return { 
        ...state,
        'player': action.payload 
      }
    case 'makeMove': 
      return {
        ...state,
        currentGame: action.payload
      };
    case 'changeTurn':
      return {
        ...state,
        turn: !state.turn
      };
    case 'updatePositions': 
      return {
        ...state,
        playerPositions: action.payload,
      };
    case 'updateFields':
      return {
        ...state,
        fields: action.payload
    };
    case 'newGame': 
      return {
        ...state,
        fields: [    
          {id: 1, taken: ''},
          {id: 2, taken: ''},
          {id: 3, taken: ''},
          {id: 4, taken: ''},
          {id: 5, taken: ''},
          {id: 6, taken: ''},
          {id: 7, taken: ''},
          {id: 8, taken: ''},
          {id: 9, taken: ''}
        ],
        playerPositions: {
          x: [],
          o: []
        },
        stats: action.payload
      }
    case 'reset': 
      return {
        fields: [    
          {id: 1, taken: ''},
          {id: 2, taken: ''},
          {id: 3, taken: ''},
          {id: 4, taken: ''},
          {id: 5, taken: ''},
          {id: 6, taken: ''},
          {id: 7, taken: ''},
          {id: 8, taken: ''},
          {id: 9, taken: ''}
        ],
        turn: true,
        player: '',
        playerPositions: {
          x: [],
          o: []
        },
        stats: {
          x: 0,
          o: 0
        },
      }
    default:
      throw new Error();
  }
}


function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  

  return (
    <>
    <AppContext.Provider value={{state,dispatch}}>
    
      {(!state.player) && <Select />}
      {(state.player) && <><Gameboard /></>}
    
    </AppContext.Provider>
    </>
  );
}

export default App;
