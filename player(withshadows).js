const WALL_SIZE = 40;
const GRID_SIZE = 9;  // Match the size used in generateMazeWalls
const EDGE_IMAGE_PATH = '/pages/game/materials/egypt/edge_egypt.jpg';
const RIGHT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/right_egypt.jpg';
const LEFT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/left_egypt.jpg';
const TOP_WALL_IMAGE_PATH = '/pages/game/materials/egypt/top_egypt.jpg';
const TOPLEFT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/topleft_egypt.jpg';
const TOPRIGHT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/topright_egypt.jpg';
const BOTTOMLEFT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/bottomleft_egypt.jpg';
const BOTTOMRIGHT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/bottomright_egypt.jpg';
const WALLTOP_IMAGE_PATH = '/pages/game/materials/egypt/walltop_egypt.jpg';
const BOTTOM_WALL_IMAGE_PATH = '/pages/game/materials/egypt/bottom_egypt.jpg';
const BOTTOM_RIGHT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/bottom_right.jpg';
const BOTTOM_LEFT_WALL_IMAGE_PATH = '/pages/game/materials/egypt/bottom_left.jpg';
const BOTTOMTOP_WALL_IMAGE_PATH = '/pages/game/materials/egypt/bottomtop_egypt.jpg';
const TOPRIGHTBOTTOM_WALL_IMAGE_PATH = '/pages/game/materials/egypt/toprightbottom_egypt.jpg';
const PLAYER_AVATAR_PATH = '/pages/game/materials/egypt/player_avatar.png';

Page({
  data: {
    player: { x: 300, y: 540, width: 30, height: 15 },
    walls: [],
    exit: { x: 540, y: 40, width: 40, height: 40 },
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
    canvasHeight: 0
  },

  onLoad(options) {
    const windowInfo = wx.getWindowInfo();
    const joystickX = windowInfo.windowWidth / 2;
    const joystickY = windowInfo.windowHeight - 150;
    
    this.setData({
      canvasWidth: windowInfo.windowWidth,
      canvasHeight: windowInfo.windowHeight,
      'joystick.x': joystickX,
      'joystick.y': joystickY,
      'joystick.knobX': joystickX,
      'joystick.knobY': joystickY
    });

    // Generate maze walls
    const walls = this.generateMazeWalls();
    this.setData({ walls });

    wx.setNavigationBarTitle({
      title: `Level ${options.level}`
    });
    
    // Start game loop
    this.lastTime = Date.now();
    this.gameLoop();
  },

  generateMazeWalls() {
    const GRID_SIZE = 15;
    
    // Define a simple maze layout for level 1 (0 = path, 1 = wall)
    const grid = [
      [1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1], // Row 0 (top) with exit
      [1, 1, 1, 1, 1, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1]  // Row 14 (bottom)
    ];

    const exitX = 6; // Fixed exit position (middle)
    const startX = 2; // Fixed start position (middle)
    const startY = 11; // Near bottom

    // Convert to walls
    const walls = [];
    
    // Add outer walls except for exit
    walls.push(
      { x: 0, y: 0, width: exitX * WALL_SIZE, height: WALL_SIZE },  // Top left
      { x: (exitX + 1) * WALL_SIZE, y: 0, width: (GRID_SIZE - exitX - 1) * WALL_SIZE, height: WALL_SIZE },  // Top right
      { x: 0, y: 0, width: WALL_SIZE, height: GRID_SIZE * WALL_SIZE },  // Left
      { x: 0, y: (GRID_SIZE - 1) * WALL_SIZE, width: GRID_SIZE * WALL_SIZE, height: WALL_SIZE },  // Bottom
      { x: (GRID_SIZE - 1) * WALL_SIZE, y: 0, width: WALL_SIZE, height: GRID_SIZE * WALL_SIZE }  // Right
    );

    // Add inner walls
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
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

    // Set player start position and exit
    this.setData({
      'player.x': startX * WALL_SIZE + WALL_SIZE / 2,
      'player.y': startY * WALL_SIZE + WALL_SIZE / 2,
      'exit.x': exitX * WALL_SIZE,
      'exit.y': 0
    });

    return walls;
  },

  gameLoop() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (this.data.joystick.touching) {
      const { moveX, moveY } = this.data.joystick;
      this.movePlayer(moveX, moveY, deltaTime);
    }

    this.draw();
    
    if (!this.data.showComplete) {
      setTimeout(() => this.gameLoop(), 1);
    }
  },

  movePlayer(dirX, dirY, deltaTime) {
    const { player, moveSpeed, walls, exit } = this.data;
    const actualSpeed = moveSpeed * deltaTime * 60; // Normalize speed with deltaTime

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

    // Check exit collision
    if (newY < WALL_SIZE) {
      this.levelComplete();
    }
  },

  touchStart(e) {
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

        // Load player avatar
        const playerImage = canvas.createImage();
        playerImage.onload = () => {
          this.playerTexture = playerImage;
        };
        playerImage.src = PLAYER_AVATAR_PATH;
        
        // Load all textures
        const edgeImage = canvas.createImage();
        edgeImage.onload = () => {
          this.edgeTexture = edgeImage;
        };
        edgeImage.src = EDGE_IMAGE_PATH;

        const rightWallImage = canvas.createImage();
        rightWallImage.onload = () => {
          this.rightWallTexture = rightWallImage;
        };
        rightWallImage.src = RIGHT_WALL_IMAGE_PATH;

        const leftWallImage = canvas.createImage();
        leftWallImage.onload = () => {
          this.leftWallTexture = leftWallImage;
        };
        leftWallImage.src = LEFT_WALL_IMAGE_PATH;

        const topLeftWallImage = canvas.createImage();
        topLeftWallImage.onload = () => {
          this.topLeftWallTexture = topLeftWallImage;
        };
        topLeftWallImage.src = TOPLEFT_WALL_IMAGE_PATH;

        const topRightWallImage = canvas.createImage();
        topRightWallImage.onload = () => {
          this.topRightWallTexture = topRightWallImage;
        };
        topRightWallImage.src = TOPRIGHT_WALL_IMAGE_PATH;

        const bottomLeftImage = canvas.createImage();
        bottomLeftImage.onload = () => {
          this.bottomLeftWallTexture = bottomLeftImage;
        };
        bottomLeftImage.src = BOTTOMLEFT_WALL_IMAGE_PATH;

        const bottomRightImage = canvas.createImage();
        bottomRightImage.onload = () => {
          this.bottomRightWallTexture = bottomRightImage;
        };
        bottomRightImage.src = BOTTOMRIGHT_WALL_IMAGE_PATH;

        const topWallImage = canvas.createImage();
        topWallImage.onload = () => {
          this.topWallTexture = topWallImage;
        };
        topWallImage.src = TOP_WALL_IMAGE_PATH;

        const wallTopImage = canvas.createImage();
        wallTopImage.onload = () => {
          this.wallTopTexture = wallTopImage;
        };
        wallTopImage.src = WALLTOP_IMAGE_PATH;

        const bottomWallImage = canvas.createImage();
        bottomWallImage.onload = () => {
          this.bottomWallTexture = bottomWallImage;
        };
        bottomWallImage.src = BOTTOM_WALL_IMAGE_PATH;

        const bottomTopWallImage = canvas.createImage();
        bottomTopWallImage.onload = () => {
          this.bottomTopTexture = bottomTopWallImage;
        };
        bottomTopWallImage.src = BOTTOMTOP_WALL_IMAGE_PATH;

        const topRightBottomWallImage = canvas.createImage();
        topRightBottomWallImage.onload = () => {
          this.topRightBottomTexture = topRightBottomWallImage;
        };
        topRightBottomWallImage.src = TOPRIGHTBOTTOM_WALL_IMAGE_PATH;

      });
  },

  draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    
    ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    
    const zoomX = 2;
    const zoomY = 2;
    const cameraX = this.data.player.x - (this.data.canvasWidth / zoomX / 2);
    const cameraY = this.data.player.y - (this.data.canvasHeight / zoomY / 2);
    
    // Replace ground texture with solid color
    ctx.save();
    ctx.scale(zoomX, zoomY);
    ctx.fillRect(0, 0, this.data.canvasWidth / zoomX, this.data.canvasHeight / zoomY);
    
    // Create darkness overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';  // Make initial darkness nearly complete
    ctx.fillRect(0, 0, this.data.canvasWidth / zoomX, this.data.canvasHeight / zoomY);

    // Create visibility mask
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';  // This will remove the darkness
    
    // Cast rays for visibility polygon
    ctx.beginPath();
    const rayCount = 360;
    const rayLength = 150;
    const playerScreenX = this.data.canvasWidth / zoomX / 2;
    const playerScreenY = this.data.canvasHeight / zoomY / 2;
    
    ctx.moveTo(playerScreenX, playerScreenY);
    
    // Pre-filter walls for ray casting
    const visibleWalls = this.data.walls.filter(wall => {
      const dx = wall.x - this.data.player.x;
      const dy = wall.y - this.data.player.y;
      return (dx * dx + dy * dy) <= 40000;
    });
    
    // Cast rays
    for (let angle = 0; angle <= 360; angle += 360 / rayCount) {
      const radian = (angle * Math.PI) / 180;
      let rayEndX = playerScreenX + Math.cos(radian) * rayLength;
      let rayEndY = playerScreenY + Math.sin(radian) * rayLength;
      
      let closestDist = rayLength;
      
      for (const wall of visibleWalls) {
        const wallScreenX = wall.x - cameraX;
        const wallScreenY = wall.y - cameraY;
        
        const intersections = [
          this.getRayIntersection(
            playerScreenX, playerScreenY,
            rayEndX, rayEndY,
            wallScreenX, wallScreenY,
            wallScreenX + wall.width, wallScreenY
          ),
          this.getRayIntersection(
            playerScreenX, playerScreenY,
            rayEndX, rayEndY,
            wallScreenX, wallScreenY,
            wallScreenX, wallScreenY + wall.height
          ),
          this.getRayIntersection(
            playerScreenX, playerScreenY,
            rayEndX, rayEndY,
            wallScreenX + wall.width, wallScreenY,
            wallScreenX + wall.width, wallScreenY + wall.height
          ),
          this.getRayIntersection(
            playerScreenX, playerScreenY,
            rayEndX, rayEndY,
            wallScreenX, wallScreenY + wall.height,
            wallScreenX + wall.width, wallScreenY + wall.height
          )
        ];
        
        for (const intersection of intersections) {
          if (intersection) {
            const dx = intersection.x - playerScreenX;
            const dy = intersection.y - playerScreenY;
            const distSquared = dx * dx + dy * dy;
            if (distSquared < closestDist * closestDist) {
              closestDist = Math.sqrt(distSquared);
              rayEndX = intersection.x;
              rayEndY = intersection.y;
            }
          }
        }
      }
      
      ctx.lineTo(rayEndX, rayEndY);
    }
    
    ctx.closePath();
    
    // Create gradient that only controls opacity of darkness removal
    if (!this.lightGradient) {
      this.lightGradient = ctx.createRadialGradient(
        playerScreenX, playerScreenY, 0,
        playerScreenX, playerScreenY, rayLength
      );
      this.lightGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');      // Center
      this.lightGradient.addColorStop(0.1, 'rgba(0, 0, 0, 0.9)');
      this.lightGradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.8)');
      this.lightGradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.7)');
      this.lightGradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.6)');
      this.lightGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.5)');
      this.lightGradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.4)');
      this.lightGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)');
      this.lightGradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.2)');
      this.lightGradient.addColorStop(0.9, 'rgba(0, 0, 0, 0.1)');
      this.lightGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');      // Edge
    }
    
    ctx.fillStyle = this.lightGradient;
    ctx.fill();
    ctx.restore();

    // Draw walls with proper shadows in a single pass
    this.data.walls.forEach(wall => {
      const wallX = wall.x - cameraX;
      const wallY = wall.y - cameraY;

      // Check paths on all sides
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
      
      // Draw the appropriate wall texture
      if (hasPathBottom && this.edgeTexture) {
        // Handle edge with shadow segments
        const segments = 40;  // Reduced from 100 to 40 for better performance
        const playerX = this.data.player.x;
        const playerY = this.data.player.y;
        const wallBottom = wall.y + wall.height;
        
        // Only process if wall is potentially visible
        const dx = wall.x - playerX;
        const dy = wall.y - playerY;
        if (dx * dx + dy * dy <= 90000) {
          const segmentWidth = wall.width / segments;
          const textureSegmentWidth = this.edgeTexture.width / segments;
          
          for (let i = 0; i < segments; i++) {
            const segmentX = wall.x + (i * segmentWidth);
            const segmentCenterX = segmentX + segmentWidth/2;
          const dx = segmentCenterX - playerX;
            const dy = wallBottom - playerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
            // Check if segment is in line of sight
            let isVisible = false;
            if (playerY >= wallBottom) {
              // Calculate angle between player and segment
              const segmentAngle = Math.atan2(dy, dx);
              const rayEndX = playerX + Math.cos(segmentAngle) * distance;
              const rayEndY = playerY + Math.sin(segmentAngle) * distance;
              
              // Check if any walls block the line of sight to this segment
              isVisible = true;
              for (const otherWall of visibleWalls) {
                if (otherWall === wall) continue;
                
                // Only check walls that could potentially block the view
                const wallDx = otherWall.x - playerX;
                const wallDy = otherWall.y - playerY;
                if (wallDx * wallDx + wallDy * wallDy > distance * distance) continue;

                const intersections = [
                  this.getRayIntersection(
                playerX, playerY,
                    rayEndX, rayEndY,
                otherWall.x, otherWall.y,
                otherWall.x + otherWall.width, otherWall.y
                  ),
                  this.getRayIntersection(
                playerX, playerY,
                    rayEndX, rayEndY,
                otherWall.x, otherWall.y,
                otherWall.x, otherWall.y + otherWall.height
                  ),
                  this.getRayIntersection(
                playerX, playerY,
                    rayEndX, rayEndY,
                otherWall.x + otherWall.width, otherWall.y,
                otherWall.x + otherWall.width, otherWall.y + otherWall.height
                  ),
                  this.getRayIntersection(
                    playerX, playerY,
                    rayEndX, rayEndY,
                    otherWall.x, otherWall.y + otherWall.height,
                    otherWall.x + otherWall.width, otherWall.y + otherWall.height
                  )
                ];
                
                if (intersections.some(intersection => {
                  if (!intersection) return false;
                  const intersectDx = intersection.x - playerX;
                  const intersectDy = intersection.y - playerY;
                  return (intersectDx * intersectDx + intersectDy * intersectDy) < (distance * distance);
                })) {
                  isVisible = false;
                  break;
                }
              }
            }
            
            const alpha = isVisible ? 
              Math.max(0, Math.min(1, 1 - (distance - 50) / 250)) * 0.95 : 
              0.15;
            
            ctx.globalAlpha = alpha;
            ctx.drawImage(
              this.edgeTexture,
              i * textureSegmentWidth,
              0,
              textureSegmentWidth + 1,
              this.edgeTexture.height,
              wallX + (i * segmentWidth),
              wallY,
              segmentWidth + (1/segments),
              wall.height
            );
          }
          ctx.globalAlpha = 1.0;
        }
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

        // Check if block to the right shows edge_egypt.jpg
        const blockRightHasEdgeTexture = this.data.walls.some(otherWall => 
          otherWall.x === wall.x + WALL_SIZE && 
          otherWall.y === wall.y && 
          !this.data.walls.some(w => 
            w.x === otherWall.x && 
            w.y === otherWall.y + WALL_SIZE
          )
        );

        // Check if block below shows right_egypt.jpg
        const blockBelowHasRightTexture = this.data.walls.some(otherWall => 
          otherWall.x === wall.x && 
          otherWall.y === wall.y + WALL_SIZE && 
          !this.data.walls.some(w => 
            w.x === otherWall.x + WALL_SIZE && 
            w.y === otherWall.y
          )
        );

        // Check if there's a wall on the right
        const hasWallRight = this.data.walls.some(otherWall => 
          otherWall.x === wall.x + WALL_SIZE && 
          otherWall.y === wall.y
        );

        // Draw appropriate texture based on neighbors
        if (blockRightHasEdgeTexture && blockBelowHasRightTexture && this.rightWallTexture) {
          ctx.drawImage(
            this.rightWallTexture,
            0, 0,
            this.rightWallTexture.width, this.rightWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (blockBelowHasEdgeTexture && !hasWallRight && this.bottomRightWallTexture) {
          ctx.drawImage(
            this.bottomRightWallTexture,
            0, 0,
            this.bottomRightWallTexture.width, this.bottomRightWallTexture.height,
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
        } else if (hasPathTop && !hasPathLeft && !hasPathRight && !hasPathBottom && this.topWallTexture) {
          ctx.drawImage(
            this.topWallTexture,
            0, 0,
            this.topWallTexture.width, this.topWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathLeft && hasPathTop && this.topLeftWallTexture) {
          ctx.drawImage(
            this.topLeftWallTexture,
            0, 0,
            this.topLeftWallTexture.width, this.topLeftWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathRight && hasPathTop && this.topRightWallTexture) {
          ctx.drawImage(
            this.topRightWallTexture,
            0, 0,
            this.topRightWallTexture.width, this.topRightWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathLeft && hasPathBottom && this.bottomLeftWallTexture) {
          ctx.drawImage(
            this.bottomLeftWallTexture,
            0, 0,
            this.bottomLeftWallTexture.width, this.bottomLeftWallTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else if (hasPathRight && hasPathBottom && this.bottomRightWallTexture) {
          ctx.drawImage(
            this.bottomRightWallTexture,
            0, 0,
            this.bottomRightWallTexture.width, this.bottomRightWallTexture.height,
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
        } else if (this.wallTopTexture) {
          ctx.drawImage(
            this.wallTopTexture,
            0, 0,
            this.wallTopTexture.width, this.wallTopTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        } else {
          // Fallback to pink color if texture isn't loaded yet
          ctx.fillStyle = '#CC6B8E';
          ctx.fillRect(wallX, wallY, wall.width, wall.height);
        }

        // Additional texture overrides
        if (blockBelowHasEdgeTexture && hasPathTop && this.bottomTopTexture) {
          ctx.drawImage(
            this.bottomTopTexture,
            0, 0,
            this.bottomTopTexture.width, this.bottomTopTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        }

        if (blockBelowHasEdgeTexture && hasPathTop && hasPathRight && this.topRightBottomTexture) {
          ctx.drawImage(
            this.topRightBottomTexture,
            0, 0,
            this.topRightBottomTexture.width, this.topRightBottomTexture.height,
            wallX, wallY,
            wall.width, wall.height
          );
        }
      }
    });

    ctx.restore();

    // Draw exit
    ctx.save();
    ctx.scale(zoomX, zoomY);
    ctx.fillStyle = '#C24E78';
    ctx.fillRect(
      this.data.exit.x - cameraX,
      this.data.exit.y - cameraY,
      this.data.exit.width,
      this.data.exit.height
    );
    ctx.restore();

    // Draw player
    ctx.save();
    ctx.scale(zoomX, zoomY);
    
    const centerX = this.data.canvasWidth / zoomX / 2;
    const centerY = this.data.canvasHeight / zoomY / 2;
    const playerWidth = this.data.player.width;
    const playerHeight = this.data.player.height;
    const imageHeight = playerHeight * 2;  // Image is twice the height of collision box
    
    if (this.playerTexture) {
      // Draw player avatar image
      ctx.save();
      ctx.beginPath();
      // Draw the full height image, positioned so the collision box is at the bottom
      ctx.rect(centerX - playerWidth/2, centerY - imageHeight + playerHeight/2, playerWidth, imageHeight);
      ctx.clip();  // Clip to rectangle shape
      
      // Draw the image centered horizontally but with collision box at bottom
      ctx.drawImage(
        this.playerTexture,
        centerX - playerWidth/2,
        centerY - imageHeight + playerHeight/2,
        playerWidth,
        imageHeight
      );
      ctx.restore();

    } else {
      // Fallback to gradient rectangle if image not loaded
      const rectGradient = ctx.createLinearGradient(
        centerX - playerWidth/2,
        centerY - playerHeight/2,
        centerX + playerWidth/2,
        centerY + playerHeight/2
      );
      
      rectGradient.addColorStop(0, '#d179a7');
      rectGradient.addColorStop(0.3, '#cc76a3');
      rectGradient.addColorStop(0.7, '#ba6c94');
      rectGradient.addColorStop(1, '#a35f82');
      
      ctx.fillStyle = rectGradient;
      ctx.fillRect(centerX - playerWidth/2, centerY - playerHeight/2, playerWidth, playerHeight);
      
    }
    ctx.restore();
    
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

    // Move vignette effect here, after everything else is drawn
    ctx.save();
    const vignetteGradient = ctx.createRadialGradient(
      this.data.canvasWidth / 2, this.data.canvasHeight / 2, 0,
      this.data.canvasWidth / 2, this.data.canvasHeight / 2, 
      Math.max(this.data.canvasWidth, this.data.canvasHeight) / 1.5
    );
    
    vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignetteGradient.addColorStop(0.1, 'rgba(0, 0, 0, 0.1)');
    vignetteGradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.201516)');
    vignetteGradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.303125)');
    vignetteGradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.40625)');
    vignetteGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.5125)');
    vignetteGradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.625)');
    vignetteGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.75)');
    vignetteGradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.9)');
    vignetteGradient.addColorStop(0.9, 'rgba(0, 0, 0, 0.95)');
    vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

    ctx.fillStyle = vignetteGradient;
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
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
    // Stop the game loop
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
    }

    // Hide the canvas and joystick
    this.setData({
      showComplete: true,
      hideCanvas: true
    });
  },

  goBackToLevels() {
    wx.navigateBack();
  }
});  