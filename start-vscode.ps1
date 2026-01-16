# Launch VS Code with extensions stored in this project folder
# Instead of C:\Users\<username>\.vscode\extensions

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$extensionsDir = Join-Path $projectDir ".vscode-extensions"

Write-Host "Starting VS Code with local extensions directory..."
Write-Host "Extensions will be stored in: $extensionsDir"

code --extensions-dir "$extensionsDir" "$projectDir"
