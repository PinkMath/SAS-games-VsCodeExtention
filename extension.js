const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function activate(context) {

  // Helper to create webview
  function createWebview(title, folder) {
    const panel = vscode.window.createWebviewPanel(
      folder,                  // Webview ID
      title,                   // Title in VS Code tab
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'webview'))]
      }
    );

    const htmlPath = path.join(context.extensionPath, 'webview', folder, 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    const cssUri = panel.webview.asWebviewUri(vscode.Uri.file(
      path.join(context.extensionPath, 'webview', folder, 'style.css')
    ));

    const jsUri = panel.webview.asWebviewUri(vscode.Uri.file(
      path.join(context.extensionPath, 'webview', folder, 'script.js')
    ));

    // Replace placeholders in HTML with actual URIs
    html = html.replace('${style}', cssUri).replace('${script}', jsUri);

    panel.webview.html = html;
  }

  // Register Snake command
  context.subscriptions.push(
    vscode.commands.registerCommand('sas.Snake', () => {
      createWebview('Snake 🐍', 'snake');
    })
  );

  // Register Tic-Tac-Toe command
  context.subscriptions.push(
    vscode.commands.registerCommand('sas.tic-tac-toe', () => {
      createWebview('Tic-tac-toe ❌🔴', 'tic-tac-toe');
    })
  );
}

// Optional deactivate function
function deactivate() {}

module.exports = { activate, deactivate };