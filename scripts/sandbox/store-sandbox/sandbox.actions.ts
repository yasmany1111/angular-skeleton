import { createAction, props } from '@ngrx/store';

export const SetValuesInStore = createAction(
  '[Filters] Set the value in the store',
  props<{ valuesInStore: string[] }>()
);
