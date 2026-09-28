import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type ToastKind = 'success' | 'error' | 'info' | 'warning';

/**
 * Thin wrapper over MatSnackBar matching the original demo's toast(title,
 * msg, type) helper, so every feature can raise a consistent notification
 * without importing MatSnackBar directly everywhere.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  show(title: string, message = '', kind: ToastKind = 'info'): void {
    const text = message ? `${title} — ${message}` : title;
    this.snackBar.open(text, 'Dismiss', {
      duration: 4000,
      panelClass: [`toast-${kind}`],
    });
  }
}
