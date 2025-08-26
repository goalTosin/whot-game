/**
 * @type {<T>(callback: () => T, predicate: (value: T)=> boolean)=> T}
 */
function refine(callback, predicate) {
  let v = null;
  while (!predicate((v = callback()))) {}
  return v;
}
/**
 * @type {<T,S>(c: (value: T) => S, v:T)=> S}
 */
function wrap(c, v) {
  return c(v);
}

/**
 *
 * @param {number} num
 * @param {"t" | "s" | "b" | "c" | "p"} shape
 */
function card(
  num = Math.random() < 1 / 15 ? 20 : 1 + Math.floor(Math.random() * 14),
  shape = "tsbcp"[Math.floor(Math.random() * 5)]
) {
  return { num, shape: num == 20 ? "" : shape };
}
function market() {
  return refine(card, (v) => {
    return (
      !cards.some((c) => c.num === v.num && c.shape === v.shape) &&
      !computerCards.includes(v)
    );
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

let baseCard = card(); //{num:20,shape:'t'}
