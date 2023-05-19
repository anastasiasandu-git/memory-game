const card = document.querySelectorAll(".main__container__cards__card");
const startGame = document.getElementById("start-game");
const resetGame = document.getElementById("reset-game");
const timeCounter = document.getElementById("timeNode");
const gamerName = document.getElementById("gamerName");
const movesCounter = document.getElementById("movesCalc");

let hasFlippedCard = false;
let firstCard, secondCard;
let minutes = 0;
let seconds = false;
let moves = 0;
let checkFinalStep = 0;

movesCounter.innerHTML = 0;

startGame.addEventListener("click", () => {
  const name = prompt("ENTER YOUR NAME:", "Gamer");
  document.getElementById("gamerName").innerText = name;

  if (name.length > 0) {
    card.forEach((card) => card.addEventListener("click", flipCard));
    closeAllCards(card);
    startTimer();
    flipCard();
  } else {
    alert("Game can be started, enter name!!!");
  }
});

function flipCard(el) {
  this.classList.add("flip");

  const _this = this;

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = _this;
    movesCounterFa();
    return;
  }

  secondCard = _this;
  hasFlippedCard = false;

  if (firstCard.dataset.framework === secondCard.dataset.framework) {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    checkFinalStep++;
    if (checkFinalStep === 8) {
      console.log("Yes");
      checkCompletedGame();
    }
    return;
  }

  unflipCards();
}

card.forEach((card) => {
  card.classList.add("flip");
});

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
  }, 500);
}

function shuffle() {
  card.forEach((card) => {
    let ramdomPos = Math.floor(Math.random() * 16);
    card.style.order = ramdomPos;
  });
}

function closeAllCards(card) {
  [...card].forEach((item) => {
    if (item.classList.contains("flip")) {
      item.classList.remove("flip");
    }
  });
  return card;
}

function startTimer() {
  time = setInterval(function () {
    seconds++;

    if (seconds === 60) {
      minutes++;

      seconds = 0;
    }

    timeCounter.innerHTML = minutes + " min " + seconds + " sec ";
  }, 1000);
}

function resetTime() {
  clearInterval(time);
}

function saveTime() {
  if (checkFinalStep === 8) {
    clearInterval(time);
  }
}

function movesCounterFa() {
  movesCounter.innerHTML++;
  moves++;
}

function stopMoves() {
  movesCounter.innerHTML = 0;
}

resetGame.addEventListener("click", () => {
  card.forEach((card) => {
    card.classList.add("flip");
  });
  shuffle();
  resetTime();
  resetGamerFn();
  stopMoves();

  timeStart = false;
  seconds = 0;
  minutes = 0;
  timeCounter.innerHTML = "00:00";
  return false;
});

function resetGamerFn() {
  const name = (document.getElementById("gamerName").innerText = " ");
}

function checkCompletedGame() {
  const gameOver = alert(
    "GAME OVER" +
      " " +
      "Player:" +
      gamerName.textContent +
      " " +
      "Moves:" +
      movesCounter.textContent +
      " " +
      "Time:" +
      timeCounter.textContent
  );

  movesCounterFa();
  saveTime();

  console.log(moves);
  if (moves.length > 0) {
    document.getElementById("player").innerHTML = `
        ${document.getElementById("player").innerHTML}
        <p class="finalPlayer">
            Gamer
            ${gamerName.textContent} 
            Moves
            ${movesCounter.textContent}
            Time
            ${timeCounter.textContent}
        </p>
    `;
  }
}
