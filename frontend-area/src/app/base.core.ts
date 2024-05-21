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

	readonly KEY_OF_STATE_DISABLED: string = '{__SD__}';

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
				teardown: () => originKeyStringAny[this.KEY_OF_STATE_DISABLED] = false
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
				teardown: () => originFormGroup.enable()
			};
		}
	}

	/**
	 * @param origin 
	 * 
	 * For param Object {[key: string]: any}
	 * 	 
	 * 
	 * 		if KEY_OF_STATE_DISABLED == true then is Locked.
	 * 			- Writes in the Object to ensure the existence of the state value.
	 *  
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
}