import { Injectable } from '@angular/core';
import { ActionsResponse, ActionsResponseTyped, BaseService } from './base.service';
import { OutSourceMachineState } from './base.state-request';
import { DtoArea } from './entity-area/entity-area.component';

/**
* Class for Especification of Service Process.
* @author Flávio Rebouças Santos
* @link flavioReboucasSantos@gmail.com
*/
@Injectable({
	providedIn: 'root'
})
export class AreaService extends BaseService {

	readonly singleOutSourceMachineState: OutSourceMachineState = { url: this.getRestApi() };
	readonly mapOutSourceMachineStateByIdArea: Map<number, OutSourceMachineState> = new Map<number, OutSourceMachineState>();

	private prepareAndGetOutSourceMachineState(idArea: number): OutSourceMachineState {
		const outSourceMachineState: OutSourceMachineState | undefined = this.mapOutSourceMachineStateByIdArea.get(idArea);
		if (outSourceMachineState === undefined) {
			const newOutSourceMachineState: OutSourceMachineState = { url: this.getRestApiPathParam(idArea) };
			this.mapOutSourceMachineStateByIdArea.set(idArea, newOutSourceMachineState)
			return newOutSourceMachineState;
		} else
			return outSourceMachineState;
	}

	constructor() {
		super();
	}

	findAll(actionsResponseTyped: ActionsResponseTyped<DtoArea[]>): boolean {		
		return this.getT(this.singleOutSourceMachineState, actionsResponseTyped);
	}

	findById(idArea: number, actionsResponseTyped: ActionsResponseTyped<DtoArea>): boolean {
		return this.getT(this.prepareAndGetOutSourceMachineState(idArea), actionsResponseTyped);
	}

	create(origin: any, actionsResponseTyped: ActionsResponseTyped<DtoArea>): boolean {
		return this.postTT(this.getRestApi(), origin, actionsResponseTyped);
	}

	update(idArea: number, origin: any, actionsResponseTyped: ActionsResponseTyped<DtoArea>): boolean {
		return this.putTT(this.getRestApiPathParam(idArea), origin, actionsResponseTyped);
	}

	remove(idArea: number, actionsResponse: ActionsResponse): boolean {
		return this.delete(this.prepareAndGetOutSourceMachineState(idArea), actionsResponse);
	}
};

