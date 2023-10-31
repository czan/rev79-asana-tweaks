let updateJob = null;

function isDarkMode() {
  return document.body.className.includes('DesignTokenThemeSelectors-theme--darkMode');
}

function red() {
  return isDarkMode() ? '#440000' : '#ffbbbb';
}

function green() {
  return isDarkMode() ? '#004400' : '#bbffbb';
}

function calculateStyles(input, mappings={}) {
  const text = input.toLocaleLowerCase();
  if (text.includes('[b]')) {
    return mappings['blocked'] || {background: red()};
  } else if (text.includes('[!]')) {
    return mappings['priority'] || {background: green()};
  } else {
    return {};
  }
}

function colorizeBoard() {
  document.querySelectorAll('.BoardCardLayout').forEach(el => {
    Object.assign(
      el.style,
      {background: null},
      calculateStyles(el.querySelector('.BoardCardLayout-titleAndIndicator')?.innerText || '')
    );
  });
}

function colorizeList() {
  document.querySelectorAll('.SpreadsheetRow').forEach(el => {
    const dragHandle = el.querySelector('.DraggableSpreadsheetTaskRow-dragHandle');
    if (dragHandle) {
      Object.assign(
        dragHandle.style,
        {background: null},
        calculateStyles(el.querySelector('textarea')?.value || '')
      );
    }
  });
}

const observer = new MutationObserver(changes => {
  if (updateJob == null) {
    updateJob = setTimeout(() => {
      try {
        colorizeBoard();
        colorizeList();
      } finally {
        updateJob = null;
      }
    }, 250);
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
  characterData: true
});
