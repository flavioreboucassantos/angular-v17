import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActionsResponseComponent } from './modal-actions-response.component';

describe('ModalActionsResponseComponent', () => {
  let component: ModalActionsResponseComponent;
  let fixture: ComponentFixture<ModalActionsResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalActionsResponseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalActionsResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
