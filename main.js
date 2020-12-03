initWhackMoleGame();

function initWhackMoleGame() {
const holes = document.querySelectorAll('.hole');
const game = document.querySelector('.game');
const gameLevel = document.querySelector('.levelValue');
const scoreBoard = document.querySelector('.score');
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

function getRandomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getRandomHole(holes) {
  const index = Math.floor(Math.random() * holes.length);
  const hole = holes[index];

  if (hole === state.lasthole) {
    return getRandomHole(holes);
  }

  state.lasthole = hole;
  return hole;
}

function appearHiddenMole(state, holes) {
  console.log(state.minTime, state.maxTime, state.timeUp);
  const time = getRandomTime(state.minTime, state.maxTime);
  const hole = getRandomHole(holes, state.lasthole);

  hole.classList.add('up');

  setTimeout(() => {
    hole.classList.remove('up');
    if (!state.timeUp) appearHiddenMole(state, holes);
  }, time);
}

function startGame(gameLevel, state, holes, scoreBoard) {
  getInfoLevelScore(state.currentLevel, state.currentScore);
  resetSettingsLevelEasy(gameLevel, state);
  if (state.score <= 7) {
    startLevelEasy(gameLevel, state, scoreBoard, holes);
  }

  if (state.currentLevel === 'easy' && state.score > 7) {
    startLevelMiddle(state, gameLevel, scoreBoard, holes);
  }

  if (state.currentLevel === 'middle' && state.score > 15) {
    startLevelHard(state, gameLevel, scoreBoard, holes);
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

  appearHiddenMole(state, holes);

  setTimeout(() => {
    console.log('через 12 с');
    state.timeUp = true;
    setInfoLevelScore(gameLevel, state);
    showResult(gameLevel, state);
    toggleMiddleLevel(gameLevel, state);
  }, 12000);
}

function startLevelMiddle(state, gameLevel, scoreBoard, holes) {
  state.maxTime = state.maxTime - 300;
  scoreBoard.textContent = state.currentScore;
  state.timeUp = false;
  state.score = state.currentScore;

  appearHiddenMole(state, holes);

  setTimeout(() => {
    state.timeUp = true;
    setInfoLevelScore(gameLevel, state);
    showResult(gameLevel, state);
    toggleHardLevel(gameLevel, state);
  }, 15000);
}

function startLevelHard(state, gameLevel, scoreBoard, holes) {
  state.maxTime = state.maxTime - 500;
  scoreBoard.textContent = state.currentScore;
  state.timeUp = false;
  state.score = state.currentScore;

  appearHiddenMole(state, holes);

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

function resetSettingsLevelEasy(gameLevel, state) {
 
  if (state.currentLevel === 'easy' && state.currentScore <= 7) {
    state.score = 0;
    setInfoLevelScore(gameLevel, state);
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

  if (state.score > 7 && state.score <= 15 && `${gameLevel.classList[1]}` === 'middle') {
    alert('You lose! Try again!');
  }

  if (`${gameLevel.classList[1]}` === 'hard') {
    alert(`Great! You win! Your score: ${state.score}`);
  }
}