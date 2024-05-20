import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterContentInit, Component, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AreaService } from '../area.service';
import { ActionsResponseTyped, MetadataRequest } from '../base.core';
import { BaseViewComponent, ViewExpected } from '../base.view-component';
import { ModalActionsResponseComponent } from '../modal-actions-response/modal-actions-response.component';

export interface DtoArea {
	idArea: number;
	rawData: string;
	uniqueData: string;
	highlighted: boolean;
}

/**
 * @author Flávio Rebouças Santos - flavioReboucasSantos@gmail.com
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

	readonly formArea = new FormGroup({
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
					this.formArea.setValue({
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

	doSubmit() {
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

		const metadataRequest: MetadataRequest<DtoArea> = this.tryMetadataRequest(this.formArea);

		switch (this.viewExpected) {
			case ViewExpected.create:
				actionsResponse.complete = () => this.modalActionsResponse?.open(
					'Sucesso!',
					'Área Criada com Sucesso.',
					() => this.reloadWithPath(idAreaCreated)
				);
				this.areaService.create(metadataRequest, actionsResponse);
				break;

			case ViewExpected.updateById:
				actionsResponse.complete = () => this.modalActionsResponse?.open('Sucesso!', 'Área Atualizada.');
				this.areaService.update(this.idArea, metadataRequest, actionsResponse);
				break;
		}
	}

	doTestTypeVariation(machineStateKeyStringAny: { [key: string]: any }) {
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

		const metadataRequest: MetadataRequest<DtoArea> = this.tryMetadataRequest(machineStateKeyStringAny);

		// console.log(metadataRequest);

		switch (this.viewExpected) {
			case ViewExpected.create:
				actionsResponse.complete = () => this.modalActionsResponse?.open(
					'Sucesso!',
					'Área Criada com Sucesso.',
					() => this.reloadWithPath(idAreaCreated)
				);
				this.areaService.create(metadataRequest, actionsResponse);
				break;

			case ViewExpected.updateById:
				actionsResponse.complete = () => this.modalActionsResponse?.open('Sucesso!', 'Área Atualizada.');
				this.areaService.update(this.idArea, metadataRequest, actionsResponse);
				break;
		}

		// console.log(metadataRequest);
	}

	submit() {
		// Teste em Machine State -> Object { [key: string]: any }
		const machineStateKeyStringAny: { [key: string]: any } = { ...this.formArea.value };
		for (let i = 0; i < 10; i++) // Testes de sincronia singlethread.
			this.doTestTypeVariation(machineStateKeyStringAny);

		// // Teste em Machine State -> FormGroup
		// for (let i = 0; i < 10; i++) // Testes de sincronia singlethread.
		// 	this.doSubmit();
	}
}
