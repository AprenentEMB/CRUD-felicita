import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Birthday = {
  id: string;
  name: string;
  date: string | number;
  notes?: string;
};

type BirthdayApiItem = {
  _id?: string;
  id?: string;
  name?: string;
  date?: string | number;
  dateMs?: string | number;
  notes?: string;
};

type Status = {
  type: "idle" | "loading" | "error" | "success";
  message?: string;
};

type Language = "ca" | "es" | "en";

const LANGUAGE_LABELS: Record<Language, string> = {
  ca: "Català",
  es: "Español",
  en: "English",
};

const LOCALE_BY_LANGUAGE: Record<Language, string> = {
  ca: "ca-ES",
  es: "es-ES",
  en: "en-GB",
};

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  ca: {
    heroTitle: "Recorda els aniversaris",
    heroSubtitle:
      "Una app neta i ràpida per guardar aniversaris i no oblidar cap data important.",
    logout: "Tancar sessió",
    access: "Accés",
    addBirthday: "Afegir aniversari",
    sectionNoteAuthed: "Afegeix un nom i una data. Les notes són opcionals.",
    sectionNoteGuest: "Inicia sessió o crea un compte per començar.",
    name: "Nom",
    email: "Email",
    password: "Contrasenya",
    date: "Data",
    notes: "Notes",
    login: "Entrar",
    register: "Crear compte",
    noAccount: "No tens compte?",
    haveAccount: "Ja tens compte?",
    switchRegister: "Registra’t",
    switchLogin: "Inicia sessió",
    placeholderName: "Maria Solé",
    placeholderEmail: "maria@email.com",
    placeholderPassword: "••••••••",
    placeholderBirthdayName: "Name",
    placeholderNotes: "Li agrada la xocolata negra",
    saveBirthday: "Guardar aniversari",
    listTitle: "Properes felicitacions",
    listNote: "Ordenades per la data més propera.",
    loading: "Carregant...",
    empty: "Encara no tens aniversaris guardats.",
    loginToStart: "Inicia sessió per començar a guardar aniversaris.",
    delete: "Eliminar",
    closest: "Més proper",
    today: "Avui",
    thisWeek: "Aquesta setmana",
    nextMonth: "Mes vinent",
    statusLoginSuccess: "Sessió iniciada ✅",
    statusRegisterSuccess: "Compte creat. Ara inicia sessió ✅",
    statusInvalidResponse: "Resposta incorrecta del servidor.",
    statusAuthError: "No hem pogut autenticar-te.",
    statusInvalidDate: "Data no vàlida.",
    statusBirthdaySaved: "Aniversari desat 🎉",
    statusBirthdaySaveError: "No hem pogut desar l’aniversari.",
    statusBirthdayDeleteSuccess: "Aniversari eliminat.",
    statusBirthdayDeleteError: "No hem pogut eliminar l’aniversari.",
    statusBirthdayLoadError: "No hem pogut carregar els aniversaris.",
  },
  es: {
    heroTitle: "Recuerda los cumpleaños",
    heroSubtitle:
      "Una app limpia y rápida para guardar cumpleaños y no olvidar ninguna fecha importante.",
    logout: "Cerrar sesión",
    access: "Acceso",
    addBirthday: "Añadir cumpleaños",
    sectionNoteAuthed: "Añade un nombre y una fecha. Las notas son opcionales.",
    sectionNoteGuest: "Inicia sesión o crea una cuenta para empezar.",
    name: "Nombre",
    email: "Email",
    password: "Contraseña",
    date: "Fecha",
    notes: "Notas",
    login: "Entrar",
    register: "Crear cuenta",
    noAccount: "¿No tienes cuenta?",
    haveAccount: "¿Ya tienes cuenta?",
    switchRegister: "Regístrate",
    switchLogin: "Inicia sesión",
    placeholderName: "Nombre",
    placeholderEmail: "maria@email.com",
    placeholderPassword: "••••••••",
    placeholderBirthdayName: "Arnau Pujol",
    placeholderNotes: "Le gusta el chocolate negro",
    saveBirthday: "Guardar cumpleaños",
    listTitle: "Próximas felicitaciones",
    listNote: "Ordenadas por la fecha más cercana.",
    loading: "Cargando...",
    empty: "Aún no tienes cumpleaños guardados.",
    loginToStart: "Inicia sesión para empezar a guardar cumpleaños.",
    delete: "Eliminar",
    closest: "Más cercano",
    today: "Hoy",
    thisWeek: "Esta semana",
    nextMonth: "El mes que viene",
    statusLoginSuccess: "Sesión iniciada ✅",
    statusRegisterSuccess: "Cuenta creada. Ahora inicia sesión ✅",
    statusInvalidResponse: "Respuesta incorrecta del servidor.",
    statusAuthError: "No hemos podido autenticarte.",
    statusInvalidDate: "Fecha no válida.",
    statusBirthdaySaved: "Cumpleaños guardado 🎉",
    statusBirthdaySaveError: "No hemos podido guardar el cumpleaños.",
    statusBirthdayDeleteSuccess: "Cumpleaños eliminado.",
    statusBirthdayDeleteError: "No hemos podido eliminar el cumpleaños.",
    statusBirthdayLoadError: "No hemos podido cargar los cumpleaños.",
  },
  en: {
    heroTitle: "Remember birthdays",
    heroSubtitle:
      "A clean, fast app to save birthdays and never miss an important date.",
    logout: "Log out",
    access: "Access",
    addBirthday: "Add birthday",
    sectionNoteAuthed: "Add a name and a date. Notes are optional.",
    sectionNoteGuest: "Log in or create an account to get started.",
    name: "Name",
    email: "Email",
    password: "Password",
    date: "Date",
    notes: "Notes",
    login: "Log in",
    register: "Create account",
    noAccount: "Don’t have an account?",
    haveAccount: "Already have an account?",
    switchRegister: "Sign up",
    switchLogin: "Log in",
    placeholderName: "Name",
    placeholderEmail: "email@example.com",
    placeholderPassword: "••••••••",
    placeholderBirthdayName: "Name",
    placeholderNotes: "Loves dark chocolate",
    saveBirthday: "Save birthday",
    listTitle: "Upcoming celebrations",
    listNote: "Sorted by the closest date.",
    loading: "Loading...",
    empty: "You don’t have any birthdays yet.",
    loginToStart: "Log in to start saving birthdays.",
    delete: "Delete",
    closest: "Closest",
    today: "Today",
    thisWeek: "This week",
    nextMonth: "Next month",
    statusLoginSuccess: "Logged in ✅",
    statusRegisterSuccess: "Account created. Now log in ✅",
    statusInvalidResponse: "Invalid server response.",
    statusAuthError: "We couldn’t authenticate you.",
    statusInvalidDate: "Invalid date.",
    statusBirthdaySaved: "Birthday saved 🎉",
    statusBirthdaySaveError: "We couldn’t save the birthday.",
    statusBirthdayDeleteSuccess: "Birthday deleted.",
    statusBirthdayDeleteError: "We couldn’t delete the birthday.",
    statusBirthdayLoadError: "We couldn’t load birthdays.",
  },
};

const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

function App() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("felicita_token"),
  );
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("felicita_language") as Language) || "ca",
  );
  const [authForm, setAuthForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [form, setForm] = useState({ name: "", date: "", notes: "" });
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [loadingBirthdays, setLoadingBirthdays] = useState(false);

  const isAuthed = Boolean(token);
  const t = (key: string) => TRANSLATIONS[language][key] ?? key;

  const apiRequest = async (path: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Error de servidor");
    }

    if (response.status === 204) return null;
    return response.json();
  };

  const normalizeBirthday = (item: BirthdayApiItem): Birthday => ({
    id: item?._id ?? item?.id ?? crypto.randomUUID(),
    name: item?.name ?? "",
    date: item?.date ?? item?.dateMs ?? "",
    notes: item?.notes,
  });

  const loadBirthdays = async () => {
    if (!token) return;
    setLoadingBirthdays(true);
    try {
      const data = await apiRequest("/api/birthdays");
      setBirthdays(Array.isArray(data) ? data.map(normalizeBirthday) : []);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : t("statusBirthdayLoadError"),
      });
    } finally {
      setLoadingBirthdays(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadBirthdays();
    } else {
      setBirthdays([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    localStorage.setItem("felicita_language", language);
    if (token) {
      apiRequest("/api/auth/me/language", {
        method: "PATCH",
        body: JSON.stringify({ language }),
      }).catch(() => {
        // Silent fail: keep local selection
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, token]);

  const getMonthDay = (value: string | number) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return { month: null, day: null };
    return { month: date.getUTCMonth(), day: date.getUTCDate() };
  };

  const formatShortDate = (value: string | number) => {
    const { month, day } = getMonthDay(value);
    if (month === null || day === null) return "";
    const displayDate = new Date(Date.UTC(2000, month, day));
    return new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE[language], {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    }).format(displayDate);
  };

  const upcomingBirthdays = useMemo(() => {
    const today = new Date();
    const nextMonth = (today.getMonth() + 1) % 12;
    const withNext = birthdays.map((birthday) => {
      const { month, day } = getMonthDay(birthday.date);
      if (month === null || day === null) {
        return {
          ...birthday,
          next: new Date(8640000000000000),
          isNextMonth: false,
          sortKey: 99999,
        };
      }
      const next = new Date(today.getFullYear(), month, day);
      if (next < today) next.setFullYear(today.getFullYear() + 1);
      const isNextMonth = next.getMonth() === nextMonth;
      const sortKey = month * 31 + day;
      return { ...birthday, next, isNextMonth, sortKey };
    });

    return withNext.sort((a, b) => a.sortKey - b.sortKey).map((item) => item);
  }, [birthdays]);

  const getClosestLabel = (nextDate: Date) => {
    const today = new Date();
    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const targetMidnight = new Date(
      nextDate.getFullYear(),
      nextDate.getMonth(),
      nextDate.getDate(),
    );
    const diffMs = targetMidnight.getTime() - todayMidnight.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return t("today");
    if (diffDays <= 7) return t("thisWeek");
    return t("closest");
  };

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus({ type: "loading" });

    try {
      const payload =
        authMode === "login"
          ? { email: authForm.email, password: authForm.password }
          : {
              username: authForm.username,
              email: authForm.email,
              password: authForm.password,
              language,
            };

      const data = await apiRequest(`/api/auth/${authMode}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (data?.token) {
        localStorage.setItem("felicita_token", data.token);
        setToken(data.token);
        if (data?.user?.language) {
          setLanguage(data.user.language as Language);
        }
        setStatus({ type: "success", message: t("statusLoginSuccess") });
        setAuthForm({ username: "", email: "", password: "" });
      } else if (authMode === "register") {
        setStatus({
          type: "success",
          message: t("statusRegisterSuccess"),
        });
        setAuthMode("login");
        setAuthForm({ username: "", email: "", password: "" });
      } else {
        setStatus({
          type: "error",
          message: t("statusInvalidResponse"),
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : t("statusAuthError"),
      });
    }
  };

  const handleAddBirthday = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus({ type: "loading" });

    try {
      const timestamp = new Date(form.date).getTime();
      if (Number.isNaN(timestamp)) {
        setStatus({ type: "error", message: t("statusInvalidDate") });
        return;
      }

      const payload = {
        name: form.name,
        date: timestamp,
        notes: form.notes,
      };

      const data = await apiRequest("/api/birthdays", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const created: Birthday = data
        ? normalizeBirthday(data)
        : {
            id: crypto.randomUUID(),
            ...payload,
          };

      setBirthdays((prev) => [created, ...prev]);
      setForm({ name: "", date: "", notes: "" });
      setStatus({ type: "success", message: t("statusBirthdaySaved") });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : t("statusBirthdaySaveError"),
      });
    }
  };

  const handleDeleteBirthday = async (id: string) => {
    setStatus({ type: "loading" });
    try {
      await apiRequest(`/api/birthdays/${id}`, { method: "DELETE" });
      setBirthdays((prev) => prev.filter((item) => item.id !== id));
      setStatus({ type: "success", message: t("statusBirthdayDeleteSuccess") });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : t("statusBirthdayDeleteError"),
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("felicita_token");
    setToken(null);
    setStatus({ type: "idle" });
  };

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-text">
          <p className="brand">Felicita</p>
          <h1>{t("heroTitle")}</h1>
          <p className="subtitle">{t("heroSubtitle")}</p>
        </div>
        <div className="hero-actions">
          {isAuthed ? (
            <label className="language">
              <span className="sr-only">Language</span>
              <select
                className="select"
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as Language)
                }
              >
                {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                  <option key={lang} value={lang}>
                    {LANGUAGE_LABELS[lang]}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {isAuthed ? (
            <button className="ghost" onClick={handleLogout}>
              {t("logout")}
            </button>
          ) : null}
        </div>
      </header>

      <main className="grid">
        <section className="card">
          <h2>{isAuthed ? t("addBirthday") : t("access")}</h2>
          <p className="section-note">
            {isAuthed ? t("sectionNoteAuthed") : t("sectionNoteGuest")}
          </p>
          {!isAuthed ? (
            <form
              className="form"
              onSubmit={handleAuthSubmit}
              autoComplete="off"
            >
              {authMode === "register" ? (
                <>
                  <label>
                    {t("name")}
                    <input
                      type="text"
                      name="signup-name"
                      autoComplete="new-password"
                      autoCorrect="off"
                      spellCheck={false}
                      value={authForm.username}
                      onChange={(event) =>
                        setAuthForm((prev) => ({
                          ...prev,
                          username: event.target.value,
                        }))
                      }
                      placeholder={t("placeholderName")}
                      required
                    />
                  </label>
                  <label>
                    Language
                    <select
                      className="select"
                      value={language}
                      onChange={(event) =>
                        setLanguage(event.target.value as Language)
                      }
                    >
                      {(Object.keys(LANGUAGE_LABELS) as Language[]).map(
                        (lang) => (
                          <option key={lang} value={lang}>
                            {LANGUAGE_LABELS[lang]}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                </>
              ) : null}

              <label>
                {t("email")}
                <input
                  type="email"
                  name={authMode === "login" ? "login-email" : "signup-email"}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={authForm.email}
                  onChange={(event) =>
                    setAuthForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder={t("placeholderEmail")}
                  required
                />
              </label>

              <label>
                {t("password")}
                <input
                  type="password"
                  name={
                    authMode === "login" ? "login-password" : "signup-password"
                  }
                  autoComplete="new-password"
                  value={authForm.password}
                  onChange={(event) =>
                    setAuthForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  placeholder={t("placeholderPassword")}
                  required
                />
              </label>

              <button type="submit" className="primary">
                {authMode === "login" ? t("login") : t("register")}
              </button>

              <p className="muted">
                {authMode === "login" ? t("noAccount") : t("haveAccount")}{" "}
                <button
                  type="button"
                  className="link"
                  onClick={() =>
                    setAuthMode((prev) =>
                      prev === "login" ? "register" : "login",
                    )
                  }
                >
                  {authMode === "login"
                    ? t("switchRegister")
                    : t("switchLogin")}
                </button>
              </p>
            </form>
          ) : (
            <form className="form" onSubmit={handleAddBirthday}>
              <label>
                {t("name")}
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder={t("placeholderBirthdayName")}
                  required
                />
              </label>

              <label>
                {t("date")}
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, date: event.target.value }))
                  }
                  required
                />
              </label>

              <label>
                {t("notes")}
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, notes: event.target.value }))
                  }
                  placeholder={t("placeholderNotes")}
                  rows={3}
                />
              </label>

              <button type="submit" className="primary">
                {t("saveBirthday")}
              </button>
            </form>
          )}
        </section>

        <section className="card">
          <div className="card-header">
            <h2>{t("listTitle")}</h2>
            {loadingBirthdays ? (
              <span className="pill">{t("loading")}</span>
            ) : null}
          </div>
          <p className="section-note">{t("listNote")}</p>

          {status.type !== "idle" ? (
            <p className={`status ${status.type}`}>{status.message}</p>
          ) : null}

          {isAuthed ? (
            upcomingBirthdays.length ? (
              <ul className="list">
                {upcomingBirthdays.map((birthday, index) => (
                  <li
                    key={birthday.id}
                    className={[
                      birthday.isNextMonth ? "next-month" : "",
                      index === 0 ? "closest" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div>
                      <p className="name">{birthday.name}</p>
                      <p className="meta">
                        {formatShortDate(birthday.date)}
                        {birthday.notes ? ` · ${birthday.notes}` : ""}
                      </p>
                    </div>
                    <div className="tags">
                      {index === 0
                        ? (() => {
                            const closestLabel = getClosestLabel(birthday.next);
                            return (
                              <span
                                className={`tag${closestLabel === t("today") ? " tag-today" : ""}`}
                              >
                                {closestLabel}
                              </span>
                            );
                          })()
                        : null}
                      {birthday.isNextMonth ? (
                        <span className="tag ghost-tag">{t("nextMonth")}</span>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => handleDeleteBirthday(birthday.id)}
                    >
                      {t("delete")}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty">
                <div className="empty-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 72 72"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="10" y="16" width="52" height="44" rx="10" />
                    <path d="M22 10v12M50 10v12" />
                    <path d="M10 28h52" />
                    <circle cx="36" cy="42" r="6" />
                    <path d="M36 36v6l4 4" />
                  </svg>
                </div>
                <p className="muted">{t("empty")}</p>
              </div>
            )
          ) : (
            <p className="muted">{t("loginToStart")}</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

/*

-Desplegar backend
-fer app amb Capacitor per app Store

*/
