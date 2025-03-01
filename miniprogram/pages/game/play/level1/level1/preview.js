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
    playerInitialX: 5 * WALL_SIZE,
    playerInitialY: 9 * WALL_SIZE,
    enemyInitialX: 5 * WALL_SIZE,
    enemyInitialY: 11 * WALL_SIZE,
    exitX: 6 * WALL_SIZE,
    exitY: 1 * WALL_SIZE,
    key1: [{x: 8, y: 6}],
    showTutorial: true,
    tutorialStep: 1,
    tutorialHoverOffset: 0,
    hoverAnimationTimer: null,
    countdownOpacity: 1,
    offsetX: 0,  // Track horizontal offset
    offsetY: 0,  // Track vertical offset
    lastTouchX: 0,  // Track last touch X position
    lastTouchY: 0,  // Track last touch Y position
  },

  // Add property to store the countdown timer
  countdownTimer: null,

  onLoad(options) {
    const windowInfo = wx.getWindowInfo();
    this.setData({
      canvasWidth: windowInfo.windowWidth,
      canvasHeight: windowInfo.windowHeight
    });

    app.globalData.playerInitialX = (this.data.playerInitialX + 0.5 * WALL_SIZE) * 2;
    app.globalData.playerInitialY = (this.data.playerInitialY + 0.5 * WALL_SIZE) * 2;
    app.globalData.exitX = this.data.exitX * 2;
    console.log("asdawdasd",app.globalData.exitX)
    app.globalData.exitY = this.data.exitY * 2;
    app.globalData.key1 = [{
      x: WALL_SIZE*2 * (this.data.key1[0].x + 0.5) - (KEY_WIDTH / 2), 
      y: WALL_SIZE*2 * (this.data.key1[0].y + 0.5) - (KEY_HEIGHT / 2)
    }];
    app.globalData.enemyInitialX = (this.data.enemyInitialX + 0.5 * WALL_SIZE) * 2;
    app.globalData.enemyInitialY = (this.data.enemyInitialY + 0.5 * WALL_SIZE) * 2;

    // Don't start countdown immediately
    if (!this.data.showTutorial) {
      this.countdown();
      this.startKeyAnimation();
    }

    // Start hover animation
    this.updateTutorialHover();
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
        this.drawMaze(this.ctx);
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
        this.drawMaze(ctx);
      });
  },

  drawMaze(ctx) {
    const GRID = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

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
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Level 1 Preview', this.data.canvasWidth / 2, offsetY / 2);

    // Draw maze
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // First draw all paths
    ctx.fillStyle = '#e6e6e6'; // Changed from #dcc873 to light gray
    ctx.beginPath();
    for (let y = 0; y < GRID.length; y++) {
      for (let x = 0; x < GRID[0].length; x++) {
        if (GRID[y][x] === 0) {
          ctx.rect(x * WALL_SIZE, y * WALL_SIZE, WALL_SIZE, WALL_SIZE);
        }
      }
    }
    ctx.fill();

    // Then draw all walls as one shape
    ctx.fillStyle = '#000000'; // Changed fromrgb(0, 0, 0) to dark gray
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
    const keys = this.data.key1;

    // Draw all keys with current alpha and blue color
    ctx.save();
    keys.forEach(keyPos => {
      // Add glow effect
      ctx.shadowColor = 'rgba(74, 158, 255, 0.8)';  // Changed to match blue key color
      ctx.shadowBlur = 10;
      
      // Draw a blue diamond shape for each key
      ctx.fillStyle = `rgba(74, 158, 255, ${this.data.keyAlpha})`; // Changed to #407dff
      ctx.beginPath();
      ctx.moveTo(keyPos.x * WALL_SIZE + WALL_SIZE/2, keyPos.y * WALL_SIZE); // Top
      ctx.lineTo((keyPos.x + 1) * WALL_SIZE, keyPos.y * WALL_SIZE + WALL_SIZE/2); // Right
      ctx.lineTo(keyPos.x * WALL_SIZE + WALL_SIZE/2, (keyPos.y + 1) * WALL_SIZE); // Bottom
      ctx.lineTo(keyPos.x * WALL_SIZE, keyPos.y * WALL_SIZE + WALL_SIZE/2); // Left
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();

    ctx.restore();

    // After drawing the maze, draw tutorial if needed
    if (this.data.showTutorial) {
      this.drawTutorial(ctx);
    }

    ctx.restore();  // This restores from the maze transform

    // Draw tutorial text and arrow if showing
    if (!this.data.showTutorial) {
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
      }
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
    
    // Clear hover animation timer
    if (this.data.hoverAnimationTimer) {
        clearInterval(this.data.hoverAnimationTimer);
    }
  },

  countdown() {
    this.countdownTimer = setInterval(() => {  // Store the timer reference
      if (this.data.countdown <= 1) {
        clearInterval(this.countdownTimer);
        if (this.keyAnimationTimer) {
          clearInterval(this.keyAnimationTimer);
        }
        wx.redirectTo({
          url: `./play?level=${this.data.currentLevel || 1}`
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

  drawTutorial(ctx) {
    const bubbleHeight = (this.data.tutorialStep === 3 || this.data.tutorialStep === 4) ? 180 : 160;
    const bubblePadding = 20;
    const bottomMargin = 20;
    const cornerRadius = 10;
    const topTextMargin = this.data.tutorialStep === 5 ? 12 : 
                         (this.data.tutorialStep === 3 || this.data.tutorialStep === 4) ? 35 : 25;
    const bottomTextMargin = 40;
    
    // Calculate maze dimensions and scaling (same as in drawMaze)
    const GRID_WIDTH = 12;
    const GRID_HEIGHT = 14;
    const mazeWidth = GRID_WIDTH * WALL_SIZE;
    const mazeHeight = GRID_HEIGHT * WALL_SIZE;
    const scale = Math.min(
      (this.data.canvasWidth * 0.8) / mazeWidth,
      (this.data.canvasHeight * 0.8) / mazeHeight
    );

    // Calculate maze offset (same as in drawMaze)
    const offsetX = (this.data.canvasWidth - mazeWidth * scale) / 2;
    const offsetY = (this.data.canvasHeight - mazeHeight * scale) / 2;
    
    // Only show dark overlay in step 1
    if (this.data.tutorialStep === 1) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    }

    // Draw semi-transparent overlay for bottom portion
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, this.data.canvasHeight - bubbleHeight - bottomMargin, 
      this.data.canvasWidth, bubbleHeight + bottomMargin);

    // Draw dialogue bubble
    ctx.fillStyle = '#212121';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    
    // Bubble rectangle
    const bubbleX = bubblePadding;
    const bubbleY = this.data.canvasHeight - bubbleHeight - bottomMargin + bubblePadding;
    const bubbleWidth = this.data.canvasWidth - (bubblePadding * 2);
    const actualBubbleHeight = bubbleHeight - (bubblePadding * 2);
    
    // Draw rounded rectangle manually
    ctx.beginPath();
    // Start from top left corner
    ctx.moveTo(bubbleX + cornerRadius, bubbleY);
    // Top edge
    ctx.lineTo(bubbleX + bubbleWidth - cornerRadius, bubbleY);
    // Top right corner
    ctx.arcTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + cornerRadius, cornerRadius);
    // Right edge
    ctx.lineTo(bubbleX + bubbleWidth, bubbleY + actualBubbleHeight - cornerRadius);
    // Bottom right corner
    ctx.arcTo(bubbleX + bubbleWidth, bubbleY + actualBubbleHeight, bubbleX + bubbleWidth - cornerRadius, bubbleY + actualBubbleHeight, cornerRadius);
    // Bottom edge
    ctx.lineTo(bubbleX + cornerRadius, bubbleY + actualBubbleHeight);
    // Bottom left corner
    ctx.arcTo(bubbleX, bubbleY + actualBubbleHeight, bubbleX, bubbleY + actualBubbleHeight - cornerRadius, cornerRadius);
    // Left edge
    ctx.lineTo(bubbleX, bubbleY + cornerRadius);
    // Top left corner
    ctx.arcTo(bubbleX, bubbleY, bubbleX + cornerRadius, bubbleY, cornerRadius);
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Function to wrap text
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
      const words = text.split(' ');
      let line = '';
      let lines = [];

      for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      // Calculate total height of text
      const totalHeight = lines.length * lineHeight;
      // Calculate starting Y position to center text vertically
      const startY = y - (totalHeight / 2);

      lines.forEach((line, i) => {
        context.fillText(line.trim(), x, startY + (i * lineHeight));
      });

      return startY + totalHeight; // Return the bottom position of the text
    }

    // Draw tutorial text based on step
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    const maxWidth = bubbleWidth - 40;
    const lineHeight = 24;
    const tutorialText = this.data.tutorialStep === 1 
      ? 'You will be shown a map of the maze for 5 seconds.'
      : this.data.tutorialStep === 2
      ? 'The green blocks represent the starting and exit positions'
      : this.data.tutorialStep === 3
      ? 'The white blinking diamond(s) are the artifacts you have to collect before going through the exit'
      : this.data.tutorialStep === 4
      ? 'As the level increases, the difficulty increases (larger mazes, more artifacts to collect)'
      : 'Now prepare to start your game...';
    
    const textBottom = wrapText(
      ctx,
      tutorialText,
      bubbleX + 20,
      bubbleY + topTextMargin + lineHeight,
      maxWidth,
      lineHeight
    );

    // Draw "Tap to continue" text with hover effect
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'white';
    ctx.fillText(
      'Tap to continue',
      this.data.canvasWidth - bubblePadding - 20,
      bubbleY + actualBubbleHeight - bottomTextMargin + this.data.tutorialHoverOffset + 10
    );

    // Draw red outlines around blocks in steps 2 and 3
    if (this.data.tutorialStep === 2 || this.data.tutorialStep === 3) {
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
      
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;

      // Draw outlines for green blocks only in step 2
      if (this.data.tutorialStep === 2) {
        // Draw red outline for exit
        ctx.strokeRect(
          this.data.exitX - 2, 
          this.data.exitY - 2, 
          WALL_SIZE + 4, 
          WALL_SIZE + 4
        );

        // Draw red outline for start position
        ctx.strokeRect(
          this.data.playerInitialX - 2, 
          this.data.playerInitialY - 2, 
          WALL_SIZE + 4, 
          WALL_SIZE + 4
        );
      }
      
      // Draw outline for key block in step 3
      if (this.data.tutorialStep === 3) {
        // Draw red outline for key position
        this.data.key1.forEach(keyPos => {
          ctx.strokeRect(
            keyPos.x * WALL_SIZE - 2,
            keyPos.y * WALL_SIZE - 2,
            WALL_SIZE + 4,
            WALL_SIZE + 4
          );
        });
      }
      
      ctx.restore();
    }
  },

  onContinue() {
    if (this.data.tutorialStep === 1) {
      this.setData({ tutorialStep: 2 });
      if (this.ctx) {
        this.drawMaze(this.ctx);
      }
    } else if (this.data.tutorialStep === 2) {
      this.setData({ tutorialStep: 3 });
      if (this.ctx) {
        this.drawMaze(this.ctx);
      }
    } else if (this.data.tutorialStep === 3) {
      this.setData({ tutorialStep: 4 });
      if (this.ctx) {
        this.drawMaze(this.ctx);
      }
    } else if (this.data.tutorialStep === 4) {
      this.setData({ tutorialStep: 5 });
      if (this.ctx) {
        this.drawMaze(this.ctx);
      }
    } else {
      // Start the preview
      this.setData({ 
        showTutorial: false,
        countdown: 5
      });
      this.countdown();
      this.startKeyAnimation();
      if (this.ctx) {
        this.drawMaze(this.ctx);
      }
    }
  },

  // Modify the hover animation function
  updateTutorialHover() {
    // Clear any existing timer
    if (this.data.hoverAnimationTimer) {
        clearInterval(this.data.hoverAnimationTimer);
    }

    const hoverTimer = setInterval(() => {
        const time = Date.now() / 1000;
        const hoverOffset = Math.sin(time * 4) * 3;  // Changed from 2 to 4 for faster oscillation
        
        // Update the canvas with new hover offset
        if (this.ctx) {
            this.drawMaze(this.ctx);
        }
        
        this.setData({ tutorialHoverOffset: hoverOffset });
    }, 16); // About 60fps

    this.setData({ hoverAnimationTimer: hoverTimer });
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

    this.drawMaze(this.ctx);
  }
}); 