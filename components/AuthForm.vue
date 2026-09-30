<script setup lang="ts">
const props = defineProps<{
  mode: "signin" | "signup";
  busy?: boolean;
  error?: string;
}>();
const emit = defineEmits<{
  submit: [payload: { email: string; password: string }];
}>();
const form = reactive({ email: "", password: "" });
const signup = computed(() => props.mode === "signup");
</script>
<template>
  <div class="card auth-card">
    <form @submit.prevent="$emit('submit', { ...form })">
      <div>
        <h1>{{ signup ? "Crea il workspace" : "Bentornato" }}</h1>
        <p class="muted">
          {{
            signup
              ? "Configurerai LLM e database nel passaggio seguente."
              : "Accedi al tuo workspace API."
          }}
        </p>
      </div>
      <div class="field">
        <label>Email</label
        ><input
          v-model="form.email"
          type="email"
          required
          autocomplete="email"
        />
      </div>
      <div class="field">
        <label>Password</label
        ><input
          v-model="form.password"
          type="password"
          required
          :minlength="signup ? 8 : undefined"
          :autocomplete="signup ? 'new-password' : 'current-password'"
        /><small v-if="signup" class="muted">Almeno 8 caratteri</small>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn" :disabled="busy">
        {{
          busy
            ? signup
              ? "Creazione…"
              : "Accesso…"
            : signup
              ? "Crea account"
              : "Accedi"
        }}
      </button>
      <p class="muted">
        {{ signup ? "Hai già un account?" : "Non hai un account?" }}
        <NuxtLink :to="signup ? '/auth/signin' : '/auth/signup'">{{
          signup ? "Accedi" : "Registrati"
        }}</NuxtLink>
      </p>
    </form>
  </div>
</template>
