(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();

  var baseAxis = {
    axisLine: { lineStyle: { color: rule } },
    axisTick: { show: false },
    axisLabel: { color: muted, fontSize: 11 }
  };

  var monoLabel = function (color, size) {
    return { show: true, position: 'top', color: color, fontSize: size || 11, fontFamily: 'DMMono, monospace' };
  };

  // ---------- Chart 1: 逐年行程节奏（境外+国内堆叠） ----------
  var elDays = document.getElementById('chart-days');
  if (elDays) {
    var chartDays = echarts.init(elDays, null, { renderer: 'svg' });
    chartDays.setOption({
      animation: false,
      color: [accent, accent2],
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        axisPointer: { type: 'shadow' },
        valueFormatter: function (v) { return v + ' 天'; }
      },
      legend: {
        top: 0,
        itemWidth: 14,
        itemHeight: 9,
        textStyle: { color: muted, fontSize: 12 }
      },
      grid: { left: 8, right: 16, top: 42, bottom: 8, containLabel: true },
      xAxis: {
        type: 'category',
        data: ['2026', '2027', '2028', '2029', '2030', '2031'],
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        axisLabel: { color: muted, fontSize: 11, interval: 0 }
      },
      yAxis: Object.assign({}, baseAxis, {
        type: 'value',
        name: '天',
        nameTextStyle: { color: muted, fontSize: 11 },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      }),
      series: [
        {
          name: '境外窗口',
          type: 'bar',
          stack: 'total',
          barWidth: '40%',
          itemStyle: { borderRadius: [0, 0, 0, 0] },
          data: [61, 215, 123, 193, 61, 94]
        },
        {
          name: '国内段',
          type: 'bar',
          stack: 'total',
          barWidth: '40%',
          itemStyle: { borderRadius: [3, 3, 0, 0] },
          label: {
            show: true,
            position: 'top',
            color: ink,
            fontSize: 11,
            fontFamily: 'DMMono, monospace',
            formatter: function (p) {
              var overseas = [61, 215, 123, 193, 61, 94][p.dataIndex];
              var domestic = [0, 44, 97, 44, 52, 0][p.dataIndex];
              return overseas + domestic + ' 天';
            }
          },
          data: [0, 44, 97, 44, 52, 0]
        }
      ]
    });
    window.addEventListener('resize', function () { chartDays.resize(); });
  }

  // ---------- Chart 2: 国内六段天数与预算 ----------
  var elDomestic = document.getElementById('chart-domestic');
  if (elDomestic) {
    var chartDomestic = echarts.init(elDomestic, null, { renderer: 'svg' });
    chartDomestic.setOption({
      animation: false,
      color: [accent, accent2],
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        axisPointer: { type: 'shadow' },
        formatter: function (items) {
          var html = items[0].name.replace(/\n/g, '') + '<br/>';
          items.forEach(function (it) {
            var unit = it.seriesName === '预算' ? ' 万元' : ' 天';
            html += it.marker + it.seriesName + '：' + it.value + unit + '<br/>';
          });
          return html;
        }
      },
      legend: {
        top: 0,
        itemWidth: 14,
        itemHeight: 9,
        textStyle: { color: muted, fontSize: 12 }
      },
      grid: { left: 8, right: 8, top: 42, bottom: 8, containLabel: true },
      xAxis: {
        type: 'category',
        data: ['段一\n东北华北盛夏', '段二\n华南暖冬闽台', '段三\n西北金秋青藏', '段四\n江南西南早春', '段五\n中原湘渝黔春', '机动池\n可选与补漏'],
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        axisLabel: { color: muted, fontSize: 10.5, lineHeight: 15, interval: 0 }
      },
      yAxis: [
        Object.assign({}, baseAxis, {
          type: 'value',
          name: '天',
          nameTextStyle: { color: muted, fontSize: 11 },
          splitLine: { lineStyle: { color: rule, type: 'dashed' } }
        }),
        Object.assign({}, baseAxis, {
          type: 'value',
          name: '万元',
          nameTextStyle: { color: muted, fontSize: 11 },
          splitLine: { show: false }
        })
      ],
      series: [
        {
          name: '天数',
          type: 'bar',
          barWidth: '38%',
          itemStyle: { borderRadius: [3, 3, 0, 0] },
          label: monoLabel(ink, 11),
          data: [44, 48, 72, 36, 37, 15]
        },
        {
          name: '预算',
          type: 'line',
          yAxisIndex: 1,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { width: 2.5 },
          label: {
            show: true,
            position: 'top',
            color: accent2,
            fontSize: 10.5,
            fontFamily: 'DMMono, monospace',
            formatter: function (p) { return p.value + '万'; }
          },
          data: [3.0, 4.0, 6.3, 2.7, 2.6, 1.0]
        }
      ]
    });
    window.addEventListener('resize', function () { chartDomestic.resize(); });
  }

  // ---------- Chart 3: 五年总预算分项构成 ----------
  var elItems = document.getElementById('chart-items');
  if (elItems) {
    var chartItems = echarts.init(elItems, null, { renderer: 'svg' });
    chartItems.setOption({
      animation: false,
      color: [accent, accent2],
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        axisPointer: { type: 'shadow' },
        valueFormatter: function (v) { return v + ' 万元'; }
      },
      legend: {
        top: 0,
        itemWidth: 14,
        itemHeight: 9,
        textStyle: { color: muted, fontSize: 12 }
      },
      grid: { left: 8, right: 16, top: 42, bottom: 8, containLabel: true },
      xAxis: {
        type: 'category',
        data: ['住宿', '餐饮', '洲际机票', '区域交通', '活动门票', '签证保险疫苗', '装备购物与应急'],
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        axisLabel: { color: muted, fontSize: 10.5, interval: 0 }
      },
      yAxis: Object.assign({}, baseAxis, {
        type: 'value',
        name: '万元',
        nameTextStyle: { color: muted, fontSize: 11 },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      }),
      series: [
        {
          name: '境外',
          type: 'bar',
          stack: 'total',
          barWidth: '40%',
          data: [33, 26, 27, 11, 24, 11.5, 24.5]
        },
        {
          name: '国内',
          type: 'bar',
          stack: 'total',
          barWidth: '40%',
          itemStyle: { borderRadius: [3, 3, 0, 0] },
          label: {
            show: true,
            position: 'top',
            color: ink,
            fontSize: 10.5,
            fontFamily: 'DMMono, monospace',
            formatter: function (p) {
              var overseas = [33, 26, 27, 11, 24, 11.5, 24.5][p.dataIndex];
              return (overseas + p.value).toFixed(1).replace(/\.0$/, '');
            }
          },
          data: [7, 5, 0, 5, 1.8, 0, 1.5]
        }
      ]
    });
    window.addEventListener('resize', function () { chartItems.resize(); });
  }
})();
