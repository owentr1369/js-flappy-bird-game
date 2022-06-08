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
let okbtn;

let bird = {
  x: 60,
  y: 0,
  frame: 0,
  animation: [0, 1, 2, 1],
  rotation: 0,
  radius: 12,
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
      this.rotation = 0;
    } else {
      this.velocity += this.gravity;
      this.y += this.velocity;

      // click to jump
      if (this.y >= height - s_fg.height - 10) {
        this.y = height - s_fg.height - 10;
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
  _pipes: [],
  reset: function () {
    this._pipes = [];
  },
  update: function () {
    if (frames % 100 === 0) {
      let _y =
        height - (s_pipeSouth.height + s_fg.height + 120 + 200 * Math.random());
      this._pipes.push({
        x: 500,
        y: _y,
        width: s_pipeSouth.width,
        height: s_pipeSouth.height,
      });
    }
    for (let i = 0, len = this._pipes.length; i < len; i++) {
      let p = this._pipes[i];

      if (i === 0) {
        score += p.x === bird.x ? 1 : 0;

        let cx = Math.min(Math.max(bird.x, p.x), p.x + p.width);
        let cy1 = Math.min(Math.max(bird.y, p.y), p.y + p.height);
        let cy2 = Math.min(
          Math.max(bird.y, p.y + p.height + 80),
          p.y + 2 * p.height + 80
        );

        let dx = bird.x - cx;
        let dy1 = bird.y - cy1;
        var dy2 = bird.y - cy2;

        var d1 = dx * dx + dy1 * dy1;
        var d2 = dx * dx + dy2 * dy2;

        let r = bird.radius * bird.radius;

        if (r > d1 || r > d2) {
          currentState = states.Score;
        }
      }

      p.x -= 2;
      if (p.x < -50) {
        this._pipes.splice(i, 1);
        i--;
        len--;
      }
    }
  },
  draw: function (ctx) {
    for (let i = 0, len = this._pipes.length; i < len; i++) {
      let p = this._pipes[i];
      s_pipeSouth.draw(ctx, p.x, p.y);
      s_pipeNorth.draw(ctx, p.x, p.y + 80 + p.height);
    }
  },
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
      let mx = evt.offsetX,
        my = evt.offsetY;

      if ((mx == null, my == null)) {
        mx = evt.touches[0].clientX;
        my = evt.touches[0].clientY;
      }

      if (
        okbtn.x < mx &&
        mx < okbtn.x + okbtn.width &&
        okbtn.y < my &&
        my < okbtn.y + okbtn.height
      ) {
        pipes.reset();
        currentState = states.Splash;
        score = 0;
      }
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

    okbtn = {
      x: (width - s_buttons.Ok.width) / 2,
      y: height - 200,
      width: s_buttons.Ok.width,
      height: s_buttons.Ok.height,
    };

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
  if (currentState !== states.Score) {
    fgpos = (fgpos - 2) % 14;
  } else {
    best = Math.max(best, score);
  }

  if (currentState === states.Game) {
    pipes.update();
  }

  bird.update();
}
function render() {
  ctx.fillRect(0, 0, width, height);

  s_bg.draw(ctx, 0, height - s_bg.height);
  s_bg.draw(ctx, s_bg.width, height - s_bg.height);

  pipes.draw(ctx);

  bird.draw(ctx);

  s_fg.draw(ctx, fgpos, height - s_fg.height);
  s_fg.draw(ctx, fgpos + s_fg.width, height - s_fg.height);
  let width2 = width / 2;

  if (currentState === states.Splash) {
    s_splash.draw(ctx, width2 - s_splash.width / 2, height - 300);
    s_text.GetReady.draw(ctx, width2 - s_text.GetReady.width / 2, height - 380);
  }

  if (currentState === states.Score) {
    s_text.GameOver.draw(ctx, width2 - s_text.GameOver.width / 2, height - 400);
    s_score.draw(ctx, width2 - s_score.width / 2, height - 340);
    s_buttons.Ok.draw(ctx, okbtn.x, okbtn.y);

    s_numberS.draw(ctx, width2 - 47, height - 304, score, null, 10);
    s_numberS.draw(ctx, width2 - 47, height - 262, best, null, 10);
  } else {
    s_numberB.draw(ctx, null, 20, score, width2);
  }
}
main();

// ctx.fillStyle = "#f00";
// ctx.beginPath();
// ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
// ctx.fill();
