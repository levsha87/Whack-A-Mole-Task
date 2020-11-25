const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const buttonStartGame = document.querySelector('#startGame');
const gameLevel = document.querySelector('.levelValue');
let currentLevel, currentScore;
let minTime = 200,
  maxTime = 2000;

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

function startGame() {
  getInfoLevelScore();
  if (score <= 7) {
    startLevelEasy();
  }
  if (currentLevel === 'easy' && score > 7) {
    startLevelMiddle();
  }
  if (currentLevel === 'middle' && score > 15) {
    startLevelHard();
  }
}

function toggleMiddleLevel() {
  if (gameLevel.classList[1] === 'easy' && score > 7) {
    gameLevel.classList.remove('easy');
    gameLevel.classList.add('middle');
  }
}

function toggleHardLevel() {
  if (gameLevel.classList[1] === 'middle' && score > 15) {
    gameLevel.classList.remove('middle');
    gameLevel.classList.add('hard');
  }
}

function startLevelEasy() {
  minTime = minTime + 200;
  maxTime = maxTime - 200;
  gameLevel.classList.remove('hard');
  gameLevel.classList.remove('middle');
  gameLevel.classList.add('easy');
  scoreBoard.textContent = 0;
  timeUp = false;
  score = 0;
  appearHidMole(minTime, maxTime);
  setTimeout(() => {
    timeUp = true;
    setInfoLevelScore();
    showResult();
    toggleMiddleLevel();
  }, 12000);
}

function startLevelMiddle() {
  maxTime = maxTime - 400;
  gameLevel.classList.add('middle');
  scoreBoard.textContent = currentScore;
  timeUp = false;
  score = currentScore;
  appearHidMole(minTime, maxTime);
  setTimeout(() => {
    timeUp = true;
    setInfoLevelScore();
    showResult();
    toggleHardLevel();
  }, 15000);
}

function startLevelHard() {
  maxTime = maxTime - 1000;
  gameLevel.classList.add('hard');
  scoreBoard.textContent = currentScore;
  timeUp = false;
  score = currentScore;
  appearHidMole(minTime, maxTime);
  setTimeout(() => {
    timeUp = true;
    setInfoLevelScore();
    showResult();
  }, 20000);
}

function hit(e) {
  if (!e.isTrusted) return;
  score++;
  this.parentNode.classList.remove('up');
  scoreBoard.textContent = score;
}

function setInfoLevelScore() {
  localStorage.setItem('level', `${gameLevel.classList[1]}`);
  localStorage.setItem('score', `${score}`);
}

function getInfoLevelScore() {
  currentLevel = localStorage.getItem('level');
  currentScore = localStorage.getItem('score');
  if (currentLevel === 'easy' && currentScore <= 7) {
    score = 0;
    setInfoLevelScore();
  }
  if (currentLevel === 'middle' && currentScore <= 15) {
    localStorage.clear();
    score = 0;
    setInfoLevelScore();
  }
  if (currentLevel === 'hard') {
    localStorage.clear();
    score = 0;
    gameLevel.classList.add('easy');
    setInfoLevelScore();
  }
}

function showResult() {
  alert(`Level: ${gameLevel.classList[1]}\n Score: ${score}`);

  if (score <= 7) {
    alert('You lose! Try again!');
  }
  if (score > 7 && score <= 15 && `${gameLevel.classList[1]}` === 'middle') {
    alert('You lose! Try again!');
  }
  if (`${gameLevel.classList[1]}` === 'hard') {
    alert(`Great! You win! Your score: ${score}`);
  }
}

moles.forEach((mole) => mole.addEventListener('click', hit));
window.addEventListener('load', setInfoLevelScore);
buttonStartGame.addEventListener('click', startGame);
