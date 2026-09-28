import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { ToastService } from '../../shared/toast/toast.service';

interface HomeTile {
  path?: string;
  action?: 'ops360-toast';
  iconClass: string;
  iconColor: string;
  icon: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly tiles: HomeTile[] = [
    {
      path: '/dashboards',
      iconClass: 'ic-blue',
      iconColor: '#2196f3',
      icon: 'dashboard',
      title: 'Dashboards',
      desc: 'SLA, Monthly Overview, Production Monitor',
    },
    {
      path: '/portals',
      iconClass: 'ic-green',
      iconColor: '#43a047',
      icon: 'portals',
      title: 'MES Portals',
      desc: 'Access Prod, QA & Dev Environments',
    },
    {
      path: '/oncall',
      iconClass: 'ic-red',
      iconColor: '#e53935',
      icon: 'oncall',
      title: 'On Call Support',
      desc: '24/7 Platinum Support Team',
    },
    {
      action: 'ops360-toast',
      iconClass: 'ic-purple',
      iconColor: '#8e5fcc',
      icon: 'ops360',
      title: 'OPS360',
      desc: 'AI Ops Assistant',
    },
    {
      path: '/calendar',
      iconClass: 'ic-orange',
      iconColor: '#f57c00',
      icon: 'calendar',
      title: 'Calendar',
      desc: 'Announcements & Maintenance Schedule',
    },
    {
      path: '/itsm',
      iconClass: 'ic-teal',
      iconColor: '#00897b',
      icon: 'itsm',
      title: 'ITSM',
      desc: 'Incident Management System',
    },
  ];

  onTileClick(tile: HomeTile): void {
    if (tile.action === 'ops360-toast') {
      this.toast.show(
        'OPS360 coming soon',
        'The MES OPS360 Assistant is not yet configured.',
        'info',
      );
      return;
    }
    if (tile.path) {
      this.router.navigateByUrl(tile.path);
    }
  }

  quickLaunch(): void {
    this.toast.show('Quick Launch', 'Tutorial video coming soon.', 'info');
  }
}
