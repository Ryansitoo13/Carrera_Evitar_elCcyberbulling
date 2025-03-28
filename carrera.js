document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 500;
    canvas.height = 600;

    let car = { x: 225, y: 500, width: 50, height: 80, color: "blue" };
    let obstacles = [];
    let solutions = [];
    let speed = 2.5;
    let score = 0;
    let gameOver = false;
    let goalLine = { y: -18000, height: 20, color: "yellow" };
    let startTime;

    const gameDuration = 5 * 60 * 1000; // 5 minutos
    const insults = ["Feo", "Bobo", "Malo", "Tonto", "Torpe"];
    const solutionsText = ["Bloquear", "Contar a un adulto", "Reportar"];

    let attempts = 0;
    const maxAttempts = 3;
    let hasWonBefore = false;

    function drawCar() {
        ctx.fillStyle = car.color;
        ctx.fillRect(car.x, car.y, car.width, car.height);
        ctx.fillStyle = "black";
        ctx.fillRect(car.x + 10, car.y + 10, 10, 10);
        ctx.fillRect(car.x + 30, car.y + 10, 10, 10);
    }

    function drawObjects(arr, color, textArray, isGood = false) {
        arr.forEach((obj, index) => {
            ctx.fillStyle = color;
            if (isGood) {
                ctx.beginPath();
                ctx.arc(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
            } else {
                ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            }
            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(textArray[index % textArray.length], obj.x + obj.width / 2, obj.y + obj.height / 2 + 4);
        });
    }

    function drawGoalLine() {
        ctx.fillStyle = goalLine.color;
        ctx.fillRect(0, goalLine.y, canvas.width, goalLine.height);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("META", canvas.width / 2, goalLine.y + 15);
    }

    function moveObjects(arr) {
        arr.forEach(obj => obj.y += speed);
        arr.forEach((obj, index) => {
            if (obj.y > canvas.height) {
                let safe = false;
                let newObj;
                while (!safe) {
                    newObj = { x: Math.random() * 400, y: -Math.random() * 300 - 100, width: 60, height: 60 };
                    safe = !arr.some(other => Math.abs(newObj.y - other.y) < 50 && Math.abs(newObj.x - other.x) < 60);
                }
                arr[index] = newObj;
            }
        });
    }

    function detectCollision(obj) {
        return obj.y + obj.height >= car.y &&
               obj.y <= car.y + car.height &&
               obj.x < car.x + car.width &&
               obj.x + obj.width > car.x;
    }

    function update() {
        if (gameOver) return;

        const currentTime = new Date().getTime();
        if (currentTime - startTime >= gameDuration) {
            document.getElementById("message").innerText = "⏰ ¡Tiempo cumplido! ¡Buen trabajo evitando el cyberbullying!";
            gameOver = true;
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGoalLine();
        drawCar();
        moveObjects(obstacles);
        moveObjects(solutions);
        drawObjects(obstacles, "red", insults);
        drawObjects(solutions, "green", solutionsText, true);

        goalLine.y += speed;

        if (goalLine.y >= car.y) {
            if (!hasWonBefore) {
                score += 150;
                hasWonBefore = true;
                document.getElementById("message").innerText = `🎉 ¡Felicidades! Llegaste a la meta y ganaste 150 puntos. Total: ${score}`;
            } else {
                document.getElementById("message").innerText = "🎉 ¡Ya obtuviste los 150 puntos! Puedes seguir jugando por diversión 😊";
            }
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
                solutions.push({ x: Math.random() * 400, y: -100, width: 60, height: 60 });
            }
        });

        if (!gameOver) requestAnimationFrame(update);
    }

    function startGame() {
        if (attempts >= maxAttempts) {
            document.getElementById("message").innerText = "🔒 Ya has usado tus 3 intentos.";
            return;
        }

        attempts++;
        obstacles = [];
        solutions = [];
        for (let i = 0; i < 7; i++) {
            obstacles.push({ x: Math.random() * 400, y: -i * 150, width: 60, height: 60 });
            solutions.push({ x: Math.random() * 400, y: -i * 200 - 50, width: 60, height: 60 });
        }
        goalLine.y = -18000;
        score = 0;
        gameOver = false;
        document.getElementById("message").innerText = "";
        startTime = new Date().getTime();
        update();
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft" && car.x > 0) car.x -= 20;
        if (e.key === "ArrowRight" && car.x < canvas.width - car.width) car.x += 20;
    });

    document.getElementById("startGameBtn").addEventListener("click", startGame);
});

