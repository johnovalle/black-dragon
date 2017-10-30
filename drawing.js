import {tileSize, sheetSize, sheetCols, mapCols, mapRows, CANVAS_WIDTH, CANVAS_HEIGHT} from "./config";
import {ctx} from "./canvas";
import {spritesheet} from "./sprites";
import {messageLog} from "./messageLog";

export const draw = (state) => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawScene(state.currentScene);
};

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
    drawMessages();
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

const drawMessages = () => {
  let messages = messageLog.messages.slice(-2);
  for(let i = 0; i < messages.length; i++){
    ctx.fillStyle = "#000";
    ctx.font = "15px Arial";
    ctx.fillText(messages[i], 20, 660 + (i * 20));
  }
}
