import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss',
})
export class ComingSoonComponent {
  private readonly route = inject(ActivatedRoute);

  readonly title = toSignal(
    this.route.data.pipe(map((d) => (d['title'] as string) ?? 'Coming Soon')),
    { initialValue: 'Coming Soon' },
  );
  readonly description = toSignal(
    this.route.data.pipe(map((d) => (d['description'] as string) ?? '')),
    { initialValue: '' },
  );
}
