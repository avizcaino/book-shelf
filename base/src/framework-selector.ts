/**
 * Created by alexvizcaino on 10/3/16.
 */
import {EventAggregator} from "aurelia-event-aggregator";
import {Events} from "./events";
import {FrameworkType} from './core/model/framework';
import {autoinject} from "aurelia-dependency-injection";

@autoinject
export class FrameworkSelector {
    constructor(private _ea:EventAggregator) {}

    frameworkSelected(framework:string) {
        switch (framework) {
            case FrameworkType.Polymer:
                this._ea.publish(Events.polymerChosen);
                break;
            case FrameworkType.Bootstrap:
                this._ea.publish(Events.bootstrapChosen);
                break;
        }
    }
}