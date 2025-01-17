import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
// ...existing imports...

@Component({
  // ...existing component decorator...
})
export class PersonListComponent implements OnInit {
  // ...existing properties...

  constructor(
    private personService: PersonService,
    private authService: AuthService
  ) { }

  isAdmin(): boolean {
    return this.authService.hasRole('ROLE_ADMIN');
  }

  // ...existing code...
}
