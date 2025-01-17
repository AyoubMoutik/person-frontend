import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonService, Personne, NewPersonne } from '../person.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PersonListComponent implements OnInit {
  personnes: Personne[] = [];
  newPersonne: NewPersonne = { nom: '', prenom: '' };
  isModalOpen = false;
  editingPersonne: Personne | null = null;

  constructor(
    private personService: PersonService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadPersonnes();
  }

  loadPersonnes(): void {
    this.personService.getPersonnes().subscribe({
      next: (data) => {
        this.personnes = data;
      },
      error: (error) => {
        if (error.status === 401 || error.status === 403) {
          this.authService.logout();
        }
      }
    });
  }

  addPersonne(): void {
    this.personService.addPersonne(this.newPersonne).subscribe(() => {
      this.loadPersonnes();
      this.newPersonne = { nom: '', prenom: '' };
    });
  }

  updatePersonne(personne: Personne): void {
    this.personService.updatePersonne(personne).subscribe(() => {
      this.loadPersonnes();
    });
  }

  deletePersonne(num: number): void {
    if (num) {
      this.personService.deletePersonne(num).subscribe(() => {
        this.loadPersonnes();
      });
    }
  }

  openEditModal(personne: Personne): void {
    this.editingPersonne = { ...personne };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingPersonne = null;
  }

  saveChanges(): void {
    if (this.editingPersonne) {
      this.personService.updatePersonne(this.editingPersonne).subscribe(() => {
        this.loadPersonnes();
        this.closeModal();
      });
    }
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }

  public logout(): void {
    this.authService.logout();
  }
}
