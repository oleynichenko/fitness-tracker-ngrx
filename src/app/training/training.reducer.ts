import {Exercise} from './exercise.model';
import * as fromApp from '../app.reducer';
import {
  SET_AVAILABLE_EXERCISES,
  SET_FINISHED_EXERCISES,
  START_EXERCISE,
  STOP_EXERCISE,
  TrainingActions} from './training.actions';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeExercise: Exercise;
}

export interface State extends fromApp.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeExercise: null
};

export function trainingReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_EXERCISES:
      return {
        ...state,
        availableExercises: action.payload
      };

    case SET_FINISHED_EXERCISES:
      return {
        ...state,
        finishedExercises: action.payload
      };

    case START_EXERCISE:
      return {
        ...state,
        activeExercise: state.availableExercises.find(
          ex => ex.id === action.payload)
      };

    case STOP_EXERCISE:
      return {
        ...state,
        activeExercise: null
      };

    default:
      return state;
  };
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');
export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getActiveExercise = createSelector(getTrainingState, (state: TrainingState) => state.activeExercise);
export const getIsExercise = createSelector(getTrainingState, (state: TrainingState) => state.activeExercise != null);
