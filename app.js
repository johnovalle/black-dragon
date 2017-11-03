import {map1, map2, map3, map4, map5} from "./maps";
import {tileDictionary} from "./tiles";
import {draw} from "./drawing";
import {canvas} from "./canvas";
import {loadSpritesheet} from "./sprites";
import {messageLog} from "./messageLog";
import {rollDice} from "./utility";
import * as Entity from "./entity";

document.body.appendChild(canvas);

// create generic sprite loader
loadSpritesheet("blackdragon-sprites-00.png", ()=>{
  run();
})

const run = () => {
  draw(model.state);
  requestAnimationFrame(run);
};

const Scene = {
  entities: [],
  controlMap: {},
  onEnter(previous) {}
};

const playerXpTable = {
  1: 200,
  2: 400,
  3: 800,
  4: 1600,
  5: 3200
};

const checkPlayerLevel = (player) => { //in a more robust version monsters could also level but I'll keep this simple
    if(player.xp >= playerXpTable[player.level]){
      player.level++;
      player.maxHp += 10;
      player.hp += 10; //we'll assume the player got a full roll, if too hard player.hp = player.maxHp
      player.xp = 0;
      player.damageModifier++;
      messageLog.messages.push(`Nice work! You leveled up! You are level ${player.level}`);
      messageLog.messages.push("You gained 10 hit points and 1 point of damage!");
    }
}

//// functions that know about the model
//// and need to be refactored before the can be modularized

//this could support certain monsters being able to go up the stairs
//but it's probably a bad idea

/*****///remove references to model
const useStairs = (entity, stairs, targetIndex) => {
 let currentLevel = model.state.currentScene.level;
 let nextLevel = model.levels[stairs.target];
 entity.index = targetIndex;
 nextLevel.entities.push(entity);

 let message = "You go ";
 if(stairs.type === "stairsUp"){ //there are only two types of stairs
   message += "up the stairs"; //to level?
 } else {
   message += "down the stairs";
 }
 messageLog.messages.push(message);
 goToLevel(stairs.target);
 Entity.removeEntityFromLevel(currentLevel, entity);
}

/*****///remove references to model
const attackEntity = (attacker, defender, level) => {
  let damage, verb, aIdentity, dIdentiy, posAdj; //maybe simplify this by giving all monsters a weapon?

  //if(attacker.weapon){
  damage = rollDice(...attacker.weapon.damage);
  damage += attacker.damageModifier;
  verb = attacker.weapon.verb;
  // } else {
  //   damage = rollDice(...attacker.damage);
  //   damage += attacker.damageModifier;
  //   verb = "hits";
  // }
  if(damage > defender.armor.protection){
    defender.hp -= damage - defender.armor.protection;
  } else {
    damage = 0;
  }


  if(attacker.type === "player"){
    aIdentity = "You";
    dIdentiy = "the " + defender.name;
    posAdj = "their";
  }else{
    aIdentity = "The " + attacker.name;
    dIdentiy = "you";
    posAdj = "your"
  }

  let message = `${aIdentity} ${verb} ${dIdentiy} for ${damage} bringing ${posAdj} hp to ${defender.hp}`;
  messageLog.messages.push(message);
  if(defender.hp <= 0){
    if(defender.type === "player" || defender.name === "black dragon") {
      // end the game
      changeScene(model.scenes.gameOver);
    }else {
      Entity.removeEntityFromLevel(level, defender);
      if(attacker.type === "player"){
        attacker.xp += defender.xpVal;
        //check if player leveled
        checkPlayerLevel(attacker);
      }
    }
  }
};

const getItem = (entity, item, level) => {
  let message;
  let itemProps = item.itemProps;
  if(itemProps.subtype === "weapon"){
    entity.weapon = itemProps;
    message = `You found a ${itemProps.name}!`;
  }
  if(itemProps.subtype === "armor"){
    entity.armor = itemProps;
    message = `You found ${itemProps.name}!`;
  }
  if(itemProps.subtype === "health"){
    entity.hp += itemProps.heals;
    message = `You drink a ${itemProps.name}, you heal ${itemProps.heals} points!`; //should probably have a verb too
  }
  messageLog.messages.push(message);
  Entity.removeEntityFromLevel(level, item);
}

// there will be a problem movable actors overwriting the stairs so the
// entitiesMap array needs to be rebuild every turn and possbily stairs need to be
// drawn first so they wont be obscured by enemies
/*****///remove references to model
//split this into multiple functions
const checkIndex = (level, entity, newIndex) => {
  let newTarget = tileDictionary[level.entitiesMap[newIndex]]; //if entities have passible tthis can be simplified
  if(tileDictionary[level.backgroundMap[newIndex]].passible){
    if(newTarget.passible){
      if((newTarget.type === "stairsDown" || newTarget.type === "stairsUp") && entity.type === "player"){
        //get the level
        let stairs = Entity.getEntityAtIndex(level, newIndex);
        console.log(newTarget, stairs);
        useStairs(entity, stairs, stairs.targetIndex); //if passing stairs alreay don't need to pass target
        //goToLevel(stairs.target);
        //put player on stairsup, assume for now there is always only one stairsUp
        //to create more would require building the stairs like other entities
      }else if(newTarget.type === "item" && entity.type === "player"){
        let item = Entity.getEntityAtIndex(level, newIndex);
        getItem(entity, item, level);
        //DRY this up
        level.entitiesMap[entity.index] = 0;
        entity.index = newIndex;
        level.entitiesMap[newIndex] = entity.key;
      }else{
        level.entitiesMap[entity.index] = 0;
        entity.index = newIndex;
        level.entitiesMap[newIndex] = entity.key;
        //while static monsters will hit back, once monsters are moving they will hit the
        // player by attempting to him into the players position
      }

      // handle stairs
    }else{
      // it's a monster, fight!
      // need to put logic in here so monsters wont fight each other

      let enemy = Entity.getEntityAtIndex(level, newIndex);
      // temp for now just kill on monsters on contact
      attackEntity(entity, enemy, level);
      if(enemy.hp > 0) {
        attackEntity(enemy, entity, level);
      }
      //removeEntityFromLevel(level, enemy);
    }
  }
};

const changeScene = (scene) => { //
  model.state.currentScene = scene;
  scene.onEnter();
};

addEventListener("keydown", (event) => {
    // console.log(event.key);
    let request;
    if(typeof model.state.currentScene.controlMap[event.key] === "function"){
      request = model.state.currentScene.controlMap[event.key]();
    // console.log(request, request.args);
    }
    if(request){
        request.action(...request.args);
    }
});
//this can take model as para
const moveEntity = (direction, entity) => { //make generic for all movers
  //entity.index;
  //console.log(direction);
  let level = model.state.currentScene.level;
  if(direction === "up"){
    let newIndex = entity.index - 10;
    checkIndex(level, entity, newIndex);
  } else if(direction === "down"){
    let newIndex = entity.index + 10;
    checkIndex(level, entity, newIndex);
  } else if(direction === "left"){
    let newIndex = entity.index - 1;
    checkIndex(level, entity, newIndex);
  } else if(direction === "right"){
    let newIndex = entity.index + 1;
    checkIndex(level, entity, newIndex);
  }

  Entity.buildEntityMap(level);
};

const goToLevel = (level) => {
  console.log(level);
  model.scenes.play.level = model.levels[level];
  Entity.buildEntityMap(model.scenes.play.level);
  //model.scenes.play.level.entitiesMap = model.entitiesMaps[level];
};

const Level = {
  name: "",
  backgroundMap: null,
  entitiesMap: null,
  entities: null //initializing to an empty array links all maps...
}
const levelMaps = [["level1", map1, [{type: "monster", lookup: 6, mapIndex: 45},
                                    {type: "monster", lookup: 6, mapIndex: 61},
                                    {type: "monster", lookup: 8, mapIndex: 78},
                                    {type: "item", lookup: 11, mapIndex: 15}]],
                   ["level2", map2, [{type: "monster", lookup: 7, mapIndex: 38},
                                    {type: "monster", lookup: 8, mapIndex: 42},
                                    {type: "monster", lookup: 7, mapIndex: 86},
                                    {type: "item", lookup: 15, mapIndex: 22}]],
                   ["level3", map3, [{type: "monster", lookup: 6, mapIndex: 31},
                                    {type: "monster", lookup: 8, mapIndex: 83},
                                    {type: "monster", lookup: 7, mapIndex: 56},
                                    {type: "monster", lookup: 8, mapIndex: 15},
                                    {type: "monster", lookup: 9, mapIndex: 24},
                                    {type: "item", lookup: 13, mapIndex: 11}]],
                   ["level4", map4, [{type: "monster", lookup: 9, mapIndex: 47},
                                    {type: "monster", lookup: 8, mapIndex: 36},
                                    {type: "monster", lookup: 7, mapIndex: 22},
                                    {type: "monster", lookup: 9, mapIndex: 75},
                                    {type: "monster", lookup: 7, mapIndex: 77},
                                    {type: "item", lookup: 12, mapIndex: 38},
                                    {type: "item", lookup: 15, mapIndex: 12}]],
                   ["level5", map5, [{type: "monster", lookup: 7, mapIndex: 23},
                                    {type: "monster", lookup: 9, mapIndex: 43},
                                    {type: "monster", lookup: 9, mapIndex: 71},
                                    {type: "monster", lookup: 8, mapIndex: 76},
                                    {type: "monster", lookup: 9, mapIndex: 45},
                                    {type: "monster", lookup: 7, mapIndex: 18},
                                    {type: "monster", lookup: 10, mapIndex: 68},
                                    {type: "item", lookup: 14, mapIndex: 41}]]
];

const buildLevel = (model, name, map, entities) => {
  let level = Object.assign({}, Level, {name});
  model.levels[name] = level;
  level.backgroundMap = map;
  level.entities = [];
  Entity.buildEntityMap(level);
  for(let i = 0; i < entities.length; i++){
    let entity = entities[i];
    if(entity.type === "monster"){
      Entity.buildMonster(level, entity.lookup, entity.mapIndex);
    }else if(entity.type === "item"){
      Entity.buildItem(level, entity.lookup, entity.mapIndex);
    }else if(entity.type === "stairs"){
    }
  }
  //Entity.buildEntityMap(model.levels[name]);
}

const buildGameWorld = () => {
  model.scenes.start.entities = [];
  model.scenes.play.entities = [];
  model.scenes.gameOver.entities = [];
  for(let i = 0; i < levelMaps.length; i++){
    buildLevel(model, levelMaps[i][0], levelMaps[i][1], levelMaps[i][2]);
  }

  model.scenes.play.level = null;
  messageLog.messages = ["The evil Black Dragon killed your family, now it's time for revenge.",
                      "Go through the dungeon and destroy the Black Dragon and all it's minions!"];

  const titleText = Entity.createTextEntity("Black Dragon", "50px Arial", "#000", 170, 100);
  const startText = Entity.createTextEntity("Press Enter to start", "30px Arial", "#333", 190, 400);
  model.scenes.start.entities.push(titleText);
  model.scenes.start.entities.push(startText);

  const gameOverText = Entity.createTextEntity("Game Over", "50px Arial", "#000", 170, 100);
  model.scenes.gameOver.entities.push(gameOverText);

  model.state.player = Entity.buildPlayer(model.levels.level1, 5, 11);
  // Entity.buildMonster(model.levels.level1, 6, 45);
  // Entity.buildMonster(model.levels.level1, 6, 61);
  // Entity.buildMonster(model.levels.level1, 8, 78);
  // Entity.buildItem(model.levels.level1, 11, 15);

  // Entity.buildMonster(model.levels.level2, 7, 38);
  // Entity.buildMonster(model.levels.level2, 8, 42);
  // Entity.buildMonster(model.levels.level2, 7, 86);
  // Entity.buildItem(model.levels.level2, 15, 22);

  // Entity.buildMonster(model.levels.level3, 6, 31);
  // Entity.buildMonster(model.levels.level3, 8, 83);
  // Entity.buildMonster(model.levels.level3, 7, 56);
  // Entity.buildMonster(model.levels.level3, 8, 15);
  // Entity.buildMonster(model.levels.level3, 9, 24);
  // Entity.buildItem(model.levels.level3, 13, 11);

  // Entity.buildMonster(model.levels.level4, 9, 47);
  // Entity.buildMonster(model.levels.level4, 8, 36);
  // Entity.buildMonster(model.levels.level4, 7, 22);
  // Entity.buildMonster(model.levels.level4, 9, 75);
  // Entity.buildMonster(model.levels.level4, 7, 77);
  // Entity.buildItem(model.levels.level4, 12, 38);
  // Entity.buildItem(model.levels.level4, 15, 12);
  //
  // Entity.buildMonster(model.levels.level5, 7, 23);
  // Entity.buildMonster(model.levels.level5, 9, 43);
  // Entity.buildMonster(model.levels.level5, 9, 71);
  // Entity.buildMonster(model.levels.level5, 8, 76);
  // Entity.buildMonster(model.levels.level5, 9, 45);
  // Entity.buildMonster(model.levels.level5, 7, 18);
  // Entity.buildMonster(model.levels.level5, 10, 68);
  // Entity.buildItem(model.levels.level5, 14, 41);
  //stairs are almost always made it pairs so it might make sense to build a pair of stairs in one shot.
  Entity.buildStairs(model.levels.level1, 4, 58, "level2", 28);
  Entity.buildStairs(model.levels.level2, 3, 28, "level1", 58);
  Entity.buildStairs(model.levels.level2, 4, 88, "level3", 74);
  Entity.buildStairs(model.levels.level3, 3, 74, "level2", 88);
  Entity.buildStairs(model.levels.level3, 4, 13, "level4", 28);
  Entity.buildStairs(model.levels.level4, 3, 28, "level3", 13);
  Entity.buildStairs(model.levels.level4, 4, 61, "level5", 12);
  Entity.buildStairs(model.levels.level5, 3, 12, "level4", 61);

  Entity.buildEntityMap(model.levels.level1);
  Entity.buildEntityMap(model.levels.level2);
  Entity.buildEntityMap(model.levels.level3);
  Entity.buildEntityMap(model.levels.level4);
  Entity.buildEntityMap(model.levels.level5);
  //since I'm building the maps anyways might be better to only build the level
  //the player is on, I'll do this refactor after implementing items
  //just have to change buildEntity from inserting the entity to the map to only
  //putting the entity in the entities array for the level
};

//create a buildScene function
//clean up self references
const model = {
  state: {
    currentScene: null,
    player: null
  },
  scenes: {
    start: {
      onEnter() {
        //should run setup game
        //clearing the log, destroying all entities, rebuilding maps etc
        buildGameWorld();
      },
      entities: [],
      controlMap: {
        "Enter": () => { return {action: changeScene, args: [model.scenes.play]}; }
      }
    },
    play: {
      onEnter() {
        if(!model.scenes.play.level){
          model.scenes.play.level = model.levels.level1;
          //model.scenes.play.level.entitiesMap = model.entitiesMaps[0];
        }
      },
      entities: [],
      controlMap: {
        "Enter": () => { return {action: goToLevel, args: ["level2"]}; },
        "ArrowUp": () => { return {action: moveEntity, args: ["up", model.state.player]}; },
        "ArrowDown": () => { return {action: moveEntity, args: ["down", model.state.player]}; },
        "ArrowLeft": () => { return {action: moveEntity, args: ["left", model.state.player]}; },
        "ArrowRight": () => { return {action: moveEntity, args: ["right", model.state.player]}; },

      },
      level: null
    },
    gameOver: {
      onEnter() {
        // to handle this simply, just check if the player is dead when we get here
        let message;
        if(model.state.player.hp > 0) {
          message = "You have killed the black dragon the brining peace to the land.";
        } else {
          message = "You have died and brought shame to your ancestors";
        }
        const endMessageText = Entity.createTextEntity(message, "20px Arial", "#333", 20, 400);
        const playAgainText = Entity.createTextEntity("press enter to try again", "20px Arial", "#333", 20, 440);
        model.scenes.gameOver.entities.push(endMessageText);
        model.scenes.gameOver.entities.push(playAgainText);

        return;
      },
      entities: [],
      controlMap: {
        "Enter": () => { return {action: changeScene, args: [model.scenes.start]}; }
      }
    },
  },
  levels: {}
};

changeScene(model.scenes.start);
