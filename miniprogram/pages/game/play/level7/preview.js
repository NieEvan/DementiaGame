const WALL_SIZE = 20
const app = getApp();
const KEY_WIDTH = 25;
const KEY_HEIGHT = 25;

Page({
  data: {
    canvasWidth: 0,
    canvasHeight: 0,
    countdown: 5,
    keyAlpha: 1,
    playerInitialX: 14 * WALL_SIZE,
    playerInitialY: 22 * WALL_SIZE,
    enemyInitialX: 16 * WALL_SIZE,
    enemyInitialY: 24 * WALL_SIZE,
    exitX: 4 * WALL_SIZE,
    exitY: 1 * WALL_SIZE,
    key1: [{x: 5, y: 22}],
    key2: [{x: 3, y: 14}],
    key3: [{x: 18, y: 10}],
    key4: [{x: 8, y: 8}],
    offsetX: 0,  // Track horizontal offset
    offsetY: 0,  // Track vertical offset
    lastTouchX: 0,  // Track last touch X position
    lastTouchY: 0,  // Track last touch Y position
    countdownOpacity: 1,
  },

  onLoad(options) {
    const windowInfo = wx.getWindowInfo();
    this.setData({
      canvasWidth: windowInfo.windowWidth,
      canvasHeight: windowInfo.windowHeight
    });

    app.globalData.playerInitialX = (this.data.playerInitialX + 0.5 * WALL_SIZE) * 2;
    app.globalData.playerInitialY = (this.data.playerInitialY + 0.5 * WALL_SIZE) * 2;
    app.globalData.exitX = this.data.exitX * 2;
    app.globalData.exitY = this.data.exitY * 2;
    app.globalData.key1 = [{
      x: WALL_SIZE*2 * (this.data.key1[0].x + 0.5) - (KEY_WIDTH / 2), 
      y: WALL_SIZE*2 * (this.data.key1[0].y + 0.5) - (KEY_HEIGHT / 2)
    }];
    app.globalData.key2 = [{
      x: WALL_SIZE*2 * (this.data.key2[0].x + 0.5) - (KEY_WIDTH / 2), 
      y: WALL_SIZE*2 * (this.data.key2[0].y + 0.5) - (KEY_HEIGHT / 2)
    }];
    app.globalData.key3 = [{
      x: WALL_SIZE*2 * (this.data.key3[0].x + 0.5) - (KEY_WIDTH / 2), 
      y: WALL_SIZE*2 * (this.data.key3[0].y + 0.5) - (KEY_HEIGHT / 2)
    }];
    app.globalData.key4 = [{
      x: WALL_SIZE*2 * (this.data.key4[0].x + 0.5) - (KEY_WIDTH / 2), 
      y: WALL_SIZE*2 * (this.data.key4[0].y + 0.5) - (KEY_HEIGHT / 2)
    }];
    app.globalData.enemyInitialX = (this.data.enemyInitialX + 0.5 * WALL_SIZE) * 2;
    app.globalData.enemyInitialY = (this.data.enemyInitialY + 0.5 * WALL_SIZE) * 2;
    
    // Start countdown and key animation
    this.countdown();
    this.startKeyAnimation();

    this.drawPreview();
  },

  startKeyAnimation() {
    let increasing = false;
    this.keyAnimationTimer = setInterval(() => {
      let alpha = this.data.keyAlpha;
      
      if (increasing) {
        alpha += 0.15;  // Faster brightening
        if (alpha >= 1.5) {  // Allow it to go brighter than 1
          alpha = 1.5;
          increasing = false;
        }
      } else {
        alpha -= 0.15;  // Faster dimming
        if (alpha <= 0.2) {  // Dimmer minimum
          alpha = 0.2;
          increasing = true;
        }
      }
      
      this.setData({ keyAlpha: alpha });
      if (this.ctx) {
        this.drawPreview();
      }
    }, 40);  // Slightly faster animation
  },

  onReady() {
    const query = wx.createSelectorQuery();
    query.select('#previewCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = this.data.canvasWidth * dpr;
        canvas.height = this.data.canvasHeight * dpr;
        ctx.scale(dpr, dpr);
        
        this.ctx = ctx;  // Store ctx for reuse
        this.drawPreview();
      });
  },

  drawPreview() {
    const ctx = this.ctx;
    if (!ctx) return;

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
    const offsetX = (this.data.canvasWidth - mazeWidth * scale) / 2 + this.data.offsetX;
    const offsetY = (this.data.canvasHeight - mazeHeight * scale) / 2 + this.data.offsetY;

    // Draw background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);

    // Draw title centered between top of screen and top of maze
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Level 7 Preview', this.data.canvasWidth / 2, offsetY / 2);

    // Draw maze
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Draw paths
    ctx.fillStyle = '#e6e6e6';
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
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    for (let y = 0; y < GRID.length; y++) {
      for (let x = 0; x < GRID[0].length; x++) {
        if (GRID[y][x] === 1) {
          ctx.rect(x * WALL_SIZE, y * WALL_SIZE, WALL_SIZE, WALL_SIZE);
        }
      }
    }
    ctx.fill();

    // Draw exit
    ctx.fillStyle = '#54de72';
    ctx.fillRect(this.data.exitX, this.data.exitY, WALL_SIZE, WALL_SIZE);

    // Draw start position
    ctx.fillStyle = '#54de72';
    ctx.fillRect(this.data.playerInitialX, this.data.playerInitialY, WALL_SIZE, WALL_SIZE);

    // Update key positions to match the actual game
    const keys = [
      { x: this.data.key1[0].x, y: this.data.key1[0].y },  // key1 position
      { x: this.data.key2[0].x, y: this.data.key2[0].y },  // key2 position
      { x: this.data.key3[0].x, y: this.data.key3[0].y },  // key3 position
      { x: this.data.key4[0].x, y: this.data.key4[0].y }  // key4 position
    ];

    // Draw all keys with current alpha and white color
    ctx.save();
    keys.forEach(keyPos => {
      // Add glow effect
      ctx.shadowColor = 'rgba(74, 158, 255, 0.8)';
      ctx.shadowBlur = 10;
      
      // Draw a white diamond shape for each key
      ctx.fillStyle = `rgba(74, 158, 255, ${this.data.keyAlpha})`;
      ctx.beginPath();
      ctx.moveTo(keyPos.x * WALL_SIZE + WALL_SIZE/2, keyPos.y * WALL_SIZE); // Top
      ctx.lineTo((keyPos.x + 1) * WALL_SIZE, keyPos.y * WALL_SIZE + WALL_SIZE/2); // Right
      ctx.lineTo(keyPos.x * WALL_SIZE + WALL_SIZE/2, (keyPos.y + 1) * WALL_SIZE); // Bottom
      ctx.lineTo(keyPos.x * WALL_SIZE, keyPos.y * WALL_SIZE + WALL_SIZE/2); // Left
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();

    ctx.restore();  // This restores from the maze transform

    // Draw countdown number at the bottom (outside of maze transform)
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${this.data.countdownOpacity})`;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(
        this.data.countdown.toString(),
        this.data.canvasWidth / 2,
        this.data.canvasHeight - 80
    );
    ctx.restore();
  },

  onUnload() {
    // Clear all animation timers
    if (this.keyAnimationTimer) {
      clearInterval(this.keyAnimationTimer);
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    if (this.fadeOutTimer) {
      clearTimeout(this.fadeOutTimer);
    }
    if (this.fadeInTimer) {
      clearTimeout(this.fadeInTimer);
    }
    // Reset countdown value for when user comes back
    this.setData({
      countdown: 5,
      countdownOpacity: 1
    });
  },

  countdown() {
    this.countdownTimer = setInterval(() => {  // Store the timer reference
      if (this.data.countdown <= 1) {
        clearInterval(this.countdownTimer);
        if (this.keyAnimationTimer) {
          clearInterval(this.keyAnimationTimer);
        }
        wx.redirectTo({
          url: `./play?level=7`
        });
      } else {
        const fadeOut = () => {
          let opacity = this.data.countdownOpacity;
          opacity -= 0.1;
          
          if (opacity > 0) {
            this.setData({ countdownOpacity: opacity });
            this.fadeOutTimer = setTimeout(fadeOut, 16);  // Store the timer reference
          } else {
            this.setData({
              countdown: this.data.countdown - 1,
              countdownOpacity: 0
            });
            fadeIn();
          }
        };

        const fadeIn = () => {
          let opacity = this.data.countdownOpacity;
          opacity += 0.1;
          
          if (opacity < 1) {
            this.setData({ countdownOpacity: opacity });
            this.fadeInTimer = setTimeout(fadeIn, 16);  // Store the timer reference
          }
        };

        fadeOut();
      }
    }, 1000);
  },

  handleTouchStart(e) {
    const touch = e.touches[0];
    this.setData({
      lastTouchX: touch.clientX,
      lastTouchY: touch.clientY
    });
  },

  handleTouchMove(e) {
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.data.lastTouchX;
    const deltaY = touch.clientY - this.data.lastTouchY;

    this.setData({
      offsetX: this.data.offsetX + deltaX,
      offsetY: this.data.offsetY + deltaY,
      lastTouchX: touch.clientX,
      lastTouchY: touch.clientY
    });

    this.drawPreview();
  },

  getMazeGrid() {
    // Return the grid layout for the maze
    return [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1],
      [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
      [1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1],
      [1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
  }
}); 
