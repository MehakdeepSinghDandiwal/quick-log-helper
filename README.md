<p align="center">
  <img src="assets/logo.png" alt="Quick Log Helper Logo" width="200"/>
</p>

# Quick Log Helper

**Quick Log Helper** is a simple yet powerful VS Code extension to insert, select, and delete `console.log`, `console.warn`, and `console.error` statements quickly — supporting multiple programming languages including JavaScript, TypeScript, Python, Java, and more.


---

## 📚 Table of Contents

- [✨ Features](#-features)
- [⚡️ Commands & Shortcuts](#️-commands--shortcuts)
- [🔧 Supported Languages](#-supported-languages)
- [🔍 Language Compatibility Table](#-language-compatibility-table)
- [📥 Installation](#-installation)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Features

- 🔹  Insert standard log statements with or without line number.
- 🟡 Add warn statements to highlight non-critical alerts with context.
- ✂️ Select or delete all logs of a specific type.
- 🔴Add error logs for catching and debugging critical failures.
- ⚙️ Works with popular languages (JS/TS, Python, Java, C++, Go, PHP, etc).

![Quick Log Helper Demo](https://github.com/MehakdeepSinghDandiwal/quick-log-helper/releases/download/quick-log-helper/demo.gif)

## ⚡️ Commands & Shortcuts

| Command                      | Description                          | macOS Shortcut     | Win/Linux Shortcut   |
|-----------------------------|--------------------------------------|--------------------|----------------------|
| Insert Console Log           | Insert `console.log()`              | Shift + Cmd + J    | Shift + Ctrl + J     |
| Insert Console Log with Line | Insert `console.log(' (line: 10)');` with line context | Shift + Cmd + L    | Shift + Ctrl + L     |
| Insert Warn Log              | Insert `console.warn()` with line  | Shift + Cmd + W    | Shift + Ctrl + W     |
| Insert Error Log             | Insert `console.error()` with line | Shift + Cmd + E    | Shift + Ctrl + E     |
| Select All Logs              | Select all console logs            | Shift + Alt + D    | Shift + Alt + D      |
| Select Normal Logs           | Select only `console.log`          | Shift + Alt + L    | Shift + Alt + L      |
| Select Warn Logs             | Select only `console.warn`         | Shift + Alt + W    | Shift + Alt + W      |
| Select Error Logs            | Select only `console.error`        | Shift + Alt + E    | Shift + Alt + E      |

## 🔧 Supported Languages

- JavaScript
- TypeScript
- Python
- Java
- C++
- C
- Go
- PHP
- Ruby
- C#

### 🔍 Language Compatibility Table

Some languages (e.g., Ruby, C++) have limitations due to idiomatic ambiguity or lack of native error/warn split (you could extend regex support later).

| Language   | `log` support         | `warn` support                         | `error` support                                   | Notes                                             |
| ---------- | --------------------- | -------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| JavaScript | ✅ `console.log`       | ✅ `console.warn`                       | ✅ `console.error`                                 | Full support                                      |
| TypeScript | ✅ `console.log`       | ✅ `console.warn`                       | ✅ `console.error`                                 | Full support                                      |
| Python     | ✅ `print`             | ✅ `logging.warn`                       | ✅ `logging.error`                                 | `warn` maps to `warn` or `warning` methods        |
| Java       | ✅ `System.out`        | ✅ `Logger.warn`                        | ✅ `System.err`/`Logger.error`                     | Full support                                      |
| C#         | ✅ `Console.WriteLine` | ⚠️ Partial (`Trace.TraceWarning`)      | ✅ `Console.Error.WriteLine`, `Trace.TraceError`   | Custom logging libs may differ                    |
| PHP        | ✅ `echo`, `print`     | ✅ `trigger_error(..., E_USER_WARNING)` | ✅ `error_log`, `trigger_error(..., E_USER_ERROR)` | Good support with basic idioms                    |
| Ruby       | ✅ `puts`/`print`      | ⚠️ Partial `warn`                      | ⚠️ Limited (`Logger.error`)                       | Ambiguous logging practices; recommend custom lib |
| Go         | ✅ `fmt.Println`       | ✅ `log.Warn*`                          | ✅ `log.Error*`                                    | Case-insensitive logging methods supported        |
| C/C++      | ✅ `printf`, `cout`    | ⚠️ Ambiguous                           | ⚠️ Limited (`fprintf(stderr, ...)`)               | Idiomatic differences make full parsing difficult |

## 📥 Installation

1. Open **Visual Studio Code**  
2. Go to **Extensions** (`Cmd+Shift+X` or `Ctrl+Shift+X`)  
3. Search for **Quick Log Helper**  
4. Click **Install**  
5. Restart Visual Studio Code 

## 📜 License

This project is licensed under the [MIT License](./LICENSE).

---

> Created with ❤️ by [Mehakdeep Singh Dandiwal](https://github.com/MehakdeepSinghDandiwal)
