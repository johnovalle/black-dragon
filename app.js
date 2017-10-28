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
}



const Scene = {
  entities: [],
  controlMap: {},
  onEnter(previous) {}
}

const run = () => {
  draw(model.state);
  requestAnimationFrame(run);
}

const draw = (state) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScene(state.currentScene);
}

const Entity = {
  x: 0,
  y: 0,
  type: null
}



const createTextEntity = (text, font, color, x, y) => {
  let entity = Object.assign({}, Entity, {text, font, color, x, y});
  entity.type = "text";

  return entity;
}


const drawScene = (scene) => {
  // draw entities
  for(let i = 0, len = scene.entities.length; i < len; i++ ){
    let entity = scene.entities[i];
    if(entity.type === "text"){
      ctx.fillStyle = entity.color;
      ctx.font = entity.font;
      ctx.fillText(entity.text, entity.x, entity.y);
    }
  }
  // draw map
  //console.log(scene.level);
  if(scene.level){ // move this into separate generic function - remove magic numbers
    for(let i = 0, len = scene.level.backgroundMap.length;  i < len; i++){
      let tile = scene.level.backgroundMap[i];
      let x = (i % 10) * 64; // index / width of drawing area in tiles * tile size
      let y = Math.floor(i / 10) * 64;
      let sx = (tile % 5) * 64 // tile value against width of tilesheet in tiles * tile size on sheet
      let sy = Math.floor(tile / 5) * 64;
      ctx.drawImage(spritesheet, sx, sy, 64, 64, x, y, 64, 64);
    }
  }
}


addEventListener("keydown", (event) => {
    // console.log(event.key);
    let request = model.state.currentScene.controlMap[event.key]();
    // console.log(request, request.args);
    if(request){
        request.action(...request.args);
    }
});

let map1 = [1,1,1,0,1,1,1,1,1,1,
            1,2,1,0,1,2,1,2,2,1,
            1,2,1,0,1,2,1,2,2,1,
            1,2,1,1,1,2,1,2,2,1,
            1,2,2,2,2,2,2,2,2,1,
            1,2,2,2,1,1,1,2,4,1,
            1,2,2,2,1,0,1,2,2,1,
            1,2,2,1,1,0,1,1,2,1,
            1,2,2,1,0,0,0,1,1,1,
            1,1,1,1,0,0,0,0,1,1
          ];
let map2 = [1,1,1,1,0,0,1,1,1,1,
            1,2,2,1,0,0,1,2,3,1,
            1,2,2,1,0,0,1,2,2,1,
            1,2,2,1,0,0,1,2,2,1,
            1,2,2,1,1,1,1,2,2,1,
            1,1,2,2,2,2,2,2,2,1,
            1,1,1,2,2,1,1,1,1,1,
            0,0,1,2,2,1,1,1,1,1,
            0,0,1,2,2,2,2,2,4,1,
            0,0,1,1,1,1,1,1,1,1
          ];

// create generic sprite loader
let spritesheet = new Image();
spritesheet.onload = () => {
  run();
};
spritesheet.src = "blackdragon-sprites-00.png";
const goToLevel = (level) => {
  model.scenes.play.level.backgroundMap = model.maps[level];
}

const model = {
  state: {
    currentScene: null
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
          model.scenes.play.level.backgroundMap = model.maps[0];
        }
      },
      entities: [],
      controlMap: {
        "Enter": () => { return {action: goToLevel, args: [1]}; }
      },
      level: {
        backgroundMap: null
      }
    }
  },
  maps: [map1, map2] //consider changing this from an array to a object
}
model.state.currentScene = model.scenes.start;
console.log(model);

const titleText = createTextEntity("Black Dragon", "50px Arial", "#000", 170, 100);
const startText = createTextEntity("Press Enter to start", "30px Arial", "#333", 190, 400);
model.scenes.start.entities.push(titleText);
model.scenes.start.entities.push(startText);

const tempPlayText = createTextEntity("in play scene", "35px Arial", "#04fe76", 250, 300);
model.scenes.play.entities.push(tempPlayText);
