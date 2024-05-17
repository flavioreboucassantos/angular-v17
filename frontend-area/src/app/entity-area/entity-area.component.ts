import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AreaService } from '../area.service';
import { ActionsResponseTyped } from '../base.service';
import { BaseViewComponent, ViewExpected } from '../base.view-component';
import { ModalActionsResponseComponent } from '../modal-actions-response/modal-actions-response.component';

export interface DtoArea {
	idArea: number;
	rawData: string;
	uniqueData: string;
	highlighted: boolean;
}

@Component({
	selector: 'app-entity-area',
	standalone: true,
	imports: [ReactiveFormsModule, ModalActionsResponseComponent],
	templateUrl: './entity-area.component.html',
	styleUrl: './entity-area.component.css'
})
export class EntityAreaComponent extends BaseViewComponent {

	readonly modalActionsResponse: ModalActionsResponseComponent = new ModalActionsResponseComponent();

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
		let idAreaCreated: number;
		const actionsResponse: ActionsResponseTyped<DtoArea> = {
			next: (value: DtoArea) => {
				idAreaCreated = value.idArea;
			},
			error: (error: HttpErrorResponse) => {
				this.modalActionsResponse.open('error:', this.extractErrorResponse(error));
			},
			complete: () => {
				this.reloadWithPath(idAreaCreated);
			}
		}
		switch (this.viewExpected) {
			case ViewExpected.create:				
				this.areaService.createArea(this.formArea, actionsResponse);
				break;
			case ViewExpected.updateById:
				actionsResponse.complete = () => {
					this.modalActionsResponse.open('Sucesso!', 'Área Atualizada.');
				}
				this.areaService.updateArea(this.idArea, this.formArea, actionsResponse);
				break;
		}
	}

}
