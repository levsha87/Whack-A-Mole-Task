const MIN_MOLE_JUMP_IN_DELAY = 400;
const MAX_MOLE_JUMP_IN_DELAY = 1600;

const GAME_DURATION = 20000;

const LEVELS = {
  easy: {
    name: 'easy',
    lowThreshold: 0,
  },
  middle: {
    name: 'middle',
    lowThreshold: 12,
  },
  hard: {
    name: 'hard',
    lowThreshold: 30,
  },
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
    minTime: MIN_MOLE_JUMP_IN_DELAY,
    maxTime: MAX_MOLE_JUMP_IN_DELAY,
  };

  window.addEventListener('load', () => {
    setInfoLevelScore(state);
    gameLevel.classList.add(LEVELS.easy.name);
  });

  buttonStartGame.addEventListener('click', () => {
    startGame(state, scoreBoard, holes, gameLevel);
  });

  game.addEventListener('click', (e) => {
    if (e.target !== e.target.closest('.mole')) return;
    hit(e, scoreBoard, state);
  });
}

initWhackMoleGame();

function setInfoLevelScore(state) {
  localStorage.setItem('level', `${state.currentLevel}`);
  localStorage.setItem('score', `${state.score}`);
}

function getInfoLevelScore() {
  state.currentLevel = localStorage.getItem('level');
  state.currentScore = localStorage.getItem('score');
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
  const time = getRandomTime(state.minTime, state.maxTime);
  const hole = getRandomHole(holes, state.lasthole);

  hole.classList.add('up');

  setTimeout(() => {
    hole.classList.remove('up');
    if (!state.timeUp) appearHiddenMole(state, holes);
  }, time);
}

function hit(e, scoreBoard, state) {
  if (!e.isTrusted) return;
  state.score++;
  e.target.parentNode.classList.remove('up');
  scoreBoard.textContent = state.score;
}

function startGame(state, scoreBoard, holes, gameLevel) {
  toggleLevel(gameLevel, state);
  setInfoLevelScore(state);
  scoreBoard.textContent = state.currentScore;
  state.timeUp = false;
  state.score = state.currentScore;

  appearHiddenMole(state, holes);

  setTimeout(() => {
    state.timeUp = true;
    setInfoLevelScore(state);
    showResult(state);
  }, GAME_DURATION);
}

function toggleLevel(gameLevel, state) {
  getInfoLevelScore(state.currentLevel, state.currentScore);

  if (
    state.currentLevel === 'easy' &&
    state.currentScore > LEVELS.middle.lowThreshold
  ) {
    gameLevel.classList.remove(LEVELS.easy.name);
    gameLevel.classList.add(LEVELS.middle.name);
    state.currentLevel = LEVELS.middle.name;
    state.minTime = MIN_MOLE_JUMP_IN_DELAY - 100;
    state.maxTime = MAX_MOLE_JUMP_IN_DELAY - 400;
  } else if (
    state.currentLevel === 'middle' &&
    state.currentScore > LEVELS.hard.lowThreshold
  ) {
    gameLevel.classList.remove(LEVELS.middle.name);
    gameLevel.classList.add(LEVELS.hard.name);
    state.currentLevel = LEVELS.hard.name;
    state.maxTime = MAX_MOLE_JUMP_IN_DELAY - 800;
  } else {
    gameLevel.classList.remove(LEVELS.middle.name);
    gameLevel.classList.remove(LEVELS.hard.name);
    gameLevel.classList.add(LEVELS.easy.name);
    state.currentLevel = LEVELS.easy.name;
    state.score = 0;
    state.currentScore = 0;
    state.minTime = MIN_MOLE_JUMP_IN_DELAY;
    state.maxTime = MAX_MOLE_JUMP_IN_DELAY;
  }
}

function showResult(state) {
  getInfoLevelScore();
  if (
    (state.currentLevel === 'easy' &&
      state.currentScore > LEVELS.middle.lowThreshold) ||
    (state.currentLevel === 'middle' &&
      state.currentScore > LEVELS.hard.lowThreshold)
  ) {
    showPositiveResult(state);
  } else if (state.currentLevel === 'hard') {
    showFinallyResult(state);
  } else {
    showNegativeResult(state);
  }
}

function showPositiveResult(state) {
  alert(`Level: ${state.currentLevel}\n Score: ${state.score}`);
  alert('Good job! Go on!');
}

function showNegativeResult(state) {
  alert(`Level: ${state.currentLevel}\n Score: ${state.score}`);
  alert('You lose! Try again!');
}

function showFinallyResult(state) {
  alert(`Level: ${state.currentLevel}\n Score: ${state.score}`);
  alert(`Great! You win! Your score: ${state.score}`);
}
