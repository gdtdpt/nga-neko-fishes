(function () {
  const vscode = acquireVsCodeApi();

  // format <a> tab
  document.querySelectorAll('.threads .content a:not(.page-link)').forEach(aTag => {
    aTag.textContent = `[${aTag.href}]`;
  });

  // format emoji
  document.querySelectorAll('.threads .content img.emoji').forEach(el => {
    const dataType = el.getAttribute('data-type') || 'def';
    const dataKey = el.getAttribute('data-key');
    if (dataType && dataKey) {
      const typeMap = emoji[dataType];
      for (const key of Object.keys(typeMap)) {
        if (key === dataKey) {
          el.src = `${emojiPrefix}${typeMap[key]}`;
          break;
        }
      }
    }
  });

  const getCurrentPage = () => {
    const activeItem = document.querySelector('.page-item.active .page-link');
    return activeItem.textContent;
  };
  const getLastPage = () => {
    const pageLinks = document.querySelectorAll(`.page-item.page-btn .page-link`);
    return pageLinks[pageLinks.length - 1].textContent;
  };
  const scrollToTop = () => {
    // 先不这样搞
    // window.scrollTo({
    //   left: 0,
    //   top: 0,
    //   behavior': 'auto'
    // });
  };
  const postMessage = (command, page) => {
    vscode.postMessage({
      command,
      page
    });
  };
  // const timeout = 1000;
  document.querySelectorAll('.threads .content img.image').forEach(el => {
    el.addEventListener('click', event => {
      const link = event.target.src;
      if (vscode) {
        vscode.postMessage({
          command: 'image',
          link
        });
      }
    });
  });
  document.querySelector('#prev-btn').addEventListener('click', () => {
    const curPage = getCurrentPage();
    if (curPage === '1') {
      return;
    }
    if (vscode) {
      scrollToTop();
      // setTimeout(() => {
      postMessage('prev', curPage);
      // }, timeout);
    }
  });
  document.querySelector('#next-btn').addEventListener('click', () => {
    const curPage = getCurrentPage();
    const maxPage = getLastPage();
    if (curPage === maxPage) {
      return;
    }
    if (vscode) {
      scrollToTop();
      // setTimeout(() => {
      postMessage('next', curPage);
      // }, timeout);
    }
  });
  document.querySelectorAll('.page-item.page-btn .page-link').forEach(el => {
    el.addEventListener('click', event => {
      const page = event.target.textContent;
      const curPage = getCurrentPage();
      if (page === curPage) {
        return;
      }
      if (vscode) {
        scrollToTop();
        // setTimeout(() => {
        postMessage('goto', page);
        // }, timeout);
      }
    });
  });
})();
