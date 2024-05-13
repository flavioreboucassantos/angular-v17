import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AreaService } from '../area.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface DtoArea {
	idArea: number;
	rawData: string;
	highlighted: boolean;
}

@Component({
	selector: 'app-entity-area',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './entity-area.component.html',
	styleUrl: './entity-area.component.css'
})
export class EntityAreaComponent {

	route: ActivatedRoute = inject(ActivatedRoute);
	areaService: AreaService = inject(AreaService);

	formArea = new FormGroup({
		rawData: new FormControl(''),
		highlighted: new FormControl(false)
	});

	dtoArea: DtoArea | undefined;

	constructor() {
		this.dtoArea = this.areaService.findById(Number(this.route.snapshot.params['id']));
		if (this.dtoArea != undefined)
			this.formArea.setValue({
				rawData: this.dtoArea.rawData,
				highlighted: this.dtoArea?.highlighted
			});
	}

	createArea() {
		this.areaService.createArea(
			this.formArea.value.rawData ?? '',
			this.formArea.value.highlighted ?? false,
		);
	}

}
