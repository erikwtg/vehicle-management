import { Component, EventEmitter, Output, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../components/modal/modal.component';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';
import {
  TableComponent,
  TableColumn,
  TableConfig,
  TableSortEvent,
  TablePageEvent,
} from '../../../components/table/table.component';
import { HttpClient } from '@angular/common/http';

export interface Vehicle {
  id: string;
  plate: string;
  chassis: string;
  renavam: string;
  model: string;
  brand: string;
  year: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VehicleListResponse {
  data: Vehicle[];
  nextCursor: string;
  hasMore: boolean;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, VehicleFormComponent, TableComponent],
  templateUrl: './list.html',
})
export class List implements OnInit {
  private http = inject(HttpClient);

  @Output() editVehicle = new EventEmitter<Vehicle>();
  @Output() deleteVehicle = new EventEmitter<string>();

  vehicles = signal<Vehicle[]>([]);
  // searchTerm = signal(''); // Todo[Erik] - Implementar para filtro com API
  sortField = signal<keyof Vehicle>('createdAt');
  sortDirection = signal<'asc' | 'desc'>('desc');
  isLoading = signal<boolean>(false);
  hasMore = signal<boolean>(true);
  nextCursor: string | undefined;

  tableConfig = signal<TableConfig>({
    columns: this.getTableColumns(),
    showPagination: true,
    itemsPerPage: 10,
    loading: false,
    sortField: 'createdAt',
    sortDirection: 'desc',
    emptyMessage: 'Comece cadastrando um novo veículo.',
    loadingMessage: 'Carregando veículos...',
    enableRowClick: false,
    showActions: true,
    hasMore: true,
  });

  isModalOpen = signal<boolean>(false);
  selectedVehicle = signal<Vehicle | null>(null);
  modalTitle = 'Editar Veículo';

  ngOnInit() {
    this.vehicles.set([]);
    this.hasMore.set(true);
    this.nextCursor = '';
    console.log('nextCursor', this.nextCursor);
    this.loadVehicles();
  }

  loadVehicles() {
    if (!this.hasMore()) {
      return;
    }

    this.isLoading.set(true);

    const url = `/vehicle?limit=10&cursor=${this.nextCursor}`;
    console.log('Chamando URL:', url);
    this.http.get<VehicleListResponse>(url).subscribe({
      next: (response) => {
        console.log('response', response);
        this.vehicles.update((prev) => [...prev, ...response.data]);
        this.nextCursor = response.nextCursor || '';
        this.hasMore.set(response.hasMore);
        this.isLoading.set(false);
        this.updateTableConfig();
      },
      error: (error) => {
        console.error('Erro ao carregar veículos:', error);
        this.isLoading.set(false);
      },
    });
  }

  removeVehicle(vehicleId: string) {
    this.isLoading.set(true);
    this.http.delete(`/vehicle/${vehicleId}`).subscribe({
      next: () => {
        this.vehicles.update((prev) => prev.filter((v) => v.id !== vehicleId));
        this.isLoading.set(false);
        this.updateTableConfig();
      },
      error: (error) => {
        console.error('Erro ao excluir veículo:', error);
        this.isLoading.set(false);
      },
    });
  }

  private getTableColumns(): TableColumn[] {
    return [
      {
        key: 'plate',
        label: 'Placa',
        sortable: true,
        type: 'text',
      },
      {
        key: 'model',
        label: 'Modelo',
        sortable: true,
        type: 'text',
      },
      {
        key: 'brand',
        label: 'Marca',
        sortable: true,
        type: 'text',
      },
      {
        key: 'year',
        label: 'Ano',
        sortable: true,
        type: 'badge',
      },
      {
        key: 'chassis',
        label: 'Chassi',
        sortable: false,
        type: 'text',
      },
      {
        key: 'reindeer',
        label: 'Renavam',
        sortable: false,
        type: 'text',
      },
      {
        key: 'createdAt',
        label: 'Cadastrado em',
        sortable: true,
        type: 'date',
        format: 'dd/MM/yyyy',
      },
    ];
  }

  updateTableConfig() {
    this.tableConfig.update((config) => ({
      ...config,
      loading: this.isLoading(),
      sortField: this.sortField(),
      sortDirection: this.sortDirection(),
      hasMore: this.hasMore(),
    }));
  }

  // onSearch() {
  //   // Todo[Erik] - Implementar para filtro com API
  //   this.currentPage = 1;
  // }

  sort(field: keyof Vehicle) {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
    this.updateTableConfig();
    // TODO[Erik] - Implementar ordenação via API
  }

  onTableSort(event: TableSortEvent) {
    this.sortField.set(event.field as keyof Vehicle);
    this.sortDirection.set(event.direction);
    this.updateTableConfig();
    // TODO[Erik] - Implementar ordenação via API
  }

  onTablePageChange(event: TablePageEvent) {
    if (event.direction === 'next' && this.hasMore()) {
      this.loadVehicles();
    }
    // Para cursor-based pagination, não há navegação para trás ou páginas específicas
  }

  onTableRowClick(vehicle: Vehicle) {
    this.onEdit(vehicle);
  }

  onTableActionClick(event: { action: string; item: Vehicle }) {
    switch (event.action) {
      case 'edit':
        this.onEdit(event.item);
        break;
      case 'delete':
        this.onDelete(event.item.id);
        break;
    }
  }

  onEdit(vehicle: Vehicle) {
    this.selectedVehicle.set({ ...vehicle });
    console.log('Editing vehicle:', this.selectedVehicle());
    this.modalTitle = 'Editar Veículo';
    this.isModalOpen.set(true);
  }

  addNewVehicle() {
    this.selectedVehicle.set(null);
    this.modalTitle = 'Cadastrar Novo Veículo';
    this.isModalOpen.set(true);
  }

  onModalClose() {
    this.isModalOpen.set(false);
    this.selectedVehicle.set(null);
  }

  onVehicleSubmit(vehicle: Vehicle) {
    if (this.selectedVehicle()) {
      const index = this.vehicles().findIndex((v) => v.id === this.selectedVehicle()!.id);
      if (index !== -1) {
        this.vehicles()[index] = { ...vehicle, id: this.selectedVehicle()!.id };
      }
    } else {
      const newVehicle = {
        ...vehicle,
        id: this.generateId(),
      };
      this.vehicles().unshift(newVehicle);
    }

    this.updateTableConfig();
    this.onModalClose();
  }

  private generateId(): string {
    return 'VEH' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  onDelete(vehicleId: string) {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      this.removeVehicle(vehicleId);
    }
  }

  addVehicle(vehicle: Vehicle) {
    this.vehicles.set([vehicle, ...this.vehicles()]);
    this.updateTableConfig();
  }

  updateVehicle(updatedVehicle: Vehicle) {
    const index = this.vehicles().findIndex((v) => v.id === updatedVehicle.id);
    if (index !== -1) {
      this.vehicles()[index] = updatedVehicle;
      this.updateTableConfig();
    }
  }

  // clearSearch() {
  //   // Todo[Erik] - Implementar para filtro com API
  //   this.searchTerm.set('');
  //   this.onSearch();
  // }

  get Math() {
    return Math;
  }
}
