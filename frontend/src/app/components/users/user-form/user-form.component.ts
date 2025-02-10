import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { Permission, PermissionType } from '../../../models/permission.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  permissionTypes: PermissionType[] = Object.values(PermissionType) as PermissionType[];  isEditMode = false;
  userId: number | null = null;
  error: string = '';
  currentUserEmail: string = '';  // Add this
  userPermissions: string[] = [];



  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    protected router: Router,
    private route: ActivatedRoute
  ) {
    // Get current user email from token
    const token = localStorage.getItem('token');
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      this.userPermissions = tokenData.permissions || [];
      this.currentUserEmail = tokenData.sub;  // 'sub' contains the email
    }

    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      permissions: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.userId;

    if (this.isEditMode) {
      // Remove password requirement for edit mode
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();

      this.loadUser();
    }
  }

  loadUser(): void {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe({
        next: (user) => {
          const permissions = user.permissions.map(p => p.type);
          this.userForm.patchValue({
            ...user,
            permissions,
            password: ''
          });
        },
        error: (error) => {
          this.error = 'Error loading user';
          if (error.status === 403) {
            this.error = 'You do not have permission to edit users';
          }
        }
      });
    }
  }

  hasFullAccess(): boolean {
    return this.userPermissions.length === 4;  // If user has all permissions
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      const permissions: Permission[] = userData.permissions.map((type: PermissionType) => ({
        type
      }));

      const user: User = {
        ...userData,
        permissions
      };

      console.log('Userdata:', userData); // Debug line
      console.log('permisije:', permissions); // Debug line

      if (this.isEditMode && this.userId) {
        if (!userData.password) {
          delete user.password;
        }
        this.userService.updateUser(this.userId, user).subscribe({
          next: () => this.router.navigate(['/users']),
          error: (error) => {
            this.error = 'Error updating user';
            if (error.status === 403) {
              this.error = 'You do not have permission to update users';
            }
          }
        });
      } else {
        this.userService.createUser(user).subscribe({
          next: () => this.router.navigate(['/users']),
          error: (error) => {
            this.error = 'Error creating user';
            if (error.status === 403) {
              this.error = 'You do not have permission to create users';
            }
          }
        });
      }
    }
  }

  onPermissionChange(type: PermissionType, target: EventTarget | null): void {
    const input = target as HTMLInputElement;
    const permissions = this.userForm.get('permissions')?.value as PermissionType[] || [];

    if (input.checked) {
      this.userForm.patchValue({
        permissions: [...permissions, type]
      });
    } else {
      this.userForm.patchValue({
        permissions: permissions.filter(p => p !== type)
      });
    }
  }

  isPermissionSelected(type: PermissionType): boolean {
    const permissions = this.userForm.get('permissions')?.value as PermissionType[] || [];
    return permissions.includes(type);
  }

}
