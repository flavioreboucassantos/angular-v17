import { Injectable } from '@angular/core';
import { DtoArea } from './entity-area/entity-area.component';

@Injectable({
	providedIn: 'root'
})
export class AreaService {

	constructor() { }

	createArea(rawData: string, highlighted: boolean) {
		console.log(
			`Area: rawData: ${rawData}, highlighted: ${highlighted}.`,
		);
	}

	listDtoArea: DtoArea[] = [{
		idArea: 1,
		rawData: 'my text 1',
		highlighted: false
	}, {
		idArea: 2,
		rawData: 'my text 2',
		highlighted: true
	}, {
		idArea: 3,
		rawData: 'my text 3',
		highlighted: false
	}, {
		idArea: 4,
		rawData: 'my text 4',
		highlighted: true
	}];

	findAll(): DtoArea[] {
		return this.listDtoArea;
	}

	findById(idArea: number): DtoArea | undefined {
		return this.listDtoArea.find((dtoArea) => dtoArea.idArea === idArea);
	}
}
