import React from 'react'; 
import { Link } from 'react-router-dom'; 
import  { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';


const Main = (props) => { 
    const [minutes, setMinutes] = useState(2);
    const [seconds, setSeconds] = useState(0);

    
    useEffect(() => {
        const countdown = setInterval(() => {
        if (parseInt(seconds) > 0) {
            setSeconds(parseInt(seconds) - 1);
        }
        if (parseInt(seconds) === 0) {
            if (parseInt(minutes) === 0) {
            clearInterval(countdown);
            } else {
            setMinutes(parseInt(minutes) - 1);
            setSeconds(59);
            }
        }
        }, 1000);
        return () => clearInterval(countdown);
    }, [minutes, seconds]);

    //const history = useHistory();

    return ( 
    <div> 
    <div className="container">
            <h1>가로세로 Game</h1>
            <h2>Current Pot</h2>
            <div className="divTime">
      <h3>종료시간!</h3>
      <div>
        <h3>
          {minutes}:{seconds}
        </h3>
      </div>
    </div>
    </div>

    <div className='container'>
        <ul> <Link to=
        {{  pathname : "/game",
            state : {minute : minutes,
                    second : seconds,
                    },
        }}>
        <button className='btn btn-danger btn-lg'>Bet and Game!</button>
        </Link></ul>
    </div>

    <div className='container'>
        <ul> <Link to=
        {{  pathname : "/test",
            state : {minute : minutes,
                    second : seconds,
                    },
        }}>
        <button className='btn btn-danger btn-lg'>Test</button>
        </Link></ul>
    </div>

    <br></br>

    <div className='container'>
          <table className='table table-dark table-striped'>
            <thead>
              <tr>
                <th>Index</th>
                <th>Address</th>
                <th>challenge</th>
                <th>Answer</th>
                <th>Pot</th>
                <th>Status</th>
                <th>answerBlockNumber</th>
              </tr>
            </thead>
            <tbody>
              {
                <tr>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr> 
              }
            </tbody>
          </table>
        </div>
    </div> 
    ); 
}; 
export default Main;
