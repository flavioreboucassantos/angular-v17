import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActionsResponse, ActionsResponseTyped, BaseService } from './base.service';
import { DtoArea } from './entity-area/entity-area.component';

/**
 * @author Flávio Rebouças Santos flavioReboucasSantos@gmail.com
 */

@Injectable({
	providedIn: 'root'
})
export class AreaService extends BaseService {

	protected extractDto(formGroup: FormGroup): DtoArea {
		return {
			idArea: -1,
			rawData: formGroup.value.rawData ?? '',
			uniqueData: formGroup.value.uniqueData ?? '',
			highlighted: formGroup.value.highlighted ?? false
		};
	}

	constructor() {
		super();
	}

	findAll(actionsResponse: ActionsResponseTyped<DtoArea[]>) {
		this.get(this.getRestApi(), actionsResponse);
	}

	findById(idArea: number, actionsResponse: ActionsResponseTyped<DtoArea>) {
		this.get(this.getRestApiPathParam(idArea), actionsResponse);
	}

	create(formGroup: FormGroup, actionsResponse: ActionsResponseTyped<DtoArea>) {
		const dtoArea: DtoArea = this.extractDto(formGroup);
		this.postXX(this.getRestApi(), dtoArea, actionsResponse);
	}

	update(idArea: number, formGroup: FormGroup, actionsResponse: ActionsResponseTyped<DtoArea>) {
		const dtoArea: DtoArea = this.extractDto(formGroup);
		this.updateXX(this.getRestApiPathParam(idArea), dtoArea, actionsResponse);
	}

	remove(idArea: number, actionsResponse: ActionsResponse) {
		this.delete(this.getRestApiPathParam(idArea), actionsResponse);
	}
};

