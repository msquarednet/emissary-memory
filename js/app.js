(function(){
'use strict';

angular.module('memGame', [])
  .controller('MainController', MainController)
  .factory('GameService', GameService)
  
  function MainController(GameService){
    this.gameSvc = GameService;
  }
  
  function GameService($timeout) {
    function Card (val) {
      this.val = val;
      this.selected = false;
      this.matched = false;
    };
    function shuffleArray(arr) {
      var currentIndex = arr.length;
      var temporaryValue;
      var randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
      };   
      return arr;   
    }
    
    var self = {
      msg: '',
      cardsarray: [],
      selectedCards: [],  
      score: 0,  
      gameover: null, 
      
      init: function() {	
        self.msg = 'Select matching pairs of cards, below...';
        self.cardsarray = []; //reset
        self.selectedCards = [];
        self.score = 0;
        self.gameover = false;
        self.createCards(); 
      },
      createCards: function() {
        // var data = shuffleArray([0,1,2,0,1,2]);
        var data = shuffleArray([0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9]);
        self.cardsarray = data.map(function(num) { return new Card(num) });
      },
      cardClick: function(card) {
        if (card.selected) {return};                  //can't select same card
        if (self.selectedCards.length===2) {return};  //already have a pair (max 2 cards)
        card.selected = true;
        self.selectedCards.push(card);
        if (self.selectedCards.length===2) {
          if (self.selectedCards[0].val===self.selectedCards[1].val) {
            self.msg = 'Nice job!';
            self.selectedCards.forEach(function(c){c.matched=true});
            if (this.isGameOver()) {  
              self.msg = 'Great Game!';
              self.gameover = true;
            } else {
              $timeout(self.doPairSuccess, 1000);
            }
          } else {
            self.msg = 'Too bad, Try again.';
            self.score++;
            $timeout(self.doPairFail, 1000);
          }
        } else {
          self.msg = 'Try to select the other "' + self.selectedCards[0].val + '"...';
        }
      }, 
      doPairFail: function() {
        self.msg = 'Select a matching pair of cards, below.';
        self.selectedCards.forEach(function(c){
          c.matched=false;
          c.selected=false;
        });
        self.selectedCards = [];
      },
      doPairSuccess: function() {
        self.msg = 'Select another matching pair...';
        self.selectedCards = [];
      },
      isGameOver: function() {
        var remaining = self.cardsarray.reduce(function(prev, curr){return prev += (curr.matched) ? 0 : 1},0)
        return (remaining===0);
      }    
      
    } //self
    
    self.init();
    return self;
  }
  
  
  
}());