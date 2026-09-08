import { Component, Input } from '@angular/core';

/**
 * Self-contained inline-SVG stroke icons, matching the original demo's
 * svgIcon() helper. Deliberately not using Angular Material's font-ligature
 * <mat-icon>, which depends on fetching a Google Fonts icon font at runtime
 * — an external dependency this corporate intranet app shouldn't rely on
 * (may well be blocked on the corporate network anyway).
 */
const PATHS: Record<string, string> = {
  home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  groups:
    'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M12.5 3.13a4 4 0 010 7.75 M23 21v-2a4 4 0 00-3-3.87 M9 11a4 4 0 100-8 4 4 0 000 8z',
  add: 'M12 5v14M5 12h14',
  delete: 'M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z',
  'arrow-back': 'M19 12H5M12 19l-7-7 7-7',
  'person-add': 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6',
  close: 'M18 6L6 18M6 6l12 12',
};

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path [attr.d]="path" />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
      }
    `,
  ],
})
export class IconComponent {
  @Input() name = '';
  @Input() size = 18;

  get path(): string {
    return PATHS[this.name] ?? '';
  }
}
