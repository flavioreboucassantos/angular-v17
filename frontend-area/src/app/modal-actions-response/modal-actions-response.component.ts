import { Component, ElementRef, ViewChild } from '@angular/core';

/**
 * @author Flávio Rebouças Santos flavioReboucasSantos@gmail.com
 */

@Component({
	selector: 'app-modal-actions-response',
	standalone: true,
	imports: [],
	templateUrl: './modal-actions-response.component.html',
	styleUrl: './modal-actions-response.component.css',
})
export class ModalActionsResponseComponent {

	@ViewChild('boxDialog') boxDialog?: ElementRef<HTMLElement>;

	visible: boolean = false;
	textLead: string = '';
	textMessage: string = '';

	callback: (() => void) | undefined;

	open(textLead: string, textMessage: string, callback?: (() => void)) {
		this.callback = callback;
		this.textLead = textLead;
		this.textMessage = textMessage;
		this.visible = true;
		this.boxDialog?.nativeElement.focus();
	}

	close() {
		this.boxDialog?.nativeElement.blur();
		this.visible = false;
		if (this.callback) {
			this.callback();
			this.callback = undefined;
		}
	}

}
