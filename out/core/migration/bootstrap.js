"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const webview_1 = require("./designer/webview");
const dependencies_1 = require("./dependencies");
function activateMigration(context) {
    let disposable = vscode.commands.registerCommand('laradox.migration.designer', () => {
        vscode.window.showInformationMessage('Hello World!');
        const panel = vscode.window.createWebviewPanel('laradoxDesigner', // Identifies the type of the webview. Used internally
        'Laradox: Database Designer', // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        {} // Webview options. More on these later.
        );
        panel.webview.html = webview_1.getWebviewContent();
    });
    context.subscriptions.push(disposable);
    // vscode.window.registerTreeDataProvider('laradox-migration', new DepNodeProvider());
    const nodeDependenciesProvider = new dependencies_1.DepMigrationProvider(vscode.workspace.workspaceFolders);
    vscode.window.registerTreeDataProvider('laradox-migration', nodeDependenciesProvider);
}
exports.activateMigration = activateMigration;
//# sourceMappingURL=bootstrap.js.map