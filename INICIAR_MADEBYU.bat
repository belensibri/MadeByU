@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ===============================================
echo    MadeByU - Prototipo React para pruebas UX
echo ===============================================
echo.
where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js no esta instalado.
  echo Instala Node.js 20 o superior desde https://nodejs.org/
  pause
  exit /b 1
)
if not exist node_modules (
  echo Instalando dependencias por primera vez...
  call npm install
  if errorlevel 1 (
    echo No se pudieron instalar las dependencias. Revisa tu conexion.
    pause
    exit /b 1
  )
)
echo.
echo Abre la URL local que aparecera a continuacion (por ejemplo http://localhost:5173).
echo Para detener el sitio pulsa Ctrl+C en esta ventana.
call npm run dev
pause
