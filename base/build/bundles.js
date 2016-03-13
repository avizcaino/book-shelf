module.exports = {
  "bundles": {
    "dist/app-build": {
      "excludes": [
        "main.js",
        "core/cordova/push-receiver.js",
        "core/cordova/auto-update.js",
        "aurelia-binding",
        "aurelia-dependency-injection",
        "aurelia-event-aggregator",
        "aurelia-fetch-client",
        "aurelia-framework",
        "aurelia-loader",
        "aurelia-logging",
        "aurelia-metadata",
        "aurelia-pal",
        "aurelia-path",
        "aurelia-task-queue",
        "aurelia-templating"
      ],
      "includes": [
        "**/*.js",
        "**/*.html!text",
        "**/*.css!text"
      ],
      "options": {
        "inject": true,
        "minify": true
      }
    },
    "dist/aurelia": {
      "includes": [
        "aurelia-framework",
        "aurelia-bootstrapper",
        "aurelia-fetch-client",
        "aurelia-router",
        "aurelia-animator-css",
        "aurelia-templating-binding",
        "aurelia-templating-resources",
        "aurelia-templating-router",
        "aurelia-loader-default",
        "aurelia-history-browser",
        "aurelia-logging-console",
        "bootstrap",
        "bootstrap/css/bootstrap.css!text",
        "fetch",
        "jquery"
      ],
      "options": {
        "inject": true,
        "minify": false,
        "rev": false
      }
    }
  }
};
