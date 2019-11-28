"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrap_1 = require("./core/migration/bootstrap");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    bootstrap_1.activateMigration(context);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map