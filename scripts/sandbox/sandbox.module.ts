import { NgModule } from '@angular/core';
import { SandboxRoutingModule } from './sandbox-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StoreModule } from '@ngrx/store';
import * as fromSandbox from './store-sandbox/sandbox.reducer';

// Components
import { SandboxRootComponent } from './sandbox-root/sandbox-root.component';
import { SandboxComponent } from './sandbox/sandbox.component';

@NgModule({
  declarations: [SandboxRootComponent, SandboxComponent],
  imports: [
    SandboxRoutingModule,
    MatToolbarModule,
    StoreModule.forFeature('sandboxState', fromSandbox.sandboxReducer),
  ],
})
export class SandboxModule {}
