// SPDX-License-Identifier: MIT
pragma solidity >=0.4.18 <0.9.0;
pragma experimental ABIEncoderV2;


contract Wordgame {

    // 참가자 정보 - 참가자 주소, 
    struct ParticipantInfo {
        uint256 participationTime; // 참가자가 참가를 선언하는 시각을 저장 -> 이후 결과 제출 시 시각과의 차로 소요 시간 계산 예정
        uint256 summitTime;
        uint256 playTime;
        uint256 answerCount;   
        address payable participant; // 참가하는 사람들의 주소 저장 (payable 포함 해야함)
        // ToDo : 제출하는 정답에 대한 정보
        string[] answer_list;
        }

    struct GameStatusInfo {
        uint256 gameRound;       // 게임 라운드를 저장할 변수
        string[] answerList;   // 정답을 저장할 변수
    }

    bool private _gameStatusFlag; // 게임 on/off를 담당할 플래그

    uint256 private _gameTail = 1; // GameStatusInfo 저장을 위한 queue의 tail
    uint256 private _gameHead = 1; // GameStautsINfo 저장을 위한 queue의 head

    /*  참가자 정보를 저장할 큐 관련 변수 */
    uint256 private _tail; // ParticipantInfo 저장을 위한 queue의 tail
    uint256 private _head; // ParticipantInfo 저장을 위한 queue의 head

    // pot 정보를 저장할 변수
    uint256 private _pot; 

    mapping (uint256 => ParticipantInfo) private _participants; // mapping (_KeyType => _ValueType)
    mapping (uint256 => GameStatusInfo) private _gamestatus;    
    
    // TODO : 이거 뭐였지?
    address payable public owner; // public으로 주소를 만들게 되면 자동으로 getter를 만듦

    // uint256 constant TIME_LIMIT = 3600; // 게임 유효 시간 -> 리엑트에서 ?
    // uint256 constant TIME_WARNING = 3000; // 게임 참가 유효 시간 -> 리엑트에서 ?
    uint256 constant internal PARTICIPATION_FEE_AMOUNT = 5 * 10 **15; // 0.005 ether
    uint256 constant internal SUMMIT_FEE_AMOUNT = 2 * 10 **15; // 0.002 ether


    event PARTICIPATION(uint256 index, address participant, uint256 fee, uint256 participationTime);
    event SUMMIT(uint256 index, address participant, uint256 answerCount, uint256 playtime);
    event DISTRIBUTE(uint256 index, address winner, uint256 pot);
    event START(uint256 index, address sender, string[] trueAnswerList);
//     event DRAW(uint256 index, address bettor, uint256 amount, bytes1 challenges, bytes1 answer, uint256 answerBlockNumber);
//     event REFUND(uint256 index, address bettor, uint256 amount, bytes1 challenges, uint256 answerBlockNumber);


    // Participantion (참가) ... Bet
    function participation() public payable returns (bool result) {
        // Check the proper ether is sent
        require(msg.value == PARTICIPATION_FEE_AMOUNT, "Not enough ETH");

        // Push bet to the queue
        require(pushParticipantInfo(), "Fail to add a new Participant Info");

        _pot += PARTICIPATION_FEE_AMOUNT;

        // emit event
        emit PARTICIPATION(_tail-1, msg.sender, msg.value, now);

        return true;
    }

    // save the participant to the queue
    function pushParticipantInfo() internal returns (bool) {
        ParticipantInfo memory p;
        p.participant = msg.sender;
        p.participationTime = now; // 현재 시각 저장
        
        _participants[_tail] = p;
        _tail++;

        return true;
    }
    
    // 현재 pot 잔고를 보는 함수
        function getPot() public view returns (uint256 pot) { // view : 데이터를 읽기만 함
        return _pot;
    }

    // 스마트 컨트랙트가 배포가 될 때 가장 처음 시행되는 함수 -> 보낸 사람으로 오너를 저장
    constructor() public {
        owner = msg.sender; // msg.sender는 스마트 컨트랙트에서 제공하는 전역 변수
    }

    //@getBetInfo : _bets 매핑(구조체)에 담긴 정보를 읽어오는 함수
    function getParticipantInfo(uint256 index) public view returns (address participant, uint256 participationTime, uint256 summitTime, uint256 playTime, string[] memory answerList, uint256 answerCount) {
        ParticipantInfo memory p = _participants[index];
        participant = p.participant;
        participationTime = p.participationTime;
        summitTime =p.summitTime;
        playTime = p.playTime;
        answerList = p.answer_list;
        answerCount = p.answerCount;
    }

    /*
    정답 확인 로직
    1. 전체 정답 확인 -> 확인은 keccak256 hash 값으로 -> 정답 맞을 시에 바로 결과
    2. 전체 정답이 맞지 않을 경우 -> 각 단어에 대한 정답을 확인
    3. 각 단어에 대한 정답도 keccak256 hash 값으로 확인
    */


    // 단일 단어 해시 함수
    function _wordHash(string memory word) internal pure returns (bytes32) {
        bytes32 wordhash = keccak256(abi.encodePacked(word));
        return wordhash;
    }
    
    // 여러 단어 리스트 해시 함수 -> Test로 되는 것은 확인 함 -> 필요 없음
    function wordListHash(string memory word1, string memory word2, string memory word3) public pure returns (bytes32) {
        bytes32 wordlisthash = keccak256(abi.encodePacked(word1, word2, word3));
        return wordlisthash;
    }

    // 합쳐진 단어 비교
    function _checkConcatWord(string memory summitWords, string memory answerWords) private view returns (bool) {
        if (keccak256(abi.encodePacked(summitWords)) == keccak256(abi.encodePacked(answerWords)))
    return true;
    }

    // 각 단어 비교
    function _checkWord(string[] memory summitAnswerList, string[] memory answerList) private view returns (uint256) {
        uint256 _count = 0;
        for(uint i=0; i<answerList.length; i++) {
            if(_wordHash(summitAnswerList[i]) == _wordHash(answerList[i])) {
                _count++;
            }
        }
        return _count;
    }

    // 정답 비교 로직 <- Summit 안에서 실행 될 예정 => summit 함수 생성 후에는 private 전환
    function checkAnswerCount(string memory summitWords, string memory answerWords, string[] memory summitAnswerList, string[] memory answerList) public view returns (uint256) {
        uint256 _count = 0;
        if(_checkConcatWord(summitWords, answerWords) == true) {
            _count = answerList.length;
        }
        else {
            _count = _checkWord(summitAnswerList, answerList);
        }   

        return _count;
    }
    // 나중에 보안을 위해서는 원래 정답은 처음부터 hash된 상태로 제공?

    /* 제출 로직
    1. _pushSummitInfo()를 통해 게임 결과에 대한 정보를 저장
    2. 게임 결과 정보 저장을 위해 기존에 participation 정보가 저장되어 있는 큐에서 msg.sender의 인덱스 찾기
        _searchIndex()
    3. summit안에서 위의 함수 호출
    */
    function summit(string memory summitWords, string memory answerWords, string[] memory summitAnswerList, string[] memory answerList) public returns (bool result) {
        // Push summit info to the queue
        require(_pushSummitInfo(summitWords, answerWords, summitAnswerList, answerList), "Fail to add a new Summit Info");

        return true;
    }

    // search senders's participation queue index
    function _searchIndex() private view returns (uint256) {
        uint256 index = 0;
        for (uint i = _head; i <_tail; i++) {
            if (_participants[i].participant == msg.sender) {
                index = i;
                break;
            }
        }
        return index;
    }

    // save the summit info to the participants queue
    function _pushSummitInfo(string memory summitWords, string memory answerWords, string[] memory summitAnswerList, string[] memory answerList) internal returns (bool) {   // ParticipantInfo에 summit info 저장
        uint256 index = 0;

        index = _searchIndex();
        ParticipantInfo memory p = _participants[index];

        p.summitTime = now;
        p.playTime = p.summitTime - p.participationTime;
        p.answer_list = summitAnswerList;
        p.answerCount = checkAnswerCount(summitWords, answerWords, summitAnswerList, answerList);
        _participants[index] = p;

        // emit event
        emit SUMMIT(index, msg.sender, p.answerCount, p.playTime);

        return true;
    }

    function transferAfterPayingFee(address payable addr, uint256 amount) internal returns (uint256) {
        uint256 fee = 0;
        uint256 amountWithoutFee = amount - fee; 

        // transfer to addr
        addr.transfer(amountWithoutFee);
        // transfer to owner
        owner.transfer(fee);

        return amountWithoutFee;
    }

    // distribute function -> 1등에게 쌓인 pot money 전달
    function distribute() public {
        require(msg.sender == owner);
        // 1등 찾기
        address payable winner = _popAndSearchWinner();
        uint256 index = _gameTail;

        // 이벤트
        emit DISTRIBUTE(index, winner, _pot);

        // 이더 전송
        transferAfterPayingFee(winner, _pot);
        _pot = 0;

        _gameStatusFlag = false;

        emit DISTRIBUTE(index, winner, _pot);

    }

    function _popBet(uint256 index) internal returns (bool) {
        delete _participants[index];
        return true;
    }

    function _popAndSearchWinner() public returns (address payable) {
        ParticipantInfo memory p;
        uint256 answerCount = 0;
        uint256 playTime = 360000;
        address payable winner;

        for(uint256 i = _head; i < _tail; i++) {
            p = _participants[i];
            if (p.answerCount >= answerCount && playTime > p.playTime) {
                answerCount = p.answerCount;
                playTime = p.playTime;
                winner = p.participant;
            }
            _popBet(i);
        }
        _head = 0;
        _tail = 0;
        return winner;
    }

    // ------

    // function gameStart() {

    // }

    // function gameEnd() {

    // }


    function _pushAnswerInfo(string[] memory trueAnswerList) private returns (bool) {
        GameStatusInfo memory g;
        g.gameRound == _gameTail;
        g.answerList = trueAnswerList;

        _gamestatus[_gameTail] = g;

        return true;
    }

    function startGame(string[] memory trueAnswerList) public returns (bool) {
        require(msg.sender == owner);

        require(_pushAnswerInfo(trueAnswerList), 'Fail to add new game Info');

        uint256 index = _gameTail;
        _gameStatusFlag = true;

        emit START(index, msg.sender, trueAnswerList);

        return true;
    }

    function getGameInfo(uint256 index) public view returns (uint256 gameRound, string[] memory trueAnswerList) {
        GameStatusInfo memory g = _gamestatus[index];
        gameRound = g.gameRound;
        trueAnswerList = g.answerList;
    }

}