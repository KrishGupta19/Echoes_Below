const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const GRAVITY = 0.5;
const JUMP = -12;
const SPEED = 4;
const PLAYER_SIZE = 40;
const MAX_LIVES = 5;

let keys = {};
let currentWorld = "light";
let lives = MAX_LIVES;

const player = {
  x: 100,
  y: 100,
  vx: 0,
  vy: 0,
  grounded: false,
};

let currentLevel = {};

function generateRandomLevel() {
  const platforms = [];
  const obstacles = [];
  const worldOptions = ["light", "shadow"];

  let x = 50;
  let y = canvas.height - 150;

  for (let i = 0; i < 4; i++) {
    const width = 100 + Math.random() * 100;
    const height = 20;
    const world = worldOptions[Math.floor(Math.random() * 2)];

    platforms.push({ x, y, w: width, h: height, world });

    // Occasionally add obstacles
    if (Math.random() < 0.5) {
      obstacles.push({
        x: x + width / 2 - 15,
        y: y - 30,
        size: 30,
        world,
      });
    }

    x += width + 100;
    y -= Math.random() * 50; // slight height changes
  }

  const goal = {
    x: x,
    y: y - 40,
    size: 40,
  };

  return {
    startX: 50,
    startY: canvas.height - 200,
    platforms,
    obstacles,
    goal,
  };
}

function loadNewLevel() {
  currentLevel = generateRandomLevel();
  player.x = currentLevel.startX;
  player.y = currentLevel.startY;
  player.vx = 0;
  player.vy = 0;
}

function drawPlayer() {
  ctx.fillStyle = currentWorld === "light" ? "#00ffff" : "#ff00ff";
  ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
}

function drawPlatforms() {
  currentLevel.platforms.forEach(p => {
    if (p.world === currentWorld) {
      ctx.fillStyle = p.world === "light" ? "#00ffff88" : "#ff00ff88";
      ctx.fillRect(p.x, p.y, p.w, p.h);
    }
  });
}

function drawObstacles() {
  currentLevel.obstacles.forEach(o => {
    if (o.world === currentWorld) {
      ctx.fillStyle = "red";
      ctx.fillRect(o.x, o.y, o.size, o.size);
    }
  });
}

function drawGoal() {
  const g = currentLevel.goal;
  ctx.fillStyle = "gold";
  ctx.fillRect(g.x, g.y, g.size, g.size);
}

function drawLives() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Lives: " + lives, 20, 40);

  // Add a stylish background for the lives counter
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(10, 10, 150, 40);
}

function drawWorldIndicator() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("World: " + (currentWorld === "light" ? "Light" : "Shadow"), canvas.width - 150, 40);
}

function drawGameOver() {
  if (lives <= 0) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2 - 50);

    ctx.font = "30px Arial";
    ctx.fillText("Press Enter to Restart", canvas.width / 2 - 150, canvas.height / 2 + 20);
  }
}

function updatePlayer() {
  player.vy += GRAVITY;
  player.x += player.vx;
  player.y += player.vy;
  player.grounded = false;

  // Platform collision
  currentLevel.platforms.forEach(p => {
    if (p.world !== currentWorld) return;

    const collision =
      player.x < p.x + p.w &&
      player.x + PLAYER_SIZE > p.x &&
      player.y + PLAYER_SIZE < p.y + 20 &&
      player.y + PLAYER_SIZE + player.vy >= p.y;

    if (collision) {
      player.vy = 0;
      player.y = p.y - PLAYER_SIZE;
      player.grounded = true;
    }
  });

  // Obstacle collision
  currentLevel.obstacles.forEach(o => {
    if (o.world !== currentWorld) return;

    if (
      player.x < o.x + o.size &&
      player.x + PLAYER_SIZE > o.x &&
      player.y < o.y + o.size &&
      player.y + PLAYER_SIZE > o.y
    ) {
      loseLife(); // Lose life only on obstacle collision
    }
  });

  // Goal check
  const g = currentLevel.goal;
  if (
    player.x < g.x + g.size &&
    player.x + PLAYER_SIZE > g.x &&
    player.y < g.y + g.size &&
    player.y + PLAYER_SIZE > g.y
  ) {
    loadNewLevel(); // Load next random level
  }

  // Falling check: don't lose life, just reset position
  if (player.y > canvas.height) {
    player.x = currentLevel.startX;
    player.y = currentLevel.startY;
    player.vy = 0;
    player.vx = 0;
  }
}

function loseLife() {
  lives -= 1;
  if (lives <= 0) {
    alert("Game Over! You've lost all lives.");
    lives = MAX_LIVES; // Reset lives
  }
  loadNewLevel(); // Restart level
}

function handleMovement() {
  player.vx = 0;
  if (keys["ArrowLeft"] || keys["a"]) player.vx = -SPEED;
  if (keys["ArrowRight"] || keys["d"]) player.vx = SPEED;
}

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, currentWorld === "light" ? "#00BFFF" : "#4B0082");
    gradient.addColorStop(1, currentWorld === "light" ? "#87CEFA" : "#6A0DAD");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  function drawWorldIndicator() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("World: " + (currentWorld === "light" ? "Light" : "Shadow"), canvas.width - 150, 40);
  }
  
  function drawLives() {
    // Text position below the "Refraction Rift" box (adjust as needed)
    const refractionTextHeight = 40; // Height of the "Refraction Rift" text box
    const livesTextHeight = 40; // Height for the lives UI text box
    
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Lives: " + lives, canvas.width / 2 - 70, refractionTextHeight + livesTextHeight); // Position below
  
    // Add a stylish background for the lives counter
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(canvas.width / 2 - 85, refractionTextHeight + 10, 150, 40); // Position below Refraction Rift box
  }
  

function gameLoop() {
  drawBackground();
  handleMovement();
  updatePlayer();
  drawPlatforms();
  drawObstacles();
  drawGoal();
  drawPlayer();
  drawLives();
  drawWorldIndicator();
  drawGameOver();
  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (e) => {
  if (lives <= 0 && e.key === "Enter") {
    lives = MAX_LIVES;
    loadNewLevel();
  }

  keys[e.key] = true;

  if ((e.key === "ArrowUp" || e.key === "w") && player.grounded) {
    player.vy = JUMP;
  }

  if (e.key === " ") {
    currentWorld = currentWorld === "light" ? "shadow" : "light";
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Start the game
loadNewLevel();
gameLoop();
