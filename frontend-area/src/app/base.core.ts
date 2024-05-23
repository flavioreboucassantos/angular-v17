import { FormControl, UntypedFormGroup } from "@angular/forms";

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

interface StateRequest {
	disabled: boolean,
	target?: UntypedFormGroup
}

/**
 * @author Flávio Rebouças Santos
 * @link flavioReboucasSantos@gmail.com
 */
export abstract class BaseCore {

	private readonly KEY_OF_STATE_REQUEST: string = '{__SR__}';

	private onOffTeardown: boolean = true;

	private prepareAndGetStateRequestForKeyStringAny(originKeyStringAny: CoreDto): StateRequest {
		if (originKeyStringAny[this.KEY_OF_STATE_REQUEST] === undefined) {
			const stateRequest: StateRequest = { disabled: false };
			originKeyStringAny[this.KEY_OF_STATE_REQUEST] = stateRequest;
			return stateRequest;
		} else
			return originKeyStringAny[this.KEY_OF_STATE_REQUEST];
	}

	private prepareAndGetStateRequestForUntypedFormGroup(originUntypedFormGroup: UntypedFormGroup): StateRequest {
		if (originUntypedFormGroup.getRawValue()[this.KEY_OF_STATE_REQUEST] === undefined) {
			const stateRequest: StateRequest = {
				disabled: false,
				target: originUntypedFormGroup
			};

			originUntypedFormGroup.addControl(this.KEY_OF_STATE_REQUEST, new FormControl(stateRequest));

			return stateRequest;
		} else
			return originUntypedFormGroup.getRawValue()[this.KEY_OF_STATE_REQUEST];
	}

	private disableStateRequest(stateRequest: StateRequest) {
		stateRequest.disabled = true;
		stateRequest.target?.disable();
	}

	private enableStateRequest(stateRequest: StateRequest) {
		stateRequest.disabled = false;
		const target = stateRequest.target;
		if (target !== undefined) {
			switch (target.constructor) {
				case UntypedFormGroup:
					(target as UntypedFormGroup).enable();
					break;
			}
		}
	}

	private operateWithKeyStringAny<T extends CoreDto>(originKeyStringAny: CoreDto): MetadataRequest<T> | null {
		if (originKeyStringAny[this.KEY_OF_STATE_REQUEST] === undefined || originKeyStringAny[this.KEY_OF_STATE_REQUEST].disabled === false) {
			const stateRequest: StateRequest = this.prepareAndGetStateRequestForKeyStringAny(originKeyStringAny);
			this.disableStateRequest(stateRequest);

			const newDto: T = Object.assign({}, originKeyStringAny) as T;
			delete newDto[this.KEY_OF_STATE_REQUEST];

			return {
				origin: origin,
				dto: newDto,
				teardown: () => { if (this.onOffTeardown) this.enableStateRequest(stateRequest); }
			};
		} else
			return null;
	}

	private operateWithUntypedFormGroup<T extends CoreDto>(originUntypedFormGroup: UntypedFormGroup): MetadataRequest<T> | null {
		if (originUntypedFormGroup.disabled) {
			this.prepareAndGetStateRequestForUntypedFormGroup(originUntypedFormGroup);
			return null;
		} else {
			const stateRequest: StateRequest = this.prepareAndGetStateRequestForUntypedFormGroup(originUntypedFormGroup);

			const newDto: T = Object.assign({}, originUntypedFormGroup.getRawValue()) as T;
			delete newDto[this.KEY_OF_STATE_REQUEST];

			this.disableStateRequest(stateRequest);

			return {
				origin: origin,
				dto: newDto,
				teardown: () => { if (this.onOffTeardown) this.enableStateRequest(stateRequest); }
			};
		}
	}

	/**
	 * For param Object {[key: string]: any}
	 * 
	 * 		if KEY_OF_STATE_REQUEST == true then is Locked.
	 * 			- Writes in the Object to ensure the existence of the state value.
	 * @param origin 
	 * @returns Consider MetadataRequest a waste after first use.
	 */
	protected tryMetadataRequest<T extends CoreDto>(origin: any): MetadataRequest<T> | null {
		switch (origin.constructor) {
			case Object:
				return this.operateWithKeyStringAny(origin);

			case UntypedFormGroup:
				return this.operateWithUntypedFormGroup(origin);
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

	public assignStateRequest(originTarget: CoreDto, originSource: CoreDto): CoreDto;
	public assignStateRequest(originTarget: CoreDto, originSource: UntypedFormGroup): CoreDto;
	public assignStateRequest(originTarget: UntypedFormGroup, originSource: UntypedFormGroup): UntypedFormGroup;
	public assignStateRequest(originTarget: UntypedFormGroup, originSource: CoreDto): UntypedFormGroup;
	public assignStateRequest(originTarget: any, originSource: any): any {
		let sourceStateRequest: StateRequest = { disabled: true };

		switch (originSource.constructor) {
			case Object:
				sourceStateRequest = (originSource as CoreDto)[this.KEY_OF_STATE_REQUEST];
				break;

			case UntypedFormGroup:
				sourceStateRequest = (originSource as UntypedFormGroup).getRawValue()[this.KEY_OF_STATE_REQUEST];
				break;
		}

		switch (originTarget.constructor) {
			case Object:
				(originTarget as CoreDto)[this.KEY_OF_STATE_REQUEST] = sourceStateRequest;
				break;

			case UntypedFormGroup:
				sourceStateRequest.target = originTarget; // Same
				this.prepareAndGetStateRequestForUntypedFormGroup(originTarget);
				(originTarget as UntypedFormGroup).setValue({ [this.KEY_OF_STATE_REQUEST]: sourceStateRequest, ...originTarget.getRawValue() });
				break;
		}

		return originTarget;
	}

	/**
	 * Makes the target outside of origin a target for enabling and disabling.
	 * @param origin 
	 * @param targetFor 
	 */
	public assignStateRequestTarget(originCoreDto: CoreDto, targetFor: UntypedFormGroup): CoreDto;
	public assignStateRequestTarget(origin: any, stateRequestTarget: any): any {
		switch (origin.constructor) {
			case Object:
				this.prepareAndGetStateRequestForKeyStringAny(origin).target = stateRequestTarget;
				break;
		}
	}
}