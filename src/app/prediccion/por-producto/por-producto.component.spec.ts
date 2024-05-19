import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorProductoComponent } from './por-producto.component';

describe('PorProductoComponent', () => {
  let component: PorProductoComponent;
  let fixture: ComponentFixture<PorProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PorProductoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PorProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
