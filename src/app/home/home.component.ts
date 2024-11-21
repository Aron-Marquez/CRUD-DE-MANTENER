import { Component } from '@angular/core';
import { EmpresaComponent } from "../empresa/empresa.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [EmpresaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
