#Installation
Execute install.bat (Windows) or install.sh (Unix/OSX) to prepare the project.

**Note:** During the installation you will be asked for a polymer version, choose the latest one.

#Run application on browser
- Access `base` folder or open *gulp task manager*.
- Run `gulp watch` for a simple run of the application and monitor changes in real-time.
- Run `gulp serve-bundle` to run application in bundled mode.

#Cordova application
To run the cordova application you must have the latest [Cordova](https://cordova.apache.org) version. To install follow the steps in https://cordova.apache.org/docs/en/4.0.0/guide/cli/.

##Prepare environments
Run (from root directory) `cordova create apk [apk-packageid] [apk-name]` to generate the skeleton of the application.
Install required platforms with `cordova platform add XXX` in apk directory, where `XXX` corresponds to device os (android|ios|windows).

##Run/Emulate cordova application
- Access `base` folder or open *gulp task manager*.
- To run the application in a physical device, connect the device to your machine via USB and run `gulp cordova-run --platform: XXX`, where `XXX` corresponds to device os (android|ios|windows).
- To emulate the application run `gulp cordova-emulate  --platform: XXX`, where `XXX` corresponds to device os (android|ios|windows).
**Note:** To emulate the application you must have the proper emulator/virtual-machine configured.