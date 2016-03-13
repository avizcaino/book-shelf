/**
 * Created by alexvizcaino on 11/3/16.
 */
declare module 'auto-updater'{
    export interface IFileTransfer{
        download(src: string, target: string, trustAllHosts?: boolean, options?: any): Promise<boolean>;
    }

    export interface IFileSystem{
        openFile(path: string): Promise<string>;
        removeFile(path: string): Promise<boolean>;
        downloadFile(origPath: string, destPath: string): Promise<boolean>;
        copyDirectory(origPath: string, destPath: string): Promise<boolean>;
        copyFile(directory: DirectoryEntry, entry: Entry): Promise<boolean>;
    }

    export interface TrackedFile{
        filename: string;
        version: string;
    }

    export interface Manifest{
        version: string;
        files: any;
    }

    export interface NetworkInformation{
        isConnected: boolean;
    }

    export class FileSystem implements IFileSystem{
        openFile(path: string): Promise<string>;
        removeFile(path: string): Promise<boolean>;
        downloadFile(origPath: string, destPath: string): Promise<boolean>;
        copyDirectory(origPath: string, destPath: string): Promise<boolean>;
        copyFile(directory: DirectoryEntry, entry: Entry): Promise<boolean>;
    }

    export class FileTransfer implements IFileTransfer{
        download(src: string, target: string, trustAllHosts?: boolean, options?: any): Promise<boolean>;
    }

    /* FileSystem interfaces */

    export interface Metadata {
        modificationTime: Date;
        size: number;
    }

    export interface FileSystemInfo {
        name: string;
        root: DirectoryEntry;
    }

    export interface Entry {
        isFile: boolean;
        isDirectory: boolean;
        getMetadata(successCallback:(metadata:Metadata) => void,
                    errorCallback?:(error:Error) => void): void;
        name: string;
        fullPath: string;
        nativeURL: string;
        fileSystem: FileSystemInfo;
        moveTo(parent:DirectoryEntry,
               newName?:string,
               successCallback?:(entry:Entry) => void,
               errorCallback?:(error:Error) => void);
        copyTo(parent:DirectoryEntry,
               newName?:string,
               successCallback?:(entry:Entry) => void,
               errorCallback?:(error:Error) => void);
        toURL(): string;
        remove(successCallback:() => void,
               errorCallback?:(error:Error) => void);
        getParent(successCallback:(entry:Entry) => void,
                  errorCallback?:(error:Error) => void);
    }

    export interface FileSaver extends EventTarget {
        abort(): void;
        readyState: number;
        onwritestart: (event:ProgressEvent) => void;
        onprogress: (event:ProgressEvent) => void;
        onwrite: (event:ProgressEvent) => void;
        onabort: (event:ProgressEvent) => void;
        onerror: (event:ProgressEvent) => void;
        onwriteend: (event:ProgressEvent) => void;
        error: Error;
    }

    export interface FileWriter extends FileSaver {
        position: number;
        length: number;
        write(data:Blob): void;
        seek(offset:number): void;
        truncate(size:number): void;
    }

    export interface FileEntry extends Entry {
        createWriter(successCallback:(writer:FileWriter) => void,
                     errorCallback?:(error:Error) => void): void;
        file(successCallback:(file:File) => void,
             errorCallback?:(error:Error) => void): void;
    }

    export interface FileSystem {
        name: string;
        root: DirectoryEntry;
    }

    export interface DirectoryReader {
        readEntries(successCallback:(entries:Entry[]) => void,
                    errorCallback?:(error:Error) => void): void;
    }

    export interface Flags {
        create?: boolean;
        exclusive?: boolean;
    }

    export interface DirectoryEntry extends Entry {
        createReader(): DirectoryReader;
        getFile(path:string, options?:Flags,
                successCallback?:(entry:FileEntry) => void,
                errorCallback?:(error:Error) => void): void;
        getDirectory(path:string, options?:Flags,
                     successCallback?:(entry:DirectoryEntry) => void,
                     errorCallback?:(error:Error) => void): void;
        removeRecursively(successCallback:() => void,
                          errorCallback?:(error:Error) => void): void;
    }
}