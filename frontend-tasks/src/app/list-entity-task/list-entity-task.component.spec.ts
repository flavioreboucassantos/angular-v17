import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEntityTask } from './list-entity-task.component';

describe('ListEntityTaskComponent', () => {
  let component: ListEntityTask;
  let fixture: ComponentFixture<ListEntityTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEntityTask]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListEntityTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
