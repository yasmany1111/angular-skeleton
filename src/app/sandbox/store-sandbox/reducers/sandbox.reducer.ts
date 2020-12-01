import * as SandBoxActionTypes from '../actions/sandbox.actions';
import { on, createReducer } from '@ngrx/store';

export const filtersStateFeatureKey = 'filtersState';

export interface ISandboxState {
  values: string[];
}

export const filtersInitialState: ISandboxState = {
  // Values
  values: [],
};

export const sandboxReducer = createReducer(
  filtersInitialState,
  on(SandBoxActionTypes.SetValuesInStore, (state, action) => {
    return { ...state, values: action.valuesInStore };
  })
);
