@echo off

call npm version patch --no-git-tag-version
git add -A
git commit -m "Atualização"
git push
call npm publish

pause