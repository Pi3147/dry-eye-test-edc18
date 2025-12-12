import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService } from '../../services/admin-data.service';

@Component({
  selector: 'app-prescription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prescription.component.html',
  styleUrl: './prescription.component.scss'
})
export class PrescriptionComponent implements OnInit {
  prescription_brands: string[] = [];
  newBrand: string = '';
  editingIndex: number = -1;
  editBrand: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private adminDataService: AdminDataService) {}

  async ngOnInit() {
    await this.loadBrands();
  }

  async loadBrands() {
    try {
      this.isLoading = true;
      this.prescription_brands = await this.adminDataService.getPrescriptionBrands();
    } catch (error) {
      this.errorMessage = 'Failed to load prescription brands';
      console.error('Error loading brands:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async addBrand() {
    if (this.newBrand.trim()) {
      try {
        const updatedBrands = [...this.prescription_brands, this.newBrand.trim()];
        const success = await this.adminDataService.updatePrescriptionBrands(updatedBrands);
        
        if (success) {
          this.prescription_brands = updatedBrands;
          this.newBrand = '';
        } else {
          this.errorMessage = 'Failed to add brand';
        }
      } catch (error) {
        this.errorMessage = 'Failed to add brand';
        console.error('Error adding brand:', error);
      }
    }
  }

  startEdit(index: number) {
    this.editingIndex = index;
    this.editBrand = this.prescription_brands[index];
  }

  async saveEdit() {
    if (this.editBrand.trim()) {
      try {
        const updatedBrands = [...this.prescription_brands];
        updatedBrands[this.editingIndex] = this.editBrand.trim();
        
        const success = await this.adminDataService.updatePrescriptionBrands(updatedBrands);
        
        if (success) {
          this.prescription_brands = updatedBrands;
          this.cancelEdit();
        } else {
          this.errorMessage = 'Failed to update brand';
        }
      } catch (error) {
        this.errorMessage = 'Failed to update brand';
        console.error('Error updating brand:', error);
      }
    }
  }

  cancelEdit() {
    this.editingIndex = -1;
    this.editBrand = '';
  }

  async deleteBrand(index: number) {
    try {
      const updatedBrands = this.prescription_brands.filter((_, i) => i !== index);
      const success = await this.adminDataService.updatePrescriptionBrands(updatedBrands);
      
      if (success) {
        this.prescription_brands = updatedBrands;
      } else {
        this.errorMessage = 'Failed to delete brand';
      }
    } catch (error) {
      this.errorMessage = 'Failed to delete brand';
      console.error('Error deleting brand:', error);
    }
  }
}
