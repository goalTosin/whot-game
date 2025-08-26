let cardCallback = () => {
  console.error("Card click callback not initialised");
};

let marketCallback = () => {
  console.error("Market click callback not initialised");
};

function str2elt(str) {
  const e = document.createElement("div");
  e.innerHTML = str;
  return e.firstElementChild;
}

function drawShape(ctx, card, r, x = 0, y = 0) {
  ctx.save();
  ctx.translate(x, y);
  switch (card.shape) {
    case "c":
      ctx.arc(0, 0, (r * 9) / 10, 0, Math.PI * 2);
      // console.log(0, 0, (r * 9) / 10, 0, Math.PI * 2);
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

function genImage(cardSc) {
  const card = {
    num: cardSc.substring(cardSc.indexOf("-") + 1),
    shape: cardSc.substring(0, cardSc.indexOf("-")),
  };

  const canvas = document.createElement("canvas");
  let h = 100;
  let w = (h * 3) / 5;
  const genMrktOffset = 5;
  const lineWidth = 1;
  const borderRad = 5;
  const scale = 100/h;
  canvas.width = w * scale + (cardSc === "mrkt" ? genMrktOffset * scale : 0);
  canvas.height = h * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  //draw card
  if (cardSc === "mrkt") {
    let n = 3;
    ctx.translate(0, h / 2);
    for (let i = 0; i <= n; i++) {
      ctx.save();
      ctx.scale((i / n) * 0.1 + 0.9, (i / n) * 0.1 + 0.9);
      let x = (i / n) * genMrktOffset;
      ctx.beginPath();
      ctx.roundRect(x, -h / 2, w, h, borderRad);
      // ctx.setLineDash([10, 10]);
      // ctx.strokeStyle = 'maroon'
      // ctx.lineWidth = 4
      // ctx.lineCap = 'round'
      // ctx.stroke()
      ctx.fillStyle = "maroon";
      ctx.fill();
      let ws = (w - lineWidth) / w;
      let hs = (h - lineWidth) / h;
      ctx.beginPath();
      let thickDist = Math.hypot(lineWidth, lineWidth);
      let nDist = Math.hypot(borderRad * 2, borderRad * 2);
      ctx.roundRect(
        x + lineWidth / 2,
        lineWidth / 2 - h / 2,
        w * ws,
        h * hs,
        borderRad / 2
      );

      ctx.strokeStyle = "black";
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      ctx.save();
      ctx.translate(w / 2 + x, 0);
      ctx.font = "12px Ubuntu";
      ctx.fillStyle = "#fff0f0";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("WHOT", -2, -1);
      ctx.rotate(Math.PI);
      ctx.fillText("WHOT", -2, -1);

      ctx.restore();
      ctx.restore();
    }
  } else if (cardSc === "back") {
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, borderRad);
    ctx.setLineDash([10, 10]);
    // ctx.strokeStyle = 'maroon'
    // ctx.lineWidth = 4
    // ctx.lineCap = 'round'
    // ctx.stroke()
    ctx.fillStyle = "maroon";
    ctx.fill();

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.font = "12px Ubuntu";
    ctx.fillStyle = "#fff0f0";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("WHOT", -2, -1);
    ctx.rotate(Math.PI);
    ctx.fillText("WHOT", -2, -1);

    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, borderRad);
    ctx.setLineDash([10, 10]);
    // ctx.strokeStyle = 'maroon'
    // ctx.lineWidth = 4
    // ctx.lineCap = 'round'
    // ctx.stroke()
    ctx.fillStyle = "#fff0f0";
    ctx.fill();

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.beginPath();
    let r = (w * 5) / 13;
    drawShape(ctx, card, r);
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

    // if (card.num !== 20) {
      const shappe = (tw = 0) => {
        ctx.beginPath();
        // drawShape(card, 4, 0, -h/2);
        drawShape(ctx, card, 4, -w / 2 + 7 + tw / 4, -h / 2 + 20);
        ctx.fillStyle = "maroon";
        ctx.fill();
      };
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.fillStyle = "maroon";
      ctx.textBaseline = "top";
      ctx.textAlign = "start";
      ctx.font = "12px system-ui";
      let tw = ctx.measureText(card.num + "").width;
      ctx.fillText(card.num + "", -w / 2 + 3, -h / 2 + 5);
      shappe(card.num < 10 ? 0 : tw);
      ctx.rotate(Math.PI);
      ctx.fillText(card.num + "", -w / 2 + 3, -h / 2 + 5);
      shappe(card.num < 10 ? 0 : tw);

      ctx.restore();
    // }
  }
  return new Promise((resolve, reject) => {
    return canvas.toBlob((b) => {
      const url = URL.createObjectURL(b);
      // URL.revokeObjectURL(url)
      resolve(url);
    }, "png/image");
  });
}

const imageMap = {};

//create card images
async function loadImages() {
  imageMap["-20"] = await genImage("-20");
  imageMap["back"] = await genImage("back");
  imageMap["mrkt"] = await genImage("mrkt");
  for (let i = 0; i < 15; i++) {
    let num = i === 14 ? 20 : i + 1;
    for (let j = 0; j < 5; j++) {
      let shape = "tsbcp"[j];
      let card = shape + "-" + num;
      if (num === 20) {
        imageMap[card] = imageMap["-20"]
        
      }else {
        imageMap[card] = await genImage(card);
      }
    }
  }
}

const ui = {
  computerContainer: document.getElementById("computer"),
  playerContainer: document.getElementById("player"),
  middleContainer: document.getElementById("middle"),
};

// card format: string with a character shape: 't' or 's' or 'b' (for triangle or square or box) followed by an '-' and then the number 14 or 20 or 1. Eg 't-14', 'b-6', 's-13'
function createCardElt(card, playable = false) {
  if (!(card in imageMap)) {
    console.log(card);
    console.error("Cannot find card!");
    return;
  }
  let id = Math.floor(Math.random() * 0xffff).toString(16);
  const cardElt = str2elt(
    `<img class="card" data-card="${card}" src="${imageMap[card]}" id="${id}"></div>`
  );
  if (playable) {
    cardElt.addEventListener("click", () => {
      cardCallback(id, card);
    });
  } else if (card === "mrkt") {
    cardElt.addEventListener("click", () => {
      marketCallback();
    });
  }
  return cardElt;
}

function addCard(computer = false, card) {
  if (computer) {
    ui.computerContainer.append(createCardElt("back"));
  } else {
    ui.playerContainer.append(createCardElt(card, true));
  }
}

function removeCard(id) {
  document.getElementById(id).remove();
  // if (computer) {
  //   let cardE = ui.computerContainer.querySelector(`img[data-card=${card}]`);
  //   if (cardE) {
  //     cardE.remove();
  //   }
  // } else {
  //   let cardE = ui.playerContainer.querySelector(`img[data-card=${card}]`);
  //   if (cardE) {
  //     cardE.remove();
  //   }
  // }
}
function setWant(shape) {
  const shapes = {
    t: "triangle",
    b: "square",
    s: "star",
    p: "plus",
    c: "circle",
  };
  // console.log('@'+shape+"@");
  if (shape) {
    document.getElementById("info").innerText =
      "Your turn. Your opponent wants a " + shapes[shape.trim()];
    // console.log(shape, shapes[shape.trim()]);
  } else {
    document.getElementById("info").innerText = "Your turn";
  }
}
async function genShape(shape) {
  const canvas = document.createElement("canvas");
  let s = 120;
  const scale = 1;
  canvas.width = s * scale;
  canvas.height = s * scale;
  const ctx = canvas.getContext("2d");
  ctx.save();
  ctx.scale(scale, scale);
  ctx.beginPath();
  drawShape(ctx, { shape }, s / 2, s / 2, s / 2);
  ctx.fillStyle = "maroon";
  ctx.fill();

  // ctx.beginPath();
  // // drawShape(ctx, shape, 240, 0, 0);
  // ctx.moveTo(0,0)
  // ctx.lineTo(50, 110)
  // // console.log(ctx, shape,240, s/2,s/2);
  // ctx.lineWidth = 1
  // ctx.strokeStyle = "maroon";
  // ctx.stroke();
  ctx.restore();
  return new Promise((resolve, reject) => {
    return canvas.toBlob((b) => {
      const url = URL.createObjectURL(b);
      // URL.revokeObjectURL(url)
      resolve(url);
    }, "png/image");
  });
}
let wantCallback = () => null;
async function initWantBox() {
  let wanter = document.getElementById("want-box");
  for (let i = 0; i < 5; i++) {
    let p = await genShape("tsbcp"[i]);
    let sh = str2elt(
      `<img class="want" data-shape="${"tsbcp"[i]}" src="${p}"/>`
    );
    sh.onclick = () => {
      wantCallback("tsbcp"[i]);
      // console.log(i);
      wanter.close();
    };
    wanter.append(sh);
  }
}
function showWantPicker(res) {
  let wanter = document.getElementById("want-box");
  wanter.showModal();
  // console.log('hey');
  wantCallback = res;
}

function removeCompCard() {
  let cardE = ui.computerContainer.children[0];
  if (cardE) {
    cardE.remove();
  }
}

function loadMarket() {
  let mrkt = document.getElementById("market")//.querySelector("img");

  mrkt && (mrkt.src = imageMap['mrkt']);
  mrkt.addEventListener("click", () => {
    marketCallback();
  });
}

function setBase(card) {
  let cardElt = document.getElementById("base")//.querySelector("img");

  cardElt && (cardElt.src = imageMap[card]);
  // document.getElementById("base").append(createCardElt(card));
}

function onCardClick(callback) {
  cardCallback = callback;
}
function onMarketClick(callback) {
  marketCallback = callback;
}

function lowerTurnInfo() {
  document.getElementById("info").classList.add("down");
}

function raiseTurnInfo() {
  document.getElementById("info").classList.remove("down");
}
