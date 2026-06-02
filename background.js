async function syncRules() {
  const res = await fetch(chrome.runtime.getURL('sites.json'));
  const { redirectTo, sites } = await res.json();
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map(r => r.id),
    addRules: sites.map((site, i) => ({
      id: i + 1,
      priority: 1,
      action: { type: 'redirect', redirect: { url: redirectTo } },
      condition: {
        urlFilter: `||${site}`,
        resourceTypes: ['main_frame'],
      },
    })),
  });
}

chrome.runtime.onInstalled.addListener(syncRules);
chrome.runtime.onStartup.addListener(syncRules);
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SYNC_RULES') syncRules();
});
