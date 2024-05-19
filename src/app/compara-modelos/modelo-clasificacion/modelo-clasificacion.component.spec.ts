import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeloClasificacionComponent } from './modelo-clasificacion.component';

describe('ModeloClasificacionComponent', () => {
  let component: ModeloClasificacionComponent;
  let fixture: ComponentFixture<ModeloClasificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeloClasificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeloClasificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
