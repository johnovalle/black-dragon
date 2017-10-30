export const rollDice = (diceToRoll, numOfSides) => {
  let total = 0;
  for(let i = 0; i<diceToRoll; i++){
    total += Math.ceil(Math.random()*numOfSides);
  }
  return total;
};
