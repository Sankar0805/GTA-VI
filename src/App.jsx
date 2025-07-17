import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import clickSound from "../public/click.mp3";



function confettiBurst(x, y) {
  const colors = ["#facc15", "#fff", "#ff69b4", "#00e1ff", "#2c5364"];
  for (let i = 0; i < 30; i++) {
    const conf = document.createElement("div");
    conf.className = "confetti";
    conf.style.position = "fixed";
    conf.style.left = x + "px";
    conf.style.top = y + "px";
    conf.style.width = "10px";
    conf.style.height = "10px";
    conf.style.background = colors[Math.floor(Math.random() * colors.length)];
    conf.style.borderRadius = "50%";
    conf.style.pointerEvents = "none";
    conf.style.zIndex = 9999;
    document.body.appendChild(conf);
    const angle = Math.random() * 2 * Math.PI;
    const dist = Math.random() * 120 + 60;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    conf.animate([
      { transform: "translate(0,0)", opacity: 1 },
      { transform: `translate(${dx}px,${dy}px)`, opacity: 0 }
    ], {
      duration: 1200 + Math.random() * 600,
      easing: "cubic-bezier(.6,0,.4,1)"
    });

    setTimeout(() => conf.remove(), 1800);
    }
}



function HamburgerMenu({ open, setOpen }) {
  return (
    <button className="md:hidden block absolute top-8 right-8 z-50" aria-label="Open menu" onClick={() => setOpen(o=>!o)}>
      <span className="block w-8 h-1 bg-white mb-2"></span>
      <span className="block w-8 h-1 bg-white mb-2"></span>
      <span className="block w-8 h-1 bg-white"></span>
    </button>
  );
}

function MobileNav({ open, setOpen }) {
  return open ? (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-[150]">
      <button className="absolute top-8 right-8 text-4xl text-white" onClick={()=>setOpen(false)} aria-label="Close menu">×</button>
      <nav className="flex flex-col gap-8 text-3xl text-yellow-400">
        <a href="#main-content" onClick={()=>setOpen(false)}>Home</a>
        <a href="#download" onClick={()=>setOpen(false)}>Download</a>
      </nav>
    </div>
  ) : null;
}


function ParticleBackground() {
  useEffect(() => {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    const numParticles = 60;
    const colors = ["#facc15", "#fff", "#ff69b4", "#00e1ff"];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.7,
        dy: (Math.random() - 0.5) * 0.7,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    let animationId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      animationId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  return (
    <canvas id="particle-canvas" className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh'}}></canvas>
  );
}

function App() {
  let [showContent, setShowContent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef(null);
  const buttonRef = useRef(null);
  const logoRef = useRef(null);
  const audioRef = useRef(null);
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Tab" && buttonRef.current) {
        buttonRef.current.setAttribute("tabindex", "0");
      }
      if ((e.key === "Enter" || e.key === " ") && document.activeElement === buttonRef.current) {
        buttonRef.current.click();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.to(".vi-mask-group", {
      rotate: 10,
      duration: 2,
      ease: "Power4.easeInOut",
      transformOrigin: "50% 50%",
    }).to(".vi-mask-group", {
      scale: 10,
      duration: 2,
      delay: -1.8,
      ease: "Expo.easeInOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onUpdate: function () {
        if (this.progress() >= 0.9) {
          setShowContent(true);
          this.kill();
        }
      },
    });
    gsap.to("body", {
      background: "linear-gradient(120deg, #0f2027, #2c5364, #facc15, #ff69b4, #00e1ff)",
      duration: 2,
      ease: "power2.inOut"
    });
  }, []);

  useGSAP(() => {
    if (!showContent) return;

    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
      );
    }

    gsap.to(".main", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: "-1",
      ease: "Expo.easeInOut",
    });

    gsap.to(".sky", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    gsap.to(".bg", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    gsap.to(".character", {
      scale: 0.7,
      x: "-50%",
      bottom: "-85%", // Updated to -85%
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    gsap.to(".text", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });
    const main = document.querySelector(".main");
    function handleMouseMove(e) {
      const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
      const yMove = (e.clientY / window.innerHeight - 0.5) * 20;
      gsap.to(".main .text", {
        x: `${xMove * 0.4}%`,
        y: `${yMove * 0.2}%`,
      });
      gsap.to(".sky", {
        x: xMove,
        y: yMove * 0.5,
      });
      gsap.to(".bg", {
        x: xMove * 1.7,
        y: yMove * 1.2,
      });
    }
    main?.addEventListener("mousemove", handleMouseMove);
    if (buttonRef.current) {
      buttonRef.current.addEventListener("mouseenter", () => {
        gsap.to(buttonRef.current, { scale: 1.1, boxShadow: "0 0 30px #facc15", duration: 0.3 });
      });
      buttonRef.current.addEventListener("mouseleave", () => {
        gsap.to(buttonRef.current, { scale: 1, boxShadow: "0 0 0 #facc15", duration: 0.3 });
      });
      buttonRef.current.addEventListener("click", (e) => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
        const rect = buttonRef.current.getBoundingClientRect();
        confettiBurst(rect.left + rect.width/2, rect.top + rect.height/2);
      });
    }
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        boxShadow: "0 0 30px 10px #fff, 0 0 60px 20px #facc15",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "power1.inOut"
      });
    }
    gsap.to(".scroll-arrow", {
      y: 20,
      repeat: -1,
      yoyo: true,
      duration: 0.8,
      ease: "power1.inOut"
    });
    const arrow = document.querySelector(".scroll-arrow");
    if (arrow) {
      arrow.onclick = (e) => {
        e.preventDefault();
        const el = document.getElementById("main-content");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      };
    }
    return () => {
      main?.removeEventListener("mousemove", handleMouseMove);
      if (buttonRef.current) {
        buttonRef.current.onmouseenter = null;
        buttonRef.current.onmouseleave = null;
      }
    };
  }, [showContent]);

  useGSAP(() => {
    if (!showContent) return;
    const card = document.querySelector('.glass-card');
    if (card) {
      gsap.to(card, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.3 });
    }
  }, [showContent]);

  return (
    <>
      <ParticleBackground />
      <audio ref={audioRef} src={clickSound} preload="auto" />
      <HamburgerMenu open={menuOpen} setOpen={setMenuOpen} />
      <MobileNav open={menuOpen} setOpen={setMenuOpen} />
      {!showContent && (
        <div className="svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen overflow-hidden bg-[#000]">
          <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            <defs>
              <mask id="viMask">
                <rect width="100%" height="100%" fill="black" />
                <g className="vi-mask-group">
                  <text
                    x="50%"
                    y="50%"
                    fontSize="250"
                    textAnchor="middle"
                    fill="white"
                    dominantBaseline="middle"
                    fontFamily="Arial Black"
                  >
                    VI
                  </text>
                </g>
              </mask>
            </defs>
            <image
              href="./bg.png"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              mask="url(#viMask)"
            />
          </svg>
        </div>
      )}
      
      {showContent && (
        <div className="main w-full rotate-[-10deg] scale-[1.7]" ref={mainRef} id="main-content">
          <div className="landing overflow-hidden relative w-full h-screen bg-black">
            <div className="navbar absolute top-0 left-0 z-[10] w-full py-10 px-10">
              <div className="logo flex gap-7 floating-logo" ref={logoRef}>
                <div className="lines flex flex-col gap-[5px]">
                  <div className="line w-15 h-2 bg-white"></div>
                  <div className="line w-8 h-2 bg-white"></div>
                  <div className="line w-5 h-2 bg-white"></div>
                </div>
                <h3 className="text-4xl -mt-[8px] leading-none text-white">
                  Rockstar
                </h3>
              </div>
            </div>

            <div className="imagesdiv relative overflow-hidden w-full h-screen">
              <img
                className="absolute sky scale-[1.5] rotate-[-20deg] top-0 left-0 w-full h-full object-cover"
                src="./sky.png"
                alt="Sky background"
                aria-hidden="true"
                loading="lazy"
              />
              <img
                className="absolute scale-[1.8] rotate-[-3deg] bg top-0 left-0 w-full h-full object-cover"
                src="./bg.png"
                alt="Main background"
                aria-hidden="true"
                loading="lazy"
              />
              <div className="text text-white flex flex-col gap-3 absolute top-20 left-1/2 -translate-x-1/2 scale-[1.4] rotate-[-10deg]">
                <h1 className="text-[10rem] leading-none -ml-40 animate-gradient-text bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent" style={{backgroundSize:'200% 200%',animation:'gradientMove 3s linear infinite'}}>grand</h1>
                <h1 className="text-[10rem] leading-none ml-20 animate-gradient-text bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent" style={{backgroundSize:'200% 200%',animation:'gradientMove 3s linear infinite'}}>theft</h1>
                <h1 className="text-[10rem] leading-none -ml-40 animate-gradient-text bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent" style={{backgroundSize:'200% 200%',animation:'gradientMove 3s linear infinite'}}>auto</h1>
              </div>
              <img
                className="absolute character -bottom-[85%] left-1/2 -translate-x-1/2 scale-[0.7] rotate-[-20deg]"
                src="./girlbg.png"
                alt="Character"
                aria-label="Main character"
                loading="lazy"
              />
            </div>
            <div className="btmbar text-white absolute bottom-0 left-0 w-full py-15 px-10 bg-gradient-to-t from-black to-transparent">
              <div className="flex gap-4 items-center">
                <i className="text-4xl ri-arrow-down-line scroll-arrow" aria-label="Scroll Down" tabIndex={0}></i>
                <h3 className="text-xl font-[Helvetica_Now_Display]">
                  Scroll Down
                </h3>
              </div>
              <img
                className="absolute h-[55px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                src="./ps5.png"
                alt="PS5 Console"
                loading="lazy"
              />
            </div>
          </div>
          <div className="w-full h-screen flex items-center justify-center bg-black">
            <div className="cntnr flex text-white w-full h-[80%] ">
              <div className="limg relative w-1/2 h-full">
                <img
                  className="absolute scale-[1.3] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  src="./imag.png"
                  alt="In-game screenshot"
                  loading="lazy"
                />
              </div>
              <div className="rg w-[30%] py-30 glass-card glowing-border opacity-0 translate-y-10" id="download">
                <h1 className="text-8xl">Still Running,</h1>
                <h1 className="text-8xl">Not Hunting</h1>
                <p className="mt-10 text-xl font-[Helvetica_Now_Display]">
                  <span className="font-bold text-yellow-400">Grand Theft Auto VI</span> is now officially set to launch on <span className="font-bold text-pink-400">May 26, 2026</span>! This highly anticipated release comes after Rockstar Games announced a delay from the original Fall 2025 window, ensuring the game meets the highest standards of quality and innovation.
                </p>
                <p className="mt-3 text-xl font-[Helvetica_Now_Display]">
                  Rockstar is committed to delivering an unforgettable experience, taking extra time to polish every detail and avoid crunch culture. The announcement, made in early May 2025, has only heightened the excitement and expectations among fans worldwide.
                </p>
                <p className="mt-10 text-xl font-[Helvetica_Now_Display]">
                  <span className="font-bold text-blue-400">GTA VI</span> will debut exclusively on <span className="font-bold text-green-400">PlayStation 5</span> and <span className="font-bold text-green-400">Xbox Series X/S</span>. A PC version is expected to follow, likely in 2026 or beyond. Stay tuned and get ready to experience the next evolution of open-world gaming!
                </p>
                <button
                  ref={buttonRef}
                  className="bg-yellow-500 px-10 py-10 text-black mt-10 text-4xl transition-all duration-300 rounded-lg shadow-lg hover:shadow-yellow-400 focus:outline-none animate-pulse-btn shimmer-btn"
                  aria-label="Download Now"
                >
                  <span className="shimmer-text">Download Now</span>
                </button>
              </div>
            </div>
          </div>
          {}
          {}
          <footer className="footer-glass w-full text-center py-5 px-2 bg-gradient-to-t from-black/80 to-transparent text-yellow-300 font-extrabold text-lg tracking-widest fixed left-0 bottom-0 z-[200] shadow-2xl backdrop-blur-xl border-t-2 border-yellow-400 animate-footer-glow select-none">
            <span className="footer-glow-text">All rights reserved. © Lucifer</span>
          </footer>
        </div>
      )}
      <style>{`
        .footer-glass {
          background: rgba(20,20,30,0.7);
          box-shadow: 0 4px 32px 0 rgba(250,204,21,0.15), 0 0px 0px 0 #fff;
          border-top: 2px solid #facc15;
          border-image: linear-gradient(90deg, #facc15, #ff69b4, #00e1ff) 1;
        }
        .footer-glow-text {
          text-shadow: 0 0 8px #facc15, 0 0 16px #ff69b4, 0 0 32px #00e1ff;
          letter-spacing: 0.15em;
        }
        @keyframes footer-glow {
          0% { box-shadow: 0 4px 32px 0 #facc15aa, 0 0px 0px 0 #fff; }
          100% { box-shadow: 0 8px 48px 0 #ff69b4aa, 0 0px 0px 0 #00e1ffaa; }
        }
        .animate-footer-glow {
          animation: footer-glow 2.5s alternate infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .glass-card {
          background: rgba(30,30,40,0.55);
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 24px;
          border: 1.5px solid rgba(255,255,255,0.18);
          transition: box-shadow 0.3s, border 0.3s;
        }
        .glass-card:hover {
          box-shadow: 0 12px 48px 0 rgba(250,204,21,0.25);
        }
        .glowing-border {
          box-shadow: 0 0 16px 4px #facc15, 0 0 32px 8px #ff69b4, 0 0 64px 16px #00e1ff;
          border: 2.5px solid #fff;
          animation: borderGlow 2.5s linear infinite alternate;
        }
        @keyframes borderGlow {
          0% { box-shadow: 0 0 16px 4px #facc15, 0 0 32px 8px #ff69b4, 0 0 64px 16px #00e1ff; }
          100% { box-shadow: 0 0 32px 8px #facc15, 0 0 64px 16px #ff69b4, 0 0 128px 32px #00e1ff; }
        }
        .floating-logo {
          animation: floatLogo 3s ease-in-out infinite;
        }
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        .shimmer-btn {
          position: relative;
          overflow: hidden;
        }
        .shimmer-text {
          position: relative;
          z-index: 1;
        }
        .shimmer-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -75%;
          width: 50%; height: 100%;
          background: linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.2) 100%);
          transform: skewX(-20deg);
          animation: shimmerMove 2.2s infinite;
        }
        @keyframes shimmerMove {
          0% { left: -75%; }
          100% { left: 125%; }
        }
        @keyframes pulseBtn {
          0% { box-shadow: 0 0 0 0 #facc15aa; }
          70% { box-shadow: 0 0 0 18px #facc1500; }
          100% { box-shadow: 0 0 0 0 #facc1500; }
        }
        .animate-pulse-btn {
          animation: pulseBtn 2s infinite;
        }
      `}</style>

      <style>{`.confetti { transition: opacity 0.3s; }`}</style>
    </>
  );
}

export default App;