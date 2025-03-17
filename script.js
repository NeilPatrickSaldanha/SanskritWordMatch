let currentLevel = 1;
let timeLeft;
let selectedWord = null;
let selectedChoice = null;
let correctMatches = 0;
let timerInterval;
let categories = [];
let levelData = {};
let currentCategoryData = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      levelData = data;
      categories = Object.keys(data);
      document.getElementById('start-game').addEventListener('click', startGame);
      document.getElementById('skip-button').addEventListener('click', skipLevel);
      document.getElementById('end-game-button').addEventListener('click', endGameNow);
    });
});

function startGame() {
  currentLevel = 1;
  document.getElementById('welcome-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';
  loadLevel(currentLevel);

  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

function loadLevel(level) {
  if (level > categories.length) {
    window.location.href = './thankyou.html';
    return;
  }

  const categoryName = categories[level - 1];
  currentCategoryData = levelData[categoryName];

  document.getElementById('level-indicator').textContent = `Level ${level}: ${categoryName}`;
  document.getElementById('word-list').innerHTML = '';
  document.getElementById('choice-list').innerHTML = '';

  const wordElements = currentCategoryData.map(item => createWordElement(item));
  const choiceElements = currentCategoryData.map(item => createChoiceElement(item));

  shuffleArray(wordElements);
  shuffleArray(choiceElements);

  wordElements.forEach(element => document.getElementById('word-list').appendChild(element));
  choiceElements.forEach(element => document.getElementById('choice-list').appendChild(element));

  selectedWord = null;
  selectedChoice = null;
  correctMatches = 0;
  timeLeft = 120;
  document.getElementById('timer').textContent = timeLeft;
}

function createWordElement(wordData) {
  let wordItem = document.createElement('div');
  wordItem.className = 'word-item';
  wordItem.textContent = wordData.name;
  wordItem.dataset.word = wordData.name;
  
  wordItem.addEventListener('click', () => {
    // Remove previous word selection
    document.querySelectorAll('.word-item').forEach(item => {
      item.classList.remove('selected');
    });
    
    // Select this word
    wordItem.classList.add('selected');
    selectedWord = wordData.name;
    
    // Check if we have both selections
    if (selectedChoice) {
      checkAnswer();
    }
  });

  return wordItem;
}

function createChoiceElement(choiceData) {
  let choiceItem = document.createElement('div');
  choiceItem.className = 'choice-item';
  choiceItem.dataset.word = choiceData.name;

  let img = document.createElement('img');
  img.src = choiceData.image;
  img.alt = choiceData.name;
  img.className = 'choice-image';

  choiceItem.appendChild(img);
  
  choiceItem.addEventListener('click', () => {
    // Remove previous choice selection
    document.querySelectorAll('.choice-item').forEach(item => {
      item.classList.remove('selected');
    });
    
    // Select this choice
    choiceItem.classList.add('selected');
    selectedChoice = choiceData.name;
    
    // Check if we have both selections
    if (selectedWord) {
      checkAnswer();
    }
  });

  return choiceItem;
}

function checkAnswer() {
  const wordElement = document.querySelector(`.word-item[data-word="${selectedWord}"]`);
  const choiceElement = document.querySelector(`.choice-item[data-word="${selectedChoice}"]`);

  if (selectedWord === selectedChoice) {
    wordElement.classList.add('correct');
    choiceElement.classList.add('correct');
    wordElement.classList.remove('selected');
    choiceElement.classList.remove('selected');
    correctMatches++;

    if (correctMatches === currentCategoryData.length) {
      setTimeout(() => nextLevel(), 500);
    }
  } else {
    wordElement.classList.add('incorrect');
    choiceElement.classList.add('incorrect');
    
    setTimeout(() => {
      wordElement.classList.remove('incorrect', 'selected');
      choiceElement.classList.remove('incorrect', 'selected');
    }, 1000);
  }

  // Reset selections
  selectedWord = null;
  selectedChoice = null;
}

function nextLevel() {
  currentLevel++;
  loadLevel(currentLevel);
}

function updateTimer() {
  if (timeLeft > 0) {
    document.getElementById('timer').textContent = timeLeft;
    timeLeft--;
  } else {
    alert('Time is up! Game Over!');
    resetGame();
  }
}

function resetGame() {
  clearInterval(timerInterval);
  currentLevel = 1;
  timeLeft = 120;
  loadLevel(currentLevel);
}

function skipLevel() {
  if (currentLevel === categories.length) {
    window.location.href = './thankyou.html';
  } else {
    alert(`Skipping Level ${currentLevel}`);
    nextLevel();
  }
}

function endGameNow() {
  window.location.href = './thankyou.html';
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}