/*
 * Create a list that holds all of your cards
 */
let imageList = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
                 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond',
                 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube',
                 'fa-leaf', 'fa-bicycle', 'fa-bomb'];

let cardPicked = false;
let lookCards = true;
let firstElem, secondElem;

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


function implementShuffle(array) {
    let shuffledArray = shuffle(array);
    let currentCard = $( '.card' ).first();
    // let currentCard = $( '.fa' ).first();
    for (let i = 0; i < shuffledArray.length; i++) {
      currentCard.children('i').addClass(shuffledArray[i]);
      // currentCard.children( '.fa' ).first();
      currentCard = currentCard.next();
      // console.log(shuffledArray[i]);
    }
}


function showPair(elemA, elemB) {
  elemA.parent().removeClass( 'open show' );
  elemB.parent().removeClass( 'open show' );
  lookCards = true;
}


function restart() {
  $( '.deck' ).children().attr( 'class' , 'card' );
  $( '.card' ).children().attr( 'class' , 'fa' );
  implementShuffle(imageList);
}


implementShuffle(imageList);

$( '.card' ).on( 'click' , function() {
  // $( this ).toggle( '.open' );
  if (lookCards) {
    let cardClass = $( this ).attr( 'class' );
    if ((!cardPicked) && (cardClass !== 'card open show' ) &&
        (cardClass !== 'card match' )) {
          cardPicked = true;
          $( this ).addClass( 'open show' );
          // firstElem = $( this ).children('i').attr('class');
          firstElem = $( this ).children( 'i' );
          console.log(firstElem.attr( 'class' ));
        }
    else if ((cardClass !== 'card open show' ) && (cardClass !== 'card match' )) {
      cardPicked = false;
      lookCards = false;
      $( this ).addClass( 'open show' );
      // secondElem = $( this ).children('i').attr('class');
      secondElem = $( this ).children( 'i' );
      // firstElem.parent().removeClass( 'open show' );
      // secondElem.parent().removeClass( 'open show' );
      /*
      setTimeout(function(){
        showPair(firstElem, secondElem);
      }, 2000);
      */
      // lookCards = true;

      if (firstElem.attr( 'class' ) === secondElem.attr( 'class' )) {
        showPair(firstElem, secondElem);
        firstElem.parent().addClass( 'match' );
        secondElem.parent().addClass( 'match' );
      }

      else {
        setTimeout(function(){
          showPair(firstElem, secondElem);
        }, 2000);
      }

      console.log(secondElem.attr( 'class' ));
    }
  }
});

$( '.restart' ).on( 'click' , function() {
  restart();
  console.log('restart');
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
