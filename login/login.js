// AsisteQR — Módulo de Login

(function () {

  function init() {
    // Limpiar sesión anterior y cargar datos demo si no existen
    sessionStorage.removeItem(Store.KEYS.session);
    Store.ensureDemoData();

    const form      = document.getElementById('login-form');
    const submitBtn = form.querySelector('.btn-submit');
    const errorMsg  = document.getElementById('login-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const usuario   = document.getElementById('usuario').value.trim();
      const password  = document.getElementById('contrasena').value.trim();

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      await new Promise(r => setTimeout(r, 800));

      if (usuario === 'admin' && password === 'admin123') {
        sessionStorage.setItem(Store.KEYS.session, 'active');
        sessionStorage.setItem(Store.KEYS.user, JSON.stringify({
          username: usuario,
          role: 'admin',
          loginTime: new Date().toISOString()
        }));
        window.location.href = 'qr/escaner.html';
      } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        errorMsg.classList.add('show');
        setTimeout(() => errorMsg.classList.remove('show'), 4000);
        document.getElementById('contrasena').value = '';
        document.getElementById('contrasena').focus();
      }
    });

    // Micro-animación en focus de inputs
    form.querySelectorAll('input').forEach(input => {
      input.addEventListener('focus', () => { input.parentElement.style.transform = 'scale(1.02)'; });
      input.addEventListener('blur',  () => { input.parentElement.style.transform = 'scale(1)'; });
    });
  }

  document.addEventListener('DOMContentLoaded', init);

})();
