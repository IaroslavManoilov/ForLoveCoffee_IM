<template>
    <div class="booking" @mousemove="onMouseMove">
        <!-- Background -->
        <div class="bg" aria-hidden="true">
            <div class="bg__warm" />
            <div class="bg__grain" />
            <div class="bg__blob bg__blob--1" />
            <div class="bg__blob bg__blob--2" />
        </div>

        <main class="wrap">
            <!-- HERO -->
            <section class="hero" :style="tiltStyle">
                <div class="hero__badge">📅 Бронь стола</div>

                <h1 class="hero__title">
                    Забронируй стол <span class="hero__accent">быстро</span> и удобно.
                </h1>

                <p class="hero__text">
                    Заполни пару полей, выбери дату и время — и бронь сразу появится в админке.
                </p>

                <div class="hero__meta">
                    <div class="chip">⏰ Режим: <b>{{ hours }}</b></div>
                    <div class="chip">📍 {{ address }}</div>
                    <div class="chip" :data-open="isOpenNow">{{ isOpenNow ? "Сейчас открыто" : "Сейчас закрыто" }}</div>
                </div>
            </section>

            <!-- PROGRESS -->
            <section class="progress">
                <button class="step" type="button" :data-on="step === 1" @click="step = 1">
                    <span class="step__n">1</span>
                    <span class="step__t">Данные</span>
                </button>

                <div class="progress__track" aria-hidden="true">
                    <div class="progress__bar" :style="{ width: progressWidth }" />
                </div>

                <button class="step" type="button" :data-on="step === 2" :disabled="!canGoStep2" @click="step = 2">
                    <span class="step__n">2</span>
                    <span class="step__t">Дата и время</span>
                </button>

                <button class="step" type="button" :data-on="step === 3" :disabled="!canGoStep3" @click="step = 3">
                    <span class="step__n">3</span>
                    <span class="step__t">Подтверждение</span>
                </button>
            </section>

            <section class="grid">
                <!-- LEFT: Form -->
                <article class="card">
                    <div class="card__head">
                        <h2 class="card__title">Бронирование</h2>
                        <p class="card__subtitle">Подскажем, что не заполнено. Всё прозрачно.</p>
                    </div>

                    <!-- STEP 1 -->
                    <div v-if="step === 1" class="panel">
                        <div class="row">
                            <div class="field">
                                <label class="label" for="name">Имя *</label>
                                <input id="name" v-model.trim="form.name" class="input" type="text"
                                    placeholder="Например: Ярослав" :class="{ 'is-error': !!errors.name }"
                                    autocomplete="name" />
                                <p v-if="errors.name" class="error">{{ errors.name }}</p>
                            </div>

                            <div class="field">
                                <label class="label" for="phone">Телефон *</label>
                                <input id="phone" v-model.trim="form.phone" class="input" type="tel" inputmode="tel"
                                    placeholder="Например: +373 68 514 544" :class="{ 'is-error': !!errors.phone }"
                                    autocomplete="tel" />
                                <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="field">
                                <label class="label">Гостей *</label>
                                <div class="counter">
                                    <button class="counter__btn" type="button" @click="decGuests"
                                        :disabled="form.guests <= 1">−</button>
                                    <div class="counter__val">{{ form.guests }}</div>
                                    <button class="counter__btn" type="button" @click="incGuests"
                                        :disabled="form.guests >= 12">+</button>
                                </div>
                                <p class="hint">До 12 человек. Если больше — напиши в комментарии.</p>
                                <p v-if="errors.guests" class="error">{{ errors.guests }}</p>
                            </div>

                            <div class="field">
                                <label class="label">Предпочтение</label>
                                <div class="pills">
                                    <button v-for="p in preferences" :key="p" type="button" class="pill"
                                        :data-on="form.preference === p" @click="form.preference = p">
                                        {{ p }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label" for="notes">Комментарий</label>
                            <textarea id="notes" v-model.trim="form.notes" class="input textarea" rows="3"
                                placeholder="Например: стол у окна / день рождения / детский стул" />
                        </div>

                        <div class="actions">
                            <button class="btn btn--primary" type="button" @click="goStep2">Дальше →</button>
                            <button class="btn btn--ghost" type="button" @click="resetAll">Сброс</button>
                        </div>
                    </div>

                    <!-- STEP 2 -->
                    <div v-else-if="step === 2" class="panel">
                        <div class="row">
                            <div class="field">
                                <label class="label" for="date">Дата *</label>
                                <input id="date" v-model="form.date" class="input" type="date" :min="minDate"
                                    :max="maxDate" :class="{ 'is-error': !!errors.date }" />
                                <p v-if="errors.date" class="error">{{ errors.date }}</p>
                            </div>

                            <div class="field">
                                <label class="label">Длительность</label>
                                <div class="pills">
                                    <button v-for="d in durations" :key="d.value" type="button" class="pill"
                                        :data-on="form.durationMin === d.value" @click="form.durationMin = d.value">
                                        {{ d.label }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Время *</label>

                            <div v-if="!form.date" class="empty">Сначала выбери дату.</div>

                            <div v-else class="slots">
                                <button v-for="t in timeSlots" :key="t.value" class="slot" type="button"
                                    :disabled="t.disabled" :data-on="form.time === t.value"
                                    @click="form.time = t.value">
                                    {{ t.label }}
                                </button>
                            </div>

                            <p v-if="errors.time" class="error">{{ errors.time }}</p>
                            <p class="hint">Слоты каждые 30 минут. Прошедшее время блокируется.</p>
                        </div>

                        <div class="actions">
                            <button class="btn btn--ghost" type="button" @click="step = 1">← Назад</button>
                            <button class="btn btn--primary" type="button" @click="goStep3">Дальше →</button>
                        </div>
                    </div>

                    <!-- STEP 3 -->
                    <div v-else class="panel">
                        <div class="confirmBox">
                            <div class="confirmBox__title">Проверь и подтверди</div>
                            <div class="confirmBox__text">
                                Бронь появится в админке в разделе <b>/admin/orders</b>.
                            </div>

                            <label class="consent">
                                <input v-model="form.consent" type="checkbox" />
                                <span>Согласен на использование данных только для брони.</span>
                            </label>
                            <p v-if="errors.consent" class="error">{{ errors.consent }}</p>

                            <div class="actions">
                                <button class="btn btn--ghost" type="button" @click="step = 2" :disabled="loading">←
                                    Назад</button>

                                <button class="btn btn--primary" type="button" @click="submit" :disabled="loading">
                                    {{ loading ? "Отправляем..." : "Подтвердить ✅" }}
                                </button>
                            </div>

                            <div v-if="lastId" class="success">
                                <div class="success__t">Отправлено ✅</div>
                                <div class="success__s">ID брони: <b>{{ lastId }}</b></div>
                                <div class="success__a">
                                    <NuxtLink class="btn btn--soft" to="/admin/orders">Открыть админ →</NuxtLink>
                                    <button class="btn btn--ghost" type="button" @click="resetAll">Новая бронь</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                <!-- RIGHT: Sticky Summary -->
                <aside class="card side">
                    <div class="card__head">
                        <h2 class="card__title">Резюме</h2>
                        <p class="card__subtitle">Предпросмотр</p>
                    </div>

                    <div class="summary">
                        <div class="sumRow"><span class="k">Имя</span><span class="v">{{ form.name || "—" }}</span>
                        </div>
                        <div class="sumRow"><span class="k">Телефон</span><span class="v">{{ form.phone || "—" }}</span>
                        </div>
                        <div class="sumRow"><span class="k">Гостей</span><span class="v">{{ form.guests }}</span></div>
                        <div class="sumRow"><span class="k">Дата</span><span class="v">{{ prettyDate || "—" }}</span>
                        </div>
                        <div class="sumRow"><span class="k">Время</span><span class="v">{{ form.time || "—" }}</span>
                        </div>
                        <div class="sumRow"><span class="k">Длительность</span><span class="v">{{ form.durationMin }}
                                мин</span></div>
                        <div class="sumRow"><span class="k">Предпочтение</span><span class="v">{{ form.preference || "—"
                                }}</span></div>

                        <div v-if="form.notes" class="sumNote">
                            <div class="k">Комментарий</div>
                            <div class="v">{{ form.notes }}</div>
                        </div>
                    </div>

                    <div class="divider" />

                    <div class="miniInfo">
                        <div class="miniInfo__item">🕒 Держим стол 10 минут после времени брони.</div>
                        <div class="miniInfo__item">📞 Если планы изменились — позвони.</div>
                    </div>

                    <div class="divider" />

                    <div class="quick">
                        <a class="btn btn--soft" :href="telHref">Позвонить</a>
                        <a class="btn btn--ghost" :href="mapsHref" target="_blank" rel="noopener">Карта</a>
                    </div>
                </aside>
            </section>
        </main>

        <!-- TOAST -->
        <div class="toast" :data-show="toast.show" role="status" aria-live="polite">
            <span class="toast__dot" aria-hidden="true" />
            {{ toast.text }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onBeforeUnmount } from "vue";

useHead({
    title: "Бронь — For Love Coffee",
    meta: [{ name: "description", content: "Бронирование стола: быстро, логично, в 3 шага. Сразу попадает в админку." }],
});

/** CONFIG */
const address = "Chișinău, ул. Кофейная, 15";
const phonePretty = "+373 68 514 544";
const hours = "09:00 – 22:00";
const SLOT_STEP_MIN = 30;

const preferences = ["любой", "у окна", "внутри", "терраса", "тихо", "работа/ноутбук"];
const durations = [
    { value: 60, label: "1 час" },
    { value: 90, label: "1ч 30м" },
    { value: 120, label: "2 часа" },
];

/** LINKS */
const telHref = computed(() => `tel:${phonePretty.replace(/[^\d+]/g, "")}`);
const mapsHref = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);

/** OPEN NOW */
function parseHoursRange(h: string): { startMin: number; endMin: number } | null {
    const m = h.match(/(\d{2}):(\d{2}).*?(\d{2}):(\d{2})/);
    if (!m) return null;

    // ✅ фиксим TS: элементы match могут считаться string | undefined
    const startMin = Number(m[1]!) * 60 + Number(m[2]!);
    const endMin = Number(m[3]!) * 60 + Number(m[4]!);

    if (Number.isNaN(startMin) || Number.isNaN(endMin)) return null;
    return { startMin, endMin };
}

const isOpenNow = computed(() => {
    const range = parseHoursRange(hours);
    if (!range) return false;
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    return minutes >= range.startMin && minutes <= range.endMin;
});

/** DATE HELPERS */
const pad2 = (n: number) => String(n).padStart(2, "0");
const toISODate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 86400000);

const today = new Date();
const minDate = computed(() => toISODate(today));
const maxDate = computed(() => toISODate(addDays(today, 30)));

const prettyDate = computed(() => {
    if (!form.date) return "";
    const [yRaw, mRaw, dRaw] = form.date.split("-");
    const y = Number(yRaw);
    const m = Number(mRaw);
    const d = Number(dRaw);
    if ([y, m, d].some((n) => Number.isNaN(n))) return "";
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("ru-RU", { weekday: "long", year: "numeric", month: "long", day: "2-digit" });
});

function isPastSlot(dateISO: string, hhmm: string) {
    const [hhRaw, mmRaw] = hhmm.split(":");
    const hh = Number(hhRaw);
    const mm = Number(mmRaw);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return false;

    const [yRaw, mRaw, dRaw] = dateISO.split("-");
    const y = Number(yRaw);
    const mo = Number(mRaw);
    const d = Number(dRaw);
    if ([y, mo, d].some((n) => Number.isNaN(n))) return false;

    const slot = new Date(y, mo - 1, d, hh, mm, 0, 0);
    return slot.getTime() < Date.now();
}

/** FORM */
type BookingForm = {
    name: string;
    phone: string;
    guests: number;
    preference: string;
    notes: string;
    date: string;
    time: string;
    durationMin: number;
    consent: boolean;
};

const form = reactive<BookingForm>({
    name: "",
    phone: "",
    guests: 2,
    preference: "любой",
    notes: "",
    date: "",
    time: "",
    durationMin: 90,
    consent: true,
});

const errors = reactive<Record<string, string>>({});
const loading = ref(false);
const lastId = ref<string>("");

/** STEPS */
const step = ref<1 | 2 | 3>(1);
const progressWidth = computed(() => (step.value === 1 ? "0%" : step.value === 2 ? "50%" : "100%"));

const canGoStep2 = computed(() => !!form.name && isPhoneValid(form.phone) && form.guests >= 1);
const canGoStep3 = computed(() => canGoStep2.value && !!form.date && !!form.time);

function incGuests() {
    form.guests = Math.min(12, form.guests + 1);
}
function decGuests() {
    form.guests = Math.max(1, form.guests - 1);
}

function clearErrors() {
    Object.keys(errors).forEach((k) => delete errors[k]);
}

function isPhoneValid(p: string) {
    const digits = p.replace(/[^\d+]/g, "");
    return digits.length >= 8;
}

function validateStep1() {
    clearErrors();
    if (!form.name || form.name.trim().length < 2) errors.name = "Введи имя (минимум 2 символа).";
    if (!isPhoneValid(form.phone)) errors.phone = "Некорректный номер телефона.";
    if (!form.guests || form.guests < 1) errors.guests = "Выбери количество гостей.";
    return Object.keys(errors).length === 0;
}

function validateStep2() {
    clearErrors();
    if (!form.date) errors.date = "Выбери дату.";
    if (!form.time) errors.time = "Выбери время.";
    if (form.date && form.time && isPastSlot(form.date, form.time)) errors.time = "Это время уже прошло.";
    return Object.keys(errors).length === 0;
}

function validateStep3() {
    clearErrors();
    if (!form.consent) errors.consent = "Поставь галочку согласия.";
    return Object.keys(errors).length === 0;
}

function goStep2() {
    if (!validateStep1()) {
        showToast("Проверь данные.");
        return;
    }
    step.value = 2;
}

function goStep3() {
    if (!validateStep2()) {
        showToast("Выбери дату и время.");
        return;
    }
    step.value = 3;
}

/** TIME SLOTS */
const timeSlots = computed(() => {
    const range = parseHoursRange(hours);
    if (!range || !form.date) return [];

    const out: Array<{ value: string; label: string; disabled: boolean }> = [];
    const lastStart = range.endMin - SLOT_STEP_MIN;

    for (let t = range.startMin; t <= lastStart; t += SLOT_STEP_MIN) {
        const hh = Math.floor(t / 60);
        const mm = t % 60;
        const value = `${pad2(hh)}:${pad2(mm)}`;
        const disabled = isPastSlot(form.date, value);
        out.push({ value, label: value, disabled });
    }
    return out;
});

/** AUTO SELECT FIRST AVAILABLE ON DATE CHANGE */
watch(
    () => form.date,
    () => {
        if (!form.date) {
            form.time = "";
            return;
        }
        const first = timeSlots.value.find((x) => !x.disabled);
        if (!first) {
            form.time = "";
            return;
        }
        const current = timeSlots.value.find((x) => x.value === form.time);
        if (!current || current.disabled) form.time = first.value;
    }
);

/** SUBMIT */
async function submit() {
    if (!validateStep1() || !validateStep2() || !validateStep3()) {
        showToast("Заполни всё правильно перед подтверждением.");
        return;
    }

    loading.value = true;
    lastId.value = "";
    try {
        const res = await $fetch<{ ok: true; id: string }>("/api/bookings", {
            method: "POST",
            body: {
                name: form.name,
                phone: form.phone,
                guests: form.guests,
                preference: form.preference,
                notes: form.notes,
                date: form.date,
                time: form.time,
                durationMin: form.durationMin,
            },
        });

        lastId.value = res.id;
        showToast("Бронь отправлена ✅");
    } catch {
        showToast("Ошибка отправки. Попробуй ещё раз.");
    } finally {
        loading.value = false;
    }
}

function resetAll() {
    clearErrors();
    lastId.value = "";
    form.name = "";
    form.phone = "";
    form.guests = 2;
    form.preference = "любой";
    form.notes = "";
    form.date = "";
    form.time = "";
    form.durationMin = 90;
    form.consent = true;
    step.value = 1;
    showToast("Сброшено.");
}

/** TOAST */
const toast = reactive({ show: false, text: "" });
let toastT: ReturnType<typeof setTimeout> | null = null;
function showToast(text: string) {
    toast.text = text;
    toast.show = true;
    if (toastT) clearTimeout(toastT);
    toastT = setTimeout(() => (toast.show = false), 2000);
}
onBeforeUnmount(() => {
    if (toastT) clearTimeout(toastT);
});

/** PARALLAX TILT */
const mx = ref(0);
const my = ref(0);
function onMouseMove(e: MouseEvent) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mx.value = (e.clientX - cx) / cx;
    my.value = (e.clientY - cy) / cy;
}
const tiltStyle = computed(() => {
    const rx = (my.value * -1.2).toFixed(2);
    const ry = (mx.value * 1.2).toFixed(2);
    return { transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)` };
});
</script>

<style scoped>
/* IMPORTANT: убираем любое глобальное размытие только на этой странице */
:global(body),
:global(html),
.booking,
.booking * {
    filter: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
}

.booking {
    min-height: 100vh;
    padding: 120px 18px 64px;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    color: #241b18;
    position: relative;
    overflow: hidden;
}

.wrap {
    max-width: 1120px;
    margin: 0 auto;
}

/* BG */
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

/* HERO */
.hero {
    border-radius: 28px;
    padding: 26px 22px;
    background: rgba(255, 255, 255, 0.76);
    border: 1px solid rgba(80, 55, 48, 0.12);
    box-shadow:
        0 18px 50px rgba(32, 18, 14, 0.1),
        0 2px 0 rgba(255, 255, 255, 0.6) inset;
    transform-style: preserve-3d;
    transition: transform 160ms ease;
}

.hero__badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(196, 88, 52, 0.12);
    border: 1px solid rgba(196, 88, 52, 0.18);
    font-weight: 900;
    color: #7a3b2b;
    font-size: 13px;
}

.hero__title {
    margin: 14px 0 6px;
    font-size: clamp(34px, 4vw, 56px);
    line-height: 1.02;
    letter-spacing: -0.02em;
}

.hero__accent {
    color: #b24a4a;
    text-shadow: 0 10px 25px rgba(178, 74, 74, 0.18);
}

.hero__text {
    margin: 0;
    max-width: 78ch;
    font-size: 16px;
    line-height: 1.6;
    opacity: 0.88;
}

.hero__meta {
    margin-top: 14px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.chip {
    padding: 10px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(80, 55, 48, 0.12);
    font-weight: 900;
    font-size: 13px;
}

.chip[data-open="true"] {
    border-color: rgba(178, 74, 74, 0.22);
    background: rgba(178, 74, 74, 0.12);
}

/* PROGRESS */
.progress {
    margin-top: 14px;
    display: grid;
    grid-template-columns: 1fr auto 1fr 1fr;
    gap: 10px;
    align-items: center;
}

@media (max-width: 980px) {
    .progress {
        grid-template-columns: 1fr;
    }

    .progress__track {
        display: none;
    }
}

.progress__track {
    height: 10px;
    border-radius: 999px;
    background: rgba(80, 55, 48, 0.12);
    border: 1px solid rgba(80, 55, 48, 0.12);
    overflow: hidden;
    min-width: 160px;
}

.progress__bar {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(178, 74, 74, 0.9), rgba(196, 88, 52, 0.9));
    box-shadow: 0 10px 24px rgba(178, 74, 74, 0.18);
    transition: width 220ms ease;
}

.step {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border-radius: 18px;
    border: 1px solid rgba(80, 55, 48, 0.12);
    background: rgba(255, 255, 255, 0.74);
    cursor: pointer;
    font-weight: 900;
    transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
}

.step:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.86);
}

.step:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
}

.step__n {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(178, 74, 74, 0.12);
    border: 1px solid rgba(178, 74, 74, 0.18);
    color: #7a3b2b;
}

.step[data-on="true"] {
    border-color: rgba(178, 74, 74, 0.28);
    box-shadow: 0 12px 30px rgba(32, 18, 14, 0.08);
}

/* GRID */
.grid {
    margin-top: 14px;
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
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
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(80, 55, 48, 0.12);
    box-shadow: 0 18px 50px rgba(32, 18, 14, 0.1);
}

.card__head {
    margin-bottom: 14px;
}

.card__title {
    margin: 0;
    font-size: 22px;
    letter-spacing: -0.01em;
    color: #b24a4a;
    font-weight: 950;
}

.card__subtitle {
    margin: 6px 0 0;
    opacity: 0.78;
    line-height: 1.5;
    font-weight: 750;
}

.side {
    position: sticky;
    top: 110px;
    height: fit-content;
}

@media (max-width: 980px) {
    .side {
        position: static;
    }
}

.panel {
    display: grid;
    gap: 14px;
}

.row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

@media (max-width: 520px) {
    .row {
        grid-template-columns: 1fr;
    }
}

.field {
    display: grid;
    gap: 6px;
}

.label {
    font-weight: 950;
    font-size: 13px;
    opacity: 0.86;
}

.input {
    border-radius: 16px;
    border: 1px solid rgba(80, 55, 48, 0.14);
    background: rgba(255, 255, 255, 0.88);
    padding: 12px 14px;
    outline: none;
    font-weight: 850;
    transition: box-shadow 140ms ease, border-color 140ms ease, transform 140ms ease;
}

.input:focus {
    border-color: rgba(178, 74, 74, 0.3);
    box-shadow: 0 0 0 4px rgba(178, 74, 74, 0.1);
}

.textarea {
    resize: vertical;
}

.is-error {
    border-color: rgba(233, 68, 68, 0.55) !important;
    box-shadow: 0 0 0 4px rgba(233, 68, 68, 0.1) !important;
}

.error {
    margin: 0;
    font-size: 12px;
    font-weight: 900;
    color: rgba(233, 68, 68, 0.95);
}

.hint {
    font-size: 12px;
    font-weight: 850;
    opacity: 0.72;
}

/* counter */
.counter {
    display: grid;
    grid-template-columns: 44px 1fr 44px;
    gap: 10px;
    align-items: center;
}

.counter__btn {
    height: 44px;
    border-radius: 14px;
    border: 1px solid rgba(80, 55, 48, 0.14);
    background: rgba(255, 255, 255, 0.88);
    font-weight: 950;
    cursor: pointer;
    transition: transform 120ms ease, background 120ms ease;
}

.counter__btn:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.96);
}

.counter__btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.counter__val {
    text-align: center;
    font-weight: 950;
    font-size: 18px;
}

/* pills */
.pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.pill {
    padding: 10px 12px;
    border-radius: 999px;
    border: 1px solid rgba(80, 55, 48, 0.14);
    background: rgba(255, 255, 255, 0.84);
    font-weight: 900;
    cursor: pointer;
    transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
}

.pill:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.96);
}

.pill[data-on="true"] {
    border-color: rgba(178, 74, 74, 0.35);
    background: rgba(178, 74, 74, 0.12);
}

/* slots */
.empty {
    padding: 14px;
    border-radius: 18px;
    border: 1px dashed rgba(80, 55, 48, 0.18);
    background: rgba(255, 255, 255, 0.6);
    font-weight: 900;
    opacity: 0.8;
}

.slots {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.slot {
    padding: 10px 12px;
    border-radius: 999px;
    border: 1px solid rgba(80, 55, 48, 0.14);
    background: rgba(255, 255, 255, 0.84);
    font-weight: 950;
    cursor: pointer;
    transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
}

.slot:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.96);
}

.slot:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
}

.slot[data-on="true"] {
    border-color: rgba(178, 74, 74, 0.35);
    background: rgba(178, 74, 74, 0.14);
}

/* summary */
.summary {
    display: grid;
    gap: 10px;
}

.sumRow {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 12px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.74);
    border: 1px solid rgba(80, 55, 48, 0.1);
}

.k {
    font-weight: 900;
    opacity: 0.72;
}

.v {
    font-weight: 950;
}

.sumNote {
    padding: 12px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.74);
    border: 1px solid rgba(80, 55, 48, 0.1);
}

.divider {
    height: 1px;
    margin: 16px 0;
    background: linear-gradient(90deg, transparent, rgba(80, 55, 48, 0.16), transparent);
}

.miniInfo {
    display: grid;
    gap: 8px;
    font-weight: 850;
    opacity: 0.85;
}

.quick {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

/* confirm */
.confirmBox {
    border-radius: 20px;
    padding: 14px;
    background: rgba(178, 74, 74, 0.08);
    border: 1px solid rgba(178, 74, 74, 0.18);
}

.confirmBox__title {
    font-weight: 950;
}

.confirmBox__text {
    margin-top: 6px;
    font-weight: 850;
    opacity: 0.85;
}

.consent {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    margin-top: 12px;
    font-weight: 850;
}

.consent input {
    margin-top: 3px;
}

.success {
    margin-top: 14px;
    padding: 14px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(80, 55, 48, 0.1);
}

.success__t {
    font-weight: 950;
}

.success__s {
    margin-top: 4px;
    font-weight: 850;
    opacity: 0.85;
}

.success__a {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

/* buttons */
.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 6px;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    border-radius: 999px;
    padding: 14px 22px;
    font-weight: 950;
    font-size: 14px;
    text-decoration: none;
    transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}

.btn:hover {
    transform: translateY(-1px);
}

.btn:active {
    transform: translateY(0) scale(0.99);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
    background: rgba(163, 147, 147, 0.1);
    color: #111;
}

.btn--ghost:hover,
.btn--soft:hover {
    background: rgba(178, 74, 74, 0.12);
}

/* toast */
.toast {
    position: fixed;
    left: 18px;
    bottom: 18px;
    z-index: 50;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(80, 55, 48, 0.14);
    box-shadow: 0 14px 26px rgba(32, 18, 14, 0.1);
    opacity: 0;
    transform: translateY(10px);
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
}
</style>