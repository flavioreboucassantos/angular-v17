import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AreaService } from '../area.service';
import { BaseViewComponent, ViewExpected } from '../base.view-component';
import { ActionsResponseTyped } from '../base.service';

export interface DtoArea {
	idArea: number;
	rawData: string;
	uniqueData: string;
	highlighted: boolean;
}

@Component({
	selector: 'app-entity-area',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './entity-area.component.html',
	styleUrl: './entity-area.component.css'
})
export class EntityAreaComponent extends BaseViewComponent {

	viewExpected?: ViewExpected;

	readonly areaService: AreaService = inject(AreaService);

	readonly formArea = new FormGroup({
		rawData: new FormControl(''),
		uniqueData: new FormControl(''),
		highlighted: new FormControl(false)
	});

	idArea: number = -1;
	dtoArea: DtoArea | undefined;

	constructor() {
		super();

		this.viewExpected = this.getViewExpected()

		switch (this.viewExpected) {
			case ViewExpected.create:
				this.viewCreate();
				break;
			case ViewExpected.updateById:
				this.viewUpdateById();
				break;
		}
	}

	viewCreate() {
	}

	viewUpdateById() {
		this.idArea = parseInt(this.activatedRoute.snapshot.params['id'], 10);
		this.areaService.fetchFindById(this.idArea).then((dtoArea) => {
			if (dtoArea)
				this.formArea.setValue({
					rawData: dtoArea.rawData,
					uniqueData: dtoArea.uniqueData,
					highlighted: dtoArea?.highlighted
				});
		}
		);
	}

	submit() {
		const actionsResponseTyped: ActionsResponseTyped<DtoArea> = {
			next: (value: DtoArea) => {
				console.log("next: " + value);
			},
			error: (error: any) => {
				console.log("error: " + error);
			},
			complete: () => {
				console.log("complete<-");
			}
		}
		switch (this.viewExpected) {
			case ViewExpected.create:
				this.areaService.createArea(this.formArea, actionsResponseTyped);
				break;
			case ViewExpected.updateById:
				this.areaService.updateArea(this.idArea, this.formArea, actionsResponseTyped);
				break;
		}
	}

}
