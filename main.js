const GAME_DURATION = 20000;

const MOLE_JUMP_IN_DELAY = {
  easy: {
    minTime: 800,
    maxTime: 1600,
  },
  middle: {
    minTime: 600,
    maxTime: 800,
  },
  hard: {
    minTime: 400,
    maxTime: 600,
  },
};

const LEVELS = {
  easy: {
    name: 'easy',
    lowThreshold: 0,
  },
  middle: {
    name: 'middle',
    lowThreshold: 15,
  },
  hard: {
    name: 'hard',
    lowThreshold: 25,
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
  const time = getRandomTime(
    setMOLE_JUMP_IN_DELAY(state).minTime,
    setMOLE_JUMP_IN_DELAY(state).maxTime
  );
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
  getInfoLevelScore();
  setMOLE_JUMP_IN_DELAY(state);
  deleteGameLevelClass(gameLevel);
  addGameLevelClass(gameLevel, state);
}

function checkConditionForLevelGame(state) {
  if (
    state.currentLevel === LEVELS.easy.name &&
    state.currentScore > LEVELS.middle.lowThreshold
  ) {
    return 'next_middle';
  }

  if (
    state.currentLevel === LEVELS.middle.name &&
    state.currentScore > LEVELS.hard.lowThreshold
  ) {
    return 'next_hard';
  }
}

function deleteGameLevelClass(gameLevel) {
  gameLevel.classList.remove(
    LEVELS.easy.name,
    LEVELS.middle.name,
    LEVELS.hard.name
  );
}

function addGameLevelClass(gameLevel, state) {
  if (checkConditionForLevelGame(state) === 'next_middle') {
    gameLevel.classList.add(LEVELS.middle.name);
    state.currentLevel = LEVELS.middle.name;
  } else if (checkConditionForLevelGame(state) === 'next_hard') {
    gameLevel.classList.add(LEVELS.hard.name);
    state.currentLevel = LEVELS.hard.name;
  } else {
    gameLevel.classList.add(LEVELS.easy.name);
    state.currentLevel = LEVELS.easy.name;
    state.score = 0;
    state.currentScore = 0;
    setInfoLevelScore(state);
  }
}

function setMOLE_JUMP_IN_DELAY(state) {
  if (state.currentLevel === 'middle') {
    return MOLE_JUMP_IN_DELAY.middle;
  } else if (state.currentLevel === 'hard') {
    return MOLE_JUMP_IN_DELAY.hard;
  } else {
    return MOLE_JUMP_IN_DELAY.easy;
  }
}

function showResult(state) {
  getInfoLevelScore();
  if (
    checkConditionForLevelGame(state) === 'next_middle' ||
    checkConditionForLevelGame(state) === 'next_hard'
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
