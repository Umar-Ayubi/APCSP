const PLAYER_NAMES = {
    x: 'Umar Ayubi',
    o: 'Elan Lavie'
};

let currentPlayer = 'x';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scores = { x: 0, o: 0 };

const boardElement = document.getElementById('game-board');
const turnDisplay = document.getElementById('turn-display');
const resetButton = document.getElementById('reset-button');
const xScoreElement = document.getElementById('x-score');
const oScoreElement = document.getElementById('o-score');

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];

function initializeBoard() {
    boardElement.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);

        const img = document.createElement('img');
        img.classList.add('cell-image');
        img.style.display = 'none';
        img.style.maxWidth = '90%';
        img.style.maxHeight = '90%';

        // Add error handling for images
        img.onerror = function() {
            console.error('Image failed to load:', this.src);
            cell.textContent = currentPlayer.toUpperCase();
        };

        cell.appendChild(img);
        cell.addEventListener('click', handleCellClick);
        boardElement.appendChild(cell);
    }

    updateTurnDisplay();
}

function handleCellClick(event) {
    if (!gameActive) return;

    const cell = event.target.closest('.cell');
    const index = cell.getAttribute('data-index');

    if (gameBoard[index] !== '' || !gameActive) return;

    gameBoard[index] = currentPlayer;

    const img = cell.querySelector('img');
    img.src = `images/${currentPlayer}-image.png?${Date.now()}`; 
    img.alt = currentPlayer.toUpperCase();
    img.style.display = 'block';

    if (checkWin()) {
        endGame(false);
        return;
    }

    if (checkDraw()) {
        endGame(true);
        return;
    }

    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    updateTurnDisplay();
}

function checkWin() {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return gameBoard[index] === currentPlayer;
        });
    });
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function endGame(isDraw) {
    gameActive = false;

    if (isDraw) {
        turnDisplay.textContent = "draw!";
    } else {
        turnDisplay.textContent = `${PLAYER_NAMES[currentPlayer]} wins!`;
        scores[currentPlayer]++;
        updateScores();
    }
}

function updateTurnDisplay() {
    turnDisplay.textContent = `${PLAYER_NAMES[currentPlayer]}'s Turn`;
}

function updateScores() {
    xScoreElement.textContent = scores.x;
    oScoreElement.textContent = scores.o;
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'x';
    initializeBoard();
}

resetButton.addEventListener('click', resetGame);

document.addEventListener('DOMContentLoaded', initializeBoard);
