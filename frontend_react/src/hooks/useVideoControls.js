/** Video control helpers bound to store state */
import { useCallback, useEffect } from 'react';
import { useStore } from '../state/store';

// PUBLIC_INTERFACE
export function useVideoControls() {
  /** Provide play/pause, seek, rate control bound to store and video element. */
  const { state, dispatch, types } = useStore();
  const video = state.video.element;

  const play = useCallback(() => {
    if (video) {
      void video.play();
      dispatch({ type: types.VIDEO_SET_PLAYING, payload: true });
    }
  }, [video, dispatch, types]);

  const pause = useCallback(() => {
    if (video) {
      video.pause();
      dispatch({ type: types.VIDEO_SET_PLAYING, payload: false });
    }
  }, [video, dispatch, types]);

  const toggle = useCallback(() => {
    if (!video) return;
    if (video.paused) play();
    else pause();
  }, [video, play, pause]);

  const seekMs = useCallback((ms) => {
    if (!video) return;
    video.currentTime = Math.max(0, ms / 1000);
  }, [video]);

  const setRate = useCallback((rate) => {
    if (!video) return;
    video.playbackRate = rate;
    dispatch({ type: types.VIDEO_SET_RATE, payload: rate });
  }, [video, dispatch, types]);

  useEffect(() => {
    if (!video) return;
    const onTime = () => dispatch({ type: types.VIDEO_SET_TIME, payload: Math.floor(video.currentTime * 1000) });
    const onPlay = () => dispatch({ type: types.VIDEO_SET_PLAYING, payload: true });
    const onPause = () => dispatch({ type: types.VIDEO_SET_PLAYING, payload: false });
    video.addEventListener('timeupdate', onTime);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    return () => {
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, [video, dispatch, types]);

  return { play, pause, toggle, seekMs, setRate };
}
