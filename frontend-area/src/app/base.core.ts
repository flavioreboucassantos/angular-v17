import { FormGroup } from "@angular/forms";

// A single screen-controlled form.
const KEY_DISABLED_FORM = '___DISABLEDFORM___';
const KEY_IS_ACCEPTABLE_DTO = '___ISACCEPTABLEDTO___';

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

export abstract class BaseCore {

	protected tryLockAndAppendUnlockOnComplete(dtoWithMetadata: CoreDto, actionsResponse: ActionsResponse): boolean {
		// console.log(dtoWithMetadata);
		if (dtoWithMetadata[KEY_IS_ACCEPTABLE_DTO]) {
			const formGroup: FormGroup = dtoWithMetadata[KEY_DISABLED_FORM];
			formGroup.disable(); // lock
			dtoWithMetadata[KEY_IS_ACCEPTABLE_DTO] = false; // Lock			

			const wrappedOnComplete: (() => void) = actionsResponse.complete;
			actionsResponse.complete = () => { // Append Unlock On Complete
				wrappedOnComplete();
				formGroup.enable();
			};

			delete dtoWithMetadata[KEY_IS_ACCEPTABLE_DTO]; // Delete Metadada
			delete dtoWithMetadata[KEY_DISABLED_FORM]; // Delete Metadada

			return true;
		} else {
			return false;
		}
	}

	protected tryExtract<T>(formGroup: FormGroup): T {
		// console.log(formGroup);
		if (formGroup.disabled)
			return { [KEY_IS_ACCEPTABLE_DTO]: false } as T;
		else {
			const newDto: CoreDto = formGroup.value;
			newDto[KEY_IS_ACCEPTABLE_DTO] = true;
			newDto[KEY_DISABLED_FORM] = formGroup;
			return newDto as T;
		}
	}

	protected tryExtractAndRun(formGroup: FormGroup, method: (() => void)) {
	}
}