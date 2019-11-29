'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
exports.applicationInsightsKey = 'a9c302f8-6483-4d01-b92c-c159c799c679';
exports.extensionId = 'gitlens';
exports.extensionOutputChannelName = 'GitLens';
exports.extensionQualifiedId = `eamodio.${exports.extensionId}`;
exports.extensionTerminalName = 'GitLens';
var BuiltInCommands;
(function (BuiltInCommands) {
    BuiltInCommands["CloseActiveEditor"] = "workbench.action.closeActiveEditor";
    BuiltInCommands["CloseAllEditors"] = "workbench.action.closeAllEditors";
    BuiltInCommands["CursorMove"] = "cursorMove";
    BuiltInCommands["Diff"] = "vscode.diff";
    BuiltInCommands["EditorScroll"] = "editorScroll";
    BuiltInCommands["ExecuteDocumentSymbolProvider"] = "vscode.executeDocumentSymbolProvider";
    BuiltInCommands["ExecuteCodeLensProvider"] = "vscode.executeCodeLensProvider";
    BuiltInCommands["FocusFilesExplorer"] = "workbench.files.action.focusFilesExplorer";
    BuiltInCommands["Open"] = "vscode.open";
    BuiltInCommands["OpenFolder"] = "vscode.openFolder";
    BuiltInCommands["OpenInTerminal"] = "openInTerminal";
    BuiltInCommands["NextEditor"] = "workbench.action.nextEditor";
    BuiltInCommands["PreviewHtml"] = "vscode.previewHtml";
    BuiltInCommands["RevealLine"] = "revealLine";
    BuiltInCommands["SetContext"] = "setContext";
    BuiltInCommands["ShowExplorerActivity"] = "workbench.view.explorer";
    BuiltInCommands["ShowReferences"] = "editor.action.showReferences";
})(BuiltInCommands = exports.BuiltInCommands || (exports.BuiltInCommands = {}));
var CommandContext;
(function (CommandContext) {
    CommandContext["ActiveFileStatus"] = "gitlens:activeFileStatus";
    CommandContext["AnnotationStatus"] = "gitlens:annotationStatus";
    CommandContext["CanToggleCodeLens"] = "gitlens:canToggleCodeLens";
    CommandContext["Enabled"] = "gitlens:enabled";
    CommandContext["HasRemotes"] = "gitlens:hasRemotes";
    CommandContext["Key"] = "gitlens:key";
    CommandContext["Readonly"] = "gitlens:readonly";
    CommandContext["ViewsCanCompare"] = "gitlens:views:canCompare";
    CommandContext["ViewsCanCompareFile"] = "gitlens:views:canCompare:file";
    CommandContext["ViewsCompareKeepResults"] = "gitlens:views:compare:keepResults";
    CommandContext["ViewsHideSupportGitLens"] = "gitlens:views:supportGitLens:hide";
    CommandContext["ViewsFileHistoryEditorFollowing"] = "gitlens:views:fileHistory:editorFollowing";
    CommandContext["ViewsLineHistoryEditorFollowing"] = "gitlens:views:lineHistory:editorFollowing";
    CommandContext["ViewsRepositoriesAutoRefresh"] = "gitlens:views:repositories:autoRefresh";
    CommandContext["ViewsSearchKeepResults"] = "gitlens:views:search:keepResults";
    CommandContext["Vsls"] = "gitlens:vsls";
})(CommandContext = exports.CommandContext || (exports.CommandContext = {}));
function setCommandContext(key, value) {
    return vscode_1.commands.executeCommand(BuiltInCommands.SetContext, key, value);
}
exports.setCommandContext = setCommandContext;
var DocumentSchemes;
(function (DocumentSchemes) {
    DocumentSchemes["DebugConsole"] = "debug";
    DocumentSchemes["File"] = "file";
    DocumentSchemes["Git"] = "git";
    DocumentSchemes["GitLens"] = "gitlens";
    DocumentSchemes["Output"] = "output";
    DocumentSchemes["PRs"] = "pr";
    DocumentSchemes["Vsls"] = "vsls";
})(DocumentSchemes = exports.DocumentSchemes || (exports.DocumentSchemes = {}));
function getEditorIfActive(document) {
    const editor = vscode_1.window.activeTextEditor;
    return editor != null && editor.document === document ? editor : undefined;
}
exports.getEditorIfActive = getEditorIfActive;
function isActiveDocument(document) {
    const editor = vscode_1.window.activeTextEditor;
    return editor != null && editor.document === document;
}
exports.isActiveDocument = isActiveDocument;
function isTextEditor(editor) {
    const scheme = editor.document.uri.scheme;
    return scheme !== DocumentSchemes.Output && scheme !== DocumentSchemes.DebugConsole;
}
exports.isTextEditor = isTextEditor;
function hasVisibleTextEditor() {
    if (vscode_1.window.visibleTextEditors.length === 0)
        return false;
    return vscode_1.window.visibleTextEditors.some(e => isTextEditor(e));
}
exports.hasVisibleTextEditor = hasVisibleTextEditor;
var GlyphChars;
(function (GlyphChars) {
    GlyphChars["AngleBracketLeftHeavy"] = "\u2770";
    GlyphChars["AngleBracketRightHeavy"] = "\u2771";
    GlyphChars["ArrowBack"] = "\u21A9";
    GlyphChars["ArrowDown"] = "\u2193";
    GlyphChars["ArrowDropRight"] = "\u2937";
    GlyphChars["ArrowHeadRight"] = "\u27A4";
    GlyphChars["ArrowLeft"] = "\u2190";
    GlyphChars["ArrowLeftDouble"] = "\u21D0";
    GlyphChars["ArrowLeftRight"] = "\u2194";
    GlyphChars["ArrowLeftRightDouble"] = "\u21D4";
    GlyphChars["ArrowLeftRightDoubleStrike"] = "\u21CE";
    GlyphChars["ArrowLeftRightLong"] = "\u27F7";
    GlyphChars["ArrowRight"] = "\u2192";
    GlyphChars["ArrowRightDouble"] = "\u21D2";
    GlyphChars["ArrowRightHollow"] = "\u21E8";
    GlyphChars["ArrowUp"] = "\u2191";
    GlyphChars["ArrowUpRight"] = "\u2197";
    GlyphChars["ArrowsHalfLeftRight"] = "\u21CB";
    GlyphChars["ArrowsHalfRightLeft"] = "\u21CC";
    GlyphChars["ArrowsLeftRight"] = "\u21C6";
    GlyphChars["ArrowsRightLeft"] = "\u21C4";
    GlyphChars["Asterisk"] = "\u2217";
    GlyphChars["Check"] = "\u2713";
    GlyphChars["Dash"] = "\u2014";
    GlyphChars["Dot"] = "\u2022";
    GlyphChars["Ellipsis"] = "\u2026";
    GlyphChars["EnDash"] = "\u2013";
    GlyphChars["Envelope"] = "\u2709";
    GlyphChars["EqualsTriple"] = "\u2261";
    GlyphChars["Flag"] = "\u2691";
    GlyphChars["FlagHollow"] = "\u2690";
    GlyphChars["MiddleEllipsis"] = "\u22EF";
    GlyphChars["MuchLessThan"] = "\u226A";
    GlyphChars["MuchGreaterThan"] = "\u226B";
    GlyphChars["Pencil"] = "\u270E";
    GlyphChars["Space"] = "\u00A0";
    GlyphChars["SpaceThin"] = "\u2009";
    GlyphChars["SpaceThinnest"] = "\u200A";
    GlyphChars["SquareWithBottomShadow"] = "\u274F";
    GlyphChars["SquareWithTopShadow"] = "\u2750";
    GlyphChars["ZeroWidthSpace"] = "\u200B";
})(GlyphChars = exports.GlyphChars || (exports.GlyphChars = {}));
var GlobalState;
(function (GlobalState) {
    GlobalState["GitLensVersion"] = "gitlensVersion";
})(GlobalState = exports.GlobalState || (exports.GlobalState = {}));
exports.ImageMimetypes = {
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.jpe': 'image/jpeg',
    '.webp': 'image/webp',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
    '.bmp': 'image/bmp'
};
var WorkspaceState;
(function (WorkspaceState) {
    WorkspaceState["BranchComparisons"] = "gitlens:branch:comparisons";
    WorkspaceState["DefaultRemote"] = "gitlens:remote:default";
    WorkspaceState["PinnedComparisons"] = "gitlens:pinned:comparisons";
    WorkspaceState["StarredBranches"] = "gitlens:starred:branches";
    WorkspaceState["StarredRepositories"] = "gitlens:starred:repositories";
    WorkspaceState["ViewsCompareKeepResults"] = "gitlens:views:compare:keepResults";
    WorkspaceState["ViewsRepositoriesAutoRefresh"] = "gitlens:views:repositories:autoRefresh";
    WorkspaceState["ViewsSearchKeepResults"] = "gitlens:views:search:keepResults";
})(WorkspaceState = exports.WorkspaceState || (exports.WorkspaceState = {}));
//# sourceMappingURL=constants.js.map