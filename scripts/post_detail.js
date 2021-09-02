(function () {
  console.log(`post detail script`);
  const vscode = acquireVsCodeApi();

  const getCurrentPage = () => {
    const activeItem = document.querySelector('.page-item.active .page-link');
    return activeItem.textContent;
  };
  const getLastPage = () => {
    const pageLinks = document.querySelectorAll(`.page-item.page-btn .page-link`);
    return pageLinks[pageLinks.length - 1].textContent;
  };
  const scrollToTop = () => {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'auto'
    });
  };
  const postMessage = (command, page) => {
    vscode.postMessage({
      command,
      page
    });
  };
  const timeout = 1000;
  document.querySelector('#prev-btn').addEventListener('click', () => {
    const curPage = getCurrentPage();
    if (curPage === '1') {
      return;
    }
    if (vscode) {
      scrollToTop();
      setTimeout(() => {
        postMessage('prev', curPage);
      }, timeout);
    }
  });
  document.querySelector('#next-btn').addEventListener('click', () => {
    const curPage = getCurrentPage();
    const maxPage = getLastPage();
    console.log(`next`, curPage, maxPage);
    if (curPage === maxPage) {
      return;
    }
    if (vscode) {
      scrollToTop();
      setTimeout(() => {
        postMessage('next', curPage);
      }, timeout);
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
        setTimeout(() => {
          postMessage('goto', page);
        }, timeout);
      }
    });
  });
})();
