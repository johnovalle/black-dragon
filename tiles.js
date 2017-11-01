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
  6: {name:"giant rat", hp: [1,6], weapon: {damage: [1,4], verb: "bites"}, armor: {}, xpVal: 50 },
  7: {name:"orc", hp: [1,10],weapon: { damage: [1,6], verb: "hits"}, armor: {}, xpVal: 150},
  8: {name:"goblin", hp: [1,6], weapon: {damage: [1,6], verb: "hits"}, armor: {}, xpVal: 100},
  9: {name:"skeleton", hp: [1,8], weapon: {damage: [1,6], verb: "hits"}, armor: {}, xpVal: 150},
  10: {name:"black dragon", hp: [3,6], weapon: {damage: [1,10], verb: "hits"}, armor: {}, xpVal: 450}
};

export const itemDictionary = {
  11: {name: "dagger", type:"weapon", subtype: "weapon", damage: [1,6], verb: "stab"},
  12: {name: "sword", type:"weapon", subtype: "weapon", damage: [1,8], verb: "slash"},
  13: {name: "leather armor", subtype: "armor", protection: 1},
  14: {name: "chain armor", subtype: "armor", protection: 2},
  15: {name: "health potion", subtype: "health", heals: 10}
};
