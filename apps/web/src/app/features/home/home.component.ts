import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [RouterLink],
    template: `
    <div class="welcome">
      <h1>Welcome to MES Operations Suite</h1>
      <p>
        This is the first vertical slice of the rebuild — Teams is wired
        end-to-end to the NestJS API. Remaining modules (Portals, ITSM,
        Calendar, KB, etc.) will be added the same way, one at a time.
      </p>
      <a class="btn btn-primary" routerLink="/teams">Go to Teams</a>
    </div>
  `,
    styles: [
        `
      .welcome {
        text-align: center;
        padding: 60px 0 24px;
      }
      h1 {
        font-size: 26px;
        font-weight: 700;
        color: var(--text-h);
        margin-bottom: 10px;
      }
      p {
        font-size: 14px;
        color: var(--text-m);
        max-width: 520px;
        margin: 0 auto 22px;
        line-height: 1.6;
      }
    `,
    ]
})
export class HomeComponent {}
