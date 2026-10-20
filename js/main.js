/* =========================================================
   RENATO GUERRA FOTOGRAFIA — main.js
   ---------------------------------------------------------
   CONFIGURAÇÃO DE CONTATO (única edição necessária):
   Preencha os campos abaixo com os dados oficiais.
   Enquanto estiverem vazios, os botões de WhatsApp ficam
   ocultos e os CTAs apontam para o formulário de contato.
   ========================================================= */
var RGF_CONFIG = {
  whatsapp: "5519998801410",        // ex.: "5511999999999" (código do país + DDD + número, só dígitos)
  instagram: "guerra.renatofotografia",       // ex.: "renatoguerrafoto" (sem @)
  email: ""            // ex.: "contato@renatoguerra.com.br"
};

(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Rede de segurança: garante conteúdo visível mesmo se o observador falhar */
  setTimeout(function () {
    $$(".reveal:not(.is-in)").forEach(function (el) { el.classList.add("is-in"); });
  }, 2500);

  /* ---------- Header ---------- */
  var header = $(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-solid", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = $(".nav-toggle");
  var nav = $(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        toggle.focus();
      }
    });
  }

  /* ---------- Reveal ---------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- WhatsApp / Instagram / E-mail ---------- */
  var waBase = "https://wa.me/";
  var waMsg = "Olá, Renato Guerra! Conheci seu trabalho pelo site e gostaria de saber mais sobre seu trabalho.";
  $$("[data-wa]").forEach(function (el) {
    if (RGF_CONFIG.whatsapp) {
      el.setAttribute("href", waBase + RGF_CONFIG.whatsapp +
        "?text=" + encodeURIComponent(el.getAttribute("data-wa-msg") || waMsg));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    } else {
      el.setAttribute("href", "#contato");
      if (el.textContent.trim() === "WhatsApp") { el.textContent = "Contato"; }
    }
  });
  var waFloat = $(".wa-float");
  if (waFloat && RGF_CONFIG.whatsapp) {
    waFloat.classList.add("is-visible");
    waFloat.setAttribute("href", waBase + RGF_CONFIG.whatsapp + "?text=" + encodeURIComponent(waMsg));
  }
  $$("[data-ig]").forEach(function (el) {
    if (RGF_CONFIG.instagram) {
      el.setAttribute("href", "https://instagram.com/" + RGF_CONFIG.instagram);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      el.style.display = "";
    } else { el.style.display = "none"; }
  });
  $$("[data-email]").forEach(function (el) {
    if (RGF_CONFIG.email) {
      el.setAttribute("href", "mailto:" + RGF_CONFIG.email);
    } else { el.style.display = "none"; }
  });

  /* ---------- Formulário de orçamento ---------- */
  var form = $("#form-orcamento");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = function (id) { var el = $("#" + id); return el ? el.value.trim() : ""; };
      var nome = d("f-nome");
      if (!nome) { $("#f-nome").focus(); return; }
      var tipo = d("f-tipo");
      var data = d("f-data");
      var cidade = d("f-cidade");
      var fone = d("f-whatsapp");
      var email = d("f-email");
      var msg = d("f-msg");
      var texto =
        "Olá, Renato! Vim pelo seu site.\n\n" +
        "Nome: " + nome + "\n" +
        (fone ? "WhatsApp: " + fone + "\n" : "") +
        (email ? "E-mail: " + email + "\n" : "") +
        (tipo ? "Serviço: " + tipo + "\n" : "") +
        (data ? "Data: " + data + "\n" : "") +
        (cidade ? "Cidade: " + cidade + "\n" : "") +
        (msg ? "\nMensagem: " + msg : "");

      var ok = $(".form-success");
      if (RGF_CONFIG.whatsapp) {
        window.open(waBase + RGF_CONFIG.whatsapp + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
        if (ok) ok.classList.add("is-visible");
        form.reset();
      } else {
        if (ok) {
          ok.classList.add("is-visible");
          $(".js-ok-title", ok).textContent = "Mensagem preparada, " + nome.split(" ")[0] + ".";
          $(".js-ok-text", ok).textContent = "O envio direto está sendo configurado. Sua mensagem foi gerada abaixo — copie e envie para o Renato:";
          var box = $(".js-ok-copy", ok);
          if (box) {
            box.style.display = "block";
            box.value = texto;
            box.focus();
            box.select();
          }
        }
      }
    });
  }

  /* ---------- Ano do rodapé ---------- */
  var yr = $("#ano");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Portfólio: filtros + galeria + lightbox ---------- */
  var gal = $("#galeria");
  if (gal && window.RGF_GALERIA) {
    var labels = {
      casamentos: "Casamentos", bodas: "Bodas", batizados: "Batizados",
      religiosas: "Cerimônias religiosas", comercial: "Comercial e produto"
    };
    var frag = document.createDocumentFragment();
    window.RGF_GALERIA.forEach(function (g, i) {
      var fig = document.createElement("figure");
      fig.className = "gal-item";
      fig.setAttribute("data-cat", g.c);
      fig.setAttribute("data-index", i);
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", "Abrir fotografia: " + g.a);
      var img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
      img.src = g.t;
      img.width = g.tw || 820;
      img.height = g.th || Math.round(820 * g.h / g.w);
      img.alt = g.a;
      img.style.aspectRatio = g.w + "/" + g.h;
      img.style.objectFit = "cover";
      var cap = document.createElement("figcaption");
      cap.textContent = labels[g.c] || "";
      fig.appendChild(img); fig.appendChild(cap);
      frag.appendChild(fig);
    });
    gal.appendChild(frag);

    /* filtros */
    $$(".filter").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$(".filter").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var cat = btn.getAttribute("data-filter");
        $$(".gal-item", gal).forEach(function (it) {
          var show = cat === "todos" || it.getAttribute("data-cat") === cat;
          it.classList.toggle("is-hidden", !show);
        });
      });
    });

    /* lightbox */
    var lb = $("#lightbox");
    var lbImg = $(".lightbox img", lb);
    var lbCount = $(".lb-count", lb);
    var lbCap = $(".lb-caption", lb);
    var current = 0;
    var visible = function () {
      return $$(".gal-item", gal).filter(function (it) { return !it.classList.contains("is-hidden"); });
    };
    function openLB(idx) {
      var list = visible();
      current = list.indexOf(idx);
      if (current < 0) current = 0;
      showLB(list);
      lb.classList.add("is-open");
      document.body.style.overflow = "hidden";
      $(".lb-close", lb).focus();
    }
    function showLB(list) {
      var g = window.RGF_GALERIA[parseInt(list[current].getAttribute("data-index"), 10)];
      lbImg.src = g.f;
      lbImg.alt = g.a;
      lbCount.textContent = (current + 1) + " / " + list.length;
      lbCap.textContent = labels[g.c] || "";
      list[current].scrollIntoView({ block: "nearest" });
    }
    function stepLB(dir) {
      var list = visible();
      current = (current + dir + list.length) % list.length;
      showLB(list);
    }
    function closeLB() {
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    gal.addEventListener("click", function (e) {
      var it = e.target.closest(".gal-item");
      if (it) openLB(it);
    });
    gal.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        var it = e.target.closest(".gal-item");
        if (it) { e.preventDefault(); openLB(it); }
      }
    });
    $(".lb-close", lb).addEventListener("click", closeLB);
    $(".lb-prev", lb).addEventListener("click", function () { stepLB(-1); });
    $(".lb-next", lb).addEventListener("click", function () { stepLB(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLB(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowLeft") stepLB(-1);
      if (e.key === "ArrowRight") stepLB(1);
    });
    /* swipe */
    var sx = 0, sy = 0;
    lb.addEventListener("touchstart", function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      var dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) stepLB(dx > 0 ? -1 : 1);
      else if (e.target === lb && Math.abs(dy) > 80 && Math.abs(dy) > Math.abs(dx)) closeLB();
    }, { passive: true });
  }
})();
