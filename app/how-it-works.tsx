"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { Icon } from "./ui";

const steps = [
  {
    title: "Kenalkan dirimu",
    text: "Lengkapi bidang, level, dan jadwal agar teman belajar mengenal tujuanmu.",
    icon: "edit",
    href: "/dashboard/profil",
    action: "Lengkapi profil",
  },
  {
    title: "Temukan ruangmu",
    text: "Cari partner, jelajahi kelompok belajar, atau pilih kompetisi yang ingin kamu ikuti.",
    icon: "search",
    href: "/partner",
    action: "Cari partner belajar",
  },
  {
    title: "Mulai terhubung",
    text: "Kirim ajakan atau lamaran. Tinjau dan terima permintaan melalui Aktivitas.",
    icon: "users",
    href: "/dashboard/aktivitas",
    action: "Buka aktivitas",
  },
  {
    title: "Belajar bersama",
    text: "Lanjutkan diskusi lewat pesan dan catat tugas serta tanggal penting di kalender.",
    icon: "chat",
    href: "/dashboard/kalender",
    action: "Atur agenda belajar",
  },
];
export function HowItWorks() {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const select = (next: number) =>
    setIndex(Math.max(0, Math.min(steps.length - 1, next)));
  return (
    <section
      className="how-section"
      aria-labelledby="how-title"
      aria-roledescription="carousel"
    >
      <div className="container">
        <div className="how-heading">
          <div>
            <p className="section-label">Langkah demi langkah</p>
            <h2 id="how-title">Cara kerja TeamUp</h2>
          </div>
          <div className="actions">
            <button
              className="icon-button"
              aria-label="Langkah sebelumnya"
              disabled={index === 0}
              onClick={() => select(index - 1)}
            >
              <Icon name="back" />
            </button>
            <button
              className="icon-button how-next"
              aria-label="Langkah berikutnya"
              disabled={index === steps.length - 1}
              onClick={() => select(index + 1)}
            >
              <Icon name="arrow" />
            </button>
          </div>
        </div>
        <div
          className="how-window"
          tabIndex={0}
          aria-label="Langkah penggunaan TeamUp; gunakan tombol panah kiri dan kanan"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              select(index + (event.key === "ArrowRight" ? 1 : -1));
            }
          }}
          onTouchStart={(event) => {
            startX.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (startX.current !== null) {
              const change = startX.current - event.changedTouches[0].clientX;
              if (Math.abs(change) > 40) select(index + (change > 0 ? 1 : -1));
              startX.current = null;
            }
          }}
        >
          <div
            className="how-track"
            style={{
              transform: `translateX(max(calc(-1 * var(--how-last) * var(--how-step)), calc(-${index} * var(--how-step))))`,
            }}
          >
            {steps.map((step, i) => (
              <article
                key={step.title}
                className={"how-card " + (i === index ? "how-current" : "")}
                aria-label={`Langkah ${i + 1} dari ${steps.length}`}
                aria-current={i === index ? "step" : undefined}
              >
                <span className="how-number">0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <div className="how-card-bottom">
                  <span className="how-icon">
                    <Icon name={step.icon} />
                  </span>
                  <Link
                    className="text-link"
                    href={step.href}
                    tabIndex={i === index ? 0 : -1}
                  >
                    {step.action}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="how-pagination" aria-label="Pilih langkah">
          {steps.map((step, i) => (
            <button
              key={step.title}
              aria-label={`Langkah ${i + 1}: ${step.title}`}
              aria-pressed={i === index}
              onClick={() => select(i)}
            >
              0{i + 1}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Langkah {index + 1} dari 4: {steps[index].title}
        </p>
      </div>
    </section>
  );
}
