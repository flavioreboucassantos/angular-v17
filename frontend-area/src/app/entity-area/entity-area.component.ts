import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterContentInit, Component, ViewChild, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { AreaService } from '../area.service';
import { ActionsResponseTyped, CoreDto } from '../base.state-request';
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

	countDisabled: number = 0;
	countFalses: number = 0;

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

		const actionsResponseTyped: ActionsResponseTyped<DtoArea> = {
			disabled: () => {
				this.countDisabled++;
			},
			next: (value: DtoArea) => {

				console.log("findById -> next:");
				console.log(value);

				if (value)
					this.untypedFormGroup.setValue({
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

		this.countDisabled = 0;
		this.countFalses = 0;

		for (let i = 0; i < 11; i++) // Reuses the SAME actionsResponseTyped to use the SAME Machine State.
			if (!this.areaService.findById(this.idArea, actionsResponseTyped))
				this.countFalses++;

		console.log("this.countDisabled = " + this.countDisabled);
		console.log("this.countFalses = " + this.countFalses);
	}

	doSubmit(dtoAndMachineState: CoreDto): void;
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
		console.log('1) CoreDto <= Machine State');

		const dtoAndMachineState: CoreDto = this.copyAllEnumerable1({}, this.untypedFormGroup.getRawValue())
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

	submitTest3_1() {

		console.log('3_1) CoreDto <= CoreDto');

		const dtoAndMachineState1: CoreDto = this.copyAllEnumerable1({}, this.untypedFormGroup.getRawValue());
		this.areaService.setStateRequestTarget(dtoAndMachineState1, this.untypedFormGroup);
		this.doSubmit(dtoAndMachineState1); // Assert: 1 Submit(s), 1 Request(s)
		console.log(dtoAndMachineState1);

		// Live Update
		const dtoAndMachineState2: CoreDto = this.copyAllEnumerable1({}, this.untypedFormGroup.getRawValue());
		this.areaService.shareStateRequest(dtoAndMachineState2, dtoAndMachineState1);
		this.doSubmit(dtoAndMachineState2); // Assert: 2 Submit(s), 1 Request(s)
		console.log(dtoAndMachineState2);
	}

	submitTest3_2() {

		console.log('3_2) CoreDto <= UntypedFormGroup');

		this.doSubmit(this.untypedFormGroup); // Assert: 1 Submit(s), 1 Request(s)

		// Live Update		
		const dtoAndMachineState1: CoreDto = this.copyAllEnumerable1({}, this.untypedFormGroup.getRawValue());
		this.areaService.shareStateRequest(dtoAndMachineState1, this.untypedFormGroup);
		this.doSubmit(dtoAndMachineState1); // Assert: 2 Submit(s), 1 Request(s)
		console.log(dtoAndMachineState1);
	}

	submitTest3_3() {

		console.log('3_3) UntypedFormGroup <= UntypedFormGroup');

		// Live Update

	}

	submitTest3_4() {

		console.log('3_4) UntypedFormGroup <= CoreDto');

		const dtoAndMachineState1: CoreDto = this.copyAllEnumerable1({}, this.untypedFormGroup.getRawValue());
		this.doSubmit(dtoAndMachineState1);

		// Live Update
		this.areaService.shareStateRequest(this.untypedFormGroup, dtoAndMachineState1);
		this.doSubmit(dtoAndMachineState1); // Assert: 2 Submit(s), 1 Request(s)
		// this.areaService.deleteStateRequest(this.untypedFormGroup);
		console.log(this.untypedFormGroup.getRawValue());
	}

	submit() {
		// !) Do not run more than one test per build, as they are copying the state of the same form.

		this.countDisabled = 0;
		this.countFalses = 0;

		this.areaService.setDefaultOnOffTeardown(true);

		// this.submitTest1();
		// this.submitTest2();
		this.submitTest3_1();
		// this.submitTest3_2();
		// this.submitTest3_3();
		// this.submitTest3_4();

		console.log("this.countDisabled = " + this.countDisabled);
		console.log("this.countFalses = " + this.countFalses);
	}
}
