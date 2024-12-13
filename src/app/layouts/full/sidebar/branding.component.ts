import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <div class="branding p-0 text-center">
      <a href="/">
      <img
          src="../../../../assets/images/img/logo.png"
          class="align-middle m-2"
          alt="logo"
        />
      </a>
    </div>
  `,
})
export class BrandingComponent {
  constructor() {}
}
