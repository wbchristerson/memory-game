/*
 * Create a list that holds all of your cards
 */
let imageList = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
                 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond',
                 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube',
                 'fa-leaf', 'fa-bicycle', 'fa-bomb'];

let cardPicked = false; // determines whether a first card for a pair has
                        // been selected
let lookCards = true; // determines whether new cards may be flipped, e.g.
                      // during the pause between when two non-matching cards
                      // are face up and when they are again flipped over to be
                      // non-visible, lookCards should be false since no other
                      // cards should be flipped at that time
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


// make the string representing the time using the integral time counter
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
// more selections; having shown a matching pair, remove current class to be
// replaced with the 'match' class
function showPair(elemA, elemB) {
  elemA.parent().removeClass( 'open show' );
  elemB.parent().removeClass( 'open show' );
  lookCards = true;
}


// reset the board and all statistics (including a new shuffling of the cards)
function restart() {
  cardPicked = false; // no first card should be picked at the start
  stillPlaying = false; // the timer should not be running at the start of a
                        // new game
  unmatchedCards = 16; // all cards begin unmatched
  moveCount = 0;
  timeCount = 0;
  stars = 3;
  $( '.deck' ).children().attr( 'class' , 'card flip' );
  $( '.card' ).children().attr( 'class' , 'fa' );
  implementShuffle(imageList); // re-shuffle the cards
  $( '.moves' ).text( String(moveCount) + ' Moves'); // reset to '0 Moves'
  $( '.timer' ).text( '00:00:00' ); // reset timer
  $( '.fa-star-o' ).removeClass( 'fa-star-o' ).addClass( 'fa-star' );
}


// decrement star rating by 1 and make the interior of the rightmost black-
// interior star appear as white
// assume star is either 2 or 3
function demerit(star) {
  let elem = $( '.stars' ).children().first();
  for (let i = 0; i < star - 1; i++) {
    elem = elem.next();
  }
  elem.children().removeClass( 'fa-star' ).addClass( 'fa-star-o' );
  stars--;
}


// proceed to the modal after the game ends; stop the timer, make the display
// no longer visible, show the end screen, and list the data
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


// when the 'play again' button is clicked on the modal page, make the modal
// invisible and make the original tile page visible again; reset the
// background image and reset all other information according to restart()
function startPage() {
  $( '.modal' ).toggle();
  $( '.container' ).toggle();
  $( 'body' ).css( 'background' , '#ffffff url("img/geometry2.png")' );
  restart();
}


// after a pair of cards has been clicked, update the move count and the
// display for the number of moves
function updateMoves() {
  moveCount++;
  if (moveCount === 1) {
    $( '.moves' ).text( String(moveCount) + ' Move');
  }
  else {
    $( '.moves' ).text( String(moveCount) + ' Moves');
  }
}


// if all cards have been matched, wait 500 milliseconds then execute endPage()
function checkForFinish() {
  if (unmatchedCards === 0) {
    setTimeout(function(){
      endPage();
    }, 500);
  }
}


// beyond 16 moves, set the star rating to 2; beyond 25 moves, set the star
// rating to 1
function updateStars() {
  if ((moveCount > 16) && (stars === 3)) {
    demerit(3);
  }
  if ((moveCount > 25) && (stars === 2)) {
    demerit(2);
  }
}


// do an initial shuffle and placement of the cards
implementShuffle(imageList);


// when the game is ongoing, increment the timer and its display each second
timer = setInterval(function() {
  if (stillPlaying) {
    timeCount++;
    $( '.timer' ).text( timeString(timeCount) );
  }
}, 1000);


// the main event when cards are clicked
$( '.card' ).on( 'click' , function() {
  if (lookCards) { // make sure a pair of cards is not already face up
    stillPlaying = true; // initially to set timer after first card click
    let elem = $( this );
    let cardClass = elem.attr( 'class' );
    // below: if no first card has been chosen yet for a pair and the card is
    // neither already open nor already matched, then enter this branch
    if ((!cardPicked) && (cardClass !== 'card open show' ) &&
        (cardClass !== 'card match' )) {
          cardPicked = true;
          firstElem = elem.children( 'i' );
          elem.toggleClass( 'flip' ); // flip card
          elem.addClass( 'open show' ); // expose card image
        }
    // below: same conditions as above branch except with a first card already
    // chosen for the pair
    else if ((cardClass !== 'card open show' ) &&
             (cardClass !== 'card match' )) {
      elem.toggleClass( 'flip' ); // flip card
      cardPicked = false;
      lookCards = false; // prevent more cards from being flipped over
      elem.addClass( 'open show' ); // expose card image
      secondElem = elem.children( 'i' );

      // below: if the two cards match, then enter this branch
      if (firstElem.attr( 'class' ) === secondElem.attr( 'class' )) {
        showPair(firstElem, secondElem); // remove 'open' and 'show' classes
        firstElem.parent().addClass( 'match' ); // set card to match class
        secondElem.parent().addClass( 'match' ); // set card to match class
        unmatchedCards -= 2;
      }

      // below: if the two cards do not match, then enter this branch
      else {
        setTimeout(function(){ // pause 1 second to show the cards' identities
          showPair(firstElem, secondElem);
        }, 1000);
        firstElem.parent().toggleClass( 'flip' ); // flip over card
        secondElem.parent().toggleClass( 'flip' ); // flip over card
      }

      updateMoves();
      updateStars();
      checkForFinish();
    }
  }
});


$( '.restart' ).click(function() { // if the re-start arrow button is clicked
  restart();
});


$( '.play-again' ).click(function() { // if the 'play again' button is clicked
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
