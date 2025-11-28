/**
 * Lightweight global state store using React Context + Reducer.
 * Keeps the SPA dependency-light while offering predictable updates.
 */
import React, { createContext, useContext, useMemo, useReducer } from 'react';

// Action type helpers
const types = {
  VIDEO_SET_ELEMENT: 'video/setElement',
  VIDEO_SET_META: 'video/setMeta',
  VIDEO_SET_PLAYING: 'video/setPlaying',
  VIDEO_SET_TIME: 'video/setTime',
  VIDEO_SET_RATE: 'video/setRate',

  TIMELINE_SET_DURATION: 'timeline/setDuration',
  TIMELINE_SET_FPS: 'timeline/setFPS',
  TIMELINE_SET_CURSOR: 'timeline/setCursor',
  TIMELINE_SET_ZOOM: 'timeline/setZoom',

  BANDES_ADD: 'bandes/add',
  BANDES_UPDATE: 'bandes/update',
  BANDES_REMOVE: 'bandes/remove',
  BANDES_SET: 'bandes/set',

  CHARACTERS_SET: 'characters/set',
  CHARACTERS_ADD: 'characters/add',
  CHARACTERS_UPDATE: 'characters/update',
  CHARACTERS_REMOVE: 'characters/remove',

  UI_TOGGLE_MODAL: 'ui/toggleModal',
  UI_SET_TOAST: 'ui/setToast'
};

// Initial state
const initialState = {
  video: {
    element: null,
    duration: 0,
    width: 0,
    height: 0,
    playing: false,
    currentTime: 0,
    playbackRate: 1
  },
  timeline: {
    duration: 0,
    fps: 60,
    cursor: 0,
    zoom: 1
  },
  bandes: {
    items: [] // {id, characterId, text, start, end}
  },
  characters: {
    items: [] // {id, name, color}
  },
  ui: {
    modals: {
      import: false,
      export: false
    },
    toast: null
  }
};

// Reducer
function rootReducer(state, action) {
  switch (action.type) {
    case types.VIDEO_SET_ELEMENT:
      return { ...state, video: { ...state.video, element: action.payload } };
    case types.VIDEO_SET_META:
      return { ...state, video: { ...state.video, ...action.payload } };
    case types.VIDEO_SET_PLAYING:
      return { ...state, video: { ...state.video, playing: action.payload } };
    case types.VIDEO_SET_TIME:
      return { ...state, video: { ...state.video, currentTime: action.payload } };
    case types.VIDEO_SET_RATE:
      return { ...state, video: { ...state.video, playbackRate: action.payload } };

    case types.TIMELINE_SET_DURATION:
      return { ...state, timeline: { ...state.timeline, duration: action.payload } };
    case types.TIMELINE_SET_FPS:
      return { ...state, timeline: { ...state.timeline, fps: action.payload } };
    case types.TIMELINE_SET_CURSOR:
      return { ...state, timeline: { ...state.timeline, cursor: action.payload } };
    case types.TIMELINE_SET_ZOOM:
      return { ...state, timeline: { ...state.timeline, zoom: action.payload } };

    case types.BANDES_SET:
      return { ...state, bandes: { ...state.bandes, items: action.payload } };
    case types.BANDES_ADD:
      return { ...state, bandes: { ...state.bandes, items: [...state.bandes.items, action.payload] } };
    case types.BANDES_UPDATE:
      return {
        ...state,
        bandes: {
          ...state.bandes,
          items: state.bandes.items.map(b => (b.id === action.payload.id ? { ...b, ...action.payload } : b))
        }
      };
    case types.BANDES_REMOVE:
      return { ...state, bandes: { ...state.bandes, items: state.bandes.items.filter(b => b.id !== action.payload) } };

    case types.CHARACTERS_SET:
      return { ...state, characters: { ...state.characters, items: action.payload } };
    case types.CHARACTERS_ADD:
      return { ...state, characters: { ...state.characters, items: [...state.characters.items, action.payload] } };
    case types.CHARACTERS_UPDATE:
      return {
        ...state,
        characters: {
          ...state.characters,
          items: state.characters.items.map(c => (c.id === action.payload.id ? { ...c, ...action.payload } : c))
        }
      };
    case types.CHARACTERS_REMOVE:
      return {
        ...state,
        characters: { ...state.characters, items: state.characters.items.filter(c => c.id !== action.payload) }
      };

    case types.UI_TOGGLE_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          modals: {
            ...state.ui.modals,
            [action.payload.key]: action.payload.value
          }
        }
      };
    case types.UI_SET_TOAST:
      return { ...state, ui: { ...state.ui, toast: action.payload } };

    default:
      return state;
  }
}

// Context
const StoreContext = createContext({ state: initialState, dispatch: () => {} });

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const value = useMemo(() => ({ state, dispatch, types }), [state, dispatch]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// PUBLIC_INTERFACE
export function useStore() {
  /** Access global state and dispatch. */
  return useContext(StoreContext);
}
