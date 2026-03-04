import { useReducer, useCallback, useEffect, useRef } from 'react';
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

    case 'UNLOCK_ALL_STAGES':
      return {
        ...state,
        save: action.save,
        screen: 'attributeSelect',
      };

    case 'BACK_TO_TITLE':
      return {
        ...state,
        screen: 'title',
        currentStageId: null,
        battleResult: null,
        trainingDan: null,
      };

    case 'UPDATE_SAVE':
      return { ...state, save: action.save };

    case 'RESTORE_FROM_HISTORY':
      return {
        ...state,
        screen: action.historyState.screen,
        currentStageId: action.historyState.currentStageId ?? null,
        trainingDan: action.historyState.trainingDan ?? null,
        battleResult: action.historyState.battleResult ?? null,
      };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // --- History API refs ---
  const skipPushRef = useRef(false);
  const confirmingQuitRef = useRef(false);
  const onBattleBackRef = useRef(null);
  const screenRef = useRef(state.screen);
  const prevScreenRef = useRef('title');
  const initialRenderRef = useRef(true);

  screenRef.current = state.screen;

  // --- Initial history state & popstate listener ---
  useEffect(() => {
    history.replaceState({
      screen: 'title',
      currentStageId: null,
      trainingDan: null,
      battleResult: null,
    }, '', '');

    const handlePopState = (event) => {
      const targetState = event.state;
      if (!targetState || !targetState.screen) return;

      // バトル中: 確認ダイアログを出す（quit確定中でなければ）
      if (screenRef.current === 'battle' && !confirmingQuitRef.current) {
        // 履歴を補填してバトルに留まる
        history.pushState({ screen: 'battle' }, '', '');
        onBattleBackRef.current?.();
        return;
      }

      if (confirmingQuitRef.current) {
        confirmingQuitRef.current = false;
      }

      // popstate経由の遷移ではpushStateしない
      skipPushRef.current = true;
      dispatch({ type: 'RESTORE_FROM_HISTORY', historyState: targetState });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- 画面遷移時にhistoryをpush/replace ---
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    if (skipPushRef.current) {
      skipPushRef.current = false;
      prevScreenRef.current = state.screen;
      return;
    }

    const historyState = {
      screen: state.screen,
      currentStageId: state.currentStageId,
      trainingDan: state.trainingDan,
      battleResult: state.battleResult,
    };

    // pushする遷移: title→他画面, worldMap→battle
    // それ以外はreplaceで現在のエントリを上書き
    const prev = prevScreenRef.current;
    const shouldPush =
      (prev === 'title' && state.screen !== 'title') ||
      (prev === 'worldMap' && state.screen === 'battle');

    if (shouldPush) {
      history.pushState(historyState, '', '');
    } else {
      history.replaceState(historyState, '', '');
    }

    prevScreenRef.current = state.screen;
  }, [state.screen]);

  // --- Callbacks ---
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

  const unlockAllStages = useCallback((save) => {
    dispatch({ type: 'UNLOCK_ALL_STAGES', save });
  }, []);

  const backToTitle = useCallback(() => {
    dispatch({ type: 'BACK_TO_TITLE' });
  }, []);

  // バトル中の戻るボタン: history.back()でpopstate経由の遷移
  const confirmBattleQuit = useCallback(() => {
    confirmingQuitRef.current = true;
    history.back();
  }, []);

  // BattleScreenがブラウザ戻るボタン用のハンドラを登録する
  const setBattleBackHandler = useCallback((handler) => {
    onBattleBackRef.current = handler;
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
    unlockAllStages,
    backToTitle,
    confirmBattleQuit,
    setBattleBackHandler,
  };
}
