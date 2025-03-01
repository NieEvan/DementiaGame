const wxCharts = require('../../utils/wxcharts.js');

Page({
  data: {
    gameHistory: []
  },

  onLoad: function() {
    this.loadGameHistory();
  },

  onReady: function() {
    if (this.data.gameHistory.length > 0) {
      this.drawScoreChart();
    }
  },

  loadGameHistory: function() {
    const db = wx.cloud.database();
    
    db.collection('games')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get({
        success: res => {
          this.setData({
            gameHistory: res.data
          }, () => {
            if (this.data.gameHistory.length > 0) {
              this.drawScoreChart();
            }
          });
        },
        fail: err => {
          console.error('Failed to fetch game history', err);
          wx.showToast({
            title: 'Failed to load history',
            icon: 'none'
          });
        }
      });
  },

  drawScoreChart: function() {
    try {
      const scores = this.data.gameHistory
        .map(game => game.score)
        .reverse(); // Show oldest to newest
      
      const windowWidth = wx.getSystemInfoSync().windowWidth;
      
      new wxCharts({
        canvasId: 'scoreChart',
        type: 'line',
        categories: scores.map((_, index) => `Game ${index + 1}`),
        series: [{
          name: 'Score',
          data: scores,
          format: function (val) {
            return val.toFixed(0);
          }
        }],
        yAxis: {
          title: 'Score',
          format: function (val) {
            return val.toFixed(0);
          },
          min: 0
        },
        width: windowWidth - 32,
        height: 150,
        dataLabel: false,
        legend: false,
        extra: {
          lineStyle: 'curve'
        }
      });
    } catch (error) {
      console.error('Error drawing chart:', error);
    }
  }
});