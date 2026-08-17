@echo off
cls
chcp 65001 > nul

call npm login
call npm version patch --no-git-tag-version
git add -A
git commit -m "Atualização"
git push
call npm publish

pause