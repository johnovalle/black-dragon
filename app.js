const canvas = document.createElement('canvas');
canvas.height = 640;
canvas.width = 640;
canvas.style = "border: 1px solid black";
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

// step 1:
//     generate maps*
//     be able to go from scene to scene and level to level*
        // not entirely statisfied with the level transitioning but this will do for now
//     player can move on screen and no pass through walls
//     player can go to next level by walking on stairs and will go to correct location
const changeScene = (scene) => { //
  model.state.currentScene = scene;
  scene.onEnter();
};



const Scene = {
  entities: [],
  controlMap: {},
  onEnter(previous) {}
};

const run = () => {
  draw(model.state);
  requestAnimationFrame(run);
};

const draw = (state) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScene(state.currentScene);
};

const Entity = {
  x: 0,
  y: 0,
  type: null
};



const createTextEntity = (text, font, color, x, y) => {
  let entity = Object.assign({}, Entity, {text, font, color, x, y});
  entity.type = "text";

  return entity;
};

const tileSize = 64;
const sheetSize = 64;
const sheetCols = 5;
const mapCols = 10;
const mapRows = 10;

const drawScene = (scene) => {
  // draw non-map entities
  for(let i = 0, len = scene.entities.length; i < len; i++ ){
    let entity = scene.entities[i];
    if(entity.type === "text"){
      ctx.fillStyle = entity.color;
      ctx.font = entity.font;
      ctx.fillText(entity.text, entity.x, entity.y);
    }
  }
  // draw map
  if(scene.level){
    drawMap(scene.level.backgroundMap, true);
    drawMap(scene.level.entitiesMap);
  }
};

const drawMap = (map, isBG) => {
  for(let i = 0, len = map.length;  i < len; i++){
    let tile = map[i];
    if(tile !== 0 || isBG){
      let x = (i % mapCols) * tileSize; // index / width of drawing area in tiles * tile size
      let y = Math.floor(i / mapCols) * tileSize;
      let sx = (tile % sheetCols) * sheetSize // tile value against width of tilesheet in tiles * tile size on sheet
      let sy = Math.floor(tile / sheetCols) * sheetSize;
      ctx.drawImage(spritesheet, sx, sy, sheetSize, sheetSize, x, y, tileSize, tileSize);
    }
  }
};


addEventListener("keydown", (event) => {
    // console.log(event.key);
    let request = model.state.currentScene.controlMap[event.key]();
    // console.log(request, request.args);
    if(request){
        request.action(...request.args);
    }
});

const moveEntity = (direction, entity) => { //make generic for all movers
  //entity.index;
  console.log(direction);
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

  buildEntityMap(level);
};
// there will be a problem movable actors overwriting the stairs so the
// entitiesMap array needs to be rebuild every turn and possbily stairs need to be
// drawn first so they wont be obscured by enemies
const checkIndex = (level, entity, newIndex) => {
  let newTarget = tileDictionary[level.entitiesMap[newIndex]]; //if entities have passible tthis can be simplified
  if(tileDictionary[level.backgroundMap[newIndex]].passible){
    if(newTarget.passible){
      if((newTarget.type === "stairsDown" || newTarget.type === "stairsUp") && entity.type === "player"){
        //get the level
        let stairs = getEntityAtIndex(level, newIndex);
        console.log(newTarget, stairs);
        useStairs(entity, stairs.target, stairs.targetIndex);
        //goToLevel(stairs.target);
        //put player on stairsup, assume for now there is always only one stairsUp
        //to create more would require building the stairs like other entities
      }else{
        level.entitiesMap[entity.index] = 0;
        entity.index = newIndex;
        level.entitiesMap[newIndex] = entity.key;
      }

      // handle stairs
    }else{
      // it's a monster, fight!

      let enemy = getEntityAtIndex(level, newIndex);
      // temp for now just kill on monsters on contact

      removeEntityFromLevel(level, enemy);
    }
  }
};

const removeEntityFromLevel = (level, entity) => {
  level.entitiesMap[entity.index] = 0;
  let index;
  for(let i = 0; i < level.entities.length; i++){
    let e = level.entities[i];
    if(e.id === entity.id){
      index = i;
      break;
    }
  }
  level.entities.splice(index,1);
};
 //this could support certain monsters being able to go up the stairs
 //but it's probably a bad idea
const useStairs = (entity, target, targetIndex) => {
  let currentLevel = model.state.currentScene.level;
  let nextLevel = model.levels[target];
  entity.index = targetIndex;
  nextLevel.entities.push(entity);
  goToLevel(target);
  removeEntityFromLevel(currentLevel, entity);


}

const tileDictionary = {
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

let idCounter = 1;
const buildEntity = (level, key, index) => {
  let backgroundVal = level.backgroundMap[index];
  let entityVal = level.entitiesMap[index]
  if(tileDictionary[backgroundVal].passible &&
  tileDictionary[entityVal].passible) {
    let entity = Object.assign({}, Entity, {key, index});
    entity.id = idCounter;
    entity.type = tileDictionary[entity.key].type;
    entity.subtype = tileDictionary[entity.key].subtype;

    idCounter++;
    level.entitiesMap[index] = entity.key;
    level.entities.push(entity);
    if(tileDictionary[entity.key].type === "player") {
      model.state.player = entity;
    }

    return entity;
  }
};

const buildStairs = (level, key, index, targetLevel, targetIndex) => {
  let stairs = buildEntity(level, key, index);
  stairs.target = targetLevel; // not a great name
  stairs.targetIndex = targetIndex;
}

const getEntityAtIndex = (level, index) => {
  for(let i = 0; i < level.entities.length; i++){
    let entity = level.entities[i];
    if(entity.index === index){
      return entity;
    }
  }
};

const buildEntityMap = (level) => {
  level.entitiesMap = Array(mapCols * mapRows).fill(0);
  for(let i = 0; i < level.entities.length; i++) {
    let entity = level.entities[i];
    level.entitiesMap[entity.index] = entity.key;
  }
}

let map1 = [1,1,1,0,1,1,1,1,1,1,
            1,2,1,0,1,2,1,2,2,1,
            1,2,1,0,1,2,1,2,2,1,
            1,2,1,1,1,2,1,2,2,1,
            1,2,2,2,2,2,2,2,2,1,
            1,2,2,2,1,1,1,2,2,1,
            1,2,2,2,1,0,1,2,2,1,
            1,2,2,1,1,0,1,1,2,1,
            1,2,2,1,0,0,0,1,1,1,
            1,1,1,1,0,0,0,0,1,1
          ];
let mapEntities1 = [0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0
                  ];
let map2 = [1,1,1,1,0,0,1,1,1,1,
            1,2,2,1,0,0,1,2,2,1,
            1,2,2,1,0,0,1,2,2,1,
            1,2,2,1,0,0,1,2,2,1,
            1,2,2,1,1,1,1,2,2,1,
            1,1,2,2,2,2,2,2,2,1,
            1,1,1,2,2,1,1,1,1,1,
            0,0,1,2,2,1,1,1,1,1,
            0,0,1,2,2,2,2,2,2,1,
            0,0,1,1,1,1,1,1,1,1
          ];
let mapEntities2 = [0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0
                  ];

// create generic sprite loader
let spritesheet = new Image();
spritesheet.onload = () => {
  run();
};
spritesheet.src = "blackdragon-sprites-00.png";
const goToLevel = (level) => {
  console.log(level);
  model.scenes.play.level = model.levels[level];
  buildEntityMap(model.scenes.play.level);
  //model.scenes.play.level.entitiesMap = model.entitiesMaps[level];
};

const model = {
  state: {
    currentScene: null,
    player: null
  },
  scenes: {
    start: {
      onEnter() {
        return;
      },
      entities: [],
      controlMap: {
        "Enter": () => { return {action: changeScene, args: [model.scenes.play]}; }
      }
    },
    play: {
      onEnter() {
        if(!model.scenes.play.level.backgroundMap){
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
      level: {
        backgroundMap: null,
        entitiesMap: null
      }
    }
  },
  levels: { //make level interface
    level1: {
      backgroundMap: map1,
      entitiesMap: null,
      entities: [],
    },
    level2: {
      backgroundMap: map2,
      entitiesMap: null,
      entities: []
    },
  }
  //maps: [map1, map2],
  //entitiesMaps: [mapEntities1, mapEntities2] //consider changing this from an array to a object
};

model.state.currentScene = model.scenes.start;
console.log(model);
buildEntityMap(model.levels.level1);
buildEntityMap(model.levels.level2);

const titleText = createTextEntity("Black Dragon", "50px Arial", "#000", 170, 100);
const startText = createTextEntity("Press Enter to start", "30px Arial", "#333", 190, 400);
model.scenes.start.entities.push(titleText);
model.scenes.start.entities.push(startText);

const tempPlayText = createTextEntity("in play scene", "35px Arial", "#04fe76", 250, 300);
model.scenes.play.entities.push(tempPlayText);

buildEntity(model.levels.level1, 5, 11);
buildEntity(model.levels.level1, 6, 45);
buildEntity(model.levels.level1, 6, 61);
buildEntity(model.levels.level1, 8, 78);
buildEntity(model.levels.level2, 7, 38);
buildEntity(model.levels.level2, 8, 42);
buildEntity(model.levels.level2, 7, 86);

buildStairs(model.levels.level1, 4, 58, "level2", 28);
buildStairs(model.levels.level2, 3, 28, "level1", 58);
buildStairs(model.levels.level2, 4, 88, "level3", 10);

buildEntityMap(model.levels.level1);
buildEntityMap(model.levels.level2);
