(function (){
'use strict';

const playGame = document.getElementById('playGame'), games = document.getElementById('games');

games.addEventListener('change', function () {
    if(this.value > ''){
        playGame.style.display = 'block';
        playGame.href = this.value;
    }else{
        playGame.style.display = 'none';
    }
    
    
});


}());