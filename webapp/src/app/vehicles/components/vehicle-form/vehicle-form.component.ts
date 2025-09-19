import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicle } from '../../interfaces/vehicle.interface';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-form.component.html',
})
export class VehicleFormComponent implements OnInit, OnChanges {
  @Input() vehicle: Vehicle | null = null;
  @Input() isEditing = false;
  @Output() vehicleSubmit = new EventEmitter<Vehicle>();
  @Output() cancel = new EventEmitter<void>();

  formData = signal<Vehicle>({
    plate: '',
    chassis: '',
    reindeer: '',
    model: '',
    brand: '',
    year: Number(),
  });

  errors: { [key: string]: string } = {};
  isSubmitting = false;

  ngOnInit() {
    this.loadVehicleData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vehicle'] || changes['isEditing']) {
      this.loadVehicleData();
    }
  }

  private loadVehicleData() {
    setTimeout(() => {
      if (this.vehicle && this.isEditing) {
        this.formData.update((prev) => ({
          ...prev,
          id: this.vehicle?.id || 0,
          plate: this.vehicle?.plate || '',
          chassis: this.vehicle?.chassis || '',
          reindeer: this.vehicle?.reindeer || '',
          model: this.vehicle?.model || '',
          brand: this.vehicle?.brand || '',
          year: this.vehicle?.year || 0,
        }));
      } else {
        this.resetForm();
      }
    }, 0);
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    if (!this.formData().plate.trim()) {
      this.errors['plate'] = 'Placa é obrigatória';
      isValid = false;
    } else if (!/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(this.formData().plate.toUpperCase())) {
      this.errors['plate'] = 'Formato de placa inválido (ex: ABC1234 ou ABC1D23)';
      isValid = false;
    }

    if (!this.formData().chassis.trim()) {
      this.errors['chassis'] = 'Chassi é obrigatório';
      isValid = false;
    } else if (this.formData().chassis.length !== 17) {
      this.errors['chassis'] = 'Chassi deve ter 17 caracteres';
      isValid = false;
    }

    if (!this.formData().reindeer.trim()) {
      this.errors['renavam'] = 'Renavam é obrigatório';
      isValid = false;
    } else if (!/^\d{9,11}$/.test(this.formData().reindeer)) {
      this.errors['renavam'] = 'Renavam deve ter entre 9 e 11 dígitos';
      isValid = false;
    }

    if (!this.formData().model.trim()) {
      this.errors['model'] = 'Modelo é obrigatório';
      isValid = false;
    }

    if (!this.formData().brand.trim()) {
      this.errors['brand'] = 'Marca é obrigatória';
      isValid = false;
    }

    const currentYear = new Date().getFullYear();
    if (!this.formData().year) {
      this.errors['year'] = 'Ano é obrigatório';
      isValid = false;
    } else if (this.formData().year < 1900 || this.formData().year > currentYear + 1) {
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
        ...this.formData(),
        plate: this.formData().plate.toUpperCase(),
        chassis: this.formData().chassis.toUpperCase(),
        year: Number(this.formData().year),
      };

      if (this.isEditing) {
        Object.assign(vehicleData, {
          id: this.vehicle?.id,
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
    this.formData.update((prev) => ({
      ...prev,
      id: 0,
      plate: '',
      chassis: '',
      reindeer: '',
      model: '',
      brand: '',
      year: new Date().getFullYear(),
    }));
    this.errors = {};
  }

  onPlateInput(event: any) {
    let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 7) {
      value = value.substr(0, 7);
    }
    this.formData.update((prev) => ({ ...prev, plate: value }));
  }

  onChassisInput(event: any) {
    let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 17) {
      value = value.substr(0, 17);
    }
    this.formData.update((prev) => ({ ...prev, chassis: value }));
  }

  onRenavamInput(event: any) {
    let value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length > 11) {
      value = value.substr(0, 11);
    }
    this.formData.update((prev) => ({ ...prev, reindeer: value }));
  }
}
