# Markdown Slash Menu

В `.md` файлах набери `/` в начале строки или после пробела — появится меню:
заголовки, **жирный**, *курсив*, ~~зачёркнутый~~, таблицы, списки, задачи, цитаты,
блоки кода, callout'ы, спойлеры, формулы, Mermaid и т.д.

Можно сразу печатать название: `/bold`, `/table`, `/жирный`, `/таблица`.

Не срабатывает внутри блоков кода, `inline code` и в ссылках вида `http://`.

## Добавить свою команду

В `extension.js` в массив `ITEMS` добавь объект:

```js
{ cmd: 'kbd', label: 'Клавиша', detail: '<kbd>', aliases: 'key клавиша', snippet: '<kbd>${1:Ctrl}</kbd>$0' }
```

## Сборка

```bash
npm i -g @vscode/vsce
vsce package
code --install-extension markdown-slash-menu-0.1.0.vsix
```

Отладка: открыть папку в VS Code и нажать `F5`.
