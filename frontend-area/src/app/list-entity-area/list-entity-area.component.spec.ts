import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEntityArea } from './list-entity-area.component';

describe('ListEntityAreaComponent', () => {
  let component: ListEntityArea;
  let fixture: ComponentFixture<ListEntityArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEntityArea]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListEntityArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
