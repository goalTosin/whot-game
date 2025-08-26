/**
 * @type {<T>(callback: () => T, predicate: (value: T)=> boolean)=> T}
 */
function refine(callback, predicate) {
  let v = null;
  while (!predicate((v = callback()))) {}
  return v;
}

/**
 *
 * @param {number} num
 * @param {"t" | "s" | "b" | "c"|'p'} shape
 */
function card(
  num = Math.random() < 1 / 15 ? 20 : 1 + Math.floor(Math.random() * 14),
  shape = "tsbcp"[Math.floor(Math.random() * 5)]
) {
  return { num, shape: num == 20 ? "" : shape };
}
function market() {
  return refine(card, (v) => {
    return !(cards.includes(v) || computerCards.includes(v));
  });
}
/**
 * @type {{num: number;shape: "t" | "s" | "b" | "c"|'p';}[]}
 */
const cards = [];
/**
 * @type {{num: number;shape: "t" | "s" | "b" | "c"|'p';}[]}
 */
const computerCards = [];

let baseCard = card();

// init
for (let i = 0; i < 5; i++) {
  cards.push(market());
  computerCards.push(market());
}

const canvas = document.querySelector("canvas");
function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);
const ctx = canvas.getContext("2d");

let turn = 0;
let info = ''

function drawShape(card, r, x = 0, y = 0) {
  ctx.save();
  ctx.translate(x, y);
  switch (card.shape) {
    case "c":
      ctx.arc(0, 0, (r * 9) / 10, 0, Math.PI * 2);
      break;

    case "t":
      // ctx.arc(Math.cos(-Math.PI/2)*r, Math.sin(-Math.PI/2)*r, 2, 0, Math.PI * 2);
      // ctx.arc(Math.cos(Math.PI/6)*r, Math.sin(Math.PI/6)*r, 2, 0, Math.PI * 2);
      // ctx.arc(Math.cos(Math.PI*5/6)*r, Math.sin(Math.PI*5/6)*r, 2, 0, Math.PI * 2);

      ctx.moveTo(Math.cos(-Math.PI / 2) * r, Math.sin(-Math.PI / 2) * r);
      ctx.lineTo(Math.cos(Math.PI / 6) * r, Math.sin(Math.PI / 6) * r);
      ctx.lineTo(
        Math.cos((Math.PI * 5) / 6) * r,
        Math.sin((Math.PI * 5) / 6) * r
      );
      ctx.closePath();
      break;

    case "s":
      let s = -Math.PI / 2;
      for (let i = 0; i < 10; i++) {
        let a = ((Math.PI * 2) / 10) * i;
        let lr = i % 2 === 0 ? r : (r * 13) / 28;
        let x = Math.cos(s + a) * lr,
          y = Math.sin(s + a) * lr;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      break;

    case "b":
      let br = 0.7071 * r;
      ctx.rect(-br, -br, br * 2, br * 2);
      break;

    case "p":
      let t = r / 5;
      let lr = Math.cos(Math.PI / 4) * r;
      ctx.rect(-t, -lr, t * 2, lr * 2);
      ctx.rect(-lr, -t, lr * 2, t * 2);
      break;

    default:
      if (!card.num == 20) {
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "red";
        ctx.stroke();
      }
      break;
  }
  ctx.restore();
}

function drawCards() {
  let h = canvas.height / 8;
  let w = (h * 3) / 5;
  let y = (canvas.height * 1) / 4 - h / 2;
  let gap = 20;
  cards.forEach((card, i) => {
    let x = i * w - (w * cards.length) / 2 + (i - (cards.length - 1) / 2) * gap;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 5);
    ctx.setLineDash([10, 10]);
    // ctx.strokeStyle = 'maroon'
    // ctx.lineWidth = 4
    // ctx.lineCap = 'round'
    // ctx.stroke()
    ctx.fillStyle = "#fff0f0";
    ctx.fill();

    ctx.save();
    ctx.translate(w / 2 + x, h / 2 + y);
    ctx.beginPath();
    let r = (w * 5) / 13;
    drawShape(card, r);
    // ctx.setLineDash([1, 0]);
    if (card.num != 20) {
      ctx.fillStyle = "maroon";
      ctx.fill();
    } else {
      ctx.font = "12px Ubuntu";
      ctx.fillStyle = "maroon";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("WHOT", -2, -1);
      ctx.rotate(Math.PI);
      ctx.fillText("WHOT", -2, -1);
    }

    ctx.restore();

    const shappe = () => {
      ctx.beginPath();
      drawShape(card, 4, -w / 2 + 7, -h / 2 + 20);
      ctx.fillStyle = "maroon";
      ctx.fill();
    };
    ctx.save();
    ctx.translate(w / 2 + x, h / 2 + y);
    ctx.fillStyle = "maroon";
    ctx.textBaseline = "top";
    ctx.textAlign = "start";
    ctx.font = "12px system-ui";
    ctx.fillText(card.num + "", -w / 2 + 3, -h / 2 + 5);
    shappe();
    ctx.rotate(Math.PI);
    ctx.fillText(card.num + "", -w / 2 + 3, -h / 2 + 5);
    shappe();

    ctx.restore();
    // console.log(i, x,y,w,h);
  });
  let cy = -y * 2;

  computerCards.forEach((_, i) => {
    let x =
      i * w -
      (w * computerCards.length) / 2 +
      (i - (computerCards.length - 1) / 2) * gap;
    ctx.beginPath();
    ctx.roundRect(x, cy, w, h, 5);
    ctx.setLineDash([10, 10]);
    // ctx.strokeStyle = 'maroon'
    // ctx.lineWidth = 4
    // ctx.lineCap = 'round'
    // ctx.stroke()
    ctx.fillStyle = "maroon";
    ctx.fill();

    ctx.save();
    ctx.translate(w / 2 + x, h / 2 + cy);
    ctx.font = "12px Ubuntu";
    ctx.fillStyle = "#fff0f0";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("WHOT", -2, -1);
    ctx.rotate(Math.PI);
    ctx.fillText("WHOT", -2, -1);

    ctx.restore();
  });

  (function () {
    let x = -w / 2;
    let y = -h / 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 5);
    ctx.setLineDash([10, 10]);
    // ctx.strokeStyle = 'maroon'
    // ctx.lineWidth = 4
    // ctx.lineCap = 'round'
    // ctx.stroke()
    ctx.fillStyle = "#fff0f0";
    ctx.fill();

    ctx.save();
    ctx.translate(w / 2 + x, h / 2 + y);
    ctx.beginPath();
    let r = (w * 5) / 13;
    drawShape(baseCard, r);
    // ctx.setLineDash([1, 0]);
    if (baseCard.num != 20) {
      ctx.fillStyle = "maroon";
      ctx.fill();
    } else {
      ctx.font = "12px Ubuntu";
      ctx.fillStyle = "maroon";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("WHOT", -2, -1);
      ctx.rotate(Math.PI);
      ctx.fillText("WHOT", -2, -1);
    }

    ctx.restore();

    const shappe = () => {
      ctx.beginPath();
      drawShape(baseCard, 4, -w / 2 + 7, -h / 2 + 20);
      ctx.fillStyle = "maroon";
      ctx.fill();
    };
    ctx.save();
    ctx.translate(w / 2 + x, h / 2 + y);
    ctx.fillStyle = "maroon";
    ctx.textBaseline = "top";
    ctx.textAlign = "start";
    ctx.font = "12px system-ui";
    ctx.fillText(baseCard.num + "", -w / 2 + 3, -h / 2 + 5);
    shappe();
    ctx.rotate(Math.PI);
    ctx.fillText(baseCard.num + "", -w / 2 + 3, -h / 2 + 5);
    shappe();

    ctx.restore();
  })();

  (function () {
    let x = -w / 2 - w * 2 - gap * 2;
    let y = -h / 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 5);
    ctx.setLineDash([10, 10]);
    // ctx.strokeStyle = 'maroon'
    // ctx.lineWidth = 4
    // ctx.lineCap = 'round'
    // ctx.stroke()
    ctx.fillStyle = "maroon";
    ctx.fill();

    ctx.save();
    ctx.translate(w / 2 + x, h / 2 + y);
    ctx.font = "12px Ubuntu";
    ctx.fillStyle = "#fff0f0";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("WHOT", -2, -1);
    ctx.rotate(Math.PI);
    ctx.fillText("WHOT", -2, -1);

    ctx.restore();
  })();

  if (turn % 2 === 0) {
    let w = canvas.width / 4;
    let h = Math.min(canvas.height / 25, 50);

    ctx.beginPath();
    ctx.roundRect(-w / 2, canvas.height / 2 - h, w, h, [10, 10, 0, 0]);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.font = "15px Ubuntu";
    ctx.fillStyle = "white";
    ctx.fillText("Your turn", 0, canvas.height / 2 - 3);
  }
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  drawCards();
  ctx.restore();
}

function update() {}

function animate() {
  requestAnimationFrame(animate);
  update();
  draw();
}
animate();

canvas.addEventListener("pointerdown", (ev) => {
  if (turn % 2=== 0) {
  let px = ev.clientX - canvas.width / 2,
    py = ev.clientY - canvas.height / 2;
  let i = cards.findIndex((c, i) => {
    let gap = 20;
    let h = canvas.height / 8;
    let w = (h * 3) / 5;
    let x = i * w - (w * cards.length) / 2 + (i - (cards.length - 1) / 2) * gap;
    let y = (canvas.height * 1) / 4 - h / 2;
    if (px > x && px <= x + w && py > y && py <= y + w) {
      return true;
    }
  });
  if (cards[i]) {
    baseCard = cards.splice(i, 1)[0];
    if (baseCard.num !== 1&&baseCard.num!==8) {
      turn += 1
    }
  } else {
    
      // turn += 1
  }
    
  }
});
