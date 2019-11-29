"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const vscode_1 = require("vscode");
class LaradoxExplorerDepProvider {
    constructor(workspaceFolder, path) {
        this.workspaceFolder = workspaceFolder;
        this.path = path;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        if (this.workspaceFolder != undefined) {
            this.workspaceRoot = this.workspaceFolder[0].uri.fsPath;
        }
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No dependency in empty workspace');
            return Promise.resolve([]);
        }
        if (element) {
            return Promise.resolve([]);
        }
        else {
            const packageJsonPath = path.join(this.workspaceRoot, this.path);
            // vscode.window.showInformationMessage(packageJsonPath);
            if (this.pathExists(packageJsonPath)) {
                return Promise.resolve(this.getDepsInMigrations(packageJsonPath));
            }
            else {
                vscode.window.showInformationMessage('Workspace has no database migrations');
                return Promise.resolve([]);
            }
        }
    }
    /**
     * Given the path to package.json, read all its dependencies and devDependencies.
     */
    getDepsInMigrations(packageJsonPath) {
        if (this.pathExists(packageJsonPath)) {
            const migrationFiles = fs.readdirSync(packageJsonPath);
            let migrations = [];
            // const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            const toDep = (moduleName, version) => {
                const fullPath = path.join(packageJsonPath, moduleName);
                const fullPathUri = vscode.Uri.file(fullPath);
                return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None, {
                    command: 'laradox.migration.designer',
                    title: '',
                    arguments: [fullPathUri],
                });
            };
            migrations = migrationFiles.map(dep => toDep(dep, ""));
            return migrations;
        }
        else {
            return [];
        }
    }
    pathExists(p) {
        try {
            fs.accessSync(p);
        }
        catch (err) {
            return false;
        }
        return true;
    }
}
exports.LaradoxExplorerDepProvider = LaradoxExplorerDepProvider;
class Dependency extends vscode_1.TreeItem {
    constructor(label, desc, collapsibleState, command) {
        super(label, collapsibleState);
        this.label = label;
        this.desc = desc;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
        };
        this.contextValue = 'dependency';
    }
    get tooltip() {
        return `${this.label}`;
    }
    get description() {
        return this.desc;
    }
}
exports.Dependency = Dependency;
//# sourceMappingURL=laradox-explorer.js.map