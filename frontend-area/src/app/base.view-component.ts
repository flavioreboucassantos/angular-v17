import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";

/**
 * @author Flávio Rebouças Santos - flavioReboucasSantos@gmail.com
 */

export enum ViewExpected {
	'create', 'updateById'
}

export abstract class BaseViewComponent {

	private readonly router: Router = inject(Router);
	private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

	protected readonly EnumViewExpected = ViewExpected;

	constructor() {
	}

	isNumber(value?: string | number): boolean {
		return ((value != null) &&
			(value !== '') &&
			!isNaN(Number(value.toString())));
	}

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

	extractErrorResponse(error: HttpErrorResponse): string {
		return error.status.toString() + '<br>'
			+ error.statusText + '<br>'
			+ ((error.error) ? error.error : '');
	}


}