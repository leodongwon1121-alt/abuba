try {
    $raw = [Console]::In.ReadToEnd()
    $inputJson = $raw | ConvertFrom-Json -ErrorAction Stop
    $filePath = $inputJson.tool_input.file_path
} catch {
    exit 0
}

if (-not $filePath) {
    exit 0
}

$codeExtensions = @('.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.html')
$ext = [System.IO.Path]::GetExtension($filePath).ToLower()

if ($codeExtensions -notcontains $ext) {
    exit 0
}

if (-not (Test-Path -LiteralPath $filePath)) {
    exit 0
}

$projectDir = $env:CLAUDE_PROJECT_DIR
if (-not $projectDir) {
    exit 0
}

try {
    Push-Location $projectDir
    npx prettier --write "$filePath" *> $null
    Pop-Location
} catch {
}

exit 0
