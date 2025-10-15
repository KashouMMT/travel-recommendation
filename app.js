// Utilities
const $ = (sel) => document.querySelector(sel);
const resultsEl = typeof document !== 'undefined' ? document.getElementById('results') : null;
const yearSpan = typeof document !== 'undefined' ? document.getElementById('year') : null;
if (yearSpan) yearSpan.textContent = new Date().getFullYear();


let dataCache = null; // cache JSON after first load


async function loadData() {
    if (dataCache) return dataCache;
    const res = await fetch('travel_recommendation_api.json');
    if (!res.ok) throw new Error('Failed to load data JSON');
    const json = await res.json();
    dataCache = json;
    console.log('Loaded data:', json); // Task 6: confirm data in console
    return json;
}


function normalizeKeyword(raw) {
    if (!raw) return '';
    const k = raw.trim().toLowerCase();
    // very light plural handling
    if (k === 'beaches' || k === 'beach') return 'beach';
    if (k === 'temples' || k === 'temple') return 'temple';
    if (k === 'countries' || k === 'country') return 'country';
    return k; // allow country names or anything else
}


function formatLocalTime(timeZone) {
    try {
        const options = { timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date().toLocaleTimeString('en-US', options);
    } catch {
        return null;
    }
}


function cardTemplate(item, showClock = false) {
    const localTime = showClock && item.timeZone ? formatLocalTime(item.timeZone) : null;
    return `
<article class="card">
<img src="${item.imageUrl}" alt="${item.name}"/>
<div class="content">
<h3>${item.name}</h3>
<p>${item.description}</p>
${item.country ? `<div class="meta">${item.country}</div>` : ''}
${localTime ? `<div class="meta">Local time: ${localTime}</div>` : ''}
</div>
</article>
`;
}


function renderResults(items, withClock = false) {
    if (!resultsEl) return;
    if (!items.length) {
        resultsEl.innerHTML = `<p>No results. Try "beach", "temple", or "country".</p>`;
        return;
    }
    resultsEl.innerHTML = items.map((it) => cardTemplate(it, withClock)).join('');
}


async function handleSearch() {
    const keywordRaw = $('#searchInput')?.value || '';
    const k = normalizeKeyword(keywordRaw);
    const data = await loadData();


    let matches = [];
    let showClock = true; // Task 10: show local time where available


    if (k === 'beach') {
        matches = data.beaches.slice(0, 2); // at least two
    } else if (k === 'temple') {
        matches = data.temples.slice(0, 2);
    } else if (k === 'country') {
    }
};