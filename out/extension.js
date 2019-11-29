"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const bootstrap_1 = require("./core/migration/bootstrap");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    bootstrap_1.activateMigration(context);
    let disposable = vscode.commands.registerCommand('laradox.openfile', (fullPathUri) => {
        vscode.window.showTextDocument(fullPathUri);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map