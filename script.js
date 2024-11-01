let currentLevel = 1; 
let timeLeft;
let words = [];
let selectedWord = null;
let correctMatches = 0;
let timerInterval;

let levelData = {
  1: { items: 'meaning', label: 'Level 1: Match Words with Meanings' },
  2: { items: 'definition', label: 'Level 2: Match Words with Definitions' },
  3: { items: 'sentence', label: 'Level 3: Fill in the blanks!' }
};

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      words = data;
      document.getElementById('start-game').addEventListener('click', startGame);
      document.getElementById('skip-button').addEventListener('click', skipLevel);
    });
});

function startGame() {
  currentLevel = 1;
  timeLeft = 120;
  document.getElementById('welcome-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';
  loadLevel(currentLevel);
  
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

function loadLevel(level) {
  document.getElementById('level-indicator').textContent = levelData[level].label;
  document.getElementById('word-list').innerHTML = '';
  document.getElementById('choice-list').innerHTML = '';

  let levelWords = words.slice(0, level * 4);
  let wordElements = levelWords.map(word => createWordElement(word.word));
  let choiceElements = levelWords.map(word => createChoiceElement(word[levelData[level].items]));

  shuffleArray(wordElements);
  shuffleArray(choiceElements);

  wordElements.forEach(element => document.getElementById('word-list').appendChild(element));
  choiceElements.forEach(element => document.getElementById('choice-list').appendChild(element));
  
  correctMatches = 0;
  
  timeLeft = 120;
  document.getElementById('timer').textContent = timeLeft;
}

function createWordElement(word) {
  let wordItem = document.createElement('div');
  wordItem.className = 'word-item';
  wordItem.textContent = word;
  wordItem.onclick = () => selectWord(wordItem);
  return wordItem;
}

function createChoiceElement(choice) {
  let choiceItem = document.createElement('div');
  choiceItem.className = 'choice-item';
  choiceItem.textContent = choice;
  choiceItem.onclick = () => checkAnswer(choiceItem);
  return choiceItem;
}

function selectWord(wordItem) {
  if (selectedWord) selectedWord.classList.remove('selected');
  selectedWord = wordItem;
  wordItem.classList.add('selected');
}

function checkAnswer(choiceItem) {
  if (!selectedWord) return;

  let selectedWordText = selectedWord.textContent;
  let correctWordData = words.find(word => word.word === selectedWordText);
  let correctAnswer = correctWordData[levelData[currentLevel].items];

  if (choiceItem.textContent === correctAnswer) {
    selectedWord.classList.add('correct');
    choiceItem.classList.add('correct');
    selectedWord.onclick = null;
    choiceItem.onclick = null;
    correctMatches++;
    selectedWord = null;

    if (correctMatches === currentLevel * 4) {
      if (currentLevel === 3) {
        window.location.href = 'thankyou.html';  // Redirect to thank-you page after completing Level 3
      } else {
        setTimeout(() => nextLevel(), 500);
      }
    }
  } else {
    alert("Try again!");
    selectedWord.classList.remove('selected');
    selectedWord = null;
  }
}


function nextLevel() {
  currentLevel++;
  if (currentLevel <= Object.keys(levelData).length) {
    loadLevel(currentLevel);
  }
}

function updateTimer() {
  if (timeLeft > 0) {
    document.getElementById('timer').textContent = timeLeft;
    timeLeft--;
  } else {
    endGame();
  }
}

function endGame() {
  clearInterval(timerInterval);
  alert('Time is up! Game Over!');
  resetGame();
}

function resetGame() {
  clearInterval(timerInterval);
  currentLevel = 1;
  timeLeft = 120;
  loadLevel(currentLevel);
}

function skipLevel() {
  alert(`Skipping Level ${currentLevel}`);
  nextLevel();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
