import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PersonaComponent } from './persona/persona.component';
import { EstudianteComponent } from './estudiante/estudiante.component';

export const routes: Routes = [
    {
        path:'',
        component: HomeComponent,
        title:'home'
    },
    {
        path:'persona',
        component:PersonaComponent,
        title:'persona'
    },
    {
        path:'estudiante',
        component:EstudianteComponent,
        title:'estudiante'
    },
    {
        path:'**',
        redirectTo:'',
        pathMatch:'full'
    }
];
