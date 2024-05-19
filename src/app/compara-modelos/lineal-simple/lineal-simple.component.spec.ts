import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinealSimpleComponent } from './lineal-simple.component';

describe('LinealSimpleComponent', () => {
  let component: LinealSimpleComponent;
  let fixture: ComponentFixture<LinealSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinealSimpleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinealSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
