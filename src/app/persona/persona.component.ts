import { Component } from '@angular/core';
import { Persona } from '../models/persona';
import { PersonaService } from '../services/persona.service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, RouterModule, InputTextModule,
    FormsModule, ConfirmDialogModule, ToastModule],
  templateUrl: './persona.component.html',
  styleUrl: './persona.component.css'
})
export class PersonaComponent {
  personas: Persona[] = [];
  visible: boolean = false;
  isDeleteInProgress: boolean = false;
  persona: Persona = new Persona();
  titulo: string = '';
  opc: string = '';
  op = 0;

  constructor(
    private personaService: PersonaService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.listarPersonas();
  }

  listarPersonas() {
    this.personaService.getPersonas().subscribe(
      (data) => {
        this.personas = data;
        console.log(this.personas);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar personas',
          detail: error.message || 'Error al cargar las personas',
        });
      }
    );
  }

  showDialogCreate() {
    this.titulo = "Crear Persona";
    this.opc = "Guardar";
    this.op = 0;
    this.persona = new Persona();  // Limpia los campos del formulario
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = "Editar Persona";
    this.opc = "Editar";
    this.personaService.getPersonaById(id).subscribe(
      (data) => {
        this.persona = { ...data };
        this.op = 1;
        this.visible = true;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar la persona',
          detail: error.message || 'No se pudo cargar la persona',
        });
      }
    );
  }

  deletePersona(id: number) {
    this.isDeleteInProgress = true;
    this.personaService.deletePersona(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Persona eliminada',
        });
        this.isDeleteInProgress = false;
        this.listarPersonas();
      },
      error: (error) => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la persona: ' + error.message,
        });
      },
    });
  }

  opcion() {
    if (this.op === 0) {
      this.addPersona();
    } else if (this.op === 1) {
      this.editPersona();
    }
  }

  addPersona() {
    this.personaService.createPersona(this.persona).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Persona Registrada',
        });
        this.listarPersonas();
        this.visible = false;  // Cerrar el diálogo
        this.persona = new Persona();  // Limpiar el formulario
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar la persona: ' + error.message,
        });
      },
    });
  }

  editPersona() {
    this.personaService.updatePersona(this.persona, this.persona.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Persona Editada Correctamente',
        });
        this.listarPersonas();
        this.visible = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo editar la persona: ' + error.message,
        });
      },
    });
  }

  limpiar() {
    this.titulo = '';
    this.opc = '';
    this.op = 0;
    this.persona = new Persona();  // Reinicia la variable persona
    this.visible = false;
  }
}
