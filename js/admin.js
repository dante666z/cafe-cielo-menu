const adminSupabase = getSupabaseClient();
const weekDays = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
];

function normalizeTimeForInput(value) {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 5);
}

function renderHoursGrid(hours = []) {
  const grid = document.getElementById("hoursGrid");
  if (!grid) {
    return;
  }

  const normalizedHours = Array.isArray(hours) ? hours : [];
  const hoursMap = new Map(normalizedHours.map((entry) => [Number(entry.day_of_week), entry]));

  grid.innerHTML = weekDays
    .map((day) => {
      const row = hoursMap.get(day.value) || {};
      return `
        <label class="hour-row">
          <div>
            <strong>${day.label}</strong>
            <span>Activa el día y define horario.</span>
          </div>
          <input type="checkbox" data-hour-enabled="${day.value}" ${row.is_enabled ? "checked" : ""}>
          <input type="time" data-hour-open="${day.value}" value="${normalizeTimeForInput(row.open_time)}">
          <input type="time" data-hour-close="${day.value}" value="${normalizeTimeForInput(row.close_time)}">
        </label>
      `;
    })
    .join("");
}

function syncModeVisibility() {
  const selectedMode = document.querySelector('input[name="operationMode"]:checked')?.value || "manual";
  document.getElementById("manualSettingsBlock")?.toggleAttribute("hidden", selectedMode !== "manual");
  document.getElementById("automaticSettingsBlock")?.toggleAttribute("hidden", selectedMode !== "automatic");
}

function showAdminPanel(isLoggedIn) {
  document.getElementById("adminLoginCard")?.toggleAttribute("hidden", isLoggedIn);
  document.getElementById("adminPanelCard")?.toggleAttribute("hidden", !isLoggedIn);
}

async function loadStoreSettings() {
  if (!adminSupabase) {
    return;
  }

  const { data, error } = await adminSupabase
    .from("store_settings")
    .select("id, operation_mode, manual_is_open, manual_message, delivery_enabled")
    .eq("id", 1)
    .maybeSingle();

  const { data: hoursData, error: hoursError } = await adminSupabase
    .from("store_hours")
    .select("day_of_week, is_enabled, open_time, close_time")
    .order("day_of_week", { ascending: true });

  if (hoursError) {
    await Swal.fire({
      icon: "error",
      title: "No se pudieron leer los horarios",
      text: hoursError.message,
    });
    renderHoursGrid([]);
  } else {
    renderHoursGrid(hoursData || []);
  }

  if (error) {
    return;
  }

  if (!data) {
    document.querySelectorAll('input[name="operationMode"]').forEach((input) => {
      input.checked = input.value === "manual";
    });
    document.getElementById("storeIsOpen").checked = true;
    document.getElementById("storeStatusMessage").value = "Estamos recibiendo pedidos";
    document.getElementById("deliveryEnabled").checked = false;
    syncModeVisibility();
    return;
  }

  document.querySelectorAll('input[name="operationMode"]').forEach((input) => {
    input.checked = input.value === (data.operation_mode || "manual");
  });
  document.getElementById("storeIsOpen").checked = Boolean(data.manual_is_open);
  document.getElementById("storeStatusMessage").value = data.manual_message || "";
  document.getElementById("deliveryEnabled").checked = Boolean(data.delivery_enabled);
  syncModeVisibility();
}

async function handleAdminLogin(event) {
  event.preventDefault();

  if (!adminSupabase) {
    await Swal.fire({
      icon: "error",
      title: "Falta configuración",
      text: "Primero pega tu URL y anon key de Supabase en js/supabase-config.js",
    });
    return;
  }

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;

  const { error } = await adminSupabase.auth.signInWithPassword({ email, password });

  if (error) {
    await Swal.fire({
      icon: "error",
      title: "No se pudo iniciar sesión",
      text: error.message,
    });
    return;
  }

  showAdminPanel(true);
  await loadStoreSettings();
}

async function handleAdminLogout() {
  if (!adminSupabase) {
    return;
  }

  await adminSupabase.auth.signOut();
  showAdminPanel(false);
}

async function handleSaveSettings(event) {
  event.preventDefault();

  if (!adminSupabase) {
    return;
  }

  const operationMode = document.querySelector('input[name="operationMode"]:checked')?.value || "manual";
  const isOpen = document.getElementById("storeIsOpen").checked;
  const statusMessage = document.getElementById("storeStatusMessage").value.trim();
  const deliveryEnabled = document.getElementById("deliveryEnabled").checked;
  const { data: sessionData } = await adminSupabase.auth.getUser();
  const updatedBy = sessionData?.user?.id || null;

  const settingsPayload = {
    id: 1,
    operation_mode: operationMode,
    manual_is_open: isOpen,
    manual_message: statusMessage,
    delivery_enabled: deliveryEnabled,
    is_open: isOpen,
    status_message: statusMessage,
    updated_at: new Date().toISOString(),
    updated_by: updatedBy,
  };

  const { error } = await adminSupabase
    .from("store_settings")
    .upsert(settingsPayload, { onConflict: "id" });

  if (error) {
    await Swal.fire({
      icon: "error",
      title: "No se pudo guardar",
      text: error.message,
    });
    return;
  }

  const hoursPayload = weekDays.map((day) => ({
    day_of_week: day.value,
    is_enabled: document.querySelector(`[data-hour-enabled="${day.value}"]`)?.checked || false,
    open_time: document.querySelector(`[data-hour-open="${day.value}"]`)?.value || null,
    close_time: document.querySelector(`[data-hour-close="${day.value}"]`)?.value || null,
    updated_at: new Date().toISOString(),
  }));

  const { error: hoursError } = await adminSupabase.from("store_hours").upsert(hoursPayload, { onConflict: "day_of_week" });

  if (hoursError) {
    await Swal.fire({
      icon: "error",
      title: "No se pudieron guardar los horarios",
      text: hoursError.message,
    });
    return;
  }

  await Swal.fire({
    icon: "success",
    title: "Cambios guardados",
    text: "El estado del local ya se actualizó.",
    timer: 1800,
    showConfirmButton: false,
  });
}

async function bootstrapAdmin() {
  document.getElementById("adminLoginForm")?.addEventListener("submit", handleAdminLogin);
  document.getElementById("adminSettingsForm")?.addEventListener("submit", handleSaveSettings);
  document.getElementById("adminLogoutBtn")?.addEventListener("click", handleAdminLogout);
  document.querySelectorAll('input[name="operationMode"]').forEach((input) => {
    input.addEventListener("change", syncModeVisibility);
  });

  if (!adminSupabase) {
    return;
  }

  const { data } = await adminSupabase.auth.getSession();
  const isLoggedIn = Boolean(data?.session);
  showAdminPanel(isLoggedIn);

  if (isLoggedIn) {
    await loadStoreSettings();
  }
}

bootstrapAdmin();
