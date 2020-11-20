const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const buttonStartGame = document.querySelector('#startGame');
const gameLevel = document.querySelector('.levelValue');
let currentLevel, currentScore;
let minTime, maxTime;

let lasthole;
let timeUp = false;
let score = 0;

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const index = Math.floor(Math.random() * holes.length);
  const hole = holes[index];
  if (hole === lasthole) {
    return randomHole(holes);
  }
  lasthole = hole;
  return hole;
}

function appearHidMole() {
  const time = randomTime(minTime, maxTime);
  const hole = randomHole(holes);
  hole.classList.add('up');
  setTimeout(() => {
    hole.classList.remove('up');
    if (!timeUp) appearHidMole();
  }, time);
}

function setInfoLevelScore() {
  localStorage.clear();
  localStorage.setItem('level', `${gameLevel.classList[1]}`);
  localStorage.setItem('score', `${score}`);
}

function getInfoLevelScore() {
  currentLevel = localStorage.getItem('level');
  currentScore = localStorage.getItem('score');
  if (currentLevel === 'easy' && currentScore <= 7) {
    localStorage.clear();
    score = 0;
  }
  if (currentLevel === 'middle' && currentScore <= 15) {
    localStorage.clear();
    score = 0;
  }
  if (currentLevel === 'hard') {
    localStorage.clear();
    score = 0;
    gameLevel.classList.add('easy');
  }
}

function startGame() {
  getInfoLevelScore();
  if (score === 0) {
    startLevelEasy();
  }
  if (currentLevel === 'easy' && currentScore > 7) {
    startLevelMiddle();
  }
  if (currentLevel === 'middle' && currentScore > 15) {
    startLevelHard();
  }
}

function startLevelEasy() {
  minTime = 400;
  maxTime = 1800;
  gameLevel.classList.remove('hard');
  gameLevel.classList.remove('middle');
  scoreBoard.textContent = 0;
  timeUp = false;
  score = 0;
  appearHidMole(minTime, maxTime);
  setTimeout(() => {
    timeUp = true;
    setInfoLevelScore();
  }, 12000);
}

function startLevelMiddle() {
  minTime = 200;
  maxTime = 1600;
  gameLevel.classList.remove('easy');
  gameLevel.classList.add('middle');
  scoreBoard.textContent = currentScore;
  timeUp = false;
  score = currentScore;
  appearHidMole(minTime, maxTime);
  setTimeout(() => {
    timeUp = true;
    setInfoLevelScore();
  }, 15000);
}

function startLevelHard() {
  minTime = 200;
  maxTime = 1000;
  gameLevel.classList.remove('easy');
  gameLevel.classList.remove('middle');
  gameLevel.classList.add('hard');
  scoreBoard.textContent = currentScore;
  timeUp = false;
  score = currentScore;
  appearHidMole(minTime, maxTime);
  setTimeout(() => {
    timeUp = true;
    setInfoLevelScore();
  }, 20000);
}

function bonk(e) {
  if (!e.isTrusted) return;
  score++;
  this.parentNode.classList.remove('up');
  scoreBoard.textContent = score;
}

moles.forEach((mole) => mole.addEventListener('click', bonk));
buttonStartGame.addEventListener('click', startGame);
