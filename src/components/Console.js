import React, {useState, useEffect, useContext} from 'react'
import { AppContext } from '../App';

const Console = () => {
    const {state } = useContext(AppContext);
    const [log,setLog] = useState(state.consoleLogs);
    
    useEffect(()=>{
      setLog(state.consoleLogs);
    },[state]);
    
      return (
        <div className="console">
            { log.map(({text, color, show}, i) => (show) ? <p key={i} className={`console-log ${color}`}>{text}</p> : null)}
        </div>
  );
}

export default Console;