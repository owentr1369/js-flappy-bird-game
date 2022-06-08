import {
  s_bg,
  s_fg,
  s_pipeNorth,
  s_pipeSouth,
  s_text,
  s_score,
  s_splash,
  s_buttons,
  s_numberS,
  s_numberB,
  initSprites,
  s_bird,
} from "./sprite.js";

let canvas, ctx, width, height;
let fgpos = 0;
let frames = 0;
let score = 0;
let best = 0;

let currentState;

const states = {
  Splash: 0,
  Game: 1,
  Score: 2,
};
let bird = {
  x: 80,
  y: 120,
  frame: 0,
  animation: [0, 1, 2, 1],
  rotation: 0,
  gravity: 0.25,
  _jump: 4.6,

  jump: function () {
    this.velocity = -this._jump;
  },

  update: function () {},
  draw: function (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    let n = this.animation[this.frame];

    s_bird[n].draw(ctx, -s_bird[n].width / 2, -s_bird[n].height / 2);
    ctx.restore();
  },
};
let pipes = {
  update: function () {
    let n = currentState === states.Splash ? 10 : 5;
  },
  draw: function () {},
};

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
    ctx.fillStyle = s_bg.color;
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
function update() {
  frames++;
  fgpos = (fgpos - 2) % 14;
}
function render() {
  ctx.fillRect(0, 0, width, height);

  s_bg.draw(ctx, 0, height - s_bg.height);
  s_bg.draw(ctx, s_bg.width, height - s_bg.height);

  bird.draw(ctx);

  s_fg.draw(ctx, fgpos, height - s_fg.height);
  s_fg.draw(ctx, fgpos + s_fg.width, height - s_fg.height);
}
main();
