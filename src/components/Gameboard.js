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
      // if someone wins or isn't player turn
      if(stopGame.reset || !state.turn) {
        return;
      }
      // if it's a valid click (on an empty field)
      if (state.fields[e.target.id].taken === '') {
        let turn = (state.turn) ? state.player : (state.player === 'x') ? 'o' : 'x';

        // map new player positions
        mapNewPositions(turn,e.target.id);

        // change to CHANGE_TURN
        dispatch({type: CHANGE_TURN});
        dispatch({type: CONSOLE_LOG,
                  payload:{
                    show: false,
                    color: '',
                    text: `turn: ${(state.turn) ? 'player' : 'comp'},\n move: ${moves},\n `,
                    fields: state.fields
        }});
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

    // download the log file
    const handleDownload = (e) => {
      let date = new Date()
      if(state.consoleLogs && state.consoleLogs.length > 3){
        let data = 'data:text/json;charset=utf8,' + JSON.stringify(state.consoleLogs);
        let filename = `tictactoe-log_${date.getFullYear()}-${date.getMonth()}-${date.getDay()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.json`
        e.target.setAttribute('href', data);
        e.target.setAttribute('download', filename);
        //e.target.click();
      } else {
        e.preventDefault();
      }
    }

    // everything with updating state.
    useEffect(()=> {
      let {win, reset, x, o} = gameOver(winCombinations,state.playerPositions);
      let player, comp, countdown;

      if (state.player === 'x') {
          player = x;
          comp = o;
      } else {
          player = o;
          comp = x;
      }
      // display turns
      dispatch({type: CONSOLE_LOG, payload: { text: (state.turn) ? 'Player turn ...':'Computer turn ...', color: '', show: true}});
      
      // if end game
      if(reset === true) {
        let updatedStats = {
            player: (player) ? state.stats.player + 1 : state.stats.player,
            comp: (comp) ? state.stats.comp + 1 : state.stats.comp
          }

        if(win.length === 0) {
          dispatch({type: CONSOLE_LOG, payload: { text: `Player: ${updatedStats.player} Comp: ${updatedStats.comp}`,color: `green`, show: true}});
          dispatch({type: CONSOLE_LOG, payload: { text: `~~~~SCORE~~~~`,color: `green`, show: true}});
          dispatch({type:CONSOLE_LOG, payload: {text: `DRAW!`, color: `red`, show: true}});
        } else {
          dispatch({type: UPDATE_STATS, payload: updatedStats});
          dispatch({type: CONSOLE_LOG, payload: { text: `Player: ${updatedStats.player} Comp: ${updatedStats.comp}`,color: `green`, show: true}});
          dispatch({type: CONSOLE_LOG, payload: { text: `~~~~SCORE~~~~`,color: `green`, show: true}});
          dispatch({type: CONSOLE_LOG, payload: { text: `winning combo: ${win.sort()}`, color:'red', show: true}});
          dispatch({type: CONSOLE_LOG, payload: { text: `${(player) ? 'PLAYER WINS!' : 'COMPUTER WINS'}`, color: (player) ? 'green' : 'red', show: true}}); 
        }
        
        // restart game in 6,5s
        setTimeout(()=> {
            dispatch({type: NEW_GAME });
            setMoves(1);
            setStopGame({x: false, o:false, win: [], reset:false});
          }, 6500); 
          

          // countdown to new game, with console logs
          let fiveSeconds = 5;
          countdown = setInterval(() => {
            if(fiveSeconds === 5) {
              dispatch({type: CONSOLE_LOG, payload: { text: `New game starting in: ${fiveSeconds}s ...`, color: 'red', show: true}});
            } else if (fiveSeconds < 5 && fiveSeconds > 0) {
              dispatch({type: CONSOLE_LOG, payload: { text: `${fiveSeconds}s ...`, color: 'red', show: true}});
            } else if (fiveSeconds === 0) {
              dispatch({type: CONSOLE_LOG, payload: { text: `NEW GAME!`, color: 'green', show: true}});
              dispatch({type: CONSOLE_LOG, payload: {
                text: 'Let the **tic tac toe deathmatch** begin... again.',
                color: 'red', 
                show: true
              },});
              clearInterval(countdown); // stop counting down
            }
            fiveSeconds--;
          }, 1000);

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
            {state.fields.map(({id, taken}, idx)=><div key={id} id={idx} onClick={handleClick} className={`field field-${id} ${(stopGame.win.filter(x=>x===id).length>0)? 'win' : ''} ${(state.turn && taken === '') ? 'point glow' : ''}`}><h1 className="field-content">{taken}</h1></div>)}
          </div>
        </main>
        <div className="reset margin-top-30"><a href="#reset" onClick={handleReset}>QUIT GAME</a></div>
        <div className="reset margin-top-15"><a href="#log" onClick={handleDownload}>download log</a></div>
      </div>
      </>
    );
}

export default Gameboard