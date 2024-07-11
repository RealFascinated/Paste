# Run the frontend and backend concurrently using PowerShell

# Start the frontend process
$frontend = Start-Process -NoNewWindow -FilePath cmd -ArgumentList '/c pnpm --prefix ./frontend run dev' -PassThru

# Start the backend process
$backend = Start-Process -NoNewWindow -FilePath cmd -ArgumentList '/c cd ./backend & go run ./cmd/paste/main.go' -PassThru

# Wait for user input to stop the processes
Read-Host 'Press Enter to stop...\n'

# Kill the processes
Stop-Process -Id $frontend.Id
Stop-Process -Id $backend.Id
