import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AreaService } from '../area.service';
import { ActionsResponse } from '../base.service';
import { BaseViewComponent } from '../base.view-component';
import { DtoArea } from '../entity-area/entity-area.component';

@Component({
	selector: 'app-list-entity-area',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './list-entity-area.component.html',
	styleUrl: './list-entity-area.component.css'
})
export class ListEntityAreaComponent extends BaseViewComponent {
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
				if (dtoArea?.rawData.toLowerCase().indexOf(searchStringLC) != -1) return true;
				if (dtoArea?.uniqueData.toLowerCase().indexOf(searchStringLC) != -1) return true;
				return false;
			});
		}
	}

	openArea(idArea: number | undefined) {
		this.router.navigate(['vr', idArea]);
	}


	removeArea(event: Event, idArea: number) {
		const elTarget = (event.target as HTMLElement);
		elTarget.parentElement?.parentElement?.classList.add('deleting');

		const actionsResponse: ActionsResponse = {
			next: (value: string) => {
				console.log("next: " + value);
			},
			error: (error: any) => {
				console.log("error: " + error);
			},
			complete: () => {
				console.log("complete<-");
			}
		}
		this.areaService.removeArea(idArea, actionsResponse);
	}

}
