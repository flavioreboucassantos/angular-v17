import { Component } from '@angular/core';
import { ListDataComponent } from '../list-data/list-data.component'
import { FormDataComponent } from '../form-data/form-data.component'

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [ListDataComponent, FormDataComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent {

}
