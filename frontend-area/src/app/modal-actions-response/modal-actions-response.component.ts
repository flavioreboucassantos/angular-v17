import { Component, ElementRef, ViewChild } from '@angular/core';

/**
 * @author Flávio Rebouças Santos - flavioReboucasSantos@gmail.com
 */

@Component({
	selector: 'app-modal-actions-response',
	standalone: true,
	imports: [],
	templateUrl: './modal-actions-response.component.html',
	styleUrl: './modal-actions-response.component.css',
})
export class ModalActionsResponseComponent {

	@ViewChild('buttonModalActionsResponse') buttonModalActionsResponse?: ElementRef<HTMLElement>;

	visible: boolean = false;
	textLead: string = '';
	textMessage: string = '';

	callback: (() => void) | undefined;

	open(textLead: string, textMessage: string, callback?: (() => void)) {
		if (callback) this.callback = callback;
		this.textLead = textLead;
		this.textMessage = textMessage;
		this.visible = true;
		this.buttonModalActionsResponse?.nativeElement.focus();
	}

	close() {
		this.buttonModalActionsResponse?.nativeElement.blur();
		this.visible = false;
		if (this.callback) {
			this.callback();
			this.callback = undefined;
		}
	}

}
