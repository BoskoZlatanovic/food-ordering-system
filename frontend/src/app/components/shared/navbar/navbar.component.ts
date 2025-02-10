import {Component} from "@angular/core";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  getCurrentUserEmail(): string | null {
    return this.authService.getCurrentUserEmail();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
