initWhackMoleGame();

const MIN_MOLE_JUMP_IN_DELAY = 200;
const MAX_MOLE_JUMP_IN_DELAY = 2000;

const GAME_DURATION = 15000;

const LEVELS = {
  easy: {
    name: 'easy', 
    lowThreshold: 0,
  },
  middle: {
    name: 'middle',
    lowThreshold: 10,
  },
  hard: {
    name: 'hard',
    lowThreshold: 20,
  }
};



function initWhackMoleGame() {
  const holes = document.querySelectorAll('.hole');
  const game = document.querySelector('.game');
  const gameLevel = document.querySelector('.levelValue');
  const scoreBoard = document.querySelector('.score');
  const buttonStartGame = document.querySelector('#startGame');

  state = {
    currentLevel: LEVELS.easy.name,
    currentScore: 0,
    lasthole: '',
    timeUp: false,
    score: 0,
  };

  window.addEventListener('load', () => {
    setInfoLevelScore(state);
    gameLevel.classList.add(LEVELS.easy.name);
  });

  buttonStartGame.addEventListener('click', () => {
    changeGameLevel(state, holes, scoreBoard, gameLevel);
    console.log(state, holes, scoreBoard);
  });

  game.addEventListener('click', (e) => {
    if (e.target !== e.target.closest('.mole')) return;
    hit(e, scoreBoard, state);
  });
}

initWhackMoleGame();

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
  const time = getRandomTime(MIN_MOLE_JUMP_IN_DELAY, MAX_MOLE_JUMP_IN_DELAY);
  const hole = getRandomHole(holes, state.lasthole);

  hole.classList.add('up');

  setTimeout(() => {
    hole.classList.remove('up');
    if (!state.timeUp) appearHiddenMole(state, holes);
  }, time);
}

function changeGameLevel(state, holes, scoreBoard, gameLevel) {
  getInfoLevelScore(state.currentLevel, state.currentScore);

  if (state.score <= LEVELS.middle.lowThreshold) {
    startGame(state, scoreBoard, holes, gameLevel);
  } 

  if (state.currentLevel === 'easy' && state.score > LEVELS.middle.lowThreshold) {
    state.currentLevel = LEVELS.middle.name; 
    startGame(state, scoreBoard, holes, gameLevel);
    
  } 

  if (state.currentLevel === 'middle' && state.score > LEVELS.hard.lowThreshold) {
    state.currentLevel = LEVELS.hard.name;
    startGame(state, scoreBoard, holes, gameLevel);
  } 
}

function toggleLevel(gameLevel, state) {
  getInfoLevelScore(state.currentLevel, state.currentScore);

  if (state.currentLevel === 'easy' && state.currentScore > LEVELS.middle.lowThreshold) {
    gameLevel.classList.remove(LEVELS.easy.name);
    gameLevel.classList.add(LEVELS.middle.name);
    
  } else if (state.currentLevel === 'middle' && state.score > LEVELS.hard.lowThreshold) {
    gameLevel.classList.remove(LEVELS.middle.name);
    gameLevel.classList.add(LEVELS.hard.name);
    
    
  } else if(state.currentLevel === 'hard'){
    state.score = 0;
    gameLevel.classList.remove(LEVELS.hard.name);
    gameLevel.classList.add(LEVELS.easy.name);
    
  } else {
    state.score = 0; 
    
  } 
} 

function startGame(state, scoreBoard, holes, gameLevel) {
  scoreBoard.textContent = state.currentScore;
  state.timeUp = false;
  state.score = state.currentScore;

  appearHiddenMole(state, holes);

  setTimeout(() => {
    state.timeUp = true;
    setInfoLevelScore(state);
    showResult(state);
    toggleLevel(gameLevel, state);
  }, GAME_DURATION);
}

function hit(e, scoreBoard, state) {
  if (!e.isTrusted) return;
  state.score++;
  e.target.parentNode.classList.remove('up');
  scoreBoard.textContent = state.score;
}

function setInfoLevelScore(state) {
  localStorage.setItem('level', `${state.currentLevel}`);
  localStorage.setItem('score', `${state.score}`);
}

function getInfoLevelScore() {
  state.currentLevel = localStorage.getItem('level');
  state.currentScore = localStorage.getItem('score');
}

function showResult(state) {
  alert(`Level: ${state.currentLevel}\n Score: ${state.score}`);

  if (state.score <= state.levelUpMiddle) {
    alert('You lose! Try again!');
  }

  if (
    state.score > state.levelUpMiddle &&
    state.score <= state.LevelUpHard &&
    `${state.currentLevel}` === 'middle'
  ) {
    alert('You lose! Try again!');
  }

  if (`${state.currentLevel}` === 'hard') {
    alert(`Great! You win! Your score: ${state.score}`);
  }
}
