import React, {useReducer, createContext} from 'react';
import './App.css';
import Gameboard from './components/Gameboard';
import Select from './components/Select';
import Console from './components/Console';

// reducer action types
export const CONSOLE_LOG = 'CONSOLE_LOG';
export const CHOOSE_PLAYER = 'CHOOSE_PLAYER';
export const CHANGE_TURN = 'CHANGE_TURN';
export const UPDATE_POSITIONS = 'UPDATE_POSITIONS';
export const UPDATE_FIELDS = 'UPDATE_FIELDS';
export const NEW_GAME = 'NEW_GAME';
export const RESET = 'RESET';
export const UPDATE_STATS = 'UPDATE_STATS';

// initState
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
  computer: '',
  round: 1,
  playerPositions: {
    x: [],
    o: []
  },
  stats: {
    player: 0,
    comp: 0
  },
  consoleLogs: [
    {
      text: 'ROUND 1',
      color: 'red',
      show: true
    },
    {
      text: 'Let the **tic tac toe deathmatch** begin...',
      color: 'red',
      show: true
    },
    {
      text: `email bugs with log included to lukam @ nym.hush.com`,
      color: 'green',
      show: true
    },
  ]
}


export const AppContext = createContext(null);

const reducer = (state,action) => {
  switch(action.type) {
    case CHOOSE_PLAYER:
      return { 
        ...state,
        'player': action.payload,
        'computer': (action.payload === 'x') ? 'o' : 'x'
      }
    /*case 'makeMove': 
      return {
        ...state,
        currentGame: action.payload
      };*/
    case CHANGE_TURN:
      return {
        ...state,
        turn: !state.turn
      };
    case UPDATE_POSITIONS: 
      return {
        ...state,
        playerPositions: action.payload,
      };
    case UPDATE_FIELDS:
      return {
        ...state,
        fields: action.payload
    };
    case NEW_GAME: 
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
        turn: true,
        playerPositions: {
          x: [],
          o: []
        },
        round: state.round + 1
      }
    case UPDATE_STATS:
      return {
        ...state,
        stats: action.payload
      };
    case 'reset': 
      return  {
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
        computer: '',
        round: 1,
        playerPositions: {
          x: [],
          o: []
        },
        stats: {
          player: 0,
          comp: 0
        },
        consoleLogs: [
          {
            text: 'ROUND 1',
            color: 'red',
            show: true
          },
          {
            text: 'Let the **tic tac toe deathmatch** begin...',
            color: 'red',
            show: true
          },
          {
            text: `email bugs with log included to lukam @ nym.hush.com`,
            color: 'green',
            show: true
          },
        ]
      }
    case CONSOLE_LOG: 
      return {
        ...state,
        consoleLogs: [action.payload, ...state.consoleLogs]
      };
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
      {(state.player) && <><Gameboard /><Console /></>}
    
    </AppContext.Provider>
    </>
  );
}

export default App;
