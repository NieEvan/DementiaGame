Page({
  data: {
    gridSize: 3,
    tiles: [],
    pattern: [],
    playerPattern: [],
    isShowingPattern: false,
    level: 1,
    score: 0,
    gameMessage: 'Get Ready...',
    initialPatternLength: 3,
    levelStartTime: 0,
    levelTimes: [], // Array to store time spent on each level
    isGameOver: false,
    finalScore: 0
  },

  onLoad() {
    this.initGame();
    setTimeout(() => {
      this.setData({ gameMessage: 'Watch the pattern...' }, () => {
        this.startPattern();
      });
    }, 1500);
  },

  initGame() {
    const totalTiles = this.data.gridSize * this.data.gridSize;
    const tiles = Array(totalTiles).fill().map(() => ({
      isLit: false,
      isClicked: false
    }));

    this.setData({ 
      tiles,
      playerPattern: [],
    });
  },

  startPattern() {
    this.setData({
      levelStartTime: Date.now()
    });
    this.generatePattern();
  },

  generatePattern() {
    const pattern = [];
    const patternLength = this.data.initialPatternLength + Math.floor(this.data.level) - 1;
    const totalTiles = this.data.gridSize * this.data.gridSize;

    for (let i = 0; i < patternLength; i++) {
      pattern.push(Math.floor(Math.random() * totalTiles));
    }

    this.setData({ 
      pattern,
      gameMessage: 'Watch carefully...'
    }, () => {
      setTimeout(() => {
        this.showPattern();
      }, 1500);
    });
  },

  showPattern() {
    this.setData({ isShowingPattern: true });
    let currentIndex = 0;

    const showNext = () => {
      if (currentIndex >= this.data.pattern.length) {
        setTimeout(() => {
          this.setData({
            isShowingPattern: false,
            gameMessage: 'Your turn! Repeat the pattern'
          });
        }, 500);
        return;
      }

      const tileIndex = this.data.pattern[currentIndex];
      const tiles = this.data.tiles.map((tile, index) => ({
        ...tile,
        isLit: index === tileIndex
      }));

      this.setData({ tiles });

      setTimeout(() => {
        const tiles = this.data.tiles.map(tile => ({
          ...tile,
          isLit: false
        }));
        this.setData({ tiles });

        currentIndex++;
        const baseDelay = Math.max(200 - (this.data.level * 10), 100);
        setTimeout(showNext, baseDelay);
      }, 800);
    };

    showNext();
  },

  onTileTap(e) {
    if (this.data.isShowingPattern) return;

    const index = e.currentTarget.dataset.index;
    const playerPattern = [...this.data.playerPattern, index];
    const currentStep = playerPattern.length - 1;

    if (index !== this.data.pattern[currentStep]) {
      const tiles = this.data.tiles.map((tile, i) => ({
        ...tile,
        isError: i === index
      }));
      
      this.setData({ tiles });

      setTimeout(() => {
        this.setData({
          tiles: this.data.tiles.map(tile => ({ ...tile, isError: false }))
        });
        setTimeout(() => {
          this.setData({
            tiles: this.data.tiles.map((tile, i) => ({ ...tile, isError: i === index }))
          });
          setTimeout(() => {
            this.setData({
              tiles: this.data.tiles.map(tile => ({ ...tile, isError: false }))
            });
            this.gameOver();
          }, 200);
        }, 200);
      }, 200);
      return;
    }

    const tiles = this.data.tiles.map((tile, i) => ({
      ...tile,
      isClicked: i === index
    }));

    this.setData({ 
      playerPattern,
      tiles
    });

    if (playerPattern.length === this.data.pattern.length) {
      setTimeout(() => {
        this.levelComplete();
      }, 300);
    } else {
      setTimeout(() => {
        const tiles = this.data.tiles.map(tile => ({
          ...tile,
          isClicked: false
        }));
        this.setData({ tiles });
      }, 300);
    }
  },

  levelComplete() {
    const levelTime = Date.now() - this.data.levelStartTime;
    const levelTimes = [...this.data.levelTimes];
    levelTimes[this.data.level - 1] = levelTime;

    const score = this.data.score + (this.data.level * 100);
    const newLevel = this.data.level + 1;
    const newGridSize = Math.min(3 + Math.floor((newLevel - 1) / 2), 6);
    
    this.setData({
      level: newLevel,
      score,
      playerPattern: [],
      gameMessage: 'Great! Next level...',
      gridSize: newGridSize,
      tiles: [], // Clear tiles first
      levelTimes
    }, () => {
      this.initGame();
    });

    setTimeout(() => {
      this.setData({ gameMessage: 'Watch the pattern...' }, () => {
        this.startPattern();
      });
    }, 1000);
  },

  gameOver() {
    this.setData({
      gameMessage: 'Game Over!',
      isGameOver: true,
      finalScore: this.data.score
    }, () => {
      this.saveGameData();
    });
  },

  restartGame() {
    this.setData({
      gridSize: 3,
      tiles: [],
      pattern: [],
      playerPattern: [],
      isShowingPattern: false,
      level: 1,
      score: 0,
      gameMessage: 'Get Ready...',
      isGameOver: false,
      finalScore: 0,
      levelTimes: []
    }, () => {
      this.initGame();
      setTimeout(() => {
        this.setData({ gameMessage: 'Watch the pattern...' }, () => {
          this.startPattern();
        });
      }, 1500);
    });
  },

  goHome() {
    wx.navigateBack();
  },

  checkPattern: function(userPattern) {
    const currentLevel = this.data.currentLevel
    const levelTime = Date.now() - this.data.levelStartTime
    
    if (this.comparePatterns(userPattern, this.data.pattern)) {
      // Store level completion time
      let times = this.data.levelTimes
      times[currentLevel - 1] = levelTime
      this.setData({ levelTimes: times })
      
      if (currentLevel === this.data.maxLevels) {
        this.saveGameData()
      }
      // ... rest of existing success code ...
    } else {
      this.saveGameData() // Save data even on failure
      // ... rest of existing failure code ...
    }
  },

  saveGameData() {
    const db = wx.cloud.database();
    
    db.collection('games').add({
      data: {
        score: this.data.score,
        levelTimes: this.data.levelTimes,
        maxLevelReached: this.data.level,
        timestamp: db.serverDate()
      },
      success: res => {
        console.log('Game data saved successfully', res);
        wx.showToast({
          title: 'Score saved!',
          icon: 'success'
        });
      },
      fail: err => {
        console.error('Failed to save game data', err);
        wx.showToast({
          title: 'Failed to save score',
          icon: 'error'
        });
      }
    });
  }
});