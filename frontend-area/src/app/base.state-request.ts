import { FormControl, UntypedFormGroup } from "@angular/forms";

export interface OutSourceMachineState {
	url: string,
	[key: string]: any
}

export interface KeyStringAny {
	[key: string]: any
};

export type StateRequestTarget = UntypedFormGroup;

interface StateRequest {
	disabled: boolean,
	onOffTeardown: boolean,
	target?: Map<StateRequestTarget, null>;
}

export type Teardown = (() => void);

/**
 * @author Flávio Rebouças Santos
 * @link flavioReboucasSantos@gmail.com
 */
export abstract class BaseStateRequest {

	private readonly KEY_OF_STATE_REQUEST: string = '{__SR__}';

	private defaultOnOffTeardown: boolean = true;

	private newMapStateRequestTarget(): Map<StateRequestTarget, null> {
		return new Map<StateRequestTarget, null>();
	}

	// ################################################################
	// prepareAndGetStateRequestFor...
	// ################################################################

	private prepareAndGetStateRequestForKeyStringAny(originKeyStringAny: KeyStringAny): StateRequest {
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
				target: this.newMapStateRequestTarget()
			};

			originUntypedFormGroup.addControl(this.KEY_OF_STATE_REQUEST, new FormControl(stateRequest));

			return stateRequest;
		} else
			return originUntypedFormGroup.getRawValue()[this.KEY_OF_STATE_REQUEST];
	}

	// ################################################################
	// appendTargetAtStateRequest... (BY TRY REQUEST FOR AND PUBLIC)
	// ################################################################

	private promiseFirstTeardown(stateRequest: StateRequest, target: StateRequestTarget) {
		// !!! Impedir que this.enableStateRequest inicie: Durante a leitura de stateRequest.disabled && Durante this.doDisableStateRequest
		// !!! Para prevenir que o alvo permaneça disabled depois de this.enableStateRequest	
		if (stateRequest.onOffTeardown && stateRequest.disabled)
			this.doDisableStateRequestTarget(target);
	}

	private appendTargetAtStateRequest(stateRequest: StateRequest, target: StateRequestTarget): StateRequest {
		if (stateRequest.target === undefined)
			stateRequest.target = this.newMapStateRequestTarget();
		stateRequest.target.set(target, null);
		this.promiseFirstTeardown(stateRequest, target);
		return stateRequest;
	}

	// ################################################################
	// disableStateRequest, enableStateRequest (BY TRY REQUEST FOR)
	// ################################################################

	private iterateOverStateRequestTargetMap(stateRequest: StateRequest, callbackfn: ((value: null, key: StateRequestTarget) => void)) {
		if (stateRequest.onOffTeardown) {
			const target = stateRequest.target;
			if (target !== undefined)
				target.forEach(callbackfn);
		}
	}

	private doDisableStateRequestTarget(stateRequestTarget: StateRequestTarget) {
		switch (stateRequestTarget.constructor) {
			case UntypedFormGroup:
				(stateRequestTarget as UntypedFormGroup).disable();
				break;
		}
	}

	private disableStateRequest(stateRequest: StateRequest) {
		stateRequest.disabled = true;		
		this.iterateOverStateRequestTargetMap(stateRequest, (value, stateRequestTarget) => this.doDisableStateRequestTarget(stateRequestTarget));
	}

	private enableStateRequest(stateRequest: StateRequest) {
		stateRequest.disabled = false;
		this.iterateOverStateRequestTargetMap(stateRequest, (value, stateRequestTarget) => {
			switch (stateRequestTarget.constructor) {
				case UntypedFormGroup:
					(stateRequestTarget as UntypedFormGroup).enable();
					break;
			}
		});
	}

	// ################################################################
	// tryRequestFor... (BY TRY REQUEST)
	// ################################################################

	private tryRequestForKeyStringAny(originKeyStringAny: KeyStringAny): Teardown | null {
		const stateRequest: StateRequest = this.prepareAndGetStateRequestForKeyStringAny(originKeyStringAny);		
		if (stateRequest.disabled === false) {
			// this.appendTargetAtStateRequest(stateRequest, originKeyStringAny);

			this.disableStateRequest(stateRequest);
			return () => this.enableStateRequest(stateRequest);

		} else
			return null;
	}

	private tryRequestForUntypedFormGroup(originUntypedFormGroup: UntypedFormGroup): Teardown | null {
		const stateRequest: StateRequest = this.prepareAndGetStateRequestForUntypedFormGroup(originUntypedFormGroup);
		if (stateRequest.disabled === false) {
			this.appendTargetAtStateRequest(stateRequest, originUntypedFormGroup);

			this.disableStateRequest(stateRequest);
			return () => this.enableStateRequest(stateRequest);

		} else
			return null;
	}

	/**
	 * @param stateRequest 
	 * @param target 
	 * @returns true if an element in the Map existed and has been removed, or false if the element does not exist.
	 */
	private unappendTargetAtStateRequest(stateRequest: StateRequest, target: StateRequestTarget): boolean {
		const stateRequestTarget = stateRequest.target;
		if (stateRequestTarget !== undefined)
			return stateRequestTarget.delete(target);
		else
			return false;
	}

	// ################################################################
	// setStateRequestFor... (BY SHARE AND APPEND TARGET STATE REQUEST)
	// ################################################################

	private setStateRequestForKeyStringAny(originKeyStringAny: KeyStringAny, stateRequest: StateRequest): StateRequest {
		originKeyStringAny[this.KEY_OF_STATE_REQUEST] = stateRequest;
		return stateRequest;
	}

	private setStateRequestForUntypedFormGroup(originUntypedFormGroup: UntypedFormGroup, stateRequest: StateRequest): StateRequest {
		if (originUntypedFormGroup.getRawValue()[this.KEY_OF_STATE_REQUEST] === undefined) // prepare with addControl
			originUntypedFormGroup.addControl(this.KEY_OF_STATE_REQUEST, new FormControl(null));
		originUntypedFormGroup.setValue({ ...originUntypedFormGroup.getRawValue(), [this.KEY_OF_STATE_REQUEST]: stateRequest });
		return stateRequest;
	}

	// ################################################################
	// getAndDeleteStateRequestFor... (BY PUBLIC)
	// ################################################################

	private getAndDeleteStateRequestForKeyStringAny(originKeyStringAny: KeyStringAny): StateRequest {
		const stateRequest: StateRequest = originKeyStringAny[this.KEY_OF_STATE_REQUEST];
		delete originKeyStringAny[this.KEY_OF_STATE_REQUEST];
		return stateRequest;
	}

	private getAndDeleteStateRequestForUntypedFormGroup(originUntypedFormGroup: UntypedFormGroup): StateRequest {
		const stateRequest: StateRequest = originUntypedFormGroup.getRawValue()[this.KEY_OF_STATE_REQUEST]
		originUntypedFormGroup.removeControl(this.KEY_OF_STATE_REQUEST);
		return stateRequest;
	}

	// ################################################################
	// getStateRequest (BY PUBLIC)
	// ################################################################

	private getStateRequest(origin: any): StateRequest {
		switch (origin.constructor) {
			case Object:
				return this.prepareAndGetStateRequestForKeyStringAny(origin);

			case UntypedFormGroup:
				return this.prepareAndGetStateRequestForUntypedFormGroup(origin);

			default:
				return { disabled: false, onOffTeardown: false };
		}
	}

	// ################################################################
	// protected (EXTENDS)
	// ################################################################

	/**	 
	 * @param origin Writes or manipulate origin to ensure the existence of the state value.
	 * @returns Teardown if the request was accepted, null if did not accept the request.
	 */
	protected tryRequest(origin: any): Teardown | null {
		switch (origin.constructor) {
			case Object:
				return this.tryRequestForKeyStringAny(origin);

			case UntypedFormGroup:
				return this.tryRequestForUntypedFormGroup(origin);
		}
		return null;
	}

	protected generateDto<T extends KeyStringAny>(origin: any): T {
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
	// public (PUBLIC)
	// ################################################################

	/**
	 * While the Teardown operation is responsible for enabling and disabling the target, this method is responsible for defining the default on each request whether Teardown should occur.
	 * @param defaultOnOffTeardown true is On, false is Off. true is Default.
	 */
	public setDefaultOnOffTeardown(defaultOnOffTeardown: boolean) {
		this.defaultOnOffTeardown = defaultOnOffTeardown;
	}

	/**
	 * While the Teardown operation is responsible for enabling and disabling the target,
	 * this method is responsible for defining whether Teardown should occur in the current origin state.
	 * @param origin The Target.
	 * @param onOffTeardown true is On, false is Off. Use setDefaultOnOffTeardown to define Default.
	 */
	public setOnOffTeardown(origin: any, onOffTeardown: boolean) {
		this.getStateRequest(origin).onOffTeardown = onOffTeardown;
	}

	/**
	 * Causes there to be a Machine State in the originTarget that is the same object as the source.
	 * 
	 * The value of onOffTeardown and all appends targets will also be shared.
	 * @param originTarget Appends originTarget to the shared StateRequest.
	 * @param originSource 
	 */
	public shareAndAppendTargetStateRequest(originTarget: KeyStringAny, originSource: KeyStringAny): KeyStringAny;
	public shareAndAppendTargetStateRequest(originTarget: KeyStringAny, originSource: UntypedFormGroup): KeyStringAny;
	public shareAndAppendTargetStateRequest(originTarget: UntypedFormGroup, originSource: UntypedFormGroup): UntypedFormGroup;
	public shareAndAppendTargetStateRequest(originTarget: UntypedFormGroup, originSource: KeyStringAny): UntypedFormGroup;
	public shareAndAppendTargetStateRequest(originTarget: any, originSource: any): any {
		switch (originTarget.constructor) {
			case Object:
				this.setStateRequestForKeyStringAny(originTarget, this.getStateRequest(originSource));
				break;

			case UntypedFormGroup:
				const stateRequest: StateRequest = this.setStateRequestForUntypedFormGroup(originTarget, this.getStateRequest(originSource));
				this.appendTargetAtStateRequest(stateRequest, originTarget);
				break;
		}
		return originTarget;
	}

	/**
	 * Makes the target 'outside' of origin a target for enabling and disabling by Teardown.
	 * @param origin 
	 * @param target 
	 */
	public appendStateRequestTarget(origin: any, target: StateRequestTarget) {
		this.appendTargetAtStateRequest(this.getStateRequest(origin), target);
	}

	/**
	 * Removes origin from target from your own StateRequest.
	 * @param origin 
	 * @returns true if an element in the Map existed and has been removed, or false if the element does not exist.
	 */
	public unappendStateRequestTarget(origin: any): boolean {
		return this.unappendTargetAtStateRequest(this.getStateRequest(origin), origin);
	}

	/**
	 * Frees origin from loading Machine State data.
	 * @param origin Unappend origin to target of StateRequest.
	 * @returns true if an element in the Map existed and has been removed, or false if the element does not exist.
	 */
	public deleteAndUnappendStateRequest(origin: any): boolean {
		switch (origin.constructor) {
			case Object:
				return this.unappendTargetAtStateRequest(this.getAndDeleteStateRequestForKeyStringAny(origin), origin);

			case UntypedFormGroup:
				return this.unappendTargetAtStateRequest(this.getAndDeleteStateRequestForUntypedFormGroup(origin), origin);
		}
		return false;
	}
}