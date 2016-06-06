import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { RouteConfig } from '@angular/router-deprecated';

import { RouterActive } from './shared/directives/router-active/router-active.directive';
import { DonorsComponent } from './donor/donors.component';

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
          <button md-button router-active [routerLink]=" ['Donors'] ">
            Index
          </button>
      </md-toolbar>

      <router-outlet></router-outlet>
    </md-content>
  `
})
@RouteConfig([
  {path: '/', name: 'Donors', component: DonorsComponent, useAsDefault: true}
  // {path: '/', name: 'Index', component: Home, useAsDefault: true},
  // {path: '/home', name: 'Home', component: Home},
  // {path: '/todo', component: Todo, name: 'Todo'},
  // {path: '/redux', component: Recipes, name: 'Recipes'},
  // Async load a component using Webpack's require with
  // es6-promise-loader and webpack `require`
  // {path: '/about', name: 'About', loader: () => require('es6-promise!./about')('About')}
])
export class AppComponent implements OnInit {
  name = 'Bloodify';

  constructor() {
  }

  ngOnInit() {
  }
}
