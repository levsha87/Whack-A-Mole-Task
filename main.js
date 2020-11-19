const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const buttonStartGame = document.querySelector('#startGame');
const gameLevel = document.querySelector('.levelValue');
console.log(buttonStartGame);
let lasthole;
let timeUp = false;
let score = 0;

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes){
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    if (hole === lasthole){
        return randomHole(holes);
    }
    lasthole = hole;
    return hole;
}

function appearHidMole () {
    const time = randomTime(200, 2000);
    const hole = randomHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        if(!timeUp) appearHidMole();
    }, time);
}

function startGame(){
    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;
    appearHidMole();
    setTimeout(() => {
        timeUp = true;
        finishGame();
    }, 10000);
}

function startLevelMiddle(){
    let currentLevel = localStorage.getItem('level');
    let currentScore = localStorage.getItem('score');
}


function finishGame(){
    localStorage.setItem('level', `${gameLevel.classList[1]}`);
    localStorage.setItem('score', `${score}`);
}

function bonk (e){
if(!e.isTrusted) return;
score++;
this.parentNode.classList.remove('up');
scoreBoard.textContent = score;
}

moles.forEach(mole => mole.addEventListener('click', bonk));
buttonStartGame.addEventListener('click', startGame);
