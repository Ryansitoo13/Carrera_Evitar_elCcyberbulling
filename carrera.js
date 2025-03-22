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
    let goalLine = { y: -600, height: 20, color: "yellow" };

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
        arr.forEach((obj, index) => {
            ctx.fillStyle = color;
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.fillText(textArray[index % textArray.length], obj.x + 5, obj.y + 25);
        });
    }

    function drawGoalLine() {
        ctx.fillStyle = goalLine.color;
        ctx.fillRect(0, goalLine.y, canvas.width, goalLine.height);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("META", canvas.width / 2 - 20, goalLine.y + 15);
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
        drawGoalLine();
        drawCar();
        moveObjects(obstacles);
        moveObjects(solutions);
        drawObjects(obstacles, "red", insults);
        drawObjects(solutions, "green", solutionsText);

        goalLine.y += speed;
        if (goalLine.y >= car.y) {
            document.getElementById("message").innerText = "🎉 ¡Felicidades! Has esquivado todos los peligros y llegaste a la meta!";
            gameOver = true;
        }

        obstacles.forEach((obstacle) => {
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
        goalLine.y = -600;
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
