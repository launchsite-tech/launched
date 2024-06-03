@echo off
SETLOCAL EnableDelayedExpansion

IF "%~1"=="" (
    echo No output directory specified.
    exit /b 1
)

SET DIST=%~1

if exist %DIST% (
    echo Output directory already exists.
    exit /b 1
)
mkdir %DIST%

echo Copying files...

FOR /R src %%G IN (*.css) DO (
    SET "source=%%G"
    SET "relative=%%~dpG"
    SET "relative=!relative:src\=%DIST%\!"
    SET "destination=!relative!%%~nxG"
    IF NOT EXIST "!relative!" (
        mkdir "!relative!"
    )
    COPY "!source!" "!destination!"
)

copy package.json %DIST%
copy README.md %DIST%
copy LICENSE %DIST%

echo Building project...

npx tsc --outDir %DIST% || echo Build failed && exit /b 1