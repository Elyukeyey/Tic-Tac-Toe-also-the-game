import React, { useContext } from 'react';
import {AppContext} from '../App.js'

const Select = () => {
    // eslint-disable-next-line
    const { dispatch } = useContext(AppContext);
    const handleClick = (e) => {
        dispatch({type: 'choosePlayer', payload: e.target.id})
        
    };
    return (
        <div className="container">
        <h1>CHOOSE YOUR WARRIOR</h1>
        <button id="x" onClick={handleClick}><h1>X</h1></button> or <button id="o" onClick={handleClick}><h1>O</h1></button>
        </div>
    );
}

export default Select;