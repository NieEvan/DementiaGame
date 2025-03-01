App({
  globalData: {
    level1Completed: false,
    level2Completed: false,
    level3Completed: false,
    level4Completed: false,
    level5Completed: false,
    level6Completed: false,
    level7Completed: false,
    level8Completed: false,
    level9Completed: false,
    unlockedLevels: [1], // Start with level 1 unlocked
    initialized: false,
    cloudReady: false,
    playerInitialX: 0,
    playerInitialY: 0,
    enemyInitialX: 0,
    enemyInitialY: 0,
    exitX: 0,
    exitY: 0,
    key1: [{ x: 0, y: 0 }],
    key2: [{ x: 0, y: 0 }],
    key3: [{ x: 0, y: 0 }],
    key4: [{ x: 0, y: 0 }],
  },
  
  unlockLevel(levelNumber) {
    if (!this.globalData.unlockedLevels.includes(levelNumber)) {
      this.globalData.unlockedLevels.push(levelNumber);
      // Save to storage
      wx.setStorageSync('unlockedLevels', this.globalData.unlockedLevels);
    }
  },

  onLaunch: function () {
    // Initialize completion states from storage
    this.globalData.level1Completed = wx.getStorageSync('level1Completed') || false;
    this.globalData.level2Completed = wx.getStorageSync('level2Completed') || false;
    this.globalData.level3Completed = wx.getStorageSync('level3Completed') || false;
    this.globalData.level4Completed = wx.getStorageSync('level4Completed') || false;
    this.globalData.level5Completed = wx.getStorageSync('level5Completed') || false;
    this.globalData.level6Completed = wx.getStorageSync('level6Completed') || false;
    this.globalData.level7Completed = wx.getStorageSync('level7Completed') || false;
    this.globalData.level8Completed = wx.getStorageSync('level8Completed') || false;
    this.globalData.level9Completed = wx.getStorageSync('level9Completed') || false;
    
    // Load unlocked levels from storage
    const savedLevels = wx.getStorageSync('unlockedLevels');
    if (savedLevels) {
      this.globalData.unlockedLevels = savedLevels;
    }

    // Mark as initialized
    this.globalData.initialized = true;

    if (!wx.cloud) {
      console.error('Please use WeChat version 2.2.3 or above')
    } else {
      wx.cloud.init({
        env: 'memory-app-7gb1hmbba13c9df9',
        traceUser: true,
        success: () => {
          console.log('Cloud environment initialized');
          this.globalData.cloudReady = true;
        },
        fail: (err) => {
          console.error('Cloud initialization failed', err);
        }
      })
    }
  },

  onShow: function() {
    // Ensure initialization is complete
    if (!this.globalData.initialized) {
      this.onLaunch();
    }
  }
})