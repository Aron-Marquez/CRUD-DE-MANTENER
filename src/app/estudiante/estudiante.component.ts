import { Component, OnInit } from '@angular/core';
import { Estudiante } from '../models/estudiante';
import { Persona } from '../models/persona';
import { EstudianteService } from '../services/estudiante.service';
import { PersonaService } from '../services/persona.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estudiante',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class EstudianteComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  personas: Persona[] = [];
  visible: boolean = false;
  estudiante: Estudiante = new Estudiante();
  persona: Persona = new Persona();
  titulo: string = '';
  opc: string = '';
  op = 0;

  constructor(
    private estudianteService: EstudianteService,
    private personaService: PersonaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.listarEstudiantes();
    this.listarPersonas();
  }

  listarEstudiantes() {
    this.estudianteService.getEstudiantes().subscribe({
      next: (data) => (this.estudiantes = data),
      error: (error) => this.handleError(error, 'Error al cargar estudiantes'),
    });
  }

  listarPersonas() {
    this.personaService.getPersonas().subscribe({
      next: (data) => (this.personas = data),
      error: (error) => this.handleError(error, 'Error al cargar personas'),
    });
  }

  showDialogCreate() {
    this.prepareDialog('Crear Estudiante', 'Guardar', 0);
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Estudiante';
    this.opc = 'Actualizar';

    // Llamada al servicio para obtener los datos del estudiante por ID
    this.estudianteService.getEstudianteById(id).subscribe({
      next: (data) => {
        // Aseguramos que tanto el estudiante como la persona sean asignados correctamente
        this.estudiante = { ...data };
        this.persona = { ...this.estudiante.persona };  // Opcional, si necesitas trabajar con persona aparte

        // Llamamos al método para preparar el diálogo (en este caso se puede usar directamente)
        this.visible = true;  // Mostrar el diálogo
      },
      error: (error) => this.handleError(error, 'Error al cargar el estudiante'),
    });
  }

  prepareDialog(title: string, buttonText: string, opValue: number) {
    this.titulo = title;
    this.opc = buttonText;
    this.op = opValue;
    this.estudiante = new Estudiante();
    this.persona = new Persona();
    this.visible = true;
  }

  opcion() {
    if (this.op === 0) {
      this.addPersonaAndEstudiante();
    } else if (this.op === 1) {
      this.updatePersonaAndEstudiante();
    }
  }

  addPersonaAndEstudiante() {
    if (this.isValid()) {
      console.log('Datos de Persona:', this.persona); // Verifica los datos antes de enviarlos
      this.personaService.createPersona(this.persona).subscribe({
        next: (persona) => {
          console.log('Respuesta de la API:', persona); // Verifica la respuesta
          this.estudiante.persona = persona;
          this.createEstudiante();
        },
        error: (error) => this.handleError(error, 'No se pudo agregar la persona')
      });
    }
  }

  updatePersonaAndEstudiante() {
    if (this.isValid()) {
      this.personaService.updatePersona(this.persona, this.persona.id).subscribe({
        next: (updatedPersona) => {
          this.estudiante.persona = updatedPersona;
          this.updateEstudiante();
        },
        error: (error) =>
          this.handleError(error, 'No se pudo actualizar la persona'),
      });
    }
  }

  createEstudiante() {
    this.estudianteService.createEstudiante(this.estudiante).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Estudiante Registrado',
        });
        this.listarEstudiantes();
        this.closeDialog();
      },
      error: (error) =>
        this.handleError(error, 'No se pudo agregar el estudiante'),
    });
  }

  updateEstudiante() {
    this.estudianteService.updateEstudiante(this.estudiante).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Estudiante Actualizado',
        });
        this.listarEstudiantes();
        this.closeDialog();
      },
      error: (error) =>
        this.handleError(error, 'No se pudo actualizar el estudiante'),
    });
  }

  isValid(): boolean {
    if (
      !this.persona.nombre ||
      !this.persona.apellido ||
      !this.persona.dni ||
      !this.persona.correo ||
      !this.persona.telefono ||
      !this.persona.estado ||
      !this.estudiante.codigo
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todos los campos son obligatorios',
      });
      return false;
    }
    return true;
  }

  showDialogDelete(id: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este estudiante?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteEstudiante(id),
    });
  }

  deleteEstudiante(id: number) {
    this.estudianteService.deleteEstudiante(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Estudiante Eliminado',
        });
        this.listarEstudiantes();
      },
      error: (error) =>
        this.handleError(error, 'No se pudo eliminar el estudiante'),
    });
  }

  closeDialog() {
    this.visible = false;
    this.estudiante = new Estudiante();
    this.persona = new Persona();
  }

  handleError(error: any, defaultMessage: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || defaultMessage,
    });
  }
}
