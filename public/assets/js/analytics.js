/*!
 * CHITEK — Conversion & Event Tracking
 * 全局事件追踪层：一次接入，同时支持 GA4（en/es/pt/ar）与百度统计（zh）
 *
 * 事件清单（GA4 后台需把 generate_lead / contact_click 标记为「关键事件」）：
 *   generate_lead     表单提交成功（主转化）
 *   contact_click     点击电话 / 邮件 / WhatsApp（contact_method = phone|email|whatsapp）
 *   download_resource 下载 PDF / 图纸等资料
 *   outbound_click    点击站外链接
 *   form_start        开始填写表单（衡量表单摩擦）
 *   scroll_90         阅读深度 90%
 *   view_product      浏览产品详情页
 *
 * 调试：任意页面 URL 加 ?debug_track=1，控制台会打印所有事件
 *
 * 站点改版时：只改文件顶部的 CONFIG 配置区（域名、下载后缀、产品页路径、
 * 滚动阈值、归因天数等），下面的逻辑一般不用动。
 */
(function () {
  'use strict';

  /* ================= 配置区：站点大改时只改这里 ================= */
  var CONFIG = {
    // 主域名。用于判断站内 / 站外链接。
    // 留空字符串则自动从当前 hostname 推导（en.chitek-inno.com → chitek-inno.com）
    siteDomain: 'chitek-inno.com',

    // 计为「资料下载」的文件后缀。资源中心上线后按实际格式补
    downloadExt: ['pdf', 'zip', 'rar', '7z', 'dwg', 'dxf', 'step', 'stp', 'xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx'],

    // 产品详情页路径规则。产品页矩阵上线后若换 URL 结构，改这一行
    productPathRe: /\/products\/.+/,

    // 触发滚动事件的深度阈值
    scrollDepth: 0.9,

    // 首次接触归因保留天数（B2B 决策周期长，默认 30 天）
    firstTouchDays: 30,

    // WhatsApp 链接识别（含各子域）
    whatsappRe: /wa\.me|api\.whatsapp\.com|web\.whatsapp/i,

    // 表单提交地址。null = 提交到当前路径（Netlify 200 rewrite 会转发到 /<lang>/contact）
    submitEndpoint: null,

    // 调试参数：URL 带上即在控制台打印所有事件
    debugParam: 'debug_track'
  };
  /* ============================================================ */

  var LANG = document.documentElement.lang || 'en';
  var IS_ZH = LANG === 'zh';
  var DEBUG = location.search.indexOf(CONFIG.debugParam) > -1;
  var ATTR_KEY = 'chitek_attr';
  var UA_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];
  var DOWNLOAD_RE = new RegExp('\\.(' + CONFIG.downloadExt.join('|') + ')(\\?|#|$)', 'i');

  /* ---------------- 域名判断 ---------------- */
  function resolveSiteDomain() {
    if (CONFIG.siteDomain) return CONFIG.siteDomain;
    var parts = location.hostname.split('.');
    if (parts.length >= 2) return parts.slice(-2).join('.');
    return location.hostname; // localhost 等本地环境
  }

  var SITE_DOMAIN = resolveSiteDomain();

  // 站内：与当前 hostname 相同，或属于主域名（含各级子域）
  function isInternalHost(host) {
    if (!host) return true;
    if (host === location.hostname) return true;
    if (host === SITE_DOMAIN) return true;
    var suffix = '.' + SITE_DOMAIN;
    return host.length > suffix.length && host.slice(-suffix.length) === suffix;
  }

  /* ---------------- 统一追踪入口 ---------------- */
  function track(name, params) {
    params = params || {};
    if (params.lang === undefined) params.lang = LANG;

    try {
      // GA4（非中文站）
      if (!IS_ZH && typeof window.gtag === 'function') {
        window.gtag('event', name, params);
      } else if (!IS_ZH && Object.prototype.toString.call(window.dataLayer) === '[object Array]') {
        var payload = { event: name };
        for (var k in params) if (Object.prototype.hasOwnProperty.call(params, k)) payload[k] = params[k];
        window.dataLayer.push(payload);
      }
      // 百度统计（中文站）
      if (IS_ZH && Object.prototype.toString.call(window._hmt) === '[object Array]') {
        window._hmt.push(['_trackEvent', 'Conversion', name, params.label || location.pathname]);
      }
    } catch (e) {}

    if (DEBUG) console.log('[chitek.track]', name, params);
  }
  window.chitekTrack = track;

  /* ---------------- 归因：UTM / 首次来源 ---------------- */
  function readUrlAttribution() {
    var q = new URLSearchParams(location.search);
    var cur = {};
    UA_KEYS.forEach(function (k) {
      var v = q.get(k);
      if (v) cur[k] = v;
    });
    return cur;
  }

  function getAttribution() {
    var cur = readUrlAttribution();
    var hasUtm = Object.keys(cur).length > 0;

    if (hasUtm) {
      cur.landing_page = location.pathname + location.search;
      cur.ref = document.referrer || '';
      cur.ts = new Date().toISOString();
      try { sessionStorage.setItem(ATTR_KEY, JSON.stringify(cur)); } catch (e) {}
      try {
        // 首次接触归因保留 CONFIG.firstTouchDays 天（B2B 决策周期长，首次来源比末次更有价值）
        if (!readFirstTouch()) {
          cur.first_touch = true;
          localStorage.setItem(ATTR_KEY + '_first', JSON.stringify(cur));
        }
      } catch (e) {}
      return cur;
    }

    try {
      var s = sessionStorage.getItem(ATTR_KEY);
      if (s) return JSON.parse(s);
      var first = readFirstTouch();
      if (first) return first;
    } catch (e) {}
    return { landing_page: location.pathname, ref: document.referrer || '' };
  }

  // 读取首次接触归因，过期返回 null
  function readFirstTouch() {
    try {
      var raw = localStorage.getItem(ATTR_KEY + '_first');
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || !data.ts) return null;
      var age = Date.now() - new Date(data.ts).getTime();
      if (age > CONFIG.firstTouchDays * 864e5) {
        localStorage.removeItem(ATTR_KEY + '_first');
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  }

  /* ---------------- 把归因写入表单隐藏字段 ---------------- */
  function injectAttributionFields() {
    var attr = getAttribution();
    var containers = document.querySelectorAll('[data-utm-fields]');
    Array.prototype.forEach.call(containers, function (box) {
      if (box.dataset.filled === '1') return;
      Object.keys(attr).forEach(function (k) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'attr_' + k;
        input.value = String(attr[k]);
        box.appendChild(input);
      });
      var pageInput = document.createElement('input');
      pageInput.type = 'hidden';
      pageInput.name = 'page_url';
      pageInput.value = location.href;
      box.appendChild(pageInput);
      box.dataset.filled = '1';
    });
  }

  /* ---------------- 表单提交（AJAX，避免跳走丢失事件） ---------------- */
  function showSuccess(form) {
    var box = form.querySelector('[data-form-success]') || document.querySelector('[data-form-success]');
    if (box) {
      box.hidden = false;
      box.removeAttribute('hidden');
      try { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
    }
    form.reset();
    // 防止重复提交
    Array.prototype.forEach.call(form.querySelectorAll('input, textarea, select, button'), function (el) {
      el.disabled = true;
    });
  }

  function bindLeadForm(form) {
    var started = false;

    form.addEventListener(
      'focusin',
      function () {
        if (started) return;
        started = true;
        track('form_start', { form_type: form.getAttribute('name') || 'contact' });
      },
      { once: true }
    );

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.dataset.submitting === '1') return;
      form.dataset.submitting = '1';

      var btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;

      var fd = new FormData(form);
      // 把归因数据一起提交给 Netlify —— 销售收到的通知邮件里能直接看到来源
      var attr = getAttribution();
      Object.keys(attr).forEach(function (k) {
        fd.set('attr_' + k, String(attr[k]));
      });
      fd.set('page_url', location.href);
      fd.set('lang', LANG);

      var payload = new URLSearchParams();
      fd.forEach(function (v, k) { payload.append(k, v); });

      // POST 到当前路径：子域名经 netlify.toml 的 200 rewrite 转发到 /<lang>/contact，
      // method 与 body 保持不变，Netlify Forms 能正常接收
      fetch(CONFIG.submitEndpoint || location.pathname || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          track('generate_lead', {
            form_type: form.getAttribute('name') || 'contact',
            product_type: fd.get('product_type') || 'unknown',
            country: fd.get('country') || 'unknown',
            industry: fd.get('industry') || 'unknown',
            has_phone: fd.get('tel') ? 'yes' : 'no',
            utm_source: attr.utm_source || '(direct)',
            utm_medium: attr.utm_medium || '(none)',
            utm_campaign: attr.utm_campaign || '(not set)',
            value: 1,
            currency: 'USD'
          });
          showSuccess(form);
        })
        .catch(function (err) {
          if (DEBUG) console.warn('[chitek] AJAX submit failed, falling back to native submit', err);
          form.dataset.submitting = '0';
          if (btn) btn.disabled = false;
          track('generate_lead', { form_type: form.getAttribute('name') || 'contact', fallback: 'native' });
          form.submit(); // 降级：走 Netlify 原生提交
        });
    });
  }

  /* ---------------- 点击类事件（事件委托，全站生效） ---------------- */
  document.addEventListener(
    'click',
    function (e) {
      var el = e.target;
      if (!el || !el.closest) return;
      var a = el.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href') || '';

      // 电话 / 邮件 / WhatsApp
      if (/^tel:/i.test(href)) {
        track('contact_click', { contact_method: 'phone', link_url: href, page_path: location.pathname });
        return;
      }
      if (/^mailto:/i.test(href)) {
        track('contact_click', { contact_method: 'email', link_url: href, page_path: location.pathname });
        return;
      }
      if (CONFIG.whatsappRe.test(href)) {
        track('contact_click', { contact_method: 'whatsapp', link_url: href, page_path: location.pathname });
        return;
      }

      // 资料下载
      var isDownload = a.hasAttribute('download') || DOWNLOAD_RE.test(href);
      if (isDownload) {
        var file = href.split('/').pop().split('?')[0];
        track('download_resource', { file_name: file, link_url: href, page_path: location.pathname });
        return;
      }

      // 站外链接
      if (/^https?:\/\//i.test(href)) {
        try {
          var host = new URL(href).hostname;
          if (host && !isInternalHost(host)) {
            track('outbound_click', { link_url: href, link_domain: host, page_path: location.pathname });
          }
        } catch (err) {}
      }
    },
    true
  );

  /* ---------------- 滚动深度 ---------------- */
  var fired90 = false;
  window.addEventListener(
    'scroll',
    function () {
      if (fired90) return;
      var doc = document.documentElement;
      var total = doc.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      if (window.scrollY / total >= CONFIG.scrollDepth) {
        fired90 = true;
        track('scroll_90', { page_path: location.pathname });
      }
    },
    { passive: true }
  );

  /* ---------------- 页面级事件 ---------------- */
  function initPageEvents() {
    var path = location.pathname.replace(/\/+$/, '');

    // 产品详情页浏览（/products/<slug>，排除 /products 列表页）
    if (CONFIG.productPathRe.test(path)) {
      var h1 = document.querySelector('h1');
      var nameEl = document.querySelector('[data-product-name]');
      track('view_product', {
        product_name: (nameEl && nameEl.getAttribute('data-product-name')) || (h1 ? h1.textContent.trim().slice(0, 100) : path),
        page_path: path
      });
    }
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    injectAttributionFields();
    var forms = document.querySelectorAll('[data-lead-form]');
    Array.prototype.forEach.call(forms, bindLeadForm);
    initPageEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
