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
  document.querySelector('#prev-btn').addEventListener('click', () => {
    const curPage = getCurrentPage();
    if (curPage === '1') {
      return;
    }
    if (vscode) {
      vscode.postMessage({
        command: 'prev',
        page: curPage
      });
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
      vscode.postMessage({
        command: 'next',
        page: curPage
      });
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
        vscode.postMessage({
          command: 'goto',
          page
        });
      }
    });
  });
})();
