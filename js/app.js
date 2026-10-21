(function () {
  const titles = { home: "首页", work: "工作台", msg: "消息", mine: "我的" };

  const icon = (d) =>
    `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;

  const msgIco = {
    people: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.2" r="2.8"/><path d="M5.8 19.2c.8-3.2 3.1-4.8 6.2-4.8s5.4 1.6 6.2 4.8"/></svg>`,
    inspect: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.2" cy="6.2" r="2"/><circle cx="17.8" cy="6.2" r="2"/><circle cx="6.2" cy="17.8" r="2"/><circle cx="17.8" cy="17.8" r="2"/><path d="M8.2 6.2h7.6M8.2 17.8h7.6M6.2 8.2v7.6M17.8 8.2v7.6"/><rect x="10" y="10" width="4" height="4" rx="0.8"/></svg>`
  };

  const messages = [
    { kind: "people", title: "人员预警", desc: "这是一条人员预警消息", time: "15:51:45", unread: 1 },
    { kind: "inspect", title: "巡检预警", desc: "无人机巡检识别到道路垃圾、电缆拖地等现场风险", time: "1分钟前", unread: 1 }
  ];

  const menuSvg = {
    sites: "M5 20V7.5L12 4l7 3.5V20 M9.5 20v-5h5v5",
    setting: "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z M4.5 12h2 M17.5 12h2 M6.2 6.2l1.5 1.5 M16.3 16.3l1.5 1.5 M6.2 17.8l1.5-1.5 M16.3 7.7l1.5-1.5",
    about: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z M12 11v5 M12 8v.5"
  };

  const mineMenus = [
    { id: "sites", name: "我的工地" },
    { id: "setting", name: "设置" },
    { id: "about", name: "关于" }
  ];

  const camPosCycle = ["pos-left", "pos-right", "pos-bottom", ""];
  const cameras = [
    { id: "g1", name: "1#门监控", group: "出入口" },
    { id: "g1a", name: "1#门安全通道门禁监控", group: "出入口" },
    { id: "g2a", name: "2#门监控1", group: "出入口" },
    { id: "g2b", name: "2#门监控2", group: "出入口" },
    { id: "g3out", name: "3#门外监控", group: "出入口" },
    { id: "g4", name: "4#门监控", group: "出入口" },
    { id: "g4a", name: "4#门安全通道门禁监控", group: "出入口" },
    { id: "g5", name: "5#门监控", group: "出入口" },
    { id: "g5out", name: "5#门外监控", group: "出入口" },
    { id: "cama", name: "监控A", group: "场内" },
    { id: "camb", name: "监控B", group: "场内" },
    { id: "weigh", name: "地磅全景", group: "场内" },
    { id: "rebar", name: "钢筋加工棚", group: "场内" },
    { id: "yard1", name: "场内1", group: "场内" },
    { id: "yard2", name: "场内2", group: "场内" },
    { id: "talk", name: "安全讲台", group: "场内" },
    { id: "crane2", name: "2#塔吊", group: "塔吊" },
    { id: "crane4", name: "4#塔吊", group: "塔吊" }
  ].map((c) => Object.assign(c, { img: "img/cam-crane2.jpg", pos: "" }));
  const camShotPool = ["img/cam-crane2.jpg", "img/cam-crane2.jpg", "img/cam-crane2.jpg"];
  const camShotTimes = ["08:12", "12:36", "16:50"];


  const navTitle = document.getElementById("navTitle");
  const subpage = document.getElementById("subpage");
  const subTitle = document.getElementById("subTitle");
  const subBody = document.getElementById("subBody");
  const appEl = document.getElementById("app");

  let homeMod = "safety";

  function switchTab(tab) {
    document.querySelectorAll(".page").forEach((p) => p.classList.toggle("active", p.id === "page-" + tab));
    document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    navTitle.textContent = titles[tab];
    appEl.classList.toggle("home-mode", tab === "home");
    closeSub(true);
    closeCam();
    closeAir();
    closePeoplePop();
    if (tab === "home" && homeMod === "safety") requestAnimationFrame(startAlarmFeed);
    else stopAlarmFeed();
  }

  function camStamp() {
    const d = new Date();
    const days = "日一二三四五六";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} 星期${days[d.getDay()]} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} 4G`;
  }

  const camIco = `<span class="cam-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 8.2h10.2v9.2H4.5z"/><path d="M14.7 11.2 19.5 8.8v8.2l-4.8-2.4z"/></svg></span>`;
  const starSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 4.6 14.2 9l5 .7-3.6 3.5.9 5L12 16.1 7.5 18.2l.9-5L4.8 9.7 9.8 9z"/></svg>`;

  function camById(id) {
    return cameras.find((c) => c.id === id) || cameras[0];
  }

  function renderCamCard(cam) {
    const stamp = camStamp();
    return `
      <div class="cam-card" data-cam="${cam.id}">
        <div class="cam-card-hd">
          ${camIco}
          <strong>${cam.name}</strong>
          <button class="cam-star" type="button" aria-label="收藏">${starSvg}</button>
        </div>
        <div class="cam-card-pic ${cam.pos}">
          <img src="${cam.img}" alt="${cam.name} 最新一帧" />
          <span class="cam-time">${stamp}</span>
          <span class="cam-play" aria-hidden="true"></span>
        </div>
      </div>`;
  }

  function renderScene(title, camId) {
    return `
      <div class="safe-block scene-block">
        <h4>${title}</h4>
        ${renderCamCard(camById(camId))}
      </div>`;
  }

  function lineThrough(pts, tension) {
    if (!pts.length) return "";
    const t = tension == null ? 0.7 : tension;
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    if (pts.length === 1) return d;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6 * t;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6 * t;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6 * t;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6 * t;
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }

  function alarmTrendSvg(fillId) {
    const hist = { "10/2": 2, "10/3": 3, "10/4": 6, "10/5": 16, "10/6": 13, "10/7": 8, "10/8": 4 };
    const end = startOfDay(new Date());
    const days = [];
    const vals = [];
    for (let i = 6; i >= 0; i--) {
      const d = addDays(end, -i);
      const lab = (d.getMonth() + 1) + "/" + d.getDate();
      days.push(lab);
      vals.push(i === 0 ? latestAlarms.length : (hist[lab] != null ? hist[lab] : 3));
    }
    const w = 260;
    const h = 78;
    const pl = 24;
    const pr = 16;
    const pt = 10;
    const pb = 20;
    const maxY = 20;
    const n = days.length;
    const xAt = (i) => pl + (i / (n - 1)) * (w - pl - pr);
    const yAt = (v) => pt + (1 - v / maxY) * (h - pt - pb);
    const pts = vals.map((v, i) => [xAt(i), yAt(v)]);
    const line = lineThrough(pts, 0.7);
    const base = yAt(0).toFixed(1);
    const area = `${line} L${xAt(n - 1).toFixed(1)},${base} L${xAt(0).toFixed(1)},${base} Z`;
    const grids = [0, 10, 20].map((t) => {
      const y = yAt(t).toFixed(1);
      return `<line x1="${pl}" x2="${w - pr}" y1="${y}" y2="${y}"/><text x="${pl - 4}" y="${(+y + 3).toFixed(1)}" text-anchor="end">${t}</text>`;
    }).join("");
    const labels = days.map((d, i) =>
      `<text x="${xAt(i).toFixed(1)}" y="${h - 1}" text-anchor="middle">${d}</text>`
    ).join("");
    const dots = pts.map(([x, y]) =>
      `<circle class="alarm-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.3"/>`
    ).join("");
    const gid = fillId || "alarmFill";
    return `<svg class="alarm-svg" viewBox="0 0 ${w} ${h}">
      <defs>
        <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4C9FFF" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="#4C9FFF" stop-opacity="0.03"/>
        </linearGradient>
      </defs>
      <g class="alarm-grid">${grids}</g>
      <path d="${area}" fill="url(#${gid})"/>
      <path d="${line}" fill="none" stroke="#4C9FFF" stroke-width="1.6" stroke-linejoin="round"/>
      ${dots}
      <g class="alarm-x">${labels}</g>
    </svg>`;
  }

  function smoothPath(pts) {
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cpx = ((pts[i][0] + pts[i + 1][0]) / 2).toFixed(1);
      d += ` C${cpx},${pts[i][1].toFixed(1)} ${cpx},${pts[i + 1][1].toFixed(1)} ${pts[i + 1][0].toFixed(1)},${pts[i + 1][1].toFixed(1)}`;
    }
    return d;
  }

  function peopleHourSvg() {
    const hourNums = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];
    const hours = hourNums.map((h) => h + ":00");
    const workersAll = [2, 2, 2, 8, 36, 33, 18, 24, 27, 12, 4, 2];
    const managersAll = [2, 2, 2, 2, 7, 19, 3, 5, 10, 6, 2, 2];
    const nowH = new Date().getHours();
    const liveN = hourNums.reduce((n, h, i) => (h <= nowH ? i + 1 : n), 0);
    const workers = workersAll.slice(0, liveN);
    const managers = managersAll.slice(0, liveN);
    const w = 320;
    const h = 148;
    const pl = 28;
    const pr = 16;
    const pt = 10;
    const pb = 22;
    const maxY = 40;
    const ticksN = hours.length;
    const xAt = (i) => pl + (i / (ticksN - 1)) * (w - pl - pr);
    const yAt = (v) => pt + (1 - v / maxY) * (h - pt - pb);
    const wPts = workers.map((v, i) => [xAt(i), yAt(v)]);
    const mPts = managers.map((v, i) => [xAt(i), yAt(v)]);
    const wLine = wPts.length ? smoothPath(wPts) : "";
    const mLine = mPts.length ? smoothPath(mPts) : "";
    const last = Math.max(workers.length - 1, 0);
    const base = yAt(0).toFixed(1);
    const area = wPts.length
      ? `${wLine} L${xAt(last).toFixed(1)},${base} L${xAt(0).toFixed(1)},${base} Z`
      : "";
    const grids = [0, 10, 20, 30, 40].map((t) => {
      const y = yAt(t).toFixed(1);
      return `<line x1="${pl}" x2="${w - pr}" y1="${y}" y2="${y}"/><text x="${pl - 4}" y="${(+y + 3).toFixed(1)}" text-anchor="end">${t}</text>`;
    }).join("");
    const labels = hours.map((d, i) => {
      const show = i === 0 || i === ticksN - 1 || i % 2 === 0;
      if (!show) return "";
      const anchor = i === 0 ? "start" : i === ticksN - 1 ? "end" : "middle";
      const dim = i >= liveN ? ` opacity="0.35"` : "";
      return `<text x="${xAt(i).toFixed(1)}" y="${h - 4}" text-anchor="${anchor}"${dim}>${hourNums[i]}:00</text>`;
    }).join("");
    return `<svg class="people-hour-svg" viewBox="0 0 ${w} ${h}">
      <defs>
        <linearGradient id="peopleFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3DDC97" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#3DDC97" stop-opacity="0.04"/>
        </linearGradient>
      </defs>
      <g class="alarm-grid">${grids}</g>
      <path d="${area}" fill="url(#peopleFill)"/>
      <path d="${wLine}" fill="none" stroke="#3DDC97" stroke-width="2"/>
      <path d="${mLine}" fill="none" stroke="#4C9FFF" stroke-width="2"/>
      <g class="alarm-x">${labels}</g>
    </svg>`;
  }

  const ALARM_SRC = {
    drone: { tag: "无人机", name: "自动巡航无人机", sub: "UAV-25638583" },
    cam: { tag: "视频监控", name: "视频监控抓拍", sub: "CAM-2#塔吊" },
    snap: { tag: "随手拍", name: "管理人员随手拍", sub: "张工 安全员" }
  };

  function alarmSrc(a) {
    return ALARM_SRC[a.src] || ALARM_SRC.drone;
  }

  function alarmSrcTag(a) {
    const src = a.src && ALARM_SRC[a.src] ? a.src : "drone";
    return `<span class="alarm-src alarm-src-${src}">${ALARM_SRC[src].tag}</span>`;
  }

  const inspectAlarms = [
    { id: "trash", day: "today", src: "drone", type: "道路垃圾", title: "环境报警", desc: "场区道路发现垃圾堆放未清理！", img: "img/alarm-trash.jpg", rel: "1分钟前", at: "2026-10-08 15:21:00", geo: "114.24751233100210,30.53310211883421", pin: [32, 78], flat: [34, 86] },
    { id: "cable", day: "today", src: "cam", type: "电缆拖地", title: "用电报警", desc: "作业面电缆拖地未架空，存在触电隐患！", img: "img/alarm-cable.jpg", rel: "3分钟前", at: "2026-10-08 15:19:00", geo: "114.24738810244102,30.53290155210933", pin: [48, 56], flat: [46, 40] },
    { id: "net", day: "today", src: "snap", type: "安全网缺失", title: "防护报警", desc: "楼层临边安全网缺失，请立即整改！", img: "img/alarm-net.jpg", rel: "12分钟前", at: "2026-10-08 15:10:00", geo: "114.24742027911455,30.53296304904549", pin: [22, 48, "left"], flat: [20, 34, "left"] },
    { id: "soil", day: "today", src: "drone", type: "裸土未覆盖", title: "扬尘报警", desc: "场区裸土未覆盖，扬尘风险较高！", img: "img/alarm-soil.jpg", rel: "1小时前", at: "2026-10-08 14:22:00", geo: "114.24760188412003,30.53322190771208", pin: [66, 62], flat: [60, 26] },
    { id: "h-net", day: "hist", src: "snap", type: "安全网缺失", title: "防护报警", desc: "3#楼作业面临边安全网破损缺失。", img: "img/alarm-net.jpg", rel: "昨天 09:30", at: "2026-09-30 09:30:00", geo: "114.24742027911455,30.53296304904549" },
    { id: "h-trash", day: "hist", src: "drone", type: "道路垃圾", title: "环境报警", desc: "场区北侧道路垃圾堆放未及时清运。", img: "img/alarm-trash.jpg", rel: "10/7 16:20", at: "2026-10-07 16:20:00", geo: "114.24749822001145,30.53308044122890" },
    { id: "h-cable", day: "hist", src: "cam", type: "电缆拖地", title: "用电报警", desc: "钢筋加工区电缆拖地，存在漏电风险。", img: "img/alarm-cable.jpg", rel: "10/6 11:08", at: "2026-10-06 11:08:00", geo: "114.24735501988210,30.53284411902341" },
    { id: "h-soil", day: "hist", src: "drone", type: "裸土未覆盖", title: "扬尘报警", desc: "基坑周边裸土未覆盖，扬尘超标。", img: "img/alarm-soil.jpg", rel: "10/5 08:46", at: "2026-10-05 08:46:00", geo: "114.24757700124480,30.53319822009112" }
  ];

  function alarmPin(a, spot, kind, interactive) {
    const left = spot[2] === "left";
    const tag = interactive ? "button" : "span";
    const action = interactive ? ` type="button" data-alarm-pin="${a.id}" aria-label="${a.title}"` : ` aria-hidden="true"`;
    return `<${tag} class="alarm-pin is-${kind}${left ? " is-left" : ""}"${action} style="left:${spot[0]}%;top:${spot[1]}%">
      <i></i><b>${a.title}</b>
    </${tag}>`;
  }

  function homeSpot(spot) {
    const map = document.querySelector("#page-home .home-map");
    const W = map ? map.clientWidth : 0;
    const H = map ? map.clientHeight : 0;
    if (!W || !H) return spot;
    const scale = Math.max(W / 1024, H / 735);
    const dw = 1024 * scale;
    const dh = 735 * scale;
    const x = ((W - dw) / 2 + spot[0] / 100 * dw) / W * 100;
    const y = ((H - dh) / 2 + spot[1] / 100 * dh) / H * 100;
    const out = [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
    if (spot[2]) out.push(spot[2]);
    return out;
  }

  function renderAlarmPins() {
    const today = inspectAlarms.filter((a) => a.day === "today" && a.pin);
    const home = document.getElementById("homeAlarmPins");
    const land = document.getElementById("landAlarmPins");
    if (home) home.innerHTML = today.map((a) => alarmPin(a, homeSpot(a.pin), "home", false)).join("");
    if (land) land.innerHTML = today.map((a) => alarmPin(a, a.pin, "map", true) + alarmPin(a, a.flat, "flat", true)).join("");
  }

  function onAlarmPin(e) {
    const btn = e.target.closest("[data-alarm-pin]");
    if (!btn) return;
    if (mapLand.classList.contains("open")) closeMapLand();
    openAlarmDetail(btn.dataset.alarmPin, false);
  }

  const latestAlarms = inspectAlarms.filter((a) => a.day === "today");

  const ALARM_FEED_SHOW = 3;
  let alarmFeedTimer = 0;
  let alarmFeedWrapTimer = 0;
  let alarmFeedIdx = 0;
  let alarmFeedPageN = 1;

  function alarmFeedItem(a) {
    return `
      <div class="alarm-feed-item" data-alarm="${a.id}" role="button">
        <img class="alarm-feed-pic" src="${a.img}" alt="${a.type}" />
        <div class="alarm-feed-meta">
          <div class="alarm-feed-hd">
            <strong>${a.title}</strong>
            ${alarmSrcTag(a)}
          </div>
          <p>${a.desc}</p>
        </div>
        <span class="alarm-feed-time">${a.rel}</span>
      </div>`;
  }

  function alarmFeedPages() {
    const list = latestAlarms;
    const pageN = Math.max(1, Math.ceil(list.length / ALARM_FEED_SHOW));
    return Array.from({ length: pageN }, (_, p) =>
      list.slice(p * ALARM_FEED_SHOW, (p + 1) * ALARM_FEED_SHOW)
    );
  }

  function renderAlarmFeed() {
    const pages = alarmFeedPages();
    const loop = pages.length > 1 ? pages.concat([pages[0]]) : pages;
    const dots = pages.length > 1
      ? `<div class="alarm-feed-dots" id="alarmFeedDots">${pages.map((_, i) =>
          `<button class="alarm-feed-dot${i === 0 ? " on" : ""}" type="button" data-feed-page="${i}" aria-label="第${i + 1}页"></button>`
        ).join("")}</div>`
      : "";
    return `
      <div class="home-chart-card alarm-feed">
        <div class="alarm-feed-win" id="alarmFeedWin">
          <div class="alarm-feed-track" id="alarmFeedTrack">
            ${loop.map((page) => `<div class="alarm-feed-page">${page.map(alarmFeedItem).join("")}</div>`).join("")}
          </div>
        </div>
        ${dots}
      </div>`;
  }

  function stopAlarmFeed() {
    clearInterval(alarmFeedTimer);
    clearTimeout(alarmFeedWrapTimer);
    alarmFeedTimer = 0;
    alarmFeedWrapTimer = 0;
    alarmFeedIdx = 0;
  }

  function startAlarmFeed() {
    stopAlarmFeed();
    const track = document.getElementById("alarmFeedTrack");
    const win = document.getElementById("alarmFeedWin");
    const dotsBox = document.getElementById("alarmFeedDots");
    if (!track || !win) return;
    const pages = alarmFeedPages();
    alarmFeedPageN = pages.length;
    const looping = alarmFeedPageN > 1;
    const pageEls = track.querySelectorAll(".alarm-feed-page");
    const total = pageEls.length;
    const unit = 100 / total;
    track.style.width = `${total * 100}%`;
    pageEls.forEach((p) => {
      p.style.flex = `0 0 ${unit}%`;
      p.style.width = `${unit}%`;
    });
    const paintDots = (idx) => {
      if (!dotsBox) return;
      const on = idx % alarmFeedPageN;
      dotsBox.querySelectorAll(".alarm-feed-dot").forEach((d, i) => d.classList.toggle("on", i === on));
    };
    const go = (idx, animate) => {
      clearTimeout(alarmFeedWrapTimer);
      alarmFeedIdx = idx;
      track.style.transition = animate === false ? "none" : "transform 0.45s ease";
      track.style.transform = `translateX(-${idx * unit}%)`;
      paintDots(idx);
    };
    go(0, false);
    if (!looping) return;
    const next = () => {
      go(alarmFeedIdx + 1, true);
      if (alarmFeedIdx >= alarmFeedPageN) {
        alarmFeedWrapTimer = setTimeout(() => go(0, false), 460);
      }
    };
    alarmFeedTimer = setInterval(next, 4000);
    const restart = () => {
      clearInterval(alarmFeedTimer);
      alarmFeedTimer = setInterval(next, 4000);
    };
    if (dotsBox) {
      dotsBox.onclick = (e) => {
        const btn = e.target.closest("[data-feed-page]");
        if (!btn) return;
        go(+btn.dataset.feedPage, true);
        restart();
      };
    }
    let sx = 0;
    win.onpointerdown = (e) => { sx = e.clientX; };
    win.onpointerup = (e) => {
      const dx = e.clientX - sx;
      if (Math.abs(dx) < 36) return;
      if (dx < 0) next();
      else go((alarmFeedIdx - 1 + alarmFeedPageN) % alarmFeedPageN, true);
      restart();
    };
  }

  const b2Occupied = { 1: 5, 4: 1 };
  const b2FloorCount = 5;
  const peopleTree = [
    { id: "yard", name: "场布", count: 38 },
    {
      id: "b2",
      name: "2#楼",
      count: 6,
      children: Array.from({ length: b2FloorCount }, (_, i) => {
        const n = i + 1;
        return { id: "b2-" + n, name: n + "F", count: b2Occupied[n] || 0 };
      })
    },
    { id: "base", name: "地下室", count: 2 }
  ];

  function renderPeopleDist() {
    const box = document.getElementById("peopleDist");
    if (!box) return;
    box.innerHTML = `<div class="people-zones">${peopleTree.map((n) => `
      <button class="people-zone${n.children ? " drill" : ""}" type="button" data-people="${n.id}">
        <span>${n.name}</span>
        <b>${n.count}<em>人</em></b>
        ${n.children ? "<i>›</i>" : ""}
      </button>`).join("")}</div>`;
  }

  function peopleFloorGrid(floors) {
    return floors.map((n) => `
      <div class="people-floor${n.count ? "" : " empty"}">
        <span>${n.name}</span>
        <b>${n.count}</b>
      </div>`).join("");
  }

  function openSheet(html) {
    const pop = document.getElementById("peoplePop");
    document.getElementById("peoplePopBody").innerHTML = html;
    pop.classList.add("open");
    pop.setAttribute("aria-hidden", "false");
  }

  function closePeoplePop() {
    const pop = document.getElementById("peoplePop");
    if (!pop) return;
    pop.classList.remove("open");
    pop.setAttribute("aria-hidden", "true");
  }

  function openPeoplePop(node) {
    const floors = node.children || [];
    const live = floors.filter((n) => n.count).length;
    openSheet(`
      <div class="people-pop-hd">
        <strong id="peoplePopTitle">${node.name}</strong>
        <b>${node.count}<i>人</i></b>
        <button class="people-pop-close" type="button" data-people-close aria-label="关闭">×</button>
      </div>
      <div class="people-sub">有人 ${live}层 · 共${floors.length}层</div>
      <div class="people-floor-grid">${peopleFloorGrid(floors)}</div>`);
  }

  function renderSafety() {
    return `
      <div class="safe-block">
        <h4>报警预警</h4>
        <div class="home-stats alarm-row">
          <div class="home-stat alert"><b>${latestAlarms.length}</b><span>今日预警数</span></div>
          <div class="home-chart-card alarm-mini">
            <span class="home-card-lab">近7日预警趋势</span>
            ${alarmTrendSvg()}
          </div>
        </div>
        ${renderAlarmFeed()}
      </div>
      <div class="safe-block">
        <h4>人员管理</h4>
        <div class="safe-stack">
          <div class="home-chart-card crew-card">
            <span class="home-card-lab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="2.2"/><circle cx="16" cy="9.2" r="1.7"/><path d="M4.6 17.4c.7-2.3 2.4-3.6 4.4-3.6s3.7 1.3 4.4 3.6"/><path d="M13.4 14.4c1.5-.4 3 .1 4 1.6"/></svg>人员总览</span>
            <div class="crew-overview">${[
              ["160", "人", "项目人数"],
              ["40", "人", "正在上班"],
              ["76", "人", "今日出勤"],
              ["47.5", "%", "出勤率"]
            ].map(([n, unit, name]) => `
              <div class="crew-kpi"><b>${n}<em>${unit}</em></b><span>${name}</span></div>
            `).join("")}</div>
          </div>
          <div class="home-chart-card people-dist">
            <span class="home-card-lab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s5.5-4.8 5.5-9.2a5.5 5.5 0 0 0-11 0c0 4.4 5.5 9.2 5.5 9.2z"/><circle cx="12" cy="11.2" r="1.8"/></svg>人员分布</span>
            <div id="peopleDist"></div>
          </div>
          <div class="home-chart-card people-hour">
            <div class="people-hour-hd">
              <span class="home-card-lab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 16.5 8.4 11l3.3 2.6L20 6.5"/><path d="M14.5 6.5H20V12"/></svg>今日人员趋势</span>
              <div class="people-hour-leg">
                <span><i class="g"></i>工人</span>
                <span><i class="b"></i>管理人员</span>
              </div>
            </div>
            <div class="people-hour-y">人数</div>
            ${peopleHourSvg()}
          </div>
        </div>
      </div>`;
  }

  const siteBuildings = [
    { name: "酒店", done: 16, total: 16, plan: "正常", rate: 96 },
    { name: "1#楼", done: 1, total: 8, plan: "正常", rate: 92 },
    { name: "2#楼", done: 1, total: 33, plan: "正常", rate: 88 },
    { name: "3#楼", done: 1, total: 33, plan: "正常", rate: 71 },
    { name: "4#楼", done: 1, total: 8, plan: "正常", rate: 90 },
    { name: "幼儿园", done: 3, total: 3, plan: "正常", rate: 94 }
  ];
  const patrolCats = [
    { id: "pano", name: "项目全景" },
    { id: "pit", name: "基坑区域" },
    { id: "face", name: "作业面" },
    { id: "equip", name: "施工装备" },
    { id: "yard", name: "材料堆场" },
    { id: "layout", name: "现场场布" }
  ];
  const patrolPhotos = [
    { id: "pano", cat: "pano", name: "项目全景", src: "drone", img: "img/patrol-pano.jpg", pos: "fit", time: "16:12" },
    { id: "pano-2", cat: "pano", name: "项目鸟瞰", src: "drone", img: "img/aerial-a.jpg", pos: "fit", time: "15:48" },
    { id: "pit-slope", cat: "pit", name: "基坑边坡", src: "drone", img: "img/aerial-b.jpg", pos: "p-l", time: "15:28" },
    { id: "pit-edge", cat: "pit", name: "坑边", src: "drone", img: "img/aerial-b.jpg", pos: "p-r", time: "15:22" },
    { id: "pit-drain", cat: "pit", name: "排水沟", src: "drone", img: "img/aerial-a.jpg", pos: "p-b", time: "15:16" },
    { id: "face-work", cat: "face", name: "作业面", src: "drone", img: "img/patrol-face.jpg", pos: "fit", time: "14:55" },
    { id: "face-scaffold", cat: "face", name: "外架/悬挑架", src: "drone", img: "img/aerial-b.jpg", pos: "p-tl", time: "14:48" },
    { id: "equip-crane", cat: "equip", name: "塔机", src: "drone", img: "img/patrol-crane.jpg", pos: "fit", time: "16:50" },
    { id: "equip-crane-2", cat: "equip", name: "塔吊", src: "drone", img: "img/patrol-crane-2.jpg", pos: "fit", time: "16:55" },
    { id: "equip-lift", cat: "equip", name: "施工电梯", src: "cam", img: "img/cam-crane2.jpg", pos: "p-r", time: "16:42" },
    { id: "yard-rebar", cat: "yard", name: "钢筋加工棚", src: "cam", img: "img/cam-crane2.jpg", pos: "p-b", time: "16:36" },
    { id: "yard-form", cat: "yard", name: "模板加工区", src: "cam", img: "img/cam-crane2.jpg", pos: "p-t", time: "16:28" },
    { id: "yard-stock", cat: "yard", name: "堆场", src: "drone", img: "img/patrol-yard.jpg", pos: "fit", time: "16:48" },
    { id: "layout", cat: "layout", name: "现场场布", src: "drone", img: "img/patrol-layout.jpg", pos: "fit", time: "16:18" },
    { id: "layout-2", cat: "layout", name: "场区鸟瞰", src: "drone", img: "img/patrol-layout-2.jpg", pos: "fit", time: "16:26" },
    { id: "layout-road", cat: "layout", name: "道路", src: "drone", img: "img/patrol-road.jpg", pos: "fit", time: "16:34" },
    { id: "layout-power", cat: "layout", name: "配电箱", src: "drone", img: "img/patrol-power.jpg", pos: "fit", time: "16:40" }
  ];
  let patrolCat = "pano";

  function patrolCatOf(id) {
    return patrolCats.find((c) => c.id === id);
  }

  function patrolSrcTag(src) {
    return src === "drone"
      ? `<span class="alarm-src alarm-src-drone">无人机</span>`
      : `<span class="alarm-src alarm-src-cam">视频监控</span>`;
  }

  function patrolVisible() {
    return patrolPhotos.filter((p) => patrolCat === "all" || p.cat === patrolCat)
      .slice().sort((a, b) => b.time.localeCompare(a.time) || a.name.localeCompare(b.name, "zh"));
  }

  function renderProgress() {
    const list = patrolVisible();
    const cards = list.length
      ? list.map((p) => {
        const cat = patrolCatOf(p.cat);
        return `
          <button class="patrol-card" type="button" data-patrol-photo="${p.id}">
            <img class="${p.pos}" src="${p.img}" alt="${p.name}" />
            <div class="patrol-card-ft">
              <div class="patrol-card-name">
                <strong>${p.name}</strong>
                <em>${p.time}</em>
              </div>
              <div class="patrol-tags">
                <span class="patrol-tag">${cat.name}</span>
                ${patrolSrcTag(p.src)}
              </div>
            </div>
          </button>`;
      }).join("")
      : `<div class="patrol-empty">这个分类下还没有照片</div>`;
    return `
      <div class="patrol-hd">
        <h4>最新照片</h4>
        <em>${list.length} 张</em>
      </div>
      <div class="patrol-cats">
        ${patrolCats.map((c) => `<button type="button" class="${patrolCat === c.id ? "on" : ""}" data-patrol-cat="${c.id}">${c.name}</button>`).join("")}
      </div>
      <div class="patrol-grid">${cards}</div>`;
  }

  function openPatrolPhoto(id) {
    const photo = patrolPhotos.find((p) => p.id === id);
    if (!photo) return;
    const cat = patrolCatOf(photo.cat);
    openSheet(`
      <div class="people-pop-hd">
        <strong id="peoplePopTitle">${photo.name}</strong>
        <button class="people-pop-close" type="button" data-people-close aria-label="关闭">×</button>
      </div>
      <figure class="patrol-view">
        <img class="${photo.pos}" src="${photo.img}" alt="${photo.name}" />
      </figure>
      <div class="patrol-meta">
        <div><span>分类</span><b class="patrol-tag">${cat.name}</b></div>
        <div><span>来源</span>${patrolSrcTag(photo.src)}</div>
        <div><span>时间</span><b>今天 ${photo.time}</b></div>
      </div>`);
  }

  const siteEquip = [
    { id: "crane", name: "智能塔机", value: "18.58t", metric: "今日吊重", ico: "crane",
      units: [
        { name: "1#塔机", on: true, rows: [["今日吊次", "10次"], ["今日吊重", "10.00t"]] },
        { name: "2#塔机", on: true, rows: [["今日吊次", "9次"], ["今日吊重", "5.05t"]] },
        { name: "3#塔机", on: true, rows: [["今日吊次", "7次"], ["今日吊重", "3.53t"]] }
      ] },
    { id: "lift", name: "智能电梯", value: "137次", metric: "今日循环次数", ico: "lift",
      units: [
        { name: "智能电梯1-1", on: true, rows: [["今日循环次数", "86次"], ["今日运行时长", "6.4h"]] },
        { name: "智能电梯1-2", on: false, rows: [["今日循环次数", "18次"], ["今日运行时长", "1.6h"]] },
        { name: "智能电梯2-1", on: false, rows: [["今日循环次数", "9次"], ["今日运行时长", "0.8h"]] },
        { name: "智能电梯2-2", on: true, rows: [["今日循环次数", "24次"], ["今日运行时长", "2.1h"]] }
      ] },
    { id: "drone", name: "无人机", value: "12次", metric: "今日作业次数", ico: "drone",
      units: [{ name: "无人机", on: true, rows: [["今日作业次数", "12次"]] }] },
    { id: "climb", name: "智能爬架", value: "21m", metric: "爬升高度", ico: "climb",
      units: [{ name: "智能爬架", on: true, rows: [["爬升高度", "21m"]] }] },
    { id: "grind", name: "地砖研磨机器人", value: "5次", metric: "今日作业次数", ico: "robot",
      units: [{ name: "地砖研磨机器人", on: true, rows: [["今日作业次数", "5次"]] }] },
    { id: "plaster", name: "抹灰机器人", value: "4次", metric: "今日作业次数", ico: "robot",
      units: [{ name: "抹灰机器人", on: true, rows: [["今日作业次数", "4次"]] }] },
    { id: "measure", name: "测量机器人", value: "7次", metric: "今日作业次数", ico: "robot",
      units: [{ name: "测量机器人", on: true, rows: [["今日作业次数", "7次"]] }] },
    { id: "spray", name: "喷涂机器人", value: "9次", metric: "今日作业次数", ico: "robot",
      units: [{ name: "喷涂机器人", on: true, rows: [["今日作业次数", "9次"]] }] },
    { id: "level", name: "混凝土整平机器人", value: "3次", metric: "今日作业次数", ico: "robot",
      units: [{ name: "混凝土整平机器人", on: true, rows: [["今日作业次数", "3次"]] }] }
  ];

  function equipCount(d) {
    const on = d.units.filter((u) => u.on).length;
    const total = d.units.length;
    return { on, total, st: on <= 0 ? "off" : on < total ? "warn" : "on" };
  }

  function equipUnits(units) {
    return units.map((u) => `
      <div class="eq-unit">
        <div class="eq-hd">
          <strong>${u.name}</strong>
          <i class="eq-dot ${u.on ? "on" : "off"}"></i>
        </div>
        ${u.rows.map((r) => `<div class="eq-kv"><span>${r[0]}</span><b>${r[1]}</b></div>`).join("")}
      </div>`).join("");
  }

  function openEquipPop(node) {
    const c = equipCount(node);
    openSheet(`
      <div class="people-pop-hd">
        <strong id="peoplePopTitle">${node.name}</strong>
        <b>${c.on}<i>/${c.total}</i></b>
        <button class="people-pop-close" type="button" data-people-close aria-label="关闭">×</button>
      </div>
      <div class="people-sub">在线 ${c.on} 台 · 共 ${c.total} 台</div>
      <div class="eq-units">${equipUnits(node.units)}</div>`);
  }

  function renderEquip() {
    const kinds = siteEquip.length;
    const qty = siteEquip.reduce((s, d) => s + d.units.length, 0);
    const on = siteEquip.reduce((s, d) => s + d.units.filter((u) => u.on).length, 0);
    const off = qty - on;
    const onPct = qty ? (on / qty) * 100 : 0;
    const pie = `conic-gradient(#2EE6A6 0% ${onPct}%, #3A4E66 ${onPct}% 100%)`;
    return `
      <div class="home-stats alarm-row">
        <div class="home-chart-card eq-count">
          <div class="eq-count-item"><b>${kinds}<em>种</em></b><span>设备种类</span></div>
          <div class="eq-count-item"><b>${qty}<em>台</em></b><span>设备数量</span></div>
        </div>
        <div class="home-chart-card eq-status">
          <span class="alarm-mini-lab">设备状态</span>
          <div class="eq-status-body">
            <i class="donut eq-status-donut" style="background:${pie}"></i>
            <div class="eq-status-leg">
              <div><i class="on"></i><span>在线</span><b>${on}</b></div>
              <div><i class="off"></i><span>离线</span><b>${off}</b></div>
            </div>
          </div>
        </div>
      </div>
      <div class="eq-grid">${siteEquip.map((d) => {
        const c = equipCount(d);
        const drill = c.total > 1;
        const page = d.id === "drone" ? "uav" : d.id === "lift" ? "lift" : d.id === "crane" ? "crane" : "";
        const open = drill || page;
        const attrs = page === "uav"
          ? ` data-uav="1" aria-label="无人机，点击进入控制"`
          : page === "lift"
              ? ` data-lift="1" aria-label="智能电梯，点击查看明细"`
              : page === "crane"
                ? ` data-crane="1" aria-label="智能塔机，点击查看明细"`
                : drill
                  ? ` data-eq="${d.id}" aria-label="${d.name}，点击展开明细"`
                  : "";
        return `
        <button class="eq-card${open ? " drill" : ""}" type="button"${attrs}>
          <div class="eq-hd">
            <strong>${d.name}</strong>
            <i class="eq-dot ${c.st}"></i>
            ${drill ? `<em class="${c.on === c.total ? "is-full" : "is-part"}"><span>${c.on}</span><i>/${c.total}</i></em>` : ""}
          </div>
          <div class="eq-val">
            <b>${d.value}</b>
            <span>${d.metric}</span>
          </div>
          ${open ? `<span class="eq-more" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 6l6 6-6 6"/></svg></span>` : ""}
        </button>`;
      }).join("")}</div>`;
  }

  let uavTab = "fly";
  let uavRec = false;
  let uavRoute = "daily";
  const uavRoutes = [
    { id: "daily", name: "向阳村日常巡航", meta: "全场航线 · 约 18 分钟" },
    { id: "crane", name: "塔吊巡查航线", meta: "塔吊作业区 · 约 8 分钟" },
    { id: "face", name: "作业面定点航线", meta: "主体作业面 · 约 6 分钟" },
    { id: "loop", name: "场区环绕航线", meta: "基坑一周 · 约 12 分钟" }
  ];

  const uavTodayTasks = [
    { time: "08:30", name: "向阳村日常巡航", state: "执行中", pct: 62 },
    { time: "10:00", name: "塔吊巡查航线", state: "待执行" },
    { time: "14:30", name: "作业面定点航线", state: "已完成" }
  ];

  function uavRouteOf(id) {
    return uavRoutes.find((r) => r.id === id) || uavRoutes[0];
  }

  function uavTaskRow(t) {
    return `<div><b>${t.time}</b><span>${t.name}</span><em>${t.state}</em></div>`;
  }

  function renderUavManage() {
    const done = uavTodayTasks.filter((t) => t.state === "已完成");
    const running = uavTodayTasks.find((t) => t.state === "执行中");
    return `
      <section class="uav-block">
        <div class="uav-hd">
          <h4>任务管理</h4>
          <button class="uav-today-btn" type="button" data-uav-today>查看今日任务</button>
        </div>
        <div class="uav-stats">
          <div><b>${uavTodayTasks.length}</b><span>今日任务</span></div>
          <div><b>${done.length}</b><span>已完成任务</span></div>
          <div><b>0</b><span>失败次数</span></div>
        </div>
        ${running ? `
          <div class="uav-mission">
            <div class="uav-mission-hd"><strong>当前巡检 · ${running.name}</strong><em>${running.pct}%</em></div>
            <div class="uav-bar"><i style="width:${running.pct}%"></i></div>
            <p>08:30 起飞 · 已飞 8.4 分钟 · 预计 18 分钟</p>
          </div>` : ""}
      </section>`;
  }

  function openUavToday() {
    openSheet(`
      <div class="people-pop-hd">
        <strong id="peoplePopTitle">今日任务</strong>
        <b>${uavTodayTasks.length}<i>项</i></b>
        <button class="people-pop-close" type="button" data-people-close aria-label="关闭">×</button>
      </div>
      <div class="uav-log">${uavTodayTasks.map(uavTaskRow).join("")}</div>`);
  }

  const uavLive = { wind: 2, battery: 78, netKbps: 2079, temp: 28.8, rain: false };

  function uavDispatchChecks() {
    const { wind, battery, netKbps, temp, rain } = uavLive;
    return [
      { name: "风速", ok: wind <= 8, risk: "风速超过 8m/s" },
      { name: "电量", ok: battery >= 30, risk: "电量低于 30%" },
      { name: "网络质量", ok: netKbps >= 500, risk: "网络质量不足" },
      { name: "电池温度", ok: temp >= 0 && temp <= 45, risk: "电池温度异常" },
      { name: "雨量", ok: !rain, risk: "当前有雨" }
    ];
  }

  function uavCanDispatch() {
    return uavDispatchChecks().every((c) => c.ok);
  }

  function renderUavDispatch() {
    const checks = uavDispatchChecks();
    const risks = checks.filter((c) => !c.ok);
    const met = checks.filter((c) => c.ok).map((c) => c.name).join("、");
    const can = risks.length === 0;
    const note = can
      ? "起飞条件校验通过：风速、电量、网络、电池温度、雨量符合要求"
      : (met ? `已满足${met}` : "当前条件不支持手动下发");
    return `
      <section class="uav-block">
        <div class="uav-hd">
          <h4>任务下发</h4>
          <em class="uav-gate${can ? "" : " is-bad"}">${can ? "可下发" : "不可下发"}</em>
        </div>
        <p class="uav-allow">${note}</p>
        ${risks.length ? `<ul class="uav-risks">${risks.map((c) => `<li>${c.risk}</li>`).join("")}</ul>` : ""}
        <button class="uav-send" type="button" data-uav-pick ${can ? "" : "disabled"}>选择航线</button>
      </section>`;
  }

  function openUavDispatch() {
    if (!uavCanDispatch()) return;
    const route = uavRouteOf(uavRoute);
    openSheet(`
      <div class="people-pop-hd">
        <strong id="peoplePopTitle">选择航线</strong>
        <button class="people-pop-close" type="button" data-people-close aria-label="关闭">×</button>
      </div>
      <p class="uav-lab">选择既有航线，远程下发执行</p>
      <div class="uav-routes">
        ${uavRoutes.map((r) => `
          <button type="button" class="${uavRoute === r.id ? "on" : ""}" data-uav-route="${r.id}">
            <strong>${r.name}</strong>
            <span>${r.meta}</span>
          </button>`).join("")}
      </div>
      <button class="uav-send" type="button" data-uav-send>下发执行 · ${route.name}</button>`);
  }

  function uavStatTone(v, k) {
    const n = parseFloat(v);
    if (Number.isNaN(n)) return "";
    if ((k === "电量" || k === "充电") && n < 30) return "is-low";
    if (k === "风速" && n > 8) return "is-low";
    if (k === "电池温度" && (n > 45 || n < 0)) return "is-low";
    if (k === "网络速率" && n < 500) return "is-low";
    return "";
  }

  function uavStatCell(v, k) {
    if (k === "网络质量") {
      return `<div><b class="uav-sig" aria-label="网络质量良好"><i></i><i></i><i></i><i></i></b><span>${k}</span></div>`;
    }
    let tone = v === "作业中" ? "is-ok" : uavStatTone(v, k);
    if (String(v).length > 6) tone = `${tone} is-long`.trim();
    return `<div><b${tone ? ` class="${tone}"` : ""}>${v}</b><span>${k}</span></div>`;
  }

  function renderUavStatus() {
    const cells = [
          ["作业中", "状态"],
          [`${uavLive.battery}%`, "电量"],
          ["126m", "距机库"],
          ["22min", "续航"],
          [`${uavLive.wind}m/s`, "风速"],
          ["", "网络质量"],
          [`${uavLive.netKbps} kbps`, "网络速率"],
          [`${uavLive.temp}℃`, "电池温度"]
        ];
    return `
      <section class="uav-block">
        <h4>设备参数</h4>
        <div class="uav-stats">
          ${cells.map(([v, k]) => uavStatCell(v, k)).join("")}
        </div>
      </section>`;
  }

  function uavTools() {
    return `
      <div class="uav-tools">
        <button type="button" data-uav-shot aria-label="抓拍">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13" r="3.2"/></svg>
          <span>抓拍</span>
        </button>
        <button type="button" class="${uavRec ? "is-on" : ""}" data-uav-rec aria-label="录像">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg>
          <span>录像</span>
        </button>
      </div>`;
  }

  function renderUav() {
    const stage = uavTab === "dock"
      ? `
        <div class="uav-stage is-wait">
          <span class="uav-spin" aria-hidden="true"></span>
          <p>视频加载中...</p>
          ${uavTools()}
        </div>`
      : `
        <div class="uav-stage">
          <img src="img/patrol-pano.jpg" alt="无人机实时画面" />
          ${uavTools()}
        </div>`;
    const fly = `
        <div class="uav-fly">
          <div><span>状态</span><b class="is-ok">作业中</b></div>
          <div><span>海拔</span><b>86.20m</b></div>
          <div><span>飞行距离</span><b>2.16km</b></div>
          <div><span>水平速度</span><b>4.2 m/s</b></div>
          <div><span>垂直速度</span><b>0.3 m/s</b></div>
        </div>`;
    return `
      <section class="uav-block">
        <div class="uav-hd">
          <h4>实时监控</h4>
          <div class="uav-tabs">
            <button type="button" class="${uavTab === "fly" ? "on" : ""}" data-uav-tab="fly">无人机</button>
            <button type="button" class="${uavTab === "dock" ? "on" : ""}" data-uav-tab="dock">机库</button>
          </div>
        </div>
        ${stage}
        ${fly}
      </section>
      ${renderUavManage()}
      ${renderUavStatus()}
      ${renderUavDispatch()}`;
  }

  let liftTab = "11";
  const liftUnits = [
    {
      id: "11", tab: "1-1", name: "智能电梯1-1", on: true, status: "在线", code: "E03C1CB9F5011821",
      floor: "8F", height: "22.4m", people: "6人", load: "480kg",
      todayTrips: "86次", monthTrips: "72次", todayTime: "6.4h", monthTime: "7.1h",
      todayPeople: "640人", monthPeople: "580人", todayLoad: "12.80t", monthLoad: "9.40t",
      power: "8.2h", work: "6.4h", util: "78%"
    },
    {
      id: "12", tab: "1-2", name: "智能电梯1-2", on: false, status: "离线", code: "E03C1CB9F5011822",
      floor: "--", height: "--", people: "--", load: "--",
      todayTrips: "18次", monthTrips: "26次", todayTime: "1.6h", monthTime: "2.8h",
      todayPeople: "96人", monthPeople: "140人", todayLoad: "2.10t", monthLoad: "3.20t",
      power: "3.2h", work: "1.6h", util: "50%"
    },
    {
      id: "21", tab: "2-1", name: "智能电梯2-1", on: false, status: "离线", code: "E03C1CB9F5011823",
      floor: "--", height: "--", people: "--", load: "--",
      todayTrips: "9次", monthTrips: "18次", todayTime: "0.8h", monthTime: "2.2h",
      todayPeople: "42人", monthPeople: "90人", todayLoad: "0.86t", monthLoad: "1.90t",
      power: "2.4h", work: "0.8h", util: "33%"
    },
    {
      id: "22", tab: "2-2", name: "智能电梯2-2", on: true, status: "停止", code: "E03C1CB9F5011824",
      floor: "15F", height: "41.8m", people: "0人", load: "0.0kg",
      todayTrips: "24次", monthTrips: "31次", todayTime: "2.1h", monthTime: "3.6h",
      todayPeople: "168人", monthPeople: "220人", todayLoad: "3.50t", monthLoad: "4.80t",
      power: "4.6h", work: "2.1h", util: "46%"
    }
  ];

  function liftMark() {
    return `<i class="crane-name-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="3.5" width="10" height="17" rx="1.4"/><path d="M12 8.2v2.4M12 8.2l-1.2-1.2M12 8.2l1.2-1.2M12 15.6v-2.4M12 15.6l-1.2 1.2M12 15.6l1.2 1.2"/></svg></i>`;
  }

  function liftTone(status) {
    if (status === "在线") return "is-ok";
    if (status === "停止") return "is-wait";
    return "is-off";
  }

  function liftInfo(label, value, tone) {
    const cls = tone || (value === "--" ? "is-off" : "");
    return `<div class="crane-info-row"><span>${label}</span><b${cls ? ` class="${cls}"` : ""}>${value}</b></div>`;
  }

  function liftCell(label, value, tone) {
    return craneCell(label, value, tone || (value === "--" ? "is-off" : ""));
  }

  function renderLiftCard(u) {
    return `
      <article class="crane-card">
        <strong>${liftMark()}${u.name}</strong>
        <div class="crane-card-grid crane-card-live">
          ${liftCell("当前状态", u.status, liftTone(u.status))}
          ${liftCell("当前楼层", u.floor)}
          ${liftCell("当前高度", u.height)}
        </div>
        <div class="crane-card-grid crane-card-live lift-card-pair">
          ${liftCell("当前人数", u.people)}
          ${liftCell("当前载重", u.load)}
        </div>
      </article>`;
  }

  function renderLift() {
    const u = liftUnits.find((c) => c.id === liftTab) || liftUnits[0];
    const tabs = liftUnits.map((c) => `
      <button type="button" class="${c.id === u.id ? "on" : ""}" data-lift-tab="${c.id}">${liftMark()}${c.tab}</button>`).join("");
    const meters = [
      craneCompareMeter("循环次数", u.todayTrips, u.monthTrips, "次", "近30天日均"),
      craneCompareMeter("运行时长", u.todayTime, u.monthTime, "h", "近30天日均"),
      craneCompareMeter("运送人数", u.todayPeople, u.monthPeople, "人", "近30天日均"),
      craneCompareMeter("累计载重", u.todayLoad, u.monthLoad, "t", "近30天日均"),
      craneMeter([
        ["通电时长", u.power, false],
        ["运行时长", u.work, false],
        ["作业利用率", u.util, true]
      ], parseInt(u.util, 10) || 0)
    ].join("");
    return `
      <section class="uav-block">
        <h4>设备总览</h4>
        <div class="crane-board">${liftUnits.map(renderLiftCard).join("")}</div>
      </section>
      <section class="uav-block">
        <h4>单机详情</h4>
        <div class="crane-tabs">${tabs}</div>
        <h5 class="crane-sub">今日工作信息</h5>
        ${meters}
        <h5 class="crane-sub">设备信息</h5>
        <div class="crane-info">${liftInfo("升降机编号", u.code)}</div>
      </section>`;
  }

  function openLiftPage() {
    closePeoplePop();
    liftTab = "11";
    subBack = null;
    subpage.classList.remove("is-alarm");
    subpage.classList.add("is-dark");
    paintSub("智能电梯", renderLift());
  }

  let craneTab = "2";
  const craneDetails = [
    {
      id: "2", tab: "1#塔机", name: "1#塔机", status: "待机", driver: "周磊",
      trips: "10次", weight: "10.00t", monthTrips: "8.6次", monthWeight: "8.50t", idle: true,
      record: "鄂AA-T32016", face: "053325077320", model: "STC100A", made: "2026-04-16", years: "0.5年",
      power: "8.6h", work: "4.8h", util: "56%",
      avgWeight: "1.00t", avgRate: "32%", maxWeight: "2.40t", avgTime: "3.5分钟", monthTime: "4.1分钟",
      slew: "56.48°", radius: "44.81m", height: "27.00m",
      violations: "0次", alarms: "0次"
    },
    {
      id: "3", tab: "2#塔机", name: "2#塔机", status: "工作中", driver: "陈浩",
      trips: "9次", weight: "5.05t", monthTrips: "11.0次", monthWeight: "6.80t", idle: false, nowLoad: "1.26t", nowRate: "36%",
      record: "鄂AA-T32018", face: "053325077321", model: "STC100A", made: "2026-03-08", years: "0.6年",
      power: "7.4h", work: "5.1h", util: "69%",
      avgWeight: "0.56t", avgRate: "28%", maxWeight: "1.80t", avgTime: "4.2分钟", monthTime: "3.6分钟",
      slew: "112.36°", radius: "31.20m", height: "46.50m",
      violations: "0次", alarms: "0次"
    },
    {
      id: "4", tab: "3#塔机", name: "3#塔机", status: "工作中", driver: "李明",
      trips: "7次", weight: "3.53t", monthTrips: "9.5次", monthWeight: "5.20t", idle: false, nowLoad: "0.92t", nowRate: "71%",
      record: "鄂AA-T32021", face: "053325077328", model: "STC80A", made: "2025-11-18", years: "0.9年",
      power: "6.2h", work: "2.4h", util: "39%",
      avgWeight: "0.50t", avgRate: "44%", maxWeight: "1.35t", avgTime: "2.8分钟", monthTime: "3.8分钟",
      slew: "18.74°", radius: "22.60m", height: "35.10m",
      violations: "2次", alarms: "3次"
    }
  ];

  function craneTone(status) {
    return status === "工作中" ? "is-ok" : "is-wait";
  }

  function craneCell(label, value, tone) {
    return `<div><span>${label}</span><b${tone ? ` class="${tone}"` : ""}>${value}</b></div>`;
  }

  function craneMark() {
    return `<i class="crane-name-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2.2 4.6h19.6"/><path d="M2.2 4.6v3h3.4"/><path d="M7.2 4.6V20.2"/><path d="M11 4.6V20.2"/><path d="M7.2 9.2 11 12.6M11 9.2 7.2 12.6"/><path d="M5.4 20.2h7.4"/><path d="M17.2 4.6v7.2"/><path d="M15.6 11.8h3.2"/></svg></i>`;
  }

  function renderCraneCard(u) {
    const rate = u.idle ? 0 : parseInt(u.nowRate, 10) || 0;
    const load = u.idle ? "无载荷" : u.nowLoad;
    const loadTone = u.idle ? "is-empty" : "";
    const rateText = u.idle ? "无载荷" : u.nowRate;
    return `
      <article class="crane-card">
        <strong>${craneMark()}${u.name}</strong>
        <div class="crane-card-grid">
          ${craneCell("工作状态", u.status, craneTone(u.status))}
          ${craneCell("塔司", u.driver, "")}
          ${craneCell("报警次数", u.alarms, u.alarms === "0次" ? "" : "is-alarm")}
        </div>
        <div class="crane-card-grid crane-card-live">
          ${craneCell("实时回转", u.slew, "")}
          ${craneCell("实时幅度", u.radius, "")}
          ${craneCell("实时高度", u.height, "")}
        </div>
        <div class="crane-load">
          <div class="crane-load-hd">
            <span>当前吊重</span><b class="${loadTone}">${load}</b>
            <span class="crane-load-rate">当前负荷</span><em class="${loadTone}">${rateText}</em>
          </div>
          ${u.idle ? "" : `<div class="uav-bar"><i style="width:${rate}%"></i></div>`}
        </div>
      </article>`;
  }

  function craneMeter(pairs, pct, extra) {
    return `
      <div class="crane-meter${extra ? ` ${extra}` : ""}">
        <div class="crane-load-hd">
          ${pairs.map(([label, value, em]) => `
            <div class="crane-load-pair"><span>${label}</span>${em ? `<em>${value}</em>` : `<b>${value}</b>`}</div>`).join("")}
        </div>
        <div class="uav-bar"><i style="width:${pct}%"></i></div>
      </div>`;
  }

  function craneCompareMeter(title, todayText, avgText, unit, avgLabel) {
    const today = parseFloat(todayText);
    const avg = parseFloat(avgText);
    const delta = avg ? Math.round((today - avg) / avg * 100) : 0;
    const note = delta > 0 ? `↑+${delta}%` : delta < 0 ? `↓${delta}%` : "持平";
    const noteCls = delta > 0 ? "is-over" : "is-under";
    const num = (text) => String(text).replace(new RegExp(`${unit}$`), "");
    const avgName = avgLabel || "月均";
    let bar;
    if (delta > 0 && today) {
      const cut = Math.round(avg / today * 1000) / 10;
      bar = `<div class="uav-bar crane-trip-bar"><i style="width:100%;background:linear-gradient(90deg,#2F7CFF 0 ${cut}%,#FF9A3C ${cut}% 100%)"></i></div>`;
    } else {
      const pct = avg ? Math.min(100, Math.round(today / avg * 100)) : 0;
      bar = `<div class="uav-bar crane-trip-bar"><i style="width:${pct}%"></i></div>`;
    }
    return `
      <div class="crane-meter">
        <div class="crane-load-hd crane-trip-hd">
          <div class="crane-trip-line"><span>${title}</span><b>${num(todayText)}</b><span>${unit}</span><i class="crane-trip-sep" aria-hidden="true"></i><span>${avgName}</span><b>${num(avgText)}</b><span>${unit}</span></div>
          <em class="${noteCls}">${note}</em>
        </div>
        ${bar}
      </div>`;
  }

  function renderCrane() {
    const u = craneDetails.find((c) => c.id === craneTab) || craneDetails[0];
    const tabs = craneDetails.map((c) => `
      <button type="button" class="${c.id === u.id ? "on" : ""}" data-crane-tab="${c.id}">${craneMark()}${c.tab}</button>`).join("");
    const meters = [
      craneCompareMeter("吊次", u.trips, u.monthTrips, "次", "近30天日均"),
      craneCompareMeter("吊重", u.weight, u.monthWeight, "t", "近30天日均"),
      craneCompareMeter("平均吊运时长", u.avgTime, u.monthTime, "分钟", "近30天日均"),
      craneMeter([
        ["总通电时长", u.power, false],
        ["有效工作时长", u.work, false],
        ["作业利用率", u.util, true]
      ], parseInt(u.util, 10) || 0),
      craneMeter([
        ["平均单次吊重", u.avgWeight, false],
        ["最大单次吊重", u.maxWeight, false],
        ["平均负荷率", u.avgRate, true]
      ], parseInt(u.avgRate, 10) || 0)
    ].join("");
    const info = [
      ["产权备案号", u.record],
      ["关联塔吊人脸识别设备", u.face],
      ["设备型号", u.model],
      ["设备出厂时间", u.made],
      ["已使用年限", u.years]
    ];
    return `
      <section class="uav-block">
        <h4>设备总览</h4>
        <div class="crane-board">${craneDetails.map(renderCraneCard).join("")}</div>
      </section>
      <section class="uav-block">
        <h4>单机详情</h4>
        <div class="crane-tabs">${tabs}</div>
        <h5 class="crane-sub">今日工作信息</h5>
        ${meters}
        <h5 class="crane-sub">设备信息</h5>
        <div class="crane-info">
          ${info.map(([k, v]) => `<div class="crane-info-row"><span>${k}</span><b>${v}</b></div>`).join("")}
        </div>
      </section>`;
  }

  function openCranePage() {
    closePeoplePop();
    craneTab = "2";
    subBack = null;
    subpage.classList.remove("is-alarm");
    subpage.classList.add("is-dark");
    paintSub("智能塔机", renderCrane());
  }

  function openUavPage() {
    closePeoplePop();
    uavTab = "fly";
    uavRec = false;
    uavRoute = "daily";
    subBack = null;
    subpage.classList.remove("is-alarm");
    subpage.classList.add("is-dark");
    paintSub("无人机", renderUav());
  }

  function renderHomePanel(mod) {
    stopAlarmFeed();
    closePeoplePop();
    const box = document.getElementById("homePanels");
    if (mod === "safety") box.innerHTML = renderSafety();
    else if (mod === "progress") box.innerHTML = renderProgress();
    else if (mod === "equip") box.innerHTML = renderEquip();
    if (mod === "safety") {
      renderPeopleDist();
      requestAnimationFrame(startAlarmFeed);
    }
  }

  function renderMsgs() {
    document.getElementById("msgList").innerHTML = messages.map((m) => `
      <div class="msg-item${m.kind === "inspect" ? " is-link" : ""}" data-kind="${m.kind}">
        <div class="msg-ico ${m.kind}">${msgIco[m.kind]}</div>
        <div class="meta">
          <h4>${m.title}</h4>
          <p>${m.desc}</p>
        </div>
        <div class="msg-side">
          <span class="msg-time">${m.time}</span>
          ${m.unread ? `<b class="msg-badge">${m.unread}</b>` : ""}
        </div>
      </div>`).join("");
  }

  function renderMine() {
    document.getElementById("mineMenu").innerHTML = mineMenus.map((m) => `
      <button class="menu-item" data-mine="${m.id}" data-name="${m.name}">
        <span class="menu-ico">${icon(menuSvg[m.id])}</span>
        <strong>${m.name}</strong>
        <span class="arrow">›</span>
      </button>`).join("");
  }

  function inspectListItem(a) {
    return `
      <div class="insp-item" data-alarm="${a.id}" role="button">
        <img class="insp-pic" src="${a.img}" alt="${a.type}" />
        <div class="insp-meta">
          <div class="insp-hd">
            <strong>${a.type}</strong>
            ${alarmSrcTag(a)}
          </div>
          <p>${a.desc}</p>
        </div>
        <span class="insp-time">${a.rel}</span>
      </div>`;
  }

  let inspTab = "today";
  function protoToday() {
    return startOfDay(new Date(2026, 9, 8));
  }
  let inspHistDate = addDays(protoToday(), -1);
  let inspCalMonth = startOfDay(new Date(inspHistDate.getFullYear(), inspHistDate.getMonth(), 1));

  function dateKey(d) {
    const x = startOfDay(d);
    return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  }

  function alarmsOnDate(d) {
    const key = dateKey(d);
    return inspectAlarms.filter((a) => a.day === "hist" && a.at.slice(0, 10) === key);
  }

  function inspCalMaxDay() {
    return addDays(protoToday(), -1);
  }

  function inspCalEls() {
    return {
      cal: document.getElementById("inspCal"),
      title: document.getElementById("inspCalTitle"),
      grid: document.getElementById("inspCalGrid"),
      prev: document.getElementById("inspCalPrev"),
      next: document.getElementById("inspCalNext")
    };
  }

  function paintInspCal() {
    const els = inspCalEls();
    if (!els.cal) return;
    fillMonthCal(inspCalMonth, inspHistDate, els.title, els.grid, els.prev, els.next, {
      maxDay: inspCalMaxDay()
    });
  }

  function hideInspCal() {
    const cal = document.getElementById("inspCal");
    if (cal) cal.classList.add("hide");
  }

  function showInspCal() {
    inspCalMonth = startOfDay(new Date(inspHistDate.getFullYear(), inspHistDate.getMonth(), 1));
    paintInspCal();
    const cal = document.getElementById("inspCal");
    if (cal) cal.classList.remove("hide");
    const hist = subBody.querySelector(".insp-hist");
    if (hist) hist.scrollIntoView({ block: "start" });
  }

  function renderInspectList() {
    const today = inspectAlarms.filter((a) => a.day === "today");
    const hist = alarmsOnDate(inspHistDate);
    const histLab = formatCamDate(inspHistDate);
    const onHist = inspTab === "hist";
    return `
      <div class="insp-page">
        <div class="insp-tabs">
          <button class="insp-tab${onHist ? "" : " on"}" type="button" data-insp-tab="today">今日预警</button>
          <button class="insp-tab${onHist ? " on" : ""}" type="button" data-insp-tab="hist">历史预警</button>
        </div>
        <div class="insp-pane${onHist ? " hide" : ""}">
          <div class="home-stats alarm-row">
            <div class="home-stat alert"><b>${today.length}</b><span>今日预警数</span></div>
            <div class="home-chart-card alarm-mini">
              <span class="alarm-mini-lab">近7日预警趋势</span>
              ${alarmTrendSvg("inspAlarmFill")}
            </div>
          </div>
          <div class="insp-list">${today.map(inspectListItem).join("")}</div>
        </div>
        <div class="insp-pane insp-hist${onHist ? "" : " hide"}">
          <div class="insp-hist-hd">
            <div>
              <strong>${sameDay(inspHistDate, inspCalMaxDay()) ? "昨天" : histLab}</strong>
              <span>${hist.length}条</span>
            </div>
            <button class="cam-day cam-day-pick on" type="button" data-insp-cal-open="1">
              ${sameDay(inspHistDate, inspCalMaxDay()) ? "昨天" : formatMD(inspHistDate)}
              ${calIco}
            </button>
          </div>
          <div class="cam-cal hide" id="inspCal">
            <div class="cam-cal-hd">
              <button class="cam-cal-nav" id="inspCalPrev" type="button" aria-label="上一月">‹</button>
              <strong id="inspCalTitle">2026年10月</strong>
              <button class="cam-cal-nav" id="inspCalNext" type="button" aria-label="下一月">›</button>
            </div>
            <div class="cam-cal-week">
              <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
            </div>
            <div class="cam-cal-grid" id="inspCalGrid"></div>
          </div>
          ${hist.length
            ? `<div class="insp-list">${hist.map(inspectListItem).join("")}</div>`
            : `<div class="insp-empty">该日暂无巡检预警</div>`}
        </div>
      </div>`;
  }

  function renderAlarmDetail(a) {
    const src = alarmSrc(a);
    return `
      <div class="alarm-hero">
        <img src="${a.img}" alt="${a.type}" />
        <div class="alarm-hero-tag">
          <strong>${src.name}</strong>
          <span>${src.sub}</span>
        </div>
      </div>
      <div class="alarm-info">
        <h4>基础信息</h4>
        <div class="alarm-kv"><span>项目名称</span><em>中建三局-向阳村项目</em></div>
        <div class="alarm-kv"><span>任务名称</span><em>向阳村-三维(加密)</em></div>
        <div class="alarm-kv"><span>检测时间</span><em>${a.at}</em></div>
        <div class="alarm-kv"><span>预警来源</span><em>${src.tag}</em></div>
        <h4>识别结果</h4>
        <div class="alarm-kv"><span>识别类型</span><em>${a.type}</em><b>自动</b><i>0级</i></div>
        <div class="alarm-kv"><span>地址</span><em>湖北省武汉市汉阳区江堤街道江永堤路铉龙城</em></div>
        <div class="alarm-kv"><span>经纬度</span><em class="alarm-geo">${a.geo}</em></div>
      </div>`;
  }

  let subBack = null;

  function paintSub(title, html) {
    subTitle.textContent = title;
    subBody.innerHTML = html;
    subpage.classList.add("open");
  }

  function openInspectList(tab) {
    if (tab === "today" || tab === "hist") inspTab = tab;
    subBack = null;
    subpage.classList.remove("is-alarm", "is-dark");
    paintSub("巡检预警", renderInspectList());
  }

  function openAlarmDetail(id, fromList) {
    const a = inspectAlarms.find((x) => x.id === id);
    if (!a) return;
    subBack = fromList ? openInspectList : null;
    subpage.classList.remove("is-dark");
    subpage.classList.add("is-alarm");
    paintSub("预警详情", renderAlarmDetail(a));
  }

  function openSub(title, html) {
    subBack = null;
    subpage.classList.remove("is-alarm", "is-dark");
    paintSub(title, html);
  }

  function closeSub(force) {
    const inspCal = document.getElementById("inspCal");
    if (force !== true && inspCal && !inspCal.classList.contains("hide")) {
      hideInspCal();
      return;
    }
    if (force !== true && subBack) {
      const fn = subBack;
      subBack = null;
      fn();
      return;
    }
    subBack = null;
    subpage.classList.remove("open", "is-alarm", "is-dark");
  }

  function pageHtml(name) {
    return `
      <div class="card">
        <p class="empty-note">「${name}」内页。这里只保留「我的」相关功能入口，后续按账号、工地和设置补齐。</p>
      </div>`;
  }

  document.getElementById("tabbar").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (btn) switchTab(btn.dataset.tab);
  });

  document.getElementById("mineMenu").addEventListener("click", (e) => {
    const item = e.target.closest("[data-mine]");
    if (item) openSub(item.dataset.name, pageHtml(item.dataset.name));
  });

  function showToast(text) {
    const el = document.getElementById("toast");
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.remove("show"), 1600);
  }

  document.getElementById("btnLogout").addEventListener("click", () => {
    showToast("已退出登录");
  });

  document.getElementById("btnBack").addEventListener("click", closeSub);

  document.getElementById("msgList").addEventListener("click", (e) => {
    const item = e.target.closest(".msg-item");
    if (!item || item.dataset.kind !== "inspect") return;
    openInspectList("today");
  });

  subBody.addEventListener("click", (e) => {
    const uavTodayBtn = e.target.closest("[data-uav-today]");
    if (uavTodayBtn) {
      openUavToday();
      return;
    }
    const uavShot = e.target.closest("[data-uav-shot]");
    if (uavShot) {
      showToast("已抓拍");
      return;
    }
    const uavRecBtn = e.target.closest("[data-uav-rec]");
    if (uavRecBtn) {
      uavRec = !uavRec;
      showToast(uavRec ? "开始录像" : "录像已保存");
      paintSub("无人机", renderUav());
      return;
    }
    const uavTabBtn = e.target.closest("[data-uav-tab]");
    if (uavTabBtn) {
      closePeoplePop();
      uavTab = uavTabBtn.dataset.uavTab;
      paintSub("无人机", renderUav());
      return;
    }
    const craneTabBtn = e.target.closest("[data-crane-tab]");
    if (craneTabBtn) {
      craneTab = craneTabBtn.dataset.craneTab;
      paintSub("智能塔机", renderCrane());
      return;
    }
    const liftTabBtn = e.target.closest("[data-lift-tab]");
    if (liftTabBtn) {
      liftTab = liftTabBtn.dataset.liftTab;
      paintSub("智能电梯", renderLift());
      return;
    }
    const craneAlarm = e.target.closest("[data-crane-alarm]");
    if (craneAlarm) {
      showToast("当前无报警");
      return;
    }
    const uavPick = e.target.closest("[data-uav-pick]");
    if (uavPick) {
      openUavDispatch();
      return;
    }
    const prev = e.target.closest("#inspCalPrev");
    if (prev) {
      if (prev.disabled) return;
      inspCalMonth.setMonth(inspCalMonth.getMonth() - 1);
      paintInspCal();
      return;
    }
    const next = e.target.closest("#inspCalNext");
    if (next) {
      if (next.disabled) return;
      inspCalMonth.setMonth(inspCalMonth.getMonth() + 1);
      paintInspCal();
      return;
    }
    const calDay = e.target.closest("#inspCalGrid [data-cal]");
    if (calDay) {
      if (calDay.disabled) return;
      const [y, m, d] = calDay.dataset.cal.split("-").map(Number);
      inspHistDate = startOfDay(new Date(y, m - 1, d));
      openInspectList("hist");
      return;
    }
    const tab = e.target.closest("[data-insp-tab]");
    if (tab) {
      hideInspCal();
      openInspectList(tab.dataset.inspTab);
      return;
    }
    const pick = e.target.closest("[data-insp-cal-open]");
    if (pick) {
      const cal = document.getElementById("inspCal");
      if (!cal) return;
      if (cal.classList.contains("hide")) showInspCal();
      else hideInspCal();
      return;
    }
    const item = e.target.closest("[data-alarm]");
    if (item) openAlarmDetail(item.dataset.alarm, true);
  });

  const pageHome = document.getElementById("page-home");
  const sheetHandle = document.getElementById("sheetHandle");
  const SHEET_LEVELS = ["full", "mid"];
  let sheetLevel = "full";
  let sheetDrag = null;

  function sheetStops() {
    const h = pageHome.clientHeight;
    const pageRect = pageHome.getBoundingClientRect();
    const prog = pageHome.querySelector(".home-progress");
    const full = prog
      ? Math.round(prog.getBoundingClientRect().bottom - pageRect.top + 10)
      : 118;
    const mid = Math.round(h * 0.42);
    return { full, mid };
  }

  function setSheetLevel(level, animate) {
    if (!SHEET_LEVELS.includes(level)) level = "full";
    sheetLevel = level;
    const stops = sheetStops();
    pageHome.classList.toggle("is-sheet-dragging", animate === false);
    pageHome.classList.remove("is-sheet-full", "is-sheet-mid", "is-sheet-up");
    pageHome.classList.add("is-sheet-" + level);
    if (level === "full") pageHome.classList.add("is-sheet-up");
    pageHome.style.setProperty("--sheet-top", stops[level] + "px");
  }

  function nearestSheetLevel(top, vy) {
    if (vy > 0.55) return "mid";
    if (vy < -0.55) return "full";
    const stops = sheetStops();
    return Math.abs(top - stops.full) <= Math.abs(top - stops.mid) ? "full" : "mid";
  }

  function onSheetPointerDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const stops = sheetStops();
    sheetDrag = {
      id: e.pointerId,
      y: e.clientY,
      top: stops[sheetLevel],
      min: stops.full,
      max: stops.mid,
      lastY: e.clientY,
      lastT: e.timeStamp,
      vy: 0,
      moved: false
    };
    pageHome.classList.add("is-sheet-dragging");
    sheetHandle.setPointerCapture(e.pointerId);
  }

  function onSheetPointerMove(e) {
    if (!sheetDrag || e.pointerId !== sheetDrag.id) return;
    const dy = e.clientY - sheetDrag.y;
    if (Math.abs(dy) > 6) sheetDrag.moved = true;
    const dt = Math.max(e.timeStamp - sheetDrag.lastT, 1);
    sheetDrag.vy = (e.clientY - sheetDrag.lastY) / dt;
    sheetDrag.lastY = e.clientY;
    sheetDrag.lastT = e.timeStamp;
    const top = Math.max(sheetDrag.min, Math.min(sheetDrag.max, sheetDrag.top + dy));
    pageHome.style.setProperty("--sheet-top", Math.round(top) + "px");
  }

  function onSheetPointerUp(e) {
    if (!sheetDrag || e.pointerId !== sheetDrag.id) return;
    const startTop = sheetDrag.top;
    const vy = sheetDrag.vy;
    const moved = sheetDrag.moved;
    sheetDrag = null;
    pageHome.classList.remove("is-sheet-dragging");
    if (!moved) {
      setSheetLevel(sheetLevel === "full" ? "mid" : "full");
      return;
    }
    const cur = parseFloat(pageHome.style.getPropertyValue("--sheet-top")) || startTop;
    setSheetLevel(nearestSheetLevel(cur, vy));
  }

  sheetHandle.addEventListener("pointerdown", onSheetPointerDown);
  sheetHandle.addEventListener("pointermove", onSheetPointerMove);
  sheetHandle.addEventListener("pointerup", onSheetPointerUp);
  sheetHandle.addEventListener("pointercancel", onSheetPointerUp);

  document.getElementById("homeMods").addEventListener("click", (e) => {
    const btn = e.target.closest(".home-mod");
    if (!btn) return;
    homeMod = btn.dataset.mod;
    if (homeMod === "progress") patrolCat = "pano";
    document.querySelectorAll(".home-mod").forEach((b) => b.classList.toggle("on", b === btn));
    renderHomePanel(homeMod);
  });

  window.addEventListener("resize", () => {
    renderAlarmPins();
    setSheetLevel(sheetLevel, false);
  });
  requestAnimationFrame(() => setSheetLevel("full"));

  document.getElementById("peoplePop").addEventListener("click", (e) => {
    if (e.target.closest("[data-people-close]")) {
      closePeoplePop();
      return;
    }
    const routeBtn = e.target.closest("[data-uav-route]");
    if (routeBtn) {
      uavRoute = routeBtn.dataset.uavRoute;
      openUavDispatch();
      return;
    }
    const uavSend = e.target.closest("[data-uav-send]");
    if (uavSend) {
      showToast("已下发航线：" + uavRouteOf(uavRoute).name);
      closePeoplePop();
    }
  });

  document.getElementById("homePanels").addEventListener("click", (e) => {
    const uavBtn = e.target.closest("[data-uav]");
    if (uavBtn) {
      openUavPage();
      return;
    }
    const liftBtn = e.target.closest("[data-lift]");
    if (liftBtn) {
      openLiftPage();
      return;
    }
    const craneBtn = e.target.closest("[data-crane]");
    if (craneBtn) {
      openCranePage();
      return;
    }
    const eqBtn = e.target.closest("[data-eq]");
    if (eqBtn) {
      const node = siteEquip.find((d) => d.id === eqBtn.dataset.eq);
      if (node && node.units.length > 1) openEquipPop(node);
      return;
    }
    const catBtn = e.target.closest("[data-patrol-cat]");
    if (catBtn) {
      patrolCat = catBtn.dataset.patrolCat;
      document.getElementById("homePanels").innerHTML = renderProgress();
      return;
    }
    const photoBtn = e.target.closest("[data-patrol-photo]");
    if (photoBtn) {
      openPatrolPhoto(photoBtn.dataset.patrolPhoto);
      return;
    }
    const peopleBtn = e.target.closest("[data-people]");
    if (peopleBtn) {
      const node = peopleTree.find((n) => n.id === peopleBtn.dataset.people);
      if (node && node.children) openPeoplePop(node);
      return;
    }
    const alarm = e.target.closest("[data-alarm]");
    if (alarm) {
      openInspectList("today");
      return;
    }
    const cfg = e.target.closest(".cam-cfg");
    if (cfg) {
      e.stopPropagation();
      showToast("视频监控配置");
      return;
    }
    const star = e.target.closest(".cam-star");
    if (star) {
      e.stopPropagation();
      star.classList.toggle("on");
      return;
    }
    const card = e.target.closest(".cam-card");
    if (card) openCam(card.dataset.cam);
  });

  document.getElementById("workShorts").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-work]");
    if (!btn) return;
    const kind = btn.dataset.work;
    if (kind === "cam") openCam(cameras[0].id);
    else if (kind === "photo") openAir();
    else if (kind === "hazard") openHazard();
    else showToast("功能待定");
  });

  const phone = document.querySelector(".phone");
  const mapLand = document.getElementById("mapLand");
  const camPlayer = document.getElementById("camPlayer");
  const camLiveView = document.getElementById("camLiveView");
  const camShotsView = document.getElementById("camShotsView");
  const camChips = document.getElementById("camPlayerChips");
  const camFrame = document.getElementById("camPlayerFrame");
  const camName = document.getElementById("camPlayerName");
  const camTime = document.getElementById("camPlayerTime");
  const camShotDays = document.getElementById("camShotDays");
  const camShotGrid = document.getElementById("camShotGrid");
  const camShotPop = document.getElementById("camShotPop");
  const camShotImg = document.getElementById("camShotImg");
  const camShotMeta = document.getElementById("camShotMeta");
  const camCal = document.getElementById("camCal");
  const camCalTitle = document.getElementById("camCalTitle");
  const camCalGrid = document.getElementById("camCalGrid");
  const camCalPrev = document.getElementById("camCalPrev");
  const camCalNext = document.getElementById("camCalNext");
  let camId = cameras[0].id;
  let camMode = "live";
  let camShotDate = startOfDay(new Date());
  let camCalMonth = startOfDay(new Date());
  let camShots = [];

  function startOfDay(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function sameDay(a, b) {
    return startOfDay(a).getTime() === startOfDay(b).getTime();
  }

  function addDays(d, n) {
    const x = startOfDay(d);
    x.setDate(x.getDate() + n);
    return x;
  }

  function dayOffsetOf(d) {
    return Math.round((startOfDay(new Date()) - startOfDay(d)) / 86400000);
  }

  function formatMD(d) {
    const x = startOfDay(d);
    return String(x.getMonth() + 1).padStart(2, "0") + "/" + String(x.getDate()).padStart(2, "0");
  }

  function camDayLabel(offset) {
    return formatCamDate(addDays(new Date(), -offset));
  }

  function formatCamDate(d) {
    const off = dayOffsetOf(d);
    if (off === 0) return "今天";
    if (off === 1) return "昨天";
    return formatMD(d);
  }

  function shotsFor(id, day) {
    const i = cameras.findIndex((c) => c.id === id);
    return camShotTimes.map((t, n) => ({
      time: t,
      img: camShotPool[(i + Math.abs(day) + n) % camShotPool.length],
      pos: ["pos-left", "pos-right", "pos-bottom"][n]
    }));
  }

  const calIco = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/></svg>`;

  function calMinMonth() {
    const d = startOfDay(new Date());
    d.setMonth(d.getMonth() - 11);
    d.setDate(1);
    return d;
  }

  function calMaxMonth() {
    const d = startOfDay(new Date());
    d.setDate(1);
    return d;
  }

  function dayPickChips(selected, openAttr) {
    const today = startOfDay(new Date());
    const yest = addDays(today, -1);
    const picked = dayOffsetOf(selected) > 1;
    return `
      <button class="cam-day${sameDay(selected, today) ? " on" : ""}" type="button" data-day="0">今天</button>
      <button class="cam-day${sameDay(selected, yest) ? " on" : ""}" type="button" data-day="1">昨天</button>
      <button class="cam-day cam-day-pick${picked ? " on" : ""}" type="button" ${openAttr}>
        ${picked ? formatMD(selected) : "选日期"}
        ${calIco}
      </button>`;
  }

  function fillMonthCal(month, selected, titleEl, gridEl, prevBtn, nextBtn, opts) {
    const y = month.getFullYear();
    const m = month.getMonth();
    const maxDay = startOfDay((opts && opts.maxDay) || new Date());
    const maxMonth = startOfDay(new Date(maxDay.getFullYear(), maxDay.getMonth(), 1));
    titleEl.textContent = y + "年" + (m + 1) + "月";
    prevBtn.disabled = month <= calMinMonth();
    nextBtn.disabled = month >= maxMonth;
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const today = startOfDay(new Date());
    const cells = [];
    for (let i = 0; i < firstDow; i++) cells.push('<span class="cam-cal-day off"></span>');
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d);
      const blocked = startOfDay(date) > maxDay;
      const on = sameDay(date, selected);
      const isToday = sameDay(date, today);
      cells.push(
        `<button class="cam-cal-day${on ? " on" : ""}${isToday ? " today" : ""}" type="button" data-cal="${y}-${m + 1}-${d}" ${blocked ? "disabled" : ""}>${d}</button>`
      );
    }
    gridEl.innerHTML = cells.join("");
  }

  function hideCamCal() {
    camCal.classList.add("hide");
  }

  function renderCamCal() {
    fillMonthCal(camCalMonth, camShotDate, camCalTitle, camCalGrid, camCalPrev, camCalNext);
  }

  function showCamCal() {
    camCalMonth = startOfDay(new Date(camShotDate.getFullYear(), camShotDate.getMonth(), 1));
    renderCamCal();
    camCal.classList.remove("hide");
  }

  function showCamMode(mode) {
    camMode = mode;
    camLiveView.classList.toggle("hide", mode !== "live");
    camShotsView.classList.toggle("hide", mode !== "shots");
  }

  function renderCamChips() {
    const groups = [];
    cameras.forEach((c) => {
      let g = groups.find((x) => x.name === c.group);
      if (!g) {
        g = { name: c.group, items: [] };
        groups.push(g);
      }
      g.items.push(c);
    });
    camChips.innerHTML = groups.map((g) => `
      <div class="cam-chip-group">
        <h5>${g.name}<em>${g.items.length}</em></h5>
        <div class="cam-chip-grid">
          ${g.items.map((c) =>
            `<button class="cam-chip${c.id === camId ? " on" : ""}" type="button" data-cam="${c.id}">${c.name}</button>`
          ).join("")}
        </div>
      </div>`).join("");
  }

  function renderCamShots() {
    camShotDays.innerHTML = dayPickChips(camShotDate, 'data-cal-open="1"');
    camShots = shotsFor(camId, dayOffsetOf(camShotDate));
    const label = formatCamDate(camShotDate);
    camShotGrid.innerHTML = camShots.map((s, i) => `
      <button class="cam-shot" type="button" data-shot="${i}">
        <img class="${s.pos}" src="${s.img}" alt="${s.time} 抓拍" />
        <span>${label} ${s.time}</span>
      </button>`).join("");
  }

  function applyCam(id, keepLive) {
    const cam = cameras.find((c) => c.id === id) || cameras[0];
    camId = cam.id;
    camFrame.src = cam.img;
    camFrame.className = cam.pos;
    camName.textContent = cam.name;
    camTime.textContent = camStamp();
    camShotDate = startOfDay(new Date());
    hideCamCal();
    renderCamChips();
    renderCamShots();
    if (!keepLive) camPlayer.classList.remove("live");
  }

  function setCamLand(on) {
    phone.classList.toggle("is-landscape", on);
    camPlayer.classList.toggle("is-land", on);
    const txt = document.getElementById("camLandText");
    if (txt) txt.textContent = on ? "退出全屏" : "全屏";
  }

  function openCam(id) {
    closeAir();
    closeHazard();
    setCamLand(false);
    camPlayer.hidden = false;
    camPlayer.classList.add("open");
    camPlayer.setAttribute("aria-hidden", "false");
    applyCam(id, false);
    showCamMode("live");
  }

  function closeCam() {
    setCamLand(false);
    camPlayer.classList.remove("open", "live");
    camPlayer.setAttribute("aria-hidden", "true");
    camPlayer.hidden = true;
    camShotPop.classList.remove("open");
    camShotPop.hidden = true;
    hideCamCal();
    showCamMode("live");
  }

  document.getElementById("btnCamPlay").addEventListener("click", () => {
    camPlayer.classList.add("live");
    camTime.textContent = camStamp();
  });

  document.getElementById("btnCamBack").addEventListener("click", () => {
    if (camShotPop.classList.contains("open")) {
      camShotPop.classList.remove("open");
      return;
    }
    if (!camCal.classList.contains("hide")) {
      hideCamCal();
      return;
    }
    if (camMode === "shots") {
      hideCamCal();
      showCamMode("live");
      return;
    }
    if (camPlayer.classList.contains("is-land")) {
      setCamLand(false);
      return;
    }
    closeCam();
  });

  document.getElementById("btnCamShots").addEventListener("click", () => {
    camShotDate = startOfDay(new Date());
    hideCamCal();
    renderCamShots();
    showCamMode("shots");
  });

  document.getElementById("btnCamLand").addEventListener("click", () => {
    setCamLand(!camPlayer.classList.contains("is-land"));
  });

  camChips.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-cam]");
    if (chip) applyCam(chip.dataset.cam, camPlayer.classList.contains("live"));
  });

  camShotDays.addEventListener("click", (e) => {
    const pick = e.target.closest("[data-cal-open]");
    if (pick) {
      if (camCal.classList.contains("hide")) showCamCal();
      else hideCamCal();
      return;
    }
    const btn = e.target.closest("[data-day]");
    if (!btn) return;
    hideCamCal();
    camShotDate = addDays(new Date(), -Number(btn.dataset.day));
    renderCamShots();
  });

  camCalPrev.addEventListener("click", () => {
    if (camCalPrev.disabled) return;
    camCalMonth.setMonth(camCalMonth.getMonth() - 1);
    renderCamCal();
  });

  camCalNext.addEventListener("click", () => {
    if (camCalNext.disabled) return;
    camCalMonth.setMonth(camCalMonth.getMonth() + 1);
    renderCamCal();
  });

  camCalGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cal]");
    if (!btn || btn.disabled) return;
    const [y, m, d] = btn.dataset.cal.split("-").map(Number);
    camShotDate = startOfDay(new Date(y, m - 1, d));
    hideCamCal();
    renderCamShots();
  });

  camShotGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-shot]");
    if (!btn) return;
    const shot = camShots[Number(btn.dataset.shot)];
    if (!shot) return;
    camShotImg.src = shot.img;
    camShotImg.className = shot.pos;
    camShotMeta.textContent = camName.textContent + "  " + formatCamDate(camShotDate) + "  " + shot.time;
    camShotPop.hidden = false;
    camShotPop.classList.add("open");
  });

  document.getElementById("btnShotClose").addEventListener("click", () => {
    camShotPop.classList.remove("open");
    camShotPop.hidden = true;
  });

  const airPlayer = document.getElementById("airPlayer");
  const airDays = document.getElementById("airDays");
  const airHint = document.getElementById("airHint");
  const airGrid = document.getElementById("airGrid");
  const airPop = document.getElementById("airPop");
  const airPopImg = document.getElementById("airPopImg");
  const airPopMeta = document.getElementById("airPopMeta");
  const airCal = document.getElementById("airCal");
  const airCalTitle = document.getElementById("airCalTitle");
  const airCalGrid = document.getElementById("airCalGrid");
  const airCalPrev = document.getElementById("airCalPrev");
  const airCalNext = document.getElementById("airCalNext");
  const airImgs = ["img/aerial-a.jpg", "img/aerial-b.jpg"];
  const airTimes = ["07:22", "08:15", "09:08", "10:32", "11:46", "13:18", "14:55", "16:12", "17:38", "18:21"];
  const airPos = ["pos-tl", "pos-tr", "pos-c", "pos-bl", "pos-br", "pos-l", "pos-r", "pos-t", "pos-b", "pos-c"];
  let airDate = startOfDay(new Date());
  let airCalMonth = startOfDay(new Date());
  let airList = [];

  function airShots(day) {
    const n = 8 + (Math.abs(day) % 3);
    return airTimes.slice(0, n).map((t, i) => ({
      time: t,
      img: airImgs[(i + Math.abs(day)) % airImgs.length],
      pos: airPos[i % airPos.length]
    }));
  }

  function hideAirCal() {
    airCal.classList.add("hide");
  }

  function renderAirCal() {
    fillMonthCal(airCalMonth, airDate, airCalTitle, airCalGrid, airCalPrev, airCalNext);
  }

  function showAirCal() {
    airCalMonth = startOfDay(new Date(airDate.getFullYear(), airDate.getMonth(), 1));
    renderAirCal();
    airCal.classList.remove("hide");
  }

  function renderAir() {
    airDays.innerHTML = dayPickChips(airDate, 'data-air-cal-open="1"');
    const offset = dayOffsetOf(airDate);
    airList = airShots(offset);
    const label = formatCamDate(airDate);
    airHint.textContent = label + "  无人机定点拍摄  " + airList.length + " 张";
    airGrid.innerHTML = airList.map((s, i) => `
      <button class="air-card" type="button" data-air="${i}">
        <img class="${s.pos}" src="${s.img}" alt="${label} ${s.time} 航拍" />
        <span>${label} ${s.time}</span>
      </button>`).join("");
  }

  function openAir() {
    closeCam();
    closeHazard();
    airDate = startOfDay(new Date());
    hideAirCal();
    airPop.classList.remove("open");
    renderAir();
    airPlayer.hidden = false;
    airPlayer.classList.add("open");
    airPlayer.setAttribute("aria-hidden", "false");
  }

  function closeAir() {
    if (!airPlayer) return;
    hideAirCal();
    airPlayer.classList.remove("open");
    airPlayer.setAttribute("aria-hidden", "true");
    airPlayer.hidden = true;
    airPop.classList.remove("open");
    airPop.hidden = true;
  }

  const hazardPage = document.getElementById("hazardPage");
  const hazardPhotos = document.getElementById("hazardPhotos");
  const hazardFile = document.getElementById("hazardFile");
  const hazardTypes = document.getElementById("hazardTypes");
  const hazardDesc = document.getElementById("hazardDesc");
  const hazardKindList = ["安全防护", "文明施工", "用电隐患", "消防通道", "其他"];
  let hazardKind = hazardKindList[0];
  let hazardImgs = [];

  function renderHazardTypes() {
    hazardTypes.innerHTML = hazardKindList.map((k) =>
      `<button class="hazard-type${k === hazardKind ? " on" : ""}" type="button" data-hazard-type="${k}">${k}</button>`
    ).join("");
  }

  function renderHazardPhotos() {
    const add = hazardImgs.length < 6
      ? `<button class="hazard-add" id="btnHazardAdd" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 7v10M7 12h10"/><rect x="4" y="5" width="16" height="14" rx="2"/></svg>
          拍照/相册
        </button>`
      : "";
    hazardPhotos.innerHTML = hazardImgs.map((src, i) => `
      <div class="hazard-thumb">
        <img src="${src}" alt="隐患照片 ${i + 1}" />
        <button class="hazard-del" type="button" data-hazard-del="${i}" aria-label="删除">×</button>
      </div>`).join("") + add;
  }

  function resetHazard() {
    hazardImgs.forEach((src) => URL.revokeObjectURL(src));
    hazardImgs = [];
    hazardKind = hazardKindList[0];
    hazardDesc.value = "";
    if (hazardFile) hazardFile.value = "";
    renderHazardTypes();
    renderHazardPhotos();
  }

  function openHazard() {
    closeCam();
    closeAir();
    resetHazard();
    hazardPage.hidden = false;
    hazardPage.classList.add("open");
    hazardPage.setAttribute("aria-hidden", "false");
  }

  function closeHazard() {
    if (!hazardPage) return;
    hazardPage.classList.remove("open");
    hazardPage.setAttribute("aria-hidden", "true");
    hazardPage.hidden = true;
    resetHazard();
  }

  document.getElementById("btnHazardBack").addEventListener("click", closeHazard);

  hazardPhotos.addEventListener("click", (e) => {
    const add = e.target.closest("#btnHazardAdd");
    if (add) {
      hazardFile.click();
      return;
    }
    const del = e.target.closest("[data-hazard-del]");
    if (!del) return;
    const i = Number(del.dataset.hazardDel);
    const src = hazardImgs[i];
    if (src) URL.revokeObjectURL(src);
    hazardImgs.splice(i, 1);
    renderHazardPhotos();
  });

  hazardFile.addEventListener("change", () => {
    const files = Array.from(hazardFile.files || []);
    files.forEach((file) => {
      if (hazardImgs.length >= 6 || !file.type.startsWith("image/")) return;
      hazardImgs.push(URL.createObjectURL(file));
    });
    hazardFile.value = "";
    renderHazardPhotos();
  });

  hazardTypes.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-hazard-type]");
    if (!btn) return;
    hazardKind = btn.dataset.hazardType;
    renderHazardTypes();
  });

  document.getElementById("btnHazardSubmit").addEventListener("click", () => {
    if (!hazardImgs.length) {
      showToast("请先拍摄或选择现场照片");
      return;
    }
    showToast("隐患已上报，待整改");
    closeHazard();
  });

  document.getElementById("btnAirBack").addEventListener("click", () => {
    if (airPop.classList.contains("open")) {
      airPop.classList.remove("open");
      airPop.hidden = true;
      return;
    }
    if (!airCal.classList.contains("hide")) {
      hideAirCal();
      return;
    }
    closeAir();
  });

  airDays.addEventListener("click", (e) => {
    const pick = e.target.closest("[data-air-cal-open]");
    if (pick) {
      if (airCal.classList.contains("hide")) showAirCal();
      else hideAirCal();
      return;
    }
    const btn = e.target.closest("[data-day]");
    if (!btn) return;
    hideAirCal();
    airDate = addDays(new Date(), -Number(btn.dataset.day));
    airPop.classList.remove("open");
    renderAir();
  });

  airCalPrev.addEventListener("click", () => {
    if (airCalPrev.disabled) return;
    airCalMonth.setMonth(airCalMonth.getMonth() - 1);
    renderAirCal();
  });

  airCalNext.addEventListener("click", () => {
    if (airCalNext.disabled) return;
    airCalMonth.setMonth(airCalMonth.getMonth() + 1);
    renderAirCal();
  });

  airCalGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cal]");
    if (!btn || btn.disabled) return;
    const [y, m, d] = btn.dataset.cal.split("-").map(Number);
    airDate = startOfDay(new Date(y, m - 1, d));
    hideAirCal();
    airPop.classList.remove("open");
    renderAir();
  });

  airGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-air]");
    if (!btn) return;
    const shot = airList[Number(btn.dataset.air)];
    if (!shot) return;
    airPopImg.src = shot.img;
    airPopImg.className = shot.pos;
    airPopMeta.textContent = "定点航拍  " + formatCamDate(airDate) + "  " + shot.time;
    airPop.hidden = false;
    airPop.classList.add("open");
  });

  document.getElementById("btnAirClose").addEventListener("click", () => {
    airPop.classList.remove("open");
  });

  const landBuildings = siteBuildings.map((b) => ({
    name: b.name,
    pct: Math.round((b.done / b.total) * 100),
    late: b.plan === "滞后"
  }));
  const landEqIco = {
    crane: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 20h15"/><path d="M7 20V7.5h3.2V20"/><path d="M8.6 7.5H20l-3.2 6.2"/><path d="M16.8 13.7V20"/></svg>`,
    lift: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="3.5" width="10" height="17" rx="1.4"/><path d="M12 8.2v2.4M12 8.2l-1.2-1.2M12 8.2l1.2-1.2M12 15.6v-2.4M12 15.6l-1.2 1.2M12 15.6l1.2 1.2"/></svg>`,
    scale: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 17.5h15"/><path d="M7 17.5V9.2h10v8.3"/><path d="M9.2 9.2 12 5.8l2.8 3.4"/></svg>`,
    drone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.2" cy="6.2" r="2"/><circle cx="17.8" cy="6.2" r="2"/><circle cx="6.2" cy="17.8" r="2"/><circle cx="17.8" cy="17.8" r="2"/><path d="M8.2 6.2h7.6M8.2 17.8h7.6M6.2 8.2v7.6M17.8 8.2v7.6"/><rect x="10" y="10" width="4" height="4" rx="0.8"/></svg>`,
    climb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20V5h10v15"/><path d="M7 9h10M7 13h10M7 17h10"/></svg>`,
    robot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="8" width="12" height="10" rx="2"/><circle cx="9.5" cy="12.2" r="1"/><circle cx="14.5" cy="12.2" r="1"/><path d="M12 8V5.5M9 18.2v1.8M15 18.2v1.8"/></svg>`
  };
  const landDevices = siteEquip.map((d) => {
    const c = equipCount(d);
    return { name: d.name, on: c.on, total: c.total, ico: d.ico };
  });
  let landEqIdx = 0;
  let landEqTimer = 0;

  function landEqState(d) {
    if (d.on <= 0) return "off";
    if (d.on < d.total) return "warn";
    return "on";
  }

  function renderLandEq() {
    const box = document.getElementById("landEqCard");
    if (!box) return;
    const d = landDevices[landEqIdx];
    const st = landEqState(d);
    const dots = landDevices.map((_, n) => `<i class="${n === landEqIdx ? "on" : ""}"></i>`).join("");
    box.innerHTML = `
      <div class="land-eq-top">
        <span class="land-eq-ico">${landEqIco[d.ico]}</span>
        <strong>${d.name}</strong>
        <em class="land-eq-num ${st}"><i>${d.on}</i>/${d.total}</em>
      </div>
      <div class="land-eq-bot">
        <span class="land-qa-lab">在线 / 总数</span>
      </div>
      <div class="land-eq-dots">${dots}</div>`;
  }

  function startLandEq() {
    stopLandEq();
    renderLandEq();
    landEqTimer = setInterval(() => {
      landEqIdx = (landEqIdx + 1) % landDevices.length;
      renderLandEq();
    }, 3000);
  }

  function stopLandEq() {
    clearInterval(landEqTimer);
    landEqTimer = 0;
  }

  function startLandKpis() {
    startLandPg();
    startLandEq();
  }

  function stopLandKpis() {
    stopLandPg();
    stopLandEq();
  }

  let landPgSlide = 0;
  let landPgTimer = 0;
  const landPgSlides = Math.ceil(landBuildings.length / 2);

  function renderLandPg() {
    const n = landBuildings.length;
    const i = (landPgSlide * 2) % n;
    const pair = [landBuildings[i], landBuildings[(i + 1) % n]];
    const list = document.getElementById("landPgList");
    const dots = document.getElementById("landPgDots");
    if (!list || !dots) return;
    list.innerHTML = pair.map((b) => `
      <div class="land-pg-item${b.late ? " late" : ""}">
        <span>${b.name}</span>
        <i><em style="width:${b.pct}%"></em></i>
        <b>${b.pct}%</b>
      </div>`).join("");
    dots.innerHTML = Array.from({ length: landPgSlides }, (_, s) => `<i class="${s === landPgSlide ? "on" : ""}"></i>`).join("");
  }

  function startLandPg() {
    stopLandPg();
    renderLandPg();
    landPgTimer = setInterval(() => {
      landPgSlide = (landPgSlide + 1) % landPgSlides;
      renderLandPg();
    }, 3000);
  }

  function stopLandPg() {
    clearInterval(landPgTimer);
    landPgTimer = 0;
  }

  function setMapFlat(on) {
    const img = mapLand.querySelector(".map-land-fit img");
    const btn = document.getElementById("btnMapFlat");
    mapLand.classList.toggle("is-flat", on);
    if (img) {
      img.src = on ? "img/site-flat.jpg" : "img/site-map.jpg";
      img.alt = on ? "工地二维地图" : "工地数字地图";
    }
    if (btn) {
      btn.classList.toggle("on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    }
  }

  function openMapLand() {
    phone.classList.add("is-landscape");
    mapLand.hidden = false;
    mapLand.classList.add("open");
    mapLand.setAttribute("aria-hidden", "false");
  }

  function closeMapLand() {
    setMapFlat(false);
    phone.classList.remove("is-landscape");
    mapLand.classList.remove("open");
    mapLand.setAttribute("aria-hidden", "true");
    mapLand.hidden = true;
  }

  document.getElementById("btnMapFull").addEventListener("click", openMapLand);
  document.getElementById("btnMapBack").addEventListener("click", closeMapLand);
  document.getElementById("btnMapFlat").addEventListener("click", () => {
    setMapFlat(!mapLand.classList.contains("is-flat"));
  });
  document.getElementById("landAlarmPins").addEventListener("click", onAlarmPin);
  renderAlarmPins();

  function tick() {
    const el = document.getElementById("statusTime");
    if (el) el.textContent = new Date().toTimeString().slice(0, 5);
    if (camPlayer.classList.contains("open")) camTime.textContent = camStamp();
    document.querySelectorAll(".cam-card-pic .cam-time").forEach((n) => { n.textContent = camStamp(); });
  }

  renderMsgs();
  renderMine();
  renderHomePanel(homeMod);
  tick();
  setInterval(tick, 1000);
})();
