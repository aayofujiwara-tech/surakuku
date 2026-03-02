import { useReducer, useCallback } from 'react';
import { PLAYER_MAX_HP } from '../data/gameData';

const initialState = {
  // 画面遷移
  screen: 'title', // title, attributeSelect, worldMap, battle, result, growth, slimeStatus, trainingSelect, training, seniorMode

  // プレイヤー情報
  save: null,

  // バトル関連
  currentStageId: null,
  battleResult: null, // { won, maxCombo, totalDamage, skillCount }

  // とっくんモード
  trainingDan: null,
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

    case 'VIEW_COLLECTION':
      return { ...state, screen: 'collection' };

    case 'OPEN_TRAINING_SELECT':
      return { ...state, screen: 'trainingSelect' };

    case 'START_TRAINING':
      return { ...state, screen: 'training', trainingDan: action.dan };

    case 'FINISH_TRAINING':
      return { ...state, save: action.save, screen: 'trainingSelect', trainingDan: null };

    case 'START_TIMEATTACK':
      return { ...state, screen: 'timeAttack' };

    case 'FINISH_TIMEATTACK':
      return { ...state, save: action.save, screen: 'trainingSelect' };

    case 'OPEN_SENIOR_MODE':
      return { ...state, screen: 'seniorMode' };

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

  const viewCollection = useCallback(() => {
    dispatch({ type: 'VIEW_COLLECTION' });
  }, []);

  const updateSave = useCallback((save) => {
    dispatch({ type: 'UPDATE_SAVE', save });
  }, []);

  const openTrainingSelect = useCallback(() => {
    dispatch({ type: 'OPEN_TRAINING_SELECT' });
  }, []);

  const startTraining = useCallback((dan) => {
    dispatch({ type: 'START_TRAINING', dan });
  }, []);

  const finishTraining = useCallback((save) => {
    dispatch({ type: 'FINISH_TRAINING', save });
  }, []);

  const startTimeAttack = useCallback(() => {
    dispatch({ type: 'START_TIMEATTACK' });
  }, []);

  const finishTimeAttack = useCallback((save) => {
    dispatch({ type: 'FINISH_TIMEATTACK', save });
  }, []);

  const openSeniorMode = useCallback(() => {
    dispatch({ type: 'OPEN_SENIOR_MODE' });
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
    viewCollection,
    updateSave,
    openTrainingSelect,
    startTraining,
    finishTraining,
    startTimeAttack,
    finishTimeAttack,
    openSeniorMode,
  };
}
