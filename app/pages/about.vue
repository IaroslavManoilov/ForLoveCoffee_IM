<template>
    <section class="about">
        <div class="container">
            <div class="cardWrap">
                <div class="card" :class="{ 'is-visible': visible }">
                    <div class="grid">
                        <!-- LEFT -->
                        <div class="left">
                            <p class="badge">Особенный вкус</p>

                            <h1 class="title">
                                Кофе — больше, чем напиток.
                                <span class="accent">Это момент.</span>
                            </h1>

                           <p class="lead">
  В
  <span class="brand">
    For-L
    <img class="brand__inf" :src="infLogo" alt="∞" />
    ve Coffee
  </span>
  мы верим, что кофе — это повод для первой встречи, тихий момент наедине со своими мыслями
  или тёплое общение с друзьями.
</p>


                            <p class="text">
                                Мы создали это место для тех, кто влюблён: в жизнь, в долгие прогулки и,
                                конечно, в идеальный вкус кофе с холодным мороженым и клубничным сиропом.
                                У нас вы найдёте не только качественный напиток, но и частичку нашей любви
                                в каждой чашке.
                            </p>

                            <div class="info">
                                <div class="infoRow">
                                    <span class="dot"></span>
                                    <div class="infoBody">
                                        <div class="infoTitle">Адрес</div>
                                        <div class="infoText">
                                            📍 Ждём тебя по адресу: <b>{{ address }}</b>
                                        </div>
                                    </div>
                                </div>

                                <div class="infoRow">
                                    <span class="dot"></span>
                                    <div class="infoBody">
                                        <div class="infoTitle">Время</div>
                                        <div class="infoText">
                                            ⏰ Работаем для тебя: <b>{{ hours }}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="actions">
                                <button class="btn primary" type="button" @click="goMenu">Посмотреть меню</button>
                                <button class="btn" type="button" @click="goContacts">Контакты</button>
                            </div>
                        </div>

                        <!-- RIGHT -->
                        <div class="right">
                            <div class="photoWrap">
                                <img class="photo" :src="coffeeImg" alt="Coffee" />
                                <div class="glow"></div>
                            </div>

                            <div class="mini">
                                <div class="miniItem">
                                    <div class="miniNum">100%</div>
                                    <div class="miniTxt">свежесваренный кофе</div>
                                </div>
                                <div class="miniItem">
                                    <div class="miniNum">вкус</div>
                                    <div class="miniTxt">мороженое и сиропы</div>
                                </div>
                                <div class="miniItem">
                                    <div class="miniNum">❤</div>
                                    <div class="miniTxt">любовь в каждой чашке</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- BOTTOM -->
                    <div class="bottom">
                        <h2 class="bottomTitle">Почему у нас вкусно?</h2>

                        <div class="bottomGrid">
                            <div class="bCard">
                                <h3>Добавки к кофе</h3>
                                <p>
                                    Мороженое, клубничный и другие сиропы — добавляй вкус под настроение
                                    и создавай свой идеальный кофе.
                                </p>
                            </div>

                            <div class="bCard">
                                <h3>Бариста</h3>
                                <p>Готовим аккуратно: баланс, температура и время экстракции.</p>
                            </div>

                            <div class="bCard">
                                <h3>Атмосфера</h3>
                                <p>Место, куда хочется возвращаться: тепло, уют и спокойствие.</p>
                            </div>
                        </div>

                        <div class="cta">
                            <div class="ctaLeft">
                                <div class="ctaTitle">Готов(а) попробовать?</div>
                                <div class="ctaText">Заходи сегодня — мы будем рады.</div>
                            </div>

                            <button class="btn primary" type="button" @click="goBooking">
                                Забронировать столик
                            </button>
                        </div>
                    </div>
                    <!-- /BOTTOM -->
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import infLogo from "@/assets/logo.svg";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import coffeeImg from "@/assets/about-coffee.png";

const router = useRouter();

const address = "Chișinău, [Ваш адрес]";
const hours = "09:00 – 22:00";

const visible = ref(false);

const goMenu = () => router.push("/menu");
const goContacts = () => router.push("/contacts");
const goBooking = () => router.push("/booking");

onMounted(() => {
    requestAnimationFrame(() => (visible.value = true));
});
</script>

<style scoped>
/* ✅ секция + место под фиксированный TopBar + бордовый glow как на контактах */
.about {
  
  width: 100%;
  min-height: auto;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;

  padding-top: calc(110px + 12px);
  padding-bottom: 60px;

  display: flex;
  justify-content: center;
  box-sizing: border-box;

  position: relative;
  overflow: hidden;

  /* фон “припылённый” + бордовые радиальные подсветки */
  background:
    radial-gradient(1100px 700px at 20% 10%, rgba(178, 74, 74, 0.18), transparent 60%),
    radial-gradient(900px 600px at 85% 25%, rgba(178, 74, 74, 0.12), transparent 60%),
    radial-gradient(900px 900px at 45% 100%, rgba(178, 74, 74, 0.08), transparent 60%),
    linear-gradient(180deg, #ffffff 0%, #fbf5f1 45%, #f5ede8 100%);
}

/* “дымчатый” бордовый блёр */
.about::before,
.about::after {
  content: "";
  position: absolute;
  width: 560px;
  height: 560px;
  border-radius: 999px;
  filter: blur(42px);
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;
}

.about::before {
  left: -160px;
  top: 120px;
  background: radial-gradient(circle at 30% 30%, rgba(178, 74, 74, 0.55), transparent 60%);
}

.about::after {
  right: -200px;
  bottom: -160px;
  background: radial-gradient(circle at 30% 30%, rgba(147, 55, 55, 0.45), transparent 60%);
}

/* чтобы контент был поверх подсветки */
.container,
.cardWrap,
.card {
  position: relative;
  z-index: 1;
}

.lead {
  font-size: 18px;
  line-height: 1.7;
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
  width: 21px;
  height: 28px;
  transform: translateY(2px);
}

/* ✅ контейнер */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: center;
}

/* ✅ поднимаем карточку */
.cardWrap {
  width: 100%;
  display: flex;
  justify-content: center;
  transform: translateY(-60px);
}

/* ✅ карточка */
.card {
  width: min(1600px, 100%);
  margin: 0 auto;

  border-radius: 28px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.12);
  overflow: visible;

  transform: translateY(10px);
  opacity: 0;
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.card.is-visible {
  transform: translateY(0);
  opacity: 1;
}

/* ✅ ГЛАВНЫЙ FIX: чтобы на телефоне ничего не “вылазило” */
.grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 32px;
  padding: clamp(20px, 3vw, 40px);
}

.left,
.right {
  min-width: 0;
}

/* ТЕКСТ переносится */
.title,
.lead,
.text,
.infoText,
.bCard p,
.ctaText {
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
}

/* LEFT */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(178, 74, 74, 0.12);
  color: #7c2f2f;
  font-weight: 800;
  margin: 0 0 16px;
}



.title {
  font-size: clamp(32px, 3.4vw, 58px);
  line-height: 1.05;
  margin: 0 0 14px;
  color: #121212;
  letter-spacing: -0.02em;
}

.accent {
  color: #b24a4a;
}

.lead {
  font-size: clamp(16px, 1.25vw, 20px);
  line-height: 1.6;
  margin: 0 0 12px;
  color: rgba(0, 0, 0, 0.86);
}

.text {
  font-size: clamp(15px, 1.15vw, 18px);
  line-height: 1.65;
  margin: 0 0 18px;
  color: rgba(0, 0, 0, 0.78);
}

.info {
  display: grid;
  gap: 12px;
  margin: 10px 0 18px;
}

.infoRow {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  padding: 12px 14px;
}

.infoBody {
  min-width: 0;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 6px;
  background: #b24a4a;
  box-shadow: 0 0 0 6px rgba(178, 74, 74, 0.12);
  flex: 0 0 auto;
}

.infoTitle {
  font-weight: 900;
  margin-bottom: 2px;
  color: #121212;
}

.infoText {
  color: rgba(0, 0, 0, 0.78);
}

.actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.btn {
  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 14px 22px;
  font-weight: 800;
  font-size: 15px;
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
  background: rgba(0, 0, 0, 0.08);
  color: #111;
}

.btn:hover {
  transform: translateY(-1px);
  background: rgba(0, 0, 0, 0.12);
}

.btn.primary {
  background: #b24a4a;
  color: #fff;
  box-shadow: 0 10px 24px rgba(178, 74, 74, 0.26);
}

.btn.primary:hover {
  background: #933737;
}

/* RIGHT */
.right {
  display: grid;
  gap: 16px;
  align-content: start;
  justify-items: center;
}

/* круг */
.photoWrap {
  position: relative;
  width: min(460px, 100%);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  overflow: hidden;

  border: 1px solid rgba(0, 0, 0, 0.10);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.18);
  background: #fff;
}

.photo {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.glow {
  position: absolute;
  inset: 6px;
  background: radial-gradient(circle at 10% 10%, rgba(178, 74, 74, 0.22), transparent 15%);
  pointer-events: none;
}

.mini {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.miniItem {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 18px;
  padding: 14px;
  text-align: center;

  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.miniNum {
  font-weight: 900;
  font-size: 20px;
  color: #b24a4a;
}

.miniTxt {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.25;
  color: rgba(0, 0, 0, 0.70);
}

/* BOTTOM */
.bottom {
  padding: 0 clamp(20px, 3vw, 40px) 28px;
  margin-top: 6px;
}

.bottomTitle {
  font-size: clamp(24px, 2.1vw, 36px);
 
  color: #121212;
  font-weight: 900;
 
  margin: 12px 0 12px;


}

.bottomGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.bCard {
  border-radius: 20px;
  padding: 18px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.bCard h3 {
  margin: 0 0 8px;
  color: #121212;
  font-weight: 800;
}

.bCard p {
  margin: 0;
  color: rgba(0, 0, 0, 0.78);
  line-height: 1.6;
}

.cta {
  margin-top: 12px;
  border-radius: 22px;
  padding: 14px;
  background: rgba(178, 74, 74, 0.10);
  border: 1px solid rgba(178, 74, 74, 0.20);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;


}

.ctaLeft {
  min-width: 0;
}

.ctaTitle {
  font-weight: 900;
  color: #121212;
}

.ctaText {
  color: rgba(0, 0, 0, 0.75);
  margin-top: 2px;
}

/* ✅ responsive */
@media (max-width: 980px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .mini {
    grid-template-columns: 1fr;
  }

  .photoWrap {
    width: min(360px, 92vw);
  }

  .bottomGrid {
    grid-template-columns: 1fr;
  }

  .cta {
    flex-direction: column;
    align-items: stretch;
  }

  .cardWrap {
    transform: translateY(-20px);
  }
}

/* ✅ Мобилка: ничего не выпирает */
@media (max-width: 520px) {
  .card {
    width: calc(100% - 24px);
    border-radius: 22px;
  }

  .grid {
    padding: 16px;
    gap: 18px;
  }

  .photoWrap {
    width: auto;
    transform: none;
  }

  .mini {
    width: 100%;
    gap: 10px;
  }

  .miniItem {
    width: 100%;
    max-width: 100%;
  }

  .title,
  .lead,
  .text,
  .infoText {
    word-break: break-word;
    overflow-wrap: anywhere;
  }
}

</style>

