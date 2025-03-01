const WALL_SIZE = 40;
const GRID_WIDTH = 17;  // Width of the maze in blocks
const GRID_HEIGHT = 19; // Height of the maze in blocks
const EDGE_IMAGE_PATH = '/pages/game/materials/egypt/edge_egypt.png';
const RIGHT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/right_egypt.png';
const LEFT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/left_egypt.png';
const TOP_WALL_IMAGE_PATH = '/pages/game/materials/egypt/top_egypt.png';
const TOPLEFT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/topleft_egypt.png';
const TOPRIGHT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/topright_egypt.png';
const BOTTOMLEFT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/bottomleft_egypt.png';
const BOTTOMRIGHT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/bottomright_egypt.png';
const WALLTOP_IMAGE_PATH = '/pages/game/materials/egypt/walltop_egypt.png';
const BOTTOM_WALL_IMAGE_PATH = '/pages/game/materials/egypt/bottom_egypt.png';
const BOTTOM_RIGHT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/bottom_right.png';
const BOTTOM_LEFT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/bottom_left.png';

const TOPRIGHTBOTTOM_WALL_IMAGE_PATH = '/pages/game/materials/egypt/toprightbottom_egypt.png';
const TOPLEFTBOTTOM_WALL_IMAGE_PATH = '/pages/game/materials/egypt/topleftbottom_egypt.png';
const LEFTBOTTOMRIGHT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/leftbottomright_egypt.png';
const LEFTTOPRIGHT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/lefttopright_egypt.png';
const BOTTOMTOP_WALL_IMAGE_PATH = '/pages/game/materials/egypt/bottomtop_egypt.png';
const LEFTRIGHT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/leftright_egypt.png';

const PLAYER_AVATAR_PATH = '/pages/game/materials/egypt/avatar1.png';
const PLAYER_AVATAR_PATH_1 = '/pages/game/materials/egypt/avatar1.png';
const PLAYER_AVATAR_PATH_2 = '/pages/game/materials/egypt/avatar2.png';
const PLAYER_AVATAR_PATH_3 = '/pages/game/materials/egypt/avatar3.png';
const PLAYER_AVATAR_PATH_4 = '/pages/game/materials/egypt/avatar4.png';
const PLAYER_AVATAR_PATH_5 = '/pages/game/materials/egypt/avatar5.png';
const ENEMY_IMAGE_PATH = '/pages/game/materials/egypt/ghost.png';
const ENEMY_IMAGE_PATH_2 = '/pages/game/materials/egypt/ghost2.png';
const EXIT_IMAGE_PATH = '/pages/game/materials/egypt/exit_egypt.jpg';
const GROUND_IMAGE_PATH = '/pages/game/materials/egypt/ground_egypt.png';

// Add these key image paths
const KEY1_IMAGE_PATH = '/pages/game/materials/egypt/key1_egypt.png';
const KEY2_IMAGE_PATH = '/pages/game/materials/egypt/key2_egypt.png';
const KEY3_IMAGE_PATH = '/pages/game/materials/egypt/key3_egypt.png';
const KEY4_IMAGE_PATH = '/pages/game/materials/egypt/key4_egypt.png';

const ENEMY_SPEED = 0.6;  // Slightly slower than player

// Add these constants at the top
const PLAYER_VISUAL_WIDTH = 30;  // Width of player avatar image
const PLAYER_VISUAL_HEIGHT = 30; // Height of player avatar image
const ENEMY_VISUAL_WIDTH = 30;   // Width of enemy avatar image
const ENEMY_VISUAL_HEIGHT = 30;  // Height of enemy avatar image

// Add these constants at the top for key dimensions
const KEY_WIDTH = 25;   // Base size for all keys
const KEY_HEIGHT = 25;  // Base size for all keys

const app = getApp();

Page({
  data: {
    player: {
      x: 0,  // Temporary placeholder
      y: 0,  // Temporary placeholder
      width: 30,
      height: 2,
      visualWidth: PLAYER_VISUAL_WIDTH,
      visualHeight: PLAYER_VISUAL_HEIGHT,
      initialX: 0,   // Set initial X
      initialY: 0,   // Set initial Y
      facingLeft: false,
      animationFrame: 0,
      animationTime: 0,
      isMoving: false
    },
    walls: [],
    exit: { 
      x: 0,
      y: 0,
      width: WALL_SIZE, 
      height: WALL_SIZE 
    },
    key1: {
      x: 0,
      y: 0,
      width: KEY_WIDTH,
      height: KEY_HEIGHT,
      collected: false,
      floatOffset: 0
    },
    key2: {
      x: 0,
      y: 0,
      width: KEY_WIDTH,
      height: KEY_HEIGHT,
      collected: false,
      floatOffset: 0
    },
    joystick: {
        x: 0,
        y: 0,
        knobX: 0,
        knobY: 0,
        baseRadius: 50,
        knobRadius: 25,
        touching: false,
        moveX: 0,
        moveY: 0
    },
    showComplete: false,
    moveSpeed: 1.5,
    canvasWidth: 0,
    canvasHeight: 0,
    showKeyReminder: false,
    keyReminderTimer: null,
    enemy: {
      x: 0,  // Temporary placeholder
      y: 0,  // Temporary placeholder
      width: 30,
      height1: 3,
      height2: 3.2,
      visualWidth: ENEMY_VISUAL_WIDTH,
      visualHeight: ENEMY_VISUAL_HEIGHT,
      initialX: 0,
      initialY: 0,
      frame: 0,
      isActive: false,
      facingLeft: false,
      waitingForPlayerMove: true  // Add this new property
    },
    tutorial: {
      show: true,  // Will be set to false when joystick is first moved
      hoverOffset: 0  // For the hovering animation
    },
    currentLevel: 3,  // Add this to track current level
    quiz: {
      currentKeyIndex: 0,
      keys: [
        { texture: 'key1', x: 0, y: 0 },
        { texture: 'key2', x: 0, y: 0 }
      ],
      completed: false,
      highlightedBlock: null,  // Add this to track highlighted block
      highlightTimer: null,     // Add this to track the highlight timer
      incorrectBlock: null,  // Add this to track incorrect block
      incorrectFlashCount: 0,  // Add this to track flash count
      incorrectFlashTimer: null,  // Add this to track flash timer
      correctBlock: null,    // Add this to track correct block
      correctFlashCount: 0,  // Add this to track correct flash count
      correctFlashTimer: null, // Add this to track correct flash timer
      enlargedBlock: null, // Add this to track enlarged block
      clickCooldown: false,  // Add this to track click cooldown
      cooldownDuration: 500,  // 500ms cooldown between clicks
      offsetX: 0,  // Add this to track horizontal offset
      offsetY: 0,  // Add this to track vertical offset
      lastTouchX: 0,  // Add this to track last touch X position
      lastTouchY: 0,  // Add this to track last touch Y position
      startTouchX: 0,  // Track start position
      startTouchY: 0,
      quizTimes: [null, null],  // Add this to track time taken for each question
      currentQuestionStartTime: null,  // Add this to track start time of current question
    },
    showDeathScreen: false,
    deathScreenOpacity: 0,
    keyCollectionTimes: [null, null], // Add this to track key collection times
  },

  // Add these variables outside of data since they don't need to trigger UI updates
  gameplayStats: {
    caughtByEnemy: false,
    startTime: null,
    endTime: null,
    quizAccuracy: [], // Will store the distances for each key guess
  },

  gameLoopId: null,  // Add this to track the game loop

  onLoad(options) {
    const windowInfo = wx.getWindowInfo();
    const joystickX = windowInfo.windowWidth / 2;
    const joystickY = windowInfo.windowHeight - 150;
    
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const levelPath = `/${currentPage.route}`;
    console.log(levelPath)
    const levelMatch = levelPath.match(/level(\d+)/); // Extract the level number
    console.log(levelMatch)
    const levelNumber = levelMatch ? parseInt(levelMatch[1], 10) : 0; // Default to 0 if not found
    console.log(levelNumber)

    this.setData({
      canvasWidth: windowInfo.windowWidth,
      canvasHeight: windowInfo.windowHeight,
      'joystick.x': joystickX,
      'joystick.y': joystickY,
      'joystick.knobX': joystickX,
      'joystick.knobY': joystickY,
      'currentLevel': levelNumber // Store the level number
    });

    this.setData({
      'player.x': app.globalData.playerInitialX,
      'player.y': app.globalData.playerInitialY,
      'enemy.x': app.globalData.enemyInitialX,
      'enemy.y': app.globalData.enemyInitialY,
      'key1.x': app.globalData.key1[0].x,
      'key1.y': app.globalData.key1[0].y,
      'key2.x': app.globalData.key2[0].x,
      'key2.y': app.globalData.key2[0].y,
      'exit.x': app.globalData.exitX,
      'exit.y': app.globalData.exitY,
      'quiz.keys[0].x': (app.globalData.key1[0].x + (KEY_WIDTH / 2)) / WALL_SIZE - 0.5,
      'quiz.keys[0].y': (app.globalData.key1[0].y + (KEY_HEIGHT / 2)) / WALL_SIZE - 0.5,
      'quiz.keys[1].x': (app.globalData.key2[0].x + (KEY_WIDTH / 2)) / WALL_SIZE - 0.5,
      'quiz.keys[1].y': (app.globalData.key2[0].y + (KEY_HEIGHT / 2)) / WALL_SIZE - 0.5
    });
    // Generate maze walls
    const walls = this.generateMazeWalls();
    this.setData({ walls });

    wx.setNavigationBarTitle({
        title: `Level ${options.level}`
    });
    
    // Start game loop
    this.gameLastTime = Date.now();
    this.keyLastTime = Date.now();
    this.keyAnimationTime = 0;
    this.gameLoop();
    
    // Initialize gameplay stats
    this.resetGameplayStats();

    // Initialize audio context
    this.failSound = wx.createInnerAudioContext();
    this.failSound.src = '/pages/game/sound/Failing a level.wav';

    this.keySound = wx.createInnerAudioContext();
    this.keySound.src = '/pages/game/sound/Getting an key.wav';
  },

  resetGameplayStats() {
    this.gameplayStats = {
      caughtByEnemy: false,
      startTime: null,  // Will be set when joystick is first touched
      endTime: null,
      quizAccuracy: [],
      timerStarted: false  // Add this flag
    };
  },

  generateMazeWalls() {
    // Define maze layout for level 3 (0 = path, 1 = wall)
    const grid = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1],
      [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,1,1,1,1,1,0,0,1,0,1,1,0,0,1,1],
      [1,1,1,1,1,1,1,0,0,1,0,1,1,0,0,1,1],
      [1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1],
      [1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1],
      [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    const exitX = this.data.exit.x / WALL_SIZE; // Exit position (middle)    // Convert to walls
    const walls = [];
    
    // Add outer walls except for exit
    walls.push(
      { x: 0, y: 0, width: GRID_WIDTH * WALL_SIZE, height: WALL_SIZE },  // Very top row
      { x: 0, y: WALL_SIZE, width: exitX * WALL_SIZE, height: WALL_SIZE },  // Top left
      { x: (exitX + 1) * WALL_SIZE, y: WALL_SIZE, width: (GRID_WIDTH - exitX - 1) * WALL_SIZE, height: WALL_SIZE },  // Top right
      { x: 0, y: 0, width: WALL_SIZE, height: (GRID_HEIGHT + 1) * WALL_SIZE },  // Left
      { x: 0, y: GRID_HEIGHT * WALL_SIZE, width: GRID_WIDTH * WALL_SIZE, height: WALL_SIZE },  // Bottom
      { x: (GRID_WIDTH - 1) * WALL_SIZE, y: 0, width: WALL_SIZE, height: (GRID_HEIGHT + 1) * WALL_SIZE }  // Right
    );

    // Add inner walls
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (grid[y][x] === 1) {
          walls.push({
            x: x * WALL_SIZE,
            y: y * WALL_SIZE,
            width: WALL_SIZE,
            height: WALL_SIZE
          });
        }
      }
    }

    // Set player start position and exit - note the exit is now one row lower
    this.setData({
      'exit.width': WALL_SIZE,
      'exit.height': WALL_SIZE
    });

    return walls;
  },

  findPathToPlayer() {
    const grid = this.getMazeGrid();
    const startX = Math.floor(this.data.enemy.x / WALL_SIZE);
    const startY = Math.floor(this.data.enemy.y / WALL_SIZE);
    const targetX = Math.floor(this.data.player.x / WALL_SIZE);
    const targetY = Math.floor(this.data.player.y / WALL_SIZE);

    const openSet = new Set();
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    const startKey = `${startX},${startY}`;
    openSet.add(startKey);
    gScore.set(startKey, 0);
    fScore.set(startKey, this.heuristic(startX, startY, targetX, targetY));

    while (openSet.size > 0) {
      let current = this.getLowestFScore(openSet, fScore);
      if (current === `${targetX},${targetY}`) {
        return this.reconstructPath(cameFrom, current);
      }

      openSet.delete(current);
      closedSet.add(current);

      const [x, y] = current.split(',').map(Number);
      const neighbors = [
        [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx < 0 || nx >= GRID_WIDTH || ny < 0 || ny >= GRID_HEIGHT) continue;
        if (grid[ny][nx] === 1) continue;

        const neighborKey = `${nx},${ny}`;
        if (closedSet.has(neighborKey)) continue;

        const tentativeGScore = gScore.get(current) + 1;
        if (!openSet.has(neighborKey)) {
          openSet.add(neighborKey);
        } else if (tentativeGScore >= gScore.get(neighborKey)) {
          continue;
        }

        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeGScore);
        fScore.set(neighborKey, tentativeGScore + this.heuristic(nx, ny, targetX, targetY));
      }
    }
    return null;
  },

  heuristic(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  },

  getLowestFScore(openSet, fScore) {
    let lowest = null;
    let lowestScore = Infinity;
    for (const key of openSet) {
      const score = fScore.get(key);
      if (score < lowestScore) {
        lowest = key;
        lowestScore = score;
      }
    }
    return lowest;
  },

  reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom.has(current)) {
      current = cameFrom.get(current);
      path.unshift(current);
    }
    return path;
  },

  updateEnemy(deltaTime) {
    // Only update position if enemy is active and not waiting for player move
    if (!this.data.enemy.isActive || this.data.enemy.waitingForPlayerMove) {
      return;
    }

    const path = this.findPathToPlayer();
    const playerGridX = Math.floor(this.data.player.x / WALL_SIZE);
    const playerGridY = Math.floor(this.data.player.y / WALL_SIZE);
    const enemyGridX = Math.floor(this.data.enemy.x / WALL_SIZE);
    const enemyGridY = Math.floor(this.data.enemy.y / WALL_SIZE);
    
    let newX = this.data.enemy.x;
    let newY = this.data.enemy.y;
    const moveAmount = ENEMY_SPEED * deltaTime * 60;

    // If enemy is in adjacent cell or same cell as player, move directly to player
    if (Math.abs(enemyGridX - playerGridX) <= 1 && Math.abs(enemyGridY - playerGridY) <= 1) {
      const dx = this.data.player.x - this.data.enemy.x;
      const dy = this.data.player.y - this.data.enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const moveX = (dx / distance) * moveAmount;
        const moveY = (dy / distance) * moveAmount;
        
        // Try moving in both X and Y
        if (this.isValidPosition(newX + moveX, newY + moveY, this.data.enemy.width, this.data.enemy.height1)) {
          newX += moveX;
          newY += moveY;
          // Update facing direction based on horizontal movement
          if (moveX !== 0) {
            this.setData({
              'enemy.facingLeft': moveX < 0
            });
          }
        }
        // If can't move diagonally, try moving horizontally
        else if (this.isValidPosition(newX + moveX, newY, this.data.enemy.width, this.data.enemy.height1)) {
          newX += moveX;
          // Update facing direction based on horizontal movement
          if (moveX !== 0) {
            this.setData({
              'enemy.facingLeft': moveX < 0
            });
          }
        }
        // Try moving vertically
        else if (this.isValidPosition(newX, newY + moveY, this.data.enemy.width, this.data.enemy.height1)) {
          newY += moveY;
        }
      }
    }
    // Otherwise use pathfinding to navigate through the maze
    else if (path && path.length > 1) {
      const [nextX, nextY] = path[1].split(',').map(Number);
      const targetX = nextX * WALL_SIZE + WALL_SIZE / 2;
      const targetY = nextY * WALL_SIZE + WALL_SIZE / 2;

      const dx = targetX - this.data.enemy.x;
      const dy = targetY - this.data.enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const moveX = (dx / distance) * moveAmount;
        const moveY = (dy / distance) * moveAmount;
        
        // Try moving in both X and Y
        if (this.isValidPosition(newX + moveX, newY + moveY, this.data.enemy.width, this.data.enemy.height1)) {
          newX += moveX;
          newY += moveY;
          // Update facing direction based on horizontal movement
          if (moveX !== 0) {
            this.setData({
              'enemy.facingLeft': moveX < 0
            });
          }
        }
        // If can't move diagonally, try moving horizontally
        else if (this.isValidPosition(newX + moveX, newY, this.data.enemy.width, this.data.enemy.height1)) {
          newX += moveX;
          // Update facing direction based on horizontal movement
          if (moveX !== 0) {
            this.setData({
              'enemy.facingLeft': moveX < 0
            });
          }
        }
        // Try moving vertically
        else if (this.isValidPosition(newX, newY + moveY, this.data.enemy.width, this.data.enemy.height1)) {
          newY += moveY;
        }
      }
    }

    // Update enemy position if it changed
    if (newX !== this.data.enemy.x || newY !== this.data.enemy.y) {
      this.setData({
        'enemy.x': newX,
        'enemy.y': newY
      });
    }

    // Check collision with player
    if (this.checkPlayerEnemyCollision()) {
      this.restartLevel();
    }
  },

  restartLevel() {
    // Reset player and enemy positions
    this.setData({
      'player.x': app.globalData.playerInitialX,
      'player.y': app.globalData.playerInitialY,
      'enemy.x': app.globalData.enemyInitialX,
      'enemy.y': app.globalData.enemyInitialY,
      'enemy.isActive': false,
      'enemy.waitingForPlayerMove': true
    });

    // Reset key collection states
    this.setData({
      'key1.collected': false,
      'key2.collected': false
    });

    // Reset quiz state
    this.setData({
      'quiz.currentKeyIndex': 0,
      'quiz.completed': false
    });
  },

  gameLoop() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.gameLastTime) / 1000;
    this.gameLastTime = currentTime;

    // Update tutorial hover animation
    if (this.data.tutorial.show) {
      this.tutorialAnimationTime += deltaTime;
      const hoverOffset = Math.sin(this.tutorialAnimationTime * 1.5) * 8;
      this.setData({
        'tutorial.hoverOffset': hoverOffset
      });
    }

    // Update enemy animation regardless of active state
    this.enemyAnimationTime += deltaTime;
    if (this.enemyAnimationTime >= 0.5) {
      this.enemyAnimationTime = 0;
      this.setData({
        'enemy.frame': this.data.enemy.frame === 0 ? 1 : 0
      });
    }

    if (this.data.joystick.touching) {
      const { moveX, moveY } = this.data.joystick;
      this.movePlayer(moveX, moveY, deltaTime);
    }

    this.updateEnemy(deltaTime);
    this.checkExitCollision();
    this.draw();
    
    if (!this.data.showComplete) {
      this.gameLoopId = setTimeout(() => this.gameLoop(), 1);
    }
  },

  movePlayer(dirX, dirY, deltaTime) {
    const { player, moveSpeed, walls, exit, key1, key2 } = this.data;
    const actualSpeed = moveSpeed * deltaTime * 60;

    // Calculate new position
    const newX = player.x + dirX * actualSpeed;
    const newY = player.y + dirY * actualSpeed;

    let canMoveX = true;
    let canMoveY = true;

    // Create test rectangles for collision checking
    const testPlayerX = {
      x: newX,
      y: player.y,
      width: player.width,
      height: player.height
    };

    const testPlayerY = {
      x: player.x,
      y: newY,
      width: player.width,
      height: player.height
    };

    // Check exit collision if not all keys are collected
    if (!(key1.collected && key2.collected)) {
      if (this.checkCollision(testPlayerX, exit)) {
        canMoveX = false;
        // If moving right, adjust to exit's left edge
        if (dirX > 0) {
          this.setData({
            'player.x': exit.x - player.width/2
          });
        }
        // If moving left, adjust to exit's right edge
        else if (dirX < 0) {
          this.setData({
            'player.x': exit.x + exit.width + player.width/2
          });
        }
      }
      if (this.checkCollision(testPlayerY, exit)) {
        canMoveY = false;
        // If moving down, adjust to exit's top edge
        if (dirY > 0) {
          this.setData({
            'player.y': exit.y - player.height/2
          });
        }
        // If moving up, adjust to exit's bottom edge
        else if (dirY < 0) {
          this.setData({
            'player.y': exit.y + exit.height + player.height/2
          });
        }
      }
    }

    // Check collisions with all walls
    for (const wall of walls) {
      // Check X movement collision
      if (this.checkCollision(testPlayerX, wall)) {
        canMoveX = false;
        // If moving right, adjust to wall's left edge
        if (dirX > 0) {
          this.setData({
            'player.x': wall.x - player.width/2
          });
        }
        // If moving left, adjust to wall's right edge
        else if (dirX < 0) {
          this.setData({
            'player.x': wall.x + wall.width + player.width/2
          });
        }
      }

      // Check Y movement collision
      if (this.checkCollision(testPlayerY, wall)) {
        canMoveY = false;
        // If moving down, adjust to wall's top edge
        if (dirY > 0) {
          this.setData({
            'player.y': wall.y - player.height/2
          });
        }
        // If moving up, adjust to wall's bottom edge
        else if (dirY < 0) {
          this.setData({
            'player.y': wall.y + wall.height + player.height/2
          });
        }
      }
    }

    // Apply movement if no collisions
    if (canMoveX) {
      this.setData({
        'player.x': newX
      });
    }
    if (canMoveY) {
      this.setData({
        'player.y': newY
      });
    }

    // Check all key collections with visual bounds
    const checkKeyCollection = (key, keyName, index) => {
      if (!key.collected) {
        const playerRect = {
          left: this.data.player.x - this.data.player.visualWidth/2,
          right: this.data.player.x + this.data.player.visualWidth/2,
          top: this.data.player.y - this.data.player.visualHeight/2,
          bottom: this.data.player.y + this.data.player.visualHeight/2
        };
        
        const keyRect = {
          left: key.x,
          right: key.x + key.width,
          top: key.y,
          bottom: key.y + key.height
        };
        
        if (!(playerRect.left > keyRect.right || 
              playerRect.right < keyRect.left || 
              playerRect.top > keyRect.bottom ||
              playerRect.bottom < keyRect.top)) {
          const currentTime = Date.now();
          const timeTaken = (currentTime - this.gameplayStats.startTime) / 1000;
          
          // Update key collection times
          const keyCollectionTimes = [...this.data.keyCollectionTimes];
          keyCollectionTimes[index] = timeTaken;
          
          this.setData({
            [`${keyName}.collected`]: true,
            keyCollectionTimes
          });
          this.keySound.play();
        }
      }
    };

    checkKeyCollection(this.data.key1, 'key1', 0);
    checkKeyCollection(this.data.key2, 'key2', 1);

    // Check exit collision - only complete if key is collected
    if (newY < WALL_SIZE*2 && this.data.key1.collected && this.data.key2.collected) {
      this.levelComplete();
    }

    // Update player direction based on movement
    if (dirX !== 0) {
      this.setData({
        'player.facingLeft': dirX < 0
      });
    }

    // Calculate movement magnitude
    const movementMagnitude = Math.sqrt(dirX * dirX + dirY * dirY);
    
    // Update isMoving state
    this.setData({
        'player.isMoving': movementMagnitude > 0
    });

    // Update animation time based on movement speed
    if (this.data.player.isMoving) {
        const baseAnimationSpeed = 0.25; // Base time for one animation cycle
        const speedFactor = movementMagnitude; // Movement affects animation speed
        this.data.player.animationTime += deltaTime * speedFactor;
        
        // Update animation frame
        const totalFrames = 4;
        const newFrame = Math.floor((this.data.player.animationTime / baseAnimationSpeed) % totalFrames);
        
        if (newFrame !== this.data.player.animationFrame) {
            this.setData({
                'player.animationFrame': newFrame
            });
        }
    }
  },

  touchStart(e) {
    // Start timer on first touch if not already started
    if (!this.gameplayStats.timerStarted) {
      this.gameplayStats.startTime = Date.now();
      this.gameplayStats.timerStarted = true;
    }

    // Set enemy to active when player starts moving
    if (this.data.enemy.waitingForPlayerMove) {
      this.setData({
        'enemy.waitingForPlayerMove': false,
        'enemy.isActive': true
      });
    }

    const touch = e.touches[0];
    const { x, y, baseRadius } = this.data.joystick;
    
    // Check if touch is within joystick area
    const dx = touch.clientX - x;
    const dy = touch.clientY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= baseRadius) {
      this.setData({
        'joystick.touching': true,
        'joystick.knobX': touch.clientX,
        'joystick.knobY': touch.clientY
      });
    }

    // Hide tutorial on first joystick interaction
    if (this.data.tutorial.show) {
      this.setData({
        'tutorial.show': false
      });
    }

    // Activate enemy on first joystick interaction
    if (!this.data.enemy.isActive) {
      this.setData({
        'enemy.isActive': true
      });
    }
  },

  touchMove(e) {
    if (!this.data.joystick.touching) return;
    
    const touch = e.touches[0];
    const { x, y, baseRadius } = this.data.joystick;
    
    // Calculate distance from center
    const dx = touch.clientX - x;
    const dy = touch.clientY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Limit knob position to base radius
    let knobX = x;
    let knobY = y;
    let moveX = 0;
    let moveY = 0;
    
    if (distance > 0) {
      const limitedDistance = Math.min(distance, baseRadius);
      const scale = limitedDistance / distance;
      
      // Calculate knob position
      knobX = x + dx * scale;
      knobY = y + dy * scale;
      
      // Calculate normalized movement values (-1 to 1)
      moveX = (dx * scale) / baseRadius;
      moveY = (dy * scale) / baseRadius;
    }
    
    this.setData({
      'joystick.knobX': knobX,
      'joystick.knobY': knobY,
      'joystick.moveX': moveX,
      'joystick.moveY': moveY
    });
  },

  touchEnd() {
    const { x, y } = this.data.joystick;
    this.setData({
      'joystick.touching': false,
      'joystick.knobX': x,
      'joystick.knobY': y,
      'joystick.moveX': 0,
      'joystick.moveY': 0
    });

    this.setData({
        'player.isMoving': false,
        'player.animationFrame': 0,
        'player.animationTime': 0
    });
  },

  checkCollision(player, wall) {
    // Get the corners of the player rectangle
    const playerLeft = player.x - player.width/2;
    const playerRight = player.x + player.width/2;
    const playerTop = player.y - player.height/2;
    const playerBottom = player.y + player.height/2;

    // Get the edges of the wall
    const wallLeft = wall.x;
    const wallRight = wall.x + wall.width;
    const wallTop = wall.y;
    const wallBottom = wall.y + wall.height;

    // Check for intersection between the rectangles
    return !(
      playerLeft >= wallRight ||    // player is to the right of the wall
      playerRight <= wallLeft ||    // player is to the left of the wall
      playerTop >= wallBottom ||    // player is below the wall
      playerBottom <= wallTop       // player is above the wall
    );
  },

  onReady() {
    const query = wx.createSelectorQuery();
    query.select('#mazeCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = this.data.canvasWidth * dpr;
        canvas.height = this.data.canvasHeight * dpr;
        ctx.scale(dpr, dpr);
        
        this.ctx = ctx;

        // one side wall textures
        const leftWallImage = canvas.createImage();
        leftWallImage.onload = () => {
          this.leftWallTexture = leftWallImage;
        };
        leftWallImage.src = LEFT_WALL_IMAGE_PATH;
        
        const rightWallImage = canvas.createImage();
        rightWallImage.onload = () => {
          this.rightWallTexture = rightWallImage;
        };
        rightWallImage.src = RIGHT_WALL_IMAGE_PATH;

        const topWallImage = canvas.createImage();
        topWallImage.onload = () => {
          this.topWallTexture = topWallImage;
        };
        topWallImage.src = TOP_WALL_IMAGE_PATH;

        const bottomWallImage = canvas.createImage();
        bottomWallImage.onload = () => {
          this.bottomWallTexture = bottomWallImage;
        };
        bottomWallImage.src = BOTTOM_WALL_IMAGE_PATH;


        // Two side wall textures
        const bottomLeftImage = canvas.createImage();
        bottomLeftImage.onload = () => {
          this.bottomLeftWallTexture = bottomLeftImage;
        };
        bottomLeftImage.src = BOTTOMLEFT_WALL_IMAGE_PATH;
        
        const topLeftWallImage = canvas.createImage();
        topLeftWallImage.onload = () => {
          this.topLeftWallTexture = topLeftWallImage;
        };
        topLeftWallImage.src = TOPLEFT_WALL_IMAGE_PATH;

        const bottomRightImage = canvas.createImage();
        bottomRightImage.onload = () => {
          this.bottomRightWallTexture = bottomRightImage;
        };
        bottomRightImage.src = BOTTOMRIGHT_WALL_IMAGE_PATH;

        const topRightWallImage = canvas.createImage();
        topRightWallImage.onload = () => {
          this.topRightWallTexture = topRightWallImage;
        };
        topRightWallImage.src = TOPRIGHT_WALL_IMAGE_PATH;

        const bottomTopWallImage = canvas.createImage();
        bottomTopWallImage.onload = () => {
          this.bottomTopTexture = bottomTopWallImage;
        };
        bottomTopWallImage.src = BOTTOMTOP_WALL_IMAGE_PATH;

        const leftRightWallImage = canvas.createImage();
        leftRightWallImage.onload = () => {
          this.leftRightTexture = leftRightWallImage;
        };
        leftRightWallImage.src = LEFTRIGHT_WALL_IMAGE_PATH;


        // Three side wall textures
        const topRightBottomWallImage = canvas.createImage();
        topRightBottomWallImage.onload = () => {
          this.topRightBottomTexture = topRightBottomWallImage;
        };
        topRightBottomWallImage.src = TOPRIGHTBOTTOM_WALL_IMAGE_PATH;

        const topLeftBottomWallImage = canvas.createImage();
        topLeftBottomWallImage.onload = () => {
          this.topLeftBottomTexture = topLeftBottomWallImage;
        };
        topLeftBottomWallImage.src = TOPLEFTBOTTOM_WALL_IMAGE_PATH;

        const leftBottomRightWallImage = canvas.createImage();
        leftBottomRightWallImage.onload = () => {
          this.leftBottomRightTexture = leftBottomRightWallImage;
        };
        leftBottomRightWallImage.src = LEFTBOTTOMRIGHT_WALL_IMAGE_PATH;

        const leftTopRightWallImage = canvas.createImage();
        leftTopRightWallImage.onload = () => {
          this.leftTopRightTexture = leftTopRightWallImage;
        };
        leftTopRightWallImage.src = LEFTTOPRIGHT_WALL_IMAGE_PATH;

        // Other textures
        const playerImage = canvas.createImage();
        playerImage.onload = () => {
          this.playerTexture = playerImage;
        };
        playerImage.src = PLAYER_AVATAR_PATH;

        // Load all player avatar frames
        const playerImage1 = canvas.createImage();
        playerImage1.onload = () => {
            this.playerTexture1 = playerImage1;
        };
        playerImage1.src = PLAYER_AVATAR_PATH_1;

        const playerImage2 = canvas.createImage();
        playerImage2.onload = () => {
            this.playerTexture2 = playerImage2;
        };
        playerImage2.src = PLAYER_AVATAR_PATH_2;

        const playerImage3 = canvas.createImage();
        playerImage3.onload = () => {
            this.playerTexture3 = playerImage3;
        };
        playerImage3.src = PLAYER_AVATAR_PATH_3;

        const playerImage4 = canvas.createImage();
        playerImage4.onload = () => {
            this.playerTexture4 = playerImage4;
        };
        playerImage4.src = PLAYER_AVATAR_PATH_4;

        // Add the new avatar frame
        const playerImage5 = canvas.createImage();
        playerImage5.onload = () => {
            this.playerTexture5 = playerImage5;
        };
        playerImage5.src = PLAYER_AVATAR_PATH_5;

        // Load both enemy textures
        const enemyImage = canvas.createImage();
        enemyImage.src = ENEMY_IMAGE_PATH;
        enemyImage.onload = () => {
          this.enemyTexture = enemyImage;
        };

        const enemyImage2 = canvas.createImage();
        enemyImage2.src = ENEMY_IMAGE_PATH_2;
        enemyImage2.onload = () => {
          this.enemyTexture2 = enemyImage2;
        };
        
        const edgeImage = canvas.createImage();
        edgeImage.onload = () => {
          this.edgeTexture = edgeImage;
        };
        edgeImage.src = EDGE_IMAGE_PATH;

        const wallTopImage = canvas.createImage();
        wallTopImage.onload = () => {
          this.wallTopTexture = wallTopImage;
        };
        wallTopImage.src = WALLTOP_IMAGE_PATH;

        const exitImage = canvas.createImage();
        exitImage.onload = () => {
          this.exitTexture = exitImage;
        };
        exitImage.src = EXIT_IMAGE_PATH;

        const groundImage = canvas.createImage();
        groundImage.onload = () => {
          this.groundTexture = groundImage;
        };
        groundImage.src = GROUND_IMAGE_PATH;

        // Load key textures
        const key1Image = canvas.createImage();
        key1Image.src = KEY1_IMAGE_PATH;
        key1Image.onload = () => {
          this.key1Texture = key1Image;
        };
        
        const key2Image = canvas.createImage();
        key2Image.src = KEY2_IMAGE_PATH;
        key2Image.onload = () => {
          this.key2Texture = key2Image;
        };

        const key3Image = canvas.createImage();
        key3Image.src = KEY3_IMAGE_PATH;
        key3Image.onload = () => {
          this.key3Texture = key3Image;
        };

        const key4Image = canvas.createImage();
        key4Image.src = KEY4_IMAGE_PATH;
        key4Image.onload = () => {
          this.key4Texture = key4Image;
        };
      });

    // Start key animation
    this.keyAnimationTime = 0;
    this.lastTime = Date.now();

    // Start enemy animation
    this.enemyAnimationTime = 0;

    // Start tutorial hover animation
    this.tutorialAnimationTime = 0;
  },

  draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    
    ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    
    const zoomX = 2;
    const zoomY = 2;
    const cameraX = this.data.player.x - (this.data.canvasWidth / zoomX / 2);
    const cameraY = this.data.player.y - (this.data.canvasHeight / zoomY / 2);
    
    // Fill entire canvas with white first
    ctx.fillStyle = '#141313';
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);

    // Layer 1: Ground texture (add this before walls)
    ctx.save();
    ctx.scale(zoomX, zoomY);
    
    // Draw ground texture for all floor tiles
    if (this.groundTexture) {
      const grid = this.getMazeGrid();
      for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          if (grid[y][x] === 0) {  // If it's a floor tile
            ctx.drawImage(
              this.groundTexture,
              x * WALL_SIZE - cameraX,
              y * WALL_SIZE - cameraY,
              WALL_SIZE,
              WALL_SIZE
            );
          }
        }
      }
    }
    ctx.restore();

    // Layer 2: Exit door
    ctx.save();
    ctx.scale(zoomX, zoomY);
    if (this.exitTexture) {
      ctx.drawImage(
        this.exitTexture,
        this.data.exit.x - cameraX,
        this.data.exit.y - cameraY,
        this.data.exit.width,
        this.data.exit.height
      );
    } else {
      // Fallback to pink color if texture isn't loaded yet
      ctx.fillStyle = '#C24E78';
      ctx.fillRect(
        this.data.exit.x - cameraX,
        this.data.exit.y - cameraY,
        this.data.exit.width,
        this.data.exit.height
      );
    }
    ctx.restore();

    // Layer 3: Player and enemy's bottom half
    ctx.save();
    ctx.scale(zoomX, zoomY);
    if (this.playerTexture1 && this.playerTexture2 && this.playerTexture3 && this.playerTexture4 && this.playerTexture5) {
        const imageHeight = this.data.player.height * 15;
        
        // Select the current texture based on animation frame
        let currentTexture;
        if (!this.data.player.isMoving) {
            currentTexture = this.playerTexture5;
        } else {
            switch(this.data.player.animationFrame) {
                case 0:
                    currentTexture = this.playerTexture1;
                    break;
                case 1:
                    currentTexture = this.playerTexture2;
                    break;
                case 2:
                    currentTexture = this.playerTexture3;
                    break;
                case 3:
                    currentTexture = this.playerTexture4;
                    break;
                default:
                    currentTexture = this.playerTexture1;
            }
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(
            this.data.player.x - this.data.player.width/2 - cameraX,
            this.data.player.y - cameraY,
            this.data.player.width,
            imageHeight/2
        );
        ctx.clip();
        
        // Add horizontal flip for player
        if (this.data.player.facingLeft) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                currentTexture,
                -(this.data.player.x + this.data.player.width/2 - cameraX),
                this.data.player.y - imageHeight/2 - cameraY,
                this.data.player.width,
                imageHeight
            );
        } else {
            ctx.drawImage(
                currentTexture,
                this.data.player.x - this.data.player.width/2 - cameraX,
                this.data.player.y - imageHeight/2 - cameraY,
                this.data.player.width,
                imageHeight
            );
        }
        ctx.restore();
    }

    if (this.enemyTexture) {
      const baseHeight = this.data.enemy.height1 * 15;
      const totalHeight = (this.data.enemy.frame === 0 ? this.data.enemy.height1 : this.data.enemy.height2) * 15;
      
      ctx.save();
      ctx.beginPath();
      ctx.rect(
        this.data.enemy.x - this.data.enemy.width/2 - cameraX,
        this.data.enemy.y - cameraY,
        this.data.enemy.width,
        baseHeight/2
      );
      ctx.clip();
      
      // Add horizontal flip for enemy
      if (this.data.enemy.facingLeft) {
        ctx.drawImage(
          this.data.enemy.frame === 0 ? this.enemyTexture : this.enemyTexture2,
          this.data.enemy.x - this.data.enemy.width/2 - cameraX,
          this.data.enemy.y - baseHeight/2 - cameraY,
          this.data.enemy.width,
          baseHeight
        );
      } else {
        ctx.scale(-1, 1);
        ctx.drawImage(
          this.data.enemy.frame === 0 ? this.enemyTexture : this.enemyTexture2,
          -(this.data.enemy.x + this.data.enemy.width/2 - cameraX),
          this.data.enemy.y - baseHeight/2 - cameraY,
          this.data.enemy.width,
          baseHeight
        );
      }
      ctx.restore();
    }

    ctx.restore();

    // Layer 4: Walls
    ctx.save();
    ctx.scale(zoomX, zoomY);
    this.data.walls.forEach(wall => {
      // Skip walls outside the grid bounds
      if (wall.x < 0 || wall.x >= WALL_SIZE * GRID_WIDTH || 
          wall.y < 0 || wall.y >= WALL_SIZE * GRID_HEIGHT) {
        return;
      }

      const wallX = wall.x - cameraX;
      const wallY = wall.y - cameraY;

      // Get grid coordinates
      const gridX = Math.floor(wall.x / WALL_SIZE);
      const gridY = Math.floor(wall.y / WALL_SIZE);

      // Check if this is the block above the exit
      if (gridX === 12 && gridY === 0) {  // Exit is at x=8, y=1, so this is the block above it
        if (this.bottomWallTexture) {
          ctx.drawImage(
            this.bottomWallTexture,
            0, 0,
            this.bottomWallTexture.width, this.bottomWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        }
        return;  // Skip other texture checks
      }

      // Check if this is an outer wall
      if (gridX === 0 || gridX === GRID_WIDTH - 1 || 
          gridY === 0 || gridY === GRID_HEIGHT - 1) {
        // Draw walltop texture for outer walls
        if (this.wallTopTexture) {
          ctx.drawImage(
            this.wallTopTexture,
            0, 0,
            this.wallTopTexture.width, this.wallTopTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        }
        return;
      }

      // Rest of the existing wall texture logic for inner walls
      const hasPathLeft = !this.data.walls.some(otherWall => 
        otherWall.x === wall.x - WALL_SIZE && 
        otherWall.y === wall.y
      );
      const hasPathRight = !this.data.walls.some(otherWall => 
        otherWall.x === wall.x + WALL_SIZE && 
        otherWall.y === wall.y
      );
      const hasPathTop = !this.data.walls.some(otherWall => 
        otherWall.x === wall.x && 
        otherWall.y === wall.y - WALL_SIZE
      );
      const hasPathBottom = !this.data.walls.some(otherWall => 
        otherWall.x === wall.x && 
        otherWall.y === wall.y + WALL_SIZE
      );
      
      // Special case for second bottommost row
      if (gridY === GRID_HEIGHT - 2) {
        if (hasPathTop && this.topWallTexture) {
          ctx.drawImage(
              this.topWallTexture,
              0, 0,
              this.topWallTexture.width, this.topWallTexture.height,
              wallX, wallY,
              wall.width, wall.height
          );
          return;  // Add this return statement to prevent further texture checks
        } else if (this.wallTopTexture) {
          // Fallback to wallTopTexture for second bottommost row
          ctx.drawImage(
              this.wallTopTexture,
              0, 0,
              this.wallTopTexture.width, this.wallTopTexture.height,
              wallX, wallY,
              wall.width, wall.height
          );
          return;
        }
      }

      if (hasPathBottom && this.edgeTexture) {
        // Draw edge texture directly without shadows
        ctx.drawImage(
          this.edgeTexture,
          0, 0,
          this.edgeTexture.width, this.edgeTexture.height,
          wallX, wallY,
          wall.width, wall.height
        );
      } else {
        // Draw regular wall textures based on neighbors
        // Check if block below shows edge_egypt.jpg
        const blockBelowHasEdgeTexture = this.data.walls.some(otherWall => 
          otherWall.x === wall.x && 
          otherWall.y === wall.y + WALL_SIZE && 
          !this.data.walls.some(w => 
            w.x === otherWall.x && 
            w.y === otherWall.y + WALL_SIZE
          )
        );

        // Check if block to the left and right shows edge_egypt.jpg
        const blockLeftHasEdgeTexture = this.data.walls.some(otherWall => 
          otherWall.x === wall.x - WALL_SIZE && 
          otherWall.y === wall.y && 
          !this.data.walls.some(w => 
            w.x === otherWall.x && 
            w.y === otherWall.y + WALL_SIZE
          )
        );

        const blockRightHasEdgeTexture = this.data.walls.some(otherWall => 
          otherWall.x === wall.x + WALL_SIZE && 
          otherWall.y === wall.y && 
          !this.data.walls.some(w => 
            w.x === otherWall.x && 
            w.y === otherWall.y + WALL_SIZE
          )
        );


        // Overriding textures logic
        if (blockLeftHasEdgeTexture && blockRightHasEdgeTexture && blockBelowHasEdgeTexture && this.leftBottomRightTexture) {
          ctx.drawImage(
            this.leftBottomRightTexture,
            0, 0,
            this.leftBottomRightTexture.width, this.leftBottomRightTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathLeft && blockRightHasEdgeTexture && blockBelowHasEdgeTexture && this.leftBottomRightTexture) {
          ctx.drawImage(
            this.leftBottomRightTexture,
            0, 0,
            this.leftBottomRightTexture.width, this.leftBottomRightTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathLeft && blockLeftHasEdgeTexture && blockBelowHasEdgeTexture && this.leftBottomRightTexture) {
          ctx.drawImage(
            this.leftBottomRightTexture,
            0, 0,
            this.leftBottomRightTexture.width, this.leftBottomRightTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathLeft && hasPathTop && blockBelowHasEdgeTexture && this.topLeftBottomTexture) {
          ctx.drawImage(
            this.topLeftBottomTexture,
            0, 0,
            this.topLeftBottomTexture.width, this.topLeftBottomTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathRight && hasPathTop && blockBelowHasEdgeTexture && this.topRightBottomTexture) {
          ctx.drawImage(
            this.topRightBottomTexture,
            0, 0,
            this.topRightBottomTexture.width, this.topRightBottomTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (blockRightHasEdgeTexture && blockBelowHasEdgeTexture && this.bottomRightWallTexture) {
          ctx.drawImage(
            this.bottomRightWallTexture,
            0, 0,
            this.bottomRightWallTexture.width, this.bottomRightWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (blockLeftHasEdgeTexture && blockBelowHasEdgeTexture && this.bottomLeftWallTexture) {
          ctx.drawImage(
            this.bottomLeftWallTexture,
            0, 0,
            this.bottomLeftWallTexture.width, this.bottomLeftWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );

        } else if (hasPathLeft && blockBelowHasEdgeTexture && this.bottomLeftWallTexture) {
          ctx.drawImage(
            this.bottomLeftWallTexture,
            0, 0,
            this.bottomLeftWallTexture.width, this.bottomLeftWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathRight && blockBelowHasEdgeTexture && this.bottomRightWallTexture) {
          ctx.drawImage(
            this.bottomRightWallTexture,
            0, 0,
            this.bottomRightWallTexture.width, this.bottomRightWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );

        } else if (blockBelowHasEdgeTexture && hasPathTop && this.bottomTopTexture) {
          ctx.drawImage(
            this.bottomTopTexture,
            0, 0,
            this.bottomTopTexture.width, this.bottomTopTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (blockLeftHasEdgeTexture && hasPathRight && this.leftRightTexture) {
          ctx.drawImage(
            this.leftRightTexture,
            0, 0,
            this.leftRightTexture.width, this.leftRightTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (blockRightHasEdgeTexture && hasPathLeft && this.leftRightTexture) {
          ctx.drawImage(
            this.leftRightTexture,
            0, 0,
            this.leftRightTexture.width, this.leftRightTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        
        } else if (blockLeftHasEdgeTexture && hasPathTop && this.leftTopTexture) {
          ctx.drawImage(
            this.leftTopTexture,
            0, 0,
            this.leftTopTexture.width, this.leftTopTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (blockRightHasEdgeTexture && hasPathTop && this.rightTopTexture) {
          ctx.drawImage(
            this.rightTopTexture,
            0, 0,
            this.rightTopTexture.width, this.rightTopTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (blockBelowHasEdgeTexture && this.bottomWallTexture) {
          ctx.drawImage(
            this.bottomWallTexture,
            0, 0,
            this.bottomWallTexture.width, this.bottomWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (blockRightHasEdgeTexture && this.rightWallTexture) {
          ctx.drawImage(
            this.rightWallTexture,
            0, 0,
            this.rightWallTexture.width, this.rightWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (blockLeftHasEdgeTexture && this.leftWallTexture) {
          ctx.drawImage(
            this.leftWallTexture,
            0, 0,
            this.leftWallTexture.width, this.leftWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );


    // Three-side wall textures logic
        } else if (hasPathRight && hasPathTop && blockBelowHasEdgeTexture && this.topRightBottomTexture) {
          ctx.drawImage(
            this.topRightBottomTexture,
            0, 0,
            this.topRightBottomTexture.width, this.topRightBottomTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathLeft && hasPathTop && hasPathBottom && this.topLeftBottomTexture) {
          ctx.drawImage(
            this.topLeftBottomTexture,
            0, 0,
            this.topLeftBottomTexture.width, this.topLeftBottomTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathLeft && hasPathBottom && hasPathRight && this.leftBottomRightTexture) {
            ctx.drawImage(
              this.leftBottomRightTexture,
              0, 0,
              this.leftBottomRightTexture.width, this.leftBottomRightTexture.height,
              wallX, wallY,
              wall.width, wall.height
            );
        } else if (hasPathLeft && hasPathTop && hasPathRight && this.leftTopRightTexture) {
          ctx.drawImage(
            this.leftTopRightTexture,
            0, 0,
            this.leftTopRightTexture.width, this.leftTopRightTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );

        // Two-side wall textures logic
        } else if (hasPathTop && hasPathRight && this.topRightWallTexture) {
          ctx.drawImage(
            this.topRightWallTexture,
            0, 0,
            this.topRightWallTexture.width, this.topRightWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathTop && hasPathLeft && this.topLeftWallTexture) {
          ctx.drawImage(
            this.topLeftWallTexture,
            0, 0,
            this.topLeftWallTexture.width, this.topLeftWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathBottom && hasPathRight && this.bottomRightWallTexture) {
          ctx.drawImage(
            this.bottomRightWallTexture,
            0, 0,
            this.bottomRightWallTexture.width, this.bottomRightWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathBottom && hasPathLeft && this.bottomLeftWallTexture) {
          ctx.drawImage(
            this.bottomLeftWallTexture,
            0, 0,
            this.bottomLeftWallTexture.width, this.bottomLeftWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );

        } else if (hasPathTop && blockBelowHasEdgeTexture && this.bottomTopTexture) {
          ctx.drawImage(
            this.bottomTopTexture,
            0, 0,
            this.bottomTopTexture.width, this.bottomTopTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathLeft && hasPathRight && this.leftRightTexture) {
          ctx.drawImage(
            this.leftRightTexture,
            0, 0,
            this.leftRightTexture.width, this.leftRightTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        
        // One-side wall textures logic    
        } else if (hasPathTop && this.topWallTexture) {
          ctx.drawImage(
            this.topWallTexture,
            0, 0,
            this.topWallTexture.width, this.topWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathBottom && this.bottomWallTexture) {
          ctx.drawImage(
            this.bottomWallTexture,
            0, 0,
            this.bottomWallTexture.width, this.bottomWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathLeft && this.leftWallTexture) {
          ctx.drawImage(
            this.leftWallTexture,
            0, 0,
            this.leftWallTexture.width, this.leftWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathRight && this.rightWallTexture) {
          ctx.drawImage(
            this.rightWallTexture,
            0, 0,
            this.rightWallTexture.width, this.rightWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        
        // Block face textures logic
        } else if (this.wallTopTexture) {
          ctx.drawImage(
            this.wallTopTexture,
            0, 0,
            this.wallTopTexture.width, this.wallTopTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        }
      }
    });
    ctx.restore();

    // Layer 5: Player and enemy's top half
    if (this.playerTexture1 && this.playerTexture2 && this.playerTexture3 && this.playerTexture4 && this.playerTexture5) {
        const imageHeight = this.data.player.height * 15;
        
        // Select the current texture based on animation frame
        let currentTexture;
        if (!this.data.player.isMoving) {
            currentTexture = this.playerTexture5;
        } else {
            switch(this.data.player.animationFrame) {
                case 0:
                    currentTexture = this.playerTexture1;
                    break;
                case 1:
                    currentTexture = this.playerTexture2;
                    break;
                case 2:
                    currentTexture = this.playerTexture3;
                    break;
                case 3:
                    currentTexture = this.playerTexture4;
                    break;
                default:
                    currentTexture = this.playerTexture1;
            }
        }

        ctx.save();
        ctx.scale(zoomX, zoomY);
        ctx.save();
        ctx.beginPath();
        ctx.rect(
            this.data.player.x - this.data.player.width/2 - cameraX,
            this.data.player.y - imageHeight/2 - cameraY,  // Changed this line
            this.data.player.width,
            imageHeight/2
        );
        ctx.clip();
        
        // Add horizontal flip for player
        if (this.data.player.facingLeft) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                currentTexture,
                -(this.data.player.x + this.data.player.width/2 - cameraX),
                this.data.player.y - imageHeight/2 - cameraY,
                this.data.player.width,
                imageHeight
            );
        } else {
            ctx.drawImage(
                currentTexture,
                this.data.player.x - this.data.player.width/2 - cameraX,
                this.data.player.y - imageHeight/2 - cameraY,
                this.data.player.width,
                imageHeight
            );
        }
        ctx.restore();
        ctx.restore();
    }

    if (this.enemyTexture) {
      ctx.save();
      ctx.scale(zoomX, zoomY);
      const baseHeight = this.data.enemy.height1 * 15;
      const totalHeight = (this.data.enemy.frame === 0 ? this.data.enemy.height1 : this.data.enemy.height2) * 15;
      const heightDiff = totalHeight - baseHeight;

      ctx.save();
      ctx.beginPath();
      ctx.rect(
        this.data.enemy.x - this.data.enemy.width/2 - cameraX,
        this.data.enemy.y - totalHeight/2 - cameraY,  // Top half starts higher for taller pose
        this.data.enemy.width,
        totalHeight/2  // Top half can be taller
      );
      ctx.clip();
      
      // Add horizontal flip for enemy
      if (this.data.enemy.facingLeft) {
        ctx.drawImage(
          this.data.enemy.frame === 0 ? this.enemyTexture : this.enemyTexture2,
          this.data.enemy.x - this.data.enemy.width/2 - cameraX,
          this.data.enemy.y - totalHeight/2 - cameraY,  // Image starts higher for taller pose
          this.data.enemy.width,
          totalHeight
        );
      } else {
        ctx.scale(-1, 1);
        ctx.drawImage(
          this.data.enemy.frame === 0 ? this.enemyTexture : this.enemyTexture2,
          -(this.data.enemy.x + this.data.enemy.width/2 - cameraX),
          this.data.enemy.y - totalHeight/2 - cameraY,  // Image starts higher for taller pose
          this.data.enemy.width,
          totalHeight
        );
      }
      ctx.restore();
      ctx.restore();
    }

    // Layer 6: UI elements (joystick, key)
    // Draw joystick
    const { x, y, knobX, knobY, baseRadius, knobRadius } = this.data.joystick;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(128, 128, 128, 0.3)';
    ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.fillStyle = 'rgba(128, 128, 128, 0.6)';
    ctx.arc(knobX, knobY, knobRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw floating key if not collected
    if (!this.data.key1.collected) {
      ctx.save();
      ctx.scale(zoomX, zoomY);
      
      // Update floating animation
      const currentTime = Date.now();
      const deltaTime = (currentTime - this.keyLastTime) / 1000;
      this.keyAnimationTime += deltaTime;
      this.keyLastTime = currentTime;
      
      // Calculate floating offset using sine wave
      const floatOffset = Math.sin(this.keyAnimationTime * 3) * 5; // Increased amplitude and speed
      
      if (this.key1Texture) {
        ctx.drawImage(
          this.key1Texture,
          this.data.key1.x - cameraX,
          this.data.key1.y - cameraY + floatOffset,
          this.data.key1.width,
          this.data.key1.height
        );
      } else {
        // Fallback if texture not loaded
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(
          this.data.key1.x - cameraX,
          this.data.key1.y - cameraY + floatOffset,
          this.data.key1.width,
          this.data.key1.height
        );
      }
      ctx.restore();
    }

    // Draw tutorial text and arrow if showing
    if (this.data.tutorial.show) {
      const textY = y - 140 + this.data.tutorial.hoverOffset;  // Moved up from -120 to -140
      const arrowY = y - 100 + this.data.tutorial.hoverOffset;  // Moved up from -80 to -100
      
      // Draw text with larger, bolder font
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('Try moving the joystick', x, textY);
      
      // Draw arrow
      ctx.beginPath();
      ctx.moveTo(x, arrowY);
      ctx.lineTo(x - 10, arrowY - 10);
      ctx.lineTo(x + 10, arrowY - 10);
      ctx.closePath();
      ctx.fillStyle = 'white';
      ctx.fill();
    }

    // Draw key reminder text if needed
    if (this.data.showKeyReminder) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, this.data.canvasHeight/2 - 40, this.data.canvasWidth, 80);
      
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Collect the keys first!', this.data.canvasWidth/2, this.data.canvasHeight/2);
      ctx.restore();
    }

    // Draw all keys if not collected
    const drawKey = (key, texture, index) => {
      if (!key.collected) {
        ctx.save();
        ctx.scale(zoomX, zoomY);
        
        // Calculate floating offset using sine wave with phase shift
        const floatOffset = Math.sin(this.keyAnimationTime * 3 + index * Math.PI/2) * 5;
        
        if (texture) {
          // Get the original image dimensions
          const imgWidth = texture.width;
          const imgHeight = texture.height;
          
          // Calculate scale to maintain aspect ratio while fitting in KEY_WIDTH x KEY_HEIGHT box
          const scale = Math.min(KEY_WIDTH / imgWidth, KEY_HEIGHT / imgHeight);
          const finalWidth = imgWidth * scale;
          const finalHeight = imgHeight * scale;
          
          // Center the image in the key's bounding box
          const offsetX = (KEY_WIDTH - finalWidth) / 2;
          const offsetY = (KEY_HEIGHT - finalHeight) / 2;
          
          ctx.drawImage(
            texture,
            key.x - cameraX + offsetX,
            key.y - cameraY + floatOffset + offsetY,
            finalWidth,
            finalHeight
          );

          // Debug: Draw bounding box
          // ctx.strokeStyle = 'red';
          // ctx.strokeRect(
          //   key.x - cameraX,
          //   key.y - cameraY + floatOffset,
          //   KEY_WIDTH,
          //   KEY_HEIGHT
          // );
        } else {
          // Fallback if texture not loaded
          ctx.fillStyle = '#FFD700';
          ctx.fillRect(
            key.x - cameraX,
            key.y - cameraY + floatOffset,
            KEY_WIDTH,
            KEY_HEIGHT
          );
        }
        ctx.restore();
      }
    };

    // Update the key animation time in gameLoop instead
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.keyLastTime) / 1000;
    this.keyAnimationTime += deltaTime;
    this.keyLastTime = currentTime;

    // Draw all keys with different phases
    drawKey(this.data.key1, this.key1Texture, 0);
    drawKey(this.data.key2, this.key2Texture, 1);

    // Draw "To collect" counter at top right
    const keysToCollect = [
      this.data.key1.collected,
      this.data.key2.collected
    ].filter(k => !k).length;

    ctx.save();
    const counterText = `To collect: ${keysToCollect}`;
    ctx.font = '20px Arial';
    const textMetrics = ctx.measureText(counterText);
    const padding = 15;
    const margin = 10;
    const bgWidth = textMetrics.width + (padding * 2);
    const bgHeight = 30;
    const bgX = this.data.canvasWidth - bgWidth - margin;
    const bgY = margin;
    const radius = 8;
    
    // Draw rounded rectangle background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.moveTo(bgX + radius, bgY);
    ctx.lineTo(bgX + bgWidth - radius, bgY);
    ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + radius);
    ctx.lineTo(bgX + bgWidth, bgY + bgHeight - radius);
    ctx.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - radius, bgY + bgHeight);
    ctx.lineTo(bgX + radius, bgY + bgHeight);
    ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - radius);
    ctx.lineTo(bgX, bgY + radius);
    ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
    ctx.closePath();
    ctx.fill();
    
    // Draw text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';  // Changed from 'right' to 'center'
    ctx.fillText(counterText, bgX + (bgWidth / 2), bgY + 21);  // Center text in background
    ctx.restore();
  },

  // Helper function to calculate ray intersection with line segment
  getRayIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denominator === 0) return null;
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
    
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1)
        };
    }
    return null;
  },

  levelComplete() {
    this.setData({
      showComplete: true,
      'quiz.completed': false  // Start with quiz, not completion screen
    });

    const app = getApp();
      
      // Set level 1 as completed in global data and storage
      app.globalData.level3Completed = true;
      wx.setStorageSync('level3Completed', true);

      // Unlock level 4
      app.unlockLevel(4);

    // Initialize quiz canvas
    const query = wx.createSelectorQuery();
    query.select('#quizCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = this.data.canvasWidth * dpr;
        canvas.height = this.data.canvasHeight * dpr;
        ctx.scale(dpr, dpr);
        
        this.quizCtx = ctx;
        this.drawQuiz();
      });
    this.setData({
      'quiz.currentQuestionStartTime': Date.now()  // Start timer for the first question
    });
  },

  drawQuiz() {
    const ctx = this.quizCtx;
    if (!ctx) return;

    // Fill entire canvas with black first
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);

    const WALL_SIZE = 20;
    const GRID = this.getMazeGrid();

    // Calculate scaling to fit maze in screen
    const mazeWidth = GRID[0].length * WALL_SIZE;
    const mazeHeight = GRID.length * WALL_SIZE;
    const scale = Math.min(
      (this.data.canvasWidth * 0.8) / mazeWidth,
      (this.data.canvasHeight * 0.8) / mazeHeight
    );

    // Center the maze with panning offsets
    const offsetX = (this.data.canvasWidth - mazeWidth * scale) / 2 + this.data.quiz.offsetX;
    const offsetY = (this.data.canvasHeight - mazeHeight * scale) / 2 + this.data.quiz.offsetY;

    // Draw title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Where was this key located?', this.data.canvasWidth / 2, offsetY / 2);

    // Draw current key image
    const currentKey = this.data.quiz.keys[this.data.quiz.currentKeyIndex];
    const keyTexture = this[`${currentKey.texture}Texture`];
    if (keyTexture) {
      const maxKeySize = 50;  // Maximum size we want for the key
      
      // Get original image dimensions
      const imgWidth = keyTexture.width;
      const imgHeight = keyTexture.height;
      
      // Calculate scale to maintain aspect ratio
      const scaleRatio = Math.min(maxKeySize / imgWidth, maxKeySize / imgHeight);
      const finalWidth = imgWidth * scaleRatio;
      const finalHeight = imgHeight * scaleRatio;
      
      // Center the key horizontally and position below the title
      ctx.drawImage(
        keyTexture,
        this.data.canvasWidth / 2 - finalWidth / 2,  // Center horizontally
        offsetY / 2 + 20,                            // Position below title
        finalWidth,
        finalHeight
      );
    }

    // Draw maze
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Draw paths
    ctx.fillStyle = '#e6e6e6';  // Light gray for paths
    ctx.beginPath();
    for (let y = 0; y < GRID.length; y++) {
      for (let x = 0; x < GRID[0].length; x++) {
        if (GRID[y][x] === 0) {
          ctx.rect(x * WALL_SIZE, y * WALL_SIZE, WALL_SIZE, WALL_SIZE);
        }
      }
    }
    ctx.fill();

    // Draw walls
    ctx.fillStyle = '#000000';  // Dark gray for walls
    ctx.beginPath();
    for (let y = 0; y < GRID.length; y++) {
      for (let x = 0; x < GRID[0].length; x++) {
        if (GRID[y][x] === 1) {
          ctx.rect(x * WALL_SIZE, y * WALL_SIZE, WALL_SIZE, WALL_SIZE);
        }
      }
    }
    ctx.fill();

    // Draw correct block
    if (this.data.quiz.correctBlock) {
      ctx.fillStyle = '#54de72';  // Use same green as start/exit
      const { x, y } = this.data.quiz.correctBlock;
      ctx.fillRect(x * WALL_SIZE, y * WALL_SIZE, WALL_SIZE, WALL_SIZE);
    }

    // Draw incorrect block
    if (this.data.quiz.incorrectBlock) {
      ctx.fillStyle = '#FF0000';  // Keep red for incorrect
      const { x, y } = this.data.quiz.incorrectBlock;
      ctx.fillRect(x * WALL_SIZE, y * WALL_SIZE, WALL_SIZE, WALL_SIZE);
    }

    ctx.restore();
  },

  handleQuizTouchStart(e) {
    const touch = e.touches[0];
    this.setData({
      'quiz.lastTouchX': touch.clientX,
      'quiz.lastTouchY': touch.clientY,
      'quiz.startTouchX': touch.clientX,  // Track start position
      'quiz.startTouchY': touch.clientY
    });
  },

  handleQuizTouch(e) {
    if (!e.changedTouches || e.changedTouches.length === 0) {
      return;
    }

    const touch = e.changedTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    // Calculate movement distance
    const moveDistance = Math.sqrt(
      Math.pow(x - this.data.quiz.startTouchX, 2) +
      Math.pow(y - this.data.quiz.startTouchY, 2)
    );

    // Define a threshold to differentiate between a pan and a click
    const clickThreshold = 10; // Adjust this value as needed

    if (moveDistance > clickThreshold) {
      // Treat as a pan, not a click
      return;
    }

    // Existing click handling logic
    const WALL_SIZE = 20;
    const GRID = this.getMazeGrid();
    const scale = Math.min(
      (this.data.canvasWidth * 0.8) / (GRID[0].length * WALL_SIZE),
      (this.data.canvasHeight * 0.8) / (GRID.length * WALL_SIZE)
    );

    const offsetX = (this.data.canvasWidth - GRID[0].length * WALL_SIZE * scale) / 2 + this.data.quiz.offsetX;
    const offsetY = (this.data.canvasHeight - GRID.length * WALL_SIZE * scale) / 2 + this.data.quiz.offsetY;

    const gridX = Math.floor((x - offsetX) / (WALL_SIZE * scale));
    const gridY = Math.floor((y - offsetY) / (WALL_SIZE * scale));

    // Check if the tile is walkable
    if (gridX >= 0 && gridX < GRID[0].length && gridY >= 0 && gridY < GRID.length && GRID[gridY][gridX] === 0) {

      const currentKey = this.data.quiz.keys[this.data.quiz.currentKeyIndex];
      const isCorrect = Math.abs(gridX - currentKey.x) < 1 && Math.abs(gridY - currentKey.y) < 1;

      const distance = Math.sqrt(
        Math.pow(gridX - currentKey.x, 2) + 
        Math.pow(gridY - currentKey.y, 2)
      );
      this.gameplayStats.quizAccuracy[this.data.quiz.currentKeyIndex] = distance;

      this.setData({
        'quiz.enlargedBlock': { x: gridX, y: gridY }
      });
      this.drawQuiz();

      setTimeout(() => {
        this.setData({
          'quiz.enlargedBlock': null
        });

        if (isCorrect) {
          this.animateCorrectBlock(gridX, gridY);
        } else {
          this.animateIncorrectBlock(gridX, gridY);
        }
      }, 100);

      // Record time taken for this question
      const timeTaken = (Date.now() - this.data.quiz.currentQuestionStartTime) / 1000; // Convert to seconds
      this.setData({
        [`quiz.quizTimes[${this.data.quiz.currentKeyIndex}]`]: timeTaken
      });
    } else {
      // Optionally, provide feedback that the tile is not walkable
      wx.showToast({
        title: 'Cannot select a wall, try again',
        icon: 'none'
      });
    }
  },

  animateCorrectBlock(gridX, gridY) {
    this.setData({
      'quiz.correctBlock': { x: gridX, y: gridY },
      'quiz.correctFlashCount': 0
    });

    const flashInterval = 150;
    const totalFlashes = 3;

    const flash = () => {
      if (this.data.quiz.correctFlashCount < totalFlashes) {
        this.setData({
          'quiz.correctBlock': this.data.quiz.correctFlashCount % 2 === 0 ? 
            { x: gridX, y: gridY } : null,
          'quiz.correctFlashCount': this.data.quiz.correctFlashCount + 1
        });
        this.drawQuiz();

        this.data.quiz.correctFlashTimer = setTimeout(flash, flashInterval);
      } else {
        this.moveToNextKey();
      }
    };

    flash();
  },

  animateIncorrectBlock(gridX, gridY) {
    this.setData({
      'quiz.incorrectBlock': { x: gridX, y: gridY },
      'quiz.incorrectFlashCount': 0
    });

    const flashInterval = 150;
    const totalFlashes = 3;

    const flash = () => {
      if (this.data.quiz.incorrectFlashCount < totalFlashes) {
        this.setData({
          'quiz.incorrectBlock': this.data.quiz.incorrectFlashCount % 2 === 0 ? 
            { x: gridX, y: gridY } : null,
          'quiz.incorrectFlashCount': this.data.quiz.incorrectFlashCount + 1
        });
        this.drawQuiz();

        this.data.quiz.incorrectFlashTimer = setTimeout(flash, flashInterval);
      } else {
        this.moveToNextKey();
      }
    };

    flash();
  },

  // Add this helper method to handle moving to next key
  moveToNextKey() {
    // Clear any highlights
    this.setData({
      'quiz.correctBlock': null,
      'quiz.incorrectBlock': null,
      'quiz.highlightedBlock': null
    });

    // Move to next key or show completion screen
    if (this.data.quiz.currentKeyIndex < this.data.quiz.keys.length - 1) {
      this.setData({
        'quiz.currentKeyIndex': this.data.quiz.currentKeyIndex + 1,
        'quiz.currentQuestionStartTime': Date.now(),  // Start timer for next question
      });
      this.drawQuiz();
    } else {
      // Only record end time if timer was started
      if (this.gameplayStats.timerStarted) {
        this.gameplayStats.endTime = Date.now();
      }
      
      // Print gameplay stats
      this.printGameplayStats();
      const timeTaken = (this.gameplayStats.endTime - this.gameplayStats.startTime) / 1000;
      this.saveGameData(timeTaken);
      
      // Reset stats for next attempt
      this.resetGameplayStats();

      // Hide the quiz canvas and show completion screen
      this.setData({
        'quiz.completed': true,
        hideCanvas: true  // Hide the maze canvas
      });

      // Hide the quiz canvas
      const quizCanvas = wx.createSelectorQuery().select('#quizCanvas');
      if (quizCanvas) {
        quizCanvas.node(res => {
          if (res && res.node) {
            res.node.style.display = 'none';
          }
        }).exec();
      }
    }
  },

  goBackToLevels() {
    wx.navigateBack();
  },

  isWalkable(x, y) {
    const grid = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1],
      [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,1,1,1,1,1,0,0,1,0,1,1,0,0,1,1],
      [1,1,1,1,1,1,1,0,0,1,0,1,1,0,0,1,1],
      [1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1],
      [1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1],
      [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    return grid[y][x] === 0;
  },

  checkExitCollision() {
    if (!this.data.key1.collected || !this.data.key2.collected) {
      const playerBounds = {
        x: this.data.player.x - this.data.player.width/2,
        y: this.data.player.y - this.data.player.height/2,
        width: this.data.player.width,
        height: this.data.player.height
      };
      
      const exitBounds = {
        x: this.data.exit.x,
        y: this.data.exit.y,
        width: this.data.exit.width,
        height: this.data.exit.height
      };
      
      if (this.checkCollision(playerBounds, exitBounds)) {
        // Show reminder for 2 seconds
        this.setData({ showKeyReminder: true });
        if (this.data.keyReminderTimer) {
          clearTimeout(this.data.keyReminderTimer);
        }
        this.data.keyReminderTimer = setTimeout(() => {
          this.setData({ showKeyReminder: false });
        }, 2000);
      }
    }
  },

  onUnload() {
    // Clear the game loop when the page unloads
    if (this.gameLoopId) {
      clearTimeout(this.gameLoopId);
      this.gameLoopId = null;
    }

    // Clear any other timers
    if (this.data.keyReminderTimer) {
      clearTimeout(this.data.keyReminderTimer);
    }
    if (this.data.quiz.highlightTimer) {
      clearTimeout(this.data.quiz.highlightTimer);
    }
  },

  // Add this method to get the current maze grid
  getMazeGrid() {
    return [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1],
      [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,1,1,1,1,1,0,0,1,0,1,1,0,0,1,1],
      [1,1,1,1,1,1,1,0,0,1,0,1,1,0,0,1,1],
      [1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1],
      [1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1],
      [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
  },

  // Add this new method
  checkPlayerEnemyCollision() {
    const player = {
      left: this.data.player.x - this.data.player.visualWidth/2,
      right: this.data.player.x + this.data.player.visualWidth/2,
      top: this.data.player.y - this.data.player.visualHeight/2,
      bottom: this.data.player.y + this.data.player.visualHeight/2
    };

    const enemy = {
      left: this.data.enemy.x - this.data.enemy.visualWidth/2,
      right: this.data.enemy.x + this.data.enemy.visualWidth/2,
      top: this.data.enemy.y - this.data.enemy.visualHeight/2,
      bottom: this.data.enemy.y + this.data.enemy.visualHeight/2
    };

    if (!(player.left > enemy.right || 
         player.right < enemy.left || 
         player.top > enemy.bottom ||
         player.bottom < enemy.top)) {
      
      // Show death screen
      this.showDeathScreen();
      return true;
    }
    return false;
  },

  // Add new method to show death screen
  showDeathScreen() {
    // Play fail sound
    this.failSound.play();

    // Only record end time if timer was started
    if (this.gameplayStats.timerStarted) {
      this.gameplayStats.endTime = Date.now();
    }
    
    // Record stats before showing death screen
    this.gameplayStats.caughtByEnemy = true;
    this.gameplayStats.quizAccuracy = Array(2).fill(NaN);
    
    // Print gameplay stats
    this.printGameplayStats();
    const timeTaken = (this.gameplayStats.endTime - this.gameplayStats.startTime) / 1000;
    this.saveGameData(timeTaken);
    
    // Reset stats for next attempt
    this.resetGameplayStats();

    // Hide canvas and show death screen
    this.setData({
      showDeathScreen: true,
      deathScreenOpacity: 0,
      hideCanvas: true // Add this to hide the canvas
    });

    // Fade in animation using setTimeout
    const fadeDuration = 500; // 0.5 seconds
    const startTime = Date.now();
    const animateFade = () => {
      const elapsed = Date.now() - startTime;
      const opacity = Math.min(elapsed / fadeDuration, 1);
      this.setData({ deathScreenOpacity: opacity });
      
      if (opacity < 1) {
        setTimeout(animateFade, 16); // ~60fps
      } else {
        // After fade in, wait a moment then restart
        setTimeout(() => {
          this.restartLevel();
          this.setData({ 
            showDeathScreen: false,
            hideCanvas: false // Show canvas again
          });
        }, 1500); // 1 second delay before restart
      }
    };
    animateFade();
  },

  // Add this helper method to check if a position is valid (not inside walls)
  isValidPosition(x, y, width, height) {
    // Check corners of the bounding box
    const points = [
      { x: x - width/2, y: y - height/2 },  // Top-left
      { x: x + width/2, y: y - height/2 },  // Top-right
      { x: x - width/2, y: y + height/2 },  // Bottom-left
      { x: x + width/2, y: y + height/2 }   // Bottom-right
    ];

    for (const point of points) {
      const gridX = Math.floor(point.x / WALL_SIZE);
      const gridY = Math.floor(point.y / WALL_SIZE);
      if (gridX < 0 || gridX >= GRID_WIDTH || gridY < 0 || gridY >= GRID_HEIGHT) return false;
      if (this.getMazeGrid()[gridY][gridX] === 1) return false;
    }
    return true;
  },

  // Add this helper method to get a centered position in a block
  getCenteredPosition(gridX, gridY) {
    return {
      x: gridX * WALL_SIZE + WALL_SIZE/2,
      y: gridY * WALL_SIZE + WALL_SIZE/2
    };
  },

  // Update the complete screen navigation
  navigateBack() {
    this.animateButton('back', () => {
      wx.redirectTo({
        url: '/pages/game/level-select/level-select'
      });
    });
  },

  restartGame() {
    this.animateButton('restart', () => {
      this.resetGameplayStats();
      wx.redirectTo({
        url: `/pages/game/play/level3/preview?level=3`
      });
    });
  },

  navigateToNextLevel() {
    this.animateButton('next', () => {
      wx.redirectTo({
        url: `/pages/game/play/level4/preview?level=4`
      });
    });
  },

  animateButton(type, callback) {
    // Add animation class based on button type
    const buttonClass = `.${type}-button`;
    const button = this.selectComponent(buttonClass);
    
    if (button) {
      // Add animation class
      button.setData({
        animating: true
      });
      
      // Wait for animation to complete
      setTimeout(() => {
        if (button) {
          button.setData({
            animating: false
          });
        }
        callback();
      }, 200); // Match this duration with your CSS animation
    } else {
      // If animation fails, just execute the callback
      callback();
    }
  },

  // Add new function to print gameplay stats
  printGameplayStats() {
    const timeTaken = (this.gameplayStats.endTime - this.gameplayStats.startTime) / 1000; // Convert to seconds
    
    console.log('=== Level 3 Gameplay Statistics ===');
    console.log(`Caught by enemy: ${this.gameplayStats.caughtByEnemy}`);
    console.log(`Time taken: ${timeTaken.toFixed(2)} seconds`);
    console.log('Quiz accuracy (distance from correct positions):');
    this.gameplayStats.quizAccuracy.forEach((distance, index) => {
      if (isNaN(distance)) {
        console.log(`Key ${index + 1}: Not reached`);
      } else {
        console.log(`Key ${index + 1}: ${distance.toFixed(2)} blocks away`);
      }
    });
    
    // Add key collection times
    this.data.keyCollectionTimes.forEach((time, index) => {
      if (time) {
        console.log(`Key ${index + 1} collected in: ${time.toFixed(2)} seconds`);
      } else {
        console.log(`Key ${index + 1} not collected`);
      }
    });

    // Add quiz times
    console.log('Quiz times:');
    this.data.quiz.quizTimes.forEach((time, index) => {
      if (time) {
        console.log(`Question ${index + 1} answered in: ${time.toFixed(2)} seconds`);
      } else {
        console.log(`Question ${index + 1} not answered`);
      }
    });
    console.log('================================');
  },

  handleQuizTouchMove(e) {
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.data.quiz.lastTouchX;
    const deltaY = touch.clientY - this.data.quiz.lastTouchY;

    this.setData({
      'quiz.offsetX': this.data.quiz.offsetX + deltaX,
      'quiz.offsetY': this.data.quiz.offsetY + deltaY,
      'quiz.lastTouchX': touch.clientX,
      'quiz.lastTouchY': touch.clientY
    });

    this.drawQuiz();
  },

  saveGameData(timeTaken) {
    const db = wx.cloud.database();
    
    db.collection('maze-game').add({
      data: {
        level: this.data.currentLevel, // Include the level number
        caughtByEnemy: this.gameplayStats.caughtByEnemy,
        timeTaken: timeTaken,
        quizAccuracy: this.gameplayStats.quizAccuracy,
        keyCollectionTimes: this.data.keyCollectionTimes,
        quizTimes: this.data.quiz.quizTimes,
        timestamp: db.serverDate()
      },
      success: res => {
        console.log('Game data saved successfully', res);
        wx.showToast({
          title: 'Stats saved!',
          icon: 'success'
        });
      },
      fail: err => {
        console.error('Failed to save game data', err);
        wx.showToast({
          title: 'Failed to save stats',
          icon: 'error'
        });
      }
    });
  }
}); 