import { Injectable } from '@angular/core';
import { EntityData } from './form-data/form-data.component';

@Injectable({
	providedIn: 'root'
})
export class TasksService {

	constructor() { }

	listEntityData: EntityData[] = [{
		idEntityData: 1,
		rawData: 'my text 1',
		highlighted: false
	}, {
		idEntityData: 2,
		rawData: 'my text 2',
		highlighted: true
	}, {
		idEntityData: 3,
		rawData: 'my text 3',
		highlighted: false
	}, {
		idEntityData: 4,
		rawData: 'my text 4',
		highlighted: true
	}];

	findAll(): EntityData[] {
		return this.listEntityData;
	}
	findById(idEntityData: number): EntityData | undefined {
		return this.listEntityData.find((entityData) => entityData.idEntityData === idEntityData);
	}
}
