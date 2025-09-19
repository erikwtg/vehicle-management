import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Vehicle {
  id?: string;
  plate: string;
  chassis: string;
  reindeer: string;
  model: string;
  brand: string;
  year: number;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-form.component.html',
})
export class VehicleFormComponent {
  @Input() vehicle: Vehicle | null = null;
  @Input() isEditing = false;
  @Output() vehicleSubmit = new EventEmitter<Vehicle>();
  @Output() cancel = new EventEmitter<void>();

  formData: Vehicle = {
    plate: '',
    chassis: '',
    reindeer: '',
    model: '',
    brand: '',
    year: Number(),
  };

  errors: { [key: string]: string } = {};
  isSubmitting = false;

  ngOnInit() {
    if (this.vehicle && this.isEditing) {
      this.formData = { ...this.vehicle };
    }
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    if (!this.formData.plate.trim()) {
      this.errors['plate'] = 'Placa é obrigatória';
      isValid = false;
    } else if (!/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(this.formData.plate.toUpperCase())) {
      this.errors['plate'] = 'Formato de placa inválido (ex: ABC1234 ou ABC1D23)';
      isValid = false;
    }

    if (!this.formData.chassis.trim()) {
      this.errors['chassis'] = 'Chassi é obrigatório';
      isValid = false;
    } else if (this.formData.chassis.length !== 17) {
      this.errors['chassis'] = 'Chassi deve ter 17 caracteres';
      isValid = false;
    }

    if (!this.formData.reindeer.trim()) {
      this.errors['renavam'] = 'Renavam é obrigatório';
      isValid = false;
    } else if (!/^\d{9,11}$/.test(this.formData.reindeer)) {
      this.errors['renavam'] = 'Renavam deve ter entre 9 e 11 dígitos';
      isValid = false;
    }

    if (!this.formData.model.trim()) {
      this.errors['model'] = 'Modelo é obrigatório';
      isValid = false;
    }

    if (!this.formData.brand.trim()) {
      this.errors['brand'] = 'Marca é obrigatória';
      isValid = false;
    }

    const currentYear = new Date().getFullYear();
    if (!this.formData.year) {
      this.errors['year'] = 'Ano é obrigatório';
      isValid = false;
    } else if (this.formData.year < 1900 || this.formData.year > currentYear + 1) {
      this.errors['year'] = `Ano deve estar entre 1900 e ${currentYear + 1}`;
      isValid = false;
    }

    return isValid;
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    setTimeout(() => {
      const vehicleData: Vehicle = {
        ...this.formData,
        plate: this.formData.plate.toUpperCase(),
        chassis: this.formData.chassis.toUpperCase(),
        year: Number(this.formData.year),
      };

      if (this.isEditing) {
        Object.assign(vehicleData, {
          id: this.vehicle?.id,
          updatedAt: new Date(),
        });
      }

      this.vehicleSubmit.emit(vehicleData);
      this.isSubmitting = false;

      if (!this.isEditing) {
        this.resetForm();
      }
    }, 1000);
  }

  onCancel() {
    this.cancel.emit();
    if (!this.isEditing) {
      this.resetForm();
    }
  }

  resetForm() {
    this.formData = {
      id: '',
      plate: '',
      chassis: '',
      reindeer: '',
      model: '',
      brand: '',
      year: new Date().getFullYear(),
    };
    this.errors = {};
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  onPlateInput(event: any) {
    let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 7) {
      value = value.substr(0, 7);
    }
    this.formData.plate = value;
  }

  onChassisInput(event: any) {
    let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 17) {
      value = value.substr(0, 17);
    }
    this.formData.chassis = value;
  }

  onRenavamInput(event: any) {
    let value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length > 11) {
      value = value.substr(0, 11);
    }
    this.formData.reindeer = value;
  }
}
