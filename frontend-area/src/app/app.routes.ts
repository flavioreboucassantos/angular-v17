import { Routes } from '@angular/router';
import { ViewExpected } from './base.view-component';
import { EntityAreaComponent } from './entity-area/entity-area.component';
import { HomeComponent } from './home/home.component';

/**
 * @author Flávio Rebouças Santos
 */
export const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		title: 'Home Page'
	},
	{
		path: 'vr',
		component: EntityAreaComponent,
		title: 'Criar Área',
		data: { viewExpected: ViewExpected.create }
	},
	{
		path: 'vr/:id',
		component: EntityAreaComponent,
		title: 'Editar Área',
		data: { viewExpected: ViewExpected.updateById }
	}
];