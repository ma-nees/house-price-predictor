@echo off
REM Launch VS Code with extensions stored in this project folder
REM Instead of C:\Users\<username>\.vscode\extensions

set EXTENSIONS_DIR=%~dp0.vscode-extensions

echo Starting VS Code with local extensions directory...
echo Extensions will be stored in: %EXTENSIONS_DIR%

code --extensions-dir "%EXTENSIONS_DIR%" "%~dp0"

pause
