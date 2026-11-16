'use strict';
const familyKey = 'castor_analytics_family_v1';
const excludedKey = 'castor_analytics_excluded_v1';
const form = document.getElementById('family');
const slot = document.getElementById('slot');
const exclude = document.getElementById('exclude');
const status = document.getElementById('status');
const valid = new Set(Array.from(slot.options, option => option.value));

function display(savedMessage = '') {
  const saved = localStorage.getItem(familyKey) || '';
  slot.value = valid.has(saved) ? saved : '';
  const excluded = localStorage.getItem(excludedKey) === '1';
  exclude.checked = excluded;
  const browserBlocksAnalytics = navigator.globalPrivacyControl || navigator.doNotTrack === '1';
  const mode = excluded ? '数えない（除外中）'
    : browserBlocksAnalytics ? '数えない（ブラウザーのプライバシー設定で停止中）'
    : slot.value ? '家族として数える設定' : '未判定として数える設定';
  status.textContent = savedMessage + slot.selectedOptions[0].textContent + ' ／ ' + mode;
}

try {
  display();
} catch (_) {
  status.textContent = 'ブラウザーの保存領域を利用できません。';
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!valid.has(slot.value)) return;
  try {
    // Apply an explicit opt-out before saving the assignment. Keep an existing
    // opt-out in place until the assignment has been saved successfully.
    if (exclude.checked) localStorage.setItem(excludedKey, '1');
    if (slot.value) localStorage.setItem(familyKey, slot.value);
    else localStorage.removeItem(familyKey);
    if (!exclude.checked) localStorage.removeItem(excludedKey);
    display('保存しました。');
  } catch (_) {
    status.textContent = '設定を保存できませんでした。ページを開き直して状態を確認してください。';
  }
});
