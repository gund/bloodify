import { Component, ViewEncapsulation } from '@angular/core';
import { RouteConfig, Router } from '@angular/router-deprecated';

import { RouterActive } from './shared/directives/router-active/router-active.directive';
import { DonorsComponent } from './donor/donors.component';
import { EditDonorComponent } from './donor/edit-donor.component';

@Component({
  selector: 'app',
  providers: [],
  directives: [
    RouterActive
  ],
  encapsulation: ViewEncapsulation.None,
  pipes: [],
  // Load our main `Sass` file into our `app` `component`
  styleUrls: [require('!style!css!sass!../sass/main.scss')],
  template: `
    <md-content>
      <md-toolbar color="primary">
          <span>{{ name }}</span>
          <span class="fill"></span>
          <button *ngIf="!isIndexPage" md-button router-active [routerLink]=" ['Donors'] ">
            Map
          </button>
      </md-toolbar>

      <router-outlet></router-outlet>
    </md-content>
  `
})
@RouteConfig([
  {
    path: '/',
    name: 'Donors',
    component: DonorsComponent,
    useAsDefault: true
  },
  {
    path: '/edit/:hash',
    name: 'Edit',
    component: EditDonorComponent
  }
  // {path: '/', name: 'Index', component: Home, useAsDefault: true},
  // {path: '/home', name: 'Home', component: Home},
  // {path: '/todo', component: Todo, name: 'Todo'},
  // {path: '/redux', component: Recipes, name: 'Recipes'},
  // Async load a component using Webpack's require with
  // es6-promise-loader and webpack `require`
  // {path: '/about', name: 'About', loader: () => require('es6-promise!./about')('About')}
])
export class AppComponent {
  name = 'Bloodify';
  isIndexPage: boolean;

  constructor(protected router: Router) {
    router.subscribe(() => this.checkIndexPage());
  }

  checkIndexPage() {
    this.isIndexPage = this.router.isRouteActive(this.router.generate(['/Donors']));
  }
}
