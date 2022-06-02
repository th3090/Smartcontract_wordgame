import React, { Component } from 'react'; 
import { Link } from 'react-router-dom'; 
import  { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Test from './Test';
import Web3 from 'web3';
import { summitword } from './Game';
import { summit_total } from './Game';
import {check_submit} from './Game';


let wordgameAddress = '0x342E40102DCdF4b37180Ffaa1afB30C42f6eCA2B';
let wordgameABI = [ { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x8da5cb5b" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor", "signature": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "round_index", "type": "uint256" }, { "indexed": false, "name": "participant_index", "type": "uint256" }, { "indexed": false, "name": "participant", "type": "address" }, { "indexed": false, "name": "fee", "type": "uint256" }, { "indexed": false, "name": "participationTime", "type": "uint256" } ], "name": "PARTICIPATION", "type": "event", "signature": "0x44c9d19fd0e696a4baba85d685148ad8a5607aa35f4592f6d7026b9f026146cb" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "round_index", "type": "uint256" }, { "indexed": false, "name": "participant_index", "type": "uint256" }, { "indexed": false, "name": "participant", "type": "address" }, { "indexed": false, "name": "answerCount", "type": "uint256" }, { "indexed": false, "name": "playtime", "type": "uint256" } ], "name": "SUMMIT", "type": "event", "signature": "0xcd3da99e2107a36ded1a22af815b271eba2467ba618e20d68a645cbf3c01a513" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "round_index", "type": "uint256" }, { "indexed": false, "name": "winner", "type": "address" }, { "indexed": false, "name": "pot", "type": "uint256" } ], "name": "DISTRIBUTE", "type": "event", "signature": "0x40749561de6aca84f85739f425fc79a9fc76d56a57dc6ec6253d55ecb386e7ce" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "round_index", "type": "uint256" }, { "indexed": false, "name": "sender", "type": "address" }, { "indexed": false, "name": "trueAnswerList", "type": "string[]" } ], "name": "START", "type": "event", "signature": "0x3ff541ee0b04b8f762bbcc4b3d86beb98d153624f7a9f51082a13a754678c32c" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "round_index", "type": "uint256" }, { "indexed": false, "name": "winner", "type": "address" }, { "indexed": false, "name": "pot", "type": "uint256" }, { "indexed": false, "name": "next_round", "type": "uint256" } ], "name": "END", "type": "event", "signature": "0x33c481d31f350664201ec71202a57b8cce0cd2ddc126cdb7c83d6361acace040" }, { "constant": false, "inputs": [], "name": "participation", "outputs": [ { "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function", "signature": "0xd3240bd2" }, { "constant": true, "inputs": [], "name": "getPot", "outputs": [ { "name": "pot", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x403c9fa8" }, { "constant": true, "inputs": [ { "name": "index", "type": "uint256" } ], "name": "getParticipantInfo", "outputs": [ { "name": "participant", "type": "address" }, { "name": "participationTime", "type": "uint256" }, { "name": "summitTime", "type": "uint256" }, { "name": "playTime", "type": "uint256" }, { "name": "answerList", "type": "string[]" }, { "name": "answerCount", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xb110c731" }, { "constant": false, "inputs": [ { "name": "summitWords", "type": "string" }, { "name": "summitAnswerList", "type": "string[]" } ], "name": "summit", "outputs": [ { "name": "result", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xac815a5d" }, { "constant": false, "inputs": [], "name": "distribute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xe4fc6b6d" }, { "constant": false, "inputs": [], "name": "_popAndSearchWinner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x0322e7d0" }, { "constant": false, "inputs": [ { "name": "trueAnswerWords", "type": "string" }, { "name": "trueAnswerList", "type": "string[]" } ], "name": "startGame", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x2cc6e29a" }, { "constant": true, "inputs": [ { "name": "index", "type": "uint256" } ], "name": "getGameInfo", "outputs": [ { "name": "gameRound", "type": "uint256" }, { "name": "trueAnswerList", "type": "string[]" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x47e1d550" } ]

var wordstring; // 단어 하나하나 배열
let totalword; //단어 하나로 묶은거
var check_wordsubmit; // 단어 제출했다는 체크값

class Main extends Component {

  constructor(props) {
    super(props);

    this.state = {
      participationRecords: [],
      summitRecords: [],
      resultRecords: [],
      testRecords: [],
      distributeRecords: [],
      pot: '0',
      // startBlock: '0',
      // finalRecords: [{
      //   gameRound: '0',
      //   participant:'0xabcd...',
      //   answerCount: 'ab',
      //   playTime: '0',
      //   pot:'0'
      // }]
    }
  }

  async componentDidMount() {
    await this.initWeb3();
    setInterval(this.pollData, 1000);
    await this.pollData();
    // console.log(this.web3);


    let accounts = await this.web3.eth.getAccounts();
    console.log(`accounts : ${accounts}`);
    let balance = await this.web3.eth.getBalance(accounts[0]);
    console.log(`balance : ${balance}`)
    // let gameInfo = await this.wordgameContract.methods.getGameInfo(1).call()
    // console.log(gameInfo);
    // let parInfo = await this.wordgameContract.methods.getParticipantInfo(0).call()
    // console.log(parInfo);
    // let index = await this.wordgameContract._gameTail;
    // console.log(index)
    // for(let i=0; i < 10; i++){
    //   let gameInfo = await this.wordgameContract.methods.getGameInfo(i).call()
    //   console.log(gameInfo)
    // } 
  }
     

  pollData = async() => {
    await this.getParticipationEvents();
    await this.getPot();
    await this.getSummitEvents();
    await this.getParticipantInfo();
    await this.getDistributeEvents();
    // await this.getFailEvents();
    // await this.makeFinalRecords();
  }

  initWeb3 = async () => {
    if (window.ethereum) {
      wordstring = summitword();
      totalword = summit_total();
      // console.log(`this is wordstring ${wordstring}`);
      // console.log(`this is totalword ${totalword}`);


      if (this.word !== totalword) { // 게임 진행했을 때 
        // console.log(`this is differentttttttttttttttttttttttt    ${totalword}`);
      }
      else{ // 게임 진행 안했을 때 
        // console.log(`this is sameeeeeeeeeeeeeeeeeeeeeeeeeeeee   ${totalword}`);
      }
      // console.log(`이게 게임 페이지에서 넘어온 판단값 ${check_submit}`)
      check_wordsubmit = check_submit;
      // console.log(`대입이 제대로 되었는가? ${check_wordsubmit}`)
      // console.log(`this is cehck_wordsubmitttt ${check_wordsubmit}`)

      console.log('Recent mode')
      this.web3 = new Web3(window.ethereum);
      try {
        // Request account acces if needed
        await window.ethereum.request (
          {
          method : "eth_requestAccounts",
          params: [
            {
            eth_accounts: {}
            }
          ]
        })

      } catch (error) {
        console.log(`User denied account access error : ${error}`)
      }
    }
    else if (window.web3) {
      console.log('legacy mode')
      this.web3 = new Web3(Web3.currentProvider);
    }
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    let accounts = await this.web3.eth.getAccounts();
    this.account = await accounts[0];

    this.wordgameContract = new this.web3.eth.Contract(wordgameABI, wordgameAddress)

    let pot = await this.wordgameContract.methods.getPot().call()
    // console.log(`pot : ${pot}`)

    let owner = await this.wordgameContract.methods.owner().call()
    console.log(`owner : ${owner}`)
  }

  gameStart = async() => {
    let nonce = await this.web3.eth.getTransactionCount(this.account);
    let answerWordList = await ["임산부","잉꼬부부","잉크병","부금","핑크","병세"];
    let answerWords = await "임산부잉꼬부부잉크병부금핑크병세";
    this.wordgameContract.methods.startGame(answerWords, answerWordList).send({from:this.account, value:0, gas:300000, nonce:nonce})
    // let gameInfo = await this.wordgameContract.methods.getGameInfo(1).call()
    // console.log(gameInfo);
  }

  // getGameINfo = async() => {
  //   let index = await this.wordgameContract._gameTail;
  //   console.log(index)
  //   let gameInfo1 = await this.wordgameContract.methods.getGameInfo(index).call()
  //   console.log(index)
  // }

  getPot = async() => {
    let pot = await this.wordgameContract.methods.getPot().call()
    let potString = await this.web3.utils.fromWei(pot.toString(), 'ether')
    this.setState({pot:potString});
  }

  participation = async() => {
    // let nonce = await this.web3.eth.getTransactionCount(this.account);
    this.wordgameContract.methods.participation().send({from:this.account, value:5000000000000000,gas:300000})
    .on('transactionHash', hash => {
      console.log(hash)
    })
  }

  summit = async() => {
    let summitWordList = await wordstring;
    let summitWords = await totalword;
    this.wordgameContract.methods.summit(summitWords, summitWordList).send({from:this.account, value:0, gas:3000000})
  }

  distribute = async => {
    this.wordgameContract.methods.distribute().send({from:this.account, value:0, gas:3000000})
  }

  // 참가 인원 전체 정보 받아오기

    // let parInfo = await this.wordgameContract.methods.getParticipantInfo(0).call()
    // console.log(parInfo);

  getParticipantInfo = async() => {
    const records = [];
    let events = await this.wordgameContract.getPastEvents('PARTICIPATION', {fromBlock:0,toBlock:'latest'});
    // let partInfos = await this.wordgameContract.methods.getParticipantInfo().call()
    for(let i = 0; i < events.length; i+=1){
      const record = {};
      let partInfo = await this.wordgameContract.methods.getParticipantInfo(i).call();
      // console.log(partInfo)
      // record.round_index = parseInt(events[i].returnValues.round_index, 10).toString();
      // record.participant_index = parseInt(partInfo.returnValues.participant_index, 10).toString();
      record.participant = partInfo.participant;
      record.answerCount = partInfo.answerCount;
      record.playtime = partInfo.playTime;
      // console.log(partInfo.playtime);
      records.unshift(record);
    }
    this.setState({testRecords:records})
  }

  getParticipationEvents = async() => {
    const records = [];
    let events = await this.wordgameContract.getPastEvents('PARTICIPATION', {fromBlock:0,toBlock:'latest'});
    // console.log(events);
    for(let i=0; i<events.length;i+=1){
      const record = {}
      record.round_index = parseInt(events[i].returnValues.round_index, 10).toString();
      record.participant = events[i].returnValues.participant;
      record.participationTime = events[i].participationTime;
      records.unshift(record);
    }
    // console.log(records);
    this.setState({participationRecords:records})
    // console.log(this.state.participationRecords)
  }

  getSummitEvents = async() => {
    const records = [];
    let events = await this.wordgameContract.getPastEvents('SUMMIT', {fromBlock:0,toBlock:'latest'});
    // console.log(events);
    for(let i=0; i<events.length;i+=1){
      const record = {}
      record.round_index = parseInt(events[i].returnValues.round_index, 10);
      record.participant_index = parseInt(events[i].returnValues.participant_index, 10).toString();
      record.participant = events[i].returnValues.participant;
      record.answerCount = events[i].returnValues.answerCount;
      record.playtime = events[i].returnValues.playtime;
      if (events[i].returnValues.round_index < this.state.distributeRecords.length) {
        // console.log(`this is in the if  ${i}`)
        for (let j =0; j<this.state.distributeRecords.length; j+=1) {
          // console.log(`this is in the for  ${i} ${j}`)
          if (this.state.distributeRecords[j].round_index == (record.round_index) && this.state.distributeRecords[j].winner == record.participant) {
            // console.log(`this is winner ${this.state.distributeRecords[j].winner}`);
            // console.log(`this is participant ${record.participant}`);
            record.status = "1st"
            break;
          }
          else{
            record.status = "Loser"
          }
        }
      }
      else {
        record.status = "-"
      };
      records.unshift(record);
    }
    // console.log(records);
    this.setState({summitRecords:records})
    // console.log(this.state.summitRecords)
  }

  // for(let j =0; j<this.state.distributeRecords.length; j+=1)
  // if (this.state.distributeRecords[j].round_index == events[i].returnValues.round_index && this.state.distributeRecords[j].winner == events[i].returnValues.participant) {
  //   record.state = "1st"
  // }
  // elif () { events[i].returnValues.round_index > this.state.distributeRecords.length
    
  // }
  // else{
  //   record.state = "Loser"
  // }
  //
  // if (events[i].returnValues.round_index < this.state.distributeRecords.length) {
  //   for (let j =0; j<this.state.distributeRecords.length; j+=1) {
  //     if (this.state.distributeRecords[j].round_index == events[i].returnValues.round_index && this.state.distributeRecords[j].winner == events[i].returnValues.participant) {
  //       record.status = "1st"
  //     }
  //     else{
  //       record.status = "Loser"
  //     }
  //   }
  // }
  // else {
  //   record.status = "-"
  // }

  getDistributeEvents = async() => {
    const records = [];
    let events = await this.wordgameContract.getPastEvents('DISTRIBUTE', {fromBlock:0,toBlock:'latest'});
    // console.log(events);
    for(let i =0; i<events.length;i+=1){
      const record = {}
      record.round_index = events[i].returnValues.round_index;
      record.winner = events[i].returnValues.winner;
      record._pot = events[i].returnValues.pot;
      records.unshift(record);
    }
    this.setState({distributeRecords:records})
    // console.log(this.state.distributeRecords[1].round_index)
    // console.log(this.state.distributeRecords[1].winner)
  }
  



  // getEndEvents = async() => {
  //   const records = [];
  //   let events = await this.wordgameContract.getPastEvents('END', {fromBlock:0,toBlock:'latest'});
  //   // console.log(events);
  //   for(let i=0; i<events.length;i+=1){
  //     const record = {}
  //     record.round_index = parseInt(events[i].returnValues.round_index, 10).toString();
  //     record.participant_index = parseInt(events[i].returnValues.participant_index, 10).toString();
  //     record.participant = events[i].returnValues.participant;
  //     record.answerCount = events[i].answerCount;
  //     record.playtime = events[i].playtime;
  //     records.unshift(record);
  //   }
  //   // console.log(records);
  //   this.setState({summitRecords:records})
  //   // console.log(this.state.summitRecords)
  // }


  render() {
    if(check_wordsubmit){
      // console.log('execute the summitttttttttttt');
      this.summit();
      check_wordsubmit = false;
    }
      
    return (
      <div> 
                  <div className='adbutton'>
        <button className='btn btn-dark btn-lg' onClick={this.gameStart}>Start!</button>
        </div>
        <div className='adbutton2'>
        <button className='btn btn-dark btn-lg' onClick={this.distribute}>Distribute!</button>
      </div>
        <div className="container">
          <h1>가로세로 Game</h1>
          <h2>Current Pot {this.state.pot} </h2>
          <div className="divTime">
            <h3>종료시간!</h3>
            <Test></Test>
          </div>
        </div>
  
      <div className='container'>
        <ul> <Link to=
        {{  pathname : "/game",
          }}>
        <button className='btn btn-primary btn-lg' onClick={this.participation}>Join!</button>
        </Link></ul>
      </div>
{/* 
      <div className='container'>
        <button className='btn btn-danger btn-lg' onClick={this.participation}>Join!</button>
      </div> */}
  
      <br></br>
  
      <div className='container'>
            <table className='table table-dark table-striped'>
              <thead>
                <tr>
                  <th>Game Round</th>
                  <th>Participant Index</th>
                  <th>Address</th>
                  <th>Answer Count</th>
                  <th>Playtime</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.summitRecords.map((record, index) => {
                    return(
                      <tr key={index}>
                        <td>{record.round_index + 1}</td>
                        <td>{record.participant_index}</td>
                        <td>{record.participant}</td>
                        <td>{record.answerCount}</td>
                        <td>{record.playtime}</td>
                        <td>{record.status}</td>
                      </tr>   
                    )
                  })
                }
              </tbody>
            </table>
          </div>
      </div> 
      ); 
    }

};
export default Main;