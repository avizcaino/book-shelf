#!/usr/bin/env bash
echo "Preparing project..."

cd base

echo "Installing npm packages"
npm install

echo "Installing jspm packages"
jspm install -y

echo "Installing bower packages"
bower install

echo "Importing third party libraries"
cp third-party/polymer/*.html bower_components/iron-selector/
cp third-party/system-register-only.js jspm_packages
echo "Project installation completed!"
cd ..