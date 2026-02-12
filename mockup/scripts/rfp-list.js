// RFP List Page - JavaScript

// State
let rfps = [];
let currentFilter = 'all';

// DOM Elements
const rfpListContainer = document.getElementById('rfp-list');
const totalCountEl = document.getElementById('total-count');
const analyzingCountEl = document.getElementById('analyzing-count');
const analyzedCountEl = document.getElementById('analyzed-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.querySelector('.search-input');

// Load data
async function loadRfps() {
  try {
    const response = await fetch('../data/rfps.json');
    const data = await response.json();
    rfps = data.data;
    updateStats();
    renderRfps();
  } catch (error) {
    console.error('Failed to load RFPs:', error);
    rfpListContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">⚠️</div>
        <h3 class="empty-state__title">데이터를 불러올 수 없습니다</h3>
        <p class="empty-state__description">잠시 후 다시 시도해주세요.</p>
      </div>
    `;
  }
}

// Update stats
function updateStats() {
  const total = rfps.length;
  const analyzing = rfps.filter(r => r.status === 'analyzing').length;
  const analyzed = rfps.filter(r => r.status === 'analyzed').length;

  totalCountEl.textContent = total;
  analyzingCountEl.textContent = analyzing;
  analyzedCountEl.textContent = analyzed;
}

// Render RFPs
function renderRfps() {
  const filtered = filterRfps();

  if (filtered.length === 0) {
    rfpListContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">📋</div>
        <h3 class="empty-state__title">RFP가 없습니다</h3>
        <p class="empty-state__description">새 RFP를 추가해보세요.</p>
        <button class="btn btn--primary">+ 새 RFP 추가</button>
      </div>
    `;
    return;
  }

  rfpListContainer.innerHTML = filtered.map(rfp => createRfpCard(rfp)).join('');
}

// Filter RFPs
function filterRfps() {
  let filtered = rfps;

  // Status filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(r => r.status === currentFilter);
  }

  // Search filter
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(searchTerm) ||
      r.clientName.toLowerCase().includes(searchTerm)
    );
  }

  return filtered;
}

// Create RFP Card HTML
function createRfpCard(rfp) {
  const statusMap = {
    'received': { label: '접수됨', class: 'received' },
    'analyzing': { label: '분석 중', class: 'analyzing' },
    'analyzed': { label: '분석 완료', class: 'analyzed' },
    'rejected': { label: '거절됨', class: 'rejected' }
  };

  const status = statusMap[rfp.status] || { label: rfp.status, class: 'received' };
  const budget = rfp.estimatedBudget ? formatCurrency(rfp.estimatedBudget) : '-';
  const dueDate = formatDate(rfp.dueDate);
  const receivedDate = formatDate(rfp.receivedDate);

  return `
    <div class="card card--clickable rfp-card" data-id="${rfp.id}">
      <div class="rfp-card__header">
        <div>
          <h3 class="rfp-card__title">${rfp.title}</h3>
          <p class="rfp-card__client">${rfp.clientName}</p>
        </div>
        <span class="badge badge--${status.class}">
          <span class="badge__dot"></span>
          ${status.label}
        </span>
      </div>

      <div class="rfp-card__meta">
        <div class="rfp-card__meta-item">
          <span class="rfp-card__meta-label">접수일</span>
          <span class="rfp-card__meta-value">${receivedDate}</span>
        </div>
        <div class="rfp-card__meta-item">
          <span class="rfp-card__meta-label">마감일</span>
          <span class="rfp-card__meta-value">${dueDate}</span>
        </div>
        <div class="rfp-card__meta-item">
          <span class="rfp-card__meta-label">예상 예산</span>
          <span class="rfp-card__meta-value">${budget}</span>
        </div>
      </div>

      ${rfp.aiAnalysis ? `
        <div class="card__body">
          <p style="font-size: var(--font-size-sm); line-height: 1.6;">
            ${rfp.aiAnalysis.summary}
          </p>
        </div>
      ` : ''}

      <div class="rfp-card__footer">
        <div style="display: flex; gap: var(--spacing-xs);">
          ${rfp.aiAnalysis ? `
            <span class="badge badge--primary badge--sm">
              AI 분석 완료
            </span>
            <span class="badge badge--secondary badge--sm">
              ${rfp.aiAnalysis.estimatedEffort}인월
            </span>
          ` : ''}
        </div>
        <div class="rfp-card__actions">
          <button class="btn btn--ghost btn--sm" onclick="viewRfp('${rfp.id}')">
            상세보기
          </button>
          ${rfp.status === 'analyzing' || rfp.status === 'received' ? `
            <button class="btn btn--primary btn--sm" onclick="analyzeRfp('${rfp.id}')">
              분석하기
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Event: Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    filterButtons.forEach(b => b.classList.remove('filter-btn--active'));
    e.target.classList.add('filter-btn--active');
    currentFilter = e.target.dataset.filter;
    renderRfps();
  });
});

// Event: Search input
searchInput.addEventListener('input', () => {
  renderRfps();
});

// Actions
function viewRfp(id) {
  alert(`RFP 상세: ${id}\n(실제로는 rfp-detail.html?id=${id}로 이동합니다)`);
}

function analyzeRfp(id) {
  alert(`RFP 분석 시작: ${id}\n(실제로는 AI 분석 API를 호출합니다)`);
}

// Initialize
loadRfps();
