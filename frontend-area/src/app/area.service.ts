import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { DtoArea } from './entity-area/entity-area.component';

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
		// 	this.baseUrlRestApiSettedOrigin
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
		if (isNaN(idArea)) {
			return undefined;
		} else {
			const data = await fetch(this.doPathParamRest(idArea));
			return (await data.json()) ?? {};
		}
	}
}
