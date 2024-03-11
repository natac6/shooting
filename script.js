document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 75,
    width: 50,
    height: 50,
    color: "blue",
    speed: 7,
  };

  const bullets = [];
  const bulletSpeed = 7;

  const enemy = {
    x: Math.random() * (canvas.width - 50),
    y: 50,
    width: 50,
    height: 50,
    color: "green",
    speed: 2,
    shootInterval: 2000, // milliseconds
    lastShootTime: 0,
  };

  const enemyBullets = [];
  const enemyBulletSpeed = 5;

  //Draw the player on the canvas.
  function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
  //Draw a bullet on the canvas.
  function drawBullet(bullet) {
    ctx.fillStyle = "red";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
  //Draw the enemy on the canvas.
  function drawEnemy() {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }
  //Draw an enemy bullet on the canvas.
  function drawEnemyBullet(bullet) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
  //Move the player left or right based on the input direction.
  function movePlayer(direction) {
    if (direction === "left" && player.x > 0) {
      player.x -= player.speed;
    } else if (
      direction === "right" &&
      player.x < canvas.width - player.width
    ) {
      player.x += player.speed;
    }
  }
  //Create a bullet at the player's position and add it to the bullets array.
  function shoot() {
    const bullet = {
      x: player.x + player.width / 2 - 5,
      y: player.y,
      width: 10,
      height: 10,
    };
    bullets.push(bullet);
  }
  //Move each bullet upwards on the canvas.Remove bullets that go beyond the top of the canvas.
  function moveBullets() {
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].y -= bulletSpeed;

      if (bullets[i].y < 0) {
        bullets.splice(i, 1);
        i--;
      }
    }
  }
  // Move the enemy downwards on the canvas. If the enemy goes below the canvas, reset its position.
  function moveEnemy() {
    enemy.y += enemy.speed;

    if (enemy.y > canvas.height) {
      enemy.y = 0;
      enemy.x = Math.random() * (canvas.width - 50);
    }
  }

  //Shoot a bullet from the enemy at regular intervals.
  //Update the last shoot time to control the shooting rate.

  function enemyShoot() {
    const currentTime = new Date().getTime();

    if (currentTime - enemy.lastShootTime > enemy.shootInterval) {
      const bullet = {
        x: enemy.x + enemy.width / 2 - 5,
        y: enemy.y + enemy.height,
        width: 10,
        height: 10,
      };
      enemyBullets.push(bullet);
      enemy.lastShootTime = currentTime;
    }
  }
  //Move each enemy bullet downwards on the canvas.
  //Remove enemy bullets that go beyond the bottom of the canvas.

  function moveEnemyBullets() {
    for (let i = 0; i < enemyBullets.length; i++) {
      enemyBullets[i].y += enemyBulletSpeed;

      if (enemyBullets[i].y > canvas.height) {
        enemyBullets.splice(i, 1);
        i--;
      }
    }
  }

  //Check if any player bullets hit the enemy. If yes, remove the bullet, reset the enemy position, and score a point.
  function checkCollision() {
    for (let i = 0; i < bullets.length; i++) {
      if (
        bullets[i].x < enemy.x + enemy.width &&
        bullets[i].x + bullets[i].width > enemy.x &&
        bullets[i].y < enemy.y + enemy.height &&
        bullets[i].y + bullets[i].height > enemy.y
      ) {
        bullets.splice(i, 1);
        i--;
        enemy.y = 0;
        enemy.x = Math.random() * (canvas.width - 50);
      }
    }
  }
  //Check if any enemy bullets hit the player. If yes, show a game over alert and reset the game.
  function checkPlayerCollision() {
    for (let i = 0; i < enemyBullets.length; i++) {
      if (
        enemyBullets[i].x < player.x + player.width &&
        enemyBullets[i].x + enemyBullets[i].width > player.x &&
        enemyBullets[i].y < player.y + player.height &&
        enemyBullets[i].y + enemyBullets[i].height > player.y
      ) {
        alert("Game Over!");
        resetGame();
      }
    }
  }
  //Reset player and enemy positions. Clear bullet arrays.
  function resetGame() {
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 75;
    bullets.length = 0;
    enemyBullets.length = 0;
    enemy.x = Math.random() * (canvas.width - 50);
    enemy.y = 50;
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    moveBullets();
    drawEnemy();
    moveEnemy();
    checkCollision();
    enemyShoot();
    moveEnemyBullets();
    checkPlayerCollision();

    for (const bullet of bullets) {
      drawBullet(bullet);
    }

    for (const enemyBullet of enemyBullets) {
      drawEnemyBullet(enemyBullet);
    }

    requestAnimationFrame(gameLoop);
  }
  //Move the player left or right when arrow keys are pressed.Shoot a bullet when the space key is pressed.
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      movePlayer("left");
    } else if (event.key === "ArrowRight") {
      movePlayer("right");
    } else if (event.key === " ") {
      shoot();
    }
  });

  gameLoop();
});
