/*
 * Create a list that holds all of your cards
 */
let imageList = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
                 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond',
                 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube',
                 'fa-leaf', 'fa-bicycle', 'fa-bomb'];

let cardPicked = false; // determines whether a first card for a pair has
                        // been selected
let lookCards = true; // determines whether new cards may be flipped
let firstElem, secondElem, timer;
let moveCount = 0;
let timeCount = 0;
let unmatchedCards = 16;
let stillPlaying = false; // determines whether the time counter should be
                          // incrementing
let stars = 3;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


// make the string representing the time from the integral time counter
function timeString(timeVal) {
  let hour = Math.floor(timeVal / 3600);
  let minute = Math.floor((timeVal % 3600) / 60);
  let second = timeVal % 60;
  let hourString = String(hour);
  let minuteString = String(minute);
  let secondString = String(second);
  let ans;
  if (hour < 10) {
    hourString = '0' + hourString;
  }
  if (minuteString < 10) {
    minuteString = '0' + minuteString;
  }
  if (secondString < 10) {
    secondString = '0' + secondString;
  }
  ans = hourString + ':' + minuteString + ':' + secondString;
  return ans;
}


// shuffles and organizes cards in HTML
function implementShuffle(array) {
    let shuffledArray = shuffle(array);
    let currentCard = $( '.card' ).first();
    for (let i = 0; i < shuffledArray.length; i++) {
      currentCard.children( 'i' ).addClass(shuffledArray[i]);
      currentCard = currentCard.next();
    }
}


// having shown a non-matching pair, re-flip the cards over and allow
// more selections
function showPair(elemA, elemB) {
  elemA.parent().removeClass( 'open show' );
  elemB.parent().removeClass( 'open show' );
  lookCards = true;
}


// reset the board and all statistics (including a new shuffling of the cards)
function restart() {
  cardPicked = false;
  stillPlaying = false;
  unmatchedCards = 16;
  moveCount = 0;
  timeCount = 0;
  stars = 3;
  $( '.deck' ).children().attr( 'class' , 'card flip' );
  $( '.card' ).children().attr( 'class' , 'fa' );
  implementShuffle(imageList);
  $( '.moves' ).text( String(moveCount) + ' Moves');
  $( '.timer' ).text( '00:00:00' );
  $( '.fa-star-o' ).removeClass( 'fa-star-o' ).addClass( 'fa-star' );
}


// assume star is either 2 or 3
function demerit(star) {
  let elem = $( '.stars' ).children().first();
  for (let i = 0; i < star - 1; i++) {
    elem = elem.next();
  }
  elem.children().removeClass( 'fa-star' ).addClass( 'fa-star-o' );
  stars--;
}


function endPage() {
  stillPlaying = false;
  let elem = $( '.modal-content' ).children( 'h2' ).first();
  let hours, minutes, seconds;
  $( '.modal' ).toggle();
  $( '.container' ).toggle();
  $( 'body' ).css( 'background' , '#ffffff' );
  elem.text('Moves: ' + String(moveCount));
  elem = elem.next();
  elem.text('Stars: ' + String(stars));
  elem = elem.next();
  elem.text('Time: ' + timeString(timeCount));
}


function startPage() {
  $( '.modal' ).toggle();
  $( '.container' ).toggle();
  $( 'body' ).css( 'background' , '#ffffff url("img/geometry2.png")' );
  restart();
}


function updateMoves() {
  moveCount++;
  if (moveCount === 1) {
    $( '.moves' ).text( String(moveCount) + ' Move');
  }
  else {
    $( '.moves' ).text( String(moveCount) + ' Moves');
  }
}


function checkForFinish() {
  if (unmatchedCards === 0) {
    setTimeout(function(){
      endPage();
    }, 500);
  }
}


function updateStars() {
  if ((moveCount > 16) && (stars === 3)) {
    demerit(3);
  }
  if ((moveCount > 25) && (stars === 2)) {
    demerit(2);
  }
}


implementShuffle(imageList);


timer = setInterval(function() {
  if (stillPlaying) {
    timeCount++;
    $( '.timer' ).text( timeString(timeCount) );
  }
}, 1000);


$( '.card' ).on( 'click' , function() {
  if (lookCards) {
    stillPlaying = true; // initially to set timer after first card click
    let elem = $( this );
    let cardClass = elem.attr( 'class' );
    if ((!cardPicked) && (cardClass !== 'card open show' ) &&
        (cardClass !== 'card match' )) {
          cardPicked = true;
          firstElem = elem.children( 'i' );
          elem.toggleClass( 'flip' );
          elem.addClass( 'open show' );
        }
    else if ((cardClass !== 'card open show' ) &&
             (cardClass !== 'card match' )) {
      elem.toggleClass( 'flip' );
      cardPicked = false;
      lookCards = false;
      elem.addClass( 'open show' );
      secondElem = elem.children( 'i' );

      if (firstElem.attr( 'class' ) === secondElem.attr( 'class' )) {
        showPair(firstElem, secondElem);
        firstElem.parent().addClass( 'match' );
        secondElem.parent().addClass( 'match' );
        unmatchedCards -= 2;
      }

      else {
        setTimeout(function(){
          showPair(firstElem, secondElem);
        }, 1000);
        firstElem.parent().toggleClass( 'flip' );
        secondElem.parent().toggleClass( 'flip' );
      }

      updateMoves();
      updateStars();
      checkForFinish();
    }
  }
});


$( '.restart' ).click(function() {
  restart();
});


$( '.play-again' ).click(function() {
  startPage();
});

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
