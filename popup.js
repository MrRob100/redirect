fetch(chrome.runtime.getURL('sites.json'))
  .then(r => r.json())
  .then(({ sites }) => {
    const ul = document.getElementById('sites');
    for (const site of sites) {
      const li = document.createElement('li');
      li.textContent = site;
      ul.appendChild(li);
    }
  });

chrome.runtime.sendMessage({ type: 'SYNC_RULES' });
