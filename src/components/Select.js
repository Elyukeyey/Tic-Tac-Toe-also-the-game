import React, { useContext } from 'react';
import {AppContext, CHOOSE_PLAYER} from '../App.js'

const Select = () => {
    // eslint-disable-next-line
    const { dispatch } = useContext(AppContext);
    const handleClick = (e) => {
        // change to CHOOSE_PLAYER
        dispatch({type: CHOOSE_PLAYER, payload: e.target.id});   
    };
    return (
        <div className="container">
        <h1>CHOOSE YOUR <span className="red">WARRIOR</span></h1>
        <button id="x" onClick={handleClick}>X</button> or <button id="o" onClick={handleClick}>O</button>
        </div>
    );
}

export default Select;