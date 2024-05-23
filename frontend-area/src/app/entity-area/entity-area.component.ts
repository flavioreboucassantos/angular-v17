import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterContentInit, Component, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AreaService } from '../area.service';
import { ActionsResponseTyped, CoreDto } from '../base.core';
import { BaseViewComponent, ViewExpected } from '../base.view-component';
import { ModalActionsResponseComponent } from '../modal-actions-response/modal-actions-response.component';

export interface DtoArea {
	idArea: number;
	rawData: string;
	uniqueData: string;
	highlighted: boolean;
}

/**
* @author Flávio Rebouças Santos
* @link flavioReboucasSantos@gmail.com
*/
@Component({
	selector: 'app-entity-area',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, ModalActionsResponseComponent],
	templateUrl: './entity-area.component.html',
	styleUrl: './entity-area.component.css'
})
export class EntityAreaComponent extends BaseViewComponent implements AfterContentInit {

	@ViewChild(ModalActionsResponseComponent) readonly modalActionsResponse?: ModalActionsResponseComponent;

	readonly viewExpected?: ViewExpected;

	readonly areaService: AreaService = inject(AreaService);

	readonly dtoAndMachineState: CoreDto = {};
	readonly formGroupArea = new FormGroup({
		rawData: new FormControl(''),
		uniqueData: new FormControl(''),
		highlighted: new FormControl(false)
	});

	idArea: number = -1;

	constructor() {
		super();

		this.viewExpected = this.getViewExpected()

		switch (this.viewExpected) {
			case ViewExpected.create:
				this.viewCreate();
				break;

			case ViewExpected.updateById:
				this.viewUpdateById();
				break;
		}
	}

	ngAfterContentInit(): void {
	}

	viewCreate() {
	}

	viewUpdateById() {
		this.idArea = parseInt(this.getPathParam('id'), 10);

		const actionsResponse: ActionsResponseTyped<DtoArea> = {
			next: (value: DtoArea) => {
				if (value)
					this.formGroupArea.setValue({
						rawData: value.rawData,
						uniqueData: value.uniqueData,
						highlighted: value?.highlighted
					});
			},
			error: (error: HttpErrorResponse) => {
				this.modalActionsResponse?.open('error:', this.extractErrorResponse(error));
			},
			complete: () => { }
		}

		this.areaService.findById(this.idArea, actionsResponse);
	}

	doSubmit(dtoAndMachineState: CoreDto): void;
	doSubmit(formGroupLikeMachineState: FormGroup): void;
	doSubmit(origin: any): void {
		let idAreaCreated: number;
		const actionsResponse: ActionsResponseTyped<DtoArea> = {
			next: (value: DtoArea) => {
				idAreaCreated = value.idArea;
			},
			error: (error: HttpErrorResponse) => {
				this.modalActionsResponse?.open('error:', this.extractErrorResponse(error));
			},
			complete: () => {
				// NOT USED - REWRITTED AFTER				
			}
		}

		switch (this.viewExpected) {
			case ViewExpected.create:
				actionsResponse.complete = () => this.modalActionsResponse?.open(
					'Sucesso!',
					'Área Criada com Sucesso.',
					() => this.reloadWithPath(idAreaCreated)
				);
				this.areaService.create(origin, actionsResponse);
				break;

			case ViewExpected.updateById:
				actionsResponse.complete = () => this.modalActionsResponse?.open('Sucesso!', 'Área Atualizada.');
				this.areaService.update(this.idArea, origin, actionsResponse);
				break;
		}
	}

	submitTest1() {
		// Teste em Machine State = Object CoreDto
		this.copyAllEnumerable1(this.dtoAndMachineState, this.formGroupArea.value)
		for (let i = 0; i < 11; i++)
			this.doSubmit(this.dtoAndMachineState);
	}

	submitTest2() {
		// Teste em Machine State = FormGroup
		for (let i = 0; i < 21; i++)
			this.doSubmit(this.formGroupArea);
	}

	submitTest3() {
		// Live Update: Teste com atualização de dados por atribuição de estado.

		let liveUpdateDtoAndMachineState1: CoreDto;
		let liveUpdateDtoAndMachineState2: CoreDto;

		// 1) CoreDto <= FormGroup
		liveUpdateDtoAndMachineState1 = {};
		liveUpdateDtoAndMachineState1 = this.areaService.assignState(liveUpdateDtoAndMachineState1, this.formGroupArea);
		liveUpdateDtoAndMachineState1 = this.copyAllEnumerable1(liveUpdateDtoAndMachineState1, this.formGroupArea.value); // LIVE UPDATE
		// console.log(liveUpdateDtoAndMachineState1);
		this.doSubmit(liveUpdateDtoAndMachineState1); // Assert: First Submit, First Requests

		// 2) CoreDto <= CoreDto
		liveUpdateDtoAndMachineState2 = {};
		liveUpdateDtoAndMachineState2 = this.areaService.assignState(liveUpdateDtoAndMachineState2, liveUpdateDtoAndMachineState1);
		liveUpdateDtoAndMachineState2 = this.copyAllEnumerable1(liveUpdateDtoAndMachineState2, this.formGroupArea.value); // LIVE UPDATE
		// console.log(liveUpdateDtoAndMachineState2);
		this.doSubmit(liveUpdateDtoAndMachineState2); // Assert: 2 Submits, 1 Requests		

		// 3) FormGroup <= FormGroup
		// ...

		// 4) FormGroup <= CoreDto
		this.formGroupArea.enable() // force enable to test
		this.areaService.assignState(this.formGroupArea, liveUpdateDtoAndMachineState2);
		// console.log(this.formGroupArea.disabled);
		this.doSubmit(this.formGroupArea); // Assert: 3 Submits, 1 Requests

		// this.formGroupArea had its State updated as it was assigned from the previous one.
		// Since the accepted request was the first submit, the teardown event that enables Machine State is performed only on its object.
		// Assert this.formGroupArea is disabled here.
	}

	submit() {
		this.areaService.setOnOffTeardown(true);
		// this.submitTest1();
		// this.submitTest2();
		this.submitTest3();
	}
}
