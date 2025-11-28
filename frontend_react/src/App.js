import React, { useEffect } from 'react';
import './theme.css';
import AppShell from './components/AppShell';
import HeaderToolbar from './components/HeaderToolbar';
import BandesList from './components/BandesList';
import CharacterManager from './components/CharacterManager';
import VideoPlayer from './components/VideoPlayer';
import CanvasPreview from './components/CanvasPreview';
import Timeline from './components/Timeline';
import ImportModal from './components/ImportModal';
import ExportModal from './components/ExportModal';
import { StoreProvider, useStore } from './state/store';

// PUBLIC_INTERFACE
function KeyboardShortcuts() {
  /** Registers global keyboard shortcuts for play/pause and modals. */
  const { dispatch, types, state } = useStore();

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target?.tagName)||'')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        const video = state.video.element;
        if (video) video.paused ? video.play() : video.pause();
      } else if (e.code === 'ArrowLeft') {
        const video = state.video.element;
        if (video) video.currentTime = Math.max(0, video.currentTime - 0.1);
      } else if (e.code === 'ArrowRight') {
        const video = state.video.element;
        if (video) video.currentTime = Math.min(video.duration||1e9, video.currentTime + 0.1);
      } else if (e.key.toLowerCase() === 'i') {
        dispatch({ type: types.UI_TOGGLE_MODAL, payload: { key: 'import', value: true } });
      } else if (e.key.toLowerCase() === 'e') {
        dispatch({ type: types.UI_TOGGLE_MODAL, payload: { key: 'export', value: true } });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch, types, state.video.element]);

  return null;
}

// PUBLIC_INTERFACE
function App() {
  /** Main application entry composed of AppShell and feature panes. */
  useEffect(() => {
    document.title = 'Bandes Rythmo Studio';
  }, []);

  const main = (
    <>
      <VideoPlayer />
      <CanvasPreview />
    </>
  );

  const sidebar = (
    <>
      <BandesList />
      <CharacterManager />
    </>
  );

  const timeline = <Timeline />;

  return (
    <StoreProvider>
      <KeyboardShortcuts />
      <AppShell
        header={<HeaderToolbar />}
        sidebar={sidebar}
        main={main}
        timeline={timeline}
      />
      <ImportModal />
      <ExportModal />
    </StoreProvider>
  );
}

export default App;
