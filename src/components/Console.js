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
            { log.map(({text, color}, i) => <p key={i} className={`console-log ${color}`}>{text}</p>)}
        </div>
  );
}

export default Console;