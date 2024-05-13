import { Component } from '@angular/core';
import { ListEntityTaskComponent } from '../list-entity-task/list-entity-task.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [ListEntityTaskComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent {

}
