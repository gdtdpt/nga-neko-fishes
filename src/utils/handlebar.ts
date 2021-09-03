
let handlebars: typeof import('handlebars') | undefined;
export async function getHandlebarsWithHelpers(): Promise<typeof import('handlebars')> {
  if (!handlebars) {
    handlebars = await import('handlebars');

    handlebars.registerHelper('pagination', (curPage: number, totalPages: number) => {
      let pageItems = prevBtn(curPage);
      if (totalPages > 9) {
        pageItems += pageItemsWithDash(curPage, totalPages);
      } else {
        for (let i = 0; i < totalPages; i++) {
          const pageNum = i + 1;
          pageItems += pageItem(pageNum, pageNum === curPage);
        }
      }
      pageItems += nextBtn(curPage, totalPages);
      return pageItems;
    });

    handlebars.registerHelper('content', (content: string): string => {
      return emojiSupport(content
        .replace(/\[quote\]/g, '<blockquote>').replace(/\[\/quote\]/g, '</blockquote>')
        .replace(/\[b\]/g, '<b>').replace(/\[\/b\]/g, '</b></br>')
        .replace(/\[pid=[\d,]+\]/g, '').replace('[/pid]', '')
        .replace(/\[uid=\d+\]/g, '').replace('[/uid]', '')
        .replace(/\[tid=\d+\]/g, '').replace('[/tid]', '')
        .replace(/\[color=([^\].]+)\]/g, '<font color="$1">').replace(/\[\/color\]/g, '</font>')
        .replace(/\[size=([^\].]+)\]/g, '<span style="font-size:$1">').replace(/\[\/size\]/g, '</span>')
        .replace(/\[list\]/g, '').replace(/\[\/list\]/g, '')
        .replace(/\[\*\]/g, '‣ ')
        .replace(/<img/g, '<img class="image"')
      );
    });

  }
  return handlebars;
}

function emojiSupport(content: string): string {
  return content.replace(/\[s\:([a-z0-9]+)\:([^\].]+)\]/g, '<img class="emoji" data-type="$1" data-key="$2">');
}

function pageItemsWithDash(curPage: number, totalPages: number): string {
  let startPageNum = 2, lastPageNum = totalPages - 1;
  let pageItems = pageItem(1, curPage === 1);
  if (curPage - 2 > startPageNum) {
    startPageNum = curPage - 2;
    pageItems += dashItem();
  }
  if (curPage + 2 < lastPageNum) {
    lastPageNum = curPage + 2;
  }
  for (let i = 0; i <= (lastPageNum - startPageNum); i++) {
    const pageNum = i + startPageNum;
    pageItems += pageItem(pageNum, curPage === pageNum);
  }
  if (lastPageNum < totalPages - 1) {
    pageItems += dashItem();
  }
  pageItems += pageItem(totalPages, curPage === totalPages);
  return pageItems;
}

function prevBtn(curPage: number) {
  const disabled = curPage === 1 ? ' disabled' : '';
  return `
  <li class="page-item">
    <a id="prev-btn" class="page-link${disabled}" href="javascript:void();" aria-label="Previous">
      <span aria-hidden="true">&laquo;</span>
    </a>
  </li>
  `;
}

function nextBtn(curPage: number, totalPages: number) {
  const disabled = curPage === totalPages ? ' disabled' : '';
  return `
  <li class="page-item">
    <a id="next-btn" class="page-link${disabled}" href="javascript:void();" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>
  `;
}

function pageItem(pageNum: number, active = false) {
  const activeClass = active ? ' active' : '';
  return `<li class="page-item page-btn${activeClass}"><a class="page-link" href="javascript:void();">${pageNum}</a></li>`;
}

function dashItem() {
  return `<span class="dash">...</span>`;
}