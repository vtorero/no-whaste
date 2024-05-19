import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegresionMultipleComponent } from './regresion-multiple.component';

describe('RegresionMultipleComponent', () => {
  let component: RegresionMultipleComponent;
  let fixture: ComponentFixture<RegresionMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegresionMultipleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegresionMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
