

function initWhackMoleGame() {
const holes = document.querySelectorAll('.hole');
const game = document.querySelector('.game');
const gameLevel = document.querySelector('.levelValue');
const scoreBoard = document.querySelector('.score');
const mole = document.querySelectorAll('.mole');
const buttonStartGame = document.querySelector('#startGame');

state = {
  currentLevel: 'easy', 
  currentScore: 0,
  lasthole: '',
  minTime : 200,
  maxTime : 2000,
  timeUp : false,
  score : 0,
};



window.addEventListener('load', setInfoLevelScore(gameLevel, state));
buttonStartGame.addEventListener('click', () => startGame(gameLevel, state, holes, scoreBoard));
game.addEventListener('click', (e) => {
  if (e.target !== e.target.closest('.mole')) return;
  hit(e, scoreBoard, state);
});

}





function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const index = Math.floor(Math.random() * holes.length);
  const hole = holes[index];

  if (hole === state.lasthole) {
    return randomHole(holes);
  }

  state.lasthole = hole;
  return hole;
}

function appearHidMole(state, holes) {
  console.log(state.minTime, state.maxTime, state.timeUp);
  const time = randomTime(state.minTime, state.maxTime);
  const hole = randomHole(holes, state.lasthole);

  hole.classList.add('up');

  setTimeout(() => {
    hole.classList.remove('up');
    if (!state.timeUp) appearHidMole(state, holes);
  }, time);
}

function startGame(gameLevel, state, holes, scoreBoard) {
  randomHole(holes);
  getInfoLevelScore(state.currentLevel, state.currentScore);

  if (state.currentScore <= 7) {
    startLevelEasy(gameLevel, state, scoreBoard, holes);
  }

  if (state.currentLevel === 'easy' && state.score > 7) {
    startLevelMiddle(gameLevel, state, scoreBoard);
  }

  if (state.currentLevel === 'middle' && state.score > 15) {
    startLevelHard(gameLevel, state, scoreBoard);
  }
}

function toggleMiddleLevel(gameLevel, state) {
  if (gameLevel.classList[1] === 'easy' && state.score > 7) {
    gameLevel.classList.remove('easy');
    gameLevel.classList.add('middle');
  }
}

function toggleHardLevel(gameLevel, state) {
  if (gameLevel.classList[1] === 'middle' && state.score > 15) {
    gameLevel.classList.remove('middle');
    gameLevel.classList.add('hard');
  }
}

function startLevelEasy(gameLevel, state, scoreBoard, holes) {
  
  if (state.currentLevel!==('easy')){
  gameLevel.classList.remove('hard');
  gameLevel.classList.remove('middle');
  gameLevel.classList.add('easy');
  }
  scoreBoard.textContent = 0;
  state.timeUp = false;
  state.score = 0;

  appearHidMole(state, holes);

  setTimeout(() => {
    console.log('через 12 с');
    state.timeUp = true;
    setInfoLevelScore(gameLevel, state);
    showResult(gameLevel, state);
    toggleMiddleLevel(gameLevel, state);
  }, 12000);
}

function startLevelMiddle(state, gameLevel, scoreBoard, holes) {
  state.maxTime -= 400;
  gameLevel.classList.add('middle');
  scoreBoard.textContent = currentScore;
  state.timeUp = false;
  state.score = state.currentScore;

  appearHidMole(state, holes);

  setTimeout(() => {
    state.timeUp = true;
    setInfoLevelScore(gameLevel, state);
    showResult(gameLevel, state);
    toggleMiddleLevel(gameLevel, state);
  }, 15000);
}

function startLevelHard(state, gameLevel, scoreBoard, holes) {
  state.maxTime -= 1000;
  gameLevel.classList.add('hard');
  scoreBoard.textContent = state.currentScore;
  state.timeUp = false;
  state.score = state.currentScore;

  appearHidMole(state, holes);

  setTimeout(() => {
    state.timeUp = true;
    setInfoLevelScore(gameLevel, state);
    showResult(gameLevel, state);
  }, 20000);
}

function hit(e, scoreBoard, state) {
  if (!e.isTrusted) return;
  state.score++;
  e.target.parentNode.classList.remove('up');
  scoreBoard.textContent = state.score;
}

function setInfoLevelScore(gameLevel, state) {
  localStorage.setItem('level', `${gameLevel.classList[1]}`);
  localStorage.setItem('score', `${state.score}`);
}

function getInfoLevelScore() {
  state.currentLevel = localStorage.getItem('level');
  state.currentScore = localStorage.getItem('score');
  console.log(state.currentLevel, state.currentScore);
}

function getInfoLevelScore(gameLevel, state) {
  state.currentLevel = localStorage.getItem('level');
  state.currentScore = localStorage.getItem('score');

  if (state.currentLevel === 'easy' && state.currentScore <= 7) {
    state.score = 0;
    setInfoLevelScore(gameLevel, state.score);
  }

  if (state.currentLevel === 'middle' && state.currentScore <= 15) {
    localStorage.clear();
    state.score = 0;
    setInfoLevelScore(gameLevel, state);
  }

  if (state.currentLevel === 'hard') {
    localStorage.clear();
    state.score = 0;
    gameLevel.classList.add('easy');
    setInfoLevelScore(gameLevel, state);
  }
}

function showResult(gameLevel, state) {
  alert(`Level: ${gameLevel.classList[1]}\n Score: ${state.score}`);

  if (state.score <= 7) {
    alert('You lose! Try again!');
  } /* else {
    alert('You lose! Try again!');
  } */

  if (score > 7 && score <= 15 && `${gameLevel.classList[1]}` === 'middle') {
    alert('You lose! Try again!');
  }

  if (`${gameLevel.classList[1]}` === 'hard') {
    alert(`Great! You win! Your score: ${state.score}`);
  }
}

initWhackMoleGame();