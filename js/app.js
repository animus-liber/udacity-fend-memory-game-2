/**** Declare global variables ****/
// Create list with all cards
const cardDeck = [
  "fab fa-android fa-1x", "fab fa-android fa-1x",
  "fab fa-angular fa-1x", "fab fa-angular fa-1x",
  "fab fa-bitcoin fa-1x", "fab fa-bitcoin fa-1x",
  "fab fa-ethereum fa-1x", "fab fa-ethereum fa-1x",
  "fab fa-ember fa-1x", "fab fa-ember fa-1x",
  "fab fa-js-square fa-1x", "fab fa-js-square fa-1x",
  "fab fa-react fa-1x", "fab fa-react fa-1x",
  "fab fa-html5 fa-1x", "fab fa-html5 fa-1x",
  "fab fa-css3 fa-1x", "fab fa-css3 fa-1x"
];

// Initialize empty variables
let matchedCards = [];
let openCards = [];
let movesCounter = 0;
let time = 0;
let timer;
let clickCount = 0;

// Grab all needed html from DOM
const deckHTML = document.querySelectorAll('.deck')[0];
const starsHTML = document.querySelectorAll('.stars');
const resetButtonHTML = document.querySelectorAll('.restart-game');
const movesHTML = document.querySelectorAll('.moves-counter');
const timerHTML = document.querySelectorAll('.timer');
const modalHTML = document.querySelectorAll('.modal')[0];
const modalCloseHTML = document.getElementsByClassName("modal-close")[0];

// All card elements as finished HTML deck
const cardsHTML = cardDeck.map(function(card) {
  const listElement = document.createElement('li');
  listElement.className = "card";
  listElement.innerHTML = `<i class="hide ${card}"></i>`;

  return listElement;
});


/**** Game functions ****/
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Fill Gameboard with cards
function fillGameboard(cardsHTML, deckHTML) {
  const shuffeledCards = shuffle(cardsHTML);
  for (card of shuffeledCards) {
    deckHTML.innerHTML += card.outerHTML;
  }
}


/**** Game stats ****/

/**** Stars ****/
// Remove one star from stars list
function hideStar(starIndex) {
  starsHTML[0].children[starIndex].classList.add('hide');
}

// Show all stars
function showAllStars(stars) {
  for (star of stars) {
    star.classList.remove('hide');
  }
}


/**** Timer ****/
// Stars Timer
function startTimer() {
  timer = setInterval(updateTimer, 100);
}

// Stops Timer
function stopTimer() {
  clearInterval(timer);
}

// Updates Timer
function updateTimer() {
  timerHTML[0].innerHTML = `Time: ${(++time / 10).toFixed(2)} sec.`;
}

// Resets Timer
function resetTimer() {
  stopTimer();
  time = -1;
  updateTimer();
}


/**** Reset Game (rests all game stats and creates newly shuffeled deck) ****/
function resetGame() {
  clickCount = 0;
  openCards = [];
  movesCounter = 0;
  matchedCards = [];
  movesHTML[0].innerHTML = `Moves: ${movesCounter}`;
  deckHTML.innerHTML = '';
  deckHTML.classList.remove('lock-click');
  resetButtonHTML[0].classList.remove('lock-click');

  showAllStars(starsHTML[0].children);

  resetTimer();

  //Fill Gameboard with newly shuffeld cards
  fillGameboard(cardsHTML, deckHTML);
  modalHTML.style.display = "none";
}


/**** Modal ****/
// Update Modal Content with up-to-date data
function updateModalContent() {
  starsHTML[1].innerHTML = `${starsHTML[0].innerHTML}`;
  movesHTML[1].innerHTML = movesHTML[0].innerHTML;
  timerHTML[1].innerHTML = timerHTML[0].innerHTML;
}


/**** Stop Game, get all current game data and show modal ****/
function stopGame() {
  stopTimer();
  updateModalContent();
  modalHTML.style.display = "flex";
}


/**** Handle click events on cards ****/
// All game logic is called in this function (e.g. compare cards, show cards, etc.)
function gameClickHandler(event) {
  ++clickCount;

  // if it's the first card start the timer
  if (clickCount == 1) {
    startTimer();
  }

  // Only show card if not 2 are showing already
  if (openCards.length < 2) {
    event.target.classList.add('open-card');
    event.target.children[0].classList.remove('hide');
    openCards.push(event.target);
  }

  // If 2 cards are showing, compare cards and act recordingly
  if (openCards.length == 2) {
    ++movesCounter;
    movesHTML[0].innerHTML = `Moves: ${movesCounter}`;

    // Hide star depending on moves
    switch (movesCounter) {
      case 18:
      hideStar(0);
      break;

      case 24:
      hideStar(1);
      break;

      case 32:
      hideStar(2);
      break;

      default:
      break;
    }

    // if cards match, change cards and add them to matchedCards array
    if (openCards[0].innerHTML === openCards[1].innerHTML) {
      openCards.forEach(function(card) {
        card.classList.add('match');
        matchedCards.push(card);

        // Stop game if all cards have been matched
        if (matchedCards.length == cardDeck.length) {
          stopGame();
        }
      });

      // Clear opencards array
      openCards = [];

      // If cards don't match, show them for a second, lock user click userinteraction
      // and hide non matching cards afterwards
    } else {
      //lock userinteraction on cards
      resetButtonHTML[0].classList.add('lock-click');
      deckHTML.classList.add('lock-click');

      setTimeout(function() {
        openCards.forEach(function(card) {
          card.classList.remove('open-card');
          card.children[0].classList.add('hide');
        });

        deckHTML.classList.remove('lock-click');
        resetButtonHTML[0].classList.remove('lock-click');
        openCards = [];
      }, 1000);
    }
  }
}


/**** Initialize the Game ****/
function initGame() {

  // Fill Gameboard with shuffeled cards
  fillGameboard(cardsHTML, deckHTML);

  // Add Eventlistener on whole gameboard, call gameClickHandler if non-showing card is clicked
  deckHTML.addEventListener('click', function(event) {
    if (event.target.tagName.toLowerCase() === 'li'
    && !(event.target.classList.contains('open-card'))
    && !(event.target.classList.contains('match'))) {
      gameClickHandler(event);
    }
  });

  // Add Event Listener on all reset buttons and reset game on click
  resetButtonHTML.forEach(function(resetBtn) {
    resetBtn.addEventListener('click', function() {
      resetGame();
    });
  });

  // Add eventlistener to modal close button and close modal on click
  modalCloseHTML.addEventListener('click', function() {
    modalHTML.style.display = "none";
  });
}


/**** Load Game ****/
initGame();
