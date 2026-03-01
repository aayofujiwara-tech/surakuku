import { useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { loadSave, createNewSave, updateSaveAfterBattle, deleteSave } from './utils/saveManager';
import { STAGES } from './data/gameData';
import TitleScreen from './components/TitleScreen';
import AttributeSelect from './components/AttributeSelect';
import WorldMap from './components/WorldMap';
import BattleScreen from './components/BattleScreen';
import GrowthScreen from './components/GrowthScreen';
import ResultScreen from './components/ResultScreen';
import SlimeStatus from './components/SlimeStatus';
import './App.css';

export default function App() {
  const {
    state,
    loadSave: loadSaveAction,
    newGame,
    startBattle,
    battleWon,
    battleLost,
    returnToMap,
    viewSlime,
    setScreen,
  } = useGameState();

  // 起動時にセーブデータ確認
  useEffect(() => {
    const save = loadSave();
    if (save) {
      loadSaveAction(save);
    }
  }, []);

  const handleNewGame = () => {
    deleteSave();
    setScreen('attributeSelect');
  };

  const handleContinue = () => {
    const save = loadSave();
    if (save) {
      loadSaveAction(save);
    }
  };

  const handleAttributeSelect = (attributeId) => {
    const save = createNewSave(attributeId);
    newGame(save);
  };

  const handleSelectStage = (stageId) => {
    startBattle(stageId);
  };

  const handleBattleWin = (result) => {
    const stage = STAGES.find((s) => s.id === state.currentStageId);
    const updatedSave = updateSaveAfterBattle(state.save, {
      dan: stage.dan,
      maxCombo: result.maxCombo,
      totalDamage: result.totalDamage,
      skillCount: result.skillCount,
    });
    battleWon(updatedSave, result);
  };

  const handleBattleLose = (result) => {
    battleLost(result);
  };

  const handleRetry = () => {
    startBattle(state.currentStageId);
  };

  return (
    <div className="game-container">
      {state.screen === 'title' && (
        <TitleScreen onNewGame={handleNewGame} onContinue={handleContinue} />
      )}

      {state.screen === 'attributeSelect' && (
        <AttributeSelect onSelect={handleAttributeSelect} />
      )}

      {state.screen === 'worldMap' && state.save && (
        <WorldMap
          save={state.save}
          onSelectStage={handleSelectStage}
          onViewSlime={viewSlime}
        />
      )}

      {state.screen === 'battle' && state.save && state.currentStageId && (
        <BattleScreen
          key={`battle-${state.currentStageId}-${Date.now()}`}
          stageId={state.currentStageId}
          save={state.save}
          onWin={handleBattleWin}
          onLose={handleBattleLose}
        />
      )}

      {state.screen === 'growth' && state.save && state.battleResult && (
        <GrowthScreen
          save={state.save}
          battleResult={state.battleResult}
          onContinue={returnToMap}
        />
      )}

      {state.screen === 'result' && (
        <ResultScreen
          battleResult={state.battleResult}
          onRetry={handleRetry}
          onReturn={returnToMap}
        />
      )}

      {state.screen === 'slimeStatus' && state.save && (
        <SlimeStatus save={state.save} onBack={returnToMap} />
      )}
    </div>
  );
}
