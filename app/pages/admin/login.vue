<template>
    <div class="page">
        <div class="card">
            <h1 class="title">Admin</h1>
            <p class="sub">Вход в панель заказов</p>

            <label class="label">
                Login
                <input v-model="login" class="input" placeholder="admin" autocomplete="username" @input="error = ''"
                    @keyup.enter="doLogin" />
            </label>

            <label class="label">
                Password
                <div class="passWrap">
                    <input v-model="password" class="input pr" :type="passwordType" placeholder="********"
                        autocomplete="current-password" @input="error = ''" @keyup.enter="doLogin" />

                    <!-- 👁 держишь — видно, отпустил — скрыто -->
                    <button class="eyeBtn" type="button" aria-label="Показать пароль" @pointerdown="showPassword = true"
                        @pointerup="showPassword = false" @pointercancel="showPassword = false"
                        @pointerleave="showPassword = false">
                        <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor"
                                stroke-width="2" stroke-linejoin="round" />
                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="2" />
                        </svg>

                        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 3l18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M10.6 10.6A2.5 2.5 0 0 0 13.4 13.4" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" />
                            <path d="M9.88 5.08A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a18.2 18.2 0 0 1-4.1 5.2"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M6.1 6.1C3.7 8.1 2 12 2 12s3.5 7 10 7c1.1 0 2.1-.2 3.1-.5" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" />
                        </svg>
                    </button>
                </div>

                <div class="hint">Минимум 8 символов</div>
            </label>

            <button class="btn" type="button" @click="doLogin" :disabled="pending">
                {{ pending ? "..." : "Войти" }}
            </button>

            <p v-if="error" class="error">{{ error }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
useHead({ title: "Admin login" })

const login = ref("")
const password = ref("")
const error = ref("")
const pending = ref(false)

const showPassword = ref(false)
const passwordType = computed(() => (showPassword.value ? "text" : "password"))

onMounted(async () => {
    try {
        const me = await $fetch<{ ok: boolean }>("/api/admin/me", { credentials: "include" })
        if (me.ok) navigateTo("/admin/orders")
    } catch {
        // ignore
    }
})

async function doLogin() {
    error.value = ""

    if (password.value.length < 8) {
        error.value = "Пароль должен быть минимум 8 символов"
        return
    }

    pending.value = true
    try {
        await $fetch("/api/admin/login", {
            method: "POST",
            credentials: "include",
            body: { login: login.value, password: password.value },
        })
        navigateTo("/admin/orders")
    } catch (e: any) {
        error.value = "Неверный логин или пароль"
    } finally {
        pending.value = false
        showPassword.value = false
    }
}
</script>

<style scoped>
.page {
    min-height: 100vh;
    padding: 140px 18px 64px;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    background: linear-gradient(180deg, #fff 0%, #fbf5f1 45%, #f5ede8 100%);
}

.card {
    max-width: 420px;
    margin: 0 auto;
    border-radius: 22px;
    padding: 18px;
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(80, 55, 48, 0.12);
    box-shadow: 0 18px 50px rgba(32, 18, 14, 0.1);
    backdrop-filter: blur(10px);
}

.title {
    margin: 0;
    font-size: 24px;
    letter-spacing: -0.01em;
}

.sub {
    margin: 6px 0 14px;
    opacity: 0.75;
}

.label {
    display: grid;
    gap: 6px;
    margin-top: 10px;
    font-weight: 700;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.75);
}

.input {
    width: 100%;
    padding: 12px 12px;
    border-radius: 14px;
    border: 1px solid rgba(80, 55, 48, 0.18);
    background: rgba(255, 255, 255, 0.7);
    outline: none;
    box-sizing: border-box;
}

.passWrap {
    position: relative;
}

.input.pr {
    padding-right: 44px;
}

.eyeBtn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: 1px solid rgba(80, 55, 48, 0.12);
    background: rgba(255, 255, 255, 0.65);
    display: grid;
    place-items: center;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.65);
}

.eyeBtn:active {
    transform: translateY(-50%) scale(0.98);
}

.hint {
    font-size: 12px;
    opacity: 0.65;
    font-weight: 700;
}

.btn {
    margin-top: 14px;
    width: 100%;
    border: none;
    cursor: pointer;
    border-radius: 999px;
    padding: 14px 16px;
    font-weight: 900;
    background: #b24a4a;
    color: #fff;
    box-shadow: 0 10px 24px rgba(178, 74, 74, 0.26);
}

.btn:hover {
    background: #933737;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error {
    margin-top: 10px;
    color: #b00020;
    font-weight: 800;
}
</style>
