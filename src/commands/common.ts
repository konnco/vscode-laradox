'use strict';
import * as paths from 'path';
import {
	commands,
	Disposable,
	ExtensionContext,
	SourceControlResourceGroup,
	SourceControlResourceState,
	TextDocumentShowOptions,
	TextEditor,
	TextEditorEdit,
	Uri,
	ViewColumn,
	window,
	workspace
} from 'vscode';
import { BuiltInCommands } from '../constants';
// import { BuiltInCommands, DocumentSchemes, ImageMimetypes } from '../constants';
// import { Container } from '../container';
// import { GitBranch, GitCommit, GitContributor, GitFile, GitRemote, GitUri, Repository } from '../git/gitService';
// import { Logger } from '../logger';
// import { CommandQuickPickItem, RepositoriesQuickPick } from '../quickpicks';
// import { Telemetry } from '../telemetry';
// import { ViewNode, ViewRefNode } from '../views/nodes';

export enum Commands {
	ClearFileAnnotations = 'gitlens.clearFileAnnotations',
}

interface CommandConstructor {
	new (): Command;
}

const registrableCommands: CommandConstructor[] = [];

export function command(): ClassDecorator {
	return (target: any) => {
		registrableCommands.push(target);
	};
}

export function registerCommands(context: ExtensionContext): void {
	for (const c of registrableCommands) {
		context.subscriptions.push(new c());
	}
}

export function getCommandUri(uri?: Uri, editor?: TextEditor): Uri | undefined {
	if (uri instanceof Uri) return uri;
	if (editor == null) return undefined;

	const document = editor.document;
	if (document == null) return undefined;

	return document.uri;
}

export interface CommandContextParsingOptions {
	editor: boolean;
	uri: boolean;
}

export interface CommandBaseContext {
	command: string;
	editor?: TextEditor;
	uri?: Uri;
}

export interface CommandScmGroupsContext extends CommandBaseContext {
	type: 'scm-groups';
	scmResourceGroups: SourceControlResourceGroup[];
}

export interface CommandScmStatesContext extends CommandBaseContext {
	type: 'scm-states';
	scmResourceStates: SourceControlResourceState[];
}

export interface CommandUnknownContext extends CommandBaseContext {
	type: 'unknown';
}

export interface CommandUriContext extends CommandBaseContext {
	type: 'uri';
}

export interface CommandUrisContext extends CommandBaseContext {
	type: 'uris';
	uris: Uri[];
}

function isScmResourceGroup(group: any): group is SourceControlResourceGroup {
	if (group == null) return false;

	return (
		(group as SourceControlResourceGroup).id !== undefined &&
		(group.handle !== undefined ||
			(group as SourceControlResourceGroup).label !== undefined ||
			(group as SourceControlResourceGroup).resourceStates !== undefined)
	);
}

function isScmResourceState(state: any): state is SourceControlResourceState {
	if (state == null) return false;

	return (state as SourceControlResourceState).resourceUri != null;
}

let lastCommand: { command: string; args: any[] } | undefined = undefined;
export function getLastCommand() {
	return lastCommand;
}

export abstract class EditorCommand implements Disposable {
	private _disposable: Disposable;

	constructor(command: Commands | Commands[]) {
		if (!Array.isArray(command)) {
			command = [command];
		}

		const subscriptions = [];
		for (const cmd of command) {
			subscriptions.push(
				commands.registerTextEditorCommand(
					cmd,
					(editor: TextEditor, edit: TextEditorEdit, ...args: any[]) =>
						this.executeCore(cmd, editor, edit, ...args),
					this
				)
			);
		}
		this._disposable = Disposable.from(...subscriptions);
	}

	dispose() {
		this._disposable && this._disposable.dispose();
	}

	private executeCore(command: string, editor: TextEditor, edit: TextEditorEdit, ...args: any[]): any {
		// Telemetry.trackEvent(command);
		return this.execute(editor, edit, ...args);
	}

	abstract execute(editor: TextEditor, edit: TextEditorEdit, ...args: any[]): any;
}

export function findEditor(uri: Uri, lastActive?: TextEditor): TextEditor | undefined {
	const normalizedUri = uri.toString(false);

	let e = window.activeTextEditor;
	if (e !== undefined && e.document.uri.toString(false) === normalizedUri) {
		return e;
	}

	let found;
	for (e of window.visibleTextEditors) {
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

export async function findOrOpenEditor(
	uri: Uri,
	options: TextDocumentShowOptions & { rethrow?: boolean } = {},
	lastActive?: TextEditor
): Promise<TextEditor | undefined> {
	const e = findEditor(uri, lastActive);
	if (e !== undefined) {
		if (!options.preserveFocus) {
			await window.showTextDocument(e.document, { ...options, viewColumn: e.viewColumn });
		}

		return e;
	}

	let column = window.activeTextEditor?.viewColumn;

	// If we have a last active view column and it isn't the same as the webview's, then use it
	if (lastActive !== undefined && lastActive.viewColumn !== undefined && lastActive.viewColumn !== column) {
		column = lastActive.viewColumn;
	} else if (column !== undefined) {
		column--;
		if (column <= 0) {
			column = undefined;
		}
	}

	return openEditor(uri, { viewColumn: column, ...options });
}

export async function openEditor(
	uri: Uri,
	options: TextDocumentShowOptions & { rethrow?: boolean } = {}
): Promise<TextEditor | undefined> {
	const { rethrow, ...opts } = options;
	try {
		// if (uri.scheme === DocumentSchemes.GitLens && ImageMimetypes[paths.extname(uri.fsPath)]) {
			await commands.executeCommand(BuiltInCommands.Open, uri);
			return undefined;
		// }

		// const document = await workspace.openTextDocument(uri);
		// return window.showTextDocument(document, {
		// 	preserveFocus: false,
		// 	preview: true,
		// 	viewColumn: ViewColumn.Active,
		// 	...opts
		// });
	} catch (ex) {
		const msg = ex.toString();
		if (msg.includes('File seems to be binary and cannot be opened as text')) {
			await commands.executeCommand(BuiltInCommands.Open, uri);

			return undefined;
		}

		if (rethrow) throw ex;
		return undefined;
	}
}

export function openWorkspace(uri: Uri, name: string, options: { openInNewWindow?: boolean } = {}) {
	if (options.openInNewWindow) {
		commands.executeCommand(BuiltInCommands.OpenFolder, uri, true);

		return true;
	}

	return workspace.updateWorkspaceFolders(
		workspace.workspaceFolders !== undefined ? workspace.workspaceFolders.length : 0,
		null,
		{ uri: uri, name: name }
	);
}
