@echo off
setlocal enabledelayedexpansion

:: Define the fixed local port you want to use
set FIXED_PORT=65534

:: Take input from the user for the remote port
set /p destination_port="Enter your remote Node starting port number: "

:: Check if the fixed port is available
netstat -an | find ":%FIXED_PORT%" > nul
if errorlevel 1 (
    echo Local port %FIXED_PORT% is available.
    set chosen_port=%FIXED_PORT%
) else (
    echo --------------------------------------------------------------------------
    echo ERROR: Port %FIXED_PORT% is already in use!
    echo Please close any application using this port and try again.
    echo You can find what's using the port with: netstat -ano ^| find ":%FIXED_PORT%"
    echo --------------------------------------------------------------------------
    exit /b 1
)

echo --------------------------------------------------------------------------
echo         You will be able to access your application at:
echo         http://localhost:%FIXED_PORT%
echo         after completing the steps below...
echo --------------------------------------------------------------------------

echo Building SSH tunnel using port %FIXED_PORT%...
set /p cwl_name="Enter your CWL name: "

:: Try to find ssh in the system's PATH
where /q ssh
if not errorlevel 1 (
    ssh -L %FIXED_PORT%:localhost:%destination_port% %cwl_name%@remote.students.cs.ubc.ca
    goto :end
)

:: Check for Plink availability and run the appropriate command
if exist "%ProgramFiles%\PuTTY\plink.exe" (
    "%ProgramFiles%\PuTTY\plink.exe" -L %FIXED_PORT%:localhost:%destination_port% %cwl_name%@remote.students.cs.ubc.ca
    goto :end
) else if exist "%ProgramFiles(x86)%\PuTTY\plink.exe" (
    "%ProgramFiles(x86)%\PuTTY\plink.exe" -L %FIXED_PORT%:localhost:%destination_port% %cwl_name%@remote.students.cs.ubc.ca
    goto :end
) else (
    echo Neither SSH nor PuTTY's Plink was found on your system.
    echo If you have SSH or PuTTY installed, please ensure they are in the expected paths or add them to your PATH variable.
    echo Otherwise, you might need to manually set up the SSH tunnel using your preferred SSH client.
    pause
    exit /b 1
)

:end
exit /b 0
