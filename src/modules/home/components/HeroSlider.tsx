import React, { useEffect, useRef, useState } from "react";

export default function HeroSlider() {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const COUNTDOWN_KEY = "promo_countdown";

    let countdownDate: Date;

    const savedDate = localStorage.getItem(COUNTDOWN_KEY);

    const parsedSavedDate =
      savedDate
        ? new Date(savedDate)
        : null;

    if (
      parsedSavedDate &&
      !Number.isNaN(
        parsedSavedDate.getTime(),
      )
    ) {
      countdownDate =
        parsedSavedDate;
    } else {
      countdownDate = new Date();
      countdownDate.setDate(countdownDate.getDate() + 10);

      localStorage.setItem(COUNTDOWN_KEY, countdownDate.toISOString());
    }

    const updateTimer = () => {
      const now = Date.now();
      const distance = countdownDate.getTime() - now;

      if (distance <= 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });

        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24))
          .toString()
          .padStart(2, "0"),

        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          .toString()
          .padStart(2, "0"),

        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          .toString()
          .padStart(2, "0"),

        seconds: Math.floor((distance % (1000 * 60)) / 1000)
          .toString()
          .padStart(2, "0"),
      });
    };

    const interval = setInterval(updateTimer, 1000);

    updateTimer();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let animationFrameId: number;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = Math.random() * -0.5 - 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;

        const opacities = [0.1, 0.3, 0.5, 0.8];
        this.opacity = opacities[Math.floor(Math.random() * opacities.length)];
        this.color = `rgba(245, 176, 37, ${this.opacity})`;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.y < 0) {
          this.y = canvas!.height;
          this.x = Math.random() * canvas!.width;
        }
      }

      draw() {
        ctx!.fillStyle = this.color;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();

        if (this.size > 2 && this.opacity > 0.4) {
          ctx!.shadowBlur = 10;
          ctx!.shadowColor = "#f5b025";
        } else {
          ctx!.shadowBlur = 0;
        }
      }
    }

    const init = () => {
      particlesArray = [];
      const numberOfParticles = (canvas.width * canvas.height) / 12000;

      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070b14] pt-20 pb-12 lg:pt-0 selection:bg-[#f5b025] selection:text-[#070b14] font-sans antialiased text-[#f8fafc]">
      <div className="absolute inset-0 bg-pattern opacity-50 z-0"></div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      ></canvas>

      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#1d8299]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#f5b025]/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 z-0 pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] z-0 pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="flex flex-col space-y-8 animate-fade-in-up">
            <div className="flex flex-wrap items-center gap-3">
              <div className="glass-panel px-4 py-1.5 rounded-full flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f5b025] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f5b025]"></span>
                </span>
                <span className="text-xs font-semibold tracking-wider text-[#f5b025] uppercase">
                  🔥 Temporada de alta rotación
                </span>
              </div>

              <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-gray-300">
                📦 Stock listo para campaña
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-medium text-gray-400">
                La campaña ya comenzó.
              </h2>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                Prepárate para <br />
                <span className="text-gradient-gold">
                  vender más este <br />
                  Día del Padre.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-400 max-w-lg pt-4 leading-relaxed font-light">
                Productos de alta rotación para emprendedores que quieren
                aprovechar esta campaña y convertirla en más ventas.
              </p>
            </div>

            <div
              className="space-y-3 pt-2"
              data-aos="zoom-in"
              data-aos-delay="250"
            >
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                ⏰ La campaña no espera
              </p>

              <div className="flex gap-4">
                {[
                  { label: "Días", value: timeLeft.days, color: "text-white" },
                  {
                    label: "Horas",
                    value: timeLeft.hours,
                    color: "text-white",
                  },
                  {
                    label: "Min",
                    value: timeLeft.minutes,
                    color: "text-white",
                  },
                  {
                    label: "Seg",
                    value: timeLeft.seconds,
                    color: "text-[#f5b025]",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="glass-panel flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl"
                  >
                    <span
                      className={`text-3xl md:text-4xl font-bold ${item.color}`}
                    >
                      {item.value}
                    </span>
                    <span
                      className={`text-xs mt-1 uppercase tracking-wide ${
                        item.color === "text-white"
                          ? "text-gray-400"
                          : "text-[#f5b025]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              data-aos="fade-up"
              data-aos-delay="350"
            >
              <button
                onClick={() => (window.location.href = "/catalogo")}
                className="btn-premium bg-gradient-to-r from-[#f5b025] to-[#d49615] text-[#070b14] px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(245,176,37,0.3)] hover:shadow-[0_0_30px_rgba(245,176,37,0.5)] flex items-center justify-center gap-2"
              >
                Ver productos de campaña
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </button>

              <button
                onClick={() =>
                  window.open(
                    "https://wa.me/51936188636?text=Hola%20Wooly%2C%20quiero%20informaci%C3%B3n%20para%20comprar%20por%20mayor",
                    "_blank",
                  )
                }
                className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-[0_10px_30px_rgba(37,211,102,0.35)] hover:bg-[#1EAD54] hover:shadow-[0_12px_35px_rgba(37,211,102,0.45)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Asesora WhatsApp
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg
                  className="w-5 h-5 text-[#1d8299]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Envíos a todo el Perú
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg
                  className="w-5 h-5 text-[#1d8299]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Productos de alta rotación
              </div>
            </div>
          </div>

          <div
            className="relative w-full h-[500px] lg:h-[700px] flex items-center justify-center mt-10 lg:mt-0"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <div className="relative w-full h-full max-w-lg flex items-center justify-center">
              <div className="absolute w-3/4 h-3/4 bg-[#f5b025]/20 rounded-full blur-[80px] animate-pulse-glow z-0"></div>

              <div
                className="balloon w-24 h-24 absolute top-[10%] right-[10%] animate-float-slow"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #475569, #0f172a)",
                }}
              >
                <div className="absolute bottom-[-40px] left-1/2 w-0.5 h-10 bg-white/20"></div>
              </div>

              <div
                className="balloon w-16 h-16 absolute top-[25%] left-[5%] animate-float-delayed"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #c48b1a, #452c00)",
                }}
              >
                <div className="absolute bottom-[-30px] left-1/2 w-0.5 h-8 bg-white/20"></div>
              </div>

              <div className="premium-box-container relative z-10 animate-float-slow">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-12 bg-black/60 rounded-full blur-xl"></div>

                <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-48 h-48 bg-[#f5b025]/40 rounded-full blur-2xl z-[11]"></div>

                <div className="premium-box flex items-center justify-center">
                  <div className="absolute bottom-4 left-4 w-16 h-24 bg-black/40 rounded-md blur-[2px] transform -rotate-12"></div>
                  <div className="absolute bottom-4 right-8 w-20 h-20 bg-black/40 rounded-full blur-[2px]"></div>
                  <div className="box-glow"></div>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 border border-[#f5b025]/30 rounded text-[10px] text-[#f5b025] tracking-widest uppercase bg-black/50 backdrop-blur-sm">
                    Wooly Exclusive
                  </div>
                </div>

                <div className="premium-box-lid">
                  <div className="box-ribbon-v"></div>
                  <div className="box-ribbon-h"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 font-bold text-2xl tracking-widest">
                    W
                  </div>
                </div>
              </div>

              <div className="absolute bottom-[10%] right-[15%] w-20 h-20 glass-panel rounded-xl rotate-12 flex items-center justify-center animate-float-delayed z-20">
                <span className="text-3xl">🥃</span>
              </div>

              <div className="absolute bottom-[20%] left-[10%] w-16 h-16 glass-panel rounded-full flex items-center justify-center animate-float-slow z-20">
                <span className="text-2xl">⌚</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
