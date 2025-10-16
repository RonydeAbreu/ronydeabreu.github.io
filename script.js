// ===== CONFIGURAÇÃO INICIAL =====
// Pego os elementos que vou usar no código
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const themeToggle = document.getElementById('theme-toggle');
const form = document.getElementById('contact-form');
const modal = document.getElementById('modal');
const modalMsg = document.getElementById('modal-msg');
const modalClose = document.getElementById('modal-close');
const yearSpan = document.getElementById('year');

// Coloca o ano atual no rodapé automaticamente
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// ===== MENU MOBILE =====
// Controla o menu que aparece em telas pequenas
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Fecha o menu quando clica em um link (útil no mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== TEMA CLARO/ESCURO =====
// Verifica se o usuário já escolheu um tema antes
const savedTheme = localStorage.getItem('site-theme');
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeToggle.setAttribute('aria-pressed', 'true');
  themeToggle.textContent = '☀️';
} else {
  // Tema claro como padrão
  document.documentElement.setAttribute('data-theme', 'light');
  themeToggle.setAttribute('aria-pressed', 'false');
  themeToggle.textContent = '🌙';
}

// Alterna entre tema claro e escuro
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  
  if (current === 'light') {
    // Muda para escuro
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('site-theme', 'dark');
    themeToggle.textContent = '☀️';
    themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    // Muda para claro
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('site-theme', 'light');
    themeToggle.textContent = '🌙';
    themeToggle.setAttribute('aria-pressed', 'false');
  }
});

// ===== MODAL =====
// Função pra mostrar mensagens pro usuário
function showModal(message, autoClose = true) {
  modalMsg.textContent = message;
  modal.classList.remove('hidden');
  if (autoClose) {
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 3000);
  }
}

// Fecha o modal quando clica no botão
modalClose.addEventListener('click', () => { 
  modal.classList.add('hidden'); 
});

// ===== FORMULÁRIO DE CONTATO =====
// Valida e processa o formulário
form.addEventListener('submit', function(event) {
  event.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  // Verifica se o email tem formato válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors = [];

  // Checa cada campo
  if (!name) errors.push('Nome');
  if (!email || !emailRegex.test(email)) errors.push('E-mail (formato inválido)');
  if (!message) errors.push('Mensagem');

  // Se tem erro, mostra pro usuário
  if (errors.length) {
    showModal('Por favor, corrija: ' + errors.join(', '));
    return;
  }

  // Prepara mensagem pro WhatsApp
  const phoneNumber = "5521980248732";
  const text = `Olá Rony! 👋%0AMeu nome é ${encodeURIComponent(name)}.%0AE-mail: ${encodeURIComponent(email)}%0AMensagem: ${encodeURIComponent(message)}`;

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${text}`;
  
  // Abre o WhatsApp
  window.open(whatsappURL, "_blank");

  // Mostra confirmação e limpa o formulário
  showModal('Abrindo o WhatsApp...');
  form.reset();
});

// ===== SCROLL SPY =====
// Marca no menu qual seção está visível
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const observerOptions = { 
  root: null, 
  rootMargin: '-100px 0px -70% 0px',
  threshold: 0.1
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const navLink = document.querySelector('.nav-links a[href="#' + id + '"]');
    
    // Marca como ativo só se a seção estiver visível
    if (entry.isIntersecting && entry.boundingClientRect.top > 50) {
      navItems.forEach(i => i.classList.remove('active'));
      if (navLink) navLink.classList.add('active');
    }
  });
}, observerOptions);

// Observa todas as seções
sections.forEach(section => observer.observe(section));

// Remove a marcação quando está no topo da página
window.addEventListener('scroll', () => {
  if (window.pageYOffset < 100) {
    navItems.forEach(i => i.classList.remove('active'));
  }
});

// Garante que não tem nada marcado quando carrega a página
document.addEventListener('DOMContentLoaded', () => {
  navItems.forEach(i => i.classList.remove('active'));
});

// ===== EXTRAS DO MODAL =====
// Fecha o modal clicando fora dele
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

// Fecha o modal com a tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    modal.classList.add('hidden');
  }
});