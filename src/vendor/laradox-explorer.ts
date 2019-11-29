import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { WorkspaceFolder, TreeDataProvider, TreeItem } from 'vscode';

export class LaradoxExplorerDepProvider implements TreeDataProvider<Dependency> {

    private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

    private workspaceRoot: any;

    constructor(private workspaceFolder: WorkspaceFolder[] | undefined, private path: string) {
        if (this.workspaceFolder != undefined) {
            this.workspaceRoot = this.workspaceFolder[0].uri.fsPath;
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Dependency): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Dependency): Thenable<Dependency[]> {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No dependency in empty workspace');
            return Promise.resolve([]);
        }

        if (element) {
            return Promise.resolve([]);
        } else {
            const packageJsonPath = path.join(this.workspaceRoot, this.path);
			// vscode.window.showInformationMessage(packageJsonPath);
			if (this.pathExists(packageJsonPath)) {
                return Promise.resolve(this.getDepsInMigrations(packageJsonPath));
            } else {
                vscode.window.showInformationMessage('Workspace has no database migrations');
                return Promise.resolve([]);
            }
        }
    }

	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
    private getDepsInMigrations(packageJsonPath: string): Dependency[] {
        if (this.pathExists(packageJsonPath)) {
            const migrationFiles = fs.readdirSync(packageJsonPath);
            let migrations: any[] = [];

            // const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

            const toDep = (moduleName: string, version: string): Dependency => {
                const fullPath = path.join(packageJsonPath, moduleName);
                const fullPathUri = vscode.Uri.file(fullPath);
                return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'laradox.migration.designer',
                        title: '',
                        arguments: [fullPathUri],
                    }
                );
            };

            migrations = migrationFiles.map(dep => toDep(dep, ""));
            return migrations
        } else {
            return [];
        }
    }

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            return false;
        }

        return true;
    }
}

export class Dependency extends TreeItem {

    constructor(
        public readonly label: string,
        private desc: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
    }

    get tooltip(): string {
        return `${this.label}`;
    }

    get description(): string {
        return this.desc;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    };

    contextValue = 'dependency';
}