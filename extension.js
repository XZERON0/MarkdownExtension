// Markdown Slash Menu
// Работает ТОЛЬКО в markdown-файлах. Вводишь "/" -> появляется список действий.
const vscode = require('vscode');

// ---------------------------------------------------------------------------
// Список команд. Чтобы добавить свою — просто добавь объект в массив.
//   cmd      — что набирать после "/"  (например /bold)
//   label    — название в списке
//   detail   — подсказка справа
//   aliases  — доп. слова для поиска (рус/англ)
//   snippet  — что вставится. Синтаксис сниппетов VS Code:
//              ${1:текст} — таб-стоп с текстом по умолчанию, $0 — финальный курсор
//              Символ "$" нужно писать как \\$
//   command  — (необязательно) id команды, которая выполнится вместо snippet
// ---------------------------------------------------------------------------
const ITEMS = [
  // --- Заголовки ---
  { cmd: 'h1', label: 'Заголовок 1', detail: '# Заголовок', aliases: 'heading title заголовок', snippet: '# ${1:Заголовок}' },
  { cmd: 'h2', label: 'Заголовок 2', detail: '## Заголовок', aliases: 'heading заголовок', snippet: '## ${1:Заголовок}' },
  { cmd: 'h3', label: 'Заголовок 3', detail: '### Заголовок', aliases: 'heading заголовок', snippet: '### ${1:Заголовок}' },
  { cmd: 'h4', label: 'Заголовок 4', detail: '#### Заголовок', aliases: 'heading заголовок', snippet: '#### ${1:Заголовок}' },
  { cmd: 'h5', label: 'Заголовок 5', detail: '##### Заголовок', aliases: 'heading заголовок', snippet: '##### ${1:Заголовок}' },
  { cmd: 'h6', label: 'Заголовок 6', detail: '###### Заголовок', aliases: 'heading заголовок', snippet: '###### ${1:Заголовок}' },

  // --- Оформление текста ---
  { cmd: 'bold', label: 'Жирный', detail: '**текст**', aliases: 'strong жирный полужирный', snippet: '**${1:текст}**$0' },
  { cmd: 'italic', label: 'Курсив', detail: '*текст*', aliases: 'em курсив наклонный', snippet: '*${1:текст}*$0' },
  { cmd: 'bolditalic', label: 'Жирный курсив', detail: '***текст***', aliases: 'жирный курсив', snippet: '***${1:текст}***$0' },
  { cmd: 'strike', label: 'Зачёркнутый', detail: '~~текст~~', aliases: 'strikethrough зачеркнутый зачёркнутый', snippet: '~~${1:текст}~~$0' },
  { cmd: 'code', label: 'Код в строке', detail: '`код`', aliases: 'inline code код моноширинный', snippet: '`${1:код}`$0' },
  { cmd: 'mark', label: 'Выделение маркером', detail: '<mark>текст</mark>', aliases: 'highlight выделить маркер', snippet: '<mark>${1:текст}</mark>$0' },
  { cmd: 'sup', label: 'Верхний индекс', detail: '<sup>текст</sup>', aliases: 'superscript степень', snippet: '<sup>${1:текст}</sup>$0' },
  { cmd: 'sub', label: 'Нижний индекс', detail: '<sub>текст</sub>', aliases: 'subscript', snippet: '<sub>${1:текст}</sub>$0' },

  // --- Блоки ---
  { cmd: 'codeblock', label: 'Блок кода', detail: '```язык', aliases: 'code fence блок код', snippet: '```${1:js}\n${2}\n```\n$0' },
  { cmd: 'quote', label: 'Цитата', detail: '> текст', aliases: 'blockquote цитата', snippet: '> ${1:цитата}' },
  { cmd: 'hr', label: 'Разделитель', detail: '---', aliases: 'divider line разделитель линия', snippet: '\n---\n\n$0' },
  { cmd: 'details', label: 'Спойлер (сворачиваемый блок)', detail: '<details>', aliases: 'spoiler collapse toggle спойлер', snippet: '<details>\n<summary>${1:Заголовок}</summary>\n\n${2:Содержимое}\n\n</details>\n$0' },

  // --- Списки ---
  { cmd: 'ul', label: 'Маркированный список', detail: '- пункт', aliases: 'bullet list список', snippet: '- ${1:пункт}\n- ${2}\n- $0' },
  { cmd: 'ol', label: 'Нумерованный список', detail: '1. пункт', aliases: 'numbered ordered список', snippet: '1. ${1:пункт}\n2. ${2}\n3. $0' },
  { cmd: 'todo', label: 'Список задач', detail: '- [ ] задача', aliases: 'task checkbox чекбокс задачи', snippet: '- [ ] ${1:задача}\n- [ ] ${2}\n- [ ] $0' },

  // --- Таблицы ---
  { cmd: 'table', label: 'Таблица… (спросит размер)', detail: 'колонки × строки', aliases: 'таблица grid', command: 'mdSlash.insertTable' },
  {
    cmd: 'table2', label: 'Таблица 2×2', detail: '2 колонки, 2 строки', aliases: 'таблица',
    snippet: '| ${1:Заголовок 1} | ${2:Заголовок 2} |\n| --- | --- |\n| ${3} | ${4} |\n| ${5} | ${6} |\n$0',
  },
  {
    cmd: 'table3', label: 'Таблица 3×3', detail: '3 колонки, 3 строки', aliases: 'таблица',
    snippet: '| ${1:Заголовок 1} | ${2:Заголовок 2} | ${3:Заголовок 3} |\n| --- | --- | --- |\n| ${4} | ${5} | ${6} |\n| ${7} | ${8} | ${9} |\n| ${10} | ${11} | ${12} |\n$0',
  },

  // --- Ссылки и медиа ---
  { cmd: 'link', label: 'Ссылка', detail: '[текст](url)', aliases: 'url href ссылка', snippet: '[${1:текст}](${2:https://})$0' },
  { cmd: 'image', label: 'Картинка', detail: '![alt](url)', aliases: 'img picture картинка изображение', snippet: '![${1:описание}](${2:путь или url})$0' },
  { cmd: 'footnote', label: 'Сноска', detail: '[^1]', aliases: 'footnote сноска', snippet: '[^${1:1}]$0' },
  { cmd: 'footnotedef', label: 'Текст сноски', detail: '[^1]: текст', aliases: 'footnote сноска', snippet: '[^${1:1}]: ${2:текст сноски}\n$0' },

  // --- Callout'ы (GitHub-стиль) ---
  { cmd: 'note', label: 'Callout: Заметка', detail: '> [!NOTE]', aliases: 'callout alert заметка', snippet: '> [!NOTE]\n> ${1:текст}\n$0' },
  { cmd: 'tip', label: 'Callout: Совет', detail: '> [!TIP]', aliases: 'callout alert совет', snippet: '> [!TIP]\n> ${1:текст}\n$0' },
  { cmd: 'important', label: 'Callout: Важно', detail: '> [!IMPORTANT]', aliases: 'callout alert важно', snippet: '> [!IMPORTANT]\n> ${1:текст}\n$0' },
  { cmd: 'warning', label: 'Callout: Предупреждение', detail: '> [!WARNING]', aliases: 'callout alert предупреждение', snippet: '> [!WARNING]\n> ${1:текст}\n$0' },
  { cmd: 'caution', label: 'Callout: Осторожно', detail: '> [!CAUTION]', aliases: 'callout alert осторожно опасно', snippet: '> [!CAUTION]\n> ${1:текст}\n$0' },

  // --- Прочее ---
  { cmd: 'math', label: 'Формула (блок)', detail: '$$ ... $$', aliases: 'latex katex формула', snippet: '\\$\\$\n${1:E = mc^2}\n\\$\\$\n$0' },
  { cmd: 'mermaid', label: 'Диаграмма Mermaid', detail: '```mermaid', aliases: 'diagram flowchart диаграмма схема', snippet: '```mermaid\n${1:graph TD\n  A --> B}\n```\n$0' },
  { cmd: 'date', label: 'Сегодняшняя дата', detail: 'ГГГГ-ММ-ДД', aliases: 'today date дата сегодня', snippet: '${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}' },
  { cmd: 'toc', label: 'Оглавление (комментарий-метка)', detail: '[TOC]', aliases: 'contents оглавление', snippet: '[TOC]\n$0' },
];

// ---------------------------------------------------------------------------
// Проверки контекста: не показываем меню там, где "/" — просто символ.
// ---------------------------------------------------------------------------

/** Находится ли строка внутри ``` / ~~~ блока кода. */
function isInsideCodeFence(document, line) {
  let inside = false;
  for (let i = 0; i < line; i++) {
    if (/^\s{0,3}(```|~~~)/.test(document.lineAt(i).text)) inside = !inside;
  }
  return inside;
}

/** Нечётное число ` до курсора => мы внутри `inline code`. */
function isInsideInlineCode(textBeforeCursor) {
  return (textBeforeCursor.match(/`/g) || []).length % 2 === 1;
}

// ---------------------------------------------------------------------------
// Провайдер автодополнения
// ---------------------------------------------------------------------------
const provider = {
  provideCompletionItems(document, position) {
    const before = document.lineAt(position.line).text.slice(0, position.character);

    // "/" в начале строки или после пробела (чтобы не срабатывало на http://, and/or и т.п.)
    const m = /(^|\s)\/([^\s/]*)$/.exec(before);
    if (!m) return undefined;

    if (isInsideInlineCode(before)) return undefined;
    if (isInsideCodeFence(document, position.line)) return undefined;

    const slashCol = m.index + m[1].length;
    const range = new vscode.Range(position.line, slashCol, position.line, position.character);

    return ITEMS.map((it, i) => {
      const item = new vscode.CompletionItem(
        { label: it.label, description: it.detail },
        vscode.CompletionItemKind.Snippet
      );
      item.filterText = `/${it.cmd} ${it.aliases || ''}`;
      item.sortText = String(i).padStart(3, '0');
      item.range = range;
      item.documentation = new vscode.MarkdownString('`/' + it.cmd + '` — ' + it.label);

      if (it.command) {
        item.insertText = ''; // просто удаляем "/xxx", дальше работает команда
        item.command = { command: it.command, title: it.label };
      } else {
        item.insertText = new vscode.SnippetString(it.snippet);
      }
      return item;
    });
  },
};

// ---------------------------------------------------------------------------
// Команда: таблица произвольного размера
// ---------------------------------------------------------------------------
async function insertTable() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const input = await vscode.window.showInputBox({
    prompt: 'Размер таблицы: колонки x строки (без заголовка)',
    value: '3x3',
    validateInput: (v) => (/^\s*\d+\s*[xх×*]\s*\d+\s*$/i.test(v) ? null : 'Формат: 3x4'),
  });
  if (!input) return;

  const [cols, rows] = input.split(/[xх×*]/i).map((n) => Math.min(Math.max(parseInt(n, 10), 1), 50));

  let tab = 1; // счётчик таб-стопов
  const row = (placeholder) =>
    '| ' + Array.from({ length: cols }, (_, c) => (placeholder ? `\${${tab++}:${placeholder} ${c + 1}}` : `\${${tab++}}`)).join(' | ') + ' |';

  const lines = [row('Заголовок'), '| ' + Array(cols).fill('---').join(' | ') + ' |'];
  for (let r = 0; r < rows; r++) lines.push(row(null));

  await editor.insertSnippet(new vscode.SnippetString(lines.join('\n') + '\n$0'));
}

// ---------------------------------------------------------------------------
function activate(context) {
  context.subscriptions.push(
    // Только markdown-файлы (и на диске, и "untitled")
    vscode.languages.registerCompletionItemProvider(
      [{ language: 'markdown', scheme: 'file' }, { language: 'markdown', scheme: 'untitled' }],
      provider,
      '/' // символ-триггер
    ),
    vscode.commands.registerCommand('mdSlash.insertTable', insertTable)
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
