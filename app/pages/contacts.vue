<template>
  <div class="page" @mousemove="onMouseMove">
    <!-- фон -->
    <div class="bg" aria-hidden="true">
      <div class="bg__warm" />
      <div class="bg__grain" />
      <div class="bg__blob bg__blob--1" />
      <div class="bg__blob bg__blob--2" />
    </div>

    <main class="wrap">
      <!-- INTRO -->
      <section class="intro" :style="tiltStyle">
        <div class="intro__badge">☕ Контакты & Тёплые встречи</div>

        <h1 class="intro__title">
          На связи с <span class="dot">любовью.</span>
        </h1>

        <p class="intro__text">Чтобы каждая встреча начиналась c кофе.</p>

        <div class="intro__actions">
          <a class="btn btn--primary" :href="telHref">
            <span class="btn__icon" aria-hidden="true">
              <!-- phone -->
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M6.8 2.9c.5-.4 1.2-.4 1.7.1l2.1 2.3c.4.5.5 1.1.2 1.6l-1.1 2c-.2.4-.2.9 0 1.3a15.4 15.4 0 0 0 4.1 4.1c.4.2.9.2 1.3 0l2-1.1c.5-.3 1.2-.2 1.6.2l2.3 2.1c.5.5.5 1.2.1 1.7l-1.2 1.5c-.6.8-1.6 1.1-2.6.9-3.8-.7-7.3-2.9-10.3-5.9S4 9.2 3.3 5.4c-.2-1 .1-2 .9-2.6l1.6-1.3Z"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            Позвонить
          </a>

          <button class="btn btn--ghost" type="button" @click="copy(phone)">
            <span class="btn__icon" aria-hidden="true">
              <!-- copy -->
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 9h10v12H9V9Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor"
                  stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </span>
            Скопировать номер
          </button>

          <NuxtLink class="btn btn--soft" to="/menu">
            <span class="btn__icon" aria-hidden="true">
              <!-- cup -->
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" stroke="currentColor" stroke-width="1.8"
                  stroke-linejoin="round" />
                <path d="M16 10h2a3 3 0 0 1 0 6h-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M7 3c0 2 2 2 2 4M11 3c0 2 2 2 2 4" stroke="currentColor" stroke-width="1.8"
                  stroke-linecap="round" />
              </svg>
            </span>
            Посмотреть меню
          </NuxtLink>
        </div>

        <div class="toast" :data-show="toast.show" role="status" aria-live="polite">
          <span class="toast__dot" aria-hidden="true" />
          {{ toast.text }}
        </div>
      </section>

      <!-- GRID -->
      <section class="grid">
        <!-- CONTACTS -->
        <article class="card c-reveal">
          <div class="card__head">
            <h2 class="card__title">Наши контакты</h2>
            <p class="card__subtitle">Быстро, просто, уютно.</p>
          </div>

          <div class="list">
            <div class="item">
              <div class="item__icon" aria-hidden="true">
                <!-- phone -->
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6.8 2.9c.5-.4 1.2-.4 1.7.1l2.1 2.3c.4.5.5 1.1.2 1.6l-1.1 2c-.2.4-.2.9 0 1.3a15.4 15.4 0 0 0 4.1 4.1c.4.2.9.2 1.3 0l2-1.1c.5-.3 1.2-.2 1.6.2l2.3 2.1c.5.5.5 1.2.1 1.7l-1.2 1.5c-.6.8-1.6 1.1-2.6.9-3.8-.7-7.3-2.9-10.3-5.9S4 9.2 3.3 5.4c-.2-1 .1-2 .9-2.6l1.6-1.3Z"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <div class="item__body">
                <div class="item__label">Телефон</div>
                <div class="item__value">
                  <a class="link" :href="telHref">{{ phone }}</a>
                  <button class="mini" type="button" @click="copy(phone)">Скопировать</button>
                </div>
              </div>
            </div>

            <div class="item">
              <div class="item__icon" aria-hidden="true">
                <!-- pin -->
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z" stroke="currentColor" stroke-width="1.8"
                    stroke-linejoin="round" />
                  <path d="M12 12.1a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" stroke="currentColor"
                    stroke-width="1.8" />
                </svg>
              </div>
              <div class="item__body">
                <div class="item__label">Где мы?</div>
                <div class="item__value">
                  <span>{{ address }}</span>
                  <a class="mini link" :href="mapsHref" target="_blank" rel="noopener">Открыть в картах</a>
                </div>
              </div>
            </div>

            <div class="item">
              <div class="item__icon" aria-hidden="true">
                <!-- clock -->
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" stroke-width="1.8" />
                  <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </div>
              <div class="item__body">
                <div class="item__label">Часы</div>
                <div class="item__value">
                  <span>{{ hours }}</span>
                  <span class="pill" :data-open="isOpenNow">
                    {{ isOpenNow ? "Сейчас открыто" : "Сейчас закрыто" }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="divider" />

          <div class="callout">
            <div class="callout__title">Почему наш кофе — это про людей?</div>
            <p class="callout__text">
              В
              <span class="brand">
                For-L
                <img class="brand__inf" :src="infLogo" alt="∞" />
                ve Coffee
              </span>
              мы верим, что кофе — это не спешка, а момент. Момент первой встречи, тихой паузы наедине с собой или
              тёплого разговора с теми, кто рядом.
            </p>
          </div>
        </article>

        <!-- SOCIAL + FEATURES -->
        <article class="card card--accent c-reveal">
          <div class="card__head">
            <h2 class="card__title">Мы в соцсетях</h2>
            <p class="card__subtitle">Там — новости, эстетика и живые моменты.</p>
          </div>

          <div class="social">
            <a v-for="s in socials" :key="s.title" class="social__btn" :href="s.href" target="_blank" rel="noopener"
              @click="track(s.title)">
              <span class="social__icon" aria-hidden="true">
                <!-- telegram -->
                <svg v-if="s.kind === 'telegram'" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21.5 4.8 3.2 12.2c-1.1.4-1.1 1.9.1 2.3l4.7 1.6 1.8 5.6c.4 1.1 1.9 1.2 2.4.2l2.6-4.7 4.7 3.4c.8.6 2 .1 2.2-.9l2.7-14.1c.2-1.1-.9-2.1-2-1.8Z"
                    stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  <path d="M8.1 16.1 20.6 6.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>

                <!-- instagram -->
                <svg v-else-if="s.kind === 'instagram'" viewBox="0 0 24 24" fill="none">
                  <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z"
                    stroke="currentColor" stroke-width="1.8" />
                  <path d="M12 16.2A4.2 4.2 0 1 0 12 7.8a4.2 4.2 0 0 0 0 8.4Z" stroke="currentColor"
                    stroke-width="1.8" />
                  <path d="M17.5 6.5h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                </svg>

                <!-- map -->
                <svg v-else viewBox="0 0 24 24" fill="none">
                  <path d="M9 18 3.5 20V6l5.5-2 6 2 5.5-2v14L15 20l-6-2Z" stroke="currentColor" stroke-width="1.8"
                    stroke-linejoin="round" />
                  <path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </span>

              <span class="social__text">
                <span class="social__title">{{ s.title }}</span>
                <span class="social__desc">{{ s.desc }}</span>
              </span>

              <span class="social__arrow" aria-hidden="true">→</span>
            </a>
          </div>

          <div class="divider" />

          <div class="features">
            <div class="feature">
              <div class="feature__icon" aria-hidden="true">
                <!-- heart -->
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21s-7-4.4-9.2-8.7C1 8.7 3.2 5.8 6.4 5.5c1.8-.2 3.4.7 4.3 2 1-1.3 2.6-2.2 4.3-2 3.2.3 5.4 3.2 3.6 6.8C19 16.6 12 21 12 21Z"
                    stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                </svg>
              </div>
              <div class="feature__text">
                <div class="feature__title">For People</div>
                <div class="feature__desc">Запоминаем вкусы постоянных гостей.</div>
              </div>
            </div>

            <div class="feature">
              <div class="feature__icon" aria-hidden="true">
                <!-- star -->
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.9 6.1 20l1.2-6.5L2.5 8.9 9.1 8 12 2Z"
                    stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                </svg>
              </div>
              <div class="feature__text">
                <div class="feature__title">Качество</div>
                <div class="feature__desc">Работаем с проверенным зерном.</div>
              </div>
            </div>

            <div class="feature">
              <div class="feature__icon" aria-hidden="true">
                <!-- spark -->
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l1.2 4.2L17.5 7.5l-4.3 1.3L12 13l-1.2-4.2L6.5 7.5l4.3-1.3L12 2Z" stroke="currentColor"
                    stroke-width="1.8" stroke-linejoin="round" />
                  <path d="M19 12l.8 2.6L22 15l-2.2.4L19 18l-.8-2.6L16 15l2.2-.4L19 12Z" stroke="currentColor"
                    stroke-width="1.8" stroke-linejoin="round" />
                </svg>
              </div>
              <div class="feature__text">
                <div class="feature__title">Атмосфера</div>
                <div class="feature__desc">Можно поработать или помолчать — уютно.</div>
              </div>
            </div>
          </div>
        </article>

        <!-- MAP -->
        <article class="card map c-reveal">
          <div class="card__head">
            <h2 class="card__title">Загляни к нам</h2>
            <p class="card__subtitle">Один шаг до тёплой чашки и хорошего дня.</p>
          </div>

          <div class="map__frame">
            <iframe :src="mapEmbedSrc" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Карта" />
          </div>

          <div class="map__footer">
            <button class="btn btn--primary" type="button" @click="copy(address)">
              <span class="btn__icon" aria-hidden="true">
                <!-- copy -->
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 9h10v12H9V9Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor"
                    stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </span>
              Скопировать адрес
            </button>

            <a class="btn btn--ghost" :href="mapsHref" target="_blank" rel="noopener">
              <span class="btn__icon" aria-hidden="true">
                <!-- pin -->
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z" stroke="currentColor" stroke-width="1.8"
                    stroke-linejoin="round" />
                  <path d="M12 12.1a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" stroke="currentColor"
                    stroke-width="1.8" />
                </svg>
              </span>
              Открыть в картах
            </a>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import infLogo from "@/assets/logo.svg";

useHead({
  title: "Контакты — For Love Coffee",
  meta: [
    {
      name: "description",
      content:
        "Контакты For Love Coffee: телефон, адрес, часы работы и соцсети. Заходи за вкусом, который согреет и подарит любовь.",
    },
  ],
});

// ====== ДАННЫЕ (можешь менять под себя)
const phone = "+373 68 514 544";
const address = "Chișinău, ул. Кофейная, 15";
const hours = "09:00 – 22:00";

// tel / maps
const telHref = computed(() => `tel:${phone.replace(/[^\d+]/g, "")}`);
const mapsHref = computed(() => {
  const q = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
});

// Open/Close
const isOpenNow = computed(() => {
  const m = hours.match(/(\d{2}):(\d{2}).*?(\d{2}):(\d{2})/);
  if (!m) return false;
  const start = Number(m[1]) * 60 + Number(m[2]);
  const end = Number(m[3]) * 60 + Number(m[4]);
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutes >= start && minutes <= end;
});

// Карта (OSM embed без ключей)
const mapEmbedSrc = computed(() => {
  return "https://www.openstreetmap.org/export/embed.html?bbox=28.78%2C46.98%2C28.93%2C47.08&layer=mapnik&marker=47.01%2C28.86";
});

// ✅ ТВОИ СОЦСЕТИ (уже поставил)
const socials = computed(() => [
  {
    title: "Telegram",
    desc: "Написать в Telegram",
    href: "https://t.me/iaroslav_manoilov",
    kind: "telegram" as const,
  },
  {
    title: "Instagram",
    desc: "Смотреть в Instagram",
    href: "https://www.instagram.com/iaroslav_manoilov_?igsh=MXM1cGJxcW51dDNvbg==",
    kind: "instagram" as const,
  },
  { title: "Google Maps", desc: "Маршрут в 1 клик", href: mapsHref.value, kind: "map" as const },
]);

// Toast
const toast = reactive({ show: false, text: "" });
let toastT: ReturnType<typeof setTimeout> | null = null;

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Скопировано ✨");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("Скопировано ✨");
  }
}

function showToast(text: string) {
  toast.text = text;
  toast.show = true;
  if (toastT) clearTimeout(toastT);
  toastT = setTimeout(() => (toast.show = false), 1800);
}

function track(label: string) {
  showToast(`Открываю: ${label}`);
}

// Parallax
const mx = ref(0);
const my = ref(0);
function onMouseMove(e: MouseEvent) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  mx.value = (e.clientX - cx) / cx;
  my.value = (e.clientY - cy) / cy;
}
const tiltStyle = computed(() => {
  const rx = (my.value * -2.2).toFixed(2);
  const ry = (mx.value * 2.2).toFixed(2);
  return { transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)` };
});

// Reveal on scroll (без конфликта с глобальным .reveal)
let io: IntersectionObserver | null = null;
onMounted(() => {
  const els = Array.from(document.querySelectorAll<HTMLElement>(".c-reveal"));
  io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          (en.target as HTMLElement).classList.add("c-reveal--in");
          io?.unobserve(en.target);
        }
      }
    },
    { threshold: 0.15 }
  );
  els.forEach((el) => io?.observe(el));
});

onBeforeUnmount(() => {
  io?.disconnect();
  if (toastT) clearTimeout(toastT);
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 120px 18px 64px;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: #241b18;
  position: relative;
  overflow: hidden;
}

/* BACKGROUND */
.bg {
  position: fixed;
  inset: 0;
  z-index: -1;
}

.bg__warm {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(1100px 700px at 20% 10%, rgba(255, 228, 214, 0.9), transparent 60%),
    radial-gradient(900px 600px at 85% 30%, rgba(255, 214, 196, 0.65), transparent 60%),
    radial-gradient(900px 900px at 45% 100%, rgba(214, 170, 150, 0.35), transparent 60%),
    linear-gradient(180deg, #fff 0%, #fbf5f1 45%, #f5ede8 100%);
}

.bg__grain {
  position: absolute;
  inset: 0;
  opacity: 0.22;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}

.bg__blob {
  position: absolute;
  width: 560px;
  height: 560px;
  filter: blur(40px);
  opacity: 0.35;
  border-radius: 999px;
  transform: translate3d(0, 0, 0);
}

.bg__blob--1 {
  left: -140px;
  top: 120px;
  background: radial-gradient(circle at 30% 30%, rgba(196, 88, 52, 0.55), transparent 60%);
  animation: floaty 12s ease-in-out infinite;
}

.bg__blob--2 {
  right: -180px;
  bottom: -140px;
  background: radial-gradient(circle at 30% 30%, rgba(130, 70, 55, 0.55), transparent 60%);
  animation: floaty 14s ease-in-out infinite reverse;
}

@keyframes floaty {
  0% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(22px, -18px) scale(1.03);
  }

  100% {
    transform: translate(0, 0) scale(1);
  }
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
  font-weight: 800;
}

.brand__inf {
  display: inline-block;
  vertical-align: middle;
  margin: 0;
  width: 18px;
  height: 28px;
  transform: translateY(2px);
}

.wrap {
  max-width: 1100px;
  margin: 0 auto;
}

.intro {
  border-radius: 26px;
  padding: 26px 22px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(80, 55, 48, 0.12);
  box-shadow:
    0 18px 50px rgba(32, 18, 14, 0.10),
    0 2px 0 rgba(255, 255, 255, 0.6) inset;
  backdrop-filter: blur(10px);
  transform-style: preserve-3d;
  transition: transform 160ms ease;
}

.intro__badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(196, 88, 52, 0.12);
  border: 1px solid rgba(196, 88, 52, 0.18);
  font-weight: 700;
  letter-spacing: 0.2px;
  color: #7a3b2b;
  font-size: 13px;
}

.intro__title {
  margin: 14px 0 6px;
  font-size: clamp(34px, 4vw, 56px);
  line-height: 1.02;
  letter-spacing: -0.02em;
}

.dot {
  color: rgba(233, 68, 68, 0.952);
  text-shadow: 0 10px 25px rgba(196, 88, 52, 0.25);
}

.intro__text {
  margin: 0;
  max-width: 72ch;
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.88;
}

.intro__actions {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* BUTTONS */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 14px 22px;

  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.2px;

  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
  background: rgba(0, 0, 0, 0.08);
  color: #111;

  text-decoration: none;
  user-select: none;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0px) scale(0.99);
}

.btn__icon {
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
}

.btn__icon svg {
  width: 18px;
  height: 18px;
}

.btn--primary {
  background: #b24a4a;
  color: #fff;
  box-shadow: 0 10px 24px rgba(178, 74, 74, 0.26);
}

.btn--primary:hover {
  background: #933737;
}

.btn--ghost,
.btn--soft {
  background: rgba(163, 147, 147, 0.08);
  color: #111;
  box-shadow: none;
}

.btn--ghost:hover,
.btn--soft:hover {
  background: rgba(232, 13, 13, 0.12);
}

/* TOAST */
.toast {
  margin-top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.66);
  border: 1px solid rgba(80, 55, 48, 0.14);
  box-shadow: 0 14px 26px rgba(32, 18, 14, 0.10);
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  transition: opacity 160ms ease, transform 160ms ease;
}

.toast[data-show="true"] {
  opacity: 1;
  transform: translateY(0);
}

.toast__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #b24a4a;
  box-shadow: 0 10px 20px rgba(178, 74, 74, 0.24);
}

/* GRID */
.grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 14px;
}

@media (max-width: 980px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  border-radius: 26px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(80, 55, 48, 0.12);
  box-shadow: 0 18px 50px rgba(32, 18, 14, 0.10);
  backdrop-filter: blur(10px);
}

.card--accent {
  background:
    radial-gradient(900px 500px at 30% 10%, rgba(196, 88, 52, 0.16), transparent 55%),
    rgba(255, 255, 255, 0.62);
}

.card__head {
  margin-bottom: 14px;
}

.card__title {
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.01em;
}

.card__subtitle {
  margin: 6px 0 0;
  opacity: 0.78;
  line-height: 1.5;
}

/* LIST */
.list {
  display: grid;
  gap: 12px;
}

.item {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 12px;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.50);
  border: 1px solid rgba(80, 55, 48, 0.10);
}

.item__icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(196, 88, 52, 0.10);
  color: #7a3b2b;
}

.item__icon svg {
  width: 20px;
  height: 20px;
}

.item__label {
  font-size: 13px;
  opacity: 0.70;
  font-weight: 700;
}

.item__value {
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  font-weight: 800;
}

.link {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px dashed rgba(196, 88, 52, 0.45);
}

.link:hover {
  border-bottom-style: solid;
}

.mini {
  font-size: 12px;
  font-weight: 900;
  border-radius: 999px;
  padding: 6px 10px;
  border: 1px solid rgba(80, 55, 48, 0.14);
  background: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease, transform 120ms ease;
}

.mini:hover {
  background: rgba(255, 255, 255, 0.72);
}

.mini:active {
  transform: translateY(1px);
}

.pill {
  font-size: 12px;
  font-weight: 900;
  border-radius: 999px;
  padding: 6px 10px;
  border: 1px solid rgba(80, 55, 48, 0.14);
  background: rgba(255, 255, 255, 0.55);
}

.pill[data-open="true"] {
  border-color: rgba(212, 31, 40, 0.28);
  background: rgba(218, 71, 71, 0.338);
}

/* CALLOUT */
.divider {
  height: 1px;
  margin: 16px 0;
  background: linear-gradient(90deg, transparent, rgba(80, 55, 48, 0.16), transparent);
}

.callout {
  padding: 14px 14px;
  border-radius: 18px;
  background: rgba(196, 88, 52, 0.08);
  border: 1px solid rgba(196, 88, 52, 0.18);
}

.callout__title {
  font-weight: 900;
  letter-spacing: -0.01em;
}

.callout__text {
  margin: 8px 0 0;
  opacity: 0.88;
  line-height: 1.6;
}

/* SOCIAL */
.social {
  display: grid;
  gap: 10px;
}

.social__btn {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 18px;
  text-decoration: none;
  color: inherit;
  background: rgba(255, 255, 255, 0.52);
  border: 1px solid rgba(80, 55, 48, 0.12);
  transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
}

.social__btn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.72);
  border-color: rgba(196, 88, 52, 0.24);
}

.social__icon {
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(196, 88, 52, 0.10);
  color: #7a3b2b;
}

.social__icon svg {
  width: 22px;
  height: 22px;
}

.social__title {
  font-weight: 1000;
}

.social__desc {
  display: block;
  opacity: 0.76;
  font-size: 13px;
  margin-top: 2px;
}

.social__arrow {
  font-weight: 1000;
  opacity: 0.65;
}

/* FEATURES */
.features {
  display: grid;
  gap: 10px;
}

.feature {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.50);
  border: 1px solid rgba(80, 55, 48, 0.10);
}

.feature__icon {
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(196, 88, 52, 0.10);
  color: #7a3b2b;
}

.feature__icon svg {
  width: 22px;
  height: 22px;
}

.feature__title {
  font-weight: 1000;
}

.feature__desc {
  opacity: 0.78;
  font-size: 13px;
  margin-top: 2px;
}

/* MAP */
.map__frame {
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.55);
  height: 320px;
}

.map__frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
  filter: saturate(0.98) contrast(1.02);
}

.map__footer {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* REVEAL (без конфликта с глобальным .reveal) */
.c-reveal {
  opacity: 0;
  transform: translateY(14px);
  filter: none;
  transition: opacity 420ms ease, transform 420ms ease;
}

.c-reveal--in {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 520px) {
  .page {
    padding-top: 110px;
  }

  .intro {
    padding: 22px 16px;
  }

  .card {
    padding: 16px;
  }

  .map__frame {
    height: 260px;
  }
}

/* ===== Typography fix ===== */
.card__title {
  color: #b24a4a;
  font-weight: 950;
  letter-spacing: -0.02em;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
}

.card__subtitle {
  color: rgba(36, 27, 24, 0.78);
  font-weight: 700;
}

.card {
  color: rgba(36, 27, 24, 0.92);
}

.item__label {
  color: rgba(36, 27, 24, 0.68);
  font-weight: 800;
}

.item__value {
  color: rgba(36, 27, 24, 0.92);
}

.link {
  color: rgba(36, 27, 24, 0.92);
  border-bottom-color: rgba(178, 74, 74, 0.45);
}

.link:hover {
  color: #b24a4a;
  border-bottom-color: rgba(178, 74, 74, 0.7);
}

.social__title {
  color: rgba(36, 27, 24, 0.94);
  font-weight: 950;
}

.social__desc {
  color: rgba(36, 27, 24, 0.72);
  font-weight: 700;
}

.card--accent .card__title {
  color: #b24a4a;
}
</style>npm