(function () {
  const saveBtn = document.querySelector("#saveBtn");
  const cookieInput = document.querySelector("#cookies");
  saveBtn.addEventListener("click", () => {
    const cookie = cookieInput.value;
    if (cookie) {
      sendCookie(cookie.replace(/cookie: /i, ""));
    }
  });
  const sendCookie = (cookie) => {
    if (acquireVsCodeApi) {
      const vscode = acquireVsCodeApi();
      vscode.postMessage({
        cookie,
      });
    }
  };
})();
