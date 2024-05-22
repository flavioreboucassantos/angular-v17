import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";

export enum ViewExpected {
	'create', 'updateById'
}

/**
* @author Flávio Rebouças Santos
* @link flavioReboucasSantos@gmail.com
*/
export abstract class BaseViewComponent {

	private readonly router: Router = inject(Router);
	private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

	protected readonly EnumViewExpected = ViewExpected;
	// ################################################################
	// DATA
	// ################################################################

	isNumber(value?: string | number): boolean {
		return ((value != null) &&
			(value !== '') &&
			!isNaN(Number(value.toString())));
	}

	/**
	 * Copy the values of all of the enumerable own properties from one or more source objects to a target object.
	 * Returns the target object.
	 * @param target 
	 * @param source 
	 * @returns 
	 */
	copyAllEnumerable1<T extends {}, U>(target: T, source: U): T & U {
		return Object.assign(target, source);
	}

	/**
	 * Copy the values of all of the enumerable own properties from one or more source objects to a target object.
	 * Returns the target object.
	 * @param target 
	 * @param source1 
	 * @param source2 
	 * @returns 
	 */
	copyAllEnumerable2<T extends {}, U, V>(target: T, source1: U, source2: V): T & U & V {
		return Object.assign(target, source1, source2);
	}

	/**
	 * Copy the values of all of the enumerable own properties from one or more source objects to a target object.
	 * Returns the target object.
	 * @param target 
	 * @param source1 
	 * @param source2 
	 * @param source3 
	 * @returns 
	 */
	copyAllEnumerable3<T extends {}, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W {
		return Object.assign(target, source1, source2, source3);
	}

	// ################################################################
	// NAVIGATION
	// ################################################################

	reloadWithPath(path: any) {
		this.router.navigate([path], { relativeTo: this.activatedRoute });
	}

	navigate(commands: any[], extras?: NavigationExtras) {
		this.router.navigate(commands, extras);
	}

	getPathParam(pathParam: string): string {
		return this.activatedRoute.snapshot.params[pathParam];
	}

	getViewExpected(): ViewExpected {
		return this.activatedRoute.routeConfig?.data?.['viewExpected'];
	}

	// ################################################################
	// REQUEST
	// ################################################################

	extractErrorResponse(error: HttpErrorResponse): string {
		return error.status.toString() + '<br>'
			+ error.statusText + '<br>'
			+ ((error.error) ? error.error : '');
	}


}