import { Injectable } from '@angular/core';
import { ActionsResponse, ActionsResponseTyped } from './base.core';
import { BaseService } from './base.service';
import { DtoArea } from './entity-area/entity-area.component';

/**
* @author Flávio Rebouças Santos
* @link flavioReboucasSantos@gmail.com
*/
@Injectable({
	providedIn: 'root'
})
export class AreaService extends BaseService {

	constructor() {
		super();
	}

	findAll(actionsResponseTyped: ActionsResponseTyped<DtoArea[]>) {
		this.getT(this.getRestApi(), actionsResponseTyped);
	}

	findById(idArea: number, actionsResponseTyped: ActionsResponseTyped<DtoArea>) {
		this.getT(this.getRestApiPathParam(idArea), actionsResponseTyped);
	}

	create(origin: any, actionsResponseTyped: ActionsResponseTyped<DtoArea>) {
		this.postTT(this.getRestApi(), origin, actionsResponseTyped);
	}

	update(idArea: number, origin: any, actionsResponseTyped: ActionsResponseTyped<DtoArea>) {
		this.putTT(this.getRestApiPathParam(idArea), origin, actionsResponseTyped);
	}

	remove(idArea: number, actionsResponse: ActionsResponse) {
		this.delete(this.getRestApiPathParam(idArea), actionsResponse);
	}
};

