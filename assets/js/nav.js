/**
 * nav.js — 导航交互 (active 高亮、汉堡菜单、语言切换)
 */
(function () {
  'use strict';

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
