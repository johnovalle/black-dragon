import {CANVAS_WIDTH, CANVAS_HEIGHT} from "./config";
// not comfortable doing DOM manipulation here so exporting the canvas and do it from main file

export const canvas = document.createElement('canvas');
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
canvas.style = "border: 1px solid black";


export const ctx = canvas.getContext('2d');
