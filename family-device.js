'use strict';
const familyKey = 'castor_analytics_family_v1';
const form = document.getElementById('family');
const slot = document.getElementById('slot');
const status = document.getElementById('status');
const valid = new Set(Array.from(slot.options, option => option.value));

function display() {
  const saved = localStorage.getItem(familyKey) || '';
  slot.value = valid.has(saved) ? saved : '';
  const registration = slot.selectedOptions[0].textContent;
  const excluded = localStorage.getItem('castor_analytics_excluded_v1') === '1';
  status.textContent = '現在の設定：' + registration + (excluded ? '（アクセス集計から除外中）' : '');
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
    if (slot.value) localStorage.setItem(familyKey, slot.value);
    else localStorage.removeItem(familyKey);
    display();
  } catch (_) {
    status.textContent = '設定を保存できませんでした。';
  }
});
