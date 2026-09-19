(async () => {
  const container = document.querySelector(".list");
  if (!container) return;

  let json;
  try {
    const res = await fetch("list.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    json = await res.json();
  } catch (e) {
    container.innerHTML = `<p class="list-status list-error">加载失败：${e.message}</p>`;
    return;
  }

  if (!Array.isArray(json) || json.length === 0) {
    container.innerHTML = '<p class="list-status">暂无内容</p>';
    return;
  }

  container.innerHTML = "";
  for (const item of json) {
    const {
        name,
        url = name,
        author,
        desc,
        copyBtnText = "📋 复制链接",
        copyUrl,
        target = "_blank"
    } = item;

    const card = document.createElement("div");
    card.className = "item";

    const row = document.createElement("div");
    row.className = "item-row";

    const link = document.createElement("a");
    link.href = url;
    link.target = target;

    const nameEl = document.createElement("span");
    nameEl.className = "item-name";
    nameEl.textContent = name;
    link.appendChild(nameEl);

    if (author) {
      const authorEl = document.createElement("span");
      authorEl.className = "item-author";
      authorEl.textContent = `作者：${author}`;
      link.appendChild(authorEl);
    }

    if (desc) {
      const descEl = document.createElement("span");
      descEl.className = "item-desc";
      descEl.innerHTML = desc;
      link.appendChild(descEl);
    }

    row.appendChild(link);

    /* copy button */
    if (copyBtnText) {
      const btn = document.createElement("button");
      btn.innerHTML = copyBtnText;
      btn.title = "点击复制";
      btn.className = "copy-btn";
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          btn.innerHTML = "📋 正在获取链接";
          const text = copyUrl
            ? await (await fetch(copyUrl)).text()
            : new URL(url, location.href).href;
          await navigator.clipboard.writeText(text.trim());
          btn.innerHTML = "✅ 已复制";
          setTimeout(() => (btn.innerHTML = copyBtnText), 1500);
        } catch {
          btn.innerHTML = "❌ 失败";
          setTimeout(() => (btn.innerHTML = copyBtnText), 1500);
        }
      });
      row.appendChild(btn);
    }

    card.appendChild(row);
    container.appendChild(card);
  }
})();
