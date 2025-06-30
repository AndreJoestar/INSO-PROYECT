import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: string = '';
  contrasena: string = '';

  constructor(private router: Router) {}

  isFormValid(): boolean {
    return this.contrasena.trim() !== '';
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      // Redireccionar a la página de bienvenida
      this.router.navigate(['/bienvenida']);
    }
  }
}
