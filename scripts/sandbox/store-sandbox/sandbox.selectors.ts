import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ISandboxState } from './sandbox.reducer';

export const selectSandboxState = createFeatureSelector<ISandboxState>('sandboxState');

export const selectValuesInStore = createSelector(
  selectSandboxState,
  (sandboxState: ISandboxState) => {
    return sandboxState.values;
  }
);
