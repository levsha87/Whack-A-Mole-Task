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
    minTime: 200,
    maxTime: 2000,
    timeUp: false,
    score: 0,
    gameTime: 15000,
    levelUpMiddle: 10,
    LevelUpHard: 20,
  };

  window.addEventListener('load', setInfoLevelScore(gameLevel, state));
  buttonStartGame.addEventListener('click', () =>
    startGame(gameLevel, state, holes, scoreBoard)
  );
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
  resetValueVariableLevels(gameLevel, state);

  if (state.score <= state.levelUpMiddle) {
    startLevel(gameLevel, state, scoreBoard, holes);
  }

  if (state.currentLevel === 'easy' && state.score > state.levelUpMiddle) {
    state.maxTime = state.maxTime - 300;
    state.gameTime = state.gameTime + 3000;
    startLevel(gameLevel, state, scoreBoard, holes);
  }

  if (state.currentLevel === 'middle' && state.score > state.LevelUpHard) {
    state.maxTime = state.maxTime - 500;
    state.gameTime += 3000;
    startLevel(gameLevel, state, scoreBoard, holes);
  }
}

function startLevel(gameLevel, state, scoreBoard, holes) {
  scoreBoard.textContent = state.currentScore;
  state.timeUp = false;
  state.score = state.currentScore;

  appearHiddenMole(state, holes);

  setTimeout(() => {
    state.timeUp = true;
    setInfoLevelScore(gameLevel, state);
    showResult(gameLevel, state);
    toggleLevel(gameLevel, state);
  }, state.gameTime);
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

function toggleLevel(gameLevel, state) {
  let level = gameLevel.classList;

  if (level[1] === 'easy' && state.score > state.levelUpMiddle) {
    level.remove('easy');
    level.add('middle');
  } else if (level[1] === 'middle' && state.score > state.LevelUpHard) {
    level.remove('middle');
    level.add('hard');
  } else {
    level.remove('hard');
    level.remove('middle');
    level.add('easy');
  }
}

function resetValueVariableLevels(gameLevel, state) {
  if (
    state.currentLevel === 'easy' &&
    state.currentScore <= state.levelUpMiddle
  ) {
    assignInitialValues(gameLevel, state);
  }

  if (
    state.currentLevel === 'middle' &&
    state.currentScore <= state.LevelUpHard
  ) {
    assignInitialValues(gameLevel, state);
  }

  if (state.currentLevel === 'hard') {
    assignInitialValues(gameLevel, state);
  }
}

function assignInitialValues(gameLevel, state) {
  state.gameTime = 15000;
  state.score = 0;
  state.currentScore = 0;
  state.minTime = 200;
  state.maxTime = 2000;
  setInfoLevelScore(gameLevel, state);
}

function showResult(gameLevel, state) {
  alert(`Level: ${gameLevel.classList[1]}\n Score: ${state.score}`);

  if (state.score <= state.levelUpMiddle) {
    alert('You lose! Try again!');
  }

  if (
    state.score > state.levelUpMiddle &&
    state.score <= state.LevelUpHard &&
    `${gameLevel.classList[1]}` === 'middle'
  ) {
    alert('You lose! Try again!');
  }

  if (`${gameLevel.classList[1]}` === 'hard') {
    alert(`Great! You win! Your score: ${state.score}`);
  }
}
