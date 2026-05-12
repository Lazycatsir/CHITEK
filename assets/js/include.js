/**
 * include.js — HTML 公共组件加载器
 *
 * 用法: 在页面中放置 <div data-include="path/to/file.html"></div>
 * 脚本自动:
 *   1. 检测当前页面在根目录还是 pages/ 子目录
 *   2. 替换 %ASSETS% → "" 或 "../"
 *   3. 替换 %PAGES% → "pages/" 或 ""
 *   4. 初始化导航交互 (active 高亮、汉堡菜单、语言切换)
 *
 * 注意: 请通过 HTTP 服务器预览 (如 npx serve .)，file:// 会被浏览器拦截。
 */
(function () {
  'use strict';

  // ─── 路径检测 ───
  var inPages = window.location.pathname.indexOf('/pages/') !== -1;
  var ASSETS = inPages ? '../' : '';
  var PAGES  = inPages ? '' : 'pages/';

  // ─── file:// 协议检测 ───
  var isFileProtocol = window.location.protocol === 'file:';

  // ─── 替换令牌 ───
  function resolveTokens(html) {
    return html
      .replace(/%ASSETS%/g, ASSETS)
      .replace(/%PAGES%/g, PAGES);
  }

  // ─── 显示 file:// 提示条 ───
  function showFileProtocolNotice() {
    var notice = document.createElement('div');
    notice.id = 'file-protocol-notice';
    notice.style.cssText =
      'position:fixed;top:0;left:0;right:0;z-index:99999;' +
      'background:#fff3cd;border-bottom:2px solid #ffc107;' +
      'color:#856404;padding:14px 20px;font-size:14px;' +
      'font-family:sans-serif;text-align:center;' +
      'box-shadow:0 2px 8px rgba(0,0,0,0.1);';
    notice.innerHTML =
      '⚠️ ' +
      '<b style="color:#533f03">Components not loaded</b> — ' +
      'file:// protocol blocks local file loading. ' +
      '<span style="display:inline-block;margin:0 6px">|</span> ' +
      '<b>Use a local server:</b> ' +
      'run <code style="background:#ffeaa7;padding:2px 6px;border-radius:3px;font-size:13px">npx serve .</code> ' +
      'in the project directory, then open the displayed URL. ' +
      '<button id="dismiss-file-notice" style="' +
      'margin-left:10px;background:#856404;color:#fff;border:none;' +
      'border-radius:3px;padding:4px 12px;cursor:pointer;font-size:13px' +
      '">OK</button>';
    document.body.prepend(notice);
    document.getElementById('dismiss-file-notice').onclick = function () {
      notice.style.display = 'none';
    };
  }

  // ─── 加载所有 includes ───
  function loadAll(callback) {
    var els = document.querySelectorAll('[data-include]');
    var total = els.length;
    if (total === 0) { if (callback) callback(); return; }

    // file:// 下先显示提示，同时尝试 fetch（Firefox/Safari 可能支持）
    if (isFileProtocol) {
      console.warn(
        '[include.js] ⚠️ 当前通过 file:// 协议打开，浏览器会拦截 fetch() 请求。\n' +
        '建议使用本地 HTTP 服务器预览:\n' +
        '  npx serve .      (Node.js)\n' +
        '  python -m http.server  (Python 3)\n' +
        '  VS Code Live Server 插件 (推荐)'
      );
      if (document.readyState === 'loading' || document.readyState === 'interactive') {
        showFileProtocolNotice();
      } else {
        // If DOM is already ready, schedule notice for next frames
        setTimeout(showFileProtocolNotice, 0);
      }
    }

    var loaded = 0;
    els.forEach(function (el) {
      var url = el.getAttribute('data-include');
      fetch(url)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.text();
        })
        .then(function (html) {
          html = resolveTokens(html);
          el.outerHTML = html;
          loaded++;
          if (loaded >= total && callback) callback();
        })
        .catch(function (err) {
          console.error('[include.js] Failed to load:', url, err);
          loaded++;
          if (loaded >= total && callback) callback();
        });
    });
  }

  // ─── 导航初始化 ───
  function initNav() {
    // 1. Active link 高亮
    var current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link-base').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var file = href.split('/').pop();
      if (file === current) {
        link.classList.add('text-brand-orange');
        var underline = link.querySelector('span');
        if (underline) {
          underline.classList.remove('scale-x-0');
          underline.classList.add('scale-x-100');
        }
      }
    });

    // 2. 汉堡菜单
    var btn = document.getElementById('hamburgerBtn');
    var menu = document.getElementById('mobileMenu');
    if (btn && menu) {
      btn.addEventListener('click', function () {
        var open = btn.classList.toggle('open');
        menu.classList.toggle('open', open);
        menu.style.display = open ? 'flex' : '';
        document.body.style.overflow = open ? 'hidden' : '';
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 1024) {
          btn.classList.remove('open');
          menu.classList.remove('open');
          menu.style.display = '';
          document.body.style.overflow = '';
        }
      });
    }

    // 3. 移动端子菜单展开
    document.querySelectorAll('.mobile-menu-parent[data-submenu]').forEach(function (parent) {
      parent.addEventListener('click', function () {
        var id = parent.getAttribute('data-submenu');
        var sub = document.getElementById(id);
        parent.classList.toggle('expanded');
        if (sub) sub.classList.toggle('open');
      });
    });

    // 4. 语言下拉
    var wrapper = document.querySelector('.lang-group');
    if (wrapper) {
      var dd = wrapper.querySelector('.lang-dropdown');
      var arrow = wrapper.querySelector('.lang-arrow');
      if (dd) {
        wrapper.addEventListener('mouseenter', function () {
          dd.classList.add('opacity-100', 'visible');
          dd.classList.remove('opacity-0', 'invisible');
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        });
        wrapper.addEventListener('mouseleave', function () {
          dd.classList.remove('opacity-100', 'visible');
          dd.classList.add('opacity-0', 'invisible');
          if (arrow) arrow.style.transform = '';
        });
      }
    }
  }

  // ─── 启动 ───
  function boot() {
    loadAll(initNav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
