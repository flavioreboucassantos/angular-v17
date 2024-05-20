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
	readonly origin: any, // Start of line
	acceptable: boolean, // End of Line
	readonly dto: T
}

export abstract class BaseCore {

	readonly KEY_OF_STATE_DISABLED: string = '___SD___';

	private isLockedOrigin(originFormGroup: FormGroup): boolean;
	private isLockedOrigin(originKeyStringAny: CoreDto): boolean;
	private isLockedOrigin(origin: any): boolean {
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

	protected unlockMetadataRequest<T extends CoreDto>(metadataRequest: MetadataRequest<T>) {
		// metadataRequest.acceptable = true; // not necessary: metadataRequest is a waste now
		this.enableOrigin(metadataRequest.origin);
	}

	protected tryLockAndAppendUnlockOnComplete<T extends CoreDto>(metadataRequest: MetadataRequest<T>, actionsResponse: ActionsResponse): boolean {
		if (metadataRequest.acceptable) {
			this.lockMetadataRequest(metadataRequest);
			return true;
		} else
			return false;
	}

	/**
	 * For param Object {[key: string]: any}
	 * 
	 * 		if empty, is Locked.
	 * 			- Never clear the Machine State.
	 * 
	 * 		if KEY_OF_STATE_DISABLED == true, is Locked.
	 * 			- Writes in the Object to ensure the existence of the state value.
	 *  
	 * @returns Consider MetadataRequest a waste after going through the service.
	 */
	protected tryMetadataRequest<T extends CoreDto>(originFormGroup: FormGroup): MetadataRequest<T>;
	protected tryMetadataRequest<T extends CoreDto>(originKeyStringAny: CoreDto): MetadataRequest<T>;
	protected tryMetadataRequest<T extends CoreDto>(origin: any): MetadataRequest<T> {
		if (this.isLockedOrigin(origin)) {
			const acceptable: boolean = false;
			const newDto: CoreDto = {};
			const newMetadataRequest: MetadataRequest<T> = {
				origin: origin,
				acceptable: acceptable,
				dto: newDto as T
			};
			return newMetadataRequest;
		} else {
			const acceptable: boolean = true;
			const newDto: T = this.generateDto(origin);
			const newMetadataRequest: MetadataRequest<T> = {
				origin: origin,
				acceptable: acceptable,
				dto: newDto as T
			};
			return newMetadataRequest;
		}
	}
}