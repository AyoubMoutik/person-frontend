import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Login</h2>
        <div class="form-group">
          <input type="text" [(ngModel)]="username" placeholder="Username" class="input-field">
        </div>
        <div class="form-group">
          <input type="password" [(ngModel)]="password" placeholder="Password" class="input-field">
        </div>
        <button (click)="login()" class="btn login-btn">Login</button>
        <div *ngIf="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f6fa;
    }
    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .input-field {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .login-btn {
      width: 100%;
      padding: 0.8rem;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    .login-btn:hover {
      background-color: #2980b9;
    }
    .error-message {
      color: #e74c3c;
      text-align: center;
      margin-top: 1rem;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    this.error = '';
    if (this.username && this.password) {
      this.authService.login(this.username, this.password)
        .subscribe({
          next: () => {
            this.router.navigate(['/persons']);
          },
          error: err => {
            this.error = 'Invalid username or password';
          }
        });
    } else {
      this.error = 'Please enter both username and password';
    }
  }
}
