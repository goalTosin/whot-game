function toCB(cardStr) {
  return {
    num: parseInt(cardStr.substring(cardStr.indexOf("-") + 1)),
    shape: cardStr.substring(0, cardStr.indexOf("-")),
  };
}

function toSC(cardObj) {
  return cardObj.shape + "-" + cardObj.num;
}

function placeable(card, base) {
  return (
    toCB(card).num === toCB(base).num || toCB(card).shape === toCB(base).shape
  );
}

function placeable2(card, base) {
  return card.num === base.num || card.shape === base.shape;
}

// function specialPlaceable(card,base) {
//   if (base === '') {

//   }
// }
/**
 *
 * @param { {num: number; shape: "t" | "s" | "b" | "c" | "p";} } base The base to play on
 * @param { {num: number; shape: "t" | "s" | "b" | "c" | "p";}[] } cards The computer's card to play from
 * @param {boolean} toPick whether the card number of the base is eg 5 for pick 3 is defended or is for the computer to pick 3
 * @returns {string} the card. If it decides to take from market, it should return an empty string
 */
function computerRando(base, cards, toPick) {
  if (toPick) {
    let count = base.num;
    if (
      (count === 2 && cards.some((c) => c.num === 2)) ||
      (count === 3 && cards.some((c) => c.num === 5))
    ) {
      const c =
        count === 2
          ? cards.find((c) => c.num === 2)
          : cards.find((c) => c.num === 5);
      return c;
    } else {
      return ""; //I dont have a defense, i will pick
    }
  } else {
    let c = cards.find((c) => {
      return placeable2(c, baseCard) && c.num !== 20;
    });
    if (c) {
      return c;
    } else if (cards.some((c) => c.num === 20)) {
      let c = cards.find((c) => c.num === 20);
      if (c.num === 20) {
        c.shape = computerRando.wants(cards);
      }
      return c;
    } else {
      return "";
    }
  }
}
computerRando.wants = (cards) => {
  return "tsbpc"[Math.floor(Math.random() * 5)];
};

const engine = computerRando;

function computerPlay() {
  const play = (c) => {
    computerCards.splice(computerCards.indexOf(c), 1);
    removeCompCard();
    setBase(toSC(c));
    if (c.num === 20) {
      setWant(c.shape);
    }
    baseCard = c;
    lastCompCard = c.shape + "-" + c.num;
    if (toPick) {
      // for defense
      toPick = 0;
      picked = 0;
    } else if (c.num === 2 || c.num === 5 || c.num === 14) {
      // for attack
      toPick = c.num === 2 ? 2 : c.num === 5 ? 3 : 1;
    }
    if (c.num === 1 || c.num === 8) {
      setTimeout(computerPlay, 500);
    } else {
      nextTurn();
    }
  };
  const mrkt = () => {
    let cc = market();
    computerCards.push(cc);
    addCard(true, cc.shape + "-" + cc.num);
  };
  const pick = () => {
    mrkt();
    picked += 1;
    if (toPick - picked === 0) {
      toPick = 0;
      picked = 0;
      nextTurn();
    }
  };
  //computer engine:random

  let c = engine(baseCard, computerCards, toPick > 0);
  console.log(c);

  if (c == "") {
    if (toPick > 0) {
      for (let i = 0; i < toPick; i++) {
        setTimeout(pick, i * 500);
      }
    } else {
      mrkt();
      nextTurn();
    }
  } else {
    play(c);
    console.log(c);

    //   let c = computerCards.find((c) => {
    //     return placeable2(c, baseCard);
    //   });
    //   if (c) {
    //     play(c);
    //   } else if (computerCards.some((c) => c.num === 20)) {
    //     play(computerCards.find((c) => c.num === 20));
    //   } else {
    //     let cc = market();
    //     computerCards.push(cc);
    //     addCard(true, cc.shape + "-" + cc.num);
    //     lastCompCard = cc.shape + "-" + cc.num;
    //     nextTurn();
    //   }
  }
}

let playerTurn = true;
let toPick = 0;
let picked = 0;
let lastCompCard = null;
let lastPlayerCard = null;

function nextTurn() {
  if (
    computerCards.length === 0 &&
    ![1, 2, 5, 8, 14, 20].includes(toCB(lastCompCard).num)
  ) {
    playerTurn = false;
    setTimeout(() => {
      alert(
        "Computer WINS! Sorry, but the truth is bitter:\n YOU ARE A LOSER!!"
      );
      document.location.reload();
    }, 500);
  } else if (
    cards.length === 0 &&
    ![1, 2, 5, 8, 14, 20].includes(toCB(lastPlayerCard).num)
  ) {
    setTimeout(() => {
      alert("YOU WIN! I have always believed in you! You're a WINNER!!!!");
      document.location.reload();
    }, 500);
  } else {
    if (playerTurn === true) {
      // if (compToPick) {
      //   toPick = 1
      //   picked = 0
      // }
      console.log("computer turn");
      setWant(false);
      setTimeout(() => computerPlay(), 1000);
      lowerTurnInfo();
      playerTurn = false;
    } else {
      playerTurn = true;
      raiseTurnInfo();
    }
  }
}

async function init() {
  await loadImages();
  await initWantBox();
  for (let i = 0; i < 5; i++) {
    let pc = market();
    cc = market();
    cards.push(pc);
    addCard(false, pc.shape + "-" + pc.num);
    computerCards.push(cc);
    addCard(true, cc.shape + "-" + cc.num);
  }
  // for (let i = 0; i < 5; i++) {
  //   let pc = {...market(), num:20}
  //   cards.push(pc);
  //   addCard(false, pc.shape + "-" + pc.num);
  // }
  // for (let i = 0; i < 5; i++) {
  //   let pc = market()
  //   cards.push(pc);
  //   addCard(false, pc.shape + "-" + pc.num);
  // }
  // if (baseCard.num === 20) {
  //   baseCard.shape ='tspbc'[Math.floor(Math.random()*5)]
  // }
  if (baseCard.num === 20) {
    baseCard.shape = engine.wants(computerCards);
  }
  setWant(baseCard.num === 20 ? baseCard.shape : false);
  // for (let i = 0; i < 8; i++) {
  //   let pc = market();
  //   cards.push({ shape: baseCard.shape, ...pc });
  //   addCard(false, baseCard.shape + "-" + pc.num);
  // }
  setBase(baseCard.shape + "-" + baseCard.num);
  if (baseCard.num === 2 || baseCard.num === 5 || baseCard.num === 14) {
    toPick = baseCard.num === 2 ? 2 : baseCard.num === 5 ? 3 : 1;
  } else if (baseCard.num === 1 || baseCard.num === 8) {
    nextTurn();
  }
  loadMarket();
  onCardClick((id, card) => {
    //when a card is clicked
    if (toCB(card).num === 20 && toPick === 0) {
      setBase(card);
      showWantPicker((shape) => {
        let card = shape + "-20";
        baseCard = toCB(card);
        lastPlayerCard = card;
        removeCard(id);
        cards.splice(cards.indexOf(toCB(card)), 1);
        nextTurn();
        // console.log('RemoveD!');
      });
    } else if (placeable(card, toSC(baseCard)) && playerTurn && toPick === 0) {
      setBase(card);
      baseCard = toCB(card);
      lastPlayerCard = card;
      removeCard(id);
      cards.splice(cards.indexOf(toCB(card)), 1);
      if (![1, 8].includes(toCB(card).num)) {
        if (
          toCB(card).num === 2 ||
          toCB(card).num === 5 ||
          toCB(card).num === 14
        ) {
          toPick = toCB(card).num === 2 ? 2 : toCB(card).num == 5 ? 3 : 1;
        }
        nextTurn();
      }
    } else if (
      toPick > 0 &&
      toCB(card).num === baseCard.num &&
      toCB(card).num !== 14 && // you cant defend a general market with a 14
      picked === 0
    ) {
      setBase(card);
      lastPlayerCard = card;
      baseCard = toCB(card);
      removeCard(id);
      cards.splice(cards.indexOf(toCB(card)), 1);

      toPick = 0;
      picked = 0;
      nextTurn();
    }
  });
  onMarketClick(() => {
    if (playerTurn) {
      let pc = market();
      cards.push(pc);
      addCard(false, pc.shape + "-" + pc.num);
      if (toPick > 0) {
        picked += 1;
      }
      if (toPick - picked === 0) {
        toPick = 0;
        picked = 0;
        nextTurn();
      }
    }
  });
}

init();
