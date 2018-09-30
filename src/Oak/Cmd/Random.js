exports.mathRandom = function(msgCtor) {
  console.log("randomizing")
  return function(handler) {
    console.log("handling: ");
    console.log(handler);
    console.log("msgCtor: ", msgCtor);
    console.log("you get: ", msgCtor(Math.random()));
    handler(msgCtor(Math.random()))()
  }
}
