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

type TeardownLogic = (<T extends CoreDto>(metadataRequest: MetadataRequest<T>) => void);
export interface MetadataRequest<T> {
	readonly origin: any, // Start of line
	acceptable: boolean, // End of Line
	readonly dto: T,
	teardown: (() => TeardownLogic)
}

/**
 * @author Flávio Rebouças Santos
 * @link flavioReboucasSantos@gmail.com
 */
export abstract class BaseCore {

	readonly KEY_OF_STATE_DISABLED: string = '{__SD__}';

	readonly teardownLogic: TeardownLogic = <T extends CoreDto>(metadataRequest: MetadataRequest<T>) => {
		this.unlockMetadataRequest(metadataRequest);
	};
	readonly teardown: (() => TeardownLogic) = (() => this.teardownLogic);

	private isLockedOrigin(originFormGroup: FormGroup): boolean;
	private isLockedOrigin(originKeyStringAny: CoreDto): boolean;
	private isLockedOrigin(origin: any): boolean {
		// Block to syncronize
		switch (origin.constructor) {
			case FormGroup:
				return (origin as FormGroup).disabled;

			case Object:
				return Object.keys(origin).length == 0 || origin[this.KEY_OF_STATE_DISABLED] == true;

			default:
				return true;
		}
	}

	private generateDto<T extends CoreDto>(originFormGroup: FormGroup): T;
	private generateDto<T extends CoreDto>(originKeyStringAny: CoreDto): T;
	private generateDto<T extends CoreDto>(origin: any): T {
		switch (origin.constructor) {
			case FormGroup:
				return Object.assign({}, origin.value) as T;

			case Object:
				return Object.assign({}, origin) as T;

			default:
				return {} as T;
		}
	}

	private disableOrigin(originFormGroup: FormGroup): void;
	private disableOrigin(originKeyStringAny: CoreDto): void;
	private disableOrigin(origin: any): void {
		switch (origin.constructor) {
			case FormGroup:
				(origin as FormGroup).disable();
				break;

			case Object:
				origin[this.KEY_OF_STATE_DISABLED] = true;
				break;
		}
	}

	private enableOrigin(originFormGroup: FormGroup): void;
	private enableOrigin(originKeyStringAny: CoreDto): void;
	private enableOrigin(origin: any): void {
		switch (origin.constructor) {
			case FormGroup:
				(origin as FormGroup).enable();
				break;

			case Object:
				origin[this.KEY_OF_STATE_DISABLED] = false;
				break;
		}
	}

	private lockMetadataRequest<T extends CoreDto>(metadataRequest: MetadataRequest<T>) {
		/*
		- Negative acceptable for end of line.
		- Turn origin OFF for line start.
		*/
		metadataRequest.acceptable = false;
		this.disableOrigin(metadataRequest.origin);
	}

	private unlockMetadataRequest<T extends CoreDto>(metadataRequest: MetadataRequest<T>) {
		this.enableOrigin(metadataRequest.origin);
	}

	private tryMetadataRequest<T extends CoreDto>(origin: any): MetadataRequest<T> | null {
		if (this.isLockedOrigin(origin))
			return null;
		else {
			const acceptable: boolean = true;
			const newDto: T = this.generateDto(origin);
			const newMetadataRequest: MetadataRequest<T> = {
				origin: origin,
				acceptable: acceptable,
				dto: newDto as T,
				teardown: this.teardown
			};
			return newMetadataRequest;
		}
	}
	
	/**
	 * @param origin 
	 * 
	 * For param Object {[key: string]: any}
	 * 
	 * 		if empty, is Locked.
	 * 			- Never clear the Machine State.
	 * 
	 * 		if KEY_OF_STATE_DISABLED == true, is Locked.
	 * 			- Writes in the Object to ensure the existence of the state value.
	 *  
	 * @returns Consider MetadataRequest a waste after first use.
	 */
	protected tryLock<T extends CoreDto>(origin: any): MetadataRequest<T> | null {
		const metadataRequest: MetadataRequest<T> | null = this.tryMetadataRequest(origin);
		if (metadataRequest !== null) {
			this.lockMetadataRequest(metadataRequest);
			return metadataRequest;
		} else
			return null;
	}

}