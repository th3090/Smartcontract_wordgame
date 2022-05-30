import React from 'react'; 
import { Link } from 'react-router-dom'; 
import  { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Test from './Test'


const Main = (props) => { 
    //const history = useHistory();

    return ( 
    <div> 
    <div className="container">
            <h1>가로세로 Game</h1>
            <h2>Current Pot</h2>
            <div className="divTime">
      <h3>종료시간!</h3>
      <Test></Test>
      
    </div>
    </div>

    <div className='container'>
        <ul> <Link to=
        {{  pathname : "/game",
           
        }}>
        <button className='btn btn-danger btn-lg'>Bet and Game!</button>
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
