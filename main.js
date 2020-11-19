const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const buttonStartGame = document.querySelector('#startGame');
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
    console.log('went');
    const time = randomTime(200, 2000);
    const hole = randomHole(holes);
    hole.classList.add('up');
    console.log(hole.classList);
    setTimeout(() => {
        hole.classList.remove('up');
        if(!timeUp) appearHidMole();
    }, time);
}

function startGame(){
    console.log('пришел');
    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;
    appearHidMole();
    setTimeout(() => timeUp = true, 10000);
}

function bonk (e){
if(!e.isTrusted) return;
score++;
this.parentNode.classList.remove('up');
scoreBoard.textContent = score;
}

moles.forEach(mole => mole.addEventListener('click', bonk));
buttonStartGame.addEventListener('click', startGame);
