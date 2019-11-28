import * as vscode from 'vscode';
import { getWebviewContent } from './designer/webview';
import { DepMigrationProvider } from './dependencies';

export function activateMigration(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('laradox.migration.designer', () => {
        vscode.window.showInformationMessage('Hello World!');
        const panel = vscode.window.createWebviewPanel(
            'laradoxDesigner', // Identifies the type of the webview. Used internally
            'Laradox: Database Designer', // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {} // Webview options. More on these later.
        );
        panel.webview.html = getWebviewContent();
    });
    context.subscriptions.push(disposable);

    // vscode.window.registerTreeDataProvider('laradox-migration', new DepNodeProvider());
    const nodeDependenciesProvider = new DepMigrationProvider(vscode.workspace.workspaceFolders);
    vscode.window.registerTreeDataProvider('laradox-migration', nodeDependenciesProvider);
}
