@echo off
echo =======================================
echo Compilando modulo Cachivachez NANA...
echo =======================================

javac -cp "lib/*" -d bin src/com/com/nana/config/*.java src/com/com/nana/model/*.java src/com/com/nana/dao/*.java src/com/com/nana/controller/*.java src/com/com/nana/*.java

if %errorlevel% equ 0 (
    echo.
    echo [OK] Compilacion exitosa. Proyecto listo en la carpeta 'bin'.
) else (
    echo.
    echo [ERROR] Hubo un problema al compilar el codigo Java.
)
pause
