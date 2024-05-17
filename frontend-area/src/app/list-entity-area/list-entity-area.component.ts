import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ModalActionsResponseComponent } from '../modal-actions-response/modal-actions-response.component';

import { HttpErrorResponse } from '@angular/common/http';
import { AreaService } from '../area.service';
import { ActionsResponse } from '../base.service';
import { BaseViewComponent } from '../base.view-component';
import { DtoArea } from '../entity-area/entity-area.component';


@Component({
	selector: 'app-list-entity-area',
	standalone: true,
	imports: [CommonModule, ModalActionsResponseComponent],
	templateUrl: './list-entity-area.component.html',
	styleUrl: './list-entity-area.component.css'
})
export class ListEntityAreaComponent extends BaseViewComponent {

	readonly modalActionsResponse: ModalActionsResponseComponent = new ModalActionsResponseComponent();

	readonly areaService: AreaService = inject(AreaService);

	listDtoArea: DtoArea[] = [];
	filteredListDtoArea: DtoArea[] = [];

	constructor() {
		super();

		this.areaService.fetchFindAll().then((listDtoArea: DtoArea[]) => {
			this.listDtoArea = listDtoArea;
			this.filteredListDtoArea = listDtoArea;
		});
	}

	filterResults(searchString: string) {
		if (!searchString) {
			this.filteredListDtoArea = this.listDtoArea;
			return;
		}
		if (this.isNumber(searchString)) {
			this.filteredListDtoArea = this.listDtoArea.filter((dtoArea) => {
				if (dtoArea?.idArea == Number(searchString)) return true;
				return false;
			});
		} else {
			let searchStringLC: string = searchString.toLowerCase();
			this.filteredListDtoArea = this.listDtoArea.filter((dtoArea) => {
				if (dtoArea?.rawData?.toLowerCase().indexOf(searchStringLC) != -1) return true;
				if (dtoArea?.uniqueData?.toLowerCase().indexOf(searchStringLC) != -1) return true;
				return false;
			});
		}
	}

	openArea(idArea: number | undefined) {
		this.router.navigate(['vr', idArea]);
	}


	removeArea(idArea: number) {
		const rowArea: HTMLElement | null = document.getElementById('idRowArea' + idArea);
		rowArea?.classList.add('deleting');

		const actionsResponse: ActionsResponse = {
			next: (value: string) => {
			},
			error: (error: HttpErrorResponse) => {
				this.modalActionsResponse.open('error:', this.extractErrorResponse(error));
				rowArea?.classList.remove('deleting');
			},
			complete: () => {
				/*remove tr*/
				rowArea?.remove();
			}
		}
		this.areaService.removeArea(idArea, actionsResponse);
	}

}
