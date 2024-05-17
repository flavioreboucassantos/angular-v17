import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";

/**
 * @author Flávio Rebouças Santos
 */

export enum ViewExpected {
	'create', 'updateById'
}

export abstract class BaseViewComponent {

	readonly router: Router = inject(Router);
	readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

	readonly EnumViewExpected = ViewExpected;

	constructor() {
	}

	isNumber(value?: string | number): boolean {
		return ((value != null) &&
			(value !== '') &&
			!isNaN(Number(value.toString())));
	}

	reloadWithPath(path: any) {
		this.router.navigate(['vr', path]);
	}

	navigate(commands: any[], extras?: NavigationExtras) {
		this.router.navigate(commands, extras);
	}

	getViewExpected(): ViewExpected {
		return this.activatedRoute.routeConfig?.data?.['viewExpected'];
	}

	extractErrorResponse(error: HttpErrorResponse): string {
		return error.status.toString() + '<br>'
			+ error.statusText + '<br>'
			+ ((error.error) ? error.error : '');
	}


}