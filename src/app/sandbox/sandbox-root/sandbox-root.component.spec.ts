import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SandboxRootComponent } from './sandbox-root.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SandboxRootComponent', () => {
  let component: SandboxRootComponent;
  let fixture: ComponentFixture<SandboxRootComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SandboxRootComponent],
        imports: [RouterTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SandboxRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
