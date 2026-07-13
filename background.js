async function syncRules() {
  const res = await fetch(chrome.runtime.getURL('sites.json'));
  const { redirectTo, sites, exceptions = [] } = await res.json();
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  console.log('[redirect] syncRules: removing', existing.length, 'existing rules', existing);

  const redirectRules = sites.map((site, i) => ({
    id: i + 1,
    priority: 1,
    action: { type: 'redirect', redirect: { url: redirectTo } },
    condition: {
      urlFilter: `||${site}`,
      resourceTypes: ['main_frame'],
    },
  }));

  const allowRules = exceptions.map((pattern, i) => ({
    id: sites.length + i + 1,
    priority: 2,
    action: { type: 'allow' },
    condition: {
      urlFilter: `||${pattern}`,
      resourceTypes: ['main_frame'],
    },
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map(r => r.id),
    addRules: [...redirectRules, ...allowRules],
  });
  console.log('[redirect] syncRules: installed', redirectRules.length, 'redirects,', allowRules.length, 'exceptions', { redirectTo, sites, exceptions });
}

if (chrome.declarativeNetRequest.onRuleMatchedDebug) {
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(({ request, rule }) => {
    console.log('[redirect] rule matched', { url: request.url, ruleId: rule.ruleId, type: request.type });
  });
}

chrome.runtime.onInstalled.addListener(syncRules);
chrome.runtime.onStartup.addListener(syncRules);
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SYNC_RULES') syncRules();
});
