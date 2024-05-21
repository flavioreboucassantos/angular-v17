import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';

import { ModalActionsResponseComponent } from '../modal-actions-response/modal-actions-response.component';

import { HttpErrorResponse } from '@angular/common/http';
import { AreaService } from '../area.service';
import { ActionsResponse, ActionsResponseTyped } from '../base.core';
import { BaseViewComponent } from '../base.view-component';
import { DtoArea } from '../entity-area/entity-area.component';


/**
* @author Flávio Rebouças Santos
* @link flavioReboucasSantos@gmail.com
*/
@Component({
	selector: 'app-list-entity-area',
	standalone: true,
	imports: [CommonModule, ModalActionsResponseComponent],
	templateUrl: './list-entity-area.component.html',
	styleUrl: './list-entity-area.component.css'
})
export class ListEntityAreaComponent extends BaseViewComponent {

	@ViewChild(ModalActionsResponseComponent) readonly modalActionsResponse?: ModalActionsResponseComponent;

	readonly areaService: AreaService = inject(AreaService);

	listDtoArea: DtoArea[] = [];
	filteredListDtoArea: DtoArea[] = [];

	private removeFromLists(idArea: number) {
		this.filteredListDtoArea = this.listDtoArea.filter((dtoArea) => {
			if (dtoArea?.idArea == idArea) return false;
			return true;
		});
		this.listDtoArea = this.filteredListDtoArea;
	}

	constructor() {
		super();

		const actionsResponse: ActionsResponseTyped<DtoArea[]> = {
			next: (value: DtoArea[]) => {
				this.listDtoArea = value;
				this.filteredListDtoArea = value;
			},
			error: (error: HttpErrorResponse) => {
				this.modalActionsResponse?.open('error:', this.extractErrorResponse(error));
			},
			complete: () => {
			}
		}
		this.areaService.findAll(actionsResponse);
	}

	filterResults(searchString: string) {
		if (!searchString) {
			this.filteredListDtoArea = this.listDtoArea;
			return;
		}
		if (this.isNumber(searchString)) {
			this.filteredListDtoArea = this.listDtoArea.filter((dtoArea) => {
				if (dtoArea?.idArea == Number(searchString)) return true;
				if (dtoArea?.rawData?.indexOf(searchString) != -1) return true;
				if (dtoArea?.uniqueData?.indexOf(searchString) != -1) return true;
				return false;
			});
		} else {
			const searchStringLC: string = searchString.toLowerCase();
			this.filteredListDtoArea = this.listDtoArea.filter((dtoArea) => {
				if (dtoArea?.rawData?.toLowerCase().indexOf(searchStringLC) != -1) return true;
				if (dtoArea?.uniqueData?.toLowerCase().indexOf(searchStringLC) != -1) return true;
				return false;
			});
		}
	}

	openArea(idArea: number | undefined) {
		this.navigate(['vr', idArea]);
	}


	removeArea(idArea: number) {
		const rowArea: HTMLElement | null = document.getElementById('idRowArea' + idArea);
		rowArea?.classList.add('deleting');

		const actionsResponse: ActionsResponse = {
			next: (value: string) => {
			},
			error: (error: HttpErrorResponse) => {
				this.modalActionsResponse?.open('error:', this.extractErrorResponse(error));
				rowArea?.classList.remove('deleting');
			},
			complete: () => {
				rowArea?.remove();
				this.removeFromLists(idArea);
			}
		}
		this.areaService.remove(idArea, actionsResponse);
	}

}
