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
  x: 60,
  y: 0,
  frame: 0,
  animation: [0, 1, 2, 1],
  rotation: 0,
  gravity: 0.25,
  _jump: 4.6,

  jump: function () {
    this.velocity = -this._jump;
  },

  update: function () {
    var n = currentState === states.Splash ? 10 : 5;

    // flapping
    this.frame += frames % n === 0 ? 1 : 0;
    this.frame %= this.animation.length;

    // moving up and down
    if (currentState === states.Splash) {
      this.y = height - 280 + 5 * Math.cos(frames / 10);
      this.rotate = 0;
    } else {
      this.velocity += this.gravity;
      this.y += this.velocity;

      // click to jump
      if (this.y >= height - s_fg.height - 10) {
        this.y = height - s_bg.height - 10;
        if (currentState === states.Game) {
          currentState = states.Score;
        }
        this.velocity = this._jump;
      }
      // Rotate bird when click
      if (this.velocity >= this._jump) {
        this.frame = 1;
        this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
      } else {
        this.rotation = -0.3;
      }
    }
  },
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
  update: function () {},
  draw: function () {},
};

function onpress(evt) {
  switch (currentState) {
    case states.Splash:
      currentState = states.Game;
      bird.jump();
      break;
    case states.Game:
      bird.jump();
      break;
    case states.Score:
      break;
  }
}

function main() {
  canvas = document.createElement("canvas");

  width = window.innerWidth;
  height = window.innerHeight;
  let evt = "touchstart";
  if (width >= 500) {
    width = 320;
    height = 480;
    canvas.style.border = "1px solid #000";
    evt = "mousedown";
  }
  // remove getReady
  document.addEventListener(evt, onpress);

  canvas.width = width;
  canvas.height = height;

  ctx = canvas.getContext("2d");

  currentState = states.Splash;

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
  bird.update();
  pipes.update();
}
function render() {
  ctx.fillRect(0, 0, width, height);

  s_bg.draw(ctx, 0, height - s_bg.height);
  s_bg.draw(ctx, s_bg.width, height - s_bg.height);

  bird.draw(ctx);

  pipes.draw(ctx);

  s_fg.draw(ctx, fgpos, height - s_fg.height);
  s_fg.draw(ctx, fgpos + s_fg.width, height - s_fg.height);
  let width2 = width / 2;

  if (currentState === states.Splash) {
    s_splash.draw(ctx, width2 - s_splash.width / 2, height - 300);
    s_text.GetReady.draw(ctx, width2 - s_text.GetReady.width / 2, height - 380);
  }
}
main();
