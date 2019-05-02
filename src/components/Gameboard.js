import React, { useState, useEffect, useContext } from 'react';
import { 
        playerAI, 
        winCombinations,
        gameOver
      } from '../logic.js';
      
import { AppContext } from '../App.js';



const Gameboard = () => {
    const {state,dispatch} = useContext(AppContext);
    const [moves,setMoves] = useState(1);
    const [stopGame,setStopGame] = useState({x: false, o:false, win: [], reset:false});


    const mapNewPositions = (turn,position) => {
      let newPositions = {
        ...state.playerPositions,
        [turn]: [...state.playerPositions[turn], parseInt(position) +1]
      }
      dispatch({type: 'updatePositions', payload: newPositions});
      state.fields[position].taken = turn;
      dispatch({type: 'updateFields', payload: state.fields});
    }

    const handleClick = (e) => {
      // if someone wins
      if(stopGame.reset) {
        return;
      }
      // if it's a valid click (on an empty field)
      if (state.fields[e.target.id].taken === '') {
        let turn = (state.turn) ? state.player : (state.player === 'x') ? 'o' : 'x';

        // map new player positions
        mapNewPositions(turn,e.target.id);

        /*let newPositions = {
          ...state.playerPositions,
          [turn]: [...state.playerPositions[turn], (parseInt(e.target.id) + 1)]
        };
        dispatch({type: 'updatePositions', payload: newPositions})
        // map fields for render
        state.fields[e.target.id].taken = turn;
        dispatch({type: 'updateFields', payload: state.fields});*/

        // change turn
        dispatch({type: 'changeTurn'});
        // count new moves
        setMoves(moves + 1);
        
      }
    }

    const handleReset = () => {
      dispatch({type: 'reset'});
      setStopGame({x: false, o:false, win: [], reset:false})
      setMoves(0);
    };

    useEffect(()=> {
      setStopGame(gameOver(winCombinations,state.playerPositions));
      
      if (moves !== 0){
        let moveAI = {yes: false}
        moveAI = playerAI(state.player,state.turn,moves,state.playerPositions,winCombinations);
        // make a move
        if (moveAI) { 
          setTimeout(()=> {
            mapNewPositions(moveAI.turn, parseInt(moveAI.moveTo)-1); 
            dispatch({type: 'changeTurn'});
            setMoves(moves + 1);
          },700) 
        }
      }
    },[moves]);

    return (
      <div className="container">
        <main>
          <div>Human player: {state.player}</div>
          <div className="game-field">
            {state.fields.map(({id, taken}, idx)=><div key={id} id={idx} onClick={handleClick} className={`field ${(stopGame.win.filter(x=>x===id).length>0)? 'win' : ''}`}><h1 className="field-content">{taken}</h1></div>)}
          </div>
        </main>
        <button onClick={handleReset}>RESET</button>
      </div>
    );
}

export default Gameboard