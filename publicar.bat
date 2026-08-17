@echo off

npm version patch
git add -A
git commit -m "Atualização"
git push
npm publish

pause