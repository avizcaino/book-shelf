import {Router, RouterConfiguration} from 'aurelia-router'
import {EventAggregator} from "aurelia-event-aggregator";
import {autoinject} from "aurelia-dependency-injection";
import {Events} from "./events";

@autoinject
export class App {
  router: Router;
  
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'framework-selector'], name: 'framework-selector', moduleId: 'framework-selector', nav: true, title: 'Framework Selector' },
      { route: 'bootstrap', name: 'bootstrap', moduleId: './bootstrap-app/app', nav: true, title: 'Bootstrap' },
      { route: 'polymer', name: 'polymer', moduleId: './polymer-app/app', nav: true, title: 'Polymer' }
      //{ route: 'users',         name: 'users',        moduleId: 'users',        nav: true, title: 'Github Users' },
      //{ route: 'child-router',  name: 'child-router', moduleId: 'child-router', nav: true, title: 'Child Router' }
    ]);

    this.router = router;
  }

  constructor(private _ea: EventAggregator){
    this._ea.subscribe(Events.bootstrapChosen, () => {
      this.router.navigate('bootstrap');
    });
    this._ea.subscribe(Events.polymerChosen, () => {
      this.router.navigate('polymer');
    });
  }
}
