/* Mukesh Kumar — site behaviour. No dependencies. */
(function () {
  'use strict';

  /* Mobile navigation */
  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('nav-list');
  if (toggle && list) {
    toggle.addEventListener('click', function () {
      var open = list.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Close' : 'Menu';
    });
    list.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && list.classList.contains('open')) {
        list.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menu';
      }
    });
  }

  /* Highlight the section in view (home page only) */
  var links = document.querySelectorAll('.nav-list a[href^="#"]');
  if ('IntersectionObserver' in window && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          map[en.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* CV download tracking — keeps the existing GA4 event name used on the live site */
  document.querySelectorAll('[data-cv-download]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'resume_download', { event_category: 'engagement', event_label: 'Executive CV PDF Download' });
      }
    });
  });

  /* Confidential enquiry: composes an email in the visitor's own mail client.
     Nothing is stored or sent by this website. */
  var form = document.getElementById('enquiry-form');
  if (form) {
    var status = document.getElementById('form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements['name'].value.trim();
      var email = form.elements['email'].value.trim();
      var message = form.elements['message'].value.trim();
      var missing = [];
      if (!name) missing.push('your name');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) missing.push('a valid email address');
      if (!message) missing.push('a short message');
      if (missing.length) {
        status.className = 'form-status error';
        status.textContent = 'Add ' + missing.join(', ') + ' to continue.';
        return;
      }
      var org = form.elements['organisation'].value.trim();
      var topic = form.elements['topic'].value;
      var subject = 'Confidential enquiry: ' + topic + (org ? ' (' + org + ')' : '');
      var body = [
        'Name: ' + name,
        'Organisation: ' + (org || '-'),
        'Email: ' + email,
        'Topic: ' + topic,
        '',
        message
      ].join('\n');
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'confidential_enquiry', { event_category: 'engagement', event_label: topic });
      }
      window.location.href = 'mailto:mukeshabh01@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      status.className = 'form-status';
      status.textContent = 'Your email app should now open with the message ready to send. If it does not, write to mukeshabh01@gmail.com.';
    });
  }
})();
