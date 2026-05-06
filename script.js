const _warn = console.warn.bind(console);
    console.warn = (...args) => { if (typeof args[0] === 'string' && args[0].includes('cdn.tailwindcss.com')) return; _warn(...args); };

/* ===== Block separator ===== */

tailwind.config = {
      theme: {
        extend: {
          fontFamily: { sans: ['DM Sans', 'sans-serif'], mono: ['DM Mono', 'monospace'] },
          colors: {
            brand: {
              orange: '#FE7333', orangeHover: '#E05A1C', orangeLight: '#FFF1EB',
              navy: '#1A1A2E', navyMid: '#2D2D4E', slate: '#4A4A6A',
              muted: '#8A8AA8', line: '#E8E8F0', bg: '#F7F7FC',
              green: '#1DB87E', greenLight: '#E8F8F2',
              red: '#E53935', redLight: '#FFF0F0',
              amber: '#F59E0B', amberLight: '#FFF7E6',
              gig: '#E8243B',
            }
          }
        }
      }
    }

/* ===== Block separator ===== */

(function () {
                var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                var selDate = new Date();
                var viewYear = selDate.getFullYear();
                var viewMonth = selDate.getMonth();

                function fmt(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }

                function updateDisplay() {
                  var startStr = fmt(selDate);
                  var end = new Date(selDate); end.setMonth(end.getMonth() + 13);
                  var endStr = fmt(end);
                  ['pcbStartDate','pcbStickyStartDate'].forEach(function(id){
                    var el = document.getElementById(id); if (el) el.textContent = startStr;
                  });
                  ['pcbEndDate','pcbStickyEndDate'].forEach(function(id){
                    var el = document.getElementById(id); if (el) el.textContent = endStr;
                  });
                }

                function renderGrid() {
                  var label = document.getElementById('pcbMonthLabel');
                  var grid = document.getElementById('pcbDayGrid');
                  if (!label || !grid) return;
                  label.textContent = MONTHS_FULL[viewMonth] + ' ' + viewYear;
                  var today = new Date(); today.setHours(0,0,0,0);
                  var firstDay = new Date(viewYear, viewMonth, 1).getDay();
                  var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
                  var html = '';
                  // leading blanks
                  for (var i = 0; i < firstDay; i++) {
                    html += '<button class="pcb-day pcb-other" disabled></button>';
                  }
                  for (var d = 1; d <= daysInMonth; d++) {
                    var thisDate = new Date(viewYear, viewMonth, d);
                    var isSel = thisDate.getFullYear() === selDate.getFullYear() && thisDate.getMonth() === selDate.getMonth() && thisDate.getDate() === selDate.getDate();
                    var isToday = thisDate.getTime() === today.getTime();
                    var cls = 'pcb-day' + (isSel ? ' pcb-selected' : isToday ? ' pcb-today' : '');
                    html += '<button class="' + cls + '" onclick="pcbSelectDay(' + viewYear + ',' + viewMonth + ',' + d + ')">' + d + '</button>';
                  }
                  grid.innerHTML = html;
                }

                window.pcbTogglePicker = function(e) {
                  e.stopPropagation();
                  var dd = document.getElementById('pcbDropdown');
                  var btn = (e.currentTarget && e.currentTarget.tagName === 'BUTTON') ? e.currentTarget : document.getElementById('pcbDateBtn');
                  if (!dd || !btn) return;
                  window._pcbActiveBtn = btn;
                  var isOpen = dd.style.display !== 'none';
                  if (isOpen) { dd.style.display = 'none'; return; }
                  // Position fixed relative to button
                  var r = btn.getBoundingClientRect();
                  dd.style.top = (r.bottom + 6) + 'px';
                  dd.style.left = r.left + 'px';
                  // Ensure it doesn't overflow right edge
                  dd.style.display = 'block';
                  var ddW = 260;
                  if (r.left + ddW > window.innerWidth - 8) {
                    dd.style.left = Math.max(8, window.innerWidth - ddW - 8) + 'px';
                  }
                  viewYear = selDate.getFullYear();
                  viewMonth = selDate.getMonth();
                  renderGrid();
                };

                window.pcbChangeMonth = function(dir) {
                  viewMonth += dir;
                  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
                  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
                  renderGrid();
                };

                window.pcbSelectDay = function(y, m, d) {
                  selDate = new Date(y, m, d);
                  updateDisplay();
                  document.getElementById('pcbDropdown').style.display = 'none';
                };

                // close on outside click
                document.addEventListener('click', function(e) {
                  var dd = document.getElementById('pcbDropdown');
                  if (!dd) return;
                  var wrap = document.getElementById('pcbDatePickerWrap');
                  var stickyBtn = document.getElementById('pcbStickyDateBtn');
                  var inside = (wrap && wrap.contains(e.target)) || dd.contains(e.target) || (stickyBtn && stickyBtn.contains(e.target));
                  if (!inside) dd.style.display = 'none';
                });

                // Reposition on scroll/resize
                function pcbReposition() {
                  var dd = document.getElementById('pcbDropdown');
                  var btn = window._pcbActiveBtn || document.getElementById('pcbDateBtn');
                  if (!dd || !btn || dd.style.display === 'none') return;
                  var r = btn.getBoundingClientRect();
                  dd.style.top = (r.bottom + 6) + 'px';
                  var ddW = 260;
                  var left = r.left;
                  if (left + ddW > window.innerWidth - 8) left = Math.max(8, window.innerWidth - ddW - 8);
                  dd.style.left = left + 'px';
                }
                window.addEventListener('scroll', pcbReposition, true);
                window.addEventListener('resize', pcbReposition);

                // Move dropdown to body so it escapes all stacking contexts
                document.addEventListener('DOMContentLoaded', function() {
                  var dd = document.getElementById('pcbDropdown');
                  if (dd) document.body.appendChild(dd);

                  // Sticky bar must also live on <body>: its current parent .slide-up has an
                  // animation (transform), which breaks position:fixed (it becomes absolute to the ancestor)
                  var stickyEl = document.getElementById('stickyPolicyBar');
                  if (stickyEl) document.body.appendChild(stickyEl);

                  // Policy info icon now opens the Order Summary bottom-sheet modal
                  window.scrollToPolicySummary = function(ev) {
                    if (ev) ev.preventDefault();
                    if (typeof openPolicyModal === 'function') openPolicyModal();
                  };

                  // Reparent the floating terms bar to <body> so position:fixed
                  // can't be broken by a transformed ancestor
                  var termsBar = document.getElementById('pcsfTermsBar');
                  if (termsBar && termsBar.parentNode !== document.body) document.body.appendChild(termsBar);

                  // Measure payment footer height → CSS var so the floating terms bar
                  // can position itself above it with a consistent gap across viewports
                  var measurePcsfH = function() {
                    var f = document.getElementById('payCardStickyFooter');
                    if (!f) return;
                    document.documentElement.style.setProperty('--pcsf-footer-h', f.offsetHeight + 'px');
                  };
                  requestAnimationFrame(measurePcsfH);
                  window.addEventListener('resize', measurePcsfH);
                  window.addEventListener('load', measurePcsfH);

                  // Sticky policy bar — anchor below the top navbar, show only once banner is fully scrolled past
                  var banner = document.getElementById('affirmationBanner');
                  var sticky = document.getElementById('stickyPolicyBar');
                  var topHeader = document.querySelector('header');
                  if (banner && sticky) {
                    var shown = false;
                    var getHeaderH = function() {
                      return topHeader ? Math.round(topHeader.getBoundingClientRect().height) : 64;
                    };
                    // Pin sticky bar's top to navbar's bottom edge
                    var alignSticky = function() {
                      sticky.style.top = getHeaderH() + 'px';
                    };
                    var showSticky = function(show) {
                      if (show === shown) return;
                      shown = show;
                      sticky.style.transform = show ? 'translateY(0)' : 'translateY(-120%)';
                      sticky.style.pointerEvents = show ? 'auto' : 'none';
                    };
                    var checkScroll = function() {
                      alignSticky();
                      // Only show when the banner's bottom is above the navbar's bottom (no duplicate content visible)
                      var rect = banner.getBoundingClientRect();
                      showSticky(rect.bottom <= getHeaderH());
                    };
                    window.addEventListener('scroll', checkScroll, { passive: true });
                    window.addEventListener('resize', checkScroll);
                    alignSticky();
                    checkScroll();
                  }
                });

                updateDisplay();
              })();

/* ===== Block separator ===== */

function openPaymentSummaryPanel() {
              var bg = document.getElementById('psSlideBg');
              var panel = document.getElementById('psSlidePanel');
              if (!bg || !panel) return;
              // Sync values
              var sideVatEl = document.getElementById('sideVat');
              var sideTotalEl = document.getElementById('sideTotal');
              var vatTxt = (sideVatEl ? sideVatEl.textContent : '286.88').trim();
              var totalTxt = (sideTotalEl ? sideTotalEl.textContent : '6,024.38').trim();
              var aedHtml = '<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>';
              ['psVatTotal','psVatAmt'].forEach(function(id){ var e = document.getElementById(id); if(e) e.innerHTML = aedHtml + vatTxt; });
              ['psGrandTotal'].forEach(function(id){ var e = document.getElementById(id); if(e) e.innerHTML = aedHtml + totalTxt; });

              // Build add-ons list
              var addonKeys = typeof addons !== 'undefined' ? Object.keys(addons) : [];
              var psAddSec = document.getElementById('psAddonsSection');
              var psAddList = document.getElementById('psAddonsList');
              var psAddTotal = document.getElementById('psAddonsTotal');
              if (psAddSec && psAddList && psAddTotal) {
                if (addonKeys.length > 0) {
                  var addonSum = 0;
                  psAddList.innerHTML = addonKeys.map(function(k){
                    var m = ADDON_META[k];
                    addonSum += m.price;
                    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F4F4F8;">'
                      + '<span style="font-size:13px;color:#4A4A6A;">' + m.label + '</span>'
                      + '<span style="font-size:13px;font-weight:500;color:#1A1A2E;"><svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>' + m.price.toFixed(2) + '</span>'
                      + '</div>';
                  }).join('');
                  psAddTotal.innerHTML = '<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>' + addonSum.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
                  psAddSec.style.display = 'block';
                } else {
                  psAddSec.style.display = 'none';
                }
              }

              bg.style.display = 'block';
              panel.style.display = 'block';
              requestAnimationFrame(function(){ requestAnimationFrame(function(){
                panel.style.transform = 'translateX(0)';
              }); });
              document.body.style.overflow = 'hidden';
            }
            function closePaymentSummaryPanel() {
              var bg = document.getElementById('psSlideBg');
              var panel = document.getElementById('psSlidePanel');
              if (!panel) return;
              panel.style.transform = 'translateX(100%)';
              setTimeout(function(){
                if (bg) bg.style.display = 'none';
                panel.style.display = 'none';
                document.body.style.overflow = '';
              }, 360);
            }

/* ===== Block separator ===== */

function revealCardStep() {
                    var cardEl=document.getElementById('cardNum2'),expiryEl=document.getElementById('expiry2'),cvvEl=document.getElementById('cvv2');
                    var stepExp=document.getElementById('cfStepExpiry'),stepCvv=document.getElementById('cfStepCvv'),grp2=document.getElementById('cfGroup2');
                    if(!cardEl||!expiryEl||!cvvEl)return;
                    var cardOk=(cardEl.value||'').replace(/\s/g,'').length>=15;
                    var expiryOk=(expiryEl.value||'').replace(/\//g,'').replace(/\s/g,'').length>=4;
                    var cvvOk=(cvvEl.value||'').replace(/\s/g,'').length>=3;
                    if(stepExp){if(cardOk){stepExp.style.width='96px';stepExp.style.opacity='1';stepExp.style.borderLeftWidth='1px';if(!expiryEl.value)setTimeout(function(){expiryEl.focus();},300);}else{stepExp.style.width='0';stepExp.style.opacity='0';stepExp.style.borderLeftWidth='0px';}}
                    if(stepCvv){if(cardOk&&expiryOk){stepCvv.style.width='82px';stepCvv.style.opacity='1';stepCvv.style.borderLeftWidth='1px';if(!cvvEl.value)setTimeout(function(){cvvEl.focus();},300);}else{stepCvv.style.width='0';stepCvv.style.opacity='0';stepCvv.style.borderLeftWidth='0px';}}
                    if(grp2){if(cardOk&&expiryOk&&cvvOk){grp2.style.maxHeight='120px';grp2.style.opacity='1';grp2.style.marginBottom='16px';var n=document.getElementById('cardHolder2');if(n&&!n.value)setTimeout(function(){n.focus();},350);}else{grp2.style.maxHeight='0';grp2.style.opacity='0';grp2.style.marginBottom='0';}}
                  }

/* ===== Block separator ===== */

var BASE = 5737.50, BASE_VAT = 286.88, addons = {}, activeTab = 'card', termsAccepted = true, paymentDetailsAdded = false, ctaClickCount = 0;
    var ADDON_META = { carHire: { label: 'Rent-a-Car', price: 150, vatIncl: true }, gccOpt: { label: 'GCC Cover', price: 500, vatIncl: true }, medex: { label: 'Personal Accident', price: 85, vatIncl: false }, excessCb: { label: 'Excess Cashback', price: 85, vatIncl: false }, courier: { label: 'Courier Documents', price: 25, vatIncl: false } };

    // Syncs add/remove across both sidebar and left-panel buttons
    function toggleAddonBoth(key, price, clickedBtn) {
      var sideBtn = document.getElementById('sidebtn-' + key);
      if (!sideBtn) return;

      // Detect current state: ypc-checkbox uses .checked, legacy uses .state-add
      var isYpc = clickedBtn.classList.contains('ypc-checkbox');
      var isAdding = isYpc ? !clickedBtn.classList.contains('checked')
                           : clickedBtn.classList.contains('state-add');

      var sideRow = document.getElementById('sideAddonRow_' + key);

      function setChecked(btn) {
        if (!btn) return;
        if (btn.classList.contains('ypc-checkbox')) {
          btn.classList.add('checked');
        }
      }
      function setUnchecked(btn) {
        if (!btn) return;
        if (btn.classList.contains('ypc-checkbox')) {
          btn.classList.remove('checked');
        }
      }

      if (isAdding) {
        addons[key] = price;
        setChecked(sideBtn);
        if (sideRow) sideRow.classList.add('is-added');
      } else {
        delete addons[key];
        setUnchecked(sideBtn);
        if (sideRow) sideRow.classList.remove('is-added');
      }

      var stickyBar = document.getElementById('payCardStickyFooter');
      if (stickyBar) stickyBar.classList.add('bar-visible');
      recalc();
    }
    function el(id) { return document.getElementById(id) }
    function fmt(n) { return '<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
    function recalc() {
      var ab = 0, av = 0;
      Object.entries(addons).forEach(function (kv) { var m = ADDON_META[kv[0]]; if (m.vatIncl) { ab += kv[1]; } else { av += kv[1] * 0.05; ab += kv[1]; } });
      var vat = +(BASE_VAT + av).toFixed(2), total = +(BASE + ab + vat).toFixed(2), ts = fmt(total), vs = fmt(vat);
      if (el('sideVat')) el('sideVat').innerHTML = vs;
      if (el('pcsfVatAmt')) el('pcsfVatAmt').innerHTML = vs;
      if (el('sideTotal')) el('sideTotal').innerHTML = ts;
      if (el('sheetTotal')) el('sheetTotal').innerHTML = ts;
      if (el('sheetPayAmt')) el('sheetPayAmt').innerHTML = ts;
      if (el('desktopTermsTotal')) el('desktopTermsTotal').innerHTML = ts;
      ['payBtnAmt2', 'payBtnAmt3', 'payFooterBtnAmt'].forEach(function (id) { if (el(id)) el(id).innerHTML = ts; });
      if (el('mobStripTotal')) el('mobStripTotal').innerHTML = '<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>' + Math.round(total).toLocaleString();
      if (el('payFooterTotalAmt')) el('payFooterTotalAmt').innerHTML = ts;
      updateMobilePayFooterState(ts);
      // ── Summary card sync ──
      if (el('summaryVatAmt2')) el('summaryVatAmt2').innerHTML = vs;
      if (el('summaryTotalAmt2')) el('summaryTotalAmt2').innerHTML = ts;
      var addonTotal = ab;
      var addonRow = el('summaryAddonRow');
      var addonAmt = el('summaryAddonAmt');
      if (addonRow && addonAmt) {
        if (addonTotal > 0) {
          addonRow.style.display = 'flex';
          addonAmt.innerHTML = fmt(addonTotal);
        } else {
          addonRow.style.display = 'none';
        }
      }
      var rows = el('addonBreakdownRows');
      if (rows) rows.innerHTML = Object.keys(addons).map(function (k) { var m = ADDON_META[k]; return '<div class="flex justify-between text-brand-slate"><span>' + m.label + '</span><span>+ <svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>' + m.price.toFixed(2) + (m.vatIncl ? '' : ' +VAT') + '</span></div>'; }).join('');
      var ss = el('sideAddonsSection'), sl = el('sideAddonsList');
      if (ss && sl) { var ks = Object.keys(addons); if (ks.length > 0) { ss.classList.remove('hidden'); sl.innerHTML = ks.map(function (k) { var m = ADDON_META[k]; return '<div class="flex items-center justify-between text-[12px] py-0.5"><span class="flex items-center gap-1.5 text-brand-slate"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#E8F8F2"/><path d="M4 7L6 9.5L10 4.5" stroke="#1DB87E" stroke-width="1.5" stroke-linecap="round"/></svg>' + m.label + '</span><span class="font-600 text-brand-navy">+<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>' + m.price + '</span></div>'; }).join(''); } else { ss.classList.add('hidden'); } }
      ['carHire', 'gccOpt', 'medex', 'excessCb'].forEach(function (id) { var pt = el('page-toggle-' + id); if (pt) pt.checked = addons.hasOwnProperty(id); });
      // Boost My Cover badge
      var badge = el('boostCountBadge'), badgeTxt = el('boostCountText');
      if (badge && badgeTxt) {
        var n = Object.keys(addons).length;
        badge.style.display = n > 0 ? 'block' : 'none';
        if (n > 0) badgeTxt.textContent = n + ' selected';
      }
      // Sync unified CTA amount (mobile + desktop total col)
      var uMobAmt = el('pcsfUnifiedMobAmt');
      if (uMobAmt) uMobAmt.textContent = ts;
      var pAmt = el('pcsfCtaAmt');
      if (pAmt) pAmt.textContent = ts;
    }
    function toggleSection(bodyId, chevId, lblId) { var body = el(bodyId), chev = el(chevId), lbl = el(lblId); if (!body) return; var isOpen = body.classList.contains('open'); body.classList.toggle('open', !isOpen); if (chev) chev.classList.toggle('open', !isOpen); if (lbl) lbl.textContent = isOpen ? 'Show' : 'Hide'; setTimeout(updateMobilePayFooterVisibility, 60); }
    function toggleCovered() { var extra = document.getElementById('covExtraItems'), btn = document.getElementById('coveredExpandLabel'), chev = document.getElementById('coveredExpandChevron'); if (!extra) return; var isOpen = extra.style.display !== 'none'; if (isOpen) { extra.style.display = 'none'; if (btn) btn.textContent = '+ 6 more benefits'; if (chev) chev.style.transform = 'rotate(0deg)'; } else { extra.style.display = 'block'; if (btn) btn.textContent = 'Show less'; if (chev) chev.style.transform = 'rotate(180deg)'; } }
    function switchSummaryTab(tab) { ['covered', 'plan', 'insured', 'vehicle'].forEach(function (t) { var c = t.charAt(0).toUpperCase() + t.slice(1); var b = el('st' + c), p = el('stPanel' + c); if (b) b.classList.toggle('active', t === tab); if (p) p.style.display = (t === tab) ? 'block' : 'none'; }); }
    function syncAddonToggle(id, price, checkbox) { var inSummaryToggle = el('toggle-' + id); if (inSummaryToggle) { inSummaryToggle.checked = checkbox.checked; } if (checkbox.checked) { addons[id] = price; } else { delete addons[id]; } recalc(); }
    function toggleAddonCard(id, price, btn) {
      // Delegate to toggleAddonBoth so sidebar stays in sync
      toggleAddonBoth(id, price, btn);
    }

    function pageCourierToggle() {
      var btn = el('page-toggle-courier'), icon = el('pageCourierBtnIcon'), txt = el('pageCourierBtnText');
      var row = el('courierBannerRow');
      var isAdded = addons.hasOwnProperty('courier');
      if (isAdded) {
        delete addons['courier'];
        btn.classList.remove('state-added'); btn.classList.add('state-add');
        if (icon) icon.innerHTML = '<path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>';
        if (txt) txt.textContent = 'Add';
        if (row) row.classList.remove('is-added');
        btn.setAttribute('aria-checked', 'false');
      } else {
        addons['courier'] = 25;
        btn.classList.remove('state-add'); btn.classList.add('state-added');
        if (icon) icon.innerHTML = '<path d="M2 7L5.5 10.5L12 4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';
        if (txt) txt.textContent = 'Added';
        if (row) row.classList.add('is-added');
        btn.setAttribute('aria-checked', 'true');
        btn.style.transform = 'scale(1.07)'; setTimeout(function () { btn.style.transform = ''; }, 220);
      }
      recalc();
    }
    function updateMobilePayFooterState(ts) {
      // Update total in footer
      var amt = el('payFooterTotalAmt'); if (amt && ts) amt.innerHTML = ts;
      var btnAmt = el('payFooterBtnAmt'); if (btnAmt && ts) btnAmt.innerHTML = ts;
    }
    function setMobilePayFooterVisible(visible) { /* handled by stickyPayBar */ }
    function updateMobilePayFooterVisibility() { /* handled by stickyPayBar */ }
    function toggleTerms() {
      termsAccepted = !termsAccepted;
      if (termsAccepted) { if (el('termsErr')) el('termsErr').classList.remove('show'); }
      // Sync desktop checkbox visual
      var dtc = el('desktopTermsCheck');
      if (dtc) {
        if (termsAccepted) { dtc.classList.add('checked'); dtc.setAttribute('aria-checked','true'); }
        else { dtc.classList.remove('checked'); dtc.setAttribute('aria-checked','false'); }
      }
      updateSideCtaState();
    }
    function updateTermsCardVisibility() { if (typeof syncUnifiedCta === 'function') syncUnifiedCta(); }
    window.addEventListener('resize', updateTermsCardVisibility);

    function handleCallbackRequest() {
      var btn = document.getElementById('callbackBtn');
      if (!btn || btn.dataset.sent === 'true') return;
      btn.dataset.sent = 'true';
      btn.textContent = '✓ Callback Request Initiated';
      btn.style.background = '#145C3E';
      btn.style.boxShadow = 'none';
      btn.style.cursor = 'default';
      btn.style.transform = 'scale(1.03)';
      setTimeout(function(){ btn.style.transform = ''; }, 200);
    }

    function openWA() { window.open('https://wa.me/9718004533733?text=Hi%2C+I+need+help+with+my+GIG+Gulf+AXA+payment+for+CAR-GWJXM4US', '_blank'); }

    var selectedPayMethod = 'card';
    function selectPayMethod(method) { selectedPayMethod = method; } // legacy compat

    function selectPayMethod2(method) {
      selectedPayMethod = method;
      // Show autoRenewRow only for Credit/Debit card
      var arRow = document.getElementById('autoRenewRow');
      if (arRow) arRow.style.display = method === 'card' ? 'block' : 'none';
      var methods = ['card', 'apple', 'google', 'samsung', 'tamara', 'tabby'];
      methods.forEach(function (m) {
        var tile = document.getElementById('pm' + m.charAt(0).toUpperCase() + m.slice(1));
        var radio = document.getElementById('pmRadio' + m.charAt(0).toUpperCase() + m.slice(1));
        var isActive = m === method;
        if (tile) {
          tile.classList.toggle('pm-active', isActive);
          tile.style.borderColor = isActive ? '#FE7333' : '';
          tile.style.background  = isActive ? '#FFF8F5' : '';
          tile.style.boxShadow   = isActive ? '0 0 0 3px rgba(254,115,51,.1)' : '';
          // Move tile-highlight to newly selected tile if in State 1
          if (isActive && !paymentDetailsAdded) {
            document.querySelectorAll('.pm-tile.tile-highlight').forEach(function(t){ t.classList.remove('tile-highlight'); });
            tile.classList.add('tile-highlight');
          } else if (!isActive) {
            tile.classList.remove('tile-highlight');
          }
        }
        if (radio) {
          if (isActive) { radio.style.borderColor = '#FE7333'; radio.innerHTML = '<div style="width:8px;height:8px;border-radius:50%;background:#FE7333;"></div>'; radio.style.borderColor='#FE7333'; }
          else { radio.style.borderColor = '#D0D0E0'; radio.style.background='#fff'; radio.innerHTML = ''; }
        }
      });
      var cardForm = document.getElementById('inlineCardForm');
      var altPay = document.getElementById('inlineAltPay');
      var cardAccordion = document.getElementById('pmCardAccordion');
      if (cardAccordion) cardAccordion.style.display = method === 'card' ? 'block' : 'none';
      var cardHeader = document.getElementById('inlineCardHeader');
      if (cardHeader) cardHeader.style.display = method === 'card' ? 'flex' : 'none';
      var logoRow = document.getElementById('cardLogosRow');
      var bnpl = document.getElementById('bnplBreakdown');
      var bnplRows = document.getElementById('bnplRows');
      var payModeTabs = document.getElementById('payModeTabs');
      var savedCardsPanel = document.getElementById('savedCardsPanel');
      var newCardPanel = document.getElementById('newCardPanel');

      if (method === 'card') {
        if (altPay) altPay.style.display = 'none';
        if (logoRow) logoRow.style.display = 'flex';
        if (payModeTabs) payModeTabs.style.display = 'flex';
        // inlineCardForm and arWrap are always visible under Credit/Debit
        if (cardForm) cardForm.style.display = 'block';
        var arWrapEl = document.getElementById('arWrap');
        if (arWrapEl) arWrapEl.style.display = 'flex';
        // Panel visibility based on active tab
        var activeTab = document.querySelector('.pay-mode-tab.active');
        var activeMode = activeTab ? activeTab.getAttribute('data-mode') : 'new';
        if (savedCardsPanel) savedCardsPanel.style.display = activeMode === 'saved' ? 'block' : 'none';
        if (newCardPanel) newCardPanel.style.display = activeMode === 'new' ? 'block' : 'none';
        // Only mark payment ready if a card was already saved
        var savedCard = el('savedCardRow');
        var isSaved = savedCard && savedCard.style.display !== 'none' && !savedCard.classList.contains('hidden');
        if (!isSaved) {
          paymentDetailsAdded = false;
          updateSideCtaState();
        }
      } else {
        if (cardForm) cardForm.style.display = 'none';
        if (logoRow) logoRow.style.display = 'none';
        if (altPay) altPay.style.display = 'block';
        if (bnpl) bnpl.style.display = 'none';
        if (payModeTabs) payModeTabs.style.display = 'none';
        if (savedCardsPanel) savedCardsPanel.style.display = 'none';
        if (newCardPanel) newCardPanel.style.display = 'none';
        var arWrapEl3 = document.getElementById('arWrap');
        if (arWrapEl3) arWrapEl3.style.display = 'none';

        var nm = document.getElementById('altPayName');
        var sub = document.getElementById('altPaySubName');
        var wrap = document.getElementById('altPayIconWrap');
        var svg = document.getElementById('altPaySvg');
        var altCard = document.getElementById('altPayCard');

        // Config per method
        var cfg = {
          apple:   { name:'Apple Pay', sub:'Apple', bg:'#000', border:'none', iconHtml:'<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="white"/>', bnpl:null },
          google:  { name:'Google Pay', sub:'Google', bg:'#fff', border:'1.5px solid #E0E0E8', iconHtml:'<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>', bnpl:null },
          samsung: { name:'Samsung Pay', sub:'Samsung', bg:'#1428A0', border:'none', iconHtml:'<text x="1" y="17" font-family="Arial" font-weight="900" font-size="14" fill="white">S</text>', bnpl:null },
          tamara:  { name:'Tamara — Split in 3', sub:'Tamara', bg:'#FEFAE8', border:'1px solid #E0D8A8', iconHtml:'<text x="1" y="16" font-family="Arial" font-weight="900" font-size="12" fill="#2D2A00">tamara</text>',
            bnpl: { n:3, label:'instalment', color:'#8B7000' } },
          tabby:   { name:'Tabby — Pay in 4', sub:'Tabby', bg:'#3EB151', border:'none', iconHtml:'<text x="1" y="17" font-family="Arial" font-weight="900" font-size="14" fill="white">tabby</text>',
            bnpl: { n:4, label:'payment', color:'#1DB87E' } }
        };

        var c = cfg[method];
        if (!c) return;

        if (nm) nm.textContent = c.name;
        if (sub) sub.textContent = c.sub;
        if (wrap) { wrap.style.background = c.bg; wrap.style.border = c.border; }
        if (svg) svg.innerHTML = c.iconHtml;

        // BNPL breakdown
        if (c.bnpl && bnpl && bnplRows) {
          bnpl.style.display = 'block';
          var total = parseFloat((document.getElementById('sideTotal') || {}).textContent.replace(/[^0-9.]/g,'')) || 6024.38;
          var instAmt = (total / c.bnpl.n).toFixed(2);
          var today = new Date();
          var rows = '';
          for (var i = 0; i < c.bnpl.n; i++) {
            var d = new Date(today); d.setMonth(d.getMonth() + i);
            var label = i === 0 ? 'Today' : d.toLocaleDateString('en-AE', {day:'numeric', month:'short', year:'numeric'});
            rows += '<div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;">' +
              '<div style="display:flex;align-items:center;gap:8px;">' +
              '<div style="width:8px;height:8px;border-radius:50%;background:' + c.bnpl.color + ';flex-shrink:0;"></div>' +
              '<span style="color:#4A4A6A;">' + label + '</span>' +
              '</div>' +
              '<span style="font-weight:700;color:#1A1A2E;"><svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>' + instAmt + '</span>' +
              '</div>';
          }
          bnplRows.innerHTML = rows;
        }

        paymentDetailsAdded = true;
        updateSideCtaState();
      }
    }

    function fmtCard2(i) {
      var raw = i.value.replace(/\D/g, '');
      var isAmex = raw.startsWith('34') || raw.startsWith('37');
      var maxLen = isAmex ? 15 : 16;
      var v = raw.slice(0, maxLen);

      if (isAmex) {
        var parts = [];
        if (v.length > 0) parts.push(v.slice(0, 4));
        if (v.length > 4) parts.push(v.slice(4, 10));
        if (v.length > 10) parts.push(v.slice(10, 15));
        i.value = parts.join('  ');
      } else {
        i.value = v.match(/.{1,4}/g) ? v.match(/.{1,4}/g).join('  ') : v;
      }

      var icon = document.getElementById('cardBrandIcon');
      var brandEl = document.getElementById('previewBrand');
      if (icon) {
        var first = v[0];
        if (first === '4') { icon.style.background = '#1A1F71'; icon.innerHTML = '<svg width="20" height="12" viewBox="0 0 52 32" fill="none"><path d="M19.5 22H16.8L14.5 12.5c-.1-.3-.3-.6-.6-.7C13 11.4 12 11.1 11 11V10.7H15.4c.6 0 1 .4 1.1 1L17.6 17.4 20.3 10.7H22.9L19.5 22ZM24 22H21.6L23.5 10.7H25.9L24 22Z" fill="white" opacity=".9"/></svg>'; if (brandEl) brandEl.textContent = 'VISA'; }
        else if (first === '5') { icon.style.background = '#252525'; icon.innerHTML = '<svg width="20" height="12" viewBox="0 0 40 24" fill="none"><circle cx="14" cy="12" r="7" fill="#EB001B"/><circle cx="26" cy="12" r="7" fill="#F79E1B"/></svg>'; if (brandEl) brandEl.textContent = 'MASTERCARD'; }
        else if (isAmex) { icon.style.background = '#2E77BC'; icon.innerHTML = '<span style="color:white;font-size:7px;font-weight:900;letter-spacing:-.3px;">AMEX</span>'; if (brandEl) brandEl.textContent = 'AMEX'; }
        else { icon.style.background = '#E8E8F0'; icon.innerHTML = '<svg width="18" height="11" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="3" fill="#D4D4E0"/><rect x="0" y="6" width="32" height="4" fill="#B0B0C8"/></svg>'; if (brandEl) brandEl.textContent = 'CARD'; }
      }

      var chk = document.getElementById('cardNum2Chk');
      var grp = i.closest('.cf-group');
      if (v.length === maxLen) {
        if (chk) chk.style.opacity = '1';
        if (grp) { grp.style.borderColor = '#1DB87E'; grp.style.boxShadow = '0 0 0 3px rgba(29,184,126,.12)'; }
      } else {
        if (chk) chk.style.opacity = '0';
        if (grp) { grp.style.borderColor = ''; grp.style.boxShadow = ''; }
      }

      var cvvEl = document.getElementById('cvv2');
      if (cvvEl) {
        var cvMax = isAmex ? 4 : 3;
        cvvEl.setAttribute('maxlength', cvMax);
        var cvvVal = cvvEl.value.replace(/\D/g, '');
        if (cvvVal.length > cvMax) {
          cvvEl.value = cvvVal.slice(0, cvMax);
        }
      }

      checkCardFormDone();
    }

    function handleExpiryKey(e, i) {
      if (e.key === 'Backspace') {
        var pos = i.selectionStart;
        // If cursor is right after the slash, jump back over it
        if (pos === 3 && i.value.charAt(2) === '/') {
          e.preventDefault();
          i.value = i.value.slice(0, 2);
          checkCardFormDone();
        }
      }
    }

    function fmtExpiry2(i) {
      var raw = i.value;
      // Strip everything non-digit
      var digits = raw.replace(/\D/g, '').slice(0, 4);
      var cursor = i.selectionStart;
      if (digits.length === 0) { i.value = ''; checkCardFormDone(); return; }
      var formatted;
      if (digits.length <= 2) {
        formatted = digits;
      } else {
        formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4);
      }
      i.value = formatted;
      // Restore cursor: if we just inserted the slash, push cursor past it
      if (digits.length === 3 && cursor === 3) { i.setSelectionRange(4, 4); }
      checkCardFormDone();
    }

    function updateCardPreview() {
      var numEl = document.getElementById('cardNum2'), nameEl = document.getElementById('cardHolder2'), expEl = document.getElementById('expiry2');
      var pNum = document.getElementById('previewNum'), pName = document.getElementById('previewName'), pExp = document.getElementById('previewExp');
      if (pNum) {
        var raw = (numEl ? numEl.value.replace(/\D/g, '') : '');
        var padded = raw.padEnd(16, '•');
        var grouped = padded.match(/.{1,4}/g) || ['••••', '••••', '••••', '••••'];
        pNum.textContent = grouped.join(' ');
      }
      if (pName) {
        var n = (nameEl && nameEl.value.trim()) ? nameEl.value.trim().toUpperCase() : 'YOUR NAME';
        pName.textContent = n.length > 22 ? n.slice(0, 22) + '…' : n;
      }
      if (pExp) {
        var ev = (expEl ? expEl.value.replace(/\D/g, '') : '');
        if (ev.length >= 3) pExp.textContent = ev.slice(0, 2) + '/' + ev.slice(2, 4);
        else if (ev.length > 0) pExp.textContent = ev.slice(0, 2) + '/' + (ev.length === 2 ? 'YY' : '');
        else pExp.textContent = 'MM/YY';
      }
    }

    function checkCardFormDone() {
      // ── Saved-card mode: only CVV needed ──────────────────────
      var savedPanel = document.getElementById('savedCardsPanel');
      var newPanel   = document.getElementById('newCardPanel');
      var savedVisible = savedPanel && savedPanel.style.display !== 'none';
      var newVisible   = newPanel   && newPanel.style.display   !== 'none';

      // Default: treat as new-card if neither panel exists (legacy)
      if (savedVisible && !newVisible) {
        var activeSaved = document.querySelector('.saved-card-item.selected');
        var cvvInput    = activeSaved ? activeSaved.querySelector('.saved-cvv-input') : null;
        var cvvv        = cvvInput ? cvvInput.value.replace(/\D/g, '') : '';
        var done = cvvv.length >= 3;
        setInlineCtaActive(done);
        if (done && !paymentDetailsAdded) {
          paymentDetailsAdded = true;
          setInlineCtaLabel('Pay Now');
          updateSideCtaState();
        }
        if (!done && paymentDetailsAdded) {
          paymentDetailsAdded = false;
          setInlineCtaLabel('Complete Payment');
          updateSideCtaState();
        }
        return;
      }

      // ── New-card mode: all fields required ────────────────────
      var num  = document.getElementById('cardNum2'),
          exp  = document.getElementById('expiry2'),
          cvv  = document.getElementById('cvv2'),
          name = document.getElementById('cardHolder2');
      if (!num) return;
      var numv  = num.value.replace(/\D/g, '');
      var expv  = exp  ? exp.value.replace(/\D/g, '')  : '';
      var cvvv2 = cvv  ? cvv.value.replace(/\D/g, '')  : '';
      var namev = name ? name.value.trim()               : '';

      var isAmex    = numv.startsWith('34') || numv.startsWith('37');
      var reqNumLen = isAmex ? 15 : 16;
      var reqCvvLen = isAmex ? 4  : 3;

      var done = numv.length === reqNumLen && expv.length === 4 && cvvv2.length >= reqCvvLen && namev.length >= 2;
      if (done && !paymentDetailsAdded) { paymentDetailsAdded = true; updateSideCtaState(); }
      if (!done && paymentDetailsAdded) { paymentDetailsAdded = false; updateSideCtaState(); }
    }

    var rememberCard = true;
    function openCardModal() { var m = el('cardModal'); if (!m) return; m.style.display = 'flex'; document.body.style.overflow = 'hidden'; checkConfirmBtn(); }
    function closeCardModal() { var m = el('cardModal'); if (!m) return; m.style.display = 'none'; document.body.style.overflow = ''; }
    function toggleRememberCard() { rememberCard = !rememberCard; var box = el('rememberCardBox'), chk = el('rememberCardChk'); if (box) { box.style.background = rememberCard ? '#FE7333' : '#fff'; box.style.borderColor = rememberCard ? '#FE7333' : '#E8E8F0'; } if (chk) chk.style.opacity = rememberCard ? '1' : '0'; }
    function checkConfirmBtn() { var btn = el('confirmCardBtn'); if (!btn) return; var num = el('cardNum'), exp = el('expiry'), cvv = el('cvv'); var numVal = num ? num.value.replace(/\D/g, '') : '', expVal = exp ? exp.value.replace(/\D/g, '') : '', cvvVal = cvv ? cvv.value.replace(/\D/g, '') : ''; var ready = numVal.length >= 13 && expVal.length === 4 && cvvVal.length >= 3; btn.style.opacity = ready ? '1' : '0.45'; btn.style.pointerEvents = ready ? 'auto' : 'none'; }
    function fmtCard(i) { var v = i.value.replace(/\D/g, '').slice(0, 16); i.value = v.match(/.{1,4}/g) ? v.match(/.{1,4}/g).join('  ') : v; i.classList.remove('error', 'valid'); if (el('cardNumChk')) el('cardNumChk').classList.remove('show'); if (v.length === 16) valCard(i); }
    function valCard(i) { var v = i.value.replace(/\D/g, ''); if (v.length >= 13) setV(i, 'cardNumErr', 'cardNumChk'); else if (i.value) setE(i, 'cardNumErr', 'cardNumChk'); }
    function valName(i) { i.classList.remove('error', 'valid'); if (el('cardNameChk')) el('cardNameChk').classList.remove('show'); if (i.value.length >= 2 && /^[a-zA-Z\s'-]+$/.test(i.value)) setV(i, 'cardNameErr', 'cardNameChk'); }
    function fmtExpiry(i) { var v = i.value.replace(/\D/g, '').slice(0, 4); i.value = v.length >= 3 ? v.slice(0, 2) + ' / ' + v.slice(2) : v; i.classList.remove('error', 'valid'); if (el('expiryChk')) el('expiryChk').classList.remove('show'); }
    function valExpiry(i) { var v = i.value.replace(/\D/g, ''); if (v.length < 4) { setE(i, 'expiryErr', 'expiryChk'); return; } var m = parseInt(v.slice(0, 2)), y = parseInt('20' + v.slice(2)), now = new Date(); if (m < 1 || m > 12 || y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth() + 1)) setE(i, 'expiryErr', 'expiryChk'); else setV(i, 'expiryErr', 'expiryChk'); }
    function valCvv(i) { i.value = i.value.replace(/\D/g, '').slice(0, 4); i.classList.remove('error', 'valid'); if (el('cvvChk')) el('cvvChk').classList.remove('show'); if (i.value.length >= 3) setV(i, 'cvvErr', 'cvvChk'); }
    function setV(i, e, c) { i.classList.add('valid'); i.classList.remove('error'); if (el(e)) el(e).classList.remove('show'); if (el(c)) el(c).classList.add('show'); }
    function setE(i, e, c) { i.classList.add('error'); i.classList.remove('valid'); if (el(e)) el(e).classList.add('show'); if (el(c)) el(c).classList.remove('show'); }

    function confirmCard() {
      var num = el('cardNum'), exp = el('expiry'), cvv = el('cvv');
      var numVal = num ? num.value.replace(/\D/g, '') : '', expVal = exp ? exp.value.replace(/\D/g, '') : '', cvvVal = cvv ? cvv.value.replace(/\D/g, '') : '';
      if (numVal.length < 13 || expVal.length < 4 || cvvVal.length < 3) return;
      paymentDetailsAdded = true;
      var lastFour = numVal.slice(-4);
      var saved = el('savedCardRow'), lbl = el('savedCardLabel'), hint = el('noCardHint');
      if (hint) hint.style.display = 'none';
      if (saved) { saved.style.display = 'flex'; saved.classList.remove('hidden'); }
      if (lbl) lbl.textContent = 'Card  ···· ' + lastFour;
      recalc();
      closeCardModal();
      updateSideCtaState();
      setTimeout(function () { termsShake(); if (window.innerWidth >= 768) { var ts = el('sideTermsCard'); if (ts) ts.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } }, 380);
    }
    document.addEventListener('input', function (e) { if (['cardNum', 'expiry', 'cvv'].indexOf(e.target.id) > -1) checkConfirmBtn(); });

    function handlePay() {
      if (!paymentDetailsAdded) {
        // Scroll to payment card
        var c = el('paymentCard'); if (c) c.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!termsAccepted) {
        // Prompt user to accept terms
        var pB = el('pcsfCtaTerms');
        if (pB) { pB.style.transform = 'scale(1.04)'; setTimeout(function () { pB.style.transform = ''; }, 200); }
        var box = el('pcsfMobileCheckbox') || el('pcsfCheckbox');
        if (box) { box.classList.remove('checkbox-wiggle'); void box.offsetWidth; box.classList.add('checkbox-wiggle'); }
        return;
      }
      showProcessing();
    }
    function handlePayFromSidebar() { handlePay(); }
    function showProcessing() {
      var ol = el('processingOverlay'); if (!ol) return;
      ol.style.display = 'flex'; ol.style.flexDirection = 'column'; ol.style.alignItems = 'center'; ol.style.justifyContent = 'center'; ol.style.gap = '20px';
      setTimeout(function () { if (el('pTitle')) el('pTitle').textContent = 'Payment confirmed!'; if (el('pSub')) el('pSub').textContent = 'Your GIG Gulf policy is being issued…'; }, 2800);
    }

    function shakeEl(id, cls) { var el2 = el(id); if (!el2) return; el2.classList.remove(cls); void el2.offsetWidth; el2.classList.add(cls); el2.addEventListener('animationend', function h() { el2.classList.remove(cls); el2.removeEventListener('animationend', h); }); }
    var wizardStep = 0;
    function wizardAdvance(step) { wizardStep = step; }
    function termsShake() {
      var fbox = el('payFooterCheckbox');
      if (fbox) { fbox.classList.remove('checkbox-wiggle'); void fbox.offsetWidth; fbox.classList.add('checkbox-wiggle'); fbox.addEventListener('animationend', function h() { fbox.classList.remove('checkbox-wiggle'); fbox.removeEventListener('animationend', h); }); }
    }
    function applyPaymentGlow() {
      /* Add persistent glow to card + selected tile while state is "Complete Payment" */
      var c = el('paymentCard');
      if (c) c.classList.add('payment-highlight');
      var tile = document.querySelector('.pm-tile.pm-active');
      if (!tile) {
        var m = selectedPayMethod || 'card';
        tile = el('pm' + m.charAt(0).toUpperCase() + m.slice(1));
      }
      if (tile) tile.classList.add('tile-highlight');
    }

    function removePaymentGlow() {
      /* Remove glow once user moves past State 1 */
      var c = el('paymentCard');
      if (c) c.classList.remove('payment-highlight');
      var g = el('cfGroup1');
      if (g) g.classList.remove('cf-active');
      document.querySelectorAll('.pm-tile.tile-highlight').forEach(function(t) {
        t.classList.remove('tile-highlight');
      });
    }

    function highlightPaymentCard() {
      var c = el('paymentCard');
      if (!c) return;
      c.scrollIntoView({ behavior: 'smooth', block: 'center' });
      applyPaymentGlow();
    }

    function highlightEmptyFields() {
      var fields = [
        document.getElementById('cardNum2'),
        document.getElementById('cardHolder2'),
        document.getElementById('expiry2'),
        document.getElementById('cvv2')
      ];
      var firstEmpty = null;
      fields.forEach(function(input) {
        if (!input) return;
        var empty = input.value.replace(/\s/g,'').length === 0;
        if (empty) {
          if (!firstEmpty) firstEmpty = input;
          input.style.borderColor = '#FE7333';
          input.style.boxShadow = '0 0 0 3px rgba(254,115,51,.18)';
          input.style.background = '#FFFAF8';
          // Reset after 2s
          setTimeout(function() {
            if (!input.value) {
              input.style.borderColor = '';
              input.style.boxShadow = '';
              input.style.background = '';
            }
          }, 2000);
        }
      });
    }

    function handleUnifiedCta() {
      var payCard = el('paymentCard');

      /* ── No payment details filled → scroll + glow + highlight empty fields + tooltip ── */
      if (!paymentDetailsAdded) {
        if (payCard) payCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        applyPaymentGlow();
        if (payCard) {
          payCard.classList.remove('payment-error-pulse');
          void payCard.offsetWidth;
          payCard.classList.add('payment-error-pulse');
          payCard.addEventListener('animationend', function h() {
            payCard.classList.remove('payment-error-pulse');
            payCard.removeEventListener('animationend', h);
          });
        }
        setTimeout(highlightEmptyFields, 400);
        showCardDetailsTooltip();
        return;
      }

      /* ── Desktop only: details filled → scroll to terms card, highlight it ── */
      if (window.innerWidth >= 768) {
        var tr = el('sideTermsCard');
        if (tr) {
          tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
          tr.classList.remove('terms-cta-flash');
          void tr.offsetWidth;
          tr.classList.add('terms-cta-flash');
          tr.addEventListener('animationend', function h() {
            tr.classList.remove('terms-cta-flash');
            tr.removeEventListener('animationend', h);
          });
          termsShake();
        }
        return;
      }

      /* ── Mobile: details filled → process payment ── */
      handlePay();
    }

    function syncUnifiedCta() {
      var btn = el('pcsfUnifiedCta');
      var label = el('pcsfUnifiedLabel');
      var subRow = el('pcsfUnifiedMobAmtRow');
      var totalTxt = (((el('sideTotal') || {}).textContent) || '6,024.38').trim();
      if (!btn) return;

      var mobAmt = el('pcsfUnifiedMobAmt');
      if (mobAmt) mobAmt.innerHTML = '<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>' + totalTxt;

      if (!paymentDetailsAdded) {
        /* ── State 1: No payment details — "Complete Payment" ── */
        if (label) label.textContent = 'Complete Payment';
        if (subRow) subRow.style.display = 'none';
        btn.style.background = '#FE7333';
        btn.style.border = 'none';
        btn.style.color = '#fff';
        btn.style.opacity = '1';
        btn.style.boxShadow = '0 4px 18px rgba(254,115,51,.40)';
        btn.style.cursor = 'pointer';
        btn.style.filter = 'none';
        btn.dataset.state = '1';
      } else {
        /* ── State 2: All done — "Pay Now" active ── */
        if (label) label.textContent = 'Pay Now';
        if (subRow) subRow.style.display = 'flex';
        btn.style.background = '#FE7333';
        btn.style.border = 'none';
        btn.style.color = '#fff';
        btn.style.opacity = '1';
        btn.style.boxShadow = '0 4px 18px rgba(254,115,51,.40)';
        btn.style.cursor = 'pointer';
        btn.style.filter = 'none';
        btn.dataset.state = '3';
      }
    }

    function updateSideCtaState() {
      // ── Sidebar CTAs (desktop) ──────────────────────────────────
      var stA = el('sideCtaLocked'), stB = el('sideCtaTerms'), stC = el('sideCtaUnlocked');
      if (stA) stA.style.display = (!paymentDetailsAdded) ? 'flex' : 'none';
      if (stB) stB.style.display = (paymentDetailsAdded && !termsAccepted) ? 'flex' : 'none';
      if (stC) {
        if (paymentDetailsAdded && termsAccepted) {
          stC.style.display = 'block';
          requestAnimationFrame(function () { stC.style.opacity = '1'; stC.style.transform = 'translateY(0)'; });
        } else {
          stC.style.opacity = '0'; stC.style.transform = 'translateY(10px)';
          setTimeout(function () { if (stC) stC.style.display = 'none'; }, 0);
        }
      }

      // ── Sync checkbox elements ──────────────────────────────────
      var box = el('pcsfCheckbox'), chk = el('pcsfChk');
      var mbox = el('pcsfMobileCheckbox'), mchk = el('pcsfMobileChk');
      function setChecked(checked) {
        if (box) { box.classList.toggle('on', checked); }
        if (chk) { chk.style.display = checked ? 'block' : 'none'; }
        if (mbox) { mbox.classList.toggle('on', checked); }
        if (mchk) { mchk.style.display = checked ? 'block' : 'none'; }
        // Sync desktop card checkbox
        var dtc = el('desktopTermsCheck');
        if (dtc) {
          dtc.classList.toggle('checked', checked);
          dtc.setAttribute('aria-checked', checked ? 'true' : 'false');
        }
      }
      setChecked(termsAccepted);

      // ── sideTermsCard: always visible on desktop, toggle internal CTA state ──
      var stc = el('sideTermsCard');
      var ctaA = el('inlineCtaA');
      var ctaB = el('inlineCtaB');
      if (stc) {
        if (window.innerWidth >= 768) {
          stc.style.display = 'block';
          if (ctaA) ctaA.style.display = paymentDetailsAdded ? 'none' : 'block';
          if (ctaB) ctaB.style.display = paymentDetailsAdded ? 'block' : 'none';
        } else {
          stc.style.display = 'none';
        }
      }

      // ── Footer: hide on desktop (inline bar replaces it), show on mobile ──
      var footer = el('payCardStickyFooter');
      if (footer) {
        if (window.innerWidth >= 768) {
          footer.style.display = 'none';
        } else {
          footer.style.removeProperty('display');
          footer.classList.toggle('footer-ready', paymentDetailsAdded);
        }
      }

      // Remove payment glow once details are added
      if (paymentDetailsAdded) { removePaymentGlow(); }

      if (!paymentDetailsAdded) {
        // Remove all highlights
        if (box) { box.style.animation = 'none'; box.style.borderColor = 'rgba(255,255,255,.3)'; box.classList.remove('ready-ring','terms-highlight-box'); }
        if (mbox) { mbox.classList.remove('ready-ring','terms-highlight-box'); }
        var tr = el('pcsfTermsRow'), mtr = el('pcsfTermsBar');
        if (tr) tr.classList.remove('terms-highlight');
        if (mtr) mtr.classList.remove('terms-highlight');
        var tt = el('pcsfTermsText'), mtt = el('pcsfMobileTermsText');
        if (tt) tt.classList.remove('terms-highlight-text');
        if (mtt) mtt.classList.remove('terms-highlight-text');
      } else if (!termsAccepted) {
        // Payment details filled — highlight the terms row
        var tr = el('pcsfTermsRow'), mtr = el('pcsfTermsBar');
        if (tr) tr.classList.add('terms-highlight');
        if (mtr) mtr.classList.add('terms-highlight');
        var tt = el('pcsfTermsText'), mtt = el('pcsfMobileTermsText');
        if (tt) tt.classList.add('terms-highlight-text');
        if (mtt) mtt.classList.add('terms-highlight-text');
        if (box) {
          box.classList.add('ready-ring','terms-highlight-box');
          box.style.borderColor = '#FE7333';
          box.style.animation = 'none';
          void box.offsetWidth;
          box.style.animation = 'pcsfPulse 1.4s ease-in-out 3';
        }
        if (mbox) {
          mbox.classList.add('ready-ring', 'terms-highlight-box');
          mbox.style.borderColor = '#FE7333';
          mbox.style.animation = 'none';
          void mbox.offsetWidth;
          mbox.style.animation = 'pcsfPulse 1.4s ease-in-out 3';
        }
      } else {
        // State 3: terms accepted — clean up highlights
        if (box) { box.style.animation = 'none'; box.style.borderColor = '#FE7333'; box.classList.add('ready-ring'); box.classList.remove('terms-highlight-box'); }
        if (mbox) { mbox.classList.add('ready-ring'); mbox.classList.remove('terms-highlight-box'); }
        var tr3 = el('pcsfTermsRow'), mtr3 = el('pcsfTermsBar');
        if (tr3) tr3.classList.remove('terms-highlight');
        if (mtr3) mtr3.classList.remove('terms-highlight');
      }

      // ── Unified CTA ─────────────────────────────────────────────
      syncUnifiedCta();
    }

    function openSummaryModal() { if (window.innerWidth >= 1024) return; var m = document.getElementById('summaryModal'); if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; } }
    function openCvvModal() {
      var m = document.getElementById('cvvHelpModal');
      if (m) { m.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    }
    function closeCvvModal() {
      var m = document.getElementById('cvvHelpModal');
      if (m) { m.style.display = 'none'; document.body.style.overflow = ''; }
    }
    function closeSummaryModal() { var m = document.getElementById('summaryModal'); if (m) { m.classList.remove('open'); document.body.style.overflow = ''; } }

    (function () {
      // Courier init handled below in auto-add block
      recalc(); switchSummaryTab('covered'); // What's Covered loads first
      window.addEventListener('load', function () { switchSummaryTab('covered'); });
      // Auto-add courier
      addons['courier'] = 25;
      var pageBtn = el('page-toggle-courier'), pageTxt = el('pageCourierBtnText'), pageIcon = el('pageCourierBtnIcon');
      if (pageBtn) { pageBtn.classList.remove('state-add'); pageBtn.classList.add('state-added'); }
      var courierCard = el('courierBannerRow'); if (courierCard) courierCard.classList.add('is-added');
      if (pageTxt) pageTxt.textContent = 'Added';
      if (pageIcon) pageIcon.innerHTML = '<path d="M2 6.5L5 9.5L12 2.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>';
      recalc();
      updateTermsCardVisibility();
      updateSideCtaState();
      var strip = el('mobileStickyStrip');
      if (strip) window.addEventListener('scroll', function () { strip.classList.toggle('scrolled', window.scrollY > 10); }, { passive: true });
      window.addEventListener('scroll', updateMobilePayFooterVisibility, { passive: true });
      window.addEventListener('resize', updateMobilePayFooterVisibility);
      window.addEventListener('load', updateMobilePayFooterVisibility);
      updateMobilePayFooterVisibility();

      // Payment card intersection observer
      // Payment card visible immediately on load
      var card = document.getElementById('paymentCard');
      if (card) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }
      // Native state: card selected, no details yet → "Complete Payment"
      paymentDetailsAdded = false;
      termsAccepted = true;
      selectPayMethod2('card');
      updateSideCtaState();
      syncUnifiedCta();
      // Apply persistent glow on load
      applyPaymentGlow();
    })();

/* ===== Block separator ===== */

function toggleAutoRenew() {
            var box = document.getElementById('autoRenewBox');
            var chk = document.getElementById('autoRenewChk');
            var row = document.getElementById('autoRenewRow');
            var isOn = box.dataset.on === '1';
            if (!isOn) {
              box.dataset.on = '1';
              box.style.background = '#FE7333';
              box.style.borderColor = '#FE7333';
              chk.style.display = 'block';
              row.classList.add('ar-checked');
            } else {
              box.dataset.on = '0';
              box.style.background = '#fff';
              box.style.borderColor = '#CBD5E1';
              chk.style.display = 'none';
              row.classList.remove('ar-checked');
            }
          }

/* ===== Block separator ===== */

setTimeout(function () { var c = document.getElementById('pCircle'); if (c) c.style.strokeDashoffset = '0'; }, 100);

/* ===== Block separator ===== */

// ── Show bar after 5% scroll ──────────────────────────────────
    (function () {
      var bar = document.getElementById('payCardStickyFooter');
      var main = document.getElementById('mainContainer');

      function adjustPadding() {
        if (!bar || !main) return;
        var h = bar.offsetHeight;
        main.style.paddingBottom = (h + 20) + 'px';
      }

      function check() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        var barVisible = pct >= 5;
        bar.classList.toggle('bar-visible', barVisible);
        adjustPadding();
      }

      window.addEventListener('scroll', check, { passive: true });
      window.addEventListener('resize', function () { adjustPadding(); check(); }, { passive: true });
      window.addEventListener('load', function () { adjustPadding(); check(); });
      setTimeout(adjustPadding, 300);
    })();


    // ── Sticky bar: terms toggle ──────────────────────────────────
    function pcsfToggleTerms() { /* terms checkbox removed — always accepted */ }

    function showPaymentRequiredToast() {
      var existing = document.getElementById('payReqToast');
      if (existing) existing.remove();
      var t = document.createElement('div');
      t.id = 'payReqToast';
      t.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" style="flex-shrink:0"><circle cx="8" cy="8" r="7" stroke="#FE7333" stroke-width="1.4"/><path d="M8 5v4M8 10.5v.5" stroke="#FE7333" stroke-width="1.5" stroke-linecap="round"/></svg> Complete your payment details first';
      t.style.cssText = "position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(10px);background:#1A1A2E;color:#fff;font-size:12.5px;font-weight:600;padding:10px 18px;border-radius:100px;display:flex;align-items:center;gap:8px;box-shadow:0 8px 24px rgba(0,0,0,.25);z-index:9999;font-family:'DM Sans',sans-serif;opacity:0;transition:opacity .2s,transform .2s;white-space:nowrap;border:1px solid rgba(254,115,51,.3);";
      document.body.appendChild(t);
      requestAnimationFrame(function() {
        t.style.opacity = '1';
        t.style.transform = 'translateX(-50%) translateY(0)';
      });
      setTimeout(function() {
        t.style.opacity = '0';
        t.style.transform = 'translateX(-50%) translateY(8px)';
        setTimeout(function(){ t.remove(); }, 250);
      }, 2500);
    }

    // ── Card details tooltip above CTA ───────────────────────────
    /* ── inlineCtaA click handler ── */
    function handleInlineCtaClick(btn) {
      // Determine current mode by checking which panel is visible
      var newPanel      = document.getElementById('newCardPanel');
      var isNewCardMode = newPanel && newPanel.style.display !== 'none';

      // In saved-card mode, check which sc-state step is active
      var scCards  = document.getElementById('scStateCards');
      var cardsVisible = scCards && scCards.classList.contains('active');

      if (btn.classList.contains('cta-inactive')) {
        if (!isNewCardMode) {
          // ── Saved-card mode ──────────────────────────────────
          if (cardsVisible) {
            // Cards list is showing — scroll to & highlight the CVV input
            var activeCard = document.querySelector('.saved-card-item.selected');
            var cvvInput   = activeCard ? activeCard.querySelector('.saved-cvv-input') : null;
            var scrollTarget = cvvInput || activeCard;
            if (scrollTarget) {
              scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            if (cvvInput) {
              // Red pulse border
              cvvInput.style.transition  = 'border-color .15s, box-shadow .15s';
              cvvInput.style.borderColor = '#E53935';
              cvvInput.style.boxShadow   = '0 0 0 3px rgba(229,57,53,.18)';
              // Shake animation
              cvvInput.style.animation = 'none';
              void cvvInput.offsetWidth;
              cvvInput.style.animation = 'wizardShake .4s ease';
              cvvInput.focus();
              setTimeout(function() {
                cvvInput.style.borderColor = '';
                cvvInput.style.boxShadow   = '';
                cvvInput.style.animation   = '';
              }, 1800);
            }
          } else {
            // Still on mobile/OTP step — scroll savedCardsPanel into view
            var savedPanel = document.getElementById('savedCardsPanel');
            if (savedPanel) savedPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          // ── New-card mode — scroll to paymentCard + highlight empty fields ──
          var c = el('paymentCard');
          if (c) {
            c.scrollIntoView({ behavior: 'smooth', block: 'center' });
            c.classList.remove('payment-error-pulse');
            void c.offsetWidth;
            c.classList.add('payment-error-pulse');
            c.addEventListener('animationend', function h() {
              c.classList.remove('payment-error-pulse');
              c.removeEventListener('animationend', h);
            });
          }
          applyPaymentGlow();
          setTimeout(highlightEmptyFields, 400);
        }
        showCardDetailsTooltip(btn);
        return;
      }

      // ── Active (Pay Now): normal flow ────────────────────────
      var c = el('paymentCard');
      if (c) {
        c.scrollIntoView({ behavior: 'smooth', block: 'center' });
        c.classList.remove('payment-error-pulse');
        void c.offsetWidth;
        c.classList.add('payment-error-pulse');
        c.addEventListener('animationend', function h() {
          c.classList.remove('payment-error-pulse');
          c.removeEventListener('animationend', h);
        });
      }
      applyPaymentGlow();
      setTimeout(highlightEmptyFields, 400);
      showCardDetailsTooltip(btn);
    }

    /* ── Active/inactive state for inlineCtaA ── */
    function setInlineCtaActive(active) {
      var btn = document.getElementById('inlineCtaA');
      if (!btn) return;
      if (active) {
        btn.classList.remove('cta-inactive');
      } else {
        btn.classList.add('cta-inactive');
      }
    }

    /* ── Label helper: updates only the text node inside inlineCtaA
          so onclick / styles are never wiped ── */
    function setInlineCtaLabel(text) {
      var btn = document.getElementById('inlineCtaA');
      if (!btn) return;
      // Find or create a text-only span inside the button
      var lbl = btn.querySelector('.cta-label');
      if (lbl) {
        lbl.textContent = text;
      } else {
        // First call: wrap existing text in a span
        btn.innerHTML = '<span class="cta-label">' + text + '</span>';
      }
    }

    /* ── Tooltip message is context-aware: saved-card vs new-card ── */
    function getCtaTooltipMessage() {
      var savedPanel = document.getElementById('savedCardsPanel');
      var newPanel   = document.getElementById('newCardPanel');
      var savedVisible = savedPanel && savedPanel.style.display !== 'none';
      var newVisible   = newPanel   && newPanel.style.display   !== 'none';
      if (savedVisible && !newVisible) {
        return 'Please enter the CVV of your saved card to proceed.';
      }
      return 'Please complete your card details to proceed.';
    }

    function showCardDetailsTooltip(targetBtn) {
      var existing = document.getElementById('cardDetailsTip');
      if (existing) { existing.remove(); }

      var btn = targetBtn || document.getElementById('pcsfUnifiedCta');
      if (!btn) return;

      var tip = document.createElement('div');
      tip.id = 'cardDetailsTip';
      tip.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0">' +
          '<circle cx="8" cy="8" r="7.3" fill="#E03535"/>' +
          '<path d="M8 5v4M8 10.5v.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>' +
        '</svg>' +
        '<span>' + getCtaTooltipMessage() + '</span>' +
        '<div id="cardDetailsTipArrow"></div>';

      tip.style.cssText = [
        'position:absolute',
        'bottom:calc(100% + 10px)',
        'left:50%',
        'transform:translateX(-50%) translateY(6px)',
        'background:#1A1A2E',
        'color:#fff',
        'font-size:12.5px',
        'font-weight:600',
        'font-family:"DM Sans",sans-serif',
        'padding:10px 14px',
        'border-radius:10px',
        'display:flex',
        'align-items:center',
        'gap:9px',
        'box-shadow:0 8px 24px rgba(0,0,0,.28)',
        'z-index:99999',
        'opacity:0',
        'transition:opacity .2s,transform .2s',
        'pointer-events:none',
        'min-width:260px',
        'max-width:420px',
        'white-space:normal',
        'line-height:1.4'
      ].join(';');

      /* downward arrow */
      var arrow = tip.querySelector('#cardDetailsTipArrow');
      arrow.style.cssText = [
        'position:absolute',
        'bottom:-7px',
        'left:50%',
        'transform:translateX(-50%)',
        'width:0',
        'height:0',
        'border-left:7px solid transparent',
        'border-right:7px solid transparent',
        'border-top:7px solid #1A1A2E'
      ].join(';');

      /* anchor to the CTA button (which is position:relative from pcsfCtaCol) */
      var anchor = targetBtn ? btn.parentNode : (document.getElementById('pcsfCtaCol') || btn.parentNode);
      anchor.style.position = 'relative';
      anchor.appendChild(tip);

      requestAnimationFrame(function () {
        tip.style.opacity = '1';
        tip.style.transform = 'translateX(-50%) translateY(0)';
      });

      setTimeout(function () {
        tip.style.opacity = '0';
        tip.style.transform = 'translateX(-50%) translateY(6px)';
        setTimeout(function () { tip.remove(); }, 250);
      }, 3000);
    }

    // ── Premium Breakup Sheet ─────────────────────────────────────
    function openBreakupSheet() {
      var sideVat = el('sideVat'), sideTotal = el('sideTotal');
      var buVat = el('buVat'), buTotal = el('buTotal');
      if (sideVat && buVat) buVat.textContent = sideVat.textContent;
      if (sideTotal && buTotal) buTotal.textContent = sideTotal.textContent;
      var rows = '';
      Object.keys(addons).forEach(function (k) {
        var m = ADDON_META[k];
        rows += '<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F5F5F8;"><span style="font-size:13px;color:#4A4A6A;">' + m.label + '</span><span style="font-size:13px;font-weight:600;color:#1A1A2E;">+ <svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>' + m.price.toFixed(2) + (m.vatIncl ? '' : ' +VAT') + '</span></div>';
      });
      var sec = el('buAddonsSection'), rw = el('buAddonRows');
      if (sec) sec.style.display = rows ? 'block' : 'none';
      if (rw) rw.innerHTML = rows;
      var sheet = el('breakupSheet'), inner = el('breakupSheetInner');
      if (sheet) { sheet.style.display = 'flex'; requestAnimationFrame(function () { if (inner) inner.style.transform = 'translateY(0)'; }); }
      document.body.style.overflow = 'hidden';
    }
    function closeBreakupSheet() {
      var inner = el('breakupSheetInner');
      if (inner) inner.style.transform = 'translateY(100%)';
      setTimeout(function () { var s = el('breakupSheet'); if (s) s.style.display = 'none'; }, 400);
      document.body.style.overflow = '';
    }

    // ── Sync total into sticky bar ────────────────────────────────
    (function () {
      var orig = window.recalc;
      window.recalc = function () {
        if (orig) orig();
        var ts = (el('sideTotal') || {}).textContent || '';
        if (ts) {
          var a = el('pcsfTotalAmt'); if (a) a.textContent = ts;
          var b = el('pcsfCtaAmt'); if (b) b.textContent = ts;
          var c = el('buTotal'); if (c) c.textContent = ts;
          var d = el('vehicleCardTotalAmt'); if (d) d.textContent = ts;
          var h = el('heroTotalAmt'); if (h) h.textContent = ts;
          // Sync mobile vehicle card total
          var mobVehicleAmts = document.querySelectorAll('#mobileVehicleCard [data-total-amt]');
          mobVehicleAmts.forEach(function (el) { el.textContent = ts; });
          // Also update inline (the static element)
          var mvAmt = document.querySelector('#mobileVehicleCard div[style*="font-size:17px"]');
          if (mvAmt) mvAmt.textContent = ts;
        }
      };
    })();

/* ===== Block separator ===== */

/* ── Addon Info Data ── */
    var ADDON_INFO = {
      carHire: {
        title: 'Rent-a-Car Cover',
        price: '+<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>150 + VAT',
        desc: 'If your vehicle is damaged and needs garage repairs, we\'ll cover the cost of a rental car so you stay mobile — no out-of-pocket expense.',
        features: [
          'Up to 15 days rental coverage per claim',
          'Applies to both accident & weather damage repairs',
          'Book any UAE licensed rental company',
          'Coverage starts from Day 1 of garage admission',
          'No excess or deductible on rental cost',
                  'Policy Add-on · Fulfilled by InsuranceMarket.ae',
        ],
        icon: '<path d="M4 15h20M6 15L8.5 9H21.5L24 15M4 15v4a1.5 1.5 0 001.5 1.5H7A1.5 1.5 0 008.5 19v-4M19.5 15v4a1.5 1.5 0 001.5 1.5H23a1.5 1.5 0 001.5-1.5v-4" stroke="#FE7333" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="16.5" r="1.8" fill="#FE7333"/><circle cx="22" cy="16.5" r="1.8" fill="#FE7333"/>',
        keyId: 'carHire', price_val: 150
      },
      gccOpt: {
        title: 'GCC Cross-Border Cover',
        price: '+<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>500 + VAT',
        desc: 'Extends your UAE motor insurance to cover driving across all GCC member states — Saudi Arabia, Kuwait, Bahrain, Oman, and Qatar.',
        features: [
          'Valid in KSA, Kuwait, Bahrain, Oman & Qatar',
          'Includes your Orange Card for border crossings',
          'Third-party liability meets each country\'s minimum',
          'Valid for the full 13-month policy duration',
          'One-time add-on, no per-trip activation needed',
                  'Policy Add-on · Fulfilled by InsuranceMarket.ae',
        ],
        icon: '<circle cx="14" cy="14" r="10" stroke="#FE7333" stroke-width="1.6"/><ellipse cx="14" cy="14" rx="5" ry="10" stroke="#FE7333" stroke-width="1.4"/><path d="M4 14h20M7 8.5C9.5 10 12 11 14 11s4.5-1 7-2.5M7 19.5C9.5 18 12 17 14 17s4.5 1 7 2.5" stroke="#FE7333" stroke-width="1.3" stroke-linecap="round"/>',
        keyId: 'gccOpt', price_val: 500
      },
      medex: {
        title: 'Personal Accident Cover',
        price: '+<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>85 + VAT',
        desc: 'Provides a lump-sum payout to you or your family if you are injured or killed in a road accident — regardless of who was at fault.',
        features: [
          '<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>200,000 accidental death benefit for driver',
          '<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>50,000 permanent disability cover',
          '<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>20,000 medical expenses reimbursement',
          'Covers driver only (not passengers)',
          'Pays regardless of third-party fault',
                  'Policy Add-on · Fulfilled by InsuranceMarket.ae',
        ],
        icon: '<rect x="8" y="4" width="12" height="20" rx="3" stroke="#FE7333" stroke-width="1.6"/><path d="M14 9v6M11 12h6" stroke="#FE7333" stroke-width="1.8" stroke-linecap="round"/>',
        keyId: 'medex', price_val: 85
      },
      excessCb: {
        title: 'Excess Cashback',
        price: '+<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>85 + VAT',
        desc: 'After a successful claim is settled, we\'ll refund your standard excess back to you — so a claim never costs you out of pocket.',
        features: [
          'Full excess refund after each settled claim',
          'Applies to own-damage and agency repair claims',
          'No waiting period — paid on claim settlement',
          'Works alongside your existing excess structure',
          'Stackable with other add-ons',
                  'Policy Add-on · Fulfilled by InsuranceMarket.ae',
        ],
        icon: '<circle cx="14" cy="14" r="10" stroke="#FE7333" stroke-width="1.6"/><path d="M14 9v1.5M14 17.5V19M11 11.5a3 3 0 015.5 1.5c0 2-2 2.5-3 3v.5" stroke="#FE7333" stroke-width="1.7" stroke-linecap="round"/>',
        keyId: 'excessCb', price_val: 85
      },
      courier: {
        title: 'Courier My Documents',
        price: '+<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>25 + VAT',
        desc: 'We\'ll arrange tracked, insured courier delivery of your original policy documents directly to your door — no trip to the office needed.',
        features: [
          'Original policy certificate & insurance card',
          'Tracked delivery via premium courier',
          'Shipment insured for full document value',
          'Delivered within 3–5 working days of policy issue',
          'UAE-wide delivery coverage',
          'Fulfilled by myAlfred LLC',
        ],
        icon: '<rect x="4" y="6" width="20" height="16" rx="2" stroke="#FE7333" stroke-width="1.6"/><path d="M4 10h20M9 6V4M19 6V4M8 14l2 2 4-4" stroke="#FE7333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
        keyId: 'courier', price_val: 25
      }
    };

    var COVERED_INFO = {
      ownDamage: {
        title: 'Own Damage Cover',
        desc: 'Comprehensive protection covering the cost to repair or replace your vehicle if damaged in an accident, fire, or theft.',
        features: ['Coverage up to vehicle value', 'Includes accidental collision', 'Fire and theft protection', 'Malicious acts coverage'],
        icon: '<rect x="4" y="8" width="20" height="12" rx="2" stroke="#2E7D32" stroke-width="1.8"/><circle cx="8" cy="20" r="2" fill="#2E7D32"/><circle cx="20" cy="20" r="2" fill="#2E7D32"/>'
      },
      agencyRepair: {
        title: 'Agency Repair',
        desc: 'Guarantees your vehicle will be repaired at the official manufacturer\'s authorized dealership workshop.',
        features: ['Repairs at official agency', '100% genuine parts guaranteed', 'Maintains manufacturer warranty', 'Highest quality repair standards'],
        icon: '<path d="M14 4v16M8 8h12M10 16h8" stroke="#2E7D32" stroke-width="1.8" stroke-linecap="round"/>'
      },
      tpl: {
        title: 'Third Party Liability',
        desc: 'Mandatory coverage protecting you financially against damages to other people\'s property or bodily injury.',
        features: ['Property damage up to <svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>3.5M', 'Unlimited bodily injury cover', 'Legal defense costs included', 'Meets UAE traffic regulations'],
        icon: '<circle cx="14" cy="14" r="8" stroke="#2E7D32" stroke-width="1.8"/><path d="M14 10v4l3 3" stroke="#2E7D32" stroke-width="1.8" stroke-linecap="round"/>'
      },
      roadside: {
        title: '24/7 Roadside Assistance',
        desc: 'Emergency support available anytime, anywhere in the UAE to help with towing, flat tires, dead batteries, or lockouts.',
        features: ['Free towing service', 'Flat tire change', 'Battery boost', 'Emergency fuel delivery'],
        icon: '<path d="M6 14h16M10 10l8-4v8" stroke="#2E7D32" stroke-width="1.8" stroke-linecap="round"/>'
      },
      fastTrack: {
        title: 'Fast Track Claims',
        desc: 'Priority queue for your claims ensuring faster approvals, VIP service, and prioritized repair slot allocations.',
        features: ['Priority claim processing', 'Dedicated case manager', 'VIP repair slot allocation', 'Reduced approval wait times'],
        icon: '<path d="M4 14l6-6 4 4 10-10" stroke="#2E7D32" stroke-width="1.8" stroke-linecap="round"/><path d="M20 2h4v4" stroke="#2E7D32" stroke-width="1.8" stroke-linecap="round"/>'
      },
      driverPassenger: {
        title: 'Driver & Passenger Cover',
        desc: 'Personal accident cover extending to you and the passengers in your vehicle in the event of an unfortunate accident.',
        features: ['Death benefits for driver & passengers', 'Permanent disability coverage', 'Medical expenses up to policy limit', 'Valid regardless of fault'],
        icon: '<circle cx="14" cy="8" r="4" stroke="#2E7D32" stroke-width="1.8"/><path d="M6 22c0-4 4-6 8-6s8 2 8 6" stroke="#2E7D32" stroke-width="1.8" stroke-linecap="round"/>'
      },
      omanCover: {
        title: 'Oman Cover (Orange Card)',
        desc: 'Includes the required regional Orange Card extending your standard policy coverage to the Sultanate of Oman.',
        features: ['Valid for physical border crossing', 'Third-party liability in Oman', 'Own damage valid in Oman', 'No prior notification required'],
        icon: '<path d="M10 4h8l4 6v8a2 2 0 01-2 2H8a2 2 0 01-2-2V10l4-6z" stroke="#2E7D32" stroke-width="1.8" stroke-linecap="round"/>'
      },
      myAlfred: {
        title: 'myAlfred Premium Membership',
        desc: 'Complimentary access to exclusive discounts, lifestyle benefits, and premium concierge services throughout the UAE.',
        features: ['Exclusive dining & gym discounts', 'Dedicated concierge service', 'Special rate renewal offers', 'Mobile app digital access'],
        icon: '<path d="M6 8l8-4 8 4v8l-8 4-8-4V8z" stroke="#2E7D32" stroke-width="1.8" stroke-linecap="round"/>'
      }
    };

    var _currentAddonKey = null;

    function openCoveredInfo(key) {
      var info = COVERED_INFO[key];
      if (!info) return;
      _currentAddonKey = null;

      document.getElementById('aimTitle').textContent = info.title;
      var pill = document.getElementById('aimFulfillerPill');
      if (pill) pill.style.display = 'none';
      var badge = document.querySelector('.aim-price-badge');
      if (badge) badge.style.display = 'none';
      document.getElementById('aimDesc').textContent = info.desc;

      var iconSvg = document.getElementById('aimIcon');
      iconSvg.innerHTML = '<circle cx="20" cy="20" r="20" fill="#E8F5E9"/><svg x="8" y="8" width="24" height="24" viewBox="0 0 28 28" fill="none">' + info.icon + '</svg>';

      var featHtml = info.features.map(function (f) {

        if (f.indexOf('Policy Add-on') === 0 || f.indexOf('Fulfilled by') === 0) {
          return ''; // rendered in modal header instead
        }
        return '<div class="aim-feature"><div class="aim-feature-dot"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="#1DB87E" stroke-width="1.8" stroke-linecap="round"/></svg></div><div class="aim-feature-text">' + f + '</div></div>';
      }).join('');
      document.getElementById('aimFeatures').innerHTML = featHtml;

      var ctaBtn = document.getElementById('aimCtaBtn');
      ctaBtn.style.display = 'none';

      var modal = document.getElementById('addonInfoModal');
      modal.classList.add('aim-open');
      document.body.style.overflow = 'hidden';
    }

    function openAddonInfo(key) {
      var badge = document.querySelector('.aim-price-badge');
      if (badge) badge.style.display = 'flex';
      var info = ADDON_INFO[key];
      if (!info) return;
      _currentAddonKey = key;

      document.getElementById('aimTitle').textContent = info.title;

      // Show fulfiller pills in header
      var pill = document.getElementById('aimFulfillerPill');
      if (pill) {
        var tagPolicy = document.getElementById('aimTagPolicy');
        var tagIM = document.getElementById('aimTagIM');
        var tagAlfred = document.getElementById('aimTagAlfred');
        // Reset all
        [tagPolicy, tagIM, tagAlfred].forEach(function(t){ if(t) t.style.display = 'none'; });
        if (key === 'courier') {
          if (tagAlfred) tagAlfred.style.display = 'inline-flex';
        } else {
          if (tagPolicy) tagPolicy.style.display = 'inline-flex';
          if (tagIM) tagIM.style.display = 'inline-flex';
        }
        pill.style.display = 'flex';
      }
      document.getElementById('aimPrice').innerHTML = info.price;
      document.getElementById('aimDesc').textContent = info.desc;

      // Render icon
      var iconSvg = document.getElementById('aimIcon');
      iconSvg.innerHTML = '<circle cx="20" cy="20" r="20" fill="#FFF1EB"/><svg x="8" y="8" width="24" height="24" viewBox="0 0 28 28" fill="none">' + info.icon + '</svg>';

      // Render features
      var featHtml = info.features.map(function (f) {
        if (f.indexOf('Fulfilled by') === 0) {
          return '<div style="display:inline-flex;align-items:center;gap:6px;margin-top:8px;background:#F0FAF5;border:1px solid #C3E6CB;border-radius:100px;padding:4px 12px;">'
            + '<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M1.5 6L4.5 9L10.5 3" stroke="#1DB87E" stroke-width="1.8" stroke-linecap="round"/></svg>'
            + '<span style="font-size:11px;font-weight:700;color:#1DB87E;">' + f + '</span></div>';
        }
        if (f.indexOf('Policy Add-on') === 0 || f.indexOf('Fulfilled by') === 0) {
          return ''; // rendered in modal header instead
        }
        return '<div class="aim-feature"><div class="aim-feature-dot"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="#1DB87E" stroke-width="1.8" stroke-linecap="round"/></svg></div><div class="aim-feature-text">' + f + '</div></div>';
      }).join('');
      document.getElementById('aimFeatures').innerHTML = featHtml;

      // Update CTA button — Add only, no remove
      var isAdded = addons.hasOwnProperty(key);
      var ctaBtn = document.getElementById('aimCtaBtn');
      var ctaAdded = document.getElementById('aimCtaAdded');
      if (isAdded) {
        ctaBtn.style.display = 'none';
        if (ctaAdded) ctaAdded.style.display = 'flex';
      } else {
        ctaBtn.style.display = 'block';
        ctaBtn.textContent = 'Add to My Policy';
        ctaBtn.style.background = 'linear-gradient(135deg,#FE7333,#E05A1C)';
        if (ctaAdded) ctaAdded.style.display = 'none';
      }

      var modal = document.getElementById('addonInfoModal');
      modal.classList.add('aim-open');
      document.body.style.overflow = 'hidden';
    }

    function closeAddonInfo() {
      var inner = document.getElementById('addonInfoInner');
      var modal = document.getElementById('addonInfoModal');
      if (inner) inner.style.transform = 'translateY(100%)';
      setTimeout(function () {
        modal.classList.remove('aim-open');
        if (inner) inner.style.transform = '';
        document.body.style.overflow = '';
      }, 380);
    }

    function addonInfoCtaClick() {
      if (!_currentAddonKey) return;
      var info = ADDON_INFO[_currentAddonKey];
      var isAdded = addons.hasOwnProperty(_currentAddonKey);
      if (isAdded) { closeAddonInfo(); return; } // already added — do nothing

      // Add the addon
      var sideBtn = document.getElementById('sidebtn-' + _currentAddonKey);
      if (sideBtn) {
        sideBtn.classList.remove('state-add');
        sideBtn.classList.add('state-added');
        toggleAddonBoth(_currentAddonKey, info.price_val, sideBtn);
      } else {
        addons[_currentAddonKey] = info.price_val;
        recalc();
      }

      // Show added confirmation, hide CTA — modal stays open
      var ctaBtn = document.getElementById('aimCtaBtn');
      var ctaAdded = document.getElementById('aimCtaAdded');
      if (ctaBtn) ctaBtn.style.display = 'none';
      if (ctaAdded) ctaAdded.style.display = 'flex';
    }

    // Swipe down to close addon modal
    (function () {
      // Event delegation for aim-tag tooltips — works regardless of display state
      document.addEventListener('click', function(e) {
        var tag = e.target.closest('.aim-tag');
        var ftag = e.target.closest('.ypc-fulfiller-policy, .ypc-fulfiller-im, .ypc-fulfiller-alfred');
        if (tag) {
          e.stopPropagation();
          var isActive = tag.classList.contains('tip-active');
          document.querySelectorAll('.aim-tag').forEach(function(t){ t.classList.remove('tip-active'); });
          if (!isActive) tag.classList.add('tip-active');
        } else if (ftag) {
          e.stopPropagation();
          var isActive2 = ftag.classList.contains('ftip-active');
          document.querySelectorAll('.ypc-fulfiller-policy,.ypc-fulfiller-im,.ypc-fulfiller-alfred').forEach(function(t){ t.classList.remove('ftip-active'); });
          if (!isActive2) ftag.classList.add('ftip-active');
        } else {
          document.querySelectorAll('.aim-tag').forEach(function(t){ t.classList.remove('tip-active'); });
          document.querySelectorAll('.ypc-fulfiller-policy,.ypc-fulfiller-im,.ypc-fulfiller-alfred').forEach(function(t){ t.classList.remove('ftip-active'); });
        }
      });
      var inner = document.getElementById('addonInfoInner'), sy = 0;
      if (!inner) return;
      inner.addEventListener('touchstart', function (e) { sy = e.touches[0].clientY; }, { passive: true });
      inner.addEventListener('touchend', function (e) { if (e.changedTouches[0].clientY - sy > 60) closeAddonInfo(); }, { passive: true });
    })();

    /* ── Fix 2: Card form collapse on mobile — only show when card selected ── */
    (function () {
      var origSelect = window.selectPayMethod2;
      window.selectPayMethod2 = function (method) {
        if (origSelect) origSelect(method);
        var form = document.getElementById('inlineCardForm');
        var logoRow = document.getElementById('cardLogosRow');
        if (!form) return;
        if (method === 'card') {
          form.classList.remove('form-collapsed');
          if (logoRow) logoRow.style.display = 'flex';
        } else {
          form.classList.add('form-collapsed');
          if (logoRow) logoRow.style.display = 'none';
        }
      };
      // On mobile, start open since card is default
      if (window.innerWidth <= 767) {
        var form = document.getElementById('inlineCardForm');
        if (form) form.style.maxHeight = '999px';
      }
    })();

    /* ── Fix 4 & 6: Mobile vehicle card and enriched bottom bar ── */
    (function () {
      // Inject vehicle info strip into sticky footer
      var footerInner = document.getElementById('pcsfInner');
      if (footerInner) {
        var strip = document.createElement('div');
        strip.id = 'pcsfVehicleInfoRow';
        strip.innerHTML = [
          '<div class="pcsf-vehicle-logo"><img src="data:image/png;base64,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"  style="width:100%;height:100%;object-fit:contain;padding:2px;" alt="GIG Gulf" style="width:85%;height:85%;object-fit:contain;"/></div>',
          '<div style="flex:1;min-width:0;overflow:hidden;">',
          '<div class="pcsf-vehicle-name">GIG Gulf (AXA) · Motor Perfect Plus</div>',
          '<div class="pcsf-vehicle-meta">Toyota GR86 2.4L · 2024 · Comprehensive (Agency)</div>',
          '</div>',
          '<div class="pcsf-vehicle-total">',
          '<div class="pcsf-vehicle-total-amt" id="pcsfVehicleAmt"><svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>6,024</div>',
          '<div class="pcsf-vehicle-total-sub">VAT incl. · 13 months</div>',
          '</div>'
        ].join('');
        footerInner.parentNode.insertBefore(strip, footerInner);
      }

      // Sync vehicle amt with recalc
      var origRecalcFix6 = window.recalc;
      window.recalc = function () {
        if (origRecalcFix6) origRecalcFix6();
        var ts = (document.getElementById('sideTotal') || {}).textContent || '';
        if (ts) {
          var num = parseFloat(ts.replace(/[^0-9.]/g, ''));
          var v = document.getElementById('pcsfVehicleAmt');
          if (v && num) v.innerHTML = '<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>' + Math.round(num).toLocaleString('en-US');
        }
      };
    })();

/* ===== Block separator ===== */

(function () {
      var isMob = function () { return window.innerWidth <= 767; };

      /* ── Bottom CTA bar on mobile: show after 8% scroll, hide below 8% ── */
      var bar = document.getElementById('payCardStickyFooter');
      if (bar) {
        function mobileBarCheck() {
          // Delegate to main check() which uses the same trigger logic
          if (typeof check === 'function') check();
        }
        window.addEventListener('scroll', mobileBarCheck, { passive: true });
        window.addEventListener('resize', mobileBarCheck, { passive: true });
        window.addEventListener('load', mobileBarCheck);
        // Hidden on load
        bar.classList.remove('bar-visible');
      }

      /* ── Sync total into insurer strip ── */
      function syncMobBarTotal() {
        var ts = (document.getElementById('sideTotal') || {}).textContent || '';
        if (!ts) return;
        var num = parseFloat(ts.replace(/[^0-9.]/g, ''));
        var el = document.getElementById('mobBarAmt');
        if (el && num) el.innerHTML = '<svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>' + Math.round(num).toLocaleString('en-US');
      }
      var _origRecalc = window.recalc;
      window.recalc = function () {
        if (_origRecalc) _origRecalc();
        syncMobBarTotal();
        // Sync order summary totals
        var ts = (document.getElementById('sideTotal') || {}).textContent || '';
        var vs = (document.getElementById('sideVat') || {}).textContent || '';
        var ot = document.getElementById('osTotalAmt'); if (ot && ts) ot.textContent = ts;
        var ov = document.getElementById('osVatAmt'); if (ov && vs) ov.textContent = vs;
        // Addon rows in order summary
        var osAddSec = document.getElementById('osAddonsSection');
        var oaEl = document.getElementById('osAddonRows');
        var addonKeys = Object.keys(addons);
        if (osAddSec) osAddSec.style.display = addonKeys.length > 0 ? 'block' : 'none';
        if (oaEl && addonKeys.length > 0) {
          oaEl.innerHTML = addonKeys.map(function(k) {
            var m = ADDON_META[k];
            return '<div class="os-price-row"><span style="color:#4A4A6A;">' + m.label + '</span><span style="font-weight:600;color:#1A1A2E;">+ <svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>' + m.price.toFixed(2) + (m.vatIncl ? '' : ' +VAT') + '</span></div>';
          }).join('');
        }
      };
      window.addEventListener('load', function () { syncMobBarTotal(); });

      /* ── Order Summary sheet open/close ── */
      window.openOrderSummary = function () {
        // Sync totals before opening
        var ts = (document.getElementById('sideTotal') || {}).textContent || '';
        var vs = (document.getElementById('sideVat') || {}).textContent || '';
        var ot = document.getElementById('osTotalAmt'); if (ot && ts) ot.textContent = ts;
        var ov = document.getElementById('osVatAmt'); if (ov && vs) ov.textContent = vs;
        // Sync add-ons section
        var osAddSec = document.getElementById('osAddonsSection');
        var osAddRows = document.getElementById('osAddonRows');
        var addonKeys = Object.keys(addons);
        if (osAddSec) osAddSec.style.display = addonKeys.length > 0 ? 'block' : 'none';
        if (osAddRows && addonKeys.length > 0) {
          osAddRows.innerHTML = addonKeys.map(function(k) {
            var m = ADDON_META[k];
            return '<div class="os-price-row"><span style="color:#4A4A6A;">' + m.label + '</span><span style="font-weight:600;color:#1A1A2E;">+ <svg class="aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.53 334.44" fill="currentColor" fill-rule="evenodd" aria-label="AED"><path d="M381.52,157.18L384.53,160.02L384.53,151.41C384.53,132.45 371.24,117.02 354.91,117.02L328.81,117.03C310.55,40.93 248.32,0 155.76,0C96.81,0 89.24,0 33.42,0C33.42,0 50.18,14.09 50.18,58.44L50.18,117.06L19.31,117.07C13.31,117.07 7.68,114.75 3.01,110.36L0,107.53L0,116.14C0,135.1 13.29,150.53 29.62,150.53L50.18,150.52L50.18,183.96L19.31,183.97C13.31,183.97 7.68,181.65 3.01,177.27L0,174.43L0,183.03C0,201.99 13.29,217.41 29.62,217.41L50.18,217.4L50.18,278.61C50.18,321.71 33.42,334.43 33.42,334.43L155.76,334.44C251.23,334.44 311.47,293.22 329.03,217.37L365.22,217.36C371.22,217.36 376.85,219.68 381.52,224.06L384.53,226.9L384.53,218.29C384.53,199.34 371.24,183.92 354.91,183.92L333.84,183.92C334.2,178.48 334.39,172.91 334.39,167.2C334.39,161.49 334.19,155.92 333.81,150.48L365.22,150.48C371.22,150.48 376.85,152.8 381.52,157.18M100.31,16.74L151.45,16.74C220.25,16.74 260.1,47.22 272,117.04L100.31,117.06L100.31,16.74M151.89,317.73L100.31,317.73L100.31,217.4L271.89,217.37C260.77,280.56 224.98,315.93 151.89,317.73M275.81,167.22C275.81,172.94 275.68,178.51 275.43,183.93L100.31,183.96L100.31,150.52L275.43,150.49C275.68,155.89 275.81,161.46 275.81,167.22Z"/></svg>' + m.price.toFixed(2) + (m.vatIncl ? '' : ' +VAT') + '</span></div>';
          }).join('');
        }
        var sheet = document.getElementById('orderSummarySheet');
        if (sheet) { sheet.classList.add('os-open'); document.body.style.overflow = 'hidden'; }
      };
      window.closeOrderSummary = function () {
        var sheet = document.getElementById('orderSummarySheet');
        var inner = document.getElementById('orderSummaryInner');
        if (!sheet) return;
        if (inner) inner.style.transform = 'translateY(100%)';
        setTimeout(function () {
          sheet.classList.remove('os-open');
          if (inner) inner.style.transform = '';
          document.body.style.overflow = '';
        }, 380);
      };
      // Swipe down to close
      var inner = document.getElementById('orderSummaryInner'), sy = 0;
      if (inner) {
        inner.addEventListener('touchstart', function (e) { sy = e.touches[0].clientY; }, { passive: true });
        inner.addEventListener('touchend', function (e) { if (e.changedTouches[0].clientY - sy > 60) closeOrderSummary(); }, { passive: true });
      }
    })();

/* ===== Block separator ===== */

(function() {
    var tip = null;

    function getOrCreateTip() {
      if (!tip) {
        tip = document.createElement('div');
        tip.id = 'incTooltipGlobal';
        tip.style.cssText = [
          'position:fixed',
          'background:#1A1A2E',
          'color:#fff',
          'font-size:11.5px',
          'font-weight:500',
          'line-height:1.5',
          'padding:9px 13px',
          'border-radius:10px',
          'pointer-events:none',
          'opacity:0',
          'transition:opacity .15s ease',
          'z-index:9999',
          'box-shadow:0 6px 20px rgba(26,26,46,.28)',
          'max-width:240px',
          'white-space:normal',
          'text-align:left',
          'top:0',
          'left:0'
        ].join(';');

        // Caret arrow
        var arrow = document.createElement('div');
        arrow.id = 'incTooltipArrow';
        arrow.style.cssText = [
          'position:absolute',
          'top:100%',
          'left:18px',
          'width:0',
          'height:0',
          'border:5px solid transparent',
          'border-top-color:#1A1A2E'
        ].join(';');
        tip.appendChild(arrow);
        document.body.appendChild(tip);
      }
      return tip;
    }

    function showTip(icon, text) {
      var t = getOrCreateTip();
      // Set text (preserve arrow element)
      t.childNodes[0] && t.childNodes[0].nodeType === 3 && t.removeChild(t.childNodes[0]);
      t.insertBefore(document.createTextNode(text), t.firstChild);

      var rect = icon.getBoundingClientRect();
      t.style.opacity = '0';
      t.style.display = 'block';

      // Position: above the icon, left-aligned to icon
      var tipW = t.offsetWidth;
      var tipH = t.offsetHeight;
      var left = rect.left;
      var top = rect.top - tipH - 10;

      // Keep within viewport
      if (left + tipW > window.innerWidth - 12) left = window.innerWidth - tipW - 12;
      if (left < 8) left = 8;
      // If not enough room above, flip below
      var arrow = document.getElementById('incTooltipArrow');
      if (top < 8) {
        top = rect.bottom + 10;
        if (arrow) {
          arrow.style.top = 'auto';
          arrow.style.bottom = '100%';
          arrow.style.borderTopColor = 'transparent';
          arrow.style.borderBottomColor = '#1A1A2E';
        }
      } else {
        if (arrow) {
          arrow.style.top = '100%';
          arrow.style.bottom = 'auto';
          arrow.style.borderTopColor = '#1A1A2E';
          arrow.style.borderBottomColor = 'transparent';
        }
      }

      // Arrow left relative to tooltip
      var arrowLeft = Math.max(10, rect.left + (rect.width / 2) - left - 5);
      if (arrow) arrow.style.left = arrowLeft + 'px';

      t.style.left = left + 'px';
      t.style.top = top + 'px';
      requestAnimationFrame(function() { t.style.opacity = '1'; });
    }

    function hideTip() {
      if (tip) { tip.style.opacity = '0'; }
    }

    // Attach to all inc-info-icon elements on DOM ready
    function attachTooltips() {
      var wraps = document.querySelectorAll('.inc-name-wrap');
      wraps.forEach(function(wrap) {
        var icon = wrap.querySelector('.inc-info-icon');
        var tipSpan = wrap.querySelector('.inc-tooltip');
        if (!icon || !tipSpan) return;
        var text = tipSpan.textContent.trim();
        tipSpan.style.display = 'none';
        wrap.addEventListener('mouseenter', function() {
          var label = wrap.querySelector('.inc-name-label');
          if (label) { label.style.color = '#FE7333'; label.style.borderBottomColor = '#FE7333'; }
          icon.style.opacity = '1';
          showTip(icon, text);
        });
        wrap.addEventListener('mouseleave', function() {
          var label = wrap.querySelector('.inc-name-label');
          if (label) { label.style.color = ''; label.style.borderBottomColor = ''; }
          icon.style.opacity = '.5';
          hideTip();
        });
      });
      document.querySelectorAll('.cov-label').forEach(function(label) {
        var icon = label.querySelector('.inc-info-icon');
        var tipSpan = label.querySelector('.inc-tooltip');
        if (!icon || !tipSpan) return;
        var text = tipSpan.textContent.trim();
        tipSpan.style.display = 'none';
        label.style.cursor = 'default';
        icon.style.cursor = 'help';
        label.addEventListener('mouseenter', function() { icon.style.opacity = '1'; showTip(icon, text); });
        label.addEventListener('mouseleave', function() { icon.style.opacity = '.45'; hideTip(); });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachTooltips);
    } else {
      attachTooltips();
    }
  })();

/* ===== Block separator ===== */

(function() {
      var _t = null;
      window.showMarTip = function() {
        clearTimeout(_t);
        var b = document.getElementById('marTipBubble');
        if (b) b.style.display = 'block';
      };
      window.scheduleHideMarTip = function() {
        _t = setTimeout(function() {
          var b = document.getElementById('marTipBubble');
          if (b) b.style.display = 'none';
        }, 100);
      };
      /* legacy aliases */
      window.hideMarTip = window.scheduleHideMarTip;
      window.toggleMainAutoRenew = function() {
        var box = document.getElementById('mainAutoRenewBox');
        var chk = document.getElementById('mainAutoRenewChk');
        var row = document.getElementById('mainAutoRenewRow');
        if (!box) return;
        var isOn = box.getAttribute('data-on') === '1';
        if (!isOn) {
          box.setAttribute('data-on','1');
          box.style.background = '#FE7333';
          box.style.borderColor = '#FE7333';
          box.style.boxShadow = '0 0 0 3px rgba(254,115,51,.15)';
          chk.style.display = 'block';
          row.classList.add('mar-on');
        } else {
          box.setAttribute('data-on','0');
          box.style.background = '#fff';
          box.style.borderColor = '#CBD5E1';
          box.style.boxShadow = 'none';
          chk.style.display = 'none';
          row.classList.remove('mar-on');
        }
      };
      /* keep bubble alive when cursor moves onto it */
      document.addEventListener('DOMContentLoaded', function() {
        var bubble = document.getElementById('marTipBubble');
        if (bubble) {
          bubble.addEventListener('mouseenter', function() { clearTimeout(_t); bubble.style.display = 'block'; });
          bubble.addEventListener('mouseleave', function() { window.hideMarTip(); });
          bubble.style.pointerEvents = 'auto';
        }
      });
    })();

/* ===== Block separator ===== */

(function() {
      var tip = document.getElementById('cfTip');
      var currentWrap = null;
      function showTip(el, text) {
        if (!text) return;
        tip.textContent = text;
        tip.style.display = 'block';
        tip.style.opacity = '0';
        var r = el.getBoundingClientRect();
        var tw = 180;
        var left = r.right - tw;
        if (left < 8) left = 8;
        var top = r.top - tip.offsetHeight - 10;
        if (top < 8) top = r.bottom + 10;
        tip.style.left = left + 'px';
        tip.style.top = top + 'px';
        tip.style.opacity = '1';
        currentWrap = el;
      }
      function hideTip() {
        tip.style.opacity = '0';
        setTimeout(function(){ if(tip.style.opacity==='0') tip.style.display='none'; }, 150);
        currentWrap = null;
      }
      document.querySelectorAll('.cf-tooltip-wrap').forEach(function(el) {
        el.addEventListener('mouseenter', function(){ showTip(el, el.getAttribute('data-tip')); });
        el.addEventListener('mouseleave', hideTip);
      });
    })();

/* ===== Block separator ===== */

var CF_MODAL_DATA = {
      cardnum: {
        title: 'Card Number',
        showBack: false,
        highlightNum: true,
        desc: '16-digit number on the front',
        sub: 'Enter all 16 digits exactly as they appear on the front of your Visa, Mastercard, or Amex card.'
      },
      name: {
        title: 'Name on Card',
        showBack: false,
        highlightName: true,
        desc: 'Cardholder name',
        sub: 'Enter your name exactly as it appears on the card — no nicknames or abbreviations.'
      },
      cvv: {
        title: 'CVV / CVC Code',
        showBack: true,
        desc: '3 or 4 digit security code',
        sub: 'Found on the back of Visa, Mastercard & Discover. For Amex, the 4-digit code is on the front.'
      }
    };

    function openCardFieldModal(type) {
      var d = CF_MODAL_DATA[type];
      if (!d) return;
      document.getElementById('cfModalTitle').textContent = d.title;
      document.getElementById('cfModalDesc').textContent = d.desc;
      document.getElementById('cfModalSub').textContent = d.sub;

      // Show front or back
      var back = document.getElementById('cfModalCardBack');
      var front = document.getElementById('cfModalCardNum').parentElement.parentElement;
      if (d.showBack) {
        back.style.display = 'block';
        document.getElementById('cfModalCardNum').parentElement.style.display = 'none';
        document.getElementById('cfModalCardName').parentElement.parentElement.style.display = 'none';
      } else {
        back.style.display = 'none';
        document.getElementById('cfModalCardNum').parentElement.style.display = 'block';
        document.getElementById('cfModalCardName').parentElement.parentElement.style.display = 'flex';
      }

      // Highlight card number
      var numEl = document.getElementById('cfModalCardNum');
      numEl.style.color = d.highlightNum ? '#FE7333' : 'rgba(255,255,255,.85)';
      numEl.style.textShadow = d.highlightNum ? '0 0 8px rgba(254,115,51,.4)' : 'none';

      // Highlight name
      var nameEl = document.getElementById('cfModalCardName');
      nameEl.style.color = d.highlightName ? '#FE7333' : 'rgba(255,255,255,.85)';
      nameEl.style.textShadow = d.highlightName ? '0 0 8px rgba(254,115,51,.4)' : 'none';

      var m = document.getElementById('cfModal');
      m.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeCfModal() {
      var m = document.getElementById('cfModal');
      m.style.display = 'none';
      document.body.style.overflow = '';
    }

/* ===== Block separator ===== */

function openCvvModal() {
      var m = document.getElementById('cvvModal');
      m.style.display = 'flex';
      setTimeout(function() { m.style.opacity = '1'; }, 10);
    }
    function closeCvvModal() {
      document.getElementById('cvvModal').style.display = 'none';
    }
    function showProcessing(cb) {
      var ov = document.getElementById('payProcessingOverlay');
      ov.style.display = 'flex';
      setTimeout(function() { ov.style.display = 'none'; if (cb) cb(); }, 3200);
    }

    var __policyOriginalParent = null;
    var __policyOriginalNext = null;
    function openPolicyModal() {
      var ov = document.getElementById('policyModalOverlay');
      var widget = document.getElementById('policySummaryCard');
      var host = document.getElementById('pmContent');
      if (!ov || !widget || !host) return;
      // Remember where the widget lives so we can put it back
      __policyOriginalParent = widget.parentNode;
      __policyOriginalNext = widget.nextSibling;
      host.appendChild(widget);
      ov.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closePolicyModal() {
      var ov = document.getElementById('policyModalOverlay');
      var widget = document.getElementById('policySummaryCard');
      if (!ov) return;
      ov.classList.remove('is-open');
      document.body.style.overflow = '';
      if (widget && __policyOriginalParent) {
        if (__policyOriginalNext && __policyOriginalNext.parentNode === __policyOriginalParent) {
          __policyOriginalParent.insertBefore(widget, __policyOriginalNext);
        } else {
          __policyOriginalParent.appendChild(widget);
        }
      }
    }
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closePolicyModal();
    });
    window.scrollToPolicySummary = function(ev) {
      if (ev) ev.preventDefault();
      openPolicyModal();
    };

/* ===== Block separator ===== */

// ── Pay-mode tab switcher ────────────────────────────────────────
function switchPayMode(mode, btn) {
  document.querySelectorAll('.pay-mode-tab').forEach(function(t){ t.classList.remove('active'); });
  btn.classList.add('active');
  var saved = document.getElementById('savedCardsPanel');
  var newC  = document.getElementById('newCardPanel');
  // Reset CTA state on tab switch
  paymentDetailsAdded = false;
  setInlineCtaLabel('Complete Payment');
  // Saved tab: inactive until CVV entered. New-card tab: active (fields drive state)
  setInlineCtaActive(mode !== 'saved');
  var arRow = document.getElementById('autoRenewRow');
  var arWrap = document.getElementById('arWrap');
  if (mode === 'saved') {
    if (saved) saved.style.display = 'block';
    if (newC)  newC.style.display  = 'none';
    if (arRow) arRow.style.display = 'none';
    if (arWrap) arWrap.style.display = 'none';
  } else {
    if (saved) saved.style.display = 'none';
    if (newC)  newC.style.display  = 'block';
    if (arRow) arRow.style.display = '';
    if (arWrap) arWrap.style.display = 'flex';
  }
  updateSideCtaState();
}

// ── Saved-card OTP flow ──────────────────────────────────────────
var _scTimer = null;

function scShowState(id) {
  ['scStateMobile','scStateOtp','scStateCards'].forEach(function(s){
    var el = document.getElementById(s);
    if (el) el.classList.toggle('active', s === id);
  });
  // When the cards list first appears, ensure CTA is inactive (no CVV yet)
  if (id === 'scStateCards') {
    setInlineCtaActive(false);
    setInlineCtaLabel('Complete Payment');
  }
}

function scGoOtp() {
  var num = (document.getElementById('scMobile')||{}).value || '';
  num = num.replace(/\D/g,'');
  if (num.length < 9) return;
  var masked = '+971 ••' + num.slice(-4,-2) + ' ••• ' + num.slice(-2) + '••';
  var mn = document.getElementById('scMaskedNum');
  if (mn) mn.textContent = masked;
  scShowState('scStateOtp');
  scStartTimer(30);
}

function scBack() {
  clearInterval(_scTimer);
  scShowState('scStateMobile');
  var otp = document.getElementById('scOtp');
  if (otp) otp.value = '';
}

function scVerifyOtp() {
  var otp = (document.getElementById('scOtp')||{}).value || '';
  if (otp.length < 6) return;
  clearInterval(_scTimer);
  // Demo: any 6-digit code works
  scShowState('scStateCards');
}

function scResendOtp() {
  var otp = document.getElementById('scOtp');
  if (otp) otp.value = '';
  var err = document.getElementById('scOtpErr');
  if (err) err.textContent = '';
  scStartTimer(30);
}

function scStartTimer(seconds) {
  clearInterval(_scTimer);
  var resend = document.getElementById('scResend');
  var timerTxt = document.getElementById('scTimerText');
  var timerRow = document.getElementById('scTimerRow');
  if (resend) resend.disabled = true;
  var remaining = seconds;
  function tick() {
    if (remaining <= 0) {
      clearInterval(_scTimer);
      if (resend) resend.disabled = false;
      if (timerRow) timerRow.style.display = 'none';
      return;
    }
    var m = String(Math.floor(remaining/60)).padStart(2,'0');
    var s = String(remaining%60).padStart(2,'0');
    if (timerTxt) timerTxt.textContent = "Didn't get the OTP? (Request again in " + m + ':' + s + 's)';
    if (timerRow) timerRow.style.display = '';
    remaining--;
  }
  tick();
  _scTimer = setInterval(tick, 1000);
}

function scSelectCard(el) {
  document.querySelectorAll('.saved-card-item').forEach(function(c){ c.classList.remove('selected'); });
  el.classList.add('selected');
}

// Saved-CVV change → re-check CTA state
document.addEventListener('input', function(e) {
  if (e.target && e.target.classList.contains('saved-cvv-input')) {
    checkCardFormDone();
  }
});

// Init: show new card panel by default since "Use a new card" tab is active
document.addEventListener('DOMContentLoaded', function() {
  var newC = document.getElementById('newCardPanel');
  if (newC) newC.style.display = 'block';
  var arRow = document.getElementById('autoRenewRow');
  if (arRow) arRow.style.display = '';
  setInlineCtaActive(false);
});

/* ===== Block separator ===== */

(function() {
  function positionAlfredFloater() {
    var btn    = document.getElementById('askAlfredBtn');
    var footer = document.getElementById('payCardStickyFooter');
    if (!btn) return;

    var gap = 12;

    if (!footer) {
      btn.style.bottom = gap + 'px';
      return;
    }

    var rect           = footer.getBoundingClientRect();
    var viewportH      = window.innerHeight;
    var visibleFooterH = Math.max(0, viewportH - rect.top);
    btn.style.bottom   = (visibleFooterH + gap) + 'px';
  }

  // Run on load, resize, and scroll
  document.addEventListener('DOMContentLoaded', positionAlfredFloater);
  window.addEventListener('resize', positionAlfredFloater);
  window.addEventListener('scroll', positionAlfredFloater, { passive: true });

  // Also watch footer for class changes (bar-visible toggles)
  var footer = document.getElementById('payCardStickyFooter');
  if (footer && window.MutationObserver) {
    new MutationObserver(positionAlfredFloater).observe(footer, {
      attributes: true, attributeFilter: ['class', 'style']
    });
  }

  // Poll lightly for transform transitions
  setInterval(positionAlfredFloater, 200);
})();