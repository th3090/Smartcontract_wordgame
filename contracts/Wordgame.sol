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
        string answerWords;    // 정답 합친거
    }

    bool private _gameStatusFlag; // 게임 on/off를 담당할 플래그

    uint256 private _gameTail; // GameStatusInfo 저장을 위한 queue의 tail
    uint256 private _gameHead; // GameStautsINfo 저장을 위한 queue의 head

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


    event PARTICIPATION(uint256 round_index, uint256 participant_index, address participant, uint256 fee, uint256 participationTime);
    event SUMMIT(uint256 round_index, uint256 participant_index, address participant, uint256 answerCount, uint256 playtime);
    event DISTRIBUTE(uint256 round_index, address winner, uint256 pot);
    event START(uint256 round_index, address sender, string[] trueAnswerList);
    event END(uint256 round_index, address winner, uint256 pot, uint256 next_round);
//     event DRAW(uint256 index, address bettor, uint256 amount, bytes1 challenges, bytes1 answer, uint256 answerBlockNumber);
//     event REFUND(uint256 index, address bettor, uint256 amount, bytes1 challenges, uint256 answerBlockNumber);


    // Participantion (참가) ... Bet
    function participation() public payable returns (bool result) {
        // Check the proper ether is sent
        require(msg.value == PARTICIPATION_FEE_AMOUNT, "Not enough ETH");
        
        require(_gameStatusFlag == true, "There are no games in progress");
        // require(_searchParticipationIndex(), "Already paricipated");


        // Push bet to the queue
        require(pushParticipantInfo(), "Fail to add a new Participant Info");

        _pot += PARTICIPATION_FEE_AMOUNT;
        uint256 round_index = _gameTail;


        // emit event
        emit PARTICIPATION(round_index, _tail-1, msg.sender, msg.value, now);

        return true;
    }

    function _searchParticipationIndex() private view returns (bool) {
    for (uint i = _head; i <_tail; i++) {
        if (_participants[i].participant == msg.sender) {
            return false;
        }
        else {
            return true;
        }
        }
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


    // 단일 단어 해시 함수
    function _wordHash(string memory word) internal pure returns (bytes32) {
        bytes32 wordhash = keccak256(abi.encodePacked(word));
        return wordhash;
    }


    function _checkConcatWord(string memory summitWords) private view returns (bool) {
        GameStatusInfo memory g  = _gamestatus[_gameTail];
        if (keccak256(abi.encodePacked(summitWords)) == keccak256(abi.encodePacked(g.answerWords)))
    return true;
    }

    function _checkWord(string[] memory summitAnswerList) private view returns (uint256) {
        GameStatusInfo memory g  = _gamestatus[_gameTail];
        uint256 _count = 0;
        for(uint i=0; i<g.answerList.length; i++) {
            if(_wordHash(summitAnswerList[i]) == _wordHash(g.answerList[i])) {
                _count++;
            }
        }
        return _count;
    }


    function _checkAnswerCount(string memory summitWords, string[] memory summitAnswerList) private view returns (uint256) {
        GameStatusInfo memory g  = _gamestatus[_gameTail];

        uint256 _count = 0;
        if(_checkConcatWord(summitWords) == true) {
            _count = g.answerList.length;
        }
        else {
            _count = _checkWord(summitAnswerList);
        }   

        return _count;
    }


    function summit(string memory summitWords, string[] memory summitAnswerList) public returns (bool result) {
        // Push summit info to the queue
        require(_gameStatusFlag == true, "Time over");
        require(_pushSummitInfo(summitWords, summitAnswerList), "Fail to add a new Summit Info");

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
    function _pushSummitInfo(string memory summitWords, string[] memory summitAnswerList) internal returns (bool) {   // ParticipantInfo에 summit info 저장
        uint256 index = 0;
        uint256 round_index = _gameTail;


        index = _searchIndex();
        ParticipantInfo memory p = _participants[index];

        p.summitTime = now;
        p.playTime = p.summitTime - p.participationTime;
        p.answer_list = summitAnswerList;
        p.answerCount = _checkAnswerCount(summitWords, summitAnswerList);
        _participants[index] = p;

        // emit event
        emit SUMMIT(round_index, index, msg.sender, p.answerCount, p.playTime);

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
        require(msg.sender == owner, "It is not owner address");
        require(_gameStatusFlag == true, "There is no existing game");

        // 1등 찾기
        address payable winner = _popAndSearchWinner();
        uint256 index = _gameTail;

        // 이벤트
        emit DISTRIBUTE(index, winner, _pot);

        // 이더 전송
        transferAfterPayingFee(winner, _pot);
        _pot = 0;

        _gameStatusFlag = false; // 게임 종료 기능
        _gameTail++;

        emit END(index, winner, _pot, index+1);
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


    function _pushAnswerInfo(string memory trueAnswerWords, string[] memory trueAnswerList) private returns (bool) {
        GameStatusInfo memory g;
        g.gameRound = _gameTail;
        g.answerWords = trueAnswerWords;
        g.answerList = trueAnswerList;

        _gamestatus[_gameTail] = g;

        return true;
    }

    function startGame(string memory trueAnswerWords, string[] memory trueAnswerList) public returns (bool) {
        require(msg.sender == owner, 'It is not owner address');
        require(_gameStatusFlag == false, 'Already game start');

        require(_pushAnswerInfo(trueAnswerWords, trueAnswerList), 'Fail to add new game Info');

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