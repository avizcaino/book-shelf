/**
 * Created by alexvizcaino on 11/3/16.
 */
import {IFileTransfer, IFileSystem, TrackedFile, Manifest, NetworkInformation, FileEntry, FileSystem, DirectoryEntry, Entry} from "auto-updater";

class Autoupdater{
    constructor(private _fileTransfer: IFileTransfer, private _fileSystem: IFileSystem, private _networkInformation: NetworkInformation,
                private _rootDirectory: string, private _serverUrl: string){
    }

    public async autoupdate(localStorageDirectory: string, localManifestPath: string, remoteManifestPath: string):Promise<void>{
        var result = await this.copyManifestToLocalStorage(this._rootDirectory, localStorageDirectory, localManifestPath);
        if(result){
            result = await this.checkNewVersion(localManifestPath, remoteManifestPath);
            if(result){
                try{
                    result = await this.doBackup(localStorageDirectory);
                    if(result){
                        result = await this.updateFiles(this._serverUrl, localStorageDirectory);
                        if(result)
                            return Promise.resolve();
                        else{
                            result = await this.restoreBackup(localStorageDirectory + '-backup');
                            if(result)
                                return Promise.resolve();
                        }
                    }
                }catch(e){
                    try{
                        await this.restoreBackup(this._rootDirectory + '-backup');
                    }catch(e){
                        return Promise.reject(null);
                    }
                }
            } else {
                return Promise.resolve();
            }
        }
        return Promise.reject(null);
    }

    public async copyManifestToLocalStorage(rootDirectory: string, localStorageDirectory: string, localManifestPath: string): Promise<boolean>{
        let localManifestContent = await this._fileSystem.openFile(localManifestPath);
        let localManifest = <Manifest>JSON.parse(localManifestContent);
        let files: TrackedFile[] = [];

        for(let file in localManifest.files){
            files.push(localManifest.files[file]);
        };

        let result;
        for(var i = 0; i < files.length; i++){
            result = await this._fileSystem.downloadFile(rootDirectory + '/' + files[i].filename, localStorageDirectory + '/' + files[i].filename);
            if(!result)
                return result;
        }

        result = await this._fileSystem.downloadFile(rootDirectory + '/manifest.json', localStorageDirectory + '/manifest.json');
        return result;
    }

    public async doBackup(path: string): Promise<boolean>{
        let result = await this._fileSystem.copyDirectory(path, path + '-backup');
        return result;
    }

    public async restoreBackup(backupPath: string): Promise<boolean>{
        let result = await this._fileSystem.copyDirectory(backupPath, backupPath.substr(0, backupPath.indexOf('-')));
        return result;
    }

    public remoteManifest: Manifest;
    public localManifest: Manifest;

    public async checkNewVersion(localPath: string, remotePath: string):Promise<boolean> {
        if(!this._networkInformation.isConnected)
            return false;
        else{
            try{
                let remoteManifestContent = await this._fileSystem.openFile(remotePath);
                this.remoteManifest = <Manifest>JSON.parse(remoteManifestContent);
                let localManifestContent = await this._fileSystem.openFile(localPath);
                this.localManifest = <Manifest>JSON.parse(localManifestContent);

                // Check versions of manifests
                return this.remoteManifest.version !== this.localManifest.version;
            } catch (e){
                return false;
            }
        }
    }

    public async updateFiles(server: string, localStoragePath: string): Promise<boolean>{
        let localFiles: TrackedFile[] = [];
        let remoteFiles: TrackedFile[] = [];
        let result: boolean;

        for(let file in this.localManifest.files){
            localFiles.push(this.localManifest.files[file]);
        }
        for(let file in this.remoteManifest.files){
            remoteFiles.push(this.remoteManifest.files[file]);
        }

        // Files to be removed
        let filesToRemove: TrackedFile[] = localFiles.filter((lf: TrackedFile) => {
            let founds = remoteFiles.filter((rf: TrackedFile) => {
                return rf.filename == lf.filename;
            });
            return founds.length == 0;
        });

        for(let i = 0; i < filesToRemove.length; i++){
            result = await this._fileSystem.removeFile(localStoragePath + '/' + filesToRemove[i].filename);
            if(!result)
                return result;
        }

        // Files to be updated
        let filesToUpdate: TrackedFile[] = remoteFiles.filter((rf: TrackedFile) => {
            let founds = localFiles.filter((lf: TrackedFile) => {
                return rf.filename == lf.filename && rf.version != lf.version;
            });
            return founds.length > 0;
        });

        for(let i = 0; i < filesToUpdate.length; i++){
            result = await this._fileTransfer.download(server + filesToUpdate[i].filename, localStoragePath + '/' + filesToUpdate[i].filename);
            if(!result)
                return result;
        }

        // Files to be downloaded
        let filesToAdd: TrackedFile[] = remoteFiles.filter((rf: TrackedFile) => {
            let founds = localFiles.filter((lf: TrackedFile) => {
                return rf.filename == lf.filename;
            });
            return founds.length == 0;
        });

        for(let i = 0; i < filesToAdd.length; i++){
            result = await this._fileTransfer.download(server + filesToAdd[i].filename, localStoragePath + '/' + filesToAdd[i].filename);
            if(!result)
                return result;
        }

        return true;
    }
}

/************************************************************************************************************************/
class FileSystemService implements IFileSystem{
    private xhr: XMLHttpRequest;
    private _fs: FileSystemImpl;
    private _ft: FileTransferService;

    constructor(){
        this.xhr = new XMLHttpRequest();
        this._fs = new FileSystemImpl();
        this._ft = new FileTransferService();
    }

    public openFile(path:string):Promise<string>{
        this.xhr.open('GET', path);
        this.xhr.send();

        return new Promise((resolve, reject) => {
            this.xhr.onerror = (ev) =>{
                reject('Error getting file from ' + path);
            }
            this.xhr.onload = (ev) => {
                if (this.xhr.status < 200 || this.xhr.status >= 300) {
                    reject(this.xhr.responseText);
                }
                resolve(this.xhr.response);
            }
        })
    }

    public async removeFile(path:string):Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            this._fs.getFile(path, {create:false, exclusive: false})
                .then((fileEntry: any) => {
                    fileEntry.remove(()=>{
                        resolve(true)
                    }, (e) => {
                        resolve(false)
                    });
                })
                .catch((e) => {
                    resolve(false)
                });
        })
    }

    public async downloadFile(origPath: string, destPath: string): Promise<boolean>{
        /**
         * 1. Check if file exists in origin
         * 2. If not, resolve(false)
         * 3. Else
         * 4. Download in destination folder
         */

        return new Promise<boolean>((resolve, reject) => {
            this._ft.download(origPath, destPath)
                .then((r) => {
                    resolve(r);
                })
                .catch((e) => {
                    resolve(false);
                })
        });
    }

    public copyFile(directory: DirectoryEntry, entry: Entry): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            entry.copyTo(directory, entry.name, (entry: Entry) => {
                resolve(true);
            }, (error) => {
                resolve(false);
            })
        });
    }

    public async copyDirectory(origPath: string, destPath: string): Promise<boolean>{
        let entries: Entry[] = await this._fs.getDirectoryEntries(origPath, {create: false, exclusive: false});
        let destDirectory: DirectoryEntry = await this._fs.getDirectory(destPath, {create: true, exclusive: false});
        if(entries && destDirectory){
            for(let i = 0; i < entries.length; i++){
                let entry = entries[i];
                if(entry.isDirectory){
                    let result = await this.copyDirectory(origPath + '/' + entry.name, destPath + '/' + entry.name);
                    if(!result)
                        return false;
                } else {
                    let result = await this.copyFile(destDirectory, entry);
                    if(!result)
                        return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }
}

/************************************************************************************************************************/
declare var LocalFileSystem;
declare var cordova;
class FileTransferService implements IFileTransfer{
    private _transfer: any;
    private _system: any;

    constructor(){
        this._transfer = new FileTransferImpl();
    }

    download(src:string, target:string, trustAllHosts?:boolean, options?:any):Promise<boolean>{
        return new Promise<boolean>((resolve, reject) =>{
            this._transfer.download(src, target)
                .then(() => {
                    resolve(true);
                })
                .catch((e) => {
                    resolve(false);
                })
        });
    }

    private fail(e){
        console.log(e);
        return false;
    }
}

/************************************************************************************************************************/
class FileTransferImpl{
    private _fs: FileSystemImpl;

    constructor(){
        this._fs = new FileSystemImpl();
    }
    download(source: string, target: string, headers: any): Promise<void>{
        var w = <any>window;
        var transfer = new w.FileTransfer();
        return this._fs.getFile(target, {create: true, exclusive: false}).then((file: any) =>{
            return new Promise<void>((resolve, reject) =>{
                transfer.download(source, file.nativeURL, (s) =>{
                    resolve(void(0));
                }, (e) =>{
                    file.remove(() =>{}, () =>{});
                    reject(e)
                }, true, headers);
            }).then(() =>{
                return void (0);
            });
        }).then(() =>{
            return void (0);
        });
    }
}

/************************************************************************************************************************/
class FileSystemImpl{
    getDirectory(path: string, options): Promise<DirectoryEntry>{
        return new Promise((resolve, reject) => {
            (<any>window).requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fileSystem: FileSystem) => {
                this.getPath([path], fileSystem.root, options).then((directory) => {
                        resolve(directory);
                    })
                    .catch((error) => {
                        resolve(null);
                    })
            })
        })
    }

    getDirectoryEntries(path: string, options): Promise<Entry[]>{
        return new Promise((resolve, reject) => {
            (<any>window).requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fileSystem: FileSystem) => {
                this.getPath([path], fileSystem.root, options).then((directory) => {
                        let reader = directory.createReader();
                        reader.readEntries((entries) => {
                            resolve(entries);
                        }, (error) => {
                            resolve(null);
                        });
                    })
                    .catch((error) => {
                        resolve(null);
                    })
            })
        })
    }

    getFile(path:string, options):Promise<FileEntry> {
        return new Promise((resolve, reject) => {
            (<any>window).requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fileSystem:FileSystem) => {
                var folders = path.split('/');
                var fileName = folders[folders.length - 1];
                folders = folders.slice(0, folders.length - 1);
                this.getPath(folders, fileSystem.root, options).then((directory) => {
                    directory.getFile(fileName, options, (file:FileEntry) => {
                        resolve(file);
                    }, (e) => {
                        if(options.create)
                            reject(e);
                        else{
                            resolve(null);
                        }
                    });
                }, (e) => {
                    reject(e);
                });
            });
        });
    }

    getPath(folders:string[], parent:DirectoryEntry, options:any):Promise<DirectoryEntry> {
        return new Promise<DirectoryEntry>((resolve, reject) =>{
            this.getSubDirectory(folders, parent, options, 0, resolve, reject);
        });
    }

    getSubDirectory(folders: string[], parentDirectory: DirectoryEntry, options: any , index: number, resolve: (de: DirectoryEntry) => void, reject: (e: any) => void){
        if(folders.length > index){
            parentDirectory.getDirectory(folders[index], options, (directory) => {
                index++;
                this.getSubDirectory(folders, directory, options, index, resolve, reject);
            }, error => {
                reject(error);
            });
        }else{
            resolve(parentDirectory);
        }
    }
}


/************************************************************************************************************************/
class NetworkInformationService implements NetworkInformation{
    get isConnected(): boolean{
        let connection = (<any>navigator).connection;
        return connection.type != "NONE" && connection.type != "none";
    }
}

document.addEventListener('deviceready', () => {
    var fs = new FileSystemService();
    var ft = new FileTransferService();
    var ni = new NetworkInformationService();

    var params = document.querySelector('script[manifest]');
    if(params){
        var autoupdater = new Autoupdater(ft, fs, ni, cordova.file.applicationDirectory + 'www', params.getAttribute('server'));
        (<any>window).requestFileSystem = (<any>window).requestFileSystem || (<any>window).webkitRequestFileSystem;
        (<any>window).requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fileSystem)=> {
            var nativeURL = fileSystem.root.nativeURL;
            (<any>window).nativeURL = nativeURL;
            autoupdater.autoupdate('mys', params.getAttribute('manifest'), params.getAttribute('server') + 'manifest.json')
                .then(() => {
                    console.log('Load updated APK');
                    (<any>window).location = nativeURL + 'mys/mys.html';
                })
                .catch(() => {
                    console.log('Load local APK');
                    (<any>window).location = './mys.html';
                })
        }, (e) => {
            console.log(e)
        });
    }
}, false);