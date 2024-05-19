import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarventaComponent } from './agregarventa.component';

describe('AgregarventaComponent', () => {
  let component: AgregarventaComponent;
  let fixture: ComponentFixture<AgregarventaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarventaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarventaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
