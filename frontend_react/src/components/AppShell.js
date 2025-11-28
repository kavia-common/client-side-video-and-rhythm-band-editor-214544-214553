import React from 'react';
import '../theme.css';

export default function AppShell({ header, sidebar, main, timeline, footer }) {
  return (
    <div className="ocean-app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-badge" />
            <div>Bandes Rythmo Studio</div>
            <span className="badge">Ocean Professional</span>
          </div>
          <div className="toolbar">
            {header}
          </div>
        </div>
      </header>

      <div className="layout">
        <aside className="panel">
          <div className="panel-header">
            <div className="panel-title">Bands & Characters</div>
          </div>
          <div className="panel-content">
            {sidebar}
          </div>
        </aside>

        <main className="split">
          <section className="playground">
            {main}
          </section>
          <section className="timeline">
            <div className="timeline-header">
              <div className="panel-title">Timeline</div>
              <div>{/* extra actions */}</div>
            </div>
            {timeline}
          </section>
        </main>
      </div>

      <footer className="footer">
        <span>All processing occurs locally in your browser.</span>
        <span className="kbd">Space</span> Play/Pause
        <span className="kbd">←/→</span> Seek
        <span className="kbd">I</span> Import
        <span className="kbd">E</span> Export
      </footer>
    </div>
  );
}
