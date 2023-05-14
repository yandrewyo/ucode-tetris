
document.addEventListener('DOMContentLoaded', () => { 
  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCSEc4Frt6zxQLHbxx8BlDFN3JEBDpfY3U",
    authDomain: "tetris-d5b82.firebaseapp.com",
    databaseURL: "https://tetris-d5b82.firebaseio.com",
    projectId: "tetris-d5b82",
    storageBucket: "tetris-d5b82.appspot.com",
    messagingSenderId: "516949401716",
    appId: "1:516949401716:web:427fbd696e239d5a0db121",
    measurementId: "G-GL094PMQ1K"
  };
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  const firestore = firebase.firestore()
  const placeTenDocRef = firestore.doc('leaderboard/placeTen')
 
  //display variables
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const linesDisplay = document.querySelector('#lines');
  const levelDisplay = document.querySelector('#level');
  const startBtn = document.querySelector('#start-button');
  const width = 10;
  let nextRandom = 0;
  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  let displayIndex = 0;
  
  let saved;
  let nextSavedRandom = 0;
  let savedRandom;
  const displaySavedSquares = document.querySelectorAll('.saved-grid div');
  const displaySavedWidth = 4;
  let displaySavedIndex = 0;
  let done = false
  let leadChanged = false;
  
  var atBottom = false;
  
  for (var i = 0; i < 200; i++) {
    squares[i].classList.add('square');
  }
  
  const leaderboardLink = document.getElementById('leaderboard-link')
  console.log(startBtn)
  
  //control variables
  const softSelect = sessionStorage.getItem('softSelect')
  const hardSelect = sessionStorage.getItem('hardSelect')
  const rotateSelect = sessionStorage.getItem('rotateSelect')
  const saveSelect = sessionStorage.getItem('saveSelect')
  const resetSelect = sessionStorage.getItem('resetSelect')
  const reset = sessionStorage.getItem('reset')
  
  
  //date
  let date = new Date()
  
  //music variables
  const musicChoice = parseInt(sessionStorage.getItem('musicChoice'))
  const audio = document.getElementById('music')
  const source = document.createElement("source");
  audio.appendChild(source);
  if (musicChoice === 1) {
    source.id = "classic-music"
    source.src = "classic-tetris-music.mp3"
  } else if (musicChoice === 2) {
    source.id = "remix-music"
    source.src = 'tetrismusic.mp4'
  }
  audio.loop = true;
  var musicSpeed = 1;
  audio.volume = 0.1
  var musicDuration;
  
  //make sure controls are actual values
  console.log(softSelect)
  console.log(hardSelect)
  console.log(rotateSelect)
  console.log(saveSelect)
  console.log(resetSelect)
  
  //draw tetriminoes
  
  const lrTetrimino = [
    [1, width + 1, width * 2 + 1, 2],
    [0, 1, 2, width + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [0, width, width + 1, width + 2]
  ];
  
  const zlTetrimino = [
    [width, 1, width + 1, 2],
    [0, width, width + 1, width * 2 + 1],
    [width, 1, width + 1, 2],
    [0, width, width + 1, width * 2 + 1]
  ];
  
  const tTetrimino = [
    [width, 1, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width + 2],
    [0, 1, width + 1, 2],
    [width, 1, width + 1, width * 2 + 1]
  ];
  
  const oTetrimino = [
    [0, width, 1, width + 1],
    [0, width, 1, width + 1],
    [0, width, 1, width + 1],
    [0, width, 1, width + 1]
  ];
  
  const llTetrimino = [
    [0, 1, width + 1, width * 2 + 1],
    [0, width, 1, 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width, width + 1, 2, width + 2]
  ];
  
  const zrTetrimino = [
    [0, 1, width + 1, width + 2],
    [width + 1, width * 2 + 1, 2, width + 2],
    [0, 1, width + 1, width + 2],
    [width + 1, width * 2 + 1, 2, width + 2]
  ];
  
  const iTetrimino = [
    [1, width + 1,width * 2 + 1, width * 3 + 1],
    [0, 1, 2, 3],
    [1, width + 1,width * 2 + 1, width * 3 + 1],
    [0, 1, 2, 3]
  ];
  
  const tetriminoes = [lrTetrimino, zlTetrimino, tTetrimino, oTetrimino, llTetrimino, zrTetrimino, iTetrimino];
  
  let currentPosition = 4;
  let currentRotation = 0;
  
  let random = Math.floor(Math.random() * tetriminoes.length);
  let current = tetriminoes[random][currentRotation];
  
  let switchAble = false
  
  let alternate = 0
  
  let scores = []
  
  //score, level, and line variables
  let timerId;
  var score = 0;
  let lines = 0;
  var level = 1;
  var levelSpeed = 975;
  var linesScored = 0;
  var touchingStatus = 0;
  var times = 0;
  var before = score;
  var liable = false;
  
  let highScore = localStorage.getItem('highScore')
  console.log(highScore)
  if (highScore == undefined || highScore == null) {
    highScore = 0
  }
  
  //draws first rotation in random tetrimino
  
  var testVar = document.querySelectorAll('.tetrimino');
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetrimino'); 
      //squares[currentPosition + index].style.backgroundColor = colors[random]; 
      squares[currentPosition + index].style.borderRadius = '15%';
      switch(tetriminoes[random]) {
        case lrTetrimino:
          squares[currentPosition + index].style.backgroundImage = 'url(blue.jpg)';
          break;
        case zlTetrimino:
          squares[currentPosition + index].style.backgroundImage = 'url(green.png)';
          break;
        case tTetrimino:
          squares[currentPosition + index].style.backgroundImage = 'url(purple.jpg)';
          break;
        case oTetrimino:
          squares[currentPosition + index].style.backgroundImage = 'url(yellow.jpg)';
          break;
        case llTetrimino:
          squares[currentPosition + index].style.backgroundImage = 'url(orange.jpg)';
          break;
        case zrTetrimino:
          squares[currentPosition + index].style.backgroundImage = 'url(red.jpg)';
          break;
        case iTetrimino:
          squares[currentPosition + index].style.backgroundImage = 'url(lightblue.png)';
          break;
        default:
          squares[currentPosition + index].style.backgroundImage = '';
      }
    });
  }
  
  draw();
  
  //undraw tetrimino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetrimino');
      squares[currentPosition + index].style.backgroundImage = '';
    });
  }
  //assign function to keyCode
  
  function control(e) {
    if (current.some(index => (currentPosition + index) % width === 0 || current.some(index => (currentPosition + index) % width === width -1))) {
      touchingStatus = 1;
    } else if (!current.some(index => (currentPosition + index) % width === 0 || current.some(index => (currentPosition + index) % width === width -1))) {
      touchingStatus = 0;
    }
    if ((e.keyCode === 37 || e.keyCode === 65) && status === 1) {
      moveLeft();
    } else if (e.keyCode === parseInt(rotateSelect) && status === 1 && touchingStatus === 0) {
      rotate();
    } else if (e.keyCode === parseInt(softSelect) && status === 1) {
      moveDown();
      score++;
      scoreDisplay.innerHTML = score;
    } else if ((e.keyCode === 39 || e.keyCode === 68) && status === 1) {
      moveRight();
    } else if (e.keyCode === parseInt(resetSelect)) {
      document.location.reload();
    } else if (e.keyCode === parseInt(saveSelect)) {
      displaySavedShape();
      console.log('pressed')
    } else if (e.keyCode === parseInt(hardSelect) && status === 1) {
      test = false;
      hardDrop();
      console.log(hardDropCount);
      score = score + hardDropCount * 2;
      scoreDisplay.innerHTML = score;
      freeze();
    }
  }
  document.addEventListener('keyup', control);
  
  var test;
  //moves down by width (10px)
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }
  var preLevelSpeed = levelSpeed
  //freeze
  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      test = true;
      switchAble = true
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));
      //new tetrimino
      random = nextRandom;
      currentPosition = 4;        
      nextRandom = Math.floor(Math.random() * tetriminoes.length);
      current = tetriminoes[random][currentRotation];
      draw();
      displayNextShape();
      addScore();
      gameOver();
      var ye = 0;
      while (times > 0) {
        moveDown()
        times--
        ye++
      }
      while (ye > 0) {
        undraw()
        currentPosition -= width
        draw()
        freeze()
        ye--
      }
    }
  }
  
  //move tetrimino
  
  function moveLeft() {
    undraw();
    const atLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    
    if (!atLeftEdge) currentPosition -=1;
    
    
    
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition++;
    }
    
    draw();
  }
  
  function moveRight() {
    undraw();
    const atRightEdge = current.some(index => (currentPosition + index) % width === width -1);
    if(!atRightEdge) currentPosition++;
    
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition--;
    }
    draw();
  }
  
  //rotate
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) { //if rotation is 4
      currentRotation = 0;
    }
    current = tetriminoes[random][currentRotation];
    draw();
  }
  
  //tetriminoes without rotation
  const nextTetrimino = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lrTetrimino
    [displayWidth * 2, displayWidth + 1, displayWidth * 2 + 1, displayWidth + 2], //zlTetrimino
    [displayWidth, 1, displayWidth + 1, displayWidth + 2], //tTetrimino
    [0, displayWidth, 1, displayWidth + 1], // oTetrimino
    [0, 1, displayWidth + 1, displayWidth * 2 + 1], //llTetrimino
    [displayWidth, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2], //zrTetrimino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetrimino
    
  ];
  const savedTetrimino = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lrTetrimino
    [displayWidth * 2, displayWidth + 1, displayWidth * 2 + 1, displayWidth + 2], //zlTetrimino
    [displayWidth, 1, displayWidth + 1, displayWidth + 2], //tTetrimino
    [0, displayWidth, 1, displayWidth + 1], // oTetrimino
    [0, 1, displayWidth + 1, displayWidth * 2 + 1], //llTetrimino
    [displayWidth, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2], //zrTetrimino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetrimino
    
  ];
  
  //display shape in minigrid
  function displayNextShape() {
    //remove trace of tetrimino
      displaySquares.forEach(square => {
        square.classList.remove('tetrimino');
        square.style.backgroundImage = '';
      });
    //draw in tetrimino
    nextTetrimino[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetrimino');
      displaySquares[displayIndex + index].style.borderRadius = '10%'
      switch(tetriminoes[nextRandom]) {
        case lrTetrimino:
          displaySquares[displayIndex + index].style.backgroundImage = 'url(blue.jpg)'
          break;
        case zlTetrimino:
          displaySquares[displayIndex + index].style.backgroundImage = 'url(green.png)'
          break;
        case tTetrimino:
          displaySquares[displayIndex + index].style.backgroundImage = 'url(purple.jpg)'
          break;
        case oTetrimino:
          displaySquares[displayIndex + index].style.backgroundImage = 'url(yellow.jpg)'
          break;
        case llTetrimino:
          displaySquares[displayIndex + index].style.backgroundImage = 'url(orange.jpg)'
          break;
        case zrTetrimino:
          displaySquares[displayIndex + index].style.backgroundImage = 'url(red.jpg)'
          break;
        case iTetrimino:
          displaySquares[displayIndex + index].style.backgroundImage = 'url(lightblue.png)'
          break;
        default:
          displaySquares[displayIndex + index].style.backgroundImage = ''
      }
    });
  }
  
  //display saved shape
  function displaySavedShape() {
    displaySavedSquares.forEach(square => {
      square.classList.remove('tetrimino');
      square.style.backgroundImage = '';
    });
    //first iteration
    if (switchAble === false && alternate === 0) {
      console.log(alternate)
      savedRandom = random
      console.log(random +' savedrandom')
      savedTetrimino[random].forEach(index => {
      displaySavedSquares[displaySavedIndex + index].classList.add('tetrimino');
      displaySavedSquares[displaySavedIndex + index].style.borderRadius = '10%'
      switch(tetriminoes[random]) {
        case lrTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(blue.jpg)'
          break;
        case zlTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(green.png)'
          break;
        case tTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(purple.jpg)'
          break;
        case oTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(yellow.jpg)'
          break;
        case llTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(orange.jpg)'
          break;
        case zrTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(red.jpg)'
          break;
        case iTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(lightblue.png)'
          break;
        default:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = ''
        }
      });
      undraw()
      random = nextRandom;        
      nextRandom = Math.floor(Math.random() * tetriminoes.length);
      current = tetriminoes[random][currentRotation];
      currentPosition = 4;
      displayNextShape();
      addScore();
      gameOver();
      current.forEach(index => {
        squares[currentPosition + index].classList.add('tetrimino'); 
        //squares[currentPosition + index].style.backgroundColor = colors[random]; 
        squares[currentPosition + index].style.borderRadius = '15%';
        
        switch(tetriminoes[random]) {
          case lrTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(blue.jpg)';
            break;
            
          case zlTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(green.png)';
            break;
            
          case tTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(purple.jpg)';
            break;
            
          case oTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(yellow.jpg)';
            break;
            
          case llTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(orange.jpg)';
            break;
            
          case zrTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(red.jpg)';
            break;
          
          case iTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(lightblue.png)';
            break;
            
          default:
            squares[currentPosition + index].style.backgroundImage = '';
        }
      });
      switchAble = true
    } else if (switchAble === true && alternate % 2 === 1){
      //odd iteration
      nextSavedRandom = random
      console.log(random + ' 1')
      savedTetrimino[random].forEach(index => {
      displaySavedSquares[displaySavedIndex + index].classList.add('tetrimino');
      displaySavedSquares[displaySavedIndex + index].style.borderRadius = '10%'
      switch(tetriminoes[random]) {
        case lrTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(blue.jpg)'
          break;
        case zlTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(green.png)'
          break;
        case tTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(purple.jpg)'
          break;
        case oTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(yellow.jpg)'
          break;
        case llTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(orange.jpg)'
          break;
        case zrTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(red.jpg)'
          break;
        case iTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(lightblue.png)'
          break;
        default:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(lightblue.png)'
        }
      });
      undraw()
      console.log(savedRandom)
      current = tetriminoes[savedRandom][currentRotation];
      currentPosition = 4;
      displayNextShape();
      addScore();
      gameOver();
      current.forEach(index => {
        squares[currentPosition + index].classList.add('tetrimino'); 
        //squares[currentPosition + index].style.backgroundColor = colors[random]; 
        squares[currentPosition + index].style.borderRadius = '15%';
        switch(tetriminoes[savedRandom]) {
          case lrTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(blue.jpg)';
            break;
          case zlTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(green.png)';
            break;
          case tTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(purple.jpg)';
            break;
          case oTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(yellow.jpg)';
            break;
          case llTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(orange.jpg)';
            break;
          case zrTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(red.jpg)';
            break;
          case iTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(lightblue.png)';
            break;
          default:
            squares[currentPosition + index].style.backgroundImage = '';
        }
      });
      random = savedRandom
    } else if (switchAble === true && alternate % 2 === 0) {
      //even iteration
      savedRandom = random
      savedTetrimino[random].forEach(index => {
      displaySavedSquares[displaySavedIndex + index].classList.add('tetrimino');
      displaySavedSquares[displaySavedIndex + index].style.borderRadius = '10%'
      switch(tetriminoes[random]) {
        case lrTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(blue.jpg)'
          break;
        case zlTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(green.png)'
          break;
        case tTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(purple.jpg)'
          break;
        case oTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(yellow.jpg)'
          break;
        case llTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(orange.jpg)'
          break;
        case zrTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(red.jpg)'
          break;
        case iTetrimino:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = 'url(lightblue.png)'
          break;
        default:
          displaySavedSquares[displaySavedIndex + index].style.backgroundImage = ''
        }
      });
      undraw()
      console.log(savedRandom)
      console.log(nextSavedRandom)
      console.log(tetriminoes[nextSavedRandom])
      current = tetriminoes[nextSavedRandom][currentRotation];
      currentPosition = 4;
      displayNextShape();
      addScore();
      gameOver();
      current.forEach(index => {
        squares[currentPosition + index].classList.add('tetrimino'); 
        //squares[currentPosition + index].style.backgroundColor = colors[random]; 
        squares[currentPosition + index].style.borderRadius = '15%';
        
        switch(tetriminoes[nextSavedRandom]) {
          case lrTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(blue.jpg)';
            break;
          case zlTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(green.png)';
            break;
          case tTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(purple.jpg)';
            break;
          case oTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(yellow.jpg)';
            break;
          case llTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(orange.jpg)';
            break;
          case zrTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(red.jpg)';
            break;
          case iTetrimino:
            squares[currentPosition + index].style.backgroundImage = 'url(lightblue.png)';
            break;
          default:
            squares[currentPosition + index].style.backgroundImage = 'url(lightblue.png)';
        }
      });
      random = nextSavedRandom
    }
    alternate++
    switchAble = false
  }
  
  //hard drop
  var hardDropCount = 0;
  function hardDrop() {
    hardDropCount = 0
    while(test != true) {
      moveDown();
      freeze()
      hardDropCount++;
    }
  }
  
  //start/pause
  var status = 0;
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      status = 0;
      document.querySelector("#start-button").innerHTML = "Start"
      audio.pause()
    } else {
      draw();
      timerId = setInterval(moveDown, levelSpeed)
      console.log(levelSpeed + ' level speed')
      status = 1
      displayNextShape();
      document.querySelector("#start-button").innerHTML = "Pause"
      audio.play()
    }
  });
  
  //add score
  
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
      if(row.every(index => squares[index].classList.contains('taken'))) {
        
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetrimino')
          squares[index].style.backgroundImage = '';
        });
        lines++;
        if (lines % 5 === 0) {
          liable = true;
        }
        scoreDisplay.innerHTML = score;
        levelDisplay.innerHTML = level;
        linesDisplay.innerHTML = lines;
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell))
        times++
      }
    }
      before = score
      if (times === 1) {
        score = score + 100 * level
        console.log(score + 'score')
        console.log(times + 'times')
        console.log(score - before + ' score change')
      } else if (times === 2) {
        score = score + 300 * level
        console.log(score + 'score')
        console.log(times + 'times')
        console.log(score - before + ' score change')
      } else if (times === 3) {
        score = score + 500 * level
        console.log(score + 'score')
        console.log(times + 'times')
        console.log(score - before + ' score change')
      } else if (times === 4) {
        score = score + 800 * level
        console.log(score + 'score')
        console.log(times + 'times')
        console.log(score - before + ' score change')
      }
      if (liable === true) {
        console.log(lines + ' lines')
        level++
        musicSpeed += 0.001
        music.playbackRate = musicSpeed;
        liable = false;
        if (levelSpeed >= 75) {
          levelSpeed -= 50;
          clearInterval(timerId);
          timerId = setInterval(moveDown, levelSpeed)
        } else {
          levelSpeed = 75
        }
        console.log(levelSpeed + ' level speed')
      }
  }
  
  function linkHandler() {
    if (!current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      if (confirm('You are in the middle of a game. Your score will not be saved on the leaderboard or as your highscore. Continue?')) {
        location.href = 'leaderboard.html'
      }
    }
  }
  
  leaderboardLink.addEventListener('click', linkHandler);
  let update;
  
  //game over
  function gameOver() {
    
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      status = 0;
      scoreDisplay.innerHTML = 'GAMEOVER. YOU FINISHED WITH A SCORE OF ' + score + ". PRESS " + reset.toUpperCase() + " TO PLAY AGAIN. YOUR SCORE WILL NOT BE SAVED IF YOU RESTART.";
      clearInterval(timerId);
      displaySquares.forEach(square => {
        square.classList.remove('tetrimino');
        square.style.backgroundImage = '';
      });
      if (parseInt(highScore) < score) {
        highScore = score
        console.log(highScore)
        localStorage.removeItem('highScore')
        localStorage.setItem('highScore', highScore)
      }
      
      localStorage.setItem('newScore', score)
      placeTenDocRef.get().then(function(doc) {
        if (doc && doc.exists && doc.data().score < score && highScore < score) {
          sessionStorage.setItem('leadStatus', 'changed')
        } else if (highScore > score) {
          sessionStorage.setItem('leadStatus', 'unchanged')
        } else if (highScore == 0 && highScore < score && doc.data().score < score) {
          sessionStorage.setItem('leadStatus', 'newScore/changed')
        } else if (highScore == 0 && highScore < score && doc.data().score > score) {
          sessionStorage.setItem('leadStatus', 'newScore/unchanged')
        }
      })
      const leadStatus = sessionStorage.getItem('leadStatus')
      
      if (status === 0) {
        audio.pause()
      }
      console.log('yeet')
      setTimeout(() => {
        /*if (done === false) {
          ok = confirm('Click ok to proceed to the leaderboard, or click cancel to stay on this page. If you start a new game, you will not be able to enter your score in the leaderboard.')
        }
        if (done === false && ok) {
          location.href = 'leaderboard.html'
          done = true
          console.log('done is ' + done)
          console.log('ok is ' + ok)
        } else if (!ok && done === false) {
          done = true
          console.log('done is ' + done)
          console.log('ok is ' + ok)
        }*/
        console.log(leadChanged)
        if (leadChanged === false) {
          if (leadStatus === "unchanged") {
            let confirmed = confirm('You were close to your highscore! Unfortunately, we don\'t count this score on the leaderboard. Beat your highscore to update your position. Click OK to play again, or click CANCEL to go to the leaderboard.')
            if (confirmed === true) {
              document.location.reload()
            } else {
              location.href = 'leaderboard.html'
            }
          } else if (leadStatus === 'changed') {
            let confirmed = confirm('Congratulations! You beat your highscore! Click OK to see the leaderboard and your updated position, or click CANCEL to stay on the page. (Warning: If you play another game without saving your score by going to the leaderboard page, the leaderboard will not be updated)')
            if (confirmed === true) {
              location.href = 'leaderboard.html'
            }
          } else if (leadStatus === 'newScore/changed') {
            let confirmed = confirm('Congratulations on playing your first game! Wow! You\'ve already made it on the leaderboard! Click OK to see the leaderboard and your updated position, or click CANCEL to stay on the page. (Warning: If you play another game without saving your score by going to the leaderboard page, the leaderboard will not be updated)')
            if (confirmed === true) {
              location.href = 'leaderboard.html'
            }
          } else if (leadStatus === 'newScore/unchanged') {
            let confirmed = confirm('Congratulations on playing your first game! Unfortunately, you did not make it onto the leaderboard. Click OK to play another game, or click CANCEL to see the leaderboard.')
            if (confirmed === true) {
              document.location.reload()
            } else {
              location.href = 'leaderboard.html'
            }
          }
        }
        leadChanged = true
        console.log(leadChanged)
        startBtn.disabled = true
      }, 500)
      leaderboardLink.href = 'leaderboard.html'
    }
  }
});
