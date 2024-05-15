import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AreaService } from '../area.service';
import { DtoArea } from '../entity-area/entity-area.component';

@Component({
	selector: 'app-list-entity-area',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './list-entity-area.component.html',
	styleUrl: './list-entity-area.component.css'
})
export class ListEntityAreaComponent {
	router: Router = inject(Router);

	areaService: AreaService = inject(AreaService);

	listDtoArea: DtoArea[] = [];
	filteredListDtoArea: DtoArea[] = [];

	constructor() {
		this.areaService.fetchFindAll().then((listDtoArea: DtoArea[]) => {
			this.listDtoArea = listDtoArea;
			this.filteredListDtoArea = listDtoArea;
		});
	}

	filterResults(text: String) {
		if (!text) {
			this.filteredListDtoArea = this.listDtoArea;
			return;
		}

		let textLowerCase: string = text.toLowerCase();

		this.filteredListDtoArea = this.listDtoArea.filter((dtoArea) => {
			return dtoArea?.rawData?.toLowerCase().includes(textLowerCase) || dtoArea?.uniqueData?.toLowerCase().includes(textLowerCase);
		});
	}

	openArea(idArea: Number | undefined) {
		this.router.navigate(['form', idArea]);
	}


	removeArea(idArea: Number | undefined) {
		this.areaService.removeArea(idArea);
	}

}
