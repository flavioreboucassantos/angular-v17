import { PlatformLocation } from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { inject } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { BaseStateRequest, KeyStringAny, OutSourceMachineState, Teardown } from "./base.state-request";

/**
 * Using ActionsResponse:
 * 
 * There are basically three method of Observable conceptually as below:
 * 
 * 		next(): this method define that how to process data which is sent by observable.
 * 		error(): this method define that how to manage error handling activities.
 * 		complete(): this method define course of action need to perform after the observable has completed producing and emitting data.
 * 
 * 		next() method cannot be executed after the observable has errored or completed.
 * 		next(), error() or complete() method cannot be called after unsubscribe.
 * 		Unsubscribe is called on error or complete to free the resources used by the subscription and the observable.
 * 
 * 	Example:
 * 		some$.subscribe({  
 *				next: x => console.log('The next value is: ', x),  
 *				error: err => console.error('An error occurred :', err),  
 *				complete: () => console.log('There are no more action happen.')  
 *			});
 * 
 * 	So, next() get the latest value from the stream of Observable.
 */
export interface ActionsResponse {
	disabled: () => void,
	next: (value: any) => void,
	error: (error: any) => void,
	complete: () => void
}

/**
 * @see {@link ActionsResponse}
 */
export interface ActionsResponseTyped<T> {
	disabled: () => void,
	next: (value: T) => void,
	error: (error: any) => void,
	complete: () => void
}

/**
* @author Flávio Rebouças Santos
* @link flavioReboucasSantos@gmail.com
*/
export abstract class BaseService extends BaseStateRequest {

	private readonly platformLocation: PlatformLocation = inject(PlatformLocation);

	/*
		MONTAR BASE URL REST API: A Navegação de @angular/router/Routes não deve ser usada como path para REST.
	*/

	private readonly nameService = '/area';
	private readonly pathApi = '/api/';

	private readonly plataformOrigin = this.platformLocation.protocol + '//' + this.platformLocation.hostname + ':' + this.platformLocation.port
	private readonly settedOrigin = 'http://localhost:8080';

	private readonly baseUrlRestApi: string = this.plataformOrigin + this.nameService + this.pathApi;
	private readonly baseUrlRestApiSettedOrigin: string = this.settedOrigin + this.nameService + this.pathApi;

	private readonly httpClient: HttpClient = inject(HttpClient);

	// ################################################################
	// extends
	// ################################################################

	protected getRestApi(): string {
		return this.baseUrlRestApi
	}

	protected getRestApiPathParam(pathParam: number): string {
		return this.baseUrlRestApi + pathParam;
	}

	/**
	 * T means Body Type for Responding.
	 * 
	 * There is no Body Type for Requesting.
	 * 
	 * - The GET request must use the Angular Cache before reaching this step;
	 * performing teardown synchronously, without request waiting time;
	 * in the same call in which this method is requested.
	 * @param outSourceMachineState This method changes or generates a property at the outSourceMachineState, to restrict that only one request is performed simultaneously, until this execution is teardown.
	 * @param actionsResponseTyped 
	 * @returns true If progressed with the request. false If the request was restricted.
	 */
	protected getT<T>(outSourceMachineState: OutSourceMachineState, actionsResponseTyped: ActionsResponseTyped<T>): boolean {
		const teardown: Teardown | null = this.tryRequest(outSourceMachineState);
		if (teardown === null) {
			actionsResponseTyped.disabled();
			return false;
		} else {
			const observableOfResponseBodyInRequestedType: Observable<T> = this.httpClient.get<T>(outSourceMachineState.url, { observe: 'body', responseType: 'json' });
			observableOfResponseBodyInRequestedType.subscribe(actionsResponseTyped).add(teardown);
			return true;
		}
	}

	/**
	 * TT means Same Body Type for Requesting and Responding.
	 * @param url 
	 * @param origin This method changes or generates a property at the origin, to restrict that only one request is performed simultaneously, until this execution is teardown.
	 * @param actionsResponseTyped 
	 * @returns true If progressed with the request. false If the request was restricted.
	 */
	protected postTT<T extends KeyStringAny>(url: string, origin: any, actionsResponseTyped: ActionsResponseTyped<T>): boolean {
		const teardown: Teardown | null = this.tryRequest(origin);
		if (teardown === null) {
			actionsResponseTyped.disabled();
			return false;
		} else {
			const newDto: T = this.generateDto(origin);
			const observableOfResponseBodyInRequestedType: Observable<T> = this.httpClient.post<T>(url, newDto, { observe: 'body', responseType: 'json' });
			observableOfResponseBodyInRequestedType.subscribe(actionsResponseTyped).add(teardown);
			return true;
		}
	}


	/**	
	 * TT means Same Body Type for Requesting and Responding.
	 * @param url 
	 * @param origin This method changes or generates a property at the origin, to restrict that only one request is performed simultaneously, until this execution is teardown.
	 * @param actionsResponseTyped 
	 * @returns true If progressed with the request. false If the request was restricted.
	 */
	protected putTT<T extends KeyStringAny>(url: string, origin: any, actionsResponseTyped: ActionsResponseTyped<T>): boolean {
		const teardown: Teardown | null = this.tryRequest(origin);
		if (teardown === null) {
			actionsResponseTyped.disabled();
			return false;
		} else {
			const newDto: T = this.generateDto(origin);
			const observableOfResponseBodyInRequestedType: Observable<T> = this.httpClient.put<T>(url, newDto, { observe: 'body', responseType: 'json' });
			observableOfResponseBodyInRequestedType.subscribe(actionsResponseTyped).add(teardown);
			return true;
		}
	}	

	/**
	 * There is no Body Type for Requesting or Responding.
	 * @param outSourceMachineState This method changes or generates a property at the outSourceMachineState, to restrict that only one request is performed simultaneously, until this execution is teardown.
	 * @param actionsResponse 
	 * @returns true If progressed with the request. false If the request was restricted.
	 */
	protected delete(outSourceMachineState: OutSourceMachineState, actionsResponse: ActionsResponse): boolean {
		const teardown: Teardown | null = this.tryRequest(outSourceMachineState);
		if (teardown === null) {
			actionsResponse.disabled();
			return false;
		} else {
			const observableStringOfResponseBodyInString: Observable<string> = this.httpClient.delete(outSourceMachineState.url, { observe: 'body', responseType: 'text' });
			observableStringOfResponseBodyInString.subscribe(actionsResponse).add(teardown);
			return true;
		}
	}

	constructor() {
		super();
		// console.log(location);
		// console.log(this.platformLocation);
		// console.log(this.baseUrlRestApiSettedOrigin);		
	}

}