import * as vscode from 'vscode';
import { getWebviewContent } from './designer/webview';
import { LaradoxExplorerDepProvider } from '../../vendor/laradox-explorer';

export function activateMigration(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('laradox.migration.designer', (fullPathUri) => {
        vscode.window.showTextDocument(fullPathUri);
            // const panel = vscode.window.createWebviewPanel(
            //     'laradoxDesigner', // Identifies the type of the webview. Used internally
            //     'Laradox: Database Designer', // Title of the panel displayed to the user
            //     vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
            //     {} // Webview options. More on these later.
            // );
            // panel.webview.html = getWebviewContent();
    });
    context.subscriptions.push(disposable);

    // vscode.window.registerTreeDataProvider('laradox-migration', new DepNodeProvider());
    const dependenciesProvider = new LaradoxExplorerDepProvider(vscode.workspace.workspaceFolders, "database/migrations/");
    vscode.window.registerTreeDataProvider('laradox-migration', dependenciesProvider);
}
