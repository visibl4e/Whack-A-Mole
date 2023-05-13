const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const btnStartPlay = document.querySelector(".btn-one");
const btnClearResult = document.querySelector(".btn-two");
const bonk = new Audio("./45_ApexTom_01_854.wav");
const audioTrack = new Audio("./100_ApexDrums_02_854.wav");

const hiscores = JSON.parse(localStorage.getItem("hiscores")) || [];
const scoreList = document.querySelector(".scoretable");

let lastHole;
let timeUp = false;
let score = 0;
let moleKick = false;
let soundPlay = false;
let worstScore = 0;

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) {
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function popUpMole() {
  const time = randomTime(300, 800);
  const hole = randomHole(holes);
  hole.classList.add("up");
  setTimeout(() => {
    hole.classList.remove("up");
    if (!timeUp) {
      popUpMole();
    } else {
      checkScore();
    }
  }, time);
}

function startGame() {
  if (btnStartPlay) {
    score = 0;
  }

  timeUp = false;
  popUpMole();
  if (soundPlay === false) {
    soundPlay = true;
    audioTrack.play();
    audioTrack.loop = true;
  }

  setTimeout(() => ((soundPlay = false), audioTrack.pause()), 12000);
  setTimeout(() => (timeUp = true), 12000);
  toggleBtnDisable();
}
function clearResults() {
  if (btnClearResult) {
    scoreBoard.innerHTML = 0;
  }
  if (btnClearResult) {
    removeLS();
  }
  toggleBtnDisable();
}

function kick(event) {
  if (!event.isTrusted) return;
  score++;
  this.parentNode.classList.remove("up");
  scoreBoard.textContent = score;
}

function kickSound(e) {
  if (moleKick === false) moleKick = true;
  if (e.target === this) bonk.play();
}

function soundTrackToPlay(e) {
  if (e.target === btnStartPlay && soundPlay === false) {
    soundPlay = true;
    audioTrack.play();
    audioTrack.loop = true;
  }
}

moles.forEach((mole) => mole.addEventListener("click", kick));
moles.forEach((mole) => mole.addEventListener("click", kickSound));
btnStartPlay.addEventListener("click", soundTrackToPlay);

function populateTable() {
  scoreList.innerHTML = hiscores
    .map((row) => {
      return `<tr><td>${row.clicker}</td><td>${row.score}</tr>`;
    })
    .join("");
}

function checkScore() {
  // let worstScore = 0;
  if (hiscores.length > 4) {
    worstScore = hiscores[hiscores.length - 1].score;
  }

  if (score > worstScore) {
    const clicker = window.prompt(`${score} – Top score! What's your name?`);
    hiscores.push({ score, clicker });
  }

  hiscores.sort((a, b) => (a.score > b.score ? -1 : 1));

  // Remove the worst score when table too long
  if (hiscores.length > 5) {
    hiscores.pop();
  }

  populateTable();
  localStorage.setItem("hiscores", JSON.stringify(hiscores));
}

function clearScores() {
  hiscores.splice(0, hiscores.length);
  localStorage.setItem("hiscores", JSON.stringify(hiscores));
  populateTable(hiscores, scoreList);
  toggleBtnDisable();
}

populateTable();

function removeLS() {
  window.localStorage.clear();
}

function toggleBtnDisable() {
  if (btnStartPlay) {
    btnStartPlay.disabled = true;
  } else {
    btnStartPlay.disabled = false;
  }
  setTimeout(() => (btnStartPlay.disabled = false), 11000);
}
