Page({
  data: {
    levels: [
      { 
        levelNumber: 1, 
        unlocked: true,
        stars: 0,
        position: {
          left: '20%',
          top: '15%'
        }
      },
      { 
        levelNumber: 2, 
        unlocked: false,
        stars: 0,
        position: {
          left: '40%',
          top: '15%'
        }
      },
      { 
        levelNumber: 3, 
        unlocked: false,
        stars: 0,
        position: {
          left: '60%',
          top: '15%'
        }
      },
      {
        levelNumber: 4,
        unlocked: false,
        stars: 0,
        position: {
          left: '80%',
          top: '45%'
        }
      },
      {
        levelNumber: 5,
        unlocked: false,
        stars: 0,
        position: {
          left: '30%',
          top: '45%'
        }
      },
      {
        levelNumber: 6,
        unlocked: false,
        stars: 0,
        position: {
          left: '60%',
          top: '45%'
        }
      },
      {
        levelNumber: 7,
        unlocked: false,
        stars: 0,
        position: {
          left: '90%',
          top: '75%'
        }
      },
      {
        levelNumber: 8,
        unlocked: false,
        stars: 0,
        position: {
          left: '90%',
          top: '75%'
        }
      },  
      {
        levelNumber: 9,
        unlocked: false,
        stars: 0,
        position: {
          left: '90%',
          top: '75%'
        }
      }
    ],
    isDescriptionExpanded: true
  },

  onLoad() {
    this.checkLevelStatus();
  },

  onShow() {
    const app = getApp();
    this.setData({
      'levels[0].unlocked': true,
      'levels[1].unlocked': app.globalData.level1Completed,
      'levels[2].unlocked': app.globalData.level2Completed,
      'levels[3].unlocked': app.globalData.level3Completed,
      'levels[4].unlocked': app.globalData.level4Completed,
      'levels[5].unlocked': app.globalData.level5Completed,
      'levels[6].unlocked': app.globalData.level6Completed,
      'levels[7].unlocked': app.globalData.level7Completed,
      'levels[8].unlocked': app.globalData.level8Completed,
    });
  },

  checkLevelStatus() {
    const app = getApp();
    const level1Completed = app.globalData.level1Completed || wx.getStorageSync('level1Completed');
    const level2Completed = app.globalData.level2Completed || wx.getStorageSync('level2Completed');
    const level3Completed = app.globalData.level3Completed || wx.getStorageSync('level3Completed');
    const level4Completed = app.globalData.level4Completed || wx.getStorageSync('level4Completed');
    const level5Completed = app.globalData.level5Completed || wx.getStorageSync('level5Completed');
    const level6Completed = app.globalData.level6Completed || wx.getStorageSync('level6Completed');
    const level7Completed = app.globalData.level7Completed || wx.getStorageSync('level7Completed');
    const level8Completed = app.globalData.level8Completed || wx.getStorageSync('level8Completed');
    const level9Completed = app.globalData.level9Completed || wx.getStorageSync('level9Completed');
    if (level1Completed) {
      this.setData({
        'levels[0].stars': 3,
        'levels[1].unlocked': true
      });
    }
    if (level2Completed) {
      this.setData({
        'levels[1].stars': 3,
        'levels[2].unlocked': true
      });
    }
    if (level3Completed) {
      this.setData({
        'levels[2].stars': 3,
        'levels[3].unlocked': true
      });
    }
    if (level4Completed) {
      this.setData({
        'levels[3].stars': 3,
        'levels[4].unlocked': true
      });
    }
    if (level5Completed) {
      this.setData({
        'levels[4].stars': 3,
        'levels[5].unlocked': true
      });
    }
    if (level6Completed) {
      this.setData({
        'levels[5].stars': 3,
        'levels[6].unlocked': true
      });
    }
    if (level7Completed) {
      this.setData({
        'levels[6].stars': 3,
        'levels[7].unlocked': true
      });
    }
    if (level8Completed) {
      this.setData({
        'levels[7].stars': 3,
        'levels[8].unlocked': true
      });
    }
    if (level9Completed) {
      this.setData({
        'levels[8].stars': 3,
      });
    }
  },

  onLevelSelect(e) {
    const levelNumber = e.currentTarget.dataset.level;
    const level = this.data.levels.find(l => l.levelNumber === levelNumber);
    
    if (level && level.unlocked) {
      wx.navigateTo({
        url: `/pages/game/play/level${levelNumber}/preview?level=${levelNumber}`
      });
    } else {
      wx.showToast({
        title: 'Complete previous level first',
        icon: 'none'
      });
    }
  },

  toggleDescription() {
    this.setData({
      isDescriptionExpanded: !this.data.isDescriptionExpanded
    });
  }
}); 