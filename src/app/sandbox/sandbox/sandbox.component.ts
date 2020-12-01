import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from '../../core/store-app/reducers';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { selectValuesInStore } from '../store-sandbox/selectors/sandbox.selectors';
import { SetValuesInStore } from '../store-sandbox/actions/sandbox.actions';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss'],
})
export class SandboxComponent implements OnInit, OnDestroy {
  public isActivated = false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private store: Store<IAppState>) {}

  public ngOnInit() {
    this.store
      .pipe(select(selectValuesInStore))
      .pipe(takeUntil(this.destroy$))
      .subscribe((values: string[]) => console.log('Values from store: ', values));
  }

  public testAction() {
    this.isActivated = !this.isActivated;
    this.store.dispatch(SetValuesInStore({ valuesInStore: ['1', '1', '2', '3333', '4'] }));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
