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

    const insults = ["Feo", "Bobo", "Malo", "Tonto", "Torpe"];
    const solutionsText = ["Bloquear", "Contar a un adulto", "Reportar"];

    function drawCar() {
        ctx.fillStyle = car.color;
        ctx.fillRect(car.x, car.y, car.width, car.height);
        ctx.fillStyle = "black";
        ctx.fillRect(car.x + 10, car.y + 10, 10, 10);
        ctx.fillRect(car.x + 30, car.y + 10, 10, 10);
    }

    function drawObjects(arr, color, textArray) {
        ctx.fillStyle = color;
        arr.forEach((obj, index) => {
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.fillText(textArray[index % textArray.length], obj.x + 10, obj.y + 25);
        });
    }

    function moveObjects(arr) {
        arr.forEach(obj => obj.y += speed);
        arr.forEach((obj, index) => {
            if (obj.y > canvas.height) {
                arr[index] = { x: Math.random() * 400, y: -100, width: 80, height: 40 };
            }
        });
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
        drawObjects(obstacles, "red", insults);
        drawObjects(solutions, "green", solutionsText);

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
                solutions.push({ x: Math.random() * 400, y: -100, width: 80, height: 40 });
                if (score >= 5) {
                    document.getElementById("message").innerText = "✅ ¡Felicidades! Sabes cómo actuar ante el cyberbullying.";
                    gameOver = true;
                }
            }
        });

        if (!gameOver) requestAnimationFrame(update);
    }

    function startGame() {
        obstacles = [];
        solutions = [];
        for (let i = 0; i < 5; i++) {
            obstacles.push({ x: Math.random() * 400, y: -i * 150, width: 80, height: 40 });
            solutions.push({ x: Math.random() * 400, y: -i * 200 - 50, width: 80, height: 40 });
        }
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
