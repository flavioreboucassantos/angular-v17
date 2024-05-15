import { Injectable, inject } from '@angular/core';
import { DtoArea } from './entity-area/entity-area.component';
import { BaseService } from './base.service';

@Injectable({
	providedIn: 'root'
})
export class AreaService extends BaseService {

	constructor() {
		super();
		// console.log(
		// 	location
		// );
		// console.log(
		// 	this.baseUrlRestApi
		// );
	}

	createArea(rawData: string, uniqueData: string, highlighted: boolean) {
		console.log(
			`Area(rawData: ${rawData}, uniqueData: ${uniqueData} highlighted: ${highlighted}).`,
		);
	}

	removeArea(idArea: Number | undefined) {
		console.log(
			`Area(idArea: ${idArea}).`,
		);
	}

	async fetchFindAll(): Promise<DtoArea[]> {
		const data = await fetch(this.baseUrlRestApi);
		return (await data.json()) ?? [];
	}

	async fetchFindById(idArea: number): Promise<DtoArea | undefined> {
		const data = await fetch(this.doPathParamRest(idArea));
		return (await data.json()) ?? {};
	}
}
