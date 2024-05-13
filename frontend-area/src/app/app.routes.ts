import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EntityAreaComponent } from './entity-area/entity-area.component';

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		title: 'Home page'
	},
	{
		path: 'form',
		component: EntityAreaComponent,
		title: 'Add Data'		
	},
	{
		path: 'form/:id',
		component: EntityAreaComponent,
		title: 'View Data'
	}
];