import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
    selector: 'app-shell',
    imports: [RouterLink, RouterLinkActive, RouterOutlet, IconComponent],
    templateUrl: './shell.component.html',
    styleUrl: './shell.component.scss'
})
export class ShellComponent {
  readonly navItems = [
    { label: 'Home', icon: 'home', path: '/home' },
    { label: 'Teams', icon: 'groups', path: '/teams' },
  ];
}
