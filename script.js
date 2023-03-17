const playBoard = document.querySelector(".play-board")
const scoreElement = document.querySelector(".score")
const highScoreElement = document.querySelector(".high-score")
const controls = document.querySelectorAll(".controls i")

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY =10;
let snakeBody = [];
let velocityX = 0 ; velocityY = 0;
let setIntervalId;
let score = 0;

//set điểm cao nhất lưu trong localStorage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`

//Random vị trí xuất hiện của food
const changeFoodPosition = () =>{
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () =>{
    clearInterval(setIntervalId);
    alert("Game Over!...")
    location.reload();
}

const changeDirection = (e) =>{
    //Thay đổi vị trí của velocity dựa trên phím mũi tên
    if(e.key === "ArrowUp" && velocityY != 1){
        velocityX = 0; 
        velocityY = -1;
    }else if(e.key === "ArrowDown" && velocityY != -1 ){
        velocityX = 0; 
        velocityY = 1;
    }else if(e.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1; 
        velocityY = 0;
    }else if(e.key === "ArrowRight" && velocityX != -1){
        velocityX = 1; 
        velocityY = 0;
    }
}


//Điều khiển trên màn hình
controls.forEach(key =>{
    key.addEventListener("click" ,() => changeDirection({key: key.dataset.key}));
})

const initGame = () =>{
    if(gameOver) return handleGameOver();
    //Xuất hiện food 
    let htmlMarkup = `<div class="food" style="grid-area:${foodY} / ${foodX} "></div>`;
    
    //Nếu vị trí của snke = với vị trí của food thì đổi vị trí của food
    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX, foodY])
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`
        highScoreElement.innerText = `High Score: ${highScore}`
    }

    for (let i = snakeBody.length - 1; i>0 ; i--) {
        snakeBody[i] = snakeBody[i -1];
    }

    snakeBody[0] = [snakeX, snakeY];
    //Cập nhật lại vị trí của Snake sao khi cộng velocity
    snakeY += velocityY;
    snakeX += velocityX;

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area:${snakeBody[i][1]} / ${snakeBody[i][0]} "></div>`;
        //Kiểm tra snake có chạm vào body không
        if(i != 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);

document.addEventListener("keydown", changeDirection);