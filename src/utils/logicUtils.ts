
import { Thesis, LogicHealth } from '../types';

// --- CONSTANTS ---
const BASE_SCORE = 50;
const SCORE_PASS = 10;   // Hypothesis confirmed
const SCORE_FAIL = -15;  // Hypothesis broken (Penalty is higher to emphasize risk)
const ACTION_BUY = 5;    // User showed confidence
const ACTION_SELL = -5;  // User reduced position

// --- TYPES ---
export interface LogicHealthResult {
  score: number;
  status: 'Good' | 'Warning' | 'Danger';
}

/**
 * Calculates the Logic Health Score based on the history of events and user actions.
 * 
 * Algorithm:
 * 1. Start with BASE_SCORE (50).
 * 2. Iterate through all events associated with the thesis.
 * 3. Add/Subtract points based on Checkpoint results (Pass/Fail).
 * 4. Add/Subtract points based on User Action History (Buy/Sell).
 * 5. Clamp the result between 0 and 100.
 */
export const calculateLogicHealth = (thesis: Thesis): LogicHealthResult => {
  let currentScore = BASE_SCORE;

  if (thesis.events && thesis.events.length > 0) {
    thesis.events.forEach((event) => {
      // 1. Evaluate Checkpoints (Verification)
      if (event.checkpoints && event.checkpoints.length > 0) {
        event.checkpoints.forEach((cp) => {
          if (cp.status === 'Pass') {
            currentScore += SCORE_PASS;
          } else if (cp.status === 'Fail') {
            currentScore += SCORE_FAIL;
          }
        });
      }

      // 2. Evaluate User Actions (Confidence)
      if (event.myActionHistory) {
        const decision = event.myActionHistory.decision;
        if (decision === 'buy') {
          currentScore += ACTION_BUY;
        } else if (decision === 'sell') {
          currentScore += ACTION_SELL;
        }
        // 'hold' has no impact on score currently
      }
    });
  }

  // 3. Clamp Score (0 ~ 100)
  currentScore = Math.max(0, Math.min(100, currentScore));

  // 4. Determine Status
  let status: 'Good' | 'Warning' | 'Danger';
  if (currentScore > 70) {
    status = 'Good';
  } else if (currentScore >= 40) {
    status = 'Warning';
  } else {
    status = 'Danger';
  }

  return { score: currentScore, status };
};

/**
 * Updates the thesis logicHealth property based on the calculation.
 * Returns a new Thesis object with updated health.
 */
export const updateThesisHealth = (thesis: Thesis): Thesis => {
  const result = calculateLogicHealth(thesis);
  
  // Create a new history entry if score changed (Optional logic for future)
  // For now, simply update the current score and status
  const updatedHealth: LogicHealth = {
    ...thesis.logicHealth,
    score: result.score,
    status: result.status,
  };

  return {
    ...thesis,
    logicHealth: updatedHealth
  };
};
