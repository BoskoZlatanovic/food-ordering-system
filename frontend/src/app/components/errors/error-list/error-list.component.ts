import {Component, OnInit} from '@angular/core';
import {ErrorService} from "../../../services/error.service";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html'
})
export class ErrorListComponent implements OnInit {
  errors: any[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  isAdmin = false;

  constructor(
    private errorService: ErrorService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.getCurrentUserEmail() === 'admin@example.com';
  }

  ngOnInit() {
    this.loadErrors();
  }

  loadErrors() {
    this.errorService.getErrors(this.currentPage, this.pageSize).subscribe(response => {
      this.errors = response.content;
      this.totalElements = response.totalElements;
      this.totalPages = response.totalPages;
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadErrors();
  }
}
