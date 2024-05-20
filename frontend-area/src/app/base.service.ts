import { PlatformLocation } from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { inject } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { ActionsResponse, ActionsResponseTyped, BaseCore, CoreDto, MetadataRequest } from "./base.core";

/**
 * @author Flávio Rebouças Santos - flavioReboucasSantos@gmail.com
 */

/**
 * 
 * Using ActionsResponse
 * 
 * 
	There are basically three method of Observable conceptually as below:

	next(): this method define that how to process data which is sent by observable

	error(): this method define that how to manage error handling activities.

	complete(): this method define course of action need to perform after the observable has completed producing and emitting data.

	next() method cannot be executed after the observable has errored or completed.

	next(), error() or complete() method cannot be called after unsubscribe.

	Unsubscribe is called on error or complete to free the resources used by the subscription and the observable.

	Example:
		some$.subscribe({  
			next: x => console.log('The next value is: ', x),  
			error: err => console.error('An error occurred :', err),  
			complete: () => console.log('There are no more action happen.')  
		});

	So, next get the latest value from the stream of Observable.
 * 
 */

export abstract class BaseService extends BaseCore {

	private readonly platformLocation: PlatformLocation = inject(PlatformLocation);

	/*
		MONTAR BASE URL REST API: A Navegação de Routes não deve ser usada como path para REST.
	*/

	private readonly nameService = '/area';
	private readonly pathApi = '/api/';

	private readonly plataformOrigin = this.platformLocation.protocol + '//' + this.platformLocation.hostname + ':' + this.platformLocation.port
	private readonly settedOrigin = 'http://localhost:8080';

	private readonly baseUrlRestApi: string = this.plataformOrigin + this.nameService + this.pathApi;
	private readonly baseUrlRestApiSettedOrigin: string = this.settedOrigin + this.nameService + this.pathApi;

	private readonly httpClient: HttpClient = inject(HttpClient);

	protected getRestApi(): string {
		return this.baseUrlRestApi
	}

	protected getRestApiPathParam(pathParam: number): string {
		return this.baseUrlRestApi + pathParam;
	}

	/**
	 * 
	 * @param url 
	 * @param actionsResponse 
	 */
	protected get<T>(url: string, actionsResponse: ActionsResponseTyped<T>) {
		const observableOfResponseBodyInRequestedType: Observable<T> = this.httpClient.get<T>(url, { observe: 'body', responseType: 'json' });
		observableOfResponseBodyInRequestedType.subscribe(actionsResponse);
	}


	/**
	 * 
	 * XX means Same Body Type for Requesting and Responding.
	 * 
	 * @param url 
	 * @param metadataRequest 
	 * @param actionsResponse 
	 * @returns 
	 */
	protected postXX<T extends CoreDto>(url: string, metadataRequest: MetadataRequest<T>, actionsResponse: ActionsResponse) {
		if (this.tryLockAndAppendUnlockOnComplete(metadataRequest, actionsResponse)) {
			const observableOfResponseBodyInRequestedType: Observable<T> = this.httpClient.post<T>(url, metadataRequest.dto, { observe: 'body', responseType: 'json' });
			observableOfResponseBodyInRequestedType.subscribe(actionsResponse).add(() => {
				this.unlockMetadataRequest(metadataRequest);
			});
		}
	}


	/**
	 * 
	 * XX means Same Body Type for Requesting and Responding.
	 * 
	 * @param url 
	 * @param metadataRequest 
	 * @param actionsResponse 
	 * @returns 
	 */
	protected updateXX<T extends CoreDto>(url: string, metadataRequest: MetadataRequest<T>, actionsResponse: ActionsResponse) {
		if (this.tryLockAndAppendUnlockOnComplete(metadataRequest, actionsResponse)) {
			const observableOfResponseBodyInRequestedType: Observable<T> = this.httpClient.put<T>(url, metadataRequest.dto, { observe: 'body', responseType: 'json' });
			observableOfResponseBodyInRequestedType.subscribe(actionsResponse).add(() => {
				this.unlockMetadataRequest(metadataRequest);
			});
		}
	}

	protected delete(url: string, actionsResponse: ActionsResponse) {
		const observableStringOfResponseBodyInString: Observable<string> = this.httpClient.delete(url, { observe: 'body', responseType: 'text' });
		observableStringOfResponseBodyInString.subscribe(actionsResponse);
	}

	constructor() {
		super();
		// console.log(location);
		// console.log(this.platformLocation);
		// console.log(this.baseUrlRestApiSettedOrigin);		
	}

}