document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 500;
    canvas.height = 600;

    let car = { x: 225, y: 500, width: 50, height: 80, color: "blue" };
    let obstacles = [];
    let solutions = [];
    let speed = 3;
    let score = 0;
    let gameOver = false;

    function drawCar() {
        ctx.fillStyle = car.color;
        ctx.fillRect(car.x, car.y, car.width, car.height);
    }

    function drawObjects(arr, color, text) {
        ctx.fillStyle = color;
        arr.forEach(obj => {
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.fillText(text, obj.x + 10, obj.y + 25);
        });
    }

    function moveObjects(arr) {
        arr.forEach(obj => obj.y += speed);
    }

    function detectCollision(obj) {
        return obj.y + obj.height >= car.y && obj.x < car.x + car.width && obj.x + obj.width > car.x;
    }

    function update() {
        if (gameOver) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCar();
        moveObjects(obstacles);
        moveObjects(solutions);
        drawObjects(obstacles, "red", "INSULTO");
        drawObjects(solutions, "green", "BLOQUEAR");

        obstacles.forEach((obstacle, index) => {
            if (detectCollision(obstacle)) {
                document.getElementById("message").innerText = "❌ ¡Cuidado! No respondas a insultos en línea.";
                gameOver = true;
            }
        });

        solutions.forEach((solution, index) => {
            if (detectCollision(solution)) {
                score++;
                solutions.splice(index, 1);
                if (score >= 5) {
                    document.getElementById("message").innerText = "✅ ¡Felicidades! Sabes cómo actuar ante el cyberbullying.";
                    gameOver = true;
                }
            }
        });

        if (!gameOver) requestAnimationFrame(update);
    }

    function startGame() {
        obstacles = [
            { x: 100, y: -20, width: 80, height: 40 },
            { x: 300, y: -100, width: 80, height: 40 },
            { x: 200, y: -200, width: 80, height: 40 }
        ];
        solutions = [
            { x: 150, y: -50, width: 80, height: 40 },
            { x: 250, y: -150, width: 80, height: 40 }
        ];
        score = 0;
        gameOver = false;
        document.getElementById("message").innerText = "";
        update();
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft" && car.x > 0) car.x -= 20;
        if (e.key === "ArrowRight" && car.x < canvas.width - car.width) car.x += 20;
    });

    document.getElementById("startGameBtn").addEventListener("click", startGame);
});

