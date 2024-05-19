import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedneuronalComponent } from './redneuronal.component';

describe('RedneuronalComponent', () => {
  let component: RedneuronalComponent;
  let fixture: ComponentFixture<RedneuronalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedneuronalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedneuronalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
