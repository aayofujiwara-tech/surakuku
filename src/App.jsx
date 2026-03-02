import { useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { loadSave, createNewSave, updateSaveAfterBattle, updateSaveAfterTraining, updateSaveAfterTimeAttack, deleteSave } from './utils/saveManager';
import { STAGES } from './data/gameData';
import TitleScreen from './components/TitleScreen';
import AttributeSelect from './components/AttributeSelect';
import WorldMap from './components/WorldMap';
import BattleScreen from './components/BattleScreen';
import GrowthScreen from './components/GrowthScreen';
import ResultScreen from './components/ResultScreen';
import SlimeStatus from './components/SlimeStatus';
import TrainingSelect from './components/TrainingSelect';
import TrainingScreen from './components/TrainingScreen';
import TimeAttackScreen from './components/TimeAttackScreen';
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
    openTrainingSelect,
    startTraining,
    finishTraining,
    startTimeAttack,
    finishTimeAttack,
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

  const handleTrainingFinish = (result) => {
    const save = state.save || loadSave();
    if (save) {
      const updatedSave = updateSaveAfterTraining(save, result);
      finishTraining(updatedSave);
    }
  };

  const handleTrainingBack = () => {
    openTrainingSelect();
  };

  const handleTimeAttackFinish = (result) => {
    const save = state.save || loadSave();
    if (save) {
      const updatedSave = updateSaveAfterTimeAttack(save, result);
      finishTimeAttack(updatedSave);
    } else {
      openTrainingSelect();
    }
  };

  const handleTimeAttackBack = () => {
    openTrainingSelect();
  };

  return (
    <div className="game-container">
      {state.screen === 'title' && (
        <TitleScreen onNewGame={handleNewGame} onContinue={handleContinue} onTraining={openTrainingSelect} />
      )}

      {state.screen === 'attributeSelect' && (
        <AttributeSelect onSelect={handleAttributeSelect} />
      )}

      {state.screen === 'worldMap' && state.save && (
        <WorldMap
          save={state.save}
          onSelectStage={handleSelectStage}
          onViewSlime={viewSlime}
          onTraining={openTrainingSelect}
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

      {state.screen === 'trainingSelect' && (
        <TrainingSelect
          onSelectDan={startTraining}
          onTimeAttack={startTimeAttack}
          onBack={() => state.save ? returnToMap() : setScreen('title')}
        />
      )}

      {state.screen === 'timeAttack' && (
        <TimeAttackScreen
          key={`timeattack-${Date.now()}`}
          onFinish={handleTimeAttackFinish}
          onBack={handleTimeAttackBack}
        />
      )}

      {state.screen === 'training' && state.trainingDan !== null && (
        <TrainingScreen
          key={`training-${state.trainingDan}-${Date.now()}`}
          dan={state.trainingDan}
          onFinish={handleTrainingFinish}
          onBack={handleTrainingBack}
        />
      )}
    </div>
  );
}
