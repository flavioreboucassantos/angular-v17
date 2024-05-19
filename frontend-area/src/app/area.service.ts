import { Injectable } from '@angular/core';
import { ActionsResponse, ActionsResponseTyped } from './base.core';
import { BaseService } from './base.service';
import { DtoArea } from './entity-area/entity-area.component';

/**
 * @author Flávio Rebouças Santos flavioReboucasSantos@gmail.com
 */

@Injectable({
	providedIn: 'root'
})
export class AreaService extends BaseService {

	constructor() {
		super();
	}

	findAll(actionsResponse: ActionsResponseTyped<DtoArea[]>) {
		this.get(this.getRestApi(), actionsResponse);
	}

	findById(idArea: number, actionsResponse: ActionsResponseTyped<DtoArea>) {
		this.get(this.getRestApiPathParam(idArea), actionsResponse);
	}

	create(dto: DtoArea, actionsResponse: ActionsResponseTyped<DtoArea>) {
		this.postXX(this.getRestApi(), dto, actionsResponse);
	}

	update(idArea: number, dto: DtoArea, actionsResponse: ActionsResponseTyped<DtoArea>) {
		this.updateXX(this.getRestApiPathParam(idArea), dto, actionsResponse);
	}

	remove(idArea: number, actionsResponse: ActionsResponse) {
		this.delete(this.getRestApiPathParam(idArea), actionsResponse);
	}
};

