import { Component, ElementRef, ViewChild } from '@angular/core';

/**
* @author Flávio Rebouças Santos
* @link flavioReboucasSantos@gmail.com
*/
@Component({
	selector: 'app-modal-actions-response',
	standalone: true,
	imports: [],
	templateUrl: './modal-actions-response.component.html',
	styleUrl: './modal-actions-response.component.css',
})
export class ModalActionsResponseComponent {

	@ViewChild('dialog') dialog?: ElementRef<HTMLElement>;

	visible: boolean = false;
	textLead: string = '';
	textMessage: string = '';

	callback: (() => void) | undefined;

	open(textLead: string, textMessage: string, callback?: (() => void)) {
		if (callback) this.callback = callback;
		this.textLead = textLead;
		this.textMessage = textMessage;
		this.visible = true;
		setTimeout(() => this.dialog?.nativeElement.focus(), 50);
	}

	close() {
		this.dialog?.nativeElement.blur();
		this.visible = false;
		if (this.callback) {
			this.callback();
			this.callback = undefined;
		}
	}

}
