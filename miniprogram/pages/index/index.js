// pages/index/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    userName: 'Evan',  // Default greeting
    alzheimerPred: 23,
    isLoading: true,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    stats: {
      memoryScore: 85,
      reactionTime: 92,
      spatialAwareness: 78,
      patternRecognition: 88,
      cognitiveFlexibility: 75
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
      console.log('UserProfile: ', this.data.userInfo);

    }
    const app = getApp();
    
    // Wait for app initialization
    const checkInitialization = () => {
      if (app.globalData.initialized) {
        this.setData({ isLoading: false });
      } else {
        setTimeout(checkInitialization, 100);
      }
    };
    
    checkInitialization();

    // Try to get cached user info first
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userName: userInfo.nickName
      });
    } else {
      // Request user profile when needed
      wx.getUserProfile({
        desc: 'Used for personalized greeting', // Purpose description required
        success: (res) => {
          wx.setStorageSync('userInfo', res.userInfo);
          this.setData({
            userName: res.userInfo.nickName
          });
        },
        fail: (err) => {
          console.log('Failed to get user profile:', err);
        }
      });
    }
  },

  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {
    this.drawPentagon();
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },

  handleGameTab: function() {
    wx.navigateTo({
      url: '/pages/game/level-select/level-select'
    });
  },

  drawPentagon() {
    const query = wx.createSelectorQuery();
    query.select('#pentagonCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        const centerX = res[0].width / 2;
        const centerY = res[0].height / 2;
        const radius = Math.min(centerX, centerY) * 0.5;

        // Draw background grid pentagons
        this.drawPentagonGrid(ctx, centerX, centerY, radius);
        
        // Draw data pentagon
        this.drawDataPentagon(ctx, centerX, centerY, radius);
        
        // Draw labels
        this.drawLabels(ctx, centerX, centerY, radius);
      });
  },

  drawPentagonGrid(ctx, centerX, centerY, radius) {
    const levels = 5;
    for (let i = levels; i > 0; i--) {
      const currentRadius = (radius * i) / levels;
      this.drawPentagonShape(ctx, centerX, centerY, currentRadius, '#e6e8f0', 1, 'stroke');
    }
  },

  drawDataPentagon(ctx, centerX, centerY, radius) {
    // Use constant values between 0 and 1 for each aspect
    const values = [0.8, 0.6, 1, 0, 0.85];  // Fixed values for each aspect
    
    const points = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const scaledRadius = radius * values[i];
      
      points.push({
        x: centerX + scaledRadius * Math.cos(angle),
        y: centerY + scaledRadius * Math.sin(angle)
      });
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();

    // Update fill color to light blue with transparency
    ctx.fillStyle = 'rgba(30, 47, 111, 0.2)';  // #1e2f6f with opacity
    ctx.fill();
    // Update stroke color to solid blue
    ctx.strokeStyle = '#1e2f6f';  // Deep navy blue
    ctx.lineWidth = 2;
    ctx.stroke();
  },

  drawPentagonShape(ctx, centerX, centerY, radius, color, lineWidth, style) {
    const points = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      points.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();

    if (style === 'both' || style === 'fill') {
      ctx.fillStyle = 'rgba(51, 51, 51, 0.2)';
      ctx.fill();
    }
    if (style === 'both' || style === 'stroke') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  },

  drawLabels(ctx, centerX, centerY, radius) {
    const labels = ['Aspect 1', 'Aspect 2', 'Aspect 3', 'Aspect 4', 'Aspect 5'];
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#333';
    
    // Adjusted label positions to be even closer to pentagon corners
    const labelPositions = [
      { x: 0, y: -1.05, align: 'center', offsetX: 0, offsetY: 0 },     // Top
      { x: 0.85, y: -0.3, align: 'start', offsetX: 0, offsetY: 0 },    // Top right
      { x: 0.5, y: 0.8, align: 'start', offsetX: 0, offsetY: 0 },      // Bottom right
      { x: -0.5, y: 0.8, align: 'end', offsetX: 0, offsetY: 0 },       // Bottom left
      { x: -0.85, y: -0.3, align: 'end', offsetX: 0, offsetY: 0 }      // Top left
    ];

    labels.forEach((label, i) => {
      const pos = labelPositions[i];
      const x = centerX + (radius * 1.3 * pos.x);  // Reduced from 1.5 to 1.3
      const y = centerY + (radius * 1.3 * pos.y);  // Reduced from 1.5 to 1.3
      
      ctx.textAlign = pos.align;
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
    });
  }
})