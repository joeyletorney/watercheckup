"use client";

import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  background: "#071828",
  border: "1px solid #1a3a5c",
  borderRadius: 8,
  color: "#f1f5f9",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#94a3b8",
  marginBottom: 6,
  letterSpacing: 0.5,
};

export default function ClaimUtilitiesForm() {
  const [utilityName, setUtilityName] = useState("");
  const [pwsid, setPwsid] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setStatus("loading");
    try {
      const res = await fetch("/api/utilities/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utilityName,
          pwsid,
          contactName,
          contactTitle,
          email,
          phone,
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErr(typeof data.error === "string" ? data.error : "Something went wrong.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErr("Network error. Try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        style={{
          padding: "28px 24px",
          background: "#0a2a1a",
          border: "1px solid #0f6e40",
          borderRadius: 12,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 22, marginBottom: 8 }}>✓</div>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#4ade80", margin: "0 0 10px", lineHeight: 1.5 }}>
          We&apos;ll verify your utility and set up your CCR page within 2 business days
        </p>
        <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
          If we need more information, we&apos;ll reach out at the email you provided.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <label style={labelStyle}>Utility name</label>
        <input
          required
          value={utilityName}
          onChange={(e) => setUtilityName(e.target.value)}
          style={inputStyle}
          autoComplete="organization"
        />
      </div>
      <div>
        <label style={labelStyle}>PWSID</label>
        <input
          required
          value={pwsid}
          onChange={(e) => setPwsid(e.target.value)}
          style={inputStyle}
          placeholder="e.g. CA1910223"
          autoComplete="off"
        />
      </div>
      <div>
        <label style={labelStyle}>Contact name</label>
        <input
          required
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          style={inputStyle}
          autoComplete="name"
        />
      </div>
      <div>
        <label style={labelStyle}>Title</label>
        <input value={contactTitle} onChange={(e) => setContactTitle(e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Email address</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          autoComplete="email"
        />
      </div>
      <div>
        <label style={labelStyle}>Phone number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
          autoComplete="tel"
        />
      </div>
      <div>
        <label style={labelStyle}>Message (optional)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
        />
      </div>
      {status === "error" && err && (
        <p style={{ fontSize: 13, color: "#f87171", margin: 0 }}>{err}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          padding: "14px 24px",
          border: "none",
          borderRadius: 10,
          background: status === "loading" ? "#0e6080" : "linear-gradient(135deg,#0891b2,#06b6d4)",
          color: "#fff",
          fontSize: 15,
          fontWeight: 800,
          cursor: status === "loading" ? "not-allowed" : "pointer",
          marginTop: 4,
        }}
      >
        {status === "loading" ? "Sending…" : "Submit claim →"}
      </button>
    </form>
  );
}
