import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ActionsResponse, ActionsResponseTyped } from './base.state-request';
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

	findAll(actionsResponseTyped: ActionsResponseTyped<DtoArea[]>): boolean {
		return this.getT(this.getRestApi(), actionsResponseTyped);
	}

	findById(idArea: number, actionsResponseTyped: ActionsResponseTyped<DtoArea>): boolean {
		return this.getT(this.getRestApiPathParam(idArea), actionsResponseTyped);
	}

	create(origin: any, actionsResponseTyped: ActionsResponseTyped<DtoArea>): boolean {
		return this.postTT(this.getRestApi(), origin, actionsResponseTyped);
	}

	update(idArea: number, origin: any, actionsResponseTyped: ActionsResponseTyped<DtoArea>): boolean {
		return this.putTT(this.getRestApiPathParam(idArea), origin, actionsResponseTyped);
	}

	remove(idArea: number, actionsResponse: ActionsResponse): boolean {
		return this.delete(this.getRestApiPathParam(idArea), actionsResponse);
	}
};

