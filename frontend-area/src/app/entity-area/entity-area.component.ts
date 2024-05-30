import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterContentInit, Component, ViewChild, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { AreaService } from '../area.service';
import { ActionsResponseTyped } from '../base.service';
import { KeyStringAny } from '../base.state-request';
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

	readonly untypedFormGroup = new UntypedFormGroup({
		rawData: new FormControl(''),
		uniqueData: new FormControl(''),
		highlighted: new FormControl(false)
	});

	readonly untypedFormGroup2 = new UntypedFormGroup({
	});

	countDisabled: number = 0;
	countFalses: number = 0;

	idArea: number = -1;

	ready: boolean = false;

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
		this.ready = true;
	}

	viewUpdateById() {
		const actionsResponseTyped: ActionsResponseTyped<DtoArea> = {
			disabled: () => {
				this.countDisabled++;
			},
			next: (value: DtoArea) => {

				console.log("findById -> next:");
				console.log(value);

				if (value) {
					this.idArea = value.idArea;
					this.untypedFormGroup.setValue({
						rawData: value.rawData,
						uniqueData: value.uniqueData,
						highlighted: value?.highlighted
					});
					this.ready = true;
				}
			},
			error: (error: HttpErrorResponse) => {
				this.modalActionsResponse?.open('error:', this.extractErrorResponse(error));
			},
			complete: () => { }
		}

		this.countDisabled = 0;
		this.countFalses = 0;

		const pathParamId = parseInt(this.getPathParam('id'), 10);
		for (let i = 0; i < 11; i++)
			if (!this.areaService.findById(pathParamId, actionsResponseTyped))
				this.countFalses++;

		console.log("this.countDisabled = " + this.countDisabled);
		console.log("this.countFalses = " + this.countFalses);
	}

	doSubmit(dtoAndMachineState: KeyStringAny): void;
	doSubmit(formGroupLikeMachineState: UntypedFormGroup): void;
	doSubmit(origin: any): void {
		let idAreaCreated: number;
		const actionsResponse: ActionsResponseTyped<DtoArea> = {
			disabled: () => {
				this.countDisabled++;
			},
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
				if (!this.areaService.create(origin, actionsResponse))
					this.countFalses++;

				break;

			case ViewExpected.updateById:
				actionsResponse.complete = () => this.modalActionsResponse?.open('Sucesso!', 'Área Atualizada.');
				if (!this.areaService.update(this.idArea, origin, actionsResponse))
					this.countFalses++;

				break;
		}
	}

	submitTest1() {
		console.log('1) KeyStringAny <= Machine State');

		const dtoAndMachineState: KeyStringAny = this.copyAllEnumerable1({}, this.untypedFormGroup.getRawValue())
		for (let i = 0; i < 11; i++)
			this.doSubmit(dtoAndMachineState);
		console.log(dtoAndMachineState);
	}

	submitTest2() {
		console.log('2) UntypedFormGroup <= Machine State');

		for (let i = 0; i < 21; i++)
			this.doSubmit(this.untypedFormGroup);
		console.log(this.untypedFormGroup.getRawValue());
	}

	// 3_x Live Update: Testes com Atualização de Dados por Compartilhamento de Estado de Máquina.
	// - Note: Able to prepare the Machine State and Shares before any Submit.
	// - Note: Able to indicate multiple targets for Teardown. Accepted Targets: type StateRequestTarget.
	// - Note: Performs the First Teardown (disable...) on targets that are attached during the request's progress.

	submitTest3_1() {

		console.log('3_1) KeyStringAny <= KeyStringAny');

		const dtoAndMachineState1: KeyStringAny = this.copyAllEnumerable1({}, this.untypedFormGroup.getRawValue());

		this.areaService.setOnOffTeardown(dtoAndMachineState1, true); // try false

		this.areaService.appendStateRequestTarget(dtoAndMachineState1, this.untypedFormGroup);
		this.doSubmit(dtoAndMachineState1); // Assert Acceptance: 1 Submit(s), 1 Request(s)
		console.log('this.untypedFormGroup.disabled = ' + this.untypedFormGroup.disabled);
		console.log(dtoAndMachineState1);

		// Live Update
		const dtoAndMachineState2: KeyStringAny = this.copyAllEnumerable1({}, this.untypedFormGroup.getRawValue());

		this.areaService.shareAndAppendTargetStateRequest(dtoAndMachineState2, dtoAndMachineState1);
		this.doSubmit(dtoAndMachineState2); // Assert Rejection: 2 Submit(s), 1 Request(s)
		console.log(dtoAndMachineState2);
	}

	submitTest3_2() {

		console.log('3_2) KeyStringAny <= UntypedFormGroup');

		this.doSubmit(this.untypedFormGroup); // Assert Acceptance: 1 Submit(s), 1 Request(s)		

		// Live Update		
		const dtoAndMachineState1: KeyStringAny = this.copyAllEnumerable1({}, this.untypedFormGroup.getRawValue());

		this.areaService.shareAndAppendTargetStateRequest(dtoAndMachineState1, this.untypedFormGroup);
		this.doSubmit(dtoAndMachineState1); // Assert Rejection: 2 Submit(s), 1 Request(s)
		console.log(dtoAndMachineState1);
	}

	submitTest3_3() {

		console.log('3_3) UntypedFormGroup <= UntypedFormGroup');

		// Live Update
	}

	submitTest3_4() {

		console.log('3_4) UntypedFormGroup <= KeyStringAny');

		const dtoAndMachineState1: KeyStringAny = this.copyAllEnumerable1({}, this.untypedFormGroup.getRawValue());

		this.areaService.setOnOffTeardown(dtoAndMachineState1, true); // try false

		this.doSubmit(dtoAndMachineState1); // Assert Acceptance: 1 Submit(s), 1 Request(s)

		// Live Update
		this.areaService.shareAndAppendTargetStateRequest(this.untypedFormGroup, dtoAndMachineState1); // Performs the First Teardown
		this.doSubmit(dtoAndMachineState1); // Assert Rejection: 2 Submit(s), 1 Request(s)

		// this.areaService.unappendStateRequestTarget(this.untypedFormGroup); // try unappendStateRequestTarget
		// this.areaService.deleteAndUnappendStateRequest(this.untypedFormGroup); // try deleteAndUnappendStateRequest

		console.log('this.untypedFormGroup.disabled = ' + this.untypedFormGroup.disabled);
		console.log(this.untypedFormGroup.getRawValue());
		console.log(dtoAndMachineState1);
	}

	submit() {
		// !) Do not run more than one test per build, as they are copying the state of the same form.

		this.countDisabled = 0;
		this.countFalses = 0;

		this.areaService.setDefaultOnOffTeardown(true);

		// this.submitTest1();
		// this.submitTest2();
		// this.submitTest3_1();
		// this.submitTest3_2();
		// this.submitTest3_3();
		this.submitTest3_4();

		console.log("this.countDisabled = " + this.countDisabled);
		console.log("this.countFalses = " + this.countFalses);
	}
}
