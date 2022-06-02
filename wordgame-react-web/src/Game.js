import React,{Component} from "react";
import  { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import "./App.css";
import Modal1 from './Modal';
import Test2 from './Test2';
import Web3 from 'web3';

let wordstring; 
var arr;

export var check_submit = false;
console.log(`this is game page check_submit ${check_submit}`)

export default function Game(props) {

  let [inputvalue1,setInputValue1] = useState("");
  let [inputvalue2,setInputValue2] = useState("");
  let [inputvalue3,setInputValue3] = useState("");
  let [inputvalue4,setInputValue4] = useState("");
  let [inputvalue5,setInputValue5] = useState("");
  let [inputvalue6,setInputValue6] = useState("");
  let [inputvalue7,setInputValue7] = useState("");
  let [inputvalue8,setInputValue8] = useState("");
  let [inputvalue9,setInputValue9] = useState("");
  let [inputvalue10,setInputValue10] = useState("");
  let [inputvalue11,setInputValue11] = useState("");

  let word1 = inputvalue1 + inputvalue2 + inputvalue5; // 임산부
  let word2 = inputvalue3 + inputvalue4 + inputvalue5 + inputvalue6; // 잉꼬부부
  let word3 = inputvalue3 + inputvalue8 + inputvalue10; // 잉크병
  let word4 = inputvalue5 + inputvalue9; // 부금
  let word5 = inputvalue7 + inputvalue8; // 핑크
  let word6 = inputvalue10 + inputvalue11; // 병세


  wordstring = word1 + word2 + word3 + word4 + word5 + word6;
  //wordstring = word1.concat(word2,word3,word4,word5,word6);
  //wordstring = wordstring.replace(/\,/g,"");
  arr = new Array(word1,word2,word3,word4,word5,word6); // 단어 하나하나 

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
   
    const countdown = setInterval(() => {
      if (parseInt(seconds) >= 0) {
          setSeconds(parseInt(seconds) + 1);
      }
      if (parseInt(seconds) === 60) {
          if (parseInt(minutes) === 10) {
          clearInterval(countdown);
          } else {
          setMinutes(parseInt(minutes) + 1);
          setSeconds(0);
          }
      }
      }, 1000);
      return () => clearInterval(countdown);
  }, [minutes, seconds]);

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
  <div>
   <div className="divTime">
      <h1>종료!</h1>
      <Test2></Test2>
   </div>
   <div className="divTime2">
      <h1>시작!</h1>
      <div>
         <h2>
            {minutes}:{seconds}
         </h2>
      </div>
   </div>
   <section className="sc_new cs_crossword" data-dss-logarea="x8k">
      <div className="api_subject_bx" id="_calLayerLiveBroadcastDbSearch">
         <div className="api_cs_wrap _crossword_puzzle_wrap"> 
            <div className="main_box">
               <div className="quiz_area">
                  <div className="puz _puzzle_box_wrap q_5x5" style={{display: 'inline-block'}}>
                     <div className="cell x5 y1 _cell _x5_y1">
                        <span className="num vrt c_3" style={{display: 'inline-block'}}><em>1</em></span>
                        <input type="text" class="form-control" maxlength = '1' onChange={(event) => setInputValue1(event.target.value)}></input>
                     </div>
                     <div className="cell x5 y2 _cell _x5_y2">
                        <input type="text" class="form-control" maxlength = '1' onChange={(event) => setInputValue2(event.target.value)}></input>
                     </div>
                     <div className="cell x2 y3 _cell _x2_y3 _firstletter _2-across-0 _2-down-0">
                        <span className="num hrz c_4" style={{display: 'inline-block'}}><em>2</em></span>
                        <input type="text" class="form-control" maxlength = '1' onChange={(event) => setInputValue3(event.target.value)}></input>
                     </div>
                     <div className="cell x3 y3 _cell _x3_y3">
                        <input type="text" class="form-control" maxlength = '1' onChange={(event) => setInputValue4(event.target.value)}></input>
                     </div>
                     <div className="cell x4 y3 _cell _x4_y3 _3-down-0">
                        <span className="num vrt c_2" style={{display: 'inline-block'}}><em>3</em></span>
                        <input type="text" class="form-control" maxlength = '1' onChange={(event) => setInputValue5(event.target.value)}></input>
                     </div>
                     <div className="cell x5 y3 _cell _x5_y3">
                        <input type="text" class="form-control" maxlength = '1' onChange={(event) => setInputValue6(event.target.value)}></input>
                     </div>
                     <div className="cell x1 y4 _cell _x1_y4 _firstletter _4-across-0">
                        <span className="num hrz c_2"><em>4</em></span>
                        <input type="text" class="form-control" maxlength = '1' onChange={(event) => setInputValue7(event.target.value)}></input>
                     </div>
                     <div className="cell x2 y4 _cell _x2_y4">
                        <input type="text" class="form-control" maxlength = '1' onChange={(event) => setInputValue8(event.target.value)}></input>
                     </div>
                     <div className="cell x4 y4 _cell _x4_y4">
                        <input type="text" class="form-control" maxlength = '1' onChange={(event) => setInputValue9(event.target.value)}></input>
                     </div>
                     <div className="cell x2 y5 _cell _x2_y5 _5-across-0">
                        <span className="num hrz c_2"><em>5</em></span>
                        <input type="text" class="form-control" maxlength = '1' onChange={(event) => setInputValue10(event.target.value)} ></input>
                     </div>
                     <div className="cell x3 y5 _cell _x3_y5">
                        <input type="text" class="form-control" maxlength = '1' onChange={(event) => setInputValue11(event.target.value)}></input>
                     </div>
                  </div>
                  <div className="qtn _question_wrap">
                  <div className="_question_list">
                      <div className="qtn_hrz">
                        <strong>가로 문제</strong> 
                        <ul className="_across_list">
                            <li className="_question" data-info="2-across">2 다정하고 금실이 좋은 부부를 비유적으로 이르는 말. ‘원앙 부부’로 순화</li>
                            <li className="_question" data-info="4-across">4 ‘분홍색’과 같은 말</li>
                            <li className="_question" data-info="5-across">5 병의 상태나 형세</li>
                        </ul>
                      </div>
                      <div className="qtn_vrt">
                        <strong>세로 문제</strong> 
                        <ul className="_down_list">
                            <li className="_question" data-info="1-down">1 임부와 산부를 아울러 이르는 말</li>
                            <li className="_question" data-info="2-down">2 잉크를 담아 두는 병</li>
                            <li className="_question" data-info="3-down">3 ‘부과금’과 같은 말</li>
                        </ul>
                      </div>
                  </div>
                  <div class="like_area">
                    <div class="puz_btn">
                    <React.Fragment>
                      <button type="button" class="btn btn-secondary" onClick={() => {summit_total();summitword();openModal();}}>제출하기</button>
                      <Modal1 open={modalOpen} close={closeModal} header="제출 결과">
                       정말 제출하시겠습니까? (다시 도전 할 수 없습니다.)
                      </Modal1>
                    </React.Fragment>
                    </div>
                  </div>
                </div>
               </div>
            </div>
         </div>
      </div>
   </section>
   
  </div>  
  );
}

export function summitword() { // 단어 하나하나
   console.log(`this is each of word hoho ${arr}`);
   return arr;
}


export function summit_total() { // 전체 문자열
   console.log(`this is  one string total word hoho ${wordstring}`);
   return wordstring;
}

export function changevalue(){
  console.log(`게임 페이지에서 changevalue 잘 실행됨 현재 판단닶 ${check_submit}`)
  check_submit = true;
  console.log(`게임 페이지에서 true로 바꿈. 잘 실행됨 현재 판단닶 ${check_submit}`)

}
