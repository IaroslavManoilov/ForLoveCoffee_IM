<template>
  <main ref="rootEl" class="landing" :class="{ 'is-reduced': reduceMotion }" @mousemove="onMove" @mouseleave="onLeave">
    <!-- BACKGROUND -->
    <div class="bgLayer" :style="{ backgroundImage: `url(${bg})` }" aria-hidden="true"></div>
    <div class="overlay" aria-hidden="true"></div>
    <div class="grain" aria-hidden="true"></div>

    <!-- AMBIENT LIGHT -->
    <div class="ambient" :style="ambientStyle" aria-hidden="true"></div>

    <!-- BLOBS -->
    <div class="blobs" aria-hidden="true">
      <span class="blob blob--a"></span>
      <span class="blob blob--b"></span>
      <span class="blob blob--c"></span>
    </div>

    <!-- SPOTLIGHT -->
    <div class="spotlight" :style="spotlightStyle" aria-hidden="true"></div>

    <!-- PARTICLES -->
    <div class="particles" aria-hidden="true">
      <span v-for="n in 24" :key="n" class="bean" :style="particleStyle(n)"></span>
    </div>

    <!-- TOPBAR -->
    

    <!-- STAGE -->
    <section class="stage" id="top">
      <div class="left" :style="leftStyle">
        <div class="badge">
          <span class="badge__dot"></span>
          <span class="badge__title">☕ кофе с любовью, не просто напиток</span>
          <span class="badge__spark" aria-hidden="true"></span>
        </div>

        <h1 class="headline">
          <span class="headline__shine" aria-hidden="true"></span>
          For-L<span class="headline__infBox" aria-hidden="true">
            <img class="headline__inf" :src="infLogo" alt="" />
          </span>ve<br />
          место, где вкус - забота
        </h1>

        <p class="lead">
          Эта страница — <span class="lead__em">витрина</span> и атмосфера. Заказ делается
          <span class="lead__em">только в меню</span>, бронь столика — на отдельной странице.
        </p>

        <div class="cta">
          <button class="btn btn--primary" type="button" @click="goMenu" @mousemove="onBtnMove"
            @mouseleave="onBtnLeave">
            Перейти в меню
          </button>

          <button class="btn btn--ghost" type="button" @click="goBooking" @mousemove="onBtnMove"
            @mouseleave="onBtnLeave">
            Забронировать столик
          </button>

          <button class="btn btn--soft" type="button" @click="scrollTo('showcase')">
            Смотреть витрину
            <span class="btn__arrow" aria-hidden="true">→</span>
          </button>
        </div>

        <div class="mini">
          <div class="mini__item">
            <div class="mini__ico" aria-hidden="true">🔥</div>
            <div class="mini__txt">
              <div class="mini__t">Авторские вкусы</div>
              <div class="mini__s">и идеальные пары</div>
            </div>
          </div>

          <div class="mini__item">
            <div class="mini__ico" aria-hidden="true">✨</div>
            <div class="mini__txt">
              <div class="mini__t">Вау-атмосфера</div>
              <div class="mini__s">сайт как витрина</div>
            </div>
          </div>

          <div class="mini__item">
            <div class="mini__ico" aria-hidden="true">🤍</div>
            <div class="mini__txt">
              <div class="mini__t">Кофе с любовью</div>
              <div class="mini__s">в деталях сервиса</div>
            </div>
          </div>
        </div>

        <div class="scrollHint" aria-hidden="true" @click="scrollTo('showcase')">
          <span class="scrollHint__dot"></span>
          <span class="scrollHint__txt">скролл</span>
        </div>
      </div>

      <!-- RIGHT GLASS -->
      <aside class="glass" aria-label="For-Love Coffee" :style="cardStyle">
        <div class="glass__shine" aria-hidden="true"></div>
        <div class="glass__border" aria-hidden="true"></div>

        <div class="brand">
          <div class="brand__row" aria-label="For-Love">
            <span class="brand__txt">For-L</span>
            <span class="brand__infBox" aria-hidden="true">
              <img class="brand__inf" :src="infLogo" alt="" />
            </span>
            <span class="brand__txt">ve</span>
          </div>

          <div class="brand__sub">
            coffee<span class="brand__dots" aria-hidden="true">∞</span>
          </div>

          <div class="status">
            <span class="status__dot" :class="isOpen ? 'status__dot--open' : 'status__dot--closed'"
              aria-hidden="true"></span>
            <span class="status__text">{{ statusText }}</span>
            <span class="status__time">09:00–22:00</span>
          </div>
        </div>

        <div class="glass__text">
          Быстрый выбор: посмотри витрину → перейди в меню → оформи заказ.<br />
          Столик — отдельной страницей ✨
        </div>

        <div class="glass__widgets">
          <div class="widget">
            <div class="widget__title">Комбо дня</div>
            <div class="widget__row">
              <div class="widget__big">{{ comboOfDay.title }}</div>
              <div class="widget__pill">{{ comboOfDay.tag }}</div>
            </div>
            <div class="widget__sub">{{ comboOfDay.desc }}</div>
            <div class="widget__row widget__row--end">
              <div class="price price--dark">{{ formatPrice(comboOfDay.price) }}</div>
              <button class="btn btn--primary btn--sm" type="button" @click="goMenu" @mousemove="onBtnMove"
                @mouseleave="onBtnLeave">
                В меню →
              </button>
            </div>
          </div>

          <div class="widget widget--compact">
            <div class="widget__title">До {{ isOpen ? "закрытия" : "открытия" }}</div>
            <div class="widget__timer">
              <span class="t">{{ timeLeft.hh }}</span><span class="sep">:</span>
              <span class="t">{{ timeLeft.mm }}</span><span class="sep">:</span>
              <span class="t">{{ timeLeft.ss }}</span>
            </div>
            <div class="widget__sub">{{ isOpen ? "успеешь заглянуть" : "скоро откроемся" }}</div>
          </div>

          <div class="widget widget--compact">
            <div class="widget__title">Быстрое действие</div>
            <div class="widget__sub">Заказ — в меню. Хочешь уют? Забронируй столик в один клик.</div>
            <div class="widget__row widget__row--end">
              <button class="btn btn--ghost btn--sm" type="button" @click="goBooking" @mousemove="onBtnMove"
                @mouseleave="onBtnLeave">
                Бронь →
              </button>
              <button class="btn btn--primary btn--sm" type="button" @click="goMenu" @mousemove="onBtnMove"
                @mouseleave="onBtnLeave">
                Заказ →
              </button>
            </div>
          </div>
        </div>

        <div class="glass__stats">
          <div class="stat">
            <div class="stat__num">{{ counters.wait }}</div>
            <div class="stat__label">средняя выдача</div>
          </div>
          <div class="stat">
            <div class="stat__num">★ {{ counters.rate }}</div>
            <div class="stat__label">оценка гостей</div>
          </div>
          <div class="stat">
            <div class="stat__num">{{ counters.love }}</div>
            <div class="stat__label">любовь</div>
          </div>
        </div>
      </aside>
    </section>

    <!-- STICKY MINI NAV -->
    <div class="floatNav" :class="{ 'floatNav--on': scrolled }" aria-label="Быстрые действия">
      <button class="floatNav__btn" type="button" @click="scrollTo('top')">↑</button>
      <button class="floatNav__btn" type="button" @click="scrollTo('showcase')">☕</button>
      <button class="floatNav__btn floatNav__btn--primary" type="button" @click="goMenu">Меню →</button>
      <button class="floatNav__btn" type="button" @click="goBooking">Бронь →</button>
    </div>

    <!-- SHOWCASE -->
    <section id="showcase" class="section reveal" :class="{ 'is-in': inView.showcase }">
      <div class="section__inner">
        <div class="section__head">
          <h2 class="h2">Витрина</h2>
          <p class="p">Тут только просмотр. Заказ делается в меню.</p>
        </div>

        <div class="showcaseBar">
          <div class="showcaseBar__left">
            <div class="togglePills" role="tablist">
              <button class="togglePill" :class="{ on: showcaseTab === 'coffee' }" type="button"
                @click="showcaseTab = 'coffee'">
                Кофе
              </button>
              <button class="togglePill" :class="{ on: showcaseTab === 'desserts' }" type="button"
                @click="showcaseTab = 'desserts'">
                Десерты
              </button>
              <button class="togglePill" :class="{ on: showcaseTab === 'extras' }" type="button"
                @click="showcaseTab = 'extras'">
                Допы
              </button>
            </div>

            <div class="hintLine">
              <span class="hintDot" aria-hidden="true"></span>
              <span>Выбирай глазами — оформляй в меню. Столик — на странице брони.</span>
            </div>
          </div>

          <div class="showcaseBar__right">
            <button class="btn btn--ghost btn--sm" type="button" @click="goBooking" @mousemove="onBtnMove"
              @mouseleave="onBtnLeave">
              Бронь столика →
            </button>
            <button class="btn btn--primary btn--sm" type="button" @click="goMenu" @mousemove="onBtnMove"
              @mouseleave="onBtnLeave">
              Заказать в меню →
            </button>
          </div>
        </div>

        <div class="grid">
          <article class="card card--view" v-for="m in showcaseList" :key="m.id" @mousemove="cardTilt($event)"
            @mouseleave="cardTiltLeave($event)">
            <div class="card__glow" aria-hidden="true"></div>

            <div class="card__top">
              <div class="card__icon" aria-hidden="true">{{ m.emoji }}</div>
              <div class="card__title">{{ m.name }}</div>
            </div>

            <div class="card__meta">
              <span class="pill">{{ m.tag }}</span>
              <span class="pill pill--soft">{{ m.size }}</span>
              <span class="pill pill--ghost">просмотр</span>
            </div>

            <p class="card__desc">{{ m.desc }}</p>

            <div class="card__bottom">
              <div class="price">{{ formatPrice(m.price) }}</div>
              <button class="btn btn--ghost btn--sm" type="button" @click="goMenu" @mousemove="onBtnMove"
                @mouseleave="onBtnLeave">
                Оформить в меню →
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- DESSERTS + EXTRAS -->
    <section id="desserts" class="section section--dark reveal" :class="{ 'is-in': inView.desserts }">
      <div class="section__inner">
        <div class="section__head">
          <h2 class="h2">Десерты к кофе</h2>
          <p class="p">Нежные пары: сладкое + напиток. Здесь только посмотреть.</p>
        </div>

        <div class="featureRow">
          <div class="featureCard">
            <div class="featureCard__t">Пара момента</div>
            <div class="featureCard__big">{{ pairOfMoment.title }}</div>
            <div class="featureCard__s">{{ pairOfMoment.desc }}</div>
            <div class="featureCard__foot">
              <div class="price">{{ formatPrice(pairOfMoment.price) }}</div>
              <button class="btn btn--primary btn--sm" type="button" @click="goMenu" @mousemove="onBtnMove"
                @mouseleave="onBtnLeave">
                Собрать заказ в меню →
              </button>
            </div>
          </div>

          <div class="featureCard featureCard--wide">
            <div class="featureCard__t">Дополнительно</div>

            <div class="extras">
              <div class="extra" v-for="x in extras" :key="x.id">
                <div class="extra__left">
                  <div class="extra__name">{{ x.name }}</div>
                  <div class="extra__desc">{{ x.desc }}</div>
                </div>
                <div class="extra__right">
                  <div class="extra__price">{{ formatPrice(x.price) }}</div>
                  <div class="extra__tag">просмотр</div>
                </div>
              </div>
            </div>

            <div class="featureCard__actions">
              <button class="btn btn--ghost" type="button" @click="goBooking" @mousemove="onBtnMove"
                @mouseleave="onBtnLeave">
                Забронировать столик →
              </button>
              <button class="btn btn--primary" type="button" @click="goMenu" @mousemove="onBtnMove"
                @mouseleave="onBtnLeave">
                Перейти в меню →
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid--2">
          <article class="lineCard" v-for="d in dessertsOnly" :key="d.id" @mousemove="cardTilt"
            @mouseleave="cardTiltLeave">
            <div class="lineCard__icon" aria-hidden="true">{{ d.emoji }}</div>
            <div class="lineCard__main">
              <div class="lineCard__title">{{ d.name }}</div>
              <div class="lineCard__desc">{{ d.desc }}</div>
              <div class="lineCard__meta">
                <span class="pill">{{ d.tag }}</span>
                <span class="pill pill--soft">{{ d.size }}</span>
                <span class="pill pill--ghost">просмотр</span>
              </div>
            </div>
            <div class="lineCard__right">
              <div class="price">{{ formatPrice(d.price) }}</div>
              <button class="btn btn--ghost btn--sm" type="button" @click="goMenu" @mousemove="onBtnMove"
                @mouseleave="onBtnLeave">
                В меню →
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ABOUT -->
    <section id="about" class="section reveal" :class="{ 'is-in': inView.about }">
      <div class="section__inner">
        <div class="section__head">
          <h2 class="h2">О нас</h2>
          <p class="p">
            For-Love — сеть кофейни про тепло, стиль и вкус. Мы делаем кофе так, чтобы каждый глоток был “я рядом”. У
            нас важно
            всё: аромат, текстура, подача и улыбка.
          </p>
        </div>

        <div class="split">
          <div class="panel">
            <div class="panel__title">Почему люди возвращаются</div>
            <div class="bullets">
              <div class="bullet">
                <div class="bullet__icon" aria-hidden="true">☕</div>
                <div class="bullet__txt">
                  <div class="bullet__t">Стабильный вкус</div>
                  <div class="bullet__s">рецепты и контроль качества</div>
                </div>
              </div>

              <div class="bullet">
                <div class="bullet__icon" aria-hidden="true">🍓</div>
                <div class="bullet__txt">
                  <div class="bullet__t">Идеальные пары</div>
                  <div class="bullet__s">кофе + десерт = вау</div>
                </div>
              </div>

              <div class="bullet">
                <div class="bullet__icon" aria-hidden="true">🤍</div>
                <div class="bullet__txt">
                  <div class="bullet__t">Любовь в деталях</div>
                  <div class="bullet__s">сервис, подача, настроение</div>
                </div>
              </div>
            </div>
          </div>

          <div class="panel">
            <div class="panel__title">Сеть кофейни</div>
            <div class="panel__big">Мы растём</div>
            <div class="panel__sub">
              Несколько точек, один стандарт вкуса. Хочешь сотрудничество или новую локацию — пиши/звони Ярославу.
            </div>

            <div class="miniGrid">
              <div class="miniStat">
                <div class="miniStat__n">3+</div>
                <div class="miniStat__l">точки</div>
              </div>
              <div class="miniStat">
                <div class="miniStat__n">09–22</div>
                <div class="miniStat__l">каждый день</div>
              </div>
              <div class="miniStat">
                <div class="miniStat__n">∞</div>
                <div class="miniStat__l">любовь</div>
              </div>
            </div>

            <div class="panel__row panel__row--end">
              <button class="btn btn--ghost" type="button" @click="goBooking" @mousemove="onBtnMove"
                @mouseleave="onBtnLeave">
                Забронировать →
              </button>
              <button class="btn btn--primary" type="button" @click="goMenu" @mousemove="onBtnMove"
                @mouseleave="onBtnLeave">
                Перейти в меню →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACTS -->
    <section id="contacts" class="section section--dark reveal" :class="{ 'is-in': inView.contacts }">
      <div class="section__inner">
        <div class="section__head">
          <h2 class="h2">Контакты</h2>
          <p class="p">Связь быстро. Забронировать — ещё быстрее.</p>
        </div>

        <div class="contactGrid">
          <div class="contactCard">
            <div class="contactCard__t">Телефон</div>
            <a class="contactCard__big" :href="`tel:${phoneRaw}`">{{ phonePretty }}</a>
            <div class="contactCard__s">Ярослав</div>
            <div class="contactCard__actions">
              <button class="btn btn--primary btn--sm" type="button" @click="copyPhone">Скопировать</button>
              <a class="btn btn--ghost btn--sm" :href="`tel:${phoneRaw}`">Позвонить</a>
            </div>
          </div>

          <div class="contactCard">
            <div class="contactCard__t">Бронь столика</div>
            <div class="contactCard__big">в 1 клик</div>
            <div class="contactCard__s">Выбор даты/времени на странице брони.</div>
            <div class="contactCard__actions">
              <button class="btn btn--primary btn--sm" type="button" @click="goBooking" @mousemove="onBtnMove"
                @mouseleave="onBtnLeave">
                Перейти к брони →
              </button>
              <button class="btn btn--ghost btn--sm" type="button" @click="scrollTo('showcase')">Витрина</button>
            </div>
          </div>

          <div class="contactCard contactCard--wide">
            <div class="contactCard__t">Заказ</div>
            <div class="contactCard__big">только в меню</div>
            <div class="contactCard__s">На лендинге — витрина. В меню — выбор, добавки, оформление заказа.</div>
            <div class="contactCard__actions">
              <button class="btn btn--primary" type="button" @click="goMenu" @mousemove="onBtnMove"
                @mouseleave="onBtnLeave">
                Открыть меню →
              </button>
              <button class="btn btn--ghost" type="button" @click="scrollTo('top')">Наверх</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__left">
          <div class="footer__brand">
            <span class="logo__dot" aria-hidden="true"></span>
            For-L<span class="logo__infBox" aria-hidden="true"><img class="logo__inf" :src="infLogo" alt="" /></span>ve
          </div>
          <div class="footer__meta">09:00–22:00 · {{ phonePretty }} · Ярослав</div>
        </div>

        <div class="footer__right">
          <button class="btn btn--ghost btn--sm" type="button" @click="goBooking" @mousemove="onBtnMove"
            @mouseleave="onBtnLeave">
            Бронь →
          </button>
          <button class="btn btn--primary btn--sm" type="button" @click="goMenu" @mousemove="onBtnMove"
            @mouseleave="onBtnLeave">
            Меню →
          </button>
        </div>
      </div>
    </footer>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import infLogo from "@/assets/logo.svg"
import bg from "@/assets/im2.png"

/* -------------------- Router -------------------- */
const router = useRouter()
const goMenu = () => router.push("/menu")
const goBooking = () => router.push("/booking")

/* -------------------- Contacts -------------------- */
const phoneRaw = "+37368514544"
const phonePretty = "+373 685 145 44"

/* -------------------- Refs -------------------- */
const rootEl = ref(null)

/* -------------------- Utils -------------------- */
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const pad2 = (n) => String(n).padStart(2, "0")
const formatPrice = (p) => `${Math.round(p)} MDL`

/* -------------------- Reduced motion -------------------- */
const reduceMotion = ref(false)
let mq = null
const setReduceMotion = () => (reduceMotion.value = Boolean(mq?.matches))

/* -------------------- Scroll (rAF) -------------------- */
const scrolled = ref(false)
const scrollProgress = ref(0)
let scrollRaf = 0

const updateScroll = () => {
  scrollRaf = 0
  const y = window.scrollY || 0
  scrolled.value = y > 12

  const doc = document.documentElement
  const max = Math.max(1, doc.scrollHeight - window.innerHeight)
  scrollProgress.value = y / max
}
const onScroll = () => {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(updateScroll)
}

/* -------------------- Parallax -------------------- */
const mx = ref(0)
const my = ref(0)
const tx = ref(0)
const ty = ref(0)
let raf = 0

const tick = () => {
  tx.value += (mx.value - tx.value) * 0.08
  ty.value += (my.value - ty.value) * 0.08
  raf = requestAnimationFrame(tick)
}

const spotlightX = ref(0)
const spotlightY = ref(0)
const spotlightOn = ref(false)

const onMove = (e) => {
  if (reduceMotion.value) return
  const r = e.currentTarget.getBoundingClientRect()
  mx.value = clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1)
  my.value = clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1)
  spotlightX.value = e.clientX
  spotlightY.value = e.clientY
  spotlightOn.value = true
}
const onLeave = () => {
  mx.value = 0
  my.value = 0
  spotlightOn.value = false
}

const leftStyle = computed(() => {
  if (reduceMotion.value) return {}
  return { transform: `translate3d(${tx.value * 6}px, ${ty.value * 4}px, 0)` }
})
const cardStyle = computed(() => {
  if (reduceMotion.value) return {}
  const rx = ty.value * -4
  const ry = tx.value * 6
  const dx = tx.value * -10
  const dy = ty.value * -8
  return { transform: `translate3d(${dx}px, ${dy}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)` }
})

/* -------------------- Spotlight -------------------- */
const spotlightStyle = computed(() => {
  if (reduceMotion.value) return { opacity: 0 }
  return {
    left: `${spotlightX.value}px`,
    top: `${spotlightY.value}px`,
    opacity: spotlightOn.value ? 1 : 0,
  }
})

/* -------------------- Ambient -------------------- */
const ambientStyle = computed(() => {
  const p = scrollProgress.value
  const base = reduceMotion.value ? 0.12 : 0.10 + p * 0.18
  const s = 1 + p * 0.07
  return {
    opacity: base,
    transform: `translate3d(0,0,0) scale(${s}) rotateX(${ty.value * 3}deg) rotateY(${tx.value * 4}deg)`,
  }
})

/* -------------------- Button magnet -------------------- */
const onBtnMove = (e) => {
  if (reduceMotion.value) return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
  const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
  el.style.setProperty("--bx", `${clamp(nx, -1, 1) * 4}px`)
  el.style.setProperty("--by", `${clamp(ny, -1, 1) * 3}px`)
}
const onBtnLeave = (e) => {
  const el = e.currentTarget
  el.style.setProperty("--bx", `0px`)
  el.style.setProperty("--by", `0px`)
}

/* -------------------- Card tilt -------------------- */
const cardTilt = (e) => {
  if (reduceMotion.value) return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
  const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
  const rx = ny * -6
  const ry = nx * 8
  el.style.setProperty("--rx", `${rx}deg`)
  el.style.setProperty("--ry", `${ry}deg`)
  el.style.setProperty("--gx", `${((nx + 1) / 2) * 100}%`)
  el.style.setProperty("--gy", `${((ny + 1) / 2) * 100}%`)
}
const cardTiltLeave = (e) => {
  const el = e.currentTarget
  el.style.setProperty("--rx", `0deg`)
  el.style.setProperty("--ry", `0deg`)
}

/* -------------------- Particles -------------------- */
const particleStyle = (n) => {
  const seed = (n * 9301 + 49297) % 233280
  const rnd = seed / 233280
  const x = Math.round(rnd * 92 + 4)
  const y = Math.round(((rnd * 7) % 1) * 84 + 6)
  const s = (rnd * 0.9 + 0.25).toFixed(2)
  const d = Math.round(rnd * 2600 + 200)
  const a = (rnd * 0.35 + 0.10).toFixed(2)
  return { left: `${x}%`, top: `${y}%`, opacity: a, transform: `scale(${s})`, animationDelay: `${d}ms` }
}

/* -------------------- Open/Closed + timer -------------------- */
const OPEN_H = 9
const CLOSE_H = 22

const now = ref(new Date())
let clock = 0

const isOpen = computed(() => {
  const h = now.value.getHours()
  const m = now.value.getMinutes()
  const minutes = h * 60 + m
  return minutes >= OPEN_H * 60 && minutes < CLOSE_H * 60
})
const statusText = computed(() => (isOpen.value ? "Открыто сейчас" : "Сейчас закрыто"))
const timeHint = computed(() => (isOpen.value ? "до 22:00" : "откроемся в 09:00"))

const timeLeft = computed(() => {
  const d = new Date(now.value)
  const target = new Date(d)
  if (isOpen.value) target.setHours(CLOSE_H, 0, 0, 0)
  else {
    target.setHours(OPEN_H, 0, 0, 0)
    if (d.getHours() >= CLOSE_H) target.setDate(target.getDate() + 1)
  }

  let diff = Math.max(0, target.getTime() - d.getTime())
  const hh = Math.floor(diff / 3600000)
  diff -= hh * 3600000
  const mm = Math.floor(diff / 60000)
  diff -= mm * 60000
  const ss = Math.floor(diff / 1000)
  return { hh: pad2(hh), mm: pad2(mm), ss: pad2(ss) }
})

/* -------------------- Data -------------------- */
const items = [
  { id: "c1", type: "dessert", name: "Crepe Banana & Choco", price: 65, emoji: "🍌", tag: "десерт", size: "креп", desc: "Банан + шоколад — идеальная пара к кофе." },
  { id: "c2", type: "dessert", name: "Crepe Strawberry", price: 65, emoji: "🍓", tag: "нежно", size: "креп", desc: "Клубника, крем и сахарная пудра — нежно и ярко." },
  { id: "d1", type: "coffee", name: "Raf Coffee", price: 55, emoji: "✨", tag: "сливочно", size: "300 мл", desc: "Сливочный кофе с ванильным сахаром и нежной пенкой." },
  { id: "d2", type: "coffee", name: "Americano", price: 39, emoji: "⚡", tag: "классика", size: "250 мл", desc: "Классический чёрный кофе — насыщенный и бодрящий." },
  { id: "d3", type: "coffee", name: "Pistachio Ice Coffee", price: 59, emoji: "🧊", tag: "фисташка", size: "350 мл", desc: "Нежный вкус фисташки + малина. Лёд, свежесть, кайф." },
]

const extras = [
  { id: "x1", name: "Сироп ваниль", desc: "Мягкая сладость — идеально к рафу.", price: 10 },
  { id: "x2", name: "Сироп карамель", desc: "Тёплый вкус, делает напиток “десертом”.", price: 10 },
  { id: "x3", name: "Доп. эспрессо", desc: "Больше бодрости и глубины.", price: 15 },
  { id: "x4", name: "Взбитые сливки", desc: "Нежный верх — финальный штрих.", price: 12 },
]

const showcaseTab = ref("coffee")
const showcaseList = computed(() => {
  if (showcaseTab.value === "coffee") return items.filter((x) => x.type === "coffee")
  if (showcaseTab.value === "desserts") return items.filter((x) => x.type === "dessert")
  return extras.map((x) => ({
    id: x.id,
    type: "extras",
    name: x.name,
    price: x.price,
    emoji: "➕",
    tag: "доп",
    size: "опция",
    desc: x.desc,
  }))
})

const dessertsOnly = computed(() => items.filter((x) => x.type === "dessert"))

const comboOfDay = computed(() => {
  const d = now.value.getDate()
  const coffee = items.filter((x) => x.type === "coffee")
  const dessert = items.filter((x) => x.type === "dessert")
  const c = coffee[d % coffee.length]
  const ds = dessert[d % dessert.length]
  return { title: `${c.name} + ${ds.name}`, tag: "идеальная пара", desc: "Собери комбо под настроение. Оформление — в меню.", price: c.price + ds.price }
})

const pairOfMoment = computed(() => {
  const d = now.value.getDate()
  const dessert = items.filter((x) => x.type === "dessert")
  const ds = dessert[d % dessert.length]
  return { title: ds.name, desc: "Идея к кофе: нежно, сладко, красиво.", price: ds.price }
})

/* -------------------- Counters -------------------- */
const counters = reactive({
  wait: "7–10 мин",
  rate: "4.9",
  love: "∞",
})

/* -------------------- Scroll-to -------------------- */
const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: reduceMotion.value ? "auto" : "smooth", block: "start" })
}

/* -------------------- Reveal show/hide on scroll -------------------- */
const inView = reactive({ showcase: false, desserts: false, about: false, contacts: false })
let io = null

const setupReveal = () => {
  const ids = ["showcase", "desserts", "about", "contacts"]
  const els = ids.map((id) => document.getElementById(id)).filter(Boolean)

  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const id = e.target.getAttribute("id")
        if (!id) continue
        inView[id] = Boolean(e.isIntersecting)
      }
    },
    { threshold: 0.18, rootMargin: "-10% 0px -10% 0px" }
  )

  els.forEach((el) => io.observe(el))
}

/* -------------------- Copy phone -------------------- */
const copyPhone = async () => {
  try {
    await navigator.clipboard.writeText(phoneRaw)
  } catch {
    // no-op
  }
}

/* -------------------- Lifecycle -------------------- */
onMounted(() => {
  mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  setReduceMotion()
  mq?.addEventListener?.("change", setReduceMotion)

  raf = requestAnimationFrame(tick)
  clock = window.setInterval(() => (now.value = new Date()), 1000)

  setupReveal()
  updateScroll()
  window.addEventListener("scroll", onScroll, { passive: true })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  if (clock) window.clearInterval(clock)
  io?.disconnect?.()
  mq?.removeEventListener?.("change", setReduceMotion)
  window.removeEventListener("scroll", onScroll)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
})
</script>

<style>
/* ===== Base ===== */
html {
  scroll-behavior: smooth;
}

.landing {
  --header-h: 74px;
  --lift: -170px;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding-top: var(--header-h);
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

.section {
  scroll-margin-top: calc(var(--header-h) + 16px);
}

/* =========================
   ✅ FIX: декоративные fixed слои
   не должны ловить клики/скролл
   ========================= */
.bgLayer,
.overlay,
.grain,
.ambient,
.blobs,
.spotlight,
.particles {
  pointer-events: none;
}

/* ===== Background ===== */
.bgLayer {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #000;
  transform: translateZ(0);
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: radial-gradient(1100px 700px at 22% 35%, rgba(0, 0, 0, 0.46), transparent 62%),
    radial-gradient(1000px 700px at 76% 55%, rgba(0, 0, 0, 0.34), transparent 68%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.38) 0%, rgba(0, 0, 0, 0.08) 42%, rgba(0, 0, 0, 0.58) 100%);
}

.grain {
  position: fixed;
  inset: -30%;
  z-index: 2;
  opacity: 0.1;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
  transform: rotate(12deg);
}

/* Ambient */
.ambient {
  position: fixed;
  inset: -20vh -20vw;
  z-index: 2;
  background: radial-gradient(900px 600px at 20% 30%, rgba(178, 74, 74, 0.34), transparent 60%),
    radial-gradient(900px 600px at 80% 60%, rgba(255, 255, 255, 0.16), transparent 65%),
    conic-gradient(from 180deg at 50% 50%, rgba(178, 74, 74, 0.14), transparent, rgba(178, 74, 74, 0.1));
  filter: blur(18px);
  mix-blend-mode: screen;
  will-change: transform, opacity;
}

/* Blobs */
.blobs {
  position: fixed;
  inset: 0;
  z-index: 2;
}

.blob {
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 999px;
  filter: blur(34px);
  opacity: 0.35;
  mix-blend-mode: screen;
  animation: blobFloat 10s ease-in-out infinite;
}

.blob--a {
  left: -140px;
  top: 10vh;
  background: radial-gradient(circle at 30% 30%, rgba(178, 74, 74, 0.95), transparent 60%);
}

.blob--b {
  right: -160px;
  top: 22vh;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.55), transparent 60%);
  animation-duration: 12s;
}

.blob--c {
  left: 20vw;
  bottom: -220px;
  background: radial-gradient(circle at 30% 30%, rgba(178, 74, 74, 0.55), transparent 60%);
  animation-duration: 13s;
}

@keyframes blobFloat {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(18px, -18px, 0) scale(1.06);
  }

  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}

/* Spotlight */
.spotlight {
  position: fixed;
  z-index: 3;
  width: 520px;
  height: 520px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.14), transparent 60%);
  filter: blur(2px);
  transition: opacity 180ms ease;
}

/* Particles */
.particles {
  position: fixed;
  inset: 0;
  z-index: 3;
}

.bean {
  position: absolute;
  width: 14px;
  height: 10px;
  border-radius: 999px;
  background: rgba(178, 74, 74, 0.55);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
  transform: rotate(25deg);
  animation: beanFloat 5200ms ease-in-out infinite;
}

.bean::after {
  content: "";
  position: absolute;
  inset: 2px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0.7;
}

@keyframes beanFloat {
  0% {
    transform: translate3d(0, 0, 0) rotate(25deg) scale(1);
  }

  50% {
    transform: translate3d(0, -22px, 0) rotate(30deg) scale(1.03);
  }

  100% {
    transform: translate3d(0, 0, 0) rotate(25deg) scale(1);
  }
}

/* Topbar */
.topbar {
  position: fixed;
  inset: 0 0 auto 0;
  height: var(--header-h);
  z-index: 60;
  display: grid;
  place-items: center;
  transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  background: rgba(10, 10, 10, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.topbar--scrolled {
  background: rgba(10, 10, 10, 0.3);
  border-bottom-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 14px 46px rgba(0, 0, 0, 0.28);
}

.topbar__inner {
  width: min(1200px, 92vw);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 14px;
  align-items: center;
  position: relative;
}

.topbar__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
}

.topbar__progress i {
  display: block;
  height: 100%;
  transform-origin: 0 50%;
  background: rgba(178, 74, 74, 0.95);
  box-shadow: 0 0 18px rgba(178, 74, 74, 0.4);
}

.logo {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 950;
  letter-spacing: -0.02em;
}

.logo__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: rgba(178, 74, 74, 0.98);
  box-shadow: 0 0 0 4px rgba(178, 74, 74, 0.2);
}

/* ✅ подняли бесконечность */
.logo__infBox {
  width: 14px;
  height: 10px;
  display: inline-flex;
  transform: translateY(-0.10em);
}

.logo__inf {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.22));
}

.logo__sub {
  margin-left: 8px;
  font-weight: 850;
  opacity: 0.8;
  font-style: italic;
}

.nav {
  display: inline-flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.nav__link {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.9);
  padding: 10px 12px;
  border-radius: 999px;
  font-weight: 850;
  cursor: pointer;
  transition: transform 150ms ease, background 150ms ease, border-color 150ms ease;
}

.nav__link:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.18);
}

.topbar__right {
  display: inline-flex;
  gap: 10px;
  justify-content: end;
  align-items: center;
  flex-wrap: wrap;
}

.openWidget {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.9);
}

.openWidget__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
}

.openWidget--open .openWidget__dot {
  background: rgba(178, 74, 74, 0.98);
  box-shadow: 0 0 0 4px rgba(178, 74, 74, 0.16);
}

.openWidget--closed .openWidget__dot {
  background: rgba(20, 20, 20, 0.92);
  box-shadow: 0 0 0 4px rgba(20, 20, 20, 0.12);
}

.openWidget__text {
  font-weight: 900;
  font-size: 12px;
  letter-spacing: 0.03em;
}

.openWidget__meta {
  font-weight: 850;
  font-size: 12px;
  opacity: 0.75;
}

/* Stage */
.stage {
  position: relative;
  z-index: 10;
  min-height: calc(100vh - var(--header-h));
  padding: clamp(14px, 3vw, 56px);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(14px, 3vw, 48px);
  align-items: center;
  perspective: 900px;
  transform: translateY(var(--lift));
}

.left {
  max-width: 740px;
  color: rgba(255, 255, 255, 0.92);
  animation: floatIn 520ms ease both;
  will-change: transform;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  font-weight: 850;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
}

.badge__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: rgba(178, 74, 74, 0.98);
  box-shadow: 0 0 0 4px rgba(178, 74, 74, 0.22);
}

.badge__spark {
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 0%, rgba(255, 255, 255, 0.14) 35%, transparent 70%);
  transform: translateX(-70%);
  animation: shimmer 2600ms ease-in-out infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0% {
    transform: translateX(-70%);
    opacity: 0.16;
  }

  35% {
    opacity: 0.42;
  }

  100% {
    transform: translateX(70%);
    opacity: 0.12;
  }
}

.headline {
  margin: 0;
  font-weight: 950;
  letter-spacing: -0.03em;
  line-height: 1.02;
  font-size: clamp(34px, 5.2vw, 66px);
  text-shadow: 0 20px 60px rgba(0, 0, 0, 0.46);
  position: relative;
}

.headline__shine {
  position: absolute;
  inset: -18px -18px auto -18px;
  height: 70%;
  background: radial-gradient(closest-side, rgba(255, 255, 255, 0.12), transparent 70%);
  pointer-events: none;
}

/* ✅ подняли бесконечность */
.headline__infBox {
  width: 1.03em;
  height: 0.96em;
  display: inline-flex;
  margin: 0 0.1em;
  transform: translateY(0.21em);
  flex: 0 0 auto;
}

.headline__inf {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.lead {
  margin: 16px 0 0;
  max-width: 640px;
  font-size: clamp(14px, 1.6vw, 18px);
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.84);
}

.lead__em {
  font-weight: 950;
  color: rgba(255, 255, 255, 0.92);
}

.cta {
  margin-top: 18px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.mini {
  margin-top: 18px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  opacity: 0.95;
}

.mini__item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);
  font-weight: 850;
  font-size: 13px;
  transition: transform 160ms ease, background 160ms ease;
}

.mini__item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.14);
}

.mini__ico {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(178, 74, 74, 0.2);
  border: 1px solid rgba(178, 74, 74, 0.26);
}

.mini__t {
  font-weight: 950;
}

.mini__s {
  font-weight: 800;
  opacity: 0.78;
  font-size: 12px;
  margin-top: 2px;
}

.scrollHint {
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  opacity: 0.8;
  color: rgba(255, 255, 255, 0.82);
  cursor: pointer;
  user-select: none;
}

.scrollHint__dot {
  width: 20px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  position: relative;
  overflow: hidden;
}

.scrollHint__dot::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 7px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  transform: translateX(-50%);
  animation: scrollDot 1200ms ease-in-out infinite;
}

@keyframes scrollDot {
  0% {
    transform: translate(-50%, 0);
    opacity: 0.9;
  }

  70% {
    transform: translate(-50%, 14px);
    opacity: 0.5;
  }

  100% {
    transform: translate(-50%, 0);
    opacity: 0.9;
  }
}

.scrollHint__txt {
  font-weight: 850;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Glass */
.glass {
  position: relative;
  border-radius: 34px;
  padding: clamp(20px, 3vw, 34px);
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(18px) saturate(1.25);
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.24);
  animation: floatIn2 620ms ease both;
  will-change: transform;
  transform-style: preserve-3d;
}

.glass__shine {
  position: absolute;
  inset: 0;
  border-radius: 34px;
  pointer-events: none;
  background: radial-gradient(680px 260px at 16% 10%, rgba(255, 255, 255, 0.2), transparent 60%);
}

.glass__border {
  position: absolute;
  inset: 0;
  border-radius: 34px;
  pointer-events: none;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.22), transparent 30%, rgba(255, 255, 255, 0.16));
  mask: linear-gradient(#000, transparent 70%);
  opacity: 0.55;
}

.brand__row {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  font-weight: 950;
  font-style: italic;
  letter-spacing: -0.03em;
  line-height: 1;
  font-size: clamp(42px, 5vw, 86px);
  color: rgba(15, 15, 15, 0.92);
}

/* ✅ подняли бесконечность */
.brand__infBox {
  width: clamp(46px, 6vw, 112px);
  height: clamp(34px, 4.2vw, 86px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translateY(0.25em);
}

.brand__inf {
  width: 100%;
  height: auto;
  display: block;
  transform: translateY(6%);
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.2));
}

.brand__sub {
  margin-top: 8px;
  font-weight: 950;
  font-style: italic;
  font-size: clamp(22px, 2.8vw, 46px);
  color: rgba(15, 15, 15, 0.78);
}

.brand__dots {
  display: inline-block;
  margin-left: 10px;
  font-weight: 950;
  color: rgba(178, 74, 74, 1);
  transform: translateY(0.06em);
}

.status {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.22);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: rgba(15, 15, 15, 0.9);
}

.status__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
}

.status__dot--open {
  background: rgba(178, 74, 74, 0.98);
  box-shadow: 0 0 0 4px rgba(178, 74, 74, 0.18);
}

.status__dot--closed {
  background: rgba(20, 20, 20, 0.92);
  box-shadow: 0 0 0 4px rgba(20, 20, 20, 0.12);
}

.status__time {
  font-weight: 900;
  opacity: 0.78;
}

.glass__text {
  margin-top: 14px;
  font-size: 14px;
  line-height: 1.45;
  font-weight: 850;
  color: rgba(15, 15, 15, 0.7);
}

/* Widgets */
.glass__widgets {
  margin-top: 14px;
  display: grid;
  gap: 10px;
}

.widget {
  border-radius: 18px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(10px);
}

.widget--compact {
  padding: 10px 12px;
}

.widget__title {
  font-weight: 950;
  color: rgba(15, 15, 15, 0.82);
  font-size: 12px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.widget__row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.widget__row--end {
  justify-content: space-between;
}

.widget__big {
  font-weight: 950;
  color: rgba(15, 15, 15, 0.9);
  font-size: 18px;
}

.widget__sub {
  margin-top: 6px;
  font-weight: 850;
  color: rgba(15, 15, 15, 0.62);
  font-size: 12px;
  line-height: 1.4;
}

.widget__pill {
  margin-left: auto;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(178, 74, 74, 0.16);
  border: 1px solid rgba(178, 74, 74, 0.18);
  color: rgba(15, 15, 15, 0.86);
  font-weight: 950;
  font-size: 12px;
}

.widget__timer {
  margin-top: 8px;
  font-weight: 950;
  color: rgba(15, 15, 15, 0.92);
  font-size: 20px;
}

.widget__timer .sep {
  opacity: 0.55;
  padding: 0 4px;
}

/* Stats */
.glass__stats {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stat {
  border-radius: 16px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  text-align: left;
  transition: transform 160ms ease, background 160ms ease;
}

.stat:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.22);
}

.stat__num {
  font-weight: 950;
  color: rgba(15, 15, 15, 0.88);
}

.stat__label {
  margin-top: 3px;
  font-size: 12px;
  font-weight: 850;
  color: rgba(15, 15, 15, 0.62);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 13px 18px;
  font-weight: 900;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, border-color 0.15s ease;
  transform: translate3d(var(--bx, 0px), var(--by, 0px), 0);
}

.btn--sm {
  padding: 10px 12px;
  font-size: 13px;
}

.btn__arrow {
  margin-left: 8px;
  font-weight: 950;
  opacity: 0.9;
}

.btn--primary {
  background: #b24a4a;
  color: #fff;
  box-shadow: 0 14px 34px rgba(178, 74, 74, 0.32);
}

.btn--primary:hover {
  background: #9b3e3e;
  box-shadow: 0 18px 46px rgba(178, 74, 74, 0.34);
}

.btn--ghost {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
}

.btn--ghost:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn--soft {
  background: rgba(255, 255, 255, 0.26);
  border-color: rgba(255, 255, 255, 0.28);
  color: rgba(15, 15, 15, 0.86);
}

.btn--soft:hover {
  background: rgba(255, 255, 255, 0.32);
}

/* Sections */
.section {
  position: relative;
  z-index: 12;
  padding: clamp(40px, 6vw, 86px) 0;
}

.section__inner {
  width: min(1200px, 92vw);
  margin: 0 auto;
}

.section__head {
  margin-bottom: 18px;
}

.h2 {
  margin: 0;
  font-weight: 950;
  letter-spacing: -0.03em;
  font-size: clamp(26px, 3.2vw, 44px);
  color: rgba(255, 255, 255, 0.92);
}

.p {
  margin: 10px 0 0;
  max-width: 860px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.76);
  line-height: 1.5;
}

.section--dark {
  background: linear-gradient(180deg, rgba(10, 10, 10, 0), rgba(10, 10, 10, 0.35) 20%, rgba(10, 10, 10, 0.25));
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* Reveal show/hide */
.reveal {
  opacity: 0;
  transform: translateY(18px);
  filter: blur(7px);

  transition: opacity 520ms ease, transform 520ms ease, filter 520ms ease,
    mask-position 700ms ease, -webkit-mask-position 700ms ease;

  /* standard */
  mask-image: linear-gradient(90deg, transparent 0%, #000 18%, #000 82%, transparent 100%);
  mask-size: 220% 100%;
  mask-position: 120% 0;

  /* webkit */
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 18%, #000 82%, transparent 100%);
  -webkit-mask-size: 220% 100%;
  -webkit-mask-position: 120% 0;
}

.reveal.is-in {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);

  /* standard */
  mask-position: 50% 0;

  /* webkit */
  -webkit-mask-position: 50% 0;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.grid--2 {
  grid-template-columns: repeat(2, 1fr);
}

/* Card */
.card {
  position: relative;
  border-radius: 22px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(12px);
  transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transform-style: preserve-3d;
  transition: transform 180ms ease, background 180ms ease;
  overflow: hidden;
}

.card:hover {
  background: rgba(255, 255, 255, 0.12);
}

.card__glow {
  position: absolute;
  inset: -1px;
  background: radial-gradient(320px 220px at var(--gx, 50%) var(--gy, 50%), rgba(178, 74, 74, 0.22), transparent 60%);
  pointer-events: none;
}

.card__top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card__icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(178, 74, 74, 0.18);
  border: 1px solid rgba(178, 74, 74, 0.22);
}

.card__title {
  font-weight: 950;
  color: rgba(255, 255, 255, 0.92);
}

.card__meta {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.card__desc {
  margin: 10px 0 0;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.76);
  line-height: 1.45;
}

.card__bottom {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.price {
  font-weight: 950;
  color: rgba(255, 255, 255, 0.92);
}

.price--dark {
  color: rgba(15, 15, 15, 0.92);
}

/* Pills */
.pill {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.86);
  font-weight: 900;
  font-size: 12px;
}

.pill--soft {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
  opacity: 0.95;
}

.pill--ghost {
  background: rgba(0, 0, 0, 0.1);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.72);
}

/* Showcase bar */
.showcaseBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 12px 0 16px;
  flex-wrap: wrap;
}

.showcaseBar__left {
  min-width: min(720px, 100%);
}

.showcaseBar__right {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.togglePills {
  display: inline-flex;
  gap: 10px;
  flex-wrap: wrap;
}

.togglePill {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.9);
  padding: 10px 12px;
  border-radius: 999px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 150ms ease, background 150ms ease, border-color 150ms ease;
}

.togglePill:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.12);
}

.togglePill.on {
  background: rgba(178, 74, 74, 0.24);
  border-color: rgba(178, 74, 74, 0.26);
}

.hintLine {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.72);
}

.hintDot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: rgba(178, 74, 74, 0.98);
  box-shadow: 0 0 0 4px rgba(178, 74, 74, 0.18);
}

/* Feature row */
.featureRow {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 14px;
  align-items: start;
}

.featureCard {
  border-radius: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(12px);
}

.featureCard__t {
  font-weight: 950;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
}

.featureCard__big {
  margin-top: 10px;
  font-weight: 950;
  color: rgba(255, 255, 255, 0.94);
  font-size: 22px;
}

.featureCard__s {
  margin-top: 6px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.74);
  line-height: 1.45;
}

.featureCard__foot {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.featureCard__actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* Extras list */
.extras {
  margin-top: 10px;
  display: grid;
  gap: 10px;
}

.extra {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.extra__name {
  font-weight: 950;
  color: rgba(255, 255, 255, 0.92);
}

.extra__desc {
  margin-top: 4px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.74);
  font-size: 12px;
  line-height: 1.35;
}

.extra__right {
  text-align: right;
  display: grid;
  gap: 6px;
  align-content: start;
}

.extra__price {
  font-weight: 950;
  color: rgba(255, 255, 255, 0.92);
}

.extra__tag {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.1);
  font-weight: 900;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.72);
}

/* Line cards */
.lineCard {
  border-radius: 22px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(12px);
  display: grid;
  grid-template-columns: 44px 1fr auto;
  gap: 12px;
  align-items: center;
  transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transform-style: preserve-3d;
  transition: transform 180ms ease, background 180ms ease;
}

.lineCard:hover {
  background: rgba(255, 255, 255, 0.12);
}

.lineCard__icon {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(178, 74, 74, 0.18);
  border: 1px solid rgba(178, 74, 74, 0.22);
}

.lineCard__title {
  font-weight: 950;
  color: rgba(255, 255, 255, 0.92);
}

.lineCard__desc {
  margin-top: 4px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.74);
  font-size: 12px;
  line-height: 1.35;
}

.lineCard__meta {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.lineCard__right {
  text-align: right;
  display: grid;
  gap: 10px;
  justify-items: end;
}

/* Panels */
.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  align-items: start;
}

.panel {
  border-radius: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(12px);
}

.panel__title {
  font-weight: 950;
  color: rgba(255, 255, 255, 0.78);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 12px;
}

.panel__big {
  margin-top: 8px;
  font-weight: 950;
  color: rgba(255, 255, 255, 0.94);
  font-size: 22px;
}

.panel__sub {
  margin-top: 6px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.76);
  line-height: 1.45;
}

.panel__row {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.panel__row--end {
  justify-content: space-between;
  align-items: center;
}

.bullets {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.bullet {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);
}

.bullet__icon {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(178, 74, 74, 0.18);
  border: 1px solid rgba(178, 74, 74, 0.22);
}

.bullet__t {
  font-weight: 950;
  color: rgba(255, 255, 255, 0.92);
}

.bullet__s {
  font-weight: 850;
  color: rgba(255, 255, 255, 0.74);
  font-size: 12px;
  margin-top: 2px;
}

.miniGrid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.miniStat {
  border-radius: 18px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  text-align: center;
}

.miniStat__n {
  font-weight: 950;
  color: rgba(255, 255, 255, 0.92);
}

.miniStat__l {
  margin-top: 4px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

/* Contacts */
.contactGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.contactCard {
  border-radius: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(12px);
}

.contactCard--wide {
  grid-column: 1 / -1;
}

.contactCard__t {
  font-weight: 950;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
}

.contactCard__big {
  margin-top: 10px;
  font-weight: 950;
  font-size: 22px;
  color: rgba(255, 255, 255, 0.94);
  text-decoration: none;
  display: inline-block;
}

.contactCard__big:hover {
  text-decoration: underline;
}

.contactCard__s {
  margin-top: 6px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.76);
  line-height: 1.45;
}

.contactCard__actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Float nav */
.floatNav {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 70;
  display: grid;
  gap: 10px;
  transform: translateY(16px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 180ms ease, transform 180ms ease;
}

.floatNav--on {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.floatNav__btn {
  border-radius: 16px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(20, 20, 20, 0.6);
  color: rgba(255, 255, 255, 0.92);
  font-weight: 950;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition: transform 150ms ease, background 150ms ease;
}

.floatNav__btn:hover {
  transform: translateY(-1px);
  background: rgba(20, 20, 20, 0.72);
}

.floatNav__btn--primary {
  background: rgba(178, 74, 74, 0.9);
  border-color: rgba(178, 74, 74, 0.4);
}

/* Footer */
.footer {
  position: relative;
  z-index: 12;
  padding: 22px 0 34px;
}

.footer__inner {
  width: min(1200px, 92vw);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.footer__brand {
  font-weight: 950;
  color: rgba(255, 255, 255, 0.92);
  display: inline-flex;
  gap: 8px;
  align-items: baseline;
}

.footer__meta {
  margin-top: 6px;
  font-weight: 850;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

.footer__right {
  display: inline-flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Anim */
@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatIn2 {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Reduced motion */
.is-reduced .bean,
.is-reduced .badge__spark,
.is-reduced .scrollHint__dot::after,
.is-reduced .blob {
  animation: none !important;
}

.is-reduced .left,
.is-reduced .glass,
.is-reduced .reveal {
  transition: none !important;
}

/* Responsive */
@media (max-width: 980px) {
  .topbar__inner {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .nav {
    justify-content: start;
  }

  .topbar__right {
    justify-content: start;
  }

  .stage {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    transform: translateY(calc(var(--lift) * 0.45));
  }

  .cta {
    justify-content: center;
  }

  .mini {
    justify-content: center;
  }

  .glass {
    width: min(92vw, 600px);
    transform: none !important;
  }

  .glass__stats {
    grid-template-columns: 1fr;
  }

  .stat {
    text-align: center;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .grid--2 {
    grid-template-columns: 1fr;
  }

  .featureRow {
    grid-template-columns: 1fr;
  }

  .split {
    grid-template-columns: 1fr;
  }

  .miniGrid {
    grid-template-columns: 1fr;
  }

  .contactGrid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .btn {
    width: 100%;
  }

  .topbar {
    height: auto;
    padding: 10px 0;
  }

  .landing {
    --header-h: 98px;
  }
}



</style>