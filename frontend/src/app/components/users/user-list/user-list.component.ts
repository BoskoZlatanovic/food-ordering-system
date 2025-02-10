import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  error: string = '';
  permissions: string[] = [];
  currentUserEmail?: string;


  constructor(
    private userService: UserService,
    protected router: Router
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      this.permissions = tokenData.permissions || [];
      this.currentUserEmail = tokenData.sub; // 'sub' contains the email
    }
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        if (error.status === 403) {
          this.error = 'You do not have permission to view users';
        } else {
          this.error = 'Error loading users';
        }
      }
    });
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          if (error.status === 403) {
            this.error = 'You do not have permission to delete users';
          } else {
            this.error = 'Error deleting user';
          }
        }
      });
    }
  }

}
