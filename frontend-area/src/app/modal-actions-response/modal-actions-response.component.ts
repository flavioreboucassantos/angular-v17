import { Component } from '@angular/core';
import { delay } from 'rxjs';

/**
 * @author Flávio Rebouças Santos
 */

@Component({
	selector: 'app-modal-actions-response',
	standalone: true,
	imports: [],
	templateUrl: './modal-actions-response.component.html',
	styleUrl: './modal-actions-response.component.css',
})
export class ModalActionsResponseComponent {

	callback: (() => void) | undefined;

	open(lead: string, message: string, callback?: (() => void)) {
		this.callback = callback;

		const elLead: HTMLElement | null = document.getElementById('modal-actions-response-lead');
		const elMessage: HTMLElement | null = document.getElementById('modal-actions-response-message');

		if (elLead)
			elLead.innerHTML = lead;
		if (elMessage)
			elMessage.innerHTML = message;

		const wrapper: HTMLElement | null = document.getElementById('modal-actions-response');
		wrapper?.classList.add('visible');
	}

	close() {
		const wrapper: HTMLElement | null = document.getElementById('modal-actions-response');
		wrapper?.classList.remove('visible');
		if (this.callback) {
			this.callback();
			this.callback = undefined;
		}
	}

}
