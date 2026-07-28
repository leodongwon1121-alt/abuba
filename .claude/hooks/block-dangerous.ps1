try {
    $raw = [Console]::In.ReadToEnd()
    $inputJson = $raw | ConvertFrom-Json -ErrorAction Stop
    $command = $inputJson.tool_input.command
} catch {
    exit 0
}

if (-not $command) {
    exit 0
}

if ($command -match 'rm\s+(-\w*r\w*f\w*|-\w*f\w*r\w*)\b') {
    Write-Error "Blocked: 'rm -rf' style delete commands are disabled by project hook."
    exit 2
}

if ($command -match 'git\s+push' -and $command -match '(--force\b|-f\b)') {
    Write-Error "Blocked: force push is disabled by project hook."
    exit 2
}

if ($command -match '(?i)\bDROP\s+TABLE\b') {
    Write-Error "Blocked: DROP TABLE is disabled by project hook."
    exit 2
}

exit 0
