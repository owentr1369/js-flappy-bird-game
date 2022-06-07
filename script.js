import { s_bg, initSprites } from "./sprite.js";

let canvas, ctx, width, height;
let frames = 0;
let score = 0;
let best = 0;

let currentState;
const states = {
  Splash: 0,
  Game: 1,
  Score: 2,
};
let bird = {};
let pipes = {};

function main() {
  canvas = document.createElement("canvas");

  width = window.innerWidth;
  height = window.innerHeight;

  if (width >= 500) {
    width = 320;
    height = 480;
    canvas.style.border = "1px solid #000";
  }
  canvas.width = width;
  canvas.height = height;
  //   canvas.style.border = "1px solid #000";
  ctx = canvas.getContext("2d");

  document.body.appendChild(canvas);

  var img = new Image();

  img.onload = function () {
    initSprites(this);
    run();
  };
  img.src = "./assets/sheet.png";
}
function run() {
  function loop() {
    update();
    render();
    window.requestAnimationFrame(loop, canvas);
  }
  window.requestAnimationFrame(loop, canvas);
}
function update() {}
function render() {
  s_bg.draw(ctx, 0, height - s_bg.height);
  s_bg.draw(ctx, s_bg.width, height - s_bg.height);
}
main();
