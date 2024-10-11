import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api-client.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-sheet-detail',
  templateUrl: './sheet-detail.component.html',
  styleUrls: ['./sheet-detail.component.css'],
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
})
export class SheetDetailComponent implements OnInit {
  sheetId: string | null = null;
  sheet: any;
  sheetExpenses: any[] = []; // Property to hold the list of sheet expenses
  categories: any[] = []; // Property to hold the list of categories
  expenseForm: FormGroup; // Form group for adding expenses
  showAddExpenseForm: boolean = false; // Flag to show/hide the add expense form

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    // Initialize the form with validation
    this.expenseForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(200),
        ],
      ],
      amount: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      expected: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      category_id: ['', Validators.required], // This will be replaced by a dropdown later
    });
  }

  ngOnInit(): void {
    this.sheetId = this.route.snapshot.paramMap.get('id');
    if (this.sheetId) {
      this.getSheetDetail(this.sheetId);
      this.getSheetExpenses(this.sheetId); // Fetch expenses
    }
    this.getCategories(); // Fetch categories for the dropdown
  }

  getTotalSpent(): number {
    if (this.sheetExpenses.length) {
      return this.sheetExpenses.reduce(
        (total, expense) => total + parseInt(expense.amount),
        0
      );
    }

    return 0;
  }

  getSheetDetail(sheetId: string) {
    this.apiService.getData(`sheet/${sheetId}`).subscribe({
      next: (response) => {
        this.sheet = response.result;
      },
      error: (error) => {
        console.error('Error fetching sheet details!', error);
      },
    });
  }

  getSheetExpenses(sheetId: string) {
    this.apiService
      .getData(`sheet/${sheetId}/expenses?expand=category`)
      .subscribe({
        next: (response) => {
          this.sheetExpenses = response.result; // Assign fetched expenses to the property
        },
        error: (error) => {
          console.error('Error fetching sheet expenses!', error);
        },
      });
  }

  // Fetch categories from the API to populate the dropdown
  getCategories() {
    this.apiService.getData('category').subscribe({
      next: (response) => {
        this.categories = response.result; // Assign fetched categories to the property
      },
      error: (error) => {
        console.error('Error fetching categories!', error);
      },
    });
  }

  // Method to toggle the visibility of the add expense form
  toggleAddExpenseForm() {
    this.showAddExpenseForm = !this.showAddExpenseForm;
  }

  // Method to add a new expense
  addExpense() {
    if (this.expenseForm.valid) {
      const newExpense = {
        expense: {
          ...this.expenseForm.value,
          sheet_id: this.sheetId, // Associate the expense with the current sheet
        },
      };

      this.apiService.postData('expense', newExpense).subscribe({
        next: (response) => {
          const selectedCategory =
            this.expenseForm.controls['category_id'].value;
          const category = this.categories.find(
            (category) => category.id === selectedCategory
          );

          const expense = {
            ...newExpense.expense,
            categoryName: category.name,
            createdAt: new Date(),
            id: response.result[0].id,
          };

          this.sheetExpenses = [expense, ...this.sheetExpenses]; // Add the new expense to the list
          this.expenseForm.reset(); // Reset the form
          this.showAddExpenseForm = false; // Hide the form after adding
        },
        error: (error) => {
          console.error('Error adding expense!', error);
        },
      });
    }
  }

  // Method to add a new category if it doesn't exist and add it to categories list
  addCategory(newCategoryName: string) {
    const newCategory = {
      category: {
        name: newCategoryName,
      },
    };

    // Post the new category to the API
    this.apiService.postData('category', newCategory).subscribe({
      next: (response) => {
        const createdCategory = {
          name: newCategoryName,
          id: response.result[0].id, // Assuming response.result[0].id contains the ID
        };

        // Add the newly created category to the list of categories
        this.categories = [...this.categories, createdCategory];

        // Update the form with the newly created category ID
        this.expenseForm.patchValue({
          category_id: createdCategory.id,
        });

        console.log('New category created and selected:', createdCategory);
        console.log(
          'Selected category ID:',
          this.expenseForm.controls['category_id'].value
        );
      },
      error: (error) => {
        console.error('Error creating new category!', error);
      },
    });
  }

  // Method to delete an expense
  deleteExpense(expenseId: string, index: number) {
    this.apiService.deleteData(`expense/${expenseId}`).subscribe({
      next: (response) => {
        // Remove the expense from the array
        this.sheetExpenses.splice(index, 1);
        console.log('Expense deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting expense!', error);
      },
    });
  }
}
