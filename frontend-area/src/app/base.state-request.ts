import { FormControl, UntypedFormGroup } from "@angular/forms";

export interface CoreDto {
	[key: string]: any
};

export interface ActionsResponse {
	disabled: () => void,
	next: (value: any) => void,
	error: (error: any) => void,
	complete: () => void
}

export interface ActionsResponseTyped<T> {
	disabled: () => void,
	next: (value: T) => void,
	error: (error: any) => void,
	complete: () => void
}

export type Teardown = (() => void);

interface StateRequest {
	disabled: boolean,
	onOffTeardown: boolean,
	target?: UntypedFormGroup
}

/**
 * @author Flávio Rebouças Santos
 * @link flavioReboucasSantos@gmail.com
 */
export abstract class BaseStateRequest {

	private readonly KEY_OF_STATE_REQUEST: string = '{__SR__}';

	private defaultOnOffTeardown: boolean = true;

	// ################################################################
	// delete...
	// ################################################################

	private deleteForKeyStringAny(originKeyStringAny: CoreDto) {
		delete originKeyStringAny[this.KEY_OF_STATE_REQUEST];
	}

	private deleteForUntypedFormGroup(originUntypedFormGroup: UntypedFormGroup) {
		originUntypedFormGroup.removeControl(this.KEY_OF_STATE_REQUEST);
	}

	// ################################################################
	// prepareAndGet...
	// ################################################################

	private prepareAndGetStateRequestForKeyStringAny(originKeyStringAny: CoreDto): StateRequest {
		if (originKeyStringAny[this.KEY_OF_STATE_REQUEST] === undefined) {
			const stateRequest: StateRequest = {
				disabled: false,
				onOffTeardown: this.defaultOnOffTeardown
			};

			originKeyStringAny[this.KEY_OF_STATE_REQUEST] = stateRequest;

			return stateRequest;
		} else
			return originKeyStringAny[this.KEY_OF_STATE_REQUEST];
	}

	private prepareAndGetStateRequestForUntypedFormGroup(originUntypedFormGroup: UntypedFormGroup): StateRequest {
		if (originUntypedFormGroup.getRawValue()[this.KEY_OF_STATE_REQUEST] === undefined) {
			const stateRequest: StateRequest = {
				disabled: false,
				onOffTeardown: this.defaultOnOffTeardown,
				target: originUntypedFormGroup
			};

			originUntypedFormGroup.addControl(this.KEY_OF_STATE_REQUEST, new FormControl(stateRequest));

			return stateRequest;
		} else
			return originUntypedFormGroup.getRawValue()[this.KEY_OF_STATE_REQUEST];
	}

	// ################################################################
	// disable, enable
	// ################################################################

	private disableStateRequest(stateRequest: StateRequest) {
		stateRequest.disabled = true;
		if (stateRequest.onOffTeardown) {
			const target = stateRequest.target;
			if (target !== undefined) {
				switch (target.constructor) {
					case UntypedFormGroup:
						(target as UntypedFormGroup).disable();
						break;
				}
			}
		}
	}

	private enableStateRequest(stateRequest: StateRequest) {
		stateRequest.disabled = false;
		if (stateRequest.onOffTeardown) {
			const target = stateRequest.target;
			if (target !== undefined) {
				switch (target.constructor) {
					case UntypedFormGroup:
						(target as UntypedFormGroup).enable();
						break;
				}
			}
		}
	}

	// ################################################################
	// operateWith...
	// ################################################################

	private operateWithKeyStringAny(originKeyStringAny: CoreDto): Teardown | null {
		const stateRequest: StateRequest = this.prepareAndGetStateRequestForKeyStringAny(originKeyStringAny);
		if (stateRequest.disabled === false) {

			this.disableStateRequest(stateRequest);
			return () => this.enableStateRequest(stateRequest);

		} else
			return null;
	}

	private operateWithUntypedFormGroup(originUntypedFormGroup: UntypedFormGroup): Teardown | null {
		const stateRequest: StateRequest = this.prepareAndGetStateRequestForUntypedFormGroup(originUntypedFormGroup);		
		if (stateRequest.disabled === false) {

			this.disableStateRequest(stateRequest);
			return () => this.enableStateRequest(stateRequest);

		} else
			return null;
	}

	// ################################################################
	// extends (protected)
	// ################################################################

	/**
	 * For param Object {[key: string]: any}
	 * 
	 * 		if KEY_OF_STATE_REQUEST == true then is Locked.
	 * 			- Writes in the Object to ensure the existence of the state value.
	 * @param origin 
	 * @returns Consider MetadataRequest a waste after first use.
	 */
	protected tryRequest(origin: any): Teardown | null {
		switch (origin.constructor) {
			case Object:
				return this.operateWithKeyStringAny(origin);

			case UntypedFormGroup:
				return this.operateWithUntypedFormGroup(origin);
		}
		return null;
	}

	protected generateDto<T extends CoreDto>(origin: any): T {
		let newDto: T;
		switch (origin.constructor) {
			case Object:
				newDto = Object.assign({}, origin) as T;
				break;

			case UntypedFormGroup:
				newDto = Object.assign({}, origin.getRawValue()) as T;
				break;

			default:
				newDto = {} as T;
				break;
		}
		delete newDto[this.KEY_OF_STATE_REQUEST];
		return newDto;
	}

	// ################################################################
	// public
	// ################################################################

	/**
	 * While the Teardown operation is responsible for enabling the origin, this method is responsible for defining the default on each request whether Teardown should occur.
	 * @param defaultOnOffTeardown true is On, false is Off. true is Default.
	 */
	public setDefaultOnOffTeardown(defaultOnOffTeardown: boolean) {
		this.defaultOnOffTeardown = defaultOnOffTeardown;
	}

	/**
	 * While the Teardown operation is responsible for enabling the origin, this method is responsible for defining whether Teardown should occur in the current origin state.
	 * @param origin 
	 * @param onOffTeardown true is On, false is Off. Use setDefaultOnOffTeardown to define Default.
	 */
	public setOnOffTeardown(origin: any, onOffTeardown: boolean) {
		switch (origin.constructor) {
			case Object:
				this.prepareAndGetStateRequestForKeyStringAny(origin).onOffTeardown = onOffTeardown;
				break;

			case UntypedFormGroup:
				this.prepareAndGetStateRequestForUntypedFormGroup(origin).onOffTeardown = onOffTeardown;
				break;
		}
	}

	/**
	 * Causes there to be a Machine State in the target that is the same object as the source.
	 * 
	 * The value of onOffTeardown will be the same as well.
	 * @param originTarget 
	 * @param originSource 
	 */
	public shareStateRequest(originTarget: CoreDto, originSource: CoreDto): CoreDto;
	public shareStateRequest(originTarget: CoreDto, originSource: UntypedFormGroup): CoreDto;
	public shareStateRequest(originTarget: UntypedFormGroup, originSource: UntypedFormGroup): UntypedFormGroup;
	public shareStateRequest(originTarget: UntypedFormGroup, originSource: CoreDto): UntypedFormGroup;
	public shareStateRequest(originTarget: any, originSource: any): any {
		let sourceStateRequest = null;

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
				sourceStateRequest.target = originTarget; // Update for.
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
	public setStateRequestTarget(originCoreDto: CoreDto, targetFor: UntypedFormGroup): CoreDto;
	public setStateRequestTarget(origin: any, stateRequestTarget: any): any {
		switch (origin.constructor) {
			case Object:
				this.prepareAndGetStateRequestForKeyStringAny(origin).target = stateRequestTarget;
				break;
		}
	}

	/**
	 * Frees origin from loading Machine State data.
	 * @param origin 
	 */
	public deleteStateRequest(origin: any) {
		switch (origin.constructor) {
			case Object:
				this.deleteForKeyStringAny(origin);
				break;

			case UntypedFormGroup:
				this.deleteForUntypedFormGroup(origin);
				break;
		}
	}
}