import React, { useState, useEffect, useContext } from 'react';
import { 
        playerAI, 
        winCombinations,
        gameOver
      } from '../logic.js';
      
import { AppContext, CONSOLE_LOG, UPDATE_POSITIONS, UPDATE_FIELDS, NEW_GAME, CHANGE_TURN, UPDATE_STATS } from '../App.js';



const Gameboard = () => {
    const {state,dispatch} = useContext(AppContext);
    const [moves,setMoves] = useState(1);
    const [stopGame,setStopGame] = useState({x: false, o:false, win: [], reset:false});


    // eslint-disable-next-line
    const mapNewPositions = (turn,position) => {
      let newPositions = {
        ...state.playerPositions,
        [turn]: [...state.playerPositions[turn], parseInt(position) +1]
      }
      // change to UPDATE_POSITIONS
      dispatch({type: UPDATE_POSITIONS, payload: newPositions});
      state.fields[position].taken = turn;
      // change to UPDATE_FIELDS
      dispatch({type: UPDATE_FIELDS, payload: state.fields});
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

        // change to CHANGE_TURN
        dispatch({type: CHANGE_TURN});
        // count new moves
        setMoves(moves + 1);
        
      }
    }

    const handleReset = (e) => {
      e.preventDefault();
      
      // change to RESET
      dispatch({type: 'reset'});
      setStopGame({x: false, o:false, win: [], reset:false})
      setMoves(0);
    };
    // everything with updating state.
    useEffect(()=> {
      let countdown = '';
      let {win, reset, x, o} = gameOver(winCombinations,state.playerPositions);
      let player = true;
      let comp = false;
      let updatedStats = { player: 0, comp: 0 }

      if (state.player === 'x') {
          player = x;
          comp = o;
      } else {
          player = o;
          comp = x;
      }
      
      // display turns
      dispatch({type: CONSOLE_LOG, payload: { text: (state.turn) ? 'Player turn ...':'Computer turn ...', color: ''}});
      
      // if end game
      if(reset === true) {
        if(x || o) {
          updatedStats = {
            player: (player) ? state.stats.player + 1 : state.stats.player,
            comp: (comp) ? state.stats.comp + 1 : state.stats.comp
          }
        }
        
        dispatch({type: UPDATE_STATS, payload: updatedStats});
        if(win.length === 0) {
          dispatch({type:CONSOLE_LOG, payload: {text: `DRAW!`, color: `red`}});
          dispatch({type: CONSOLE_LOG, payload: { text: `Player: ${updatedStats.player} Comp: ${updatedStats.comp}`,color: `green`}});
          dispatch({type: CONSOLE_LOG, payload: { text: `~~~~SCORE~~~~`,color: `green`}});
        } else {
          dispatch({type: CONSOLE_LOG, payload: { text: `winning combo: ${win.sort()}`, color:'red'}});
          dispatch({type: CONSOLE_LOG, payload: { text: `${(player) ? 'PLAYER WINS!' : 'COMPUTER WINS'}`, color: (player) ? 'green' : 'red'}}); 
          dispatch({type: CONSOLE_LOG, payload: { text: `Player: ${updatedStats.player} Comp: ${updatedStats.comp}`,color: `green`}});
          dispatch({type: CONSOLE_LOG, payload: { text: `~~~~SCORE~~~~`,color: `green`}});
        }

        setTimeout(()=> {
            //console.log('Baraka wins ...');
            dispatch({type: NEW_GAME });
            setMoves(1);
            setStopGame({x: false, o:false, win: [], reset:false});
            // close modal
            // dispatch  
          }, 6500); 
          // open reset
          
          let fiveSeconds = 5;
          countdown = setInterval(() => {
            if(fiveSeconds === 5) {
              dispatch({type: CONSOLE_LOG, payload: { text: `New game starting in: ${fiveSeconds}s ...`, color: 'red'}});
            } else if (fiveSeconds < 5 && fiveSeconds > 0) {
              dispatch({type: CONSOLE_LOG, payload: { text: `${fiveSeconds}s ...`, color: 'red'}});
            } else if (fiveSeconds === 0) {
              dispatch({type: CONSOLE_LOG, payload: { text: `NEW GAME!`, color: 'green'}});
              dispatch({type: CONSOLE_LOG, payload: {
                text: 'Let the **tic tac toe deathmatch** begin... again.',
                color: 'red'
              },});
              clearInterval(countdown);
            }
            fiveSeconds--;
          }, 1000);
          //dispatch({type: CONSOLE_LOG, payload: { text: 'RESTARTING GAME IN 5s', color: 'red'}});

          //console.log('win combo: ' + win);                     CL
      }
      setStopGame({x, o, win, reset});
      
      // Computer moves
      if (moves !== 0){
        let moveAI = {yes: false}
        moveAI = playerAI(state.player,state.turn,moves,state.playerPositions,winCombinations);
        // make a move
        if (moveAI) { 
          setTimeout(()=> { // delay for about a second.
            // map new player positions
            mapNewPositions(moveAI.turn, parseInt(moveAI.moveTo)-1); 
            // change to CHANGE_TURN
            dispatch({type: CHANGE_TURN});
            // set moves
            setMoves(moves + 1);
          },900);
        }
      }
    // eslint-disable-next-line
    },[moves]);

    return (
      <>
      <div className="title"><h1>TicTacToe <span className="red">Deathmatch</span></h1></div>
      <div className="container">
        <main>
          <div className="game-field">
            {state.fields.map(({id, taken}, idx)=><div key={id} id={idx} onClick={handleClick} className={`field field-${id} ${(stopGame.win.filter(x=>x===id).length>0)? 'win' : ''}`}><h1 className="field-content">{taken}</h1></div>)}
          </div>
        </main>
        <div className="reset"><a href="#reset" onClick={handleReset}>QUIT GAME</a></div>
      </div>
      </>
    );
}

export default Gameboard