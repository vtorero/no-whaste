import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarventaComponent } from './editarventa.component';

describe('EditarventaComponent', () => {
  let component: EditarventaComponent;
  let fixture: ComponentFixture<EditarventaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarventaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarventaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
