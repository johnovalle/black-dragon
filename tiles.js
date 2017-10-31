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
  11: {passible: true, type: "item", subtype: "dagger"},
  12: {passible: true, type: "item", subtype: "sword"},
  13: {passible: true, type: "item", subtype: "leather armor"},
  14: {passible: true, type: "item", subtype: "chain armor"},
  15: {passible: true, type: "item", subtype: "health potion"},
};

// subtype should be moved to here and the dictionary should just work of the key
// subtype can be used for "slaying" weapons that would target whole groups of monsters (orcs, dragons, undead etc.)
export const monsterDictionary = {
  "giant rat": {hp: [1,6], damage: [1,4], xpVal: 50 },
  "orc": {hp: [1,10], damage: [1,6], xpVal: 150},
  "goblin": {hp: [1,6], damage: [1,6], xpVal: 100},
  "skeleton": {hp: [1,8], damage: [1,6], xpVal: 150},
  "black dragon": {hp: [3,6], damage: [1,10], xpVal: 450}
};

export const itemDictionary = {
  "dagger": {name: "dagger", subtype: "weapon", damage: [1,6], verb: "stab"},
  "sword": {name: "sword", subtype: "weapon", damage: [1,8], verb: "slash"},
  "leather armor": {name: "leather armor", subtype: "armor", protection: 1},
  "chain armor": {name: "chain armor", subtype: "armor", protection: 2},
  "health potion": {name: "health potion", subtype: "health", heals: 10}
};
