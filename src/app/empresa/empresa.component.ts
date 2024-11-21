import { Component, OnInit } from '@angular/core';
import { Empresa } from '../models/empresa';  // Modelo Empresa
import { EmpresaService } from '../services/empresa.service';  // Servicio para gestionar empresas
import { MessageService, ConfirmationService } from 'primeng/api';  // Servicios para notificaciones y confirmación
import { TableModule } from 'primeng/table';  // Componente de tabla
import { ButtonModule } from 'primeng/button';  // Componente de botones
import { ConfirmDialogModule } from 'primeng/confirmdialog';  // Componente de confirmación
import { ToastModule } from 'primeng/toast';  // Componente de toast
import { DialogModule } from 'primeng/dialog';  // Componente de diálogo
import { RouterModule } from '@angular/router';  // Módulo de enrutamiento
import { InputTextModule } from 'primeng/inputtext';  // Componente de entrada de texto
import { FormsModule } from '@angular/forms';  // Módulo de formularios

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    RouterModule,
    InputTextModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css'],
})
export class EmpresaComponent implements OnInit {
  empresas: Empresa[] = [];  // Lista de empresas
  visible: boolean = false;  // Controla la visibilidad del diálogo
  empresa: Empresa = new Empresa();  // Objeto para gestionar la empresa
  titulo: string = '';  // Título del diálogo
  opc: string = '';  // Opción del botón en el diálogo (Crear / Editar)
  op: number = 0;  // Operación: 0 = Crear, 1 = Editar

  constructor(
    private empresaService: EmpresaService,  // Servicio de empresas
    private messageService: MessageService,  // Servicio para notificaciones
    private confirmationService: ConfirmationService  // Servicio para confirmación de eliminación
  ) {}

  ngOnInit() {
    this.listarEmpresas();  // Cargar lista de empresas al iniciar
  }

  // Método para listar empresas
  listarEmpresas() {
    this.empresaService.getEmpresas().subscribe(
      (data) => {
        this.empresas = data;  // Asignar las empresas recibidas
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar empresas',
          detail: error.message || 'No se pudieron cargar las empresas',
        });
      }
    );
  }

  // Método para mostrar el diálogo de creación
  showDialogCreate() {
    this.titulo = 'Crear Empresa';  // Título del diálogo
    this.opc = 'Guardar';  // Texto del botón en el diálogo
    this.op = 0;  // Establece la operación como Crear
    this.empresa = new Empresa();  // Limpiar formulario
    this.visible = true;  // Mostrar diálogo
  }

  // Método para mostrar el diálogo de edición
  showDialogEdit(id: number) {
    this.titulo = 'Editar Empresa';  // Título del diálogo
    this.opc = 'Actualizar';  // Texto del botón en el diálogo
    this.empresaService.getEmpresasById(id).subscribe(
      (data) => {
        this.empresa = { ...data };  // Cargar datos de la empresa a editar
        this.op = 1;  // Establece la operación como Editar
        this.visible = true;  // Mostrar diálogo
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar empresa',
          detail: error.message || 'No se pudo cargar la empresa',
        });
      }
    );
  }

  // Método para eliminar empresa con confirmación
  showDialogDelete(id: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar esta empresa?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteEmpresa(id),  // Si el usuario acepta, eliminar empresa
    });
  }

  // Método para eliminar empresa
  deleteEmpresa(id: number) {
    this.empresaService.deleteEmpresa(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Empresa eliminada',
        });
        this.listarEmpresas();  // Recargar la lista de empresas
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la empresa: ' + error.message,
        });
      },
    });
  }

  // Método para manejar el botón de acción (Crear o Editar)
  opcion() {
    if (this.op === 0) {
      this.addEmpresa();  // Si op es 0, se crea la empresa
    } else if (this.op === 1) {
      this.editEmpresa();  // Si op es 1, se edita la empresa
    }
  }

  // Método para agregar empresa
  addEmpresa() {
    this.empresaService.createEmpresa(this.empresa).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Empresa registrada correctamente',
        });
        this.listarEmpresas();  // Recargar lista
        this.visible = false;  // Cerrar diálogo
        this.empresa = new Empresa();  // Limpiar formulario
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar la empresa: ' + error.message,
        });
      },
    });
  }

  // Método para editar empresa
  editEmpresa() {
    this.empresaService.updateEmpresa(this.empresa).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Empresa editada correctamente',
        });
        this.listarEmpresas();  // Recargar lista
        this.visible = false;  // Cerrar diálogo
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo editar la empresa: ' + error.message,
        });
      },
    });
  }

  // Método para cerrar el diálogo sin hacer cambios
  closeDialog() {
    this.visible = false;
    this.empresa = new Empresa();  // Limpiar el formulario
  }
}
