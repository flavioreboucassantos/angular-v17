import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEntityAreaComponent } from './list-entity-area.component';

describe('ListEntityAreaComponent', () => {
	let component: ListEntityAreaComponent;
	let fixture: ComponentFixture<ListEntityAreaComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ListEntityAreaComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(ListEntityAreaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
