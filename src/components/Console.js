import React, {useContext} from 'react'
import { AppContext } from '../App';

const Console = () => {
    const {state} = useContext(AppContext);

    const {x, o} = state.playerPositions;
    return (
        <div className="console">
            <div key={x}>x positions: {(x) ? x.map(e=><span key={e}>{e} ,</span>) : null }</div>
            <div key={o}>o positions: {(o) ? o.map(e=><span key={e}>{e} ,</span>) : null }</div>    
        </div>
  );
}

export default Console;