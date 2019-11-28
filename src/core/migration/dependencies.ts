import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { WorkspaceFolder } from 'vscode';

export class DepMigrationProvider implements vscode.TreeDataProvider<Dependency> {

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

	private workspaceRoot: any;

	constructor(private workspaceFolder: WorkspaceFolder[] | undefined) {
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
			const packageJsonPath = path.join(this.workspaceRoot, 'database/migrations/');
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
				const displayName = moduleName.replace(".php", "").slice(18);
				const fullPath = path.join(packageJsonPath, moduleName);
				const fullPathUri = vscode.Uri.file(fullPath);
				return new Dependency(displayName, version, vscode.TreeItemCollapsibleState.None, 
					// {
					// command: 'workbench.action.quickOpenNavigateNextInFilePicker',
					// title: '',
					// arguments: [{ "uri": fullPathUri, "showOptions": { "preserveFocus": true, "preview": false } }],
					// }
				);
			};

			migrations = migrationFiles.map(dep => toDep(dep, ""));

			// const deps = packageJson.dependencies
			// 	? Object.keys(packageJson.dependencies).map(dep => toDep(dep, packageJson.dependencies[dep]))
			// 	: [];
			// const devDeps = packageJson.devDependencies
			// 	? Object.keys(packageJson.devDependencies).map(dep => toDep(dep, packageJson.devDependencies[dep]))
			// 	: [];
			// return deps.concat(devDeps);
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

export class Dependency extends vscode.TreeItem {

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