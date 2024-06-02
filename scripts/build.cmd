@echo off
SETLOCAL EnableDelayedExpansion

SET DIST=%~dp0..\dist

if exist %DIST% npx rimraf %DIST%
mkdir %DIST%

echo Copying files...

FOR /R src %%G IN (*.css) DO (
    SET "source=%%G"
    SET "relative=%%~dpG"
    SET "relative=!relative:src\=dist\!"
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

npx tsc || echo Build failed && exit /b 1