

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



window.addEventListener('load', setInfoLevelScore(gameLevel, state.score));
buttonStartGame.addEventListener('click', () => startGame(gameLevel, state, holes));
game.addEventListener('click', (e) => {
  if (e.target !== e.target.closest('.mole')) return;
  hit(e, scoreBoard, mole, state.score);
});


/* showResult(gameLevel, state.score);
toggleMiddleLevel(gameLevel, state.score);
toggleHardLevel(gameLevel, state.score);
getInfoLevelScore(gameLevel, state.score); */


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
  const time = randomTime(minTime, maxTime);
  const hole = randomHole(holes, state.lasthole);

  hole.classList.add('up');

  setTimeout(() => {
    hole.classList.remove('up');
    if (!timeUp) appearHidMole(state, holes);
  }, time);
}

function startGame(gameLevel, state, holes) {
  randomHole(holes);
  getInfoLevelScore(gameLevel, state.score);
  appearHidMole(state, holes);

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

function startLevelEasy(state, gameLevel, scoreBoard) {
  state.minTime += 200;
  state.maxTime -= 200;

  gameLevel.classList.remove('hard');
  gameLevel.classList.remove('middle');
  gameLevel.classList.add('easy');

  scoreBoard.textContent = 0;
  state.timeUp = false;
  state.score = 0;

  appearHidMole(state);

  setTimeout(() => {
    timeUp = true;
    setInfoLevelScore(gameLevel, state.score);
    showResult();
    toggleMiddleLevel();
  }, 12000);
}

function startLevelMiddle(state, gameLevel, scoreBoard) {
  state.maxTime -= 400;
  gameLevel.classList.add('middle');
  scoreBoard.textContent = currentScore;
  state.timeUp = false;
  state.score = state.currentScore;

  appearHidMole(minTime, maxTime);

  setTimeout(() => {
    timeUp = true;
    setInfoLevelScore(gameLevel, state.score);
    showResult();
    toggleHardLevel();
  }, 15000);
}

function startLevelHard(state, gameLevel, scoreBoard) {
  state.maxTime -= 1000;
  gameLevel.classList.add('hard');
  scoreBoard.textContent = state.currentScore;
  timeUp = false;
  state.score = state.currentScore;

  appearHidMole(state);

  setTimeout(() => {
    timeUp = true;
    setInfoLevelScore(gameLevel, state.score);
    showResult();
  }, 20000);
}

function hit(e, scoreBoard, mole, state) {
  console.log(mole, e.target.parentNode.classList);
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
  } else {
    alert('You lose! Try again!');
  }

  /* if (score > 7 && score <= 15 && `${gameLevel.classList[1]}` === 'middle') {
    alert('You lose! Try again!');
  } */

  if (`${gameLevel.classList[1]}` === 'hard') {
    alert(`Great! You win! Your score: ${state.score}`);
  }
}

initWhackMoleGame();