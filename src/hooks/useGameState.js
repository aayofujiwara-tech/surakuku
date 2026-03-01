import { useReducer, useCallback } from 'react';
import { PLAYER_MAX_HP } from '../data/gameData';

const initialState = {
  // 画面遷移
  screen: 'title', // title, attributeSelect, worldMap, battle, result, growth, slimeStatus

  // プレイヤー情報
  save: null,

  // バトル関連
  currentStageId: null,
  battleResult: null, // { won, maxCombo, totalDamage, skillCount }
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'LOAD_SAVE':
      return {
        ...state,
        save: action.save,
        screen: action.save ? 'worldMap' : 'title',
      };

    case 'NEW_GAME':
      return {
        ...state,
        save: action.save,
        screen: 'worldMap',
      };

    case 'START_BATTLE':
      return {
        ...state,
        currentStageId: action.stageId,
        screen: 'battle',
        battleResult: null,
      };

    case 'BATTLE_WON':
      return {
        ...state,
        save: action.save,
        battleResult: action.result,
        screen: 'growth',
      };

    case 'BATTLE_LOST':
      return {
        ...state,
        battleResult: action.result,
        screen: 'result',
      };

    case 'RETURN_TO_MAP':
      return {
        ...state,
        screen: 'worldMap',
        currentStageId: null,
        battleResult: null,
      };

    case 'VIEW_SLIME':
      return { ...state, screen: 'slimeStatus' };

    case 'UPDATE_SAVE':
      return { ...state, save: action.save };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setScreen = useCallback((screen) => {
    dispatch({ type: 'SET_SCREEN', screen });
  }, []);

  const loadSave = useCallback((save) => {
    dispatch({ type: 'LOAD_SAVE', save });
  }, []);

  const newGame = useCallback((save) => {
    dispatch({ type: 'NEW_GAME', save });
  }, []);

  const startBattle = useCallback((stageId) => {
    dispatch({ type: 'START_BATTLE', stageId });
  }, []);

  const battleWon = useCallback((save, result) => {
    dispatch({ type: 'BATTLE_WON', save, result });
  }, []);

  const battleLost = useCallback((result) => {
    dispatch({ type: 'BATTLE_LOST', result });
  }, []);

  const returnToMap = useCallback(() => {
    dispatch({ type: 'RETURN_TO_MAP' });
  }, []);

  const viewSlime = useCallback(() => {
    dispatch({ type: 'VIEW_SLIME' });
  }, []);

  const updateSave = useCallback((save) => {
    dispatch({ type: 'UPDATE_SAVE', save });
  }, []);

  return {
    state,
    setScreen,
    loadSave,
    newGame,
    startBattle,
    battleWon,
    battleLost,
    returnToMap,
    viewSlime,
    updateSave,
  };
}
