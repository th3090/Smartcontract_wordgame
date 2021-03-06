import React,{useState}  from 'react';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment/locale/ko';
import { Link,useNavigate,Navigate } from 'react-router-dom'; 
import { useInterval } from 'react-use';
import {Routes, Route} from 'react-router-dom'; 
import Modal1 from './Modal';

const Test2 = () => {
  const [seconds, setSeconds] = useState(Date.now());
  const navigate = useNavigate();
  const [isRedirect, setIsRedirect] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };


  // useInterval
  useInterval(() => {
    setSeconds(Date.now());
  }, 1000);

  const startTime = new Date('2022-06-02T15:30'),
        nowTimeFormat = new Date(seconds);



  return (
    <>
    {startTime - nowTimeFormat > 0 ? 
     (<><Moment fromNow>{startTime}</Moment>&nbsp;게임 종료</>) : 
     (<div>
        <React.Fragment>
            <script>
                openModal();
            </script>
        <Modal1 open={openModal} close={closeModal} header="제출 결과">
            게임 시간 마감으로 게임이 종료되었습니다.
            </Modal1>
        </React.Fragment>
      </div>)
    }  
    </>
  )
}
export default Test2;
