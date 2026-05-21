
@echo off
echo =======================================
echo Compilando modulo Cachivachez NANA...
echo =======================================

cd /d "%~dp0"

if exist bin rmdir /s /q bin
mkdir bin

:: Compilación directa apuntando al archivo Usuario.java corregido
javac -cp "lib\*" -d bin src\com\nana\config\ConexionBD.java src\com\nana\model\Usuario.java src\com\nana\dao\UsuarioDAO.java src\com\nana\controller\UsuarioController.java src\com\nana\App.java

if %errorlevel% equ 0 (
    echo.
    echo [OK] Compilacion REAL exitosa. Carpeta 'bin' creada con exito.
) else (
    echo.
    echo [ERROR] Hubo un problema con la escritura del codigo Java.
)
pause
