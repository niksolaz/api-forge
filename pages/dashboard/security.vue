<script setup lang="ts">
import SecurityRuleCard from "~/components/security/SecurityRuleCard.vue";

definePageMeta({ middleware: "auth", layout: "dashboard" });
const policy = useSecurityPolicy();
const { form, notice, error, busy } = policy;
</script>
<template>
  <AppPageHeader
    eyebrow="SECURITY POLICY"
    title="Sicurezza"
    description="Definisci una base globale e le eccezioni per gruppi di endpoint."
    ><template #actions
      ><button class="btn" :disabled="busy" @click="policy.save">
        {{ busy ? "Applicazione…" : "Salva e applica" }}
      </button></template
    ></AppPageHeader
  ><AppFeedback :notice="notice" :error="error" />
  <div class="grid">
    <section class="card settings-card">
      <h2>Regole globali</h2>
      <p class="muted">
        Valgono per tutte le rotte non intercettate da un gruppo.
      </p>
      <div class="grid form-grid">
        <div class="field">
          <label>Autorizzazione predefinita</label
          ><select v-model="form.defaultAuth">
            <option value="public">Pubblica</option>
            <option value="api-key">API Key</option>
            <option value="bearer">Bearer JWT</option>
            <option value="session">Sessione</option>
          </select>
        </div>
        <div class="field">
          <label>Richieste al minuto</label
          ><input
            v-model.number="form.defaultRateLimit"
            type="number"
            min="0"
          />
        </div>
        <div class="field span-2">
          <label>Origini CORS, separate da virgola</label
          ><input v-model="form.cors" />
        </div>
        <div class="field span-2">
          <label>Content Security Policy</label
          ><textarea v-model="form.csp" rows="3" />
        </div>
      </div>
    </section>
    <section>
      <div class="section-head">
        <div>
          <h2>Gruppi di rotte</h2>
          <p class="muted">
            Il primo pattern corrispondente prevale. Usa <code>*</code> come
            wildcard.
          </p>
        </div>
        <button class="btn secondary" @click="policy.addRule">
          Aggiungi gruppo
        </button>
      </div>
      <div class="grid">
        <SecurityRuleCard
          v-for="(rule, index) in form.rules"
          :key="rule.id"
          v-model="form.rules[index]!"
          @remove="form.rules.splice(index, 1)"
        />
        <div v-if="!form.rules.length" class="card empty">
          <p>Nessun gruppo. Verranno usate le regole globali.</p>
        </div>
      </div>
    </section>
  </div>
</template>
