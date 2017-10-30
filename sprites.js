export let spritesheet = new Image();


//takes a call back so run can be excuted from main
export const loadSpritesheet = (source, callback) => {
  spritesheet.src = source;
  spritesheet.onload = () => {
    //run();
    callback();
  };
}
