import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Create this service
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  submitted = false;
  isSignup = false; // Track if we are in signup mode
  loginError: string | null = null;
  signupError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // Initialize signup form
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator } // Add custom validator
    );
  }

  ngOnInit(): void {}

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  // Handle form submission for login
  onLoginSubmit(): void {
    this.submitted = true;

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.router.navigate(['/']);
        },
        error: (error: Error) => {
          console.error('Login failed', error);
          this.loginError = 'Login failed. Please check your credentials.';
        },
      });
    }
  }

  // Handle form submission for signup
  onSignupSubmit(): void {
    this.submitted = true;

    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;

      this.authService.signup(email, password).subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          this.router.navigate(['/']);
        },
        error: (error: Error) => {
          console.error('Signup failed', error);
          this.signupError = 'Signup failed. Please try again.';
        },
      });
    }
  }

  // Toggle between login and signup
  toggleForm(): void {
    this.isSignup = !this.isSignup;
    this.submitted = false; // Reset submitted flag
    this.signupForm.reset(); // Reset signup form
    this.loginForm.reset(); // Reset login form
    this.loginError = null;
    this.signupError = null;
  }
}
