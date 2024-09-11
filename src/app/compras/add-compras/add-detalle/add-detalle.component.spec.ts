import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDetalleComponent } from './add-detalle.component';

describe('AddDetalleComponent', () => {
  let component: AddDetalleComponent;
  let fixture: ComponentFixture<AddDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
