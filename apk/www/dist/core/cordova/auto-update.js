"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var Autoupdater = (function () {
    function Autoupdater(_fileTransfer, _fileSystem, _networkInformation, _rootDirectory, _serverUrl) {
        this._fileTransfer = _fileTransfer;
        this._fileSystem = _fileSystem;
        this._networkInformation = _networkInformation;
        this._rootDirectory = _rootDirectory;
        this._serverUrl = _serverUrl;
    }
    Autoupdater.prototype.autoupdate = function (localStorageDirectory, localManifestPath, remoteManifestPath) {
        return __awaiter(this, void 0, Promise, function* () {
            var result = yield this.copyManifestToLocalStorage(this._rootDirectory, localStorageDirectory, localManifestPath);
            if (result) {
                result = yield this.checkNewVersion(localManifestPath, remoteManifestPath);
                if (result) {
                    try {
                        result = yield this.doBackup(localStorageDirectory);
                        if (result) {
                            result = yield this.updateFiles(this._serverUrl, localStorageDirectory);
                            if (result)
                                return Promise.resolve();
                            else {
                                result = yield this.restoreBackup(localStorageDirectory + '-backup');
                                if (result)
                                    return Promise.resolve();
                            }
                        }
                    }
                    catch (e) {
                        try {
                            yield this.restoreBackup(this._rootDirectory + '-backup');
                        }
                        catch (e) {
                            return Promise.reject(null);
                        }
                    }
                }
                else {
                    return Promise.resolve();
                }
            }
            return Promise.reject(null);
        });
    };
    Autoupdater.prototype.copyManifestToLocalStorage = function (rootDirectory, localStorageDirectory, localManifestPath) {
        return __awaiter(this, void 0, Promise, function* () {
            var localManifestContent = yield this._fileSystem.openFile(localManifestPath);
            var localManifest = JSON.parse(localManifestContent);
            var files = [];
            for (var file in localManifest.files) {
                files.push(localManifest.files[file]);
            }
            ;
            var result;
            for (var i = 0; i < files.length; i++) {
                result = yield this._fileSystem.downloadFile(rootDirectory + '/' + files[i].filename, localStorageDirectory + '/' + files[i].filename);
                if (!result)
                    return result;
            }
            result = yield this._fileSystem.downloadFile(rootDirectory + '/manifest.json', localStorageDirectory + '/manifest.json');
            return result;
        });
    };
    Autoupdater.prototype.doBackup = function (path) {
        return __awaiter(this, void 0, Promise, function* () {
            var result = yield this._fileSystem.copyDirectory(path, path + '-backup');
            return result;
        });
    };
    Autoupdater.prototype.restoreBackup = function (backupPath) {
        return __awaiter(this, void 0, Promise, function* () {
            var result = yield this._fileSystem.copyDirectory(backupPath, backupPath.substr(0, backupPath.indexOf('-')));
            return result;
        });
    };
    Autoupdater.prototype.checkNewVersion = function (localPath, remotePath) {
        return __awaiter(this, void 0, Promise, function* () {
            if (!this._networkInformation.isConnected)
                return false;
            else {
                try {
                    var remoteManifestContent = yield this._fileSystem.openFile(remotePath);
                    this.remoteManifest = JSON.parse(remoteManifestContent);
                    var localManifestContent = yield this._fileSystem.openFile(localPath);
                    this.localManifest = JSON.parse(localManifestContent);
                    return this.remoteManifest.version !== this.localManifest.version;
                }
                catch (e) {
                    return false;
                }
            }
        });
    };
    Autoupdater.prototype.updateFiles = function (server, localStoragePath) {
        return __awaiter(this, void 0, Promise, function* () {
            var localFiles = [];
            var remoteFiles = [];
            var result;
            for (var file in this.localManifest.files) {
                localFiles.push(this.localManifest.files[file]);
            }
            for (var file in this.remoteManifest.files) {
                remoteFiles.push(this.remoteManifest.files[file]);
            }
            var filesToRemove = localFiles.filter(function (lf) {
                var founds = remoteFiles.filter(function (rf) {
                    return rf.filename == lf.filename;
                });
                return founds.length == 0;
            });
            for (var i = 0; i < filesToRemove.length; i++) {
                result = yield this._fileSystem.removeFile(localStoragePath + '/' + filesToRemove[i].filename);
                if (!result)
                    return result;
            }
            var filesToUpdate = remoteFiles.filter(function (rf) {
                var founds = localFiles.filter(function (lf) {
                    return rf.filename == lf.filename && rf.version != lf.version;
                });
                return founds.length > 0;
            });
            for (var i = 0; i < filesToUpdate.length; i++) {
                result = yield this._fileTransfer.download(server + filesToUpdate[i].filename, localStoragePath + '/' + filesToUpdate[i].filename);
                if (!result)
                    return result;
            }
            var filesToAdd = remoteFiles.filter(function (rf) {
                var founds = localFiles.filter(function (lf) {
                    return rf.filename == lf.filename;
                });
                return founds.length == 0;
            });
            for (var i = 0; i < filesToAdd.length; i++) {
                result = yield this._fileTransfer.download(server + filesToAdd[i].filename, localStoragePath + '/' + filesToAdd[i].filename);
                if (!result)
                    return result;
            }
            return true;
        });
    };
    return Autoupdater;
}());
var FileSystemService = (function () {
    function FileSystemService() {
        this.xhr = new XMLHttpRequest();
        this._fs = new FileSystemImpl();
        this._ft = new FileTransferService();
    }
    FileSystemService.prototype.openFile = function (path) {
        var _this = this;
        this.xhr.open('GET', path);
        this.xhr.send();
        return new Promise(function (resolve, reject) {
            _this.xhr.onerror = function (ev) {
                reject('Error getting file from ' + path);
            };
            _this.xhr.onload = function (ev) {
                if (_this.xhr.status < 200 || _this.xhr.status >= 300) {
                    reject(_this.xhr.responseText);
                }
                resolve(_this.xhr.response);
            };
        });
    };
    FileSystemService.prototype.removeFile = function (path) {
        return __awaiter(this, void 0, Promise, function* () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this._fs.getFile(path, { create: false, exclusive: false })
                    .then(function (fileEntry) {
                    fileEntry.remove(function () {
                        resolve(true);
                    }, function (e) {
                        resolve(false);
                    });
                })
                    .catch(function (e) {
                    resolve(false);
                });
            });
        });
    };
    FileSystemService.prototype.downloadFile = function (origPath, destPath) {
        return __awaiter(this, void 0, Promise, function* () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this._ft.download(origPath, destPath)
                    .then(function (r) {
                    resolve(r);
                })
                    .catch(function (e) {
                    resolve(false);
                });
            });
        });
    };
    FileSystemService.prototype.copyFile = function (directory, entry) {
        return new Promise(function (resolve, reject) {
            entry.copyTo(directory, entry.name, function (entry) {
                resolve(true);
            }, function (error) {
                resolve(false);
            });
        });
    };
    FileSystemService.prototype.copyDirectory = function (origPath, destPath) {
        return __awaiter(this, void 0, Promise, function* () {
            var entries = yield this._fs.getDirectoryEntries(origPath, { create: false, exclusive: false });
            var destDirectory = yield this._fs.getDirectory(destPath, { create: true, exclusive: false });
            if (entries && destDirectory) {
                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    if (entry.isDirectory) {
                        var result = yield this.copyDirectory(origPath + '/' + entry.name, destPath + '/' + entry.name);
                        if (!result)
                            return false;
                    }
                    else {
                        var result = yield this.copyFile(destDirectory, entry);
                        if (!result)
                            return false;
                    }
                }
                return true;
            }
            else {
                return false;
            }
        });
    };
    return FileSystemService;
}());
var FileTransferService = (function () {
    function FileTransferService() {
        this._transfer = new FileTransferImpl();
    }
    FileTransferService.prototype.download = function (src, target, trustAllHosts, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._transfer.download(src, target)
                .then(function () {
                resolve(true);
            })
                .catch(function (e) {
                resolve(false);
            });
        });
    };
    FileTransferService.prototype.fail = function (e) {
        console.log(e);
        return false;
    };
    return FileTransferService;
}());
var FileTransferImpl = (function () {
    function FileTransferImpl() {
        this._fs = new FileSystemImpl();
    }
    FileTransferImpl.prototype.download = function (source, target, headers) {
        var w = window;
        var transfer = new w.FileTransfer();
        return this._fs.getFile(target, { create: true, exclusive: false }).then(function (file) {
            return new Promise(function (resolve, reject) {
                transfer.download(source, file.nativeURL, function (s) {
                    resolve(void (0));
                }, function (e) {
                    file.remove(function () { }, function () { });
                    reject(e);
                }, true, headers);
            }).then(function () {
                return void (0);
            });
        }).then(function () {
            return void (0);
        });
    };
    return FileTransferImpl;
}());
var FileSystemImpl = (function () {
    function FileSystemImpl() {
    }
    FileSystemImpl.prototype.getDirectory = function (path, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                _this.getPath([path], fileSystem.root, options).then(function (directory) {
                    resolve(directory);
                })
                    .catch(function (error) {
                    resolve(null);
                });
            });
        });
    };
    FileSystemImpl.prototype.getDirectoryEntries = function (path, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                _this.getPath([path], fileSystem.root, options).then(function (directory) {
                    var reader = directory.createReader();
                    reader.readEntries(function (entries) {
                        resolve(entries);
                    }, function (error) {
                        resolve(null);
                    });
                })
                    .catch(function (error) {
                    resolve(null);
                });
            });
        });
    };
    FileSystemImpl.prototype.getFile = function (path, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                var folders = path.split('/');
                var fileName = folders[folders.length - 1];
                folders = folders.slice(0, folders.length - 1);
                _this.getPath(folders, fileSystem.root, options).then(function (directory) {
                    directory.getFile(fileName, options, function (file) {
                        resolve(file);
                    }, function (e) {
                        if (options.create)
                            reject(e);
                        else {
                            resolve(null);
                        }
                    });
                }, function (e) {
                    reject(e);
                });
            });
        });
    };
    FileSystemImpl.prototype.getPath = function (folders, parent, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getSubDirectory(folders, parent, options, 0, resolve, reject);
        });
    };
    FileSystemImpl.prototype.getSubDirectory = function (folders, parentDirectory, options, index, resolve, reject) {
        var _this = this;
        if (folders.length > index) {
            parentDirectory.getDirectory(folders[index], options, function (directory) {
                index++;
                _this.getSubDirectory(folders, directory, options, index, resolve, reject);
            }, function (error) {
                reject(error);
            });
        }
        else {
            resolve(parentDirectory);
        }
    };
    return FileSystemImpl;
}());
var NetworkInformationService = (function () {
    function NetworkInformationService() {
    }
    Object.defineProperty(NetworkInformationService.prototype, "isConnected", {
        get: function () {
            var connection = navigator.connection;
            return connection.type != "NONE" && connection.type != "none";
        },
        enumerable: true,
        configurable: true
    });
    return NetworkInformationService;
}());
document.addEventListener('deviceready', function () {
    var fs = new FileSystemService();
    var ft = new FileTransferService();
    var ni = new NetworkInformationService();
    var params = document.querySelector('script[manifest]');
    if (params) {
        var autoupdater = new Autoupdater(ft, fs, ni, cordova.file.applicationDirectory + 'www', params.getAttribute('server'));
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            var nativeURL = fileSystem.root.nativeURL;
            window.nativeURL = nativeURL;
            autoupdater.autoupdate('mys', params.getAttribute('manifest'), params.getAttribute('server') + 'manifest.json')
                .then(function () {
                console.log('Load updated APK');
                window.location = nativeURL + 'mys/mys.html';
            })
                .catch(function () {
                console.log('Load local APK');
                window.location = './mys.html';
            });
        }, function (e) {
            console.log(e);
        });
    }
}, false);
//# sourceMappingURL=auto-update.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS9jb3Jkb3ZhL2F1dG8tdXBkYXRlLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlcyI6WyJjb3JlL2NvcmRvdmEvYXV0by11cGRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBS0E7SUFDSSxxQkFBb0IsYUFBNEIsRUFBVSxXQUF3QixFQUFVLG1CQUF1QyxFQUMvRyxjQUFzQixFQUFVLFVBQWtCO1FBRGxELGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFBVSx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQW9CO1FBQy9HLG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBUTtJQUN0RSxDQUFDO0lBRVksZ0NBQVUsR0FBdkIsVUFBd0IscUJBQTZCLEVBQUUsaUJBQXlCLEVBQUUsa0JBQTBCOztZQUN4RyxJQUFJLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLHFCQUFxQixFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFDbEgsRUFBRSxDQUFBLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQztnQkFDUCxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQzNFLEVBQUUsQ0FBQSxDQUFDLE1BQU0sQ0FBQyxDQUFBLENBQUM7b0JBQ1AsSUFBRyxDQUFDO3dCQUNBLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQzt3QkFDcEQsRUFBRSxDQUFBLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQzs0QkFDUCxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUscUJBQXFCLENBQUMsQ0FBQzs0QkFDeEUsRUFBRSxDQUFBLENBQUMsTUFBTSxDQUFDO2dDQUNO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ZUFBZSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsVUFBQyxVQUFVO1lBQ3RFLElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ3BDLE1BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQ3BDLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxlQUFlLENBQUM7aUJBQzFHLElBQUksQ0FBQztnQkFDRixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQzFCLE1BQU8sQ0FBQyxRQUFRLEdBQUcsU0FBUyxHQUFHLGNBQWMsQ0FBQztZQUN4RCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDO2dCQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDeEIsTUFBTyxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUM7WUFDMUMsQ0FBQyxDQUFDLENBQUE7UUFDVixDQUFDLEVBQUUsVUFBQyxDQUFDO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7QUFDTCxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgYWxleHZpemNhaW5vIG9uIDExLzMvMTYuXG4gKi9cbmltcG9ydCB7SUZpbGVUcmFuc2ZlciwgSUZpbGVTeXN0ZW0sIFRyYWNrZWRGaWxlLCBNYW5pZmVzdCwgTmV0d29ya0luZm9ybWF0aW9uLCBGaWxlRW50cnksIEZpbGVTeXN0ZW0sIERpcmVjdG9yeUVudHJ5LCBFbnRyeX0gZnJvbSBcImF1dG8tdXBkYXRlclwiO1xuXG5jbGFzcyBBdXRvdXBkYXRlcntcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9maWxlVHJhbnNmZXI6IElGaWxlVHJhbnNmZXIsIHByaXZhdGUgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBwcml2YXRlIF9uZXR3b3JrSW5mb3JtYXRpb246IE5ldHdvcmtJbmZvcm1hdGlvbixcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9yb290RGlyZWN0b3J5OiBzdHJpbmcsIHByaXZhdGUgX3NlcnZlclVybDogc3RyaW5nKXtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgYXV0b3VwZGF0ZShsb2NhbFN0b3JhZ2VEaXJlY3Rvcnk6IHN0cmluZywgbG9jYWxNYW5pZmVzdFBhdGg6IHN0cmluZywgcmVtb3RlTWFuaWZlc3RQYXRoOiBzdHJpbmcpOlByb21pc2U8dm9pZD57XG4gICAgICAgIHZhciByZXN1bHQgPSBhd2FpdCB0aGlzLmNvcHlNYW5pZmVzdFRvTG9jYWxTdG9yYWdlKHRoaXMuX3Jvb3REaXJlY3RvcnksIGxvY2FsU3RvcmFnZURpcmVjdG9yeSwgbG9jYWxNYW5pZmVzdFBhdGgpO1xuICAgICAgICBpZihyZXN1bHQpe1xuICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgdGhpcy5jaGVja05ld1ZlcnNpb24obG9jYWxNYW5pZmVzdFBhdGgsIHJlbW90ZU1hbmlmZXN0UGF0aCk7XG4gICAgICAgICAgICBpZihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgdGhpcy5kb0JhY2t1cChsb2NhbFN0b3JhZ2VEaXJlY3RvcnkpO1xuICAgICAgICAgICAgICAgICAgICBpZihyZXN1bHQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgdGhpcy51cGRhdGVGaWxlcyh0aGlzLl9zZXJ2ZXJVcmwsIGxvY2FsU3RvcmFnZURpcmVjdG9yeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBhd2FpdCB0aGlzLnJlc3RvcmVCYWNrdXAobG9jYWxTdG9yYWdlRGlyZWN0b3J5ICsgJy1iYWNrdXAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihyZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZXN0b3JlQmFja3VwKHRoaXMuX3Jvb3REaXJlY3RvcnkgKyAnLWJhY2t1cCcpO1xuICAgICAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvcHlNYW5pZmVzdFRvTG9jYWxTdG9yYWdlKHJvb3REaXJlY3Rvcnk6IHN0cmluZywgbG9jYWxTdG9yYWdlRGlyZWN0b3J5OiBzdHJpbmcsIGxvY2FsTWFuaWZlc3RQYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgICAgICBsZXQgbG9jYWxNYW5pZmVzdENvbnRlbnQgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLm9wZW5GaWxlKGxvY2FsTWFuaWZlc3RQYXRoKTtcbiAgICAgICAgbGV0IGxvY2FsTWFuaWZlc3QgPSA8TWFuaWZlc3Q+SlNPTi5wYXJzZShsb2NhbE1hbmlmZXN0Q29udGVudCk7XG4gICAgICAgIGxldCBmaWxlczogVHJhY2tlZEZpbGVbXSA9IFtdO1xuXG4gICAgICAgIGZvcihsZXQgZmlsZSBpbiBsb2NhbE1hbmlmZXN0LmZpbGVzKXtcbiAgICAgICAgICAgIGZpbGVzLnB1c2gobG9jYWxNYW5pZmVzdC5maWxlc1tmaWxlXSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZG93bmxvYWRGaWxlKHJvb3REaXJlY3RvcnkgKyAnLycgKyBmaWxlc1tpXS5maWxlbmFtZSwgbG9jYWxTdG9yYWdlRGlyZWN0b3J5ICsgJy8nICsgZmlsZXNbaV0uZmlsZW5hbWUpO1xuICAgICAgICAgICAgaWYoIXJlc3VsdClcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5kb3dubG9hZEZpbGUocm9vdERpcmVjdG9yeSArICcvbWFuaWZlc3QuanNvbicsIGxvY2FsU3RvcmFnZURpcmVjdG9yeSArICcvbWFuaWZlc3QuanNvbicpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBkb0JhY2t1cChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5jb3B5RGlyZWN0b3J5KHBhdGgsIHBhdGggKyAnLWJhY2t1cCcpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyByZXN0b3JlQmFja3VwKGJhY2t1cFBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj57XG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmNvcHlEaXJlY3RvcnkoYmFja3VwUGF0aCwgYmFja3VwUGF0aC5zdWJzdHIoMCwgYmFja3VwUGF0aC5pbmRleE9mKCctJykpKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3RlTWFuaWZlc3Q6IE1hbmlmZXN0O1xuICAgIHB1YmxpYyBsb2NhbE1hbmlmZXN0OiBNYW5pZmVzdDtcblxuICAgIHB1YmxpYyBhc3luYyBjaGVja05ld1ZlcnNpb24obG9jYWxQYXRoOiBzdHJpbmcsIHJlbW90ZVBhdGg6IHN0cmluZyk6UHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIGlmKCF0aGlzLl9uZXR3b3JrSW5mb3JtYXRpb24uaXNDb25uZWN0ZWQpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgbGV0IHJlbW90ZU1hbmlmZXN0Q29udGVudCA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0ub3BlbkZpbGUocmVtb3RlUGF0aCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdGVNYW5pZmVzdCA9IDxNYW5pZmVzdD5KU09OLnBhcnNlKHJlbW90ZU1hbmlmZXN0Q29udGVudCk7XG4gICAgICAgICAgICAgICAgbGV0IGxvY2FsTWFuaWZlc3RDb250ZW50ID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5vcGVuRmlsZShsb2NhbFBhdGgpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxNYW5pZmVzdCA9IDxNYW5pZmVzdD5KU09OLnBhcnNlKGxvY2FsTWFuaWZlc3RDb250ZW50KTtcblxuICAgICAgICAgICAgICAgIC8vIENoZWNrIHZlcnNpb25zIG9mIG1hbmlmZXN0c1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW90ZU1hbmlmZXN0LnZlcnNpb24gIT09IHRoaXMubG9jYWxNYW5pZmVzdC52ZXJzaW9uO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHVwZGF0ZUZpbGVzKHNlcnZlcjogc3RyaW5nLCBsb2NhbFN0b3JhZ2VQYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+e1xuICAgICAgICBsZXQgbG9jYWxGaWxlczogVHJhY2tlZEZpbGVbXSA9IFtdO1xuICAgICAgICBsZXQgcmVtb3RlRmlsZXM6IFRyYWNrZWRGaWxlW10gPSBbXTtcbiAgICAgICAgbGV0IHJlc3VsdDogYm9vbGVhbjtcblxuICAgICAgICBmb3IobGV0IGZpbGUgaW4gdGhpcy5sb2NhbE1hbmlmZXN0LmZpbGVzKXtcbiAgICAgICAgICAgIGxvY2FsRmlsZXMucHVzaCh0aGlzLmxvY2FsTWFuaWZlc3QuZmlsZXNbZmlsZV0pO1xuICAgICAgICB9XG4gICAgICAgIGZvcihsZXQgZmlsZSBpbiB0aGlzLnJlbW90ZU1hbmlmZXN0LmZpbGVzKXtcbiAgICAgICAgICAgIHJlbW90ZUZpbGVzLnB1c2godGhpcy5yZW1vdGVNYW5pZmVzdC5maWxlc1tmaWxlXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaWxlcyB0byBiZSByZW1vdmVkXG4gICAgICAgIGxldCBmaWxlc1RvUmVtb3ZlOiBUcmFja2VkRmlsZVtdID0gbG9jYWxGaWxlcy5maWx0ZXIoKGxmOiBUcmFja2VkRmlsZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGZvdW5kcyA9IHJlbW90ZUZpbGVzLmZpbHRlcigocmY6IFRyYWNrZWRGaWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJmLmZpbGVuYW1lID09IGxmLmZpbGVuYW1lO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZm91bmRzLmxlbmd0aCA9PSAwO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZmlsZXNUb1JlbW92ZS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLnJlbW92ZUZpbGUobG9jYWxTdG9yYWdlUGF0aCArICcvJyArIGZpbGVzVG9SZW1vdmVbaV0uZmlsZW5hbWUpO1xuICAgICAgICAgICAgaWYoIXJlc3VsdClcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmlsZXMgdG8gYmUgdXBkYXRlZFxuICAgICAgICBsZXQgZmlsZXNUb1VwZGF0ZTogVHJhY2tlZEZpbGVbXSA9IHJlbW90ZUZpbGVzLmZpbHRlcigocmY6IFRyYWNrZWRGaWxlKSA9PiB7XG4gICAgICAgICAgICBsZXQgZm91bmRzID0gbG9jYWxGaWxlcy5maWx0ZXIoKGxmOiBUcmFja2VkRmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZi5maWxlbmFtZSA9PSBsZi5maWxlbmFtZSAmJiByZi52ZXJzaW9uICE9IGxmLnZlcnNpb247XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmb3VuZHMubGVuZ3RoID4gMDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGZpbGVzVG9VcGRhdGUubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgdGhpcy5fZmlsZVRyYW5zZmVyLmRvd25sb2FkKHNlcnZlciArIGZpbGVzVG9VcGRhdGVbaV0uZmlsZW5hbWUsIGxvY2FsU3RvcmFnZVBhdGggKyAnLycgKyBmaWxlc1RvVXBkYXRlW2ldLmZpbGVuYW1lKTtcbiAgICAgICAgICAgIGlmKCFyZXN1bHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbGVzIHRvIGJlIGRvd25sb2FkZWRcbiAgICAgICAgbGV0IGZpbGVzVG9BZGQ6IFRyYWNrZWRGaWxlW10gPSByZW1vdGVGaWxlcy5maWx0ZXIoKHJmOiBUcmFja2VkRmlsZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGZvdW5kcyA9IGxvY2FsRmlsZXMuZmlsdGVyKChsZjogVHJhY2tlZEZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmYuZmlsZW5hbWUgPT0gbGYuZmlsZW5hbWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmb3VuZHMubGVuZ3RoID09IDA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmaWxlc1RvQWRkLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IHRoaXMuX2ZpbGVUcmFuc2Zlci5kb3dubG9hZChzZXJ2ZXIgKyBmaWxlc1RvQWRkW2ldLmZpbGVuYW1lLCBsb2NhbFN0b3JhZ2VQYXRoICsgJy8nICsgZmlsZXNUb0FkZFtpXS5maWxlbmFtZSk7XG4gICAgICAgICAgICBpZighcmVzdWx0KVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5jbGFzcyBGaWxlU3lzdGVtU2VydmljZSBpbXBsZW1lbnRzIElGaWxlU3lzdGVte1xuICAgIHByaXZhdGUgeGhyOiBYTUxIdHRwUmVxdWVzdDtcbiAgICBwcml2YXRlIF9mczogRmlsZVN5c3RlbUltcGw7XG4gICAgcHJpdmF0ZSBfZnQ6IEZpbGVUcmFuc2ZlclNlcnZpY2U7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLnhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB0aGlzLl9mcyA9IG5ldyBGaWxlU3lzdGVtSW1wbCgpO1xuICAgICAgICB0aGlzLl9mdCA9IG5ldyBGaWxlVHJhbnNmZXJTZXJ2aWNlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9wZW5GaWxlKHBhdGg6c3RyaW5nKTpQcm9taXNlPHN0cmluZz57XG4gICAgICAgIHRoaXMueGhyLm9wZW4oJ0dFVCcsIHBhdGgpO1xuICAgICAgICB0aGlzLnhoci5zZW5kKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMueGhyLm9uZXJyb3IgPSAoZXYpID0+e1xuICAgICAgICAgICAgICAgIHJlamVjdCgnRXJyb3IgZ2V0dGluZyBmaWxlIGZyb20gJyArIHBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy54aHIub25sb2FkID0gKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMueGhyLnN0YXR1cyA8IDIwMCB8fCB0aGlzLnhoci5zdGF0dXMgPj0gMzAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCh0aGlzLnhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMueGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcmVtb3ZlRmlsZShwYXRoOnN0cmluZyk6UHJvbWlzZTxib29sZWFuPntcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2ZzLmdldEZpbGUocGF0aCwge2NyZWF0ZTpmYWxzZSwgZXhjbHVzaXZlOiBmYWxzZX0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKGZpbGVFbnRyeTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVFbnRyeS5yZW1vdmUoKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgfSwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGRvd25sb2FkRmlsZShvcmlnUGF0aDogc3RyaW5nLCBkZXN0UGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICAgICAgLyoqXG4gICAgICAgICAqIDEuIENoZWNrIGlmIGZpbGUgZXhpc3RzIGluIG9yaWdpblxuICAgICAgICAgKiAyLiBJZiBub3QsIHJlc29sdmUoZmFsc2UpXG4gICAgICAgICAqIDMuIEVsc2VcbiAgICAgICAgICogNC4gRG93bmxvYWQgaW4gZGVzdGluYXRpb24gZm9sZGVyXG4gICAgICAgICAqL1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9mdC5kb3dubG9hZChvcmlnUGF0aCwgZGVzdFBhdGgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29weUZpbGUoZGlyZWN0b3J5OiBEaXJlY3RvcnlFbnRyeSwgZW50cnk6IEVudHJ5KTogUHJvbWlzZTxib29sZWFuPntcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGVudHJ5LmNvcHlUbyhkaXJlY3RvcnksIGVudHJ5Lm5hbWUsIChlbnRyeTogRW50cnkpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29weURpcmVjdG9yeShvcmlnUGF0aDogc3RyaW5nLCBkZXN0UGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPntcbiAgICAgICAgbGV0IGVudHJpZXM6IEVudHJ5W10gPSBhd2FpdCB0aGlzLl9mcy5nZXREaXJlY3RvcnlFbnRyaWVzKG9yaWdQYXRoLCB7Y3JlYXRlOiBmYWxzZSwgZXhjbHVzaXZlOiBmYWxzZX0pO1xuICAgICAgICBsZXQgZGVzdERpcmVjdG9yeTogRGlyZWN0b3J5RW50cnkgPSBhd2FpdCB0aGlzLl9mcy5nZXREaXJlY3RvcnkoZGVzdFBhdGgsIHtjcmVhdGU6IHRydWUsIGV4Y2x1c2l2ZTogZmFsc2V9KTtcbiAgICAgICAgaWYoZW50cmllcyAmJiBkZXN0RGlyZWN0b3J5KXtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBsZXQgZW50cnkgPSBlbnRyaWVzW2ldO1xuICAgICAgICAgICAgICAgIGlmKGVudHJ5LmlzRGlyZWN0b3J5KXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IHRoaXMuY29weURpcmVjdG9yeShvcmlnUGF0aCArICcvJyArIGVudHJ5Lm5hbWUsIGRlc3RQYXRoICsgJy8nICsgZW50cnkubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFyZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IHRoaXMuY29weUZpbGUoZGVzdERpcmVjdG9yeSwgZW50cnkpO1xuICAgICAgICAgICAgICAgICAgICBpZighcmVzdWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuZGVjbGFyZSB2YXIgTG9jYWxGaWxlU3lzdGVtO1xuZGVjbGFyZSB2YXIgY29yZG92YTtcbmNsYXNzIEZpbGVUcmFuc2ZlclNlcnZpY2UgaW1wbGVtZW50cyBJRmlsZVRyYW5zZmVye1xuICAgIHByaXZhdGUgX3RyYW5zZmVyOiBhbnk7XG4gICAgcHJpdmF0ZSBfc3lzdGVtOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLl90cmFuc2ZlciA9IG5ldyBGaWxlVHJhbnNmZXJJbXBsKCk7XG4gICAgfVxuXG4gICAgZG93bmxvYWQoc3JjOnN0cmluZywgdGFyZ2V0OnN0cmluZywgdHJ1c3RBbGxIb3N0cz86Ym9vbGVhbiwgb3B0aW9ucz86YW55KTpQcm9taXNlPGJvb2xlYW4+e1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT57XG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zlci5kb3dubG9hZChzcmMsIHRhcmdldClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmYWlsKGUpe1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmNsYXNzIEZpbGVUcmFuc2ZlckltcGx7XG4gICAgcHJpdmF0ZSBfZnM6IEZpbGVTeXN0ZW1JbXBsO1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5fZnMgPSBuZXcgRmlsZVN5c3RlbUltcGwoKTtcbiAgICB9XG4gICAgZG93bmxvYWQoc291cmNlOiBzdHJpbmcsIHRhcmdldDogc3RyaW5nLCBoZWFkZXJzOiBhbnkpOiBQcm9taXNlPHZvaWQ+e1xuICAgICAgICB2YXIgdyA9IDxhbnk+d2luZG93O1xuICAgICAgICB2YXIgdHJhbnNmZXIgPSBuZXcgdy5GaWxlVHJhbnNmZXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZzLmdldEZpbGUodGFyZ2V0LCB7Y3JlYXRlOiB0cnVlLCBleGNsdXNpdmU6IGZhbHNlfSkudGhlbigoZmlsZTogYW55KSA9PntcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PntcbiAgICAgICAgICAgICAgICB0cmFuc2Zlci5kb3dubG9hZChzb3VyY2UsIGZpbGUubmF0aXZlVVJMLCAocykgPT57XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodm9pZCgwKSk7XG4gICAgICAgICAgICAgICAgfSwgKGUpID0+e1xuICAgICAgICAgICAgICAgICAgICBmaWxlLnJlbW92ZSgoKSA9Pnt9LCAoKSA9Pnt9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpXG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSwgaGVhZGVycyk7XG4gICAgICAgICAgICB9KS50aGVuKCgpID0+e1xuICAgICAgICAgICAgICAgIHJldHVybiB2b2lkICgwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KS50aGVuKCgpID0+e1xuICAgICAgICAgICAgcmV0dXJuIHZvaWQgKDApO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5jbGFzcyBGaWxlU3lzdGVtSW1wbHtcbiAgICBnZXREaXJlY3RvcnkocGF0aDogc3RyaW5nLCBvcHRpb25zKTogUHJvbWlzZTxEaXJlY3RvcnlFbnRyeT57XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAoPGFueT53aW5kb3cpLnJlcXVlc3RGaWxlU3lzdGVtKExvY2FsRmlsZVN5c3RlbS5QRVJTSVNURU5ULCAwLCAoZmlsZVN5c3RlbTogRmlsZVN5c3RlbSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0UGF0aChbcGF0aF0sIGZpbGVTeXN0ZW0ucm9vdCwgb3B0aW9ucykudGhlbigoZGlyZWN0b3J5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRpcmVjdG9yeSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdldERpcmVjdG9yeUVudHJpZXMocGF0aDogc3RyaW5nLCBvcHRpb25zKTogUHJvbWlzZTxFbnRyeVtdPntcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICg8YW55PndpbmRvdykucmVxdWVzdEZpbGVTeXN0ZW0oTG9jYWxGaWxlU3lzdGVtLlBFUlNJU1RFTlQsIDAsIChmaWxlU3lzdGVtOiBGaWxlU3lzdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRQYXRoKFtwYXRoXSwgZmlsZVN5c3RlbS5yb290LCBvcHRpb25zKS50aGVuKChkaXJlY3RvcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZWFkZXIgPSBkaXJlY3RvcnkuY3JlYXRlUmVhZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIucmVhZEVudHJpZXMoKGVudHJpZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGVudHJpZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBnZXRGaWxlKHBhdGg6c3RyaW5nLCBvcHRpb25zKTpQcm9taXNlPEZpbGVFbnRyeT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5yZXF1ZXN0RmlsZVN5c3RlbShMb2NhbEZpbGVTeXN0ZW0uUEVSU0lTVEVOVCwgMCwgKGZpbGVTeXN0ZW06RmlsZVN5c3RlbSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBmb2xkZXJzID0gcGF0aC5zcGxpdCgnLycpO1xuICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IGZvbGRlcnNbZm9sZGVycy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBmb2xkZXJzID0gZm9sZGVycy5zbGljZSgwLCBmb2xkZXJzLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0UGF0aChmb2xkZXJzLCBmaWxlU3lzdGVtLnJvb3QsIG9wdGlvbnMpLnRoZW4oKGRpcmVjdG9yeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkaXJlY3RvcnkuZ2V0RmlsZShmaWxlTmFtZSwgb3B0aW9ucywgKGZpbGU6RmlsZUVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9LCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYob3B0aW9ucy5jcmVhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0UGF0aChmb2xkZXJzOnN0cmluZ1tdLCBwYXJlbnQ6RGlyZWN0b3J5RW50cnksIG9wdGlvbnM6YW55KTpQcm9taXNlPERpcmVjdG9yeUVudHJ5PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxEaXJlY3RvcnlFbnRyeT4oKHJlc29sdmUsIHJlamVjdCkgPT57XG4gICAgICAgICAgICB0aGlzLmdldFN1YkRpcmVjdG9yeShmb2xkZXJzLCBwYXJlbnQsIG9wdGlvbnMsIDAsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldFN1YkRpcmVjdG9yeShmb2xkZXJzOiBzdHJpbmdbXSwgcGFyZW50RGlyZWN0b3J5OiBEaXJlY3RvcnlFbnRyeSwgb3B0aW9uczogYW55ICwgaW5kZXg6IG51bWJlciwgcmVzb2x2ZTogKGRlOiBEaXJlY3RvcnlFbnRyeSkgPT4gdm9pZCwgcmVqZWN0OiAoZTogYW55KSA9PiB2b2lkKXtcbiAgICAgICAgaWYoZm9sZGVycy5sZW5ndGggPiBpbmRleCl7XG4gICAgICAgICAgICBwYXJlbnREaXJlY3RvcnkuZ2V0RGlyZWN0b3J5KGZvbGRlcnNbaW5kZXhdLCBvcHRpb25zLCAoZGlyZWN0b3J5KSA9PiB7XG4gICAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgICAgICB0aGlzLmdldFN1YkRpcmVjdG9yeShmb2xkZXJzLCBkaXJlY3RvcnksIG9wdGlvbnMsIGluZGV4LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXNvbHZlKHBhcmVudERpcmVjdG9yeSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmNsYXNzIE5ldHdvcmtJbmZvcm1hdGlvblNlcnZpY2UgaW1wbGVtZW50cyBOZXR3b3JrSW5mb3JtYXRpb257XG4gICAgZ2V0IGlzQ29ubmVjdGVkKCk6IGJvb2xlYW57XG4gICAgICAgIGxldCBjb25uZWN0aW9uID0gKDxhbnk+bmF2aWdhdG9yKS5jb25uZWN0aW9uO1xuICAgICAgICByZXR1cm4gY29ubmVjdGlvbi50eXBlICE9IFwiTk9ORVwiICYmIGNvbm5lY3Rpb24udHlwZSAhPSBcIm5vbmVcIjtcbiAgICB9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZXJlYWR5JywgKCkgPT4ge1xuICAgIHZhciBmcyA9IG5ldyBGaWxlU3lzdGVtU2VydmljZSgpO1xuICAgIHZhciBmdCA9IG5ldyBGaWxlVHJhbnNmZXJTZXJ2aWNlKCk7XG4gICAgdmFyIG5pID0gbmV3IE5ldHdvcmtJbmZvcm1hdGlvblNlcnZpY2UoKTtcblxuICAgIHZhciBwYXJhbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbbWFuaWZlc3RdJyk7XG4gICAgaWYocGFyYW1zKXtcbiAgICAgICAgdmFyIGF1dG91cGRhdGVyID0gbmV3IEF1dG91cGRhdGVyKGZ0LCBmcywgbmksIGNvcmRvdmEuZmlsZS5hcHBsaWNhdGlvbkRpcmVjdG9yeSArICd3d3cnLCBwYXJhbXMuZ2V0QXR0cmlidXRlKCdzZXJ2ZXInKSk7XG4gICAgICAgICg8YW55PndpbmRvdykucmVxdWVzdEZpbGVTeXN0ZW0gPSAoPGFueT53aW5kb3cpLnJlcXVlc3RGaWxlU3lzdGVtIHx8ICg8YW55PndpbmRvdykud2Via2l0UmVxdWVzdEZpbGVTeXN0ZW07XG4gICAgICAgICg8YW55PndpbmRvdykucmVxdWVzdEZpbGVTeXN0ZW0oTG9jYWxGaWxlU3lzdGVtLlBFUlNJU1RFTlQsIDAsIChmaWxlU3lzdGVtKT0+IHtcbiAgICAgICAgICAgIHZhciBuYXRpdmVVUkwgPSBmaWxlU3lzdGVtLnJvb3QubmF0aXZlVVJMO1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KS5uYXRpdmVVUkwgPSBuYXRpdmVVUkw7XG4gICAgICAgICAgICBhdXRvdXBkYXRlci5hdXRvdXBkYXRlKCdteXMnLCBwYXJhbXMuZ2V0QXR0cmlidXRlKCdtYW5pZmVzdCcpLCBwYXJhbXMuZ2V0QXR0cmlidXRlKCdzZXJ2ZXInKSArICdtYW5pZmVzdC5qc29uJylcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2FkIHVwZGF0ZWQgQVBLJyk7XG4gICAgICAgICAgICAgICAgICAgICg8YW55PndpbmRvdykubG9jYXRpb24gPSBuYXRpdmVVUkwgKyAnbXlzL215cy5odG1sJztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2FkIGxvY2FsIEFQSycpO1xuICAgICAgICAgICAgICAgICAgICAoPGFueT53aW5kb3cpLmxvY2F0aW9uID0gJy4vbXlzLmh0bWwnO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0sIChlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICB9KTtcbiAgICB9XG59LCBmYWxzZSk7Il19
