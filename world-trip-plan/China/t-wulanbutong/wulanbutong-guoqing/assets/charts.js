(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // --- Chart 1: daily mileage ---
  var mileageEl = document.getElementById('chart-mileage');
  if (mileageEl) {
    var chartMileage = echarts.init(mileageEl, null, { renderer: 'svg' });
    chartMileage.setOption({
      animation: false,
      grid: { left: 48, right: 24, top: 40, bottom: 36 },
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        backgroundColor: '#fff',
        borderColor: rule,
        textStyle: { color: ink, fontSize: 13 },
        formatter: function(p) {
          return p[0].name + '：' + p[0].value + ' km';
        }
      },
      xAxis: {
        type: 'category',
        data: ['D1 出发', 'D2 入园', 'D3 核心日', 'D4 西线', 'D5 蛤蟆坝', 'D6 大环', 'D7 返京'],
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        axisLabel: { color: muted, fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        name: 'km',
        nameTextStyle: { color: muted },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } },
        axisLabel: { color: muted, fontSize: 12 }
      },
      series: [{
        type: 'bar',
        barWidth: '52%',
        data: [400, 160, 60, 50, 150, 330, 670],
        itemStyle: {
          color: function(p) {
            return (p.dataIndex === 0 || p.dataIndex === 6) ? accent2 : accent;
          },
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          color: ink,
          fontSize: 12,
          fontWeight: 600,
          formatter: '{c}'
        }
      }]
    });
    window.addEventListener('resize', function() { chartMileage.resize(); });
  }

  // --- Chart 2: budget donut ---
  var budgetEl = document.getElementById('chart-budget');
  if (budgetEl) {
    var chartBudget = echarts.init(budgetEl, null, { renderer: 'svg' });
    chartBudget.setOption({
      animation: false,
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        backgroundColor: '#fff',
        borderColor: rule,
        textStyle: { color: ink, fontSize: 13 },
        formatter: function(p) {
          return p.name + '：¥' + p.value + '（' + p.percent + '%）';
        }
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: muted, fontSize: 12 }
      },
      series: [{
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: '#fff', borderWidth: 2 },
        label: {
          show: true,
          color: ink,
          fontSize: 12,
          formatter: function(p) {
            return '¥' + p.value;
          }
        },
        labelLine: { lineStyle: { color: rule } },
        data: [
          { value: 3550, name: '住宿 6晚', itemStyle: { color: accent } },
          { value: 1450, name: '油费（过路0）', itemStyle: { color: accent2 } },
          { value: 1400, name: '餐饮 7天', itemStyle: { color: muted } },
          { value: 660, name: '门票+骑马', itemStyle: { color: accent + '99' } }
        ]
      }]
    });
    window.addEventListener('resize', function() { chartBudget.resize(); });
  }
})();
