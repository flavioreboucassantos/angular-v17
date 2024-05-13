import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityAreaComponent } from './entity-area.component';

describe('EntityAreaComponent', () => {
  let component: EntityAreaComponent;
  let fixture: ComponentFixture<EntityAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntityAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
