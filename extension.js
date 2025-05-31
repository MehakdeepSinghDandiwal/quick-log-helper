
const vscode = require('vscode');

const insertText = (val) => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('Can\'t insert log because no document is open');
        return;
    }

    const selection = editor.selection;
    const range = new vscode.Range(selection.start, selection.end);

    editor.edit(editBuilder => {
        editBuilder.replace(range, val);
    });
}


function getAllLogStatements(document, documentText, type = 'all') {
    let logRegex;

    switch (document.languageId) {
        case 'javascript':
        case 'typescript':
            if (type === 'log') {
                logRegex = /console\.log\s*\((?:[^)(]+|\([^)(]*\))*\)\s*;?/g;
            } else if (type === 'warn') {
                logRegex = /console\.warn\s*\((?:[^)(]+|\([^)(]*\))*\)\s*;?/g;
            } else if (type === 'error') {
                logRegex = /console\.error\s*\((?:[^)(]+|\([^)(]*\))*\)\s*;?/g;
            } else {
                logRegex = /console\.(log|warn|error|debug|info|assert|dir|trace|group|groupEnd|time|timeEnd|profile|profileEnd|count)\s*\((?:[^)(]+|\([^)(]*\))*\)\s*;?/g;
            }
            break;

        case 'python':
            if (type === 'log') {
                logRegex = /(print\s*\(\s*(?:"[^"]*"|'[^']*'|[^()])*?\s*\))|(logging\.(info|debug)\s*\(\s*(?:"[^"]*"|'[^']*'|[^()])*?\s*\))/g;
            } else if (type === 'warn') {
                logRegex = /logging\.(warn|warning)\s*\(\s*(?:"[^"]*"|'[^']*'|[^()])*?\s*\)/g;
            } else if (type === 'error') {
                logRegex = /logging\.(error|critical|fatal|exception)\s*\(\s*(?:"[^"]*"|'[^']*'|[^()])*?\s*\)/g;
            } else {
                logRegex = /(print\s*\(\s*(?:"[^"]*"|'[^']*'|[^()])*?\s*\))|(logging\.(info|debug|warn|warning|error|critical|fatal|exception)\s*\(\s*(?:"[^"]*"|'[^']*'|[^()])*?\s*\))/g;
            }
            break;




        case 'java':
            if (type === 'log') {
                // Matches: System.out.print(), println(), printf()
                logRegex = /(System\.out\.(print|println|printf)\s*\(.*\))/g;
            } else if (type === 'warn') {
                // Matches: Logger.warn()
                logRegex = /(Logger\.warn\s*\(.*\))/g;
            } else if (type === 'error') {
                // Matches: System.err.println(), Logger.error(), Logger.fatal(), Logger.severe()
                logRegex = /(System\.err\.println\s*\(.*\))|(Logger\.(error|fatal|severe)\s*\(.*\))/g;
            } else {
                // Matches all: System.out/err, Logger methods
                logRegex = /(System\.(out|err)\.(print|println|printf)\s*\(.*\))|(Logger\.(info|debug|trace|warn|error|fatal|severe)\s*\(.*\))/g;
            }
            break;



        case 'csharp':
            if (type === 'log') {
                logRegex = /(Console\.Write(Line|)\s*\(.*?\))|(Trace\.TraceInformation\s*\(.*?\))/g;

            } else if (type === 'warn') {
                logRegex = /(Trace\.TraceWarning\s*\(.*\))/g;
            } else if (type === 'error') {
                logRegex = /(Console\.Error\.WriteLine\s*\(.*\))|(Trace\.TraceError\s*\(.*\))/g;
            } else {
                logRegex = /(Console\.Write(Line|)\s*\(.*?\))|(Console\.Error\.WriteLine\s*\(.*?\))|(Trace\.Trace(Information|Warning|Error)\s*\(.*?\))/g;

            }
            break;


        case 'php':
            if (type === 'log') {
                logRegex = /(echo\s+.*?;)|(print\s*\(.*?\);?)/g;
            } else if (type === 'warn') {
                logRegex = /trigger_error\s*\(.*?,\s*E_USER_WARNING\s*\);?/g;
            } else if (type === 'error') {
                logRegex = /(error_log\s*\(.*?\);?)|(trigger_error\s*\(.*?,\s*E_USER_ERROR\s*\);?)/g;
            } else {
                logRegex = /(echo\s+.*?;)|(print\s*\(.*?\);?)|(error_log\s*\(.*?\);?)|(trigger_error\s*\(.*?,\s*E_USER_(WARNING|ERROR)\s*\);?)/g;

            }
            break;




        case 'ruby':
            if (type === 'log') {
                logRegex = /\b(puts|print)\s*(['"]).*?\2/gm;
            } else if (type === 'warn') {
                logRegex = /\bwarn\s*(['"]).*?\1/gm;
            } else if (type === 'error') {
                logRegex = /\bLogger\.error\s*\(.*?\)/gm;
            } else {
                logRegex = /\b(puts|print)\s*(['"]).*?\2|\bwarn\s*(['"]).*?\3|\bLogger\.error\s*\(.*?\)/gm;
            }
            break;





        case 'go':
            if (type === 'log') {
                // Matches: fmt.Println(...), log.Debug(...), log.Info(...)
                logRegex = /(fmt\.(Println|Printf)\s*\(.*?\))|(log\.(Debug|Info)\s*\(.*?\))/g;
            } else if (type === 'warn') {
                // Matches: log.Warn(...), log.Warning(...)
                logRegex = /log\.(Warn|Warning)\s*\(.*?\)/g;
            } else if (type === 'error') {
                // Matches: log.Error(...), log.Fatal(...), log.Panic(...)
                logRegex = /log\.(Error|Fatal|Panic)\s*\(.*?\)/g;
            } else {
                // Matches all levels
                logRegex = /(fmt\.Println\s*\(.*?\))|(log\.(Debug|Info|Warn|Warning|Error|Fatal|Panic)\s*\(.*?\))/g;
            }
            break;
        case 'c':
        case 'cpp':
            if (type === 'log') {
                logRegex = /(printf\s*\((?:[^)(]|\([^)(]*\))*\)\s*;?)|(std::cout\s*<<.*?<<\s*std::endl\s*;?)/g;
            } else if (type === 'warn') {
                logRegex = /(fprintf\s*\(\s*stderr\s*,(?:[^)(]|\([^)(]*\))*\)\s*;?)|(LOG_WARN\s*\(.*?\)\s*;?)/g;
            } else if (type === 'error') {
                logRegex = /(fprintf\s*\(\s*stderr\s*,(?:[^)(]|\([^)(]*\))*\)\s*;?)|(LOG_ERROR\s*\(.*?\)\s*;?)/g;
            } else {
                logRegex = /(printf\s*\((?:[^)(]|\([^)(]*\))*\)\s*;?)|(fprintf\s*\(\s*stderr\s*,(?:[^)(]|\([^)(]*\))*\)\s*;?)|(std::cout\s*<<.*?<<\s*std::endl\s*;?)|(LOG_INFO\s*\(.*?\)\s*;?)|(LOG_WARN\s*\(.*?\)\s*;?)|(LOG_ERROR\s*\(.*?\)\s*;?)/g;
            }
            break;






        default:
            if (type === 'log') {
                logRegex = /console\.log\s*\(.*\)/g;
            } else if (type === 'warn') {
                logRegex = /console\.warn\s*\(.*\)/g;
            } else if (type === 'error') {
                logRegex = /console\.error\s*\(.*\)/g;
            } else {
                logRegex = /console\.(log|warn|error|debug|info|assert|dir|trace|group|groupEnd|time|timeEnd|profile|profileEnd|count)\s*\(.*\)/g;
            }
    }

    let logStatements = [];
    let match;
    while ((match = logRegex.exec(documentText))) {
        let matchRange = new vscode.Range(
            document.positionAt(match.index),
            document.positionAt(match.index + match[0].length)
        );
        logStatements.push(matchRange);
    }

    return logStatements;
}



function activate(context) {
    console.log('console-log-utils is now active');

    // Normal log (no line number) - Cmd+Shift+K
    const insertLogStatement = vscode.commands.registerCommand('extension.insertLogStatement', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        const languageId = editor.document.languageId;

        const normalLogTemplates = {
            'javascript': v => `console.log('${v}: ', ${v});`,
            'typescript': v => `console.log('${v}: ', ${v});`,
            'python': v => `print(f"${v}: {${v}}")`,
            'java': v => `System.out.println("${v}: " + ${v});`,
            'csharp': v => `Console.WriteLine("${v}: " + ${v});`, // ✅ string interpolation in C#
            'php': v => `echo "${v}: " . ${v} . "\\n";`,
            'ruby': v => `puts "${v}: #{${v}}"`,
            'go': v => `fmt.Println("${v}: ", ${v})`,
            'cpp': v => `std::cout << "${v}: " << ${v} << std::endl;`,
            'c': v => `printf("${v}: %s\\n", ${v}); // for strings`,
        };

        const emptyLogTemplates = {
            'javascript': () => `console.log("");`,
            'typescript': () => `console.log("");`,
            'python': () => `print("")`,
            'java': () => `System.out.println("");`,
            'csharp': () => `Console.WriteLine("");`,
            'php': v => `echo "\\n";`,
            'ruby': () => `puts ""`,
            'go': () => `fmt.Println("")`,
            'cpp': () => `std::cout << "" << std::endl;`,
            'c': () => `printf("\\n");`,
        };

        const templateFn = normalLogTemplates[languageId] || (() => 'console.log("");');
        const emptyTemplateFn = emptyLogTemplates[languageId] || (() => 'console.log("");');

        if (text) {
            vscode.commands.executeCommand('editor.action.insertLineAfter')
                .then(() => {
                    const logToInsert = templateFn(text);
                    insertText(logToInsert);
                });
        } else {
            vscode.commands.executeCommand('editor.action.insertLineAfter')
                .then(() => {
                    insertText(emptyTemplateFn());
                });
        }
    });


    // Insert log with line number - Cmd+Shift+L
    const insertLogWithLineNumber = vscode.commands.registerCommand('extension.insertLogWithLineNumber', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        const languageId = editor.document.languageId;

        // Calculate the line number where the log will be inserted.
        // +2 because insertLineAfter inserts on next line (current line + 1),
        // and line numbers are zero-based, so add 1 more for human-readable line number.
        const lineNumber = editor.selection.active.line + 2;

        const logWithLineNumberTemplates = {
            'javascript': (v, line) => `console.log('${v}: ', ${v}, ' (line: ${line})');`,
            'typescript': (v, line) => `console.log('${v}: ', ${v}, ' (line: ${line})');`,
            'python': (v, line) => `print(f"${v}: {${v}} - line ${line}")`,
            'java': (v, line) => `System.out.println("${v}: " + ${v} + " (line: ${line})");`,
            'csharp': (v, line) => `Console.WriteLine("${v}: " + ${v} + " (line: ${line})");`,
            'php': (v, line) => `echo "${v}: " . ${v} . " (line: ${line})\\n";`,
            'ruby': (v, line) => `puts "${v}: #{${v}} (line: ${line})"`,
            'go': (v, line) => `fmt.Printf("${v}: %v (line: %d)\\n", ${v}, ${line})`,
            'cpp': (v, line) => `std::cout << "${v}: " << ${v} << " (line: ${line})" << std::endl;`,
            'c': (v, line) => `printf("${v}: %d (line: ${line})\\n", ${v}, ${line});`,
        };

        // Separate empty templates for when no variable is selected
        const emptyLogWithLineNumberTemplates = {
            'javascript': (line) => `console.log(' (line: ${line})');`,
            'typescript': (line) => `console.log(' (line: ${line})');`,
            'python': (line) => `print(f" - line ${line}")`,
            'java': (line) => `System.out.println(" (line: ${line})");`,
            'csharp': (line) => `Console.WriteLine(" (line: ${line})");`,
            'php': (line) => `echo " (line: ${line})\\n";`,
            'ruby': (line) => `puts " (line: ${line})"`,
            'go': (line) => `fmt.Printf(" (line: %d)\\n", ${line})`,
            'cpp': (line) => `std::cout << " (line: ${line})" << std::endl;`,
            'c': (line) => `printf(" (line: %d)\\n", ${line});`,
        };

        const templateFn = logWithLineNumberTemplates[languageId] || ((v, line) => `console.log('${v}: ', ${v}, ' (line: ${line})');`);
        const emptyTemplateFn = emptyLogWithLineNumberTemplates[languageId] || ((line) => `console.log(' (line: ${line})');`);

        vscode.commands.executeCommand('editor.action.insertLineAfter')
            .then(() => {
                if (text) {
                    const logToInsert = templateFn(text, lineNumber);
                    insertText(logToInsert);
                } else {
                    const logToInsert = emptyTemplateFn(lineNumber);
                    insertText(logToInsert);
                }
            });
    });


    // Warn log with line number - Cmd+Shift+W
    const insertWarnLog = vscode.commands.registerCommand('extension.insertWarnLog', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        const languageId = editor.document.languageId;

        const lineNumber = editor.selection.active.line + 2;

        const warnTemplates = {
            'javascript': (v, line) => `console.warn('${v}: ', ${v}, ' (line: ${line})');`,
            'typescript': (v, line) => `console.warn('${v}: ', ${v}, ' (line: ${line})');`,
            'python': (v, line) => `print(f"WARNING: ${v}: {${v}} - line ${line}")`,
            'java': (v, line) => `System.err.println("WARNING: ${v}: " + ${v} + " (line: ${line})");`,
            'csharp': (v, line) => `Console.WriteLine($"WARNING: ${v}: " + ${v} + " (line: ${line})");`,
            'php': (v, line) => `echo "WARNING: ${v}: " . ${v} . " (line: ${line})\\n";`,
            'ruby': (v, line) => `warn "WARNING: ${v}: #{${v}} (line: ${line})"`,
            'go': (v, line) => `fmt.Printf("WARNING: ${v}: %v (line: %d)\\n", ${v}, ${line})`,
            'cpp': (v, line) => `std::cerr << "WARNING: ${v}: " << ${v} << " (line: ${line})" << std::endl;`,
            'c': (v, line) => `fprintf(stderr, "WARNING: ${v}: %d (line: %d)\\n", ${v}, ${line});`,
        };

        const emptyWarnTemplates = {
            'javascript': (line) => `console.warn(' (line: ${line})');`,
            'typescript': (line) => `console.warn(' (line: ${line})');`,
            'python': (line) => `print(f"WARNING - line ${line}")`,
            'java': (line) => `System.err.println("WARNING (line: ${line})");`,
            'csharp': (line) => `Console.WriteLine("WARNING (line: ${line})");`,
            'php': (line) => `echo "WARNING (line: ${line})\\n";`,
            'ruby': (line) => `warn "WARNING (line: ${line})"`,
            'go': (line) => `fmt.Printf("WARNING (line: %d)\\n", ${line})`,
            'cpp': (line) => `std::cerr << "WARNING (line: ${line})" << std::endl;`,
            'c': (line) => `fprintf(stderr, "WARNING (line: %d)\\n", ${line});`,
        };

        const templateFn = warnTemplates[languageId] || ((v, line) => `console.warn('${v}: ', ${v}, ' (line: ${line})');`);
        const emptyTemplateFn = emptyWarnTemplates[languageId] || ((line) => `console.warn(' (line: ${line})');`);

        vscode.commands.executeCommand('editor.action.insertLineAfter')
            .then(() => {
                if (text) {
                    insertText(templateFn(text, lineNumber));
                } else {
                    insertText(emptyTemplateFn(lineNumber));
                }
            });
    });

    // Error log with line number - Cmd+Shift+E
    const insertErrorLog = vscode.commands.registerCommand('extension.insertErrorLog', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        const languageId = editor.document.languageId;

        const lineNumber = editor.selection.active.line + 2;

        const errorTemplates = {
            'javascript': (v, line) => `console.error('${v}: ', ${v}, ' (line: ${line})');`,
            'typescript': (v, line) => `console.error('${v}: ', ${v}, ' (line: ${line})');`,
            'python': (v, line) => `print(f"ERROR: ${v}: {${v}} - line ${line}")`,
            'java': (v, line) => `System.err.println("ERROR: ${v}: " + ${v} + " (line: ${line})");`,
            'csharp': (v, line) => `Console.WriteLine($"ERROR: ${v}: " + ${v} + $" (line: ${line})");`,
            'php': (v, line) => `echo "ERROR: ${v}: " . ${v} . " (line: ${line})\\n";`,
            'ruby': (v, line) => `warn "ERROR: ${v}: #{${v}} (line: ${line})"`,
            'go': (v, line) => `fmt.Printf("ERROR: ${v}: %v (line: %d)\\n", ${v}, ${line})`,
            'cpp': (v, line) => `std::cerr << "ERROR: ${v}: " << ${v} << " (line: ${line})" << std::endl;`,
            'c': (v, line) => `fprintf(stderr, "ERROR: ${v}: %d (line: %d)\\n", ${v}, ${line});`,
        };


        const emptyErrorTemplates = {
            'javascript': (line) => `console.error(' (line: ${line})');`,
            'typescript': (line) => `console.error(' (line: ${line})');`,
            'python': (line) => `print(f"ERROR - line ${line}")`,
            'java': (line) => `System.err.println("ERROR (line: ${line})");`,
            'csharp': (line) => `Console.WriteLine($"ERROR (line: ${line})");`,
            'php': (line) => `echo "ERROR (line: ${line})\\n";`,
            'ruby': (line) => `warn "ERROR (line: ${line})"`,
            'go': (line) => `fmt.Printf("ERROR (line: %d)\\n", ${line})`,
            'cpp': (line) => `std::cerr << "ERROR (line: ${line})" << std::endl;`,
            'c': (line) => `fprintf(stderr, "ERROR (line: %d)\\n", ${line});`,
        };

        const templateFn = errorTemplates[languageId] || ((v, line) => `console.error('${v}: ', ${v}, ' (line: ${line})');`);
        const emptyTemplateFn = emptyErrorTemplates[languageId] || ((line) => `console.error(' (line: ${line})');`);

        vscode.commands.executeCommand('editor.action.insertLineAfter')
            .then(() => {
                if (text) {
                    insertText(templateFn(text, lineNumber));
                } else {
                    insertText(emptyTemplateFn(lineNumber));
                }
            });
    });


   

    // Select all log statements - Cmd+Shift+D (or change keybinding)
    const selectAllLogs = vscode.commands.registerCommand('extension.selectAllLogs', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const documentText = document.getText();
        const logStatements = getAllLogStatements(document, documentText, 'all');

        if (logStatements.length === 0) {
            vscode.window.showInformationMessage('No log statements found to select');
            return;
        }

        // Create individual selections for each log statement found
        editor.selections = logStatements.map(range => new vscode.Selection(range.start, range.end));
        editor.revealRange(logStatements[0]); // Scroll to the first one

        vscode.window.showInformationMessage(`${logStatements.length} log statement(s) selected`);
    });


    const selectNormalLogs = vscode.commands.registerCommand('extension.selectNormalLogs', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const documentText = document.getText();
        const logStatements = getAllLogStatements(document, documentText, 'log');

        if (logStatements.length === 0) {
            vscode.window.showInformationMessage('No normal log statements found to select');
            return;
        }

        // Create individual selections for each matched normal log
        editor.selections = logStatements.map(range => new vscode.Selection(range.start, range.end));
        editor.revealRange(logStatements[0]); // Scroll to the first one

        vscode.window.showInformationMessage(`${logStatements.length} normal log(s) selected`);
    });



    // Select only warn logs
    const selectWarnLogs = vscode.commands.registerCommand('extension.selectWarnLogs', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const documentText = document.getText();
        const logStatements = getAllLogStatements(document, documentText, 'warn');

        if (logStatements.length === 0) {
            vscode.window.showInformationMessage('No warn log statements found to select');
            return;
        }

        // Create individual selections for each warn log
        editor.selections = logStatements.map(range => new vscode.Selection(range.start, range.end));
        editor.revealRange(logStatements[0]);

        vscode.window.showInformationMessage(`${logStatements.length} warn log(s) selected`);
    });


    // Select only error logs
    const selectErrorLogs = vscode.commands.registerCommand('extension.selectErrorLogs', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const documentText = document.getText();
        const logStatements = getAllLogStatements(document, documentText, 'error');

        if (logStatements.length === 0) {
            vscode.window.showInformationMessage('No error log statements found to select');
            return;
        }

        // Create individual selections for each matched error log
        editor.selections = logStatements.map(range => new vscode.Selection(range.start, range.end));
        editor.revealRange(logStatements[0]); // Scroll to the first one

        vscode.window.showInformationMessage(`${logStatements.length} error log(s) selected`);
    });



    // Register all commands
    context.subscriptions.push(
        insertLogStatement,
        insertLogWithLineNumber,
        insertWarnLog,
        insertErrorLog,
        selectAllLogs,
        selectNormalLogs,
        selectWarnLogs,
        selectErrorLogs
    );

}



function deactivate() { }

module.exports = {
    activate,
    deactivate
};
