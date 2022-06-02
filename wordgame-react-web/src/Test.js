import React,{useState}  from 'react';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment/locale/ko';
import { Link,useNavigate,Navigate } from 'react-router-dom'; 
import { useInterval } from 'react-use';
import {Routes, Route} from 'react-router-dom';


const Test = () => {
  const [seconds, setSeconds] = useState(Date.now());
  const [delay, setDelay] = useState(1000);
  const [isrunning,setIsRunning] = useState(true);


  // useInterval
  useInterval(() => {
    setSeconds(Date.now());
  }, 1000 );

  const startTime = new Date('2022-06-02T15:30'),
        nowTimeFormat = new Date(seconds);

  return (
    <>
    {startTime - nowTimeFormat > 0 ? 
     (<><Moment fromNow>{startTime}</Moment>&nbsp;게임 종료</>) : 
     (
      <div className='container'>
        <ul> <Link to=
        {{  pathname : "/gameanswer",
        }}>
        <button className='btn btn-danger btn-lg'>정답보기</button>
        </Link></ul>
      </div>)
    }  
    </>
  )
}
export default Test;
