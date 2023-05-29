const startGameButton = document.getElementById("start-game");
const cards = document.querySelectorAll(".main__container__cards__card");
const resetGame = document.getElementById("reset-game");
const movesCounter = document.getElementById("movesCalc");
const timeCounter = document.getElementById("timeNode");
const gamerName = document.getElementById("gamerName");

let finalStep = 0;
let minutes = 0;
let seconds = 0;
let time;
let flipped = false;
let firstCard, secondCard;
let gameStarted = false;

//Start game button
startGameButton.addEventListener("click", startGame);

//Start game
function startGame() {
  const name = addName();
  cards.forEach((card) => {
    card.classList.add("flip");
  });

  if (name.length > 0) {
    startTimer(showTimer);
    addMoves();
  }

  showName(name);

  setTimeout(() => {
    cards.forEach((card) => {
      card.classList.remove("flip");
    });
  }, 1500);

  gameStarted = true;
  console.log(gameStarted);
}

//check if the game has started or not
function checkGameStarted() {
  if (!gameStarted) {
    return true;
  }
  return false;
}

function addName() {
  let name = prompt("ENTER YOUR NAME:", "Gamer");

  while (!name || name.trim() === "") {
    alert("Game can be started, enter name!");
    name = prompt("ENTER YOUR NAME:", "Gamer");
  }

  return name;
}

//Display the player's name
function showName(name) {
  document.getElementById("gamerName").innerText = name;
}

function resetName() {
  document.getElementById("gamerName").innerText = "?";
}

//Initializes a time range
function startTimer(back) {
  time = setInterval(function () {
    seconds++;

    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }
    back();
  }, 1000);
}

function stopTimer() {
  clearInterval(time);
}

function showTimer() {
  timeCounter.innerHTML = minutes + " min " + seconds + " sec ";
}

function resetTime() {
  minutes = 0;
  seconds = 0;

  stopTimer();

  timeCounter.innerHTML = "00:00";
}

//Checks if the game has started and adds a move
function addMoves() {
  if (checkGameStarted()) return;

  let moves = 0;
  showMoves();
  moves++;
}

function showMoves() {
  movesCounter.innerHTML++;
}

function resetMoves() {
  movesCounter.innerHTML = "0";
}

//Toggles the 'flip' class
function toggleCards() {
  if (checkGameStarted()) return;

  this.classList.toggle("flip");
}

cards.forEach((card) => {
  card.addEventListener("click", callBackAfterClick);
});

//Callback function called after each click on a book
function callBackAfterClick() {
  const card = this;

  if (!flipped) {
    flipped = true;
    firstCard = card;
    toggleCards.call(card); // trebuie să fie apelat în contextul obiectului card in caz contrat nu roteste cartea
    addMoves();
  } else {
    flipped = false;
    secondCard = card;
    toggleCards.call(card); // la fel
    compareCards();
  }
}

//Compare the books
function compareCards() {
  if (firstCard.dataset.framework === secondCard.dataset.framework) {
    firstCard.removeEventListener("click", callBackAfterClick);
    secondCard.removeEventListener("click", callBackAfterClick);
    finalStep++;
    checkFinalStep();
  } else {
    decisionToggleCards();
  }
}

function decisionToggleCards() {
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
  }, 400);
}

//Checks if the player has completed all the steps of the game
function checkFinalStep() {
  if (finalStep === 8) {
    finishGame(stopTimer);
  }
}

resetGame.addEventListener("click", () => {
  gameStarted = false;
  flipped = false;
  firstCard = null;
  secondCard = null;
  finalStep = 0;
  cards.forEach((card) => {
    card.classList.remove("flip");
    card.addEventListener("click", callBackAfterClick);
  });

  shuffleCards();
  resetName();
  resetTime();
  resetMoves();

  getResults();
});

//Shuffle the cards
function shuffleCards() {
  cards.forEach((card) => {
    let ramdomPos = Math.floor(Math.random() * 16);
    card.style.order = ramdomPos;
  });
}

//Complete the game
function finishGame(stopTimer) {
  const finalData =
    "Your result👉" +
    " " +
    "Player:" +
    gamerName.textContent +
    " " +
    "Moves:" +
    movesCounter.textContent +
    " " +
    "Time:" +
    timeCounter.textContent;

  stopTimer();

  setTimeout(function () {
    alert(finalData);
    setResults();
    getResults();
  }, 400);
}

//Save game results in local memory
function setResults() {
  const playerName = gamerName.textContent;
  const moves = movesCounter.textContent;
  const time = timeCounter.textContent;

  const gameResult = {
    player: playerName,
    moves: moves,
    time: time,
  };

  let savedResults = JSON.parse(localStorage.getItem("gameResults")) || [];

  savedResults.unshift(gameResult);

  if (savedResults.length > 10) {
    savedResults = savedResults.slice(0, 10);
  }

  localStorage.setItem("gameResults", JSON.stringify(savedResults));
}

//Gets previous game results from local memory
function getResults() {
  const savedResults = JSON.parse(localStorage.getItem("gameResults"));
  const resultsContainer = document.getElementById("resultsContainer");

  if (savedResults && savedResults.length > 0) {
    savedResults.sort((a, b) => {
      if (parseInt(a.moves) === parseInt(b.moves)) {
        return parseInt(a.time) === parseInt(b.time);
      } else {
        return parseInt(a.moves) - parseInt(b.moves);
      }
    });

    resultsContainer.innerHTML = "";

    savedResults.forEach((result, index) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("result-item");

      const playerElement = document.createElement("span");
      playerElement.classList.add("player");
      playerElement.textContent = result.player;

      const movesElement = document.createElement("span");
      movesElement.classList.add("moves");
      movesElement.textContent = "Moves: " + result.moves;

      const timeElement = document.createElement("span");
      timeElement.classList.add("time");
      timeElement.textContent = "Time: " + result.time;

      resultItem.appendChild(playerElement);
      resultItem.appendChild(movesElement);
      resultItem.appendChild(timeElement);

      resultsContainer.appendChild(resultItem);
    });
  }
}

window.addEventListener("load", getResults);
