@echo off
title FRIDAY — Monarch Detailing OS
cd /d C:\Users\bmaka\friday

:: Create lock file so dashboard poller knows Telegram channel is active
echo %date% %time% > .telegram-channel-active

:: Start heartbeat in background (refreshes lock every 60s)
:: Using ping instead of timeout — timeout fails silently under start /b
start /b cmd /v:on /c "for /L %%i in (1,1,999999) do (echo !date! !time! > .telegram-channel-active & ping -n 61 127.0.0.1 >nul)"

:: Launch FRIDAY with Telegram channel and auto-accept edits
claude --channels "plugin:telegram@claude-plugins-official"

:: Clean up lock file when session ends
del .telegram-channel-active 2>nul
