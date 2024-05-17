import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActionsResponse, ActionsResponseTyped, BaseService } from './base.service';
import { DtoArea } from './entity-area/entity-area.component';

/**
 * @author Flávio Rebouças Santos
 */

@Injectable({
	providedIn: 'root'
})
export class AreaService extends BaseService {

	constructor() {
		super();
	}

	extractDto(formGroup: FormGroup): DtoArea {
		return {
			idArea: -1,
			rawData: formGroup.value.rawData ?? '',
			uniqueData: formGroup.value.uniqueData ?? '',
			highlighted: formGroup.value.highlighted ?? false
		};
	}

	createArea(formGroup: FormGroup, actionsResponseTyped: ActionsResponseTyped<DtoArea>) {
		const dtoArea: DtoArea = this.extractDto(formGroup);
		this.post<DtoArea>(this.getRestApi(), dtoArea, actionsResponseTyped);
	}

	removeArea(idArea: number, actionsResponse: ActionsResponse) {
		this.delete(this.getRestApiPathParam(idArea), actionsResponse);
	}

	updateArea(idArea: number, formGroup: FormGroup, actionsResponseTyped: ActionsResponseTyped<DtoArea>) {
		const dtoArea: DtoArea = this.extractDto(formGroup);
		this.update<DtoArea>(this.getRestApiPathParam(idArea), dtoArea, actionsResponseTyped);
	}

	async fetchFindAll(): Promise<DtoArea[]> {
		const data = await fetch(this.getRestApi());
		return (await data.json()) ?? [];
	}

	async fetchFindById(idArea: number | undefined): Promise<DtoArea | undefined> {
		const data = await fetch(this.getRestApiPathParam(idArea));
		return (await data.json()) ?? {};
	}
};

