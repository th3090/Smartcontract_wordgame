const assert = require('chai').assert;

const inLogs = async (logs, eventName) => {
    const event = logs.find(e => e.event === eventName); // logs에서 찾기 , === : Strict Equal Operator (데이터 값과 값의 종류까지 비교)
    assert.exists(event);
}

module.exports = { 
    inLogs // inLogs 객체를 익스포트
}