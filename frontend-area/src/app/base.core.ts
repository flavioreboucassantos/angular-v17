import { FormGroup } from "@angular/forms";

export interface CoreDto {
	[key: string]: any
};

export interface ActionsResponse {
	next: (value: any) => void,
	error: (error: any) => void,
	complete: () => void
}

export interface ActionsResponseTyped<T> {
	next: (value: T) => void,
	error: (error: any) => void,
	complete: () => void
}

export interface MetadataRequest<T> {
	readonly origin: any, // State Machine and DTO Origin
	readonly dto: T,
	teardown: (() => void)
}

/**
 * @author Flávio Rebouças Santos
 * @link flavioReboucasSantos@gmail.com
 */
export abstract class BaseCore {

	private readonly KEY_OF_STATE_DISABLED: string = '{__SD__}';

	private onOffTeardown: boolean = true;

	private operateWithKeyStringAny<T extends CoreDto>(originKeyStringAny: CoreDto): MetadataRequest<T> | null {
		if (originKeyStringAny[this.KEY_OF_STATE_DISABLED] === true)
			return null;
		else {
			originKeyStringAny[this.KEY_OF_STATE_DISABLED] = true;
			const newDto: T = Object.assign({}, originKeyStringAny) as T;
			delete newDto[this.KEY_OF_STATE_DISABLED];
			return {
				origin: origin,
				dto: newDto,
				teardown: () => { if (this.onOffTeardown) originKeyStringAny[this.KEY_OF_STATE_DISABLED] = false }
			};
		}
	}

	private operateWithFormGroup<T extends CoreDto>(originFormGroup: FormGroup): MetadataRequest<T> | null {		
		if (originFormGroup.disabled)
			return null;
		else {
			originFormGroup.disable();
			return {
				origin: origin,
				dto: Object.assign({}, originFormGroup.value),
				teardown: () => { if (this.onOffTeardown) originFormGroup.enable() }
			};
		}
	}

	/**
	 * For param Object {[key: string]: any}
	 * 
	 * 		if KEY_OF_STATE_DISABLED == true then is Locked.
	 * 			- Writes in the Object to ensure the existence of the state value.
	 * @param origin 
	 * @returns Consider MetadataRequest a waste after first use.
	 */
	protected tryMetadataRequest<T extends CoreDto>(origin: any): MetadataRequest<T> | null {
		switch (origin.constructor) {
			case Object:
				return this.operateWithKeyStringAny(origin);

			case FormGroup:
				return this.operateWithFormGroup(origin);
		}
		return null;
	}

	/**
	 * While the Teardown operation is responsible for enabling the origin, this method is responsible for defining whether Teardown should occur.
	 * @param onOffTeardown true is On, false is Off. true is Default.
	 */
	public setOnOffTeardown(onOffTeardown: boolean) {
		this.onOffTeardown = onOffTeardown;
	}

	public assignState(originTarget: CoreDto, originSource: CoreDto): CoreDto;
	public assignState(originTarget: CoreDto, originSource: FormGroup): CoreDto;
	public assignState(originTarget: FormGroup, originSource: FormGroup): FormGroup;
	public assignState(originTarget: FormGroup, originSource: CoreDto): FormGroup;
	public assignState(originTarget: any, originSource: any): any {
		let sourceState: boolean = true;

		switch (originSource.constructor) {
			case Object:
				sourceState = (originSource as CoreDto)[this.KEY_OF_STATE_DISABLED];
				break;

			case FormGroup:
				sourceState = (originSource as FormGroup).disabled;
				break;
		}

		switch (originTarget.constructor) {
			case Object:
				(originTarget as CoreDto)[this.KEY_OF_STATE_DISABLED] = sourceState;
				break;

			case FormGroup:
				(sourceState) ? (originTarget as FormGroup).disable() : (originTarget as FormGroup).enable();
				break;
		}

		return originTarget;
	}
}