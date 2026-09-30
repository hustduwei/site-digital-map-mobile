(function () {
  const titles = { home: "首页", work: "工作台", msg: "消息", mine: "我的" };

  const icon = (d) =>
    `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;

  const msgIco = {
    build: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.4 20h5.2"/><path d="M8.2 20 12 4.6 15.8 20"/><path d="M8.6 12.4h6.8"/><path d="M9.4 16.4h5.2"/></svg>`,
    guard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.6 19 6.4v5.2c0 4.2-2.9 7.1-7 8.6-4.1-1.5-7-4.4-7-8.6V6.4z"/></svg>`,
    people: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.2 8.2c.4-2 1.8-3.2 3.8-3.2s3.4 1.2 3.8 3.2"/><circle cx="12" cy="9.4" r="2.6"/><path d="M5.6 19.4c1.1-3 3.3-4.5 6.4-4.5s5.3 1.5 6.4 4.5"/></svg>`,
    env: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.2 14.6c6.4-.4 10.2-6.2 11.6-9.8-1.2 8.4-5.4 13.8-11.2 13.8-2.2 0-3.8-1.2-3.8-3 0-1.4 1.2-1.6 3.4-1z"/><path d="M8.4 16.2c1.8-2 4.6-5.4 7.4-8"/></svg>`,
    inspect: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15.8 7.2c0-1.8-1.8-3-3.8-3s-3.8 1.2-3.8 3c0 3.4 7.6 2.6 7.6 6.6 0 2-1.8 3.2-3.8 3.2s-3.8-1.2-3.8-3"/></svg>`,
    truck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.6 14.6V8.2h10.2v6.4"/><path d="M13.8 10.4h3.8L20.4 14.6v0"/><path d="M3.6 14.6h16.8"/><circle cx="7.2" cy="16.4" r="1.5"/><circle cx="16.6" cy="16.4" r="1.5"/></svg>`
  };

  const messages = [
    { kind: "build", title: "施工预警", desc: "这是一条施工预警消息", time: "14:36:26", unread: 1 },
    { kind: "guard", title: "安防预警", desc: "这是一条安防预警消息", time: "22:12:11", unread: 1 },
    { kind: "people", title: "人员预警", desc: "这是一条人员预警消息", time: "15:51:45", unread: 1 },
    { kind: "env", title: "环境预警", desc: "这是一条环境预警消息", time: "13:18:28", unread: 1 },
    { kind: "inspect", title: "巡检预警", desc: "无人机巡检识别到3处现场风险", time: "10:36:26", unread: 1 },
    { kind: "truck", title: "车辆预警", desc: "这是一条车辆预警消息", time: "昨天", unread: 0 }
  ];

  const menuSvg = {
    sites: "M5 20V7.5L12 4l7 3.5V20 M9.5 20v-5h5v5",
    attend: "M12 8v4.5l3 1.5 M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z",
    fav: "M12 4.5 14.2 9l5 .7-3.6 3.5.9 5L12 16l-4.5 2.2.9-5L4.8 9.7 9.8 9z",
    setting: "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z M4.5 12h2 M17.5 12h2 M6.2 6.2l1.5 1.5 M16.3 16.3l1.5 1.5 M6.2 17.8l1.5-1.5 M16.3 7.7l1.5-1.5",
    about: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z M12 11v5 M12 8v.5"
  };

  const mineMenus = [
    { id: "sites", name: "我的工地" },
    { id: "attend", name: "考勤记录" },
    { id: "fav", name: "我的收藏" },
    { id: "setting", name: "设置" },
    { id: "about", name: "关于" }
  ];

  const cameras = [
    { id: "gate", name: "向阳村项目大门入口", img: "img/site-map.jpg", pos: "pos-left", listed: true },
    { id: "rebar", name: "钢筋加工区", img: "img/site-map.jpg", pos: "pos-right" },
    { id: "pier", name: "3#墩作业面", img: "img/site-map.jpg", pos: "pos-bottom" },
    { id: "yard", name: "场区全景", img: "img/site-map.jpg", pos: "" }
  ];


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
    closeSub();
    closeCam();
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

  function renderSafety() {
    return `
      <div class="safe-block">
        <h4>告警预警</h4>
        <div class="home-stats three">
          <div class="home-stat alert"><b>6</b><span>今日告警</span></div>
          <div class="home-stat fix"><b>3</b><span>待整改</span></div>
          <div class="home-stat done"><b>3</b><span>已整改</span></div>
        </div>
      </div>
      <div class="safe-block">
        <h4>作业人数</h4>
        <div class="crew-grid">${[
          [3, "管理人员"],
          [64, "普通工人"],
          [2, "安全管理人员"],
          [12, "特种作业工人"]
        ].map(([n, name]) => `
          <div class="crew-item"><b>${n}<em>人</em></b><span>${name}</span></div>
        `).join("")}</div>
      </div>
      <div class="safe-block">
        <div class="safe-hd">
          <h4>视频监控</h4>
          <button class="cam-cfg" type="button" aria-label="配置">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96c-.5-.39-1.04-.7-1.63-.94l-.36-2.54A.5.5 0 0 0 13.89 2h-3.78a.5.5 0 0 0-.49.42l-.36 2.54c-.59.24-1.13.55-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22L2.71 8.48a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.83 15.16a.5.5 0 0 0-.12.64l1.92 3.32c.14.24.43.34.69.22l2.39-.96c.5.39 1.04.7 1.63.94l.36 2.54c.05.24.25.42.49.42h3.78c.24 0 .44-.18.49-.42l.36-2.54c.59-.24 1.13-.55 1.63-.94l2.39.96c.26.12.55.02.69-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"/>
            </svg>
          </button>
        </div>
        <div class="cam-grid">${cameras.slice(0, 4).map((c) => renderCamCard(c)).join("")}</div>
      </div>`;
  }

  const landQaItems = [
    { name: "1号楼", rate: 96 },
    { name: "3号楼", rate: 92 },
    { name: "7号楼", rate: 88 },
    { name: "8号楼", rate: 71 },
    { name: "10号楼", rate: 90 }
  ];

  function landQaState(rate) {
    if (rate >= 90) return "on";
    if (rate >= 80) return "warn";
    return "off";
  }

  function renderQuality() {
    const slices = [
      ["#3DB8E8", "工艺观感", "25.6%"],
      ["#22C55E", "成品保护", "25.6%"],
      ["#7C5CFC", "防渗漏", "12.7%"],
      ["#E8C547", "工序倒置", "12.7%"],
      ["#F77234", "空鼓开裂", "8.6%"],
      ["#F53F3F", "结构安全", "8.6%"]
    ];
    let acc = 0;
    const pie = "conic-gradient(" + slices.map((s) => {
      const n = parseFloat(s[2]);
      const a = acc;
      acc += n;
      return `${s[0]} ${a}% ${acc}%`;
    }).join(", ") + `, #EEF0F3 ${acc}% 100%)`;
    return `
      <div class="qa-kpis">
        <div class="qa-kpi"><span>质量隐患</span><b class="danger">4</b></div>
        <div class="qa-kpi"><span>整改完成</span><b class="ok">3</b></div>
        <div class="qa-kpi"><span>整改完成率</span><b class="warn">75%</b></div>
      </div>
      <div class="home-chart-card">
        <div class="home-chart-row qa-chart">
          <div class="donut" style="background:${pie}">
            <div class="donut-label"><b>23%</b><span>工艺观感</span></div>
          </div>
          <div class="qa-legend">${slices.map((x) => `
            <div class="qa-legend-item"><i style="background:${x[0]}"></i><span>${x[1]}</span><em>${x[2]}</em></div>
          `).join("")}</div>
        </div>
      </div>
      <div class="safe-block">
        <h4>实测实量合格率</h4>
        <div class="qa-rate-list">${landQaItems.map((d) => {
          const st = landQaState(d.rate);
          return `
            <div class="qa-rate-card">
              <div class="qa-rate-hd">
                <strong>${d.name}</strong>
                <span class="qa-rate-bar"><i class="${st}" style="width:${d.rate}%"></i></span>
                <b class="${st}">${d.rate}%</b>
              </div>
            </div>`;
        }).join("")}</div>
      </div>`;
  }

  function renderProgress() {
    const buildings = [
      { name: "1号楼", done: 24, total: 30, plan: "正常", crew: 18 },
      { name: "3号楼", done: 16, total: 30, plan: "正常", crew: 12 },
      { name: "5号楼", done: 14, total: 30, plan: "正常", crew: 10 },
      { name: "7号楼", done: 11, total: 30, plan: "正常", crew: 15 },
      { name: "8号楼", done: 7, total: 30, plan: "滞后", crew: 6 },
      { name: "10号楼", done: 19, total: 30, plan: "正常", crew: 20 }
    ];
    return `<div class="pg-list">${buildings.map((b) => {
      const pct = Math.round((b.done / b.total) * 100);
      const late = b.plan === "滞后";
      return `
        <div class="pg-card${late ? " late" : ""}">
          <div class="pg-hd">
            <strong>${b.name}</strong>
            <span class="pg-bar"><i style="width:${pct}%"></i></span>
          </div>
          <div class="pg-metrics">
            <div><b>${b.done}/${b.total}层</b><span>施工进度</span></div>
            <div><b class="${late ? "late" : "ok"}">${b.plan}</b><span>计划进度</span></div>
            <div><b>${b.crew}</b><span>工作面人数</span></div>
          </div>
        </div>`;
    }).join("")}</div>`;
  }

  function renderEquip() {
    const devices = [
      { name: "智能塔机", on: 2, total: 2, value: "86.6t", metric: "今日吊重", ok: true },
      { name: "智能电梯", on: 2, total: 2, value: "152次", metric: "今日升降次数", ok: true },
      { name: "智能地磅", on: 1, total: 1, value: "200.6m³", metric: "今日完成方量", ok: true },
      { name: "无人机", on: 1, total: 1, value: "24.0t", metric: "今日吊重", ok: true }
    ];
    return `
      <div class="home-stats">
        <div class="home-stat eq-stat">
          <div class="eq-stat-txt">
            <b>10</b><span>设备种类</span>
          </div>
          <i class="eq-kpi-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4.2" y="4.2" width="6.4" height="6.4" rx="1.2"/><rect x="13.4" y="4.2" width="6.4" height="6.4" rx="1.2"/><rect x="4.2" y="13.4" width="6.4" height="6.4" rx="1.2"/><rect x="13.4" y="13.4" width="6.4" height="6.4" rx="1.2"/></svg>
          </i>
        </div>
        <div class="home-stat eq-stat">
          <div class="eq-stat-txt">
            <b>15</b><span>设备数量</span>
          </div>
          <i class="eq-kpi-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16.6 12 20l7-3.4V8.2L12 4.8 5 8.2z"/><path d="M12 20v-7.4"/><path d="M5 8.2 12 12.6 19 8.2"/></svg>
          </i>
        </div>
      </div>
      <div class="eq-grid">${devices.map((d) => `
        <div class="eq-card">
          <div class="eq-hd">
            <strong>${d.name}</strong>
            <i class="eq-dot ${d.ok ? "on" : "off"}"></i>
            <em>${d.on}/${d.total}</em>
          </div>
          <b>${d.value}</b>
          <span>${d.metric}</span>
        </div>`).join("")}</div>`;
  }

  function renderHomePanel(mod) {
    const box = document.getElementById("homePanels");
    if (mod === "safety") box.innerHTML = renderSafety();
    else if (mod === "quality") box.innerHTML = renderQuality();
    else if (mod === "progress") box.innerHTML = renderProgress();
    else if (mod === "equip") box.innerHTML = renderEquip();
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

  function renderInspectDetail() {
    const boxes = [
      { cls: "high", left: "6%", top: "18%", w: "34%", h: "42%", lab: "临边防护缺失 96%" },
      { cls: "mid", left: "44%", top: "40%", w: "22%", h: "20%", lab: "未戴安全帽 91%" },
      { cls: "warn", left: "68%", top: "58%", w: "26%", h: "24%", lab: "堆料占道 87%" }
    ];
    const risks = [
      { lv: "高", cls: "high", title: "临边防护缺失", desc: "8号楼东侧作业面临边未设置防护栏，存在坠落风险。", conf: "96%", pos: "8号楼东侧" },
      { lv: "中", cls: "mid", title: "未佩戴安全帽", desc: "基坑作业面识别到2名作业人员未按规定佩戴安全帽。", conf: "91%", pos: "基坑作业面" },
      { lv: "低", cls: "warn", title: "材料堆放占道", desc: "场区通道被钢筋堆料侵占，影响通行及应急疏散。", conf: "87%", pos: "场区南侧通道" }
    ];
    return `
      <div class="ai-summary">
        <div><b class="danger">3</b><span>识别风险</span></div>
        <div><b>无人机-01</b><span>巡检设备</span></div>
        <div><b>10:36</b><span>拍摄时间</span></div>
      </div>
      <div class="ai-frame">
        <img src="img/site-map.jpg" alt="无人机巡检画面" />
        ${boxes.map((b) => `<span class="ai-box ${b.cls}" style="left:${b.left};top:${b.top};width:${b.w};height:${b.h}"><i>${b.lab}</i></span>`).join("")}
        <div class="ai-frame-bar">
          <em>AI识别</em>
          <span>无人机航拍画面 · 2026-09-30 10:36:26</span>
        </div>
      </div>
      <h4 class="ai-sec">风险明细</h4>
      <div class="ai-risks">${risks.map((r) => `
        <div class="ai-risk">
          <div class="ai-risk-hd">
            <strong>${r.title}</strong>
            <b class="${r.cls}">${r.lv}</b>
          </div>
          <p>${r.desc}</p>
          <div class="ai-risk-meta"><span>${r.pos}</span><span>置信度 ${r.conf}</span></div>
        </div>`).join("")}</div>`;
  }

  function openSub(title, html) {
    subTitle.textContent = title;
    subBody.innerHTML = html;
    subpage.classList.add("open");
  }

  function closeSub() {
    subpage.classList.remove("open");
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
    openSub("巡检预警", renderInspectDetail());
  });

  document.getElementById("homeMods").addEventListener("click", (e) => {
    const btn = e.target.closest(".home-mod");
    if (!btn) return;
    homeMod = btn.dataset.mod;
    document.querySelectorAll(".home-mod").forEach((b) => b.classList.toggle("on", b === btn));
    renderHomePanel(homeMod);
  });

  document.getElementById("homePanels").addEventListener("click", (e) => {
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

  const phone = document.querySelector(".phone");
  const mapLand = document.getElementById("mapLand");
  const camPlayer = document.getElementById("camPlayer");
  const camFrame = document.getElementById("camPlayerFrame");
  const camName = document.getElementById("camPlayerName");
  const camTime = document.getElementById("camPlayerTime");
  const camChips = document.getElementById("camPlayerChips");
  let camId = cameras[0].id;

  function applyCam(id, keepLive) {
    const cam = cameras.find((c) => c.id === id) || cameras[0];
    camId = cam.id;
    camFrame.src = cam.img;
    camFrame.className = cam.pos;
    camName.textContent = cam.name;
    camTime.textContent = camStamp();
    camChips.querySelectorAll(".cam-chip").forEach((b) => b.classList.toggle("on", b.dataset.cam === cam.id));
    if (!keepLive) camPlayer.classList.remove("live");
  }

  function openCam(id) {
    camChips.innerHTML = cameras.map((c) => `<button class="cam-chip" type="button" data-cam="${c.id}">${c.name}</button>`).join("");
    applyCam(id, false);
    camPlayer.classList.remove("single");
    camPlayer.classList.add("open");
    camPlayer.setAttribute("aria-hidden", "false");
  }

  function closeCam() {
    camPlayer.classList.remove("open", "live");
    camPlayer.setAttribute("aria-hidden", "true");
  }

  document.getElementById("btnCamPlay").addEventListener("click", () => {
    camPlayer.classList.add("live");
    camTime.textContent = camStamp();
  });

  document.getElementById("btnCamBack").addEventListener("click", closeCam);

  camChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".cam-chip");
    if (chip) applyCam(chip.dataset.cam, camPlayer.classList.contains("live"));
  });

  const landBuildings = [
    { name: "1号楼", pct: 80, late: false },
    { name: "3号楼", pct: 53, late: false },
    { name: "5号楼", pct: 47, late: false },
    { name: "7号楼", pct: 37, late: false },
    { name: "8号楼", pct: 23, late: true },
    { name: "10号楼", pct: 63, late: false }
  ];
  const landEqIco = {
    crane: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 20h15"/><path d="M7 20V7.5h3.2V20"/><path d="M8.6 7.5H20l-3.2 6.2"/><path d="M16.8 13.7V20"/></svg>`,
    lift: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="3.5" width="10" height="17" rx="1.4"/><path d="M12 8.2v2.4M12 8.2l-1.2-1.2M12 8.2l1.2-1.2M12 15.6v-2.4M12 15.6l-1.2 1.2M12 15.6l1.2 1.2"/></svg>`,
    scale: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 17.5h15"/><path d="M7 17.5V9.2h10v8.3"/><path d="M9.2 9.2 12 5.8l2.8 3.4"/></svg>`,
    drone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.2" cy="6.2" r="2"/><circle cx="17.8" cy="6.2" r="2"/><circle cx="6.2" cy="17.8" r="2"/><circle cx="17.8" cy="17.8" r="2"/><path d="M8.2 6.2h7.6M8.2 17.8h7.6M6.2 8.2v7.6M17.8 8.2v7.6"/><rect x="10" y="10" width="4" height="4" rx="0.8"/></svg>`
  };
  const landDevices = [
    { name: "智能塔机", on: 2, total: 2, ico: "crane" },
    { name: "智能电梯", on: 1, total: 2, ico: "lift" },
    { name: "智能地磅", on: 1, total: 1, ico: "scale" },
    { name: "无人机", on: 0, total: 1, ico: "drone" }
  ];
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

  const landQaIco = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.2 11.4 12 4.8l7.8 6.6V19a1.2 1.2 0 0 1-1.2 1.2h-4.4v-5.6H9.8V20.2H5.4A1.2 1.2 0 0 1 4.2 19z"/></svg>`;
  let landQaIdx = 0;
  let landQaTimer = 0;

  function renderLandQa() {
    const box = document.getElementById("landQaCard");
    if (!box) return;
    const d = landQaItems[landQaIdx];
    const st = landQaState(d.rate);
    const dots = landQaItems.map((_, n) => `<i class="${n === landQaIdx ? "on" : ""}"></i>`).join("");
    box.innerHTML = `
      <div class="land-eq-top">
        <span class="land-eq-ico">${landQaIco}</span>
        <strong>${d.name}</strong>
        <em class="land-eq-num ${st}"><i>${d.rate}%</i></em>
      </div>
      <div class="land-eq-bot">
        <span class="land-qa-lab">实测实量合格率</span>
      </div>
      <div class="land-eq-dots">${dots}</div>`;
  }

  function startLandQa() {
    stopLandQa();
    renderLandQa();
    landQaTimer = setInterval(() => {
      landQaIdx = (landQaIdx + 1) % landQaItems.length;
      renderLandQa();
    }, 3000);
  }

  function stopLandQa() {
    clearInterval(landQaTimer);
    landQaTimer = 0;
  }

  function startLandKpis() {
    startLandPg();
    startLandEq();
    startLandQa();
  }

  function stopLandKpis() {
    stopLandPg();
    stopLandEq();
    stopLandQa();
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

  function openMapLand() {
    phone.classList.add("is-landscape");
    mapLand.classList.add("open");
    mapLand.classList.remove("kpis-off", "pins-off");
    mapLand.setAttribute("aria-hidden", "false");
    document.getElementById("btnLandKpi").setAttribute("aria-label", "隐藏模块");
    document.getElementById("btnLandPins").setAttribute("aria-label", "隐藏楼栋");
    startLandKpis();
  }

  function closeMapLand() {
    phone.classList.remove("is-landscape");
    mapLand.classList.remove("open", "kpis-off", "pins-off");
    mapLand.setAttribute("aria-hidden", "true");
    stopLandKpis();
  }

  document.getElementById("btnMapFull").addEventListener("click", openMapLand);
  document.getElementById("btnProjSwitch").addEventListener("click", () => {
    showToast("切换项目");
  });
  document.getElementById("btnMapBack").addEventListener("click", closeMapLand);
  document.getElementById("btnLandKpi").addEventListener("click", () => {
    const off = mapLand.classList.toggle("kpis-off");
    document.getElementById("btnLandKpi").setAttribute("aria-label", off ? "显示模块" : "隐藏模块");
    if (off) stopLandKpis();
    else startLandKpis();
  });
  document.getElementById("btnLandPins").addEventListener("click", () => {
    const off = mapLand.classList.toggle("pins-off");
    document.getElementById("btnLandPins").setAttribute("aria-label", off ? "显示楼栋" : "隐藏楼栋");
  });

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
