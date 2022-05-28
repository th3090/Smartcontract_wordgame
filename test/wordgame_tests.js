const Wordgame = artifacts.require("Wordgame"); //Wordgame 'const' 변수 선언 -> build의 Wordgame.json 파일이 필요
const { assert } = require('chai');
const assertRevert = require('./assertRevert'); // 예외 처리 try-catch(2-4)
const expectEvent = require('./expectEvent'); // 이벤트 처리 (2-4)

function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
  }

contract('Wordgame', function([deployer, user1, user2, user3, user4, user5, user6]) {
    let wordgame; //Wordgame 'let'형 변수 선언
    let feeAmount = 5 * 10 ** 15; // 계속 쓰게 될 변수 선언 (2-4)
    // let timeLimit = 3600; // 계속 쓰게 될 변수 선언 (2-4)
    // let feeAmountBN = new web3.utils.BN('5000000000000000');

    let answerList = ['사과','과일','일정']
    let answerWords = '사과과일일정'

    beforeEach(async () => {               // Test 수행 전에 실행되는 것들 , async로 Promise 객체 사용
        // console.log('Before each')      // 'Before each' 확인용 log
        wordgame = await Wordgame.new();   // 테스트 시에는 새로 배포 (테스트 시에는 migrations를 돌지 않음)
    })

    // 기본 test : owner 정보 잘 받아오는지 (ganache-cli에서 첫번째 주소가 ownwer로 설정됨)
    it('Basic test', async () => {
    console.log('Basic test')
    let owner = await wordgame.owner();

    console.log(`owner : ${owner}`);
    assert.equal(owner, "0xb671f103FBFfa9cb7155F54858F75d72797DA96a")
    })

    // Pot money 확인용 , 여기서는 아직 참가 인원이 없음으로 0
    it('getPot should return current pot', async () => {  
        let pot = await wordgame.getPot();
        assert.equal(pot, 0)
    })

    describe('Participation', function () { // describe : 여러 테스트 케이스를 묶는 함수
        it('should fail when the participation fee is not 0.005 ETH', async () => {
            // Fail transaction
            await assertRevert(wordgame.participation({from : user1, value: 4000000000000000}))   // assertRevert : revert가 일어나는지 확인 (가스 환불)
            // transaction object {chainId, value, to, from, gas(Limit), gasPrice}                // 트랜잭션 오브젝트 사용 예시
        })
        it('should put the bet to the bet queue with 1 bet', async () => {
            // participation
            let receipt = await wordgame.participation({from : user1, value: feeAmount})
            console.log(receipt);
            
            // let pot = await wordgame.getPot();
            // assert.equal(pot, 0);
            
            // check contract balance == 0.005

            let contractBalance = await web3.eth.getBalance(wordgame.address); //wordgame.address가 pot money 쌓이는 주소임.
            console.log(wordgame.address)
            console.log(contractBalance)
            // assert.equal(contractBalance, feeAmount);

            // check bet info

            let joiner = await wordgame.getParticipantInfo(0);

            // assert.equal(joiner.participant, user1);
            console.log(joiner.participant)
            console.log(joiner.participationTime.toString()); // todo : unix timestamp를 human datatime으로 변환 (시간은 제대로 찍힘)

            // 여기까지 참가자 주소랑 시간 찍히는거 확인함!


            // check log
            // await expectEvent.inLogs(receipt.logs, 'BET')

        })
    })

    describe("Hash", function () {
        let word1 = '사과'
        let word2 = '과일'
        let word3 = '일정'
        let words = '사과과일일정'

        it('check hash function(keccak256) with a word', async () => {
            let answer_hash = await wordgame.wordHash(word1)
            let word1HashValue = '0xd95892392a73cd409bbc5bde1359cd9792da1cd2cb30d48083895f1f504308f7'
            console.log(answer_hash)
            assert.equal(answer_hash, word1HashValue)
        } )
        
        it('check hash function(keccak256) with words', async () => {
            let answer_hash = await wordgame.wordListHash(word1,word2,word3)
            let wordsHashValue = '0xa3e2c539dd4baeed995bf921767d42bd018fc3a077393a504b59c6c98be97518'
            console.log(answer_hash)
            assert.equal(answer_hash, wordsHashValue)
        })
    })

    describe("CheckAnswer", function () {

        it('모든 문제를 다 맞추는 경우', async () => {
            let summitAnswerList = await ['사과','과일','일정']
            let summitWords = await '사과과일일정'

            console.log(summitAnswerList)
            console.log(summitWords)
            console.log("ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ")
            console.log(answerList)
            console.log(answerWords)

            let count = await wordgame.checkAnswerCount(summitWords, answerWords, summitAnswerList, answerList)
            console.log(count.toString())
            // console.log(`count : ${count.toString()}`)
            assert.equal(count, 3)
        })

        it('모든 문제를 다 맞추지 못하는 경우', async () => {
            let summitAnswerList = await ['사과','과일','오답']
            let summitWords = await '사과과일오답'

            console.log(summitAnswerList)
            console.log(summitWords)
            console.log(answerList)
            console.log(answerWords)
          
            let count = await wordgame.checkAnswerCount(summitWords, answerWords, summitAnswerList, answerList)
            console.log(count.toString())
            assert.equal(count, 2)
        })
    })

    describe("Summit", function () {

        it('참가 주소 확인', async () => {
            await wordgame.participation({from : user1, value: feeAmount})
            await wordgame.participation({from : user2, value: feeAmount})
            await wordgame.participation({from : user3, value: feeAmount})

            console.log(`user1 address : ${user1}`)
            console.log(`user2 address : ${user2}`)
            console.log(`user3 address : ${user3}`)

            let first = await wordgame.getParticipantInfo(0)
            let second = await wordgame.getParticipantInfo(1)
            let third = await wordgame.getParticipantInfo(2)

            console.log(first)
            console.log(second)
            console.log(third)
        })

        it("Summit", async () => {

            let user1SummitAnswerList = await ['사과','과일','일정']
            let user1SummitWords = await '사과과일일정'
            let user2SummitAnswerList = await ['사고','과일','일정']
            let user2SummitWords = await '사고과일일정'
            let user3SummitAnswerList = await ['사고','고자','일정']
            let user3SummitWords = await '사고고자일정'
            let user4SummitAnswerList = await ['사고','고자','자취']
            let user4SummitWords = await '사고고자자취'

            await wordgame.participation({from : user1, value: feeAmount})
            await sleep(10)
            await wordgame.participation({from : user2, value: feeAmount})
            await sleep(10)
            await wordgame.participation({from : user3, value: feeAmount})
            await sleep(10)
            await wordgame.participation({from : user4, value: feeAmount})
            await sleep(10)

            await wordgame.summit(user4SummitWords, answerWords, user4SummitAnswerList, answerList, {from : user4})
            await sleep(10)
            await wordgame.summit(user3SummitWords, answerWords, user3SummitAnswerList, answerList, {from : user3})
            await sleep(10)
            await wordgame.summit(user2SummitWords, answerWords, user2SummitAnswerList, answerList, {from : user2})
            await sleep(10)
            await wordgame.summit(user1SummitWords, answerWords, user1SummitAnswerList, answerList, {from : user1})

            console.log(events) // 없는 변수로 로그 찍으면 이때 까지의 이벤트 로그 찍혀나옴
        })

        it("Pot Money Check", async () => {
            
            await wordgame.participation({from : user1, value: feeAmount})
            await wordgame.participation({from : user1, value: feeAmount})

            let contractBalance = await web3.eth.getBalance(wordgame.address); //wordgame.address가 pot money 쌓이는 주소임.
            console.log(`contract address money : ${contractBalance}`)

            let pot = await wordgame.getPot()
            console.log(`pot money : ${pot}`)
        })
    })
    describe("Check distribute function", function () {
        // 6명의 유저 -> 정답 3개 3명, 정답 2개 1명, 정답 1개 1명, 정답 0개 1명 중 1등 잘 찾아내는 지 확인 필요
        it("Address return test", async () => {
            await wordgame.participation({from : user1, value: feeAmount}) // 3개
            let winner = await wordgame.addressReturnTest()
            console.log(winner) 

        })
        // 최종 1위 확인
        it.only("winner check", async () => {
            let user1SummitAnswerList = await ['사과','과일','일정']
            let user1SummitWords = await '사과과일일정'
            let user2SummitAnswerList = await ['사고','과일','일정']
            let user2SummitWords = await '사고과일일정'
            let user3SummitAnswerList = await ['사고','고자','일정']
            let user3SummitWords = await '사고고자일정'
            let user4SummitAnswerList = await ['사고','고자','자취']
            let user4SummitWords = await '사고고자자취'

            await wordgame.participation({from : user1, value: feeAmount}) // 3개
            await sleep(5000)
            await wordgame.summit(user1SummitWords, answerWords, user1SummitAnswerList, answerList, {from : user1})

            await wordgame.participation({from : user2, value: feeAmount}) // 2개 
            await sleep(100)
            await wordgame.summit(user2SummitWords, answerWords, user2SummitAnswerList, answerList, {from : user2})

            await wordgame.participation({from : user3, value: feeAmount}) // 1개
            await sleep(1000)
            await wordgame.summit(user3SummitWords, answerWords, user3SummitAnswerList, answerList, {from : user3})

            await wordgame.participation({from : user4, value: feeAmount}) // 0개
            await sleep(1000)
            await wordgame.summit(user4SummitWords, answerWords, user4SummitAnswerList, answerList, {from : user4})

            await wordgame.participation({from : user5, value: feeAmount}) // 3개
            await sleep(3000)
            await wordgame.summit(user1SummitWords, answerWords, user1SummitAnswerList, answerList, {from : user5})

            await wordgame.participation({from : user6, value: feeAmount}) // 3개
            await sleep(1000)
            await wordgame.summit(user1SummitWords, answerWords, user1SummitAnswerList, answerList, {from : user6})

            // 1등 주소(user5) "0xFfc7983Cc1DAe0099308994521113BDf37AB921a"
            await wordgame.distribute()

            console.log(events) // 없는 변수로 로그 찍으면 이때 까지의 이벤트 로그 찍혀나옴
            
        })
    }) 
})