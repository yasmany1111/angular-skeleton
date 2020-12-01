import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from '../../core/store-app/reducers';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { selectValuesInStore } from '../store-sandbox/selectors/sandbox.selectors';

@Component({
  selector: 'app-sandbox-root',
  templateUrl: './sandbox-root.component.html',
  styleUrls: ['./sandbox-root.component.scss'],
})
export class SandboxRootComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private store: Store<IAppState>) {}

  public ngOnInit(): void {
    this.store
      .pipe(select(selectValuesInStore))
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => console.log('Sandbox Data: ', 'selectValuesInStore', data));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
