import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReduccionComponent } from './reduccion.component';

describe('ReduccionComponent', () => {
  let component: ReduccionComponent;
  let fixture: ComponentFixture<ReduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReduccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
