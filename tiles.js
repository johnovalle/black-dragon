export const tileDictionary = {
  0: {passible: true, type: "nothing"},
  1: {passible: false, type: "wall"},
  2: {passible: true, type: "floor"},
  3: {passible: true, type: "stairsUp", subtype: null},
  4: {passible: true, type: "stairsDown", subtype: null},
  5: {passible: false, type: "player", subtype: null},
  6: {passible: false, type: "monster", subtype: "giant rat"},
  7: {passible: false, type: "monster", subtype: "orc"},
  8: {passible: false, type: "monster", subtype: "goblin"},
  9: {passible: false, type: "monster", subtype: "skeleton"},
  10: {passible: false, type: "monster", subtype: "black dragon"},
};

export const monsterDictionary = {
  "giant rat": {hp: [1,6], damage: [1,4], xpVal: 50 },
  "orc": {hp: [1,10], damage: [1,6], xpVal: 150},
  "goblin": {hp: [1,6], damage: [1,6], xpVal: 100},
  "skeleton": {hp: [1,8], damage: [1,6], xpVal: 150},
  "black dragon": {hp: [3,6], damage: [1,10], xpVal: 450}
};
