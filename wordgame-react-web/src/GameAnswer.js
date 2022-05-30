
import React,{Component} from "react";
import { Link } from 'react-router-dom'; 

import  { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import "./App.css";
import Modal1 from './Modal';
import Test from './Test'

//export default function Game({location}) {
export default function GameAnswer(props) {


  return (
    <div>
        <h2>정답</h2>
        <section className="sc_new cs_crossword" data-dss-logarea="x8k">
            <div className="api_subject_bx" id="_calLayerLiveBroadcastDbSearch">
                <div className="api_cs_wrap _crossword_puzzle_wrap"> 
                    <div className="main_box">
                    <div className="quiz_area">
                        <div className="puz _puzzle_box_wrap q_5x5" style={{display: 'inline-block'}}>
                            <div className="cell x5 y1 _cell _x5_y1">
                                <span className="num vrt c_3" style={{display: 'inline-block'}}><em>1</em></span>
                                <input type="text" class="form-control" maxlength = '1' value = "임" readonly></input>
                            </div>
                            <div className="cell x5 y2 _cell _x5_y2">
                                <input type="text" class="form-control" maxlength = '1' value = "산" readonly></input>
                            </div>
                            <div className="cell x2 y3 _cell _x2_y3 _firstletter _2-across-0 _2-down-0">
                                <span className="num hrz c_4" style={{display: 'inline-block'}}><em>2</em></span>
                                <input type="text" class="form-control" maxlength = '1' value = "잉" readonly></input>
                            </div>
                            <div className="cell x3 y3 _cell _x3_y3">
                                <input type="text" class="form-control" maxlength = '1' value = "꼬" readonly></input>
                            </div>
                            <div className="cell x4 y3 _cell _x4_y3 _3-down-0">
                                <span className="num vrt c_2" style={{display: 'inline-block'}}><em>3</em></span>
                                <input type="text" class="form-control" maxlength = '1' value = "부" readonly></input>
                            </div>
                            <div className="cell x5 y3 _cell _x5_y3">
                                <input type="text" class="form-control" maxlength = '1' value = "부" readonly></input>
                            </div>
                            <div className="cell x1 y4 _cell _x1_y4 _firstletter _4-across-0">
                                <span className="num hrz c_2"><em>4</em></span>
                                <input type="text" class="form-control" maxlength = '1' value = "핑" readonly></input>
                            </div>
                            <div className="cell x2 y4 _cell _x2_y4">
                                <input type="text" class="form-control" maxlength = '1' value = "크" readonly></input>
                            </div>
                            <div className="cell x4 y4 _cell _x4_y4">
                                <input type="text" class="form-control" maxlength = '1' value = "금" readonly></input>
                            </div>
                            <div className="cell x2 y5 _cell _x2_y5 _5-across-0">
                                <span className="num hrz c_2"><em>5</em></span>
                                <input type="text" class="form-control" maxlength = '1' value = "명" readonly ></input>
                            </div>
                            <div className="cell x3 y5 _cell _x3_y5">
                                <input type="text" class="form-control" maxlength = '1' value = "세" readonly></input>
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
                        </div>                      
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </section>
        <div className="GameAnswer">
            <Link to = "/"><button type="button" class="btn btn-secondary">메인화면</button></Link>
        </div>
   </div>
     );
}

