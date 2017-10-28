const canvas = document.createElement('canvas');
canvas.height = 640;
canvas.width = 640;
canvas.style = "border: 1px solid black";
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

// step 1:
//     generate maps
//     be able to go from scene to scene and level to level
//     player can move on screen and no pass through walls
//     player can go to next level by walking on stairs and will go to correct location
const changeScene = (scene) => { //
  model.state.currentScene = scene;
}

const model = {
  state: {
    currentScene: null
  },
  scenes: {
    start: {
      entities: [],
      controlMap: {
        "Enter": () => { return {action: changeScene, args: [model.scenes.play]}; }
      }
    },
    play: {
      entities: [],
      controlMap: {
        "Enter": () => { return {action: changeScene, args: [model.scenes.start]}; }
      }
    }
  }
}
model.state.currentScene = model.scenes.start;
console.log(model);

const Scene = {
  entities: [],
  controlMap: {}
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
const titleText = createTextEntity("Black Dragon", "50px Arial", "#000", 170, 100);
const startText = createTextEntity("Press Enter to start", "30px Arial", "#333", 190, 400);
model.scenes.start.entities.push(titleText);
model.scenes.start.entities.push(startText);

const tempPlayText = createTextEntity("in play scene", "35px Arial", "#04fe76", 250, 300);
model.scenes.play.entities.push(tempPlayText);

const drawScene = (scene) => {
  //draw entities
  for(let i = 0, len = scene.entities.length; i < len; i++ ){
    let entity = scene.entities[i];
    if(entity.type === "text"){
      ctx.fillStyle = entity.color;
      ctx.font = entity.font;
      ctx.fillText(entity.text, entity.x, entity.y);
    }
  }
  //draw map
}


addEventListener("keydown", (event) => {
    //console.log(event.key);
    let request = model.state.currentScene.controlMap[event.key]();
    //console.log(request, request.args);
    if(request){
        request.action(...request.args);
    }
});



run();
