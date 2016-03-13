System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "es7.decorators",
      "es7.classProperties",
      "runtime"
    ]
  },
  paths: {
    "*": "dist/*",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  map: {
    "aurelia-animator-css": "npm:aurelia-animator-css@1.0.0-beta.1.1.2",
    "aurelia-bootstrapper": "npm:aurelia-bootstrapper@1.0.0-beta.1.1.4",
    "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.1.4",
    "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.1.1.1",
    "aurelia-fetch-client": "npm:aurelia-fetch-client@1.0.0-beta.1.1.1",
    "aurelia-framework": "npm:aurelia-framework@1.0.0-beta.1.1.4",
    "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0-beta.1.1.4",
    "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0-beta.1.1.3",
    "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.2",
    "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0-beta.1.1.4",
    "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
    "aurelia-pal-browser": "npm:aurelia-pal-browser@1.0.0-beta.1.1.4",
    "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.1",
    "aurelia-polyfills": "npm:aurelia-polyfills@1.0.0-beta.1.0.0",
    "aurelia-router": "npm:aurelia-router@1.0.0-beta.1.1.2",
    "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0-beta.1.1.2",
    "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0-beta.1.1.2",
    "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0-beta.1.1.2",
    "bootstrap": "github:twbs/bootstrap@3.3.6",
    "core-js": "npm:core-js@2.1.3",
    "fetch": "github:github/fetch@0.10.1",
    "font-awesome": "npm:font-awesome@4.5.0",
    "jquery": "github:components/jquery@2.2.1",
    "text": "github:systemjs/plugin-text@0.0.3",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:twbs/bootstrap@3.3.6": {
      "jquery": "github:components/jquery@2.2.1"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:aurelia-animator-css@1.0.0-beta.1.1.2": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.5",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.1.2"
    },
    "npm:aurelia-binding@1.0.0-beta.1.2.1": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.5",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-bootstrapper@1.0.0-beta.1.1.4": {
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.1.1.1",
      "aurelia-framework": "npm:aurelia-framework@1.0.0-beta.1.1.4",
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.1.1.1",
      "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0-beta.1.1.4",
      "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0-beta.1.1.3",
      "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0-beta.1.1.4",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "aurelia-pal-browser": "npm:aurelia-pal-browser@1.0.0-beta.1.1.4",
      "aurelia-polyfills": "npm:aurelia-polyfills@1.0.0-beta.1.0.0",
      "aurelia-router": "npm:aurelia-router@1.0.0-beta.1.1.2",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.1.2",
      "aurelia-templating-binding": "npm:aurelia-templating-binding@1.0.0-beta.1.1.2",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.0.0-beta.1.1.2",
      "aurelia-templating-router": "npm:aurelia-templating-router@1.0.0-beta.1.1.2"
    },
    "npm:aurelia-dependency-injection@1.0.0-beta.1.1.4": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.2",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.5",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-event-aggregator@1.0.0-beta.1.1.1": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.2"
    },
    "npm:aurelia-framework@1.0.0-beta.1.1.4": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.2.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.1.4",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.1.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.2",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.5",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.1.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.1.2"
    },
    "npm:aurelia-history-browser@1.0.0-beta.1.1.4": {
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.1.1.1",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-loader-default@1.0.0-beta.1.1.3": {
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.1.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.5",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-loader@1.0.0-beta.1.1.1": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.5",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-logging-console@1.0.0-beta.1.1.4": {
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.2",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-metadata@1.0.0-beta.1.1.5": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-pal-browser@1.0.0-beta.1.1.4": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-polyfills@1.0.0-beta.1.0.0": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-route-recognizer@1.0.0-beta.1.1.2": {
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-router@1.0.0-beta.1.1.2": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.1.4",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.0-beta.1.1.1",
      "aurelia-history": "npm:aurelia-history@1.0.0-beta.1.1.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.2",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.1",
      "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.0.0-beta.1.1.2"
    },
    "npm:aurelia-task-queue@1.0.0-beta.1.1.1": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1"
    },
    "npm:aurelia-templating-binding@1.0.0-beta.1.1.2": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.2.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.2",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.1.2"
    },
    "npm:aurelia-templating-resources@1.0.0-beta.1.1.2": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.2.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.1.4",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.1.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.2",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.1.1",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.1.2"
    },
    "npm:aurelia-templating-router@1.0.0-beta.1.1.2": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.1.4",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.2",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.5",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.1",
      "aurelia-router": "npm:aurelia-router@1.0.0-beta.1.1.2",
      "aurelia-templating": "npm:aurelia-templating@1.0.0-beta.1.1.2"
    },
    "npm:aurelia-templating@1.0.0-beta.1.1.2": {
      "aurelia-binding": "npm:aurelia-binding@1.0.0-beta.1.2.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.0.0-beta.1.1.4",
      "aurelia-loader": "npm:aurelia-loader@1.0.0-beta.1.1.1",
      "aurelia-logging": "npm:aurelia-logging@1.0.0-beta.1.1.2",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.0-beta.1.1.5",
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.1.1",
      "aurelia-path": "npm:aurelia-path@1.0.0-beta.1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.0.0-beta.1.1.1"
    },
    "npm:core-js@2.1.3": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:font-awesome@4.5.0": {
      "css": "github:systemjs/plugin-css@0.1.20"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  },
  bundles: {
    "app-build.js": [
      "app.html!github:systemjs/plugin-text@0.0.3.js",
      "app.js",
      "bootstrap-app/app.html!github:systemjs/plugin-text@0.0.3.js",
      "bootstrap-app/app.js",
      "bootstrap-app/blur-image.js",
      "bootstrap-app/child-router.html!github:systemjs/plugin-text@0.0.3.js",
      "bootstrap-app/child-router.js",
      "bootstrap-app/nav-bar.html!github:systemjs/plugin-text@0.0.3.js",
      "bootstrap-app/users.html!github:systemjs/plugin-text@0.0.3.js",
      "bootstrap-app/users.js",
      "bootstrap-app/welcome.html!github:systemjs/plugin-text@0.0.3.js",
      "bootstrap-app/welcome.js",
      "core/model/framework.js",
      "elements.html!github:systemjs/plugin-text@0.0.3.js",
      "events.js",
      "framework-selector.html!github:systemjs/plugin-text@0.0.3.js",
      "framework-selector.js",
      "github:github/fetch@0.10.1.js",
      "github:github/fetch@0.10.1/fetch.js",
      "polymer-app/app.html!github:systemjs/plugin-text@0.0.3.js",
      "polymer-app/app.js",
      "polymer-app/blur-image.js",
      "polymer-app/child-router.html!github:systemjs/plugin-text@0.0.3.js",
      "polymer-app/child-router.js",
      "polymer-app/nav-bar.html!github:systemjs/plugin-text@0.0.3.js",
      "polymer-app/users.html!github:systemjs/plugin-text@0.0.3.js",
      "polymer-app/users.js",
      "polymer-app/welcome.html!github:systemjs/plugin-text@0.0.3.js",
      "polymer-app/welcome.js"
    ],
    "aurelia.js": [
      "github:components/jquery@2.2.1.js",
      "github:components/jquery@2.2.1/jquery.js",
      "github:github/fetch@0.10.1.js",
      "github:github/fetch@0.10.1/fetch.js",
      "github:twbs/bootstrap@3.3.6.js",
      "github:twbs/bootstrap@3.3.6/css/bootstrap.css!github:systemjs/plugin-text@0.0.3.js",
      "github:twbs/bootstrap@3.3.6/js/bootstrap.js",
      "npm:aurelia-animator-css@1.0.0-beta.1.1.2.js",
      "npm:aurelia-animator-css@1.0.0-beta.1.1.2/aurelia-animator-css.js",
      "npm:aurelia-binding@1.0.0-beta.1.2.1.js",
      "npm:aurelia-binding@1.0.0-beta.1.2.1/aurelia-binding.js",
      "npm:aurelia-bootstrapper@1.0.0-beta.1.1.4.js",
      "npm:aurelia-bootstrapper@1.0.0-beta.1.1.4/aurelia-bootstrapper.js",
      "npm:aurelia-dependency-injection@1.0.0-beta.1.1.4.js",
      "npm:aurelia-dependency-injection@1.0.0-beta.1.1.4/aurelia-dependency-injection.js",
      "npm:aurelia-event-aggregator@1.0.0-beta.1.1.1.js",
      "npm:aurelia-event-aggregator@1.0.0-beta.1.1.1/aurelia-event-aggregator.js",
      "npm:aurelia-fetch-client@1.0.0-beta.1.1.1.js",
      "npm:aurelia-fetch-client@1.0.0-beta.1.1.1/aurelia-fetch-client.js",
      "npm:aurelia-framework@1.0.0-beta.1.1.4.js",
      "npm:aurelia-framework@1.0.0-beta.1.1.4/aurelia-framework.js",
      "npm:aurelia-history-browser@1.0.0-beta.1.1.4.js",
      "npm:aurelia-history-browser@1.0.0-beta.1.1.4/aurelia-history-browser.js",
      "npm:aurelia-history@1.0.0-beta.1.1.1.js",
      "npm:aurelia-history@1.0.0-beta.1.1.1/aurelia-history.js",
      "npm:aurelia-loader-default@1.0.0-beta.1.1.3.js",
      "npm:aurelia-loader-default@1.0.0-beta.1.1.3/aurelia-loader-default.js",
      "npm:aurelia-loader@1.0.0-beta.1.1.1.js",
      "npm:aurelia-loader@1.0.0-beta.1.1.1/aurelia-loader.js",
      "npm:aurelia-logging-console@1.0.0-beta.1.1.4.js",
      "npm:aurelia-logging-console@1.0.0-beta.1.1.4/aurelia-logging-console.js",
      "npm:aurelia-logging@1.0.0-beta.1.1.2.js",
      "npm:aurelia-logging@1.0.0-beta.1.1.2/aurelia-logging.js",
      "npm:aurelia-metadata@1.0.0-beta.1.1.5.js",
      "npm:aurelia-metadata@1.0.0-beta.1.1.5/aurelia-metadata.js",
      "npm:aurelia-pal-browser@1.0.0-beta.1.1.4.js",
      "npm:aurelia-pal-browser@1.0.0-beta.1.1.4/aurelia-pal-browser.js",
      "npm:aurelia-pal@1.0.0-beta.1.1.1.js",
      "npm:aurelia-pal@1.0.0-beta.1.1.1/aurelia-pal.js",
      "npm:aurelia-path@1.0.0-beta.1.1.1.js",
      "npm:aurelia-path@1.0.0-beta.1.1.1/aurelia-path.js",
      "npm:aurelia-polyfills@1.0.0-beta.1.0.0.js",
      "npm:aurelia-polyfills@1.0.0-beta.1.0.0/aurelia-polyfills.js",
      "npm:aurelia-route-recognizer@1.0.0-beta.1.1.2.js",
      "npm:aurelia-route-recognizer@1.0.0-beta.1.1.2/aurelia-route-recognizer.js",
      "npm:aurelia-router@1.0.0-beta.1.1.2.js",
      "npm:aurelia-router@1.0.0-beta.1.1.2/aurelia-router.js",
      "npm:aurelia-task-queue@1.0.0-beta.1.1.1.js",
      "npm:aurelia-task-queue@1.0.0-beta.1.1.1/aurelia-task-queue.js",
      "npm:aurelia-templating-binding@1.0.0-beta.1.1.2.js",
      "npm:aurelia-templating-binding@1.0.0-beta.1.1.2/aurelia-templating-binding.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/analyze-view-factory.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/array-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/aurelia-templating-resources.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/binding-mode-behaviors.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/binding-signaler.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/compile-spy.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/compose.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/css-resource.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/debounce-binding-behavior.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/dynamic-element.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/focus.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/hide.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/html-sanitizer.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/if.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/map-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/null-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/number-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/repeat-strategy-locator.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/repeat-utilities.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/repeat.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/replaceable.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/sanitize-html.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/set-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/show.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/signal-binding-behavior.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/throttle-binding-behavior.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/update-trigger-binding-behavior.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/view-spy.js",
      "npm:aurelia-templating-resources@1.0.0-beta.1.1.2/with.js",
      "npm:aurelia-templating-router@1.0.0-beta.1.1.2.js",
      "npm:aurelia-templating-router@1.0.0-beta.1.1.2/aurelia-templating-router.js",
      "npm:aurelia-templating-router@1.0.0-beta.1.1.2/route-href.js",
      "npm:aurelia-templating-router@1.0.0-beta.1.1.2/route-loader.js",
      "npm:aurelia-templating-router@1.0.0-beta.1.1.2/router-view.js",
      "npm:aurelia-templating@1.0.0-beta.1.1.2.js",
      "npm:aurelia-templating@1.0.0-beta.1.1.2/aurelia-templating.js"
    ]
  }
});