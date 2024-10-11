import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api-client.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// todo-list-item.component.ts
@Component({
  standalone: true,
  selector: 'sheet-list-item',
  templateUrl: './sheet-list-item.component.html',
  styleUrl: './sheet-list-item.component.css',
  imports: [CommonModule, RouterModule, FormsModule],
})
export class SheetListItem implements OnInit {
  sheetList: any;
  newSheet: any = {};
  isFormVisible: boolean = false;
  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    this.getDataFromApi();
  }

  getDataFromApi() {
    let endpoint = 'sheet';

    if (localStorage.getItem('userRole') === 'admin') {
      endpoint = `${endpoint}/admin`;
    }
    this.apiService.getData(endpoint).subscribe({
      next: (response) => {
        this.sheetList = response.result;
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  onCreateSheet() {
    // Only proceed if newSheet has valid data
    if (this.newSheet.name && this.newSheet.maxBudget) {
      let newSheet = {
        name: this.newSheet.name,
        maxBudget: `${this.newSheet.maxBudget}`,
        description: this.newSheet.description,
      };
      this.apiService.postData('sheet', { expenseSheet: newSheet }).subscribe({
        next: (response) => {
          this.sheetList = [
            {
              ...newSheet,
              id: response.result[0].id,
              creationDate: new Date(),
            },
            ...this.sheetList,
          ];
          this.newSheet = {}; // Reset the new sheet form
          this.isFormVisible = false; // Hide the form after creation
        },
        error: (error) => {
          console.error('Error creating new sheet!', error);
        },
      });
    } else {
      console.warn('Please fill out all required fields.');
    }
  }

  onDeleteSheet(sheetId: number): void {
    this.apiService.deleteData(`sheet/${sheetId}`).subscribe(
      () => {
        this.sheetList = this.sheetList.filter(
          (sheet: { id: number }) => sheet.id !== sheetId
        );
      },
      (error) => {
        console.error('Error deleting sheet:', error);
      }
    );
  }

  // Method to toggle the visibility of the new sheet form
  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }
}
