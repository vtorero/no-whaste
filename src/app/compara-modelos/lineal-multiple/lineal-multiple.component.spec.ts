import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinealMultipleComponent } from './lineal-multiple.component';

describe('LinealMultipleComponent', () => {
  let component: LinealMultipleComponent;
  let fixture: ComponentFixture<LinealMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinealMultipleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinealMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
