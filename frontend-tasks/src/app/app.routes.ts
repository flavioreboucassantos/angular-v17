import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EntityTaskComponent } from './entity-task/entity-task.component';

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		title: 'Home page'
	},
	{
		path: 'form',
		component: EntityTaskComponent,
		title: 'Add Data'		
	},
	{
		path: 'form/:id',
		component: EntityTaskComponent,
		title: 'View Data'
	}
];