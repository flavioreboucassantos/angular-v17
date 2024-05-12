import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormDataComponent } from './form-data/form-data.component';

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		title: 'Home page'
	},
	{
		path: 'form',
		component: FormDataComponent,
		title: 'Add Data'		
	},
	{
		path: 'form/:id',
		component: FormDataComponent,
		title: 'View Data'
	}
];