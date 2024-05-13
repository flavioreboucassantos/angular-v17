import { Component } from '@angular/core';
import { ListEntityAreaComponent } from '../list-entity-area/list-entity-area.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [ListEntityAreaComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent {

}
