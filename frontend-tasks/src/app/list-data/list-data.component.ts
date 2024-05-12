import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EntityData } from '../form-data/form-data.component'

@Component({
	selector: 'app-list-data',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './list-data.component.html',
	styleUrl: './list-data.component.css'
})
export class ListDataComponent {

	/*
	You have to add the ! because the input is expecting the value to be passed.
	In this case, there is no default value.
	In our example application case we know that the value will be passed in - this is by design.
	The exclamation point is called the non-null assertion operator and it tells the TypeScript compiler that the value of this property won't be null or undefined.
	*/
	@Input() listEntityData!: EntityData[];

}
