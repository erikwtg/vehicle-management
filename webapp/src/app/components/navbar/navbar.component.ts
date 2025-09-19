import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  userProfile: WritableSignal<{
    name: string;
    email: string;
    avatar: string;
  }> = signal({
    name: 'Admin',
    email: 'admin@empresa.com',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  });

  isProfileMenuOpen: WritableSignal<boolean> = signal(false);

  toggleProfileMenu() {
    this.isProfileMenuOpen.set(!this.isProfileMenuOpen());
  }

  closeProfileMenu() {
    this.isProfileMenuOpen.set(false);
  }
}
