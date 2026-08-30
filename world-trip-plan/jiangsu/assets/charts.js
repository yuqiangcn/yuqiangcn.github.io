(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue("--accent").trim();
  var accent2 = style.getPropertyValue("--accent2").trim();
  var ink = style.getPropertyValue("--ink").trim();
  var muted = style.getPropertyValue("--muted").trim();
  var rule = style.getPropertyValue("--rule").trim();
  var bg2 = style.getPropertyValue("--bg2").trim();

  var font = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif';

  // ---------- Chart 1: 预算构成 ----------
  var budgetEl = document.getElementById("chart-budget");
  if (budgetEl) {
    var budget = echarts.init(budgetEl, null, { renderer: "svg" });
    budget.setOption({
      animation: false,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        appendToBody: true,
        formatter: function (params) {
          var total = params.reduce(function (s, p) { return s + p.value; }, 0);
          var html = "<b>" + params[0].name + "</b>（全家合计约 " + (total / 10000).toFixed(2) + " 万）<br/>";
          params.forEach(function (p) {
            html += p.marker + " " + p.seriesName + "：¥" + p.value.toLocaleString() + "<br/>";
          });
          return html;
        }
      },
      legend: {
        top: 6,
        textStyle: { color: muted, fontFamily: font, fontSize: 12 },
        itemWidth: 14, itemHeight: 9
      },
      grid: { left: 96, right: 110, top: 42, bottom: 8, containLabel: false },
      xAxis: {
        type: "value",
        axisLabel: { color: muted, fontFamily: font, fontSize: 11, formatter: function (v) { return v / 10000 + "万"; } },
        splitLine: { lineStyle: { color: rule } }
      },
      yAxis: {
        type: "category",
        data: ["经济", "舒适（推荐）", "品质"],
        axisTick: { show: false },
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: ink, fontFamily: font, fontSize: 13, fontWeight: 600 }
      },
      series: [
        { name: "大交通", type: "bar", stack: "total", barWidth: 30, data: [4200, 4700, 6800], itemStyle: { color: accent } },
        { name: "市内+包车", type: "bar", stack: "total", data: [1400, 1600, 1800], itemStyle: { color: accent, opacity: 0.72 } },
        { name: "住宿", type: "bar", stack: "total", data: [6600, 9900, 17600], itemStyle: { color: accent2 } },
        { name: "餐饮", type: "bar", stack: "total", data: [4500, 7800, 15600], itemStyle: { color: accent2, opacity: 0.7 } },
        {
          name: "门票",
          type: "bar",
          stack: "total",
          data: [4200, 4200, 4300],
          itemStyle: { color: muted },
          label: {
            show: true,
            position: "right",
            fontFamily: font,
            fontSize: 12,
            fontWeight: 700,
            color: ink,
            formatter: function (p) {
              var sums = [20900, 28200, 46100];
              return "≈" + (sums[p.dataIndex] / 10000).toFixed(1) + " 万";
            }
          }
        }
      ]
    });
    window.addEventListener("resize", function () { budget.resize(); });
  }

  // ---------- Chart 2: 人均门票构成 ----------
  var ticketsEl = document.getElementById("chart-tickets");
  if (ticketsEl) {
    var tickets = echarts.init(ticketsEl, null, { renderer: "svg" });
    tickets.setOption({
      animation: false,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        appendToBody: true,
        formatter: function (params) {
          var p = params[0];
          var detail = {
            "南京": "钟山联票100 + 美龄宫30 + 鸡鸣寺10 + 台城30 + 总统府35",
            "扬州": "瘦西湖100 + 个园/何园/大明寺135 + 古运河夜游90",
            "苏州": "拙政园80 + 网师园夜园120 + 虎丘70 + 留园55 + 狮子林40 + 手摇船45 + 艺圃10",
            "上海": "豫园40 + 自然博物馆30"
          }[p.name];
          return "<b>" + p.name + "</b>：¥" + p.value + " / 人<br/><span style='color:" + muted + "'>" + detail + "</span>";
        }
      },
      grid: { left: 40, right: 70, top: 24, bottom: 8, containLabel: true },
      xAxis: {
        type: "value",
        axisLabel: { color: muted, fontFamily: font, fontSize: 11 },
        splitLine: { lineStyle: { color: rule } }
      },
      yAxis: {
        type: "category",
        data: ["上海", "南京", "扬州", "苏州"],
        axisTick: { show: false },
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: ink, fontFamily: font, fontSize: 13, fontWeight: 600 }
      },
      series: [{
        type: "bar",
        barWidth: 26,
        data: [
          { value: 70, itemStyle: { color: accent, opacity: 0.55 } },
          { value: 205, itemStyle: { color: accent, opacity: 0.75 } },
          { value: 325, itemStyle: { color: accent } },
          { value: 420, itemStyle: { color: accent2 } }
        ],
        label: {
          show: true,
          position: "right",
          fontFamily: font,
          fontSize: 12,
          fontWeight: 700,
          color: ink,
          formatter: "¥{c}"
        }
      }]
    });
    window.addEventListener("resize", function () { tickets.resize(); });
  }

  // ---------- Chart 3: 每日客流压力 ----------
  var crowdEl = document.getElementById("chart-crowd");
  if (crowdEl) {
    var days = [
      { d: "9.25", v: 4, note: "中秋 · 玄武湖/鸡鸣寺/台城" },
      { d: "9.26", v: 5, note: "周六 · 钟山/总统府" },
      { d: "9.27", v: 4, note: "假期末日 · 南博→扬州" },
      { d: "9.28", v: 1, note: "周一 · 瘦西湖/大明寺" },
      { d: "9.29", v: 1, note: "周二 · 个园/皮市街" },
      { d: "9.30", v: 2, note: "节前 · 运博→苏州/平江路" },
      { d: "10.1", v: 3, note: "国庆首日 · 西山避峰（市区顶流实际≈5）" },
      { d: "10.2", v: 3, note: "周五 · 苏博/网师园夜园" },
      { d: "10.3", v: 5, note: "峰值周六 · 虎丘7:30早场" },
      { d: "10.4", v: 5, note: "峰值周日 · 留园早场/艺圃" },
      { d: "10.5", v: 3, note: "峰谷周一 · 拙政园开门即入" },
      { d: "10.6", v: 2, note: "假期尾声 · 豫园/自博/外滩" },
      { d: "10.7", v: 1, note: "返京日 · D10动卧" }
    ];
    function crowdColor(v) {
      if (v >= 4) return accent2;
      if (v >= 2) return accent;
      return muted;
    }
    var crowd = echarts.init(crowdEl, null, { renderer: "svg" });
    crowd.setOption({
      animation: false,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        appendToBody: true,
        formatter: function (params) {
          var p = params[0];
          var day = days[p.dataIndex];
          return "<b>" + day.d + "</b>（压力 " + day.v + "/5）<br/><span style='color:" + muted + "'>" + day.note + "</span>";
        }
      },
      grid: { left: 36, right: 16, top: 30, bottom: 26, containLabel: true },
      xAxis: {
        type: "category",
        data: days.map(function (x) { return x.d; }),
        axisTick: { show: false },
        axisLine: { lineStyle: { color: rule } },
        axisLabel: { color: muted, fontFamily: font, fontSize: 11, interval: 0, rotate: 40 }
      },
      yAxis: {
        type: "value",
        max: 5,
        interval: 1,
        name: "压力等级",
        nameTextStyle: { color: muted, fontFamily: font, fontSize: 11 },
        axisLabel: { color: muted, fontFamily: font, fontSize: 11 },
        splitLine: { lineStyle: { color: rule } }
      },
      series: [{
        type: "bar",
        barWidth: "62%",
        data: days.map(function (x) {
          return { value: x.v, itemStyle: { color: crowdColor(x.v), opacity: x.v >= 4 ? 0.9 : 0.8 } };
        }),
        label: {
          show: true,
          position: "inside",
          fontFamily: font,
          fontSize: 10,
          color: "#fff",
          formatter: "{c}"
        },
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { color: accent2, type: "dashed", opacity: 0.6 },
          label: { show: true, position: "insideEndTop", fontFamily: font, fontSize: 11, color: accent2, formatter: "顶流禁排区" },
          data: [{ yAxis: 4.5 }]
        }
      }]
    });
    window.addEventListener("resize", function () { crowd.resize(); });
  }
})();
