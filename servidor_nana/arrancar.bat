@echo off
echo =======================================
echo Iniciando Servidor Cachivachez NANA...
echo =======================================

cd /d "%~dp0"

:: Forzamos a Java a leer absolutamente todas las librerías .jar de la carpeta lib de forma automática
java -cp "bin;lib\*" com.nana.App
pause


