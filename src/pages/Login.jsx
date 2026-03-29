import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleContinue = (event) => {
    event.preventDefault();
    navigate("/home");
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 px-6 py-10 flex items-center">
      <form
        onSubmit={handleContinue}
        className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5"
      >
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t("login.title")}</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">{t("login.subtitle")}</p>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("login.phoneLabel")}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("login.phonePlaceholder")}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("login.otpLabel")}
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder={t("login.otpPlaceholder")}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[#0D6D5D] text-white py-3.5 font-black tracking-wide active:scale-[0.98] transition-all"
        >
          {t("login.continue")}
        </button>
      </form>
    </div>
  );
}
