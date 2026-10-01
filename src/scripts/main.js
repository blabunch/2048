'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.button');
const scoreSpan = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function updateUI() {
  const state = game.getState();
  const flatState = state.flat();

  cells.forEach((cell, index) => {
    const value = flatState[index];

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    } else {
      cell.textContent = '';
    }
  });

  scoreSpan.textContent = game.getScore();

  const gameStatus = game.getStatus();

  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

  if (gameStatus === 'idle') {
    msgStart.classList.remove('hidden');
    startBtn.textContent = 'Start';
    startBtn.className = 'button start';
  } else if (gameStatus === 'playing') {
    startBtn.textContent = 'Restart';
    startBtn.className = 'button restart';
  } else if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
    startBtn.textContent = 'Restart';
    startBtn.className = 'button restart';
  } else if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
    startBtn.textContent = 'Restart';
    startBtn.className = 'button restart';
  }
}

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const validKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (!validKeys.includes(e.key)) {
    return;
  }

  e.preventDefault();

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  updateUI();
});

const SWIPE_THRESHOLD = 30;
const field = document.querySelector('.game-field');
let touchStartX = 0;
let touchStartY = 0;

field.addEventListener(
  'touchstart',
  (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  },
  { passive: true },
);

field.addEventListener('touchend', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) {
    return;
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      game.moveRight();
    } else {
      game.moveLeft();
    }
  } else if (dy > 0) {
    game.moveDown();
  } else {
    game.moveUp();
  }

  updateUI();
});

updateUI();
