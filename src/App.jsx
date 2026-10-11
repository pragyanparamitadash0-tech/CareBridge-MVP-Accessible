:root {
  --bg-1: #ecf7f5;
  --bg-2: #fff7e9;
  --panel: rgba(255, 255, 255, 0.9);
  --panel-strong: #ffffff;
  --primary: #0d726f;
  --primary-dark: #0a4c4a;
  --primary-soft: #dff5f4;
  --accent: #f8b84c;
  --danger: #d72638;
  --danger-soft: #ffe0e3;
  --success: #2d7a50;
  --success-soft: #dffaf0;
  --text: #1b2d2d;
  --muted: #415a5d;
  --border: #cae6e4;
  --shadow: 0 16px 40px rgba(13, 114, 111, 0.15);
  --radius: 18px;
}

* { box-sizing: border-box; }

html, body, #root {
  margin: 0;
  min-height: 100%;
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(180deg, var(--bg-1) 0%, var(--bg-2) 100%);
  color: var(--text);
}

body {
  min-height: 100vh;
}

button, input, textarea, select {
  font: inherit;
}

button {
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover, button:focus-visible {
  transform: translateY(-1px);
}

button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
  outline: 3px solid rgba(13, 114, 111, 0.28);
  outline-offset: 2px;
}

input, textarea, select {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--panel-strong);
  color: var(--text);
}

label {
  display: grid;
  gap: 0.5rem;
  font-weight: 600;
}

h1, h2, h3, p, ul {
  margin: 0;
}

.app-shell {
  min-height: 100vh;
  padding: 24px;
}

.top-banner {
  max-width: 1400px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.segmented-control {
  display: grid;
  gap: 0.4rem;
  min-width: 180px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  color: var(--muted);
  font-weight: 700;
}

.auth-page {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  place-items: center;
  min-height: calc(100vh - 120px);
}

.auth-card {
  background: rgba(255,255,255,0.9);
  border: 1px solid var(--border);
  border-radius: 28px;
  box-shadow: var(--shadow);
  padding: 32px;
  width: min(980px, 100%);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
}

.brand-icon {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--primary), #7dc4c0);
  color: white;
  font-size: 32px;
  font-weight: 800;
}

.role-selector {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.role-selector button,
.primary-btn,
.soft-btn,
.ghost-btn,
.danger-btn {
  padding: 0.85rem 1rem;
  font-weight: 700;
}

.role-selector button,
.ghost-btn,
.soft-btn {
  background: #edf5f5;
  color: var(--text);
}

.role-selector .selected,
.primary-btn {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
}

.soft-btn {
  background: var(--primary-soft);
  color: var(--primary-dark);
}

.danger-btn {
  background: var(--danger);
  color: white;
}

.demo-banner {
  background: #edf9f6;
  color: var(--primary-dark);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  border: 1px solid var(--border);
}

.demo-banner.warning {
  background: #fff4d7;
  color: #8a5b09;
}

.auth-form,
.registration-form {
  display: grid;
  gap: 16px;
}

.registration-form {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.registration-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.divider {
  display: grid;
  place-items: center;
  margin: 18px 0;
  color: var(--muted);
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border);
}

.divider span {
  position: relative;
  z-index: 1;
  display: inline-block;
  padding: 0 12px;
  background: white;
}

.dashboard-shell {
  max-width: 1400px;
  margin: 0 auto;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
}

.left-panel,
.card {
  background: rgba(255,255,255,0.9);
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: var(--shadow);
}

.left-panel {
  padding: 18px;
  height: fit-content;
}

.profile-pill {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #eefaf9;
  border-radius: 18px;
  padding: 14px;
  border: 1px solid var(--border);
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 800;
  background: linear-gradient(135deg, #ddf1f1, #c4e5df);
  color: var(--primary-dark);
}

.side-nav {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.side-nav button {
  text-align: left;
  border-radius: 12px;
  padding: 12px 14px;
  background: #f5f7f7;
  color: var(--text);
}

.side-nav .active {
  background: #dfeef0;
  color: var(--primary-dark);
  font-weight: 700;
}

.summary-box {
  margin-top: 18px;
  padding: 14px;
  background: #f9fbfb;
  border-radius: 14px;
  border: 1px solid var(--border);
}

.summary-box ul {
  list-style: disc;
  padding-left: 18px;
  color: var(--muted);
  margin-top: 8px;
}

.main-panel {
  display: grid;
  gap: 20px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.card {
  padding: 20px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  font-size: 0.73rem;
  font-weight: 700;
}

.status-badge.success {
  background: var(--success-soft);
  color: var(--success);
}

.info-list,
.request-list,
.appointments-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.info-list li,
.request-list li,
.appointments-list li {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #f8fbfb;
  border-radius: 12px;
  padding: 12px 14px;
}

.provider-form,
.history-form {
  display: grid;
  gap: 14px;
}

.chat-box {
  display: grid;
  gap: 10px;
  max-height: 240px;
  overflow: auto;
  padding: 12px;
  border-radius: 14px;
  background: #f8fbfb;
  border: 1px solid var(--border);
}

.chat-bubble {
  max-width: 85%;
  padding: 10px 12px;
  border-radius: 16px;
  line-height: 1.5;
}

.chat-bubble.user {
  justify-self: end;
  background: #dfeefc;
}

.chat-bubble.bot {
  justify-self: start;
  background: #e8f7f0;
}

.chat-actions,
.inline-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.toast {
  position: fixed;
  right: 18px;
  bottom: 18px;
  background: #072f2d;
  color: white;
  border-radius: 12px;
  padding: 0.9rem 1.1rem;
  box-shadow: var(--shadow);
  z-index: 20;
}

.sos-overlay {
  position: fixed;
  inset: 0;
  background: rgba(199, 31, 40, 0.85);
  display: grid;
  place-items: center;
  z-index: 30;
  padding: 16px;
}

.sos-card {
  background: rgba(255,255,255,0.96);
  color: var(--text);
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  width: min(480px, 100%);
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.sos-timer {
  font-size: clamp(2.6rem, 7vw, 4.8rem);
  font-weight: 800;
  color: var(--danger);
  margin: 12px 0;
}

.safe-btn {
  background: linear-gradient(135deg, #1d8d5d, #0f7a4a);
  color: white;
  width: 100%;
  margin-top: 18px;
}

@media (max-width: 980px) {
  .top-banner,
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard-grid,
  .summary-grid,
  .registration-grid {
    grid-template-columns: 1fr;
  }
}
