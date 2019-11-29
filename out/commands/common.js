'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const constants_1 = require("../constants");
// import { BuiltInCommands, DocumentSchemes, ImageMimetypes } from '../constants';
// import { Container } from '../container';
// import { GitBranch, GitCommit, GitContributor, GitFile, GitRemote, GitUri, Repository } from '../git/gitService';
// import { Logger } from '../logger';
// import { CommandQuickPickItem, RepositoriesQuickPick } from '../quickpicks';
// import { Telemetry } from '../telemetry';
// import { ViewNode, ViewRefNode } from '../views/nodes';
var Commands;
(function (Commands) {
    Commands["ClearFileAnnotations"] = "gitlens.clearFileAnnotations";
})(Commands = exports.Commands || (exports.Commands = {}));
const registrableCommands = [];
function command() {
    return (target) => {
        registrableCommands.push(target);
    };
}
exports.command = command;
function registerCommands(context) {
    for (const c of registrableCommands) {
        context.subscriptions.push(new c());
    }
}
exports.registerCommands = registerCommands;
function getCommandUri(uri, editor) {
    if (uri instanceof vscode_1.Uri)
        return uri;
    if (editor == null)
        return undefined;
    const document = editor.document;
    if (document == null)
        return undefined;
    return document.uri;
}
exports.getCommandUri = getCommandUri;
function isScmResourceGroup(group) {
    if (group == null)
        return false;
    return (group.id !== undefined &&
        (group.handle !== undefined ||
            group.label !== undefined ||
            group.resourceStates !== undefined));
}
function isScmResourceState(state) {
    if (state == null)
        return false;
    return state.resourceUri != null;
}
let lastCommand = undefined;
function getLastCommand() {
    return lastCommand;
}
exports.getLastCommand = getLastCommand;
class EditorCommand {
    constructor(command) {
        if (!Array.isArray(command)) {
            command = [command];
        }
        const subscriptions = [];
        for (const cmd of command) {
            subscriptions.push(vscode_1.commands.registerTextEditorCommand(cmd, (editor, edit, ...args) => this.executeCore(cmd, editor, edit, ...args), this));
        }
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    dispose() {
        this._disposable && this._disposable.dispose();
    }
    executeCore(command, editor, edit, ...args) {
        // Telemetry.trackEvent(command);
        return this.execute(editor, edit, ...args);
    }
}
exports.EditorCommand = EditorCommand;
function findEditor(uri, lastActive) {
    const normalizedUri = uri.toString(false);
    let e = vscode_1.window.activeTextEditor;
    if (e !== undefined && e.document.uri.toString(false) === normalizedUri) {
        return e;
    }
    let found;
    for (e of vscode_1.window.visibleTextEditors) {
        // Prioritize the last active window over other visible ones
        if (e === lastActive && e.document.uri.toString(false) === normalizedUri) {
            return e;
        }
        if (e.document.uri.toString(false) === normalizedUri) {
            found = e;
        }
    }
    return found;
}
exports.findEditor = findEditor;
function findOrOpenEditor(uri, options = {}, lastActive) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const e = findEditor(uri, lastActive);
        if (e !== undefined) {
            if (!options.preserveFocus) {
                yield vscode_1.window.showTextDocument(e.document, Object.assign(Object.assign({}, options), { viewColumn: e.viewColumn }));
            }
            return e;
        }
        let column = (_a = vscode_1.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.viewColumn;
        // If we have a last active view column and it isn't the same as the webview's, then use it
        if (lastActive !== undefined && lastActive.viewColumn !== undefined && lastActive.viewColumn !== column) {
            column = lastActive.viewColumn;
        }
        else if (column !== undefined) {
            column--;
            if (column <= 0) {
                column = undefined;
            }
        }
        return openEditor(uri, Object.assign({ viewColumn: column }, options));
    });
}
exports.findOrOpenEditor = findOrOpenEditor;
function openEditor(uri, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { rethrow } = options, opts = __rest(options, ["rethrow"]);
        try {
            // if (uri.scheme === DocumentSchemes.GitLens && ImageMimetypes[paths.extname(uri.fsPath)]) {
            yield vscode_1.commands.executeCommand(constants_1.BuiltInCommands.Open, uri);
            return undefined;
            // }
            // const document = await workspace.openTextDocument(uri);
            // return window.showTextDocument(document, {
            // 	preserveFocus: false,
            // 	preview: true,
            // 	viewColumn: ViewColumn.Active,
            // 	...opts
            // });
        }
        catch (ex) {
            const msg = ex.toString();
            if (msg.includes('File seems to be binary and cannot be opened as text')) {
                yield vscode_1.commands.executeCommand(constants_1.BuiltInCommands.Open, uri);
                return undefined;
            }
            if (rethrow)
                throw ex;
            return undefined;
        }
    });
}
exports.openEditor = openEditor;
function openWorkspace(uri, name, options = {}) {
    if (options.openInNewWindow) {
        vscode_1.commands.executeCommand(constants_1.BuiltInCommands.OpenFolder, uri, true);
        return true;
    }
    return vscode_1.workspace.updateWorkspaceFolders(vscode_1.workspace.workspaceFolders !== undefined ? vscode_1.workspace.workspaceFolders.length : 0, null, { uri: uri, name: name });
}
exports.openWorkspace = openWorkspace;
//# sourceMappingURL=common.js.map