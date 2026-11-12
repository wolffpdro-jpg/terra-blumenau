"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { BROKER_DATA, PROPERTY_SUMMARY } from "@/data/propertyData";
import InteractiveMap from "@/components/InteractiveMap";
import TopographicBlueprint from "@/components/TopographicBlueprint";
import { RWLogo } from "@/components/RWLogo";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  Calendar,
  Car,
  Check,
  Copy,
  FileText,
  Home,
  Lock,
  Mail,
  MapPin,
  Pause,
  Phone,
  Play,
  Ruler,
  Send,
  ShieldCheck,
  Sparkles,
  Trees,
  Truck,
} from "lucide-react";

export default function TerraBlumenauPage() {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Lead Capture Form State
  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadProfile, setLeadProfile] = useState("Incorporadora / Construtora");
  const [requestDossier, setRequestDossier] = useState(true);
  const [leadMessage, setLeadMessage] = useState("");
  const [submittedChannel, setSubmittedChannel] = useState<
    "whatsapp" | "email" | null
  >(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1, 1.1]
  );
  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    prefersReducedMotion ? [1, 1] : [1, 0.2]
  );

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2200);
    }
  };

  const buildLeadText = () => {
    const lines = [
      `Olá Robert, vi o site do terreno na ${PROPERTY_SUMMARY.address} (${PROPERTY_SUMMARY.totalAreaM2}) e gostaria de mais informações.`,
      "",
      `• Nome: ${leadName || "Não informado"}`,
      `• Empresa: ${leadCompany || "Investidor"}`,
      `• Interesse: ${leadProfile}`,
      `• Telefone: ${leadPhone || "Não informado"}`,
      `• E-mail: ${leadEmail || "Não informado"}`,
      `• Solicita Dossiê Técnico (Matrícula e Condicionantes): ${
        requestDossier ? "Sim" : "Não"
      }`,
    ];
    if (leadMessage.trim()) {
      lines.push(`• Mensagem: ${leadMessage.trim()}`);
    }
    return lines.join("\n");
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(buildLeadText());
    window.open(
      `https://wa.me/${BROKER_DATA.phoneClean}?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
    setSubmittedChannel("whatsapp");
  };

  const handleEmailSubmit = () => {
    const subject = encodeURIComponent(
      `[TERRA / BLUMENAU] Interesse Comercial - ${
        leadCompany || leadName || "Investidor"
      }`
    );
    const body = encodeURIComponent(buildLeadText());
    window.location.href = `mailto:${BROKER_DATA.email}?subject=${subject}&body=${body}`;
    setSubmittedChannel("email");
  };

  const aerialGallery = [
    {
      src: "/media/vista-aerea-br470.jpg",
      buttonLabel: "01 · Acesso BR-470",
      tag: "LOCALIZAÇÃO E ACESSO",
      title: "Ao lado do trevo da BR-470",
      caption:
        "Nesta vista aérea da Rua 1º de Janeiro, a frente do terreno aparece na parte inferior da imagem e, logo adiante (a apenas 220 metros), está o acesso direto para a BR-470.",
      highlights: [
        "Acesso rápido para caminhões, frotas e clientes",
        "Rua larga e asfaltada até a rodovia",
        "Região em forte expansão empresarial em Blumenau",
      ],
    },
    {
      src: "/media/drone-poster.jpg",
      buttonLabel: "02 · Frente Principal",
      tag: "FRENTE PRINCIPAL",
      title: "Ampla frente na Rua 1º de Janeiro, nº 2.650",
      caption:
        "O terreno fica em uma esquina estratégica entre a Rua 1º de Janeiro e a Rua Frieda Beck, facilitando a criação de entradas independentes para veículos leves, carga ou portaria.",
      highlights: [
        "Quase 68 metros de frente na Rua 1º de Janeiro",
        "Mais de 180 metros acompanhando a Rua Frieda Beck",
        "Infraestrutura urbana completa na porta",
      ],
    },
    {
      src: "/media/drone-frame-end.jpg",
      buttonLabel: "03 · Vista e Altitude",
      tag: "VISÃO DA REGIÃO",
      title: "Terreno alto e com vista aberta no Bairro Fidélis",
      caption:
        "Por estar em uma área mais alta (entre 30 e 60 metros de altitude), o terreno fica totalmente livre de enchentes e oferece uma excelente visibilidade na região norte da cidade.",
      highlights: [
        "100% fora de área de enchente",
        "Topografia que valoriza projetos residenciais ou comerciais",
        "Fácil ligação com o Centro e Norte Shopping",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#11221B] text-[#F7F5F0] overflow-x-hidden antialiased selection:bg-[#C59B6D] selection:text-[#11221B]">
      {/* Top Fixed Editorial Navigation (z-[1000] prevents map overlap) */}
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-[#11221B]/95 backdrop-blur-md border-b border-[#C59B6D]/25">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <a href="#topo" className="group flex items-center gap-3.5">
            <div className="w-2.5 h-2.5 bg-[#C59B6D] rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            <div>
              <span className="font-serif text-lg sm:text-2xl tracking-[0.18em] text-[#F7F5F0] block leading-none">
                TERRA <span className="text-[#C59B6D]">/</span> BLUMENAU
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-wider text-[#E6DFD3]/70 block mt-1">
                Rua 1º de Janeiro, 2.650 · 10.361 m²
              </span>
            </div>
          </a>

          <nav
            aria-label="Navegação Principal"
            className="hidden lg:flex items-center gap-7 text-xs font-medium uppercase tracking-[0.14em] text-[#E6DFD3]/85"
          >
            <a href="#terreno" className="hover:text-[#C59B6D] transition">
              01. O Terreno
            </a>
            <a href="#mapa" className="hover:text-[#C59B6D] transition">
              02. Localização & Mapa
            </a>
            <a href="#ficha-tecnica" className="hover:text-[#C59B6D] transition">
              03. Planta & Zoneamento
            </a>
            <a href="#estrutura" className="hover:text-[#C59B6D] transition">
              04. O Que Já Existe
            </a>
            <a href="#contato" className="hover:text-[#C59B6D] transition">
              05. Contato
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#C59B6D] text-[#11221B] hover:bg-[#d6b084] transition"
            >
              <span>Falar com o Corretor</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION — Despoluída, com foco no vídeo e leitura imediata */}
      <section
        id="topo"
        ref={heroRef}
        className="relative min-h-[92vh] flex flex-col justify-between pt-24 sm:pt-28 overflow-hidden border-b border-[#C59B6D]/30"
      >
        {/* Background Video */}
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <video
            ref={videoRef}
            src="/media/drone-hero-4-16.mp4"
            poster="/media/drone-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#11221B]/90 via-[#11221B]/60 to-[#11221B]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11221B] via-transparent to-[#11221B]/60" />
        </motion.div>

        {/* Center Hero Content */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-5 sm:px-8 my-auto py-14 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#11221B]/75 border border-[#C59B6D]/45 backdrop-blur-md text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C59B6D]">
              <span className="w-2 h-2 rounded-full bg-[#C59B6D]" />
              <span>Blumenau · Bairro Fidélis · Ao lado da BR-470</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#F7F5F0] leading-[1.04] mt-6">
              10.361 m² prontos para{" "}
              <span className="italic font-light text-[#E6DFD3]">
                grandes projetos.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#E6DFD3]/90 max-w-2xl font-light leading-relaxed">
              Terreno amplo de esquina na{" "}
              <strong className="font-medium text-[#F7F5F0]">
                Rua 1º de Janeiro, nº 2.650
              </strong>
              , a apenas{" "}
              <strong className="font-medium text-[#C59B6D]">
                220 metros do trevo da BR-470
              </strong>
              . Área alta, 100% livre de enchentes, com jardim formado e vocação
              para empresas, galpões ou empreendimentos residenciais.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <a
                href="#mapa"
                className="inline-flex items-center gap-3 px-6 sm:px-7 py-4 rounded-lg bg-[#C59B6D] text-[#11221B] text-xs uppercase tracking-[0.16em] font-bold hover:bg-[#d6b084] transition shadow-lg"
              >
                <MapPin className="w-4 h-4" />
                <span>Explorar Localização no Mapa</span>
              </a>

              <a
                href="#contato"
                className="inline-flex items-center gap-3 px-6 sm:px-7 py-4 rounded-lg bg-[#11221B]/80 backdrop-blur-md border border-[#F7F5F0]/30 text-[#F7F5F0] text-xs uppercase tracking-[0.16em] font-medium hover:border-[#C59B6D] transition"
              >
                <Phone className="w-4 h-4 text-[#C59B6D]" />
                <span>Falar com o Corretor</span>
              </a>

              <button
                type="button"
                onClick={toggleVideo}
                aria-label={isVideoPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
                className="inline-flex items-center gap-2 px-4 py-4 rounded-lg bg-[#11221B]/60 backdrop-blur-md border border-[#F7F5F0]/20 text-xs text-[#E6DFD3]/85 hover:border-[#C59B6D] transition cursor-pointer"
                title={isVideoPlaying ? "Pausar vídeo de fundo" : "Reproduzir vídeo de fundo"}
              >
                {isVideoPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-[#C59B6D]" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-[#C59B6D]" />
                )}
                <span className="hidden sm:inline">
                  {isVideoPlaying ? "Pausar Vídeo" : "Reproduzir"}
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Architectural Metrics Ribbon (Full-width grounded bar) */}
        <div className="relative z-10 w-full border-t border-[#C59B6D]/30 bg-[#11221B]/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-[#C59B6D]/20">
            <div className="py-4 sm:py-5 pr-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C59B6D]">
                Área Total
              </div>
              <div className="font-serif text-2xl sm:text-3xl text-[#F7F5F0] mt-0.5">
                10.361 m²
              </div>
              <div className="text-xs text-[#E6DFD3]/70">
                Medida em planta oficial
              </div>
            </div>

            <div className="py-4 sm:py-5 md:px-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C59B6D]">
                Terreno de Esquina
              </div>
              <div className="font-serif text-2xl sm:text-3xl text-[#F7F5F0] mt-0.5">
                2 Frentes
              </div>
              <div className="text-xs text-[#E6DFD3]/70">
                R. 1º de Janeiro e R. Frieda Beck
              </div>
            </div>

            <div className="py-4 sm:py-5 md:px-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C59B6D]">
                Acesso à BR-470
              </div>
              <div className="font-serif text-2xl sm:text-3xl text-[#F7F5F0] mt-0.5">
                220 metros
              </div>
              <div className="text-xs text-[#E6DFD3]/70">
                Saída rápida para a rodovia
              </div>
            </div>

            <div className="py-4 sm:py-5 md:px-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C59B6D]">
                Segurança
              </div>
              <div className="font-serif text-2xl sm:text-3xl text-[#F7F5F0] mt-0.5">
                Zero Enchente
              </div>
              <div className="text-xs text-[#E6DFD3]/70">
                30m a 60m de altitude
              </div>
            </div>

            <div className="py-4 sm:py-5 md:pl-5 col-span-2 md:col-span-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C59B6D]">
                Valor de Venda
              </div>
              <div className="font-serif text-2xl sm:text-3xl text-[#F7F5F0] mt-0.5">
                Sob Consulta
              </div>
              <div className="text-xs text-[#C59B6D]">
                Negociação direta
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 01 — APRESENTAÇÃO DO TERRENO */}
      <section
        id="terreno"
        className="bg-[#F7F5F0] text-[#11221B] py-20 lg:py-24 border-b border-[#11221B]/15"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {/* Section Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end border-b border-[#11221B]/15 pb-8">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C6239] block">
                01 · Por que investir neste terreno
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#11221B] mt-2 leading-[1.08]">
                Localização estratégica, espaço de sobra e segurança total.
              </h2>
            </div>
            <div className="lg:col-span-5 text-sm sm:text-base text-[#11221B]/80 leading-relaxed">
              Encontrar um terreno de <strong>mais de 10.000 m²</strong> já
              inserido na área urbana de Blumenau, colado na{" "}
              <strong>BR-470</strong> e totalmente livre de enchentes é uma
              oportunidade rara para quem busca construir ou investir com
              segurança.
            </div>
          </div>

          {/* 4 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {[
              {
                number: "01",
                icon: Truck,
                title: "Colado na BR-470",
                metric: "Apenas 220 m da rodovia",
                description:
                  "Saída rápida pela Rua 1º de Janeiro direto para o trevo da BR-470, facilitando o transporte para o litoral, portos de Itajaí e Navegantes, BR-101 e todo o Vale.",
              },
              {
                number: "02",
                icon: Ruler,
                title: "Esquina com 2 Frentes",
                metric: "67,5m + 180,7m de frente",
                description:
                  "São quase 68 metros de frente na Rua 1º de Janeiro e mais de 180 metros acompanhando a Rua Frieda Beck. Ideal para separar entrada de clientes e pátio de serviço.",
              },
              {
                number: "03",
                icon: ShieldCheck,
                title: "100% Livre de Enchente",
                metric: "30 m a 60 m de altitude",
                description:
                  "Enquanto as enchentes em Blumenau atingem as cotas de 10 m e 12 m, a parte mais baixa deste terreno já começa em 30 m de altura — tranquilidade total em qualquer época.",
              },
              {
                number: "04",
                icon: Building2,
                title: "Uso Comercial, Industrial ou Residencial",
                metric: "Zonas ZI-1 e ZOC",
                description:
                  "O zoneamento permite desde galpões logísticos, sede de empresas e indústrias limpas na frente principal até projetos residenciais ou integrados na parte alta.",
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="rounded-xl bg-[#152820] border border-[#11221B] border-t-2 border-t-[#C59B6D] p-6 shadow-md hover:bg-[#182E25] transition flex flex-col justify-between text-[#F7F5F0]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B6D]">
                        Diferencial {pillar.number}
                      </span>
                      <div className="w-10 h-10 rounded-lg bg-[#11221B] border border-[#C59B6D]/40 flex items-center justify-center text-[#C59B6D]">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl text-[#F7F5F0] mt-4 font-normal">
                      {pillar.title}
                    </h3>

                    <div className="inline-block mt-3 px-3 py-1 rounded bg-[#C59B6D]/15 border border-[#C59B6D]/45 text-[#C59B6D] text-xs font-semibold tracking-wide">
                      {pillar.metric}
                    </div>

                    <p className="text-sm text-[#E6DFD3]/85 mt-4 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Simplified Aerial Visual Inspection */}
          <div className="mt-14 rounded-2xl bg-[#E6DFD3] border border-[#11221B]/15 p-6 lg:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#11221B]/15">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C6239] block">
                  Vista Aérea do Local
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#11221B] mt-1">
                  Veja o terreno e a proximidade com a BR-470
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {aerialGallery.map((item, idx) => (
                  <button
                    key={item.src}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition cursor-pointer ${
                      activePhotoIndex === idx
                        ? "bg-[#11221B] text-[#F7F5F0] border-[#11221B]"
                        : "bg-[#F7F5F0] text-[#11221B] border-[#11221B]/20 hover:border-[#8C6239]"
                    }`}
                  >
                    {item.buttonLabel}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
              <div className="lg:col-span-8 relative rounded-xl overflow-hidden border border-[#11221B]/20 bg-[#11221B]">
                <img
                  src={aerialGallery[activePhotoIndex].src}
                  alt={aerialGallery[activePhotoIndex].title}
                  className="w-full h-[300px] sm:h-[420px] object-cover transition-all duration-500"
                />
                {activePhotoIndex === 0 && (
                  <>
                    <div className="absolute top-[24%] left-[52%] -translate-x-1/2 rounded-md bg-[#11221B]/90 backdrop-blur-md border border-[#C59B6D] px-3 py-1.5 text-xs font-medium text-[#F7F5F0] shadow-lg">
                      <span className="text-[#C59B6D] font-bold">
                        ↑ RODOVIA BR-470
                      </span>{" "}
                      · A apenas 220 m
                    </div>
                    <div className="absolute bottom-[12%] left-[44%] -translate-x-1/2 rounded-md bg-[#11221B]/90 backdrop-blur-md border border-[#F4D06F] px-3 py-1.5 text-xs font-medium text-[#F7F5F0] shadow-lg">
                      <span className="text-[#F4D06F] font-bold">
                        ↓ FRENTE DO TERRENO
                      </span>{" "}
                      · Rua 1º de Janeiro, 2.650
                    </div>
                  </>
                )}
              </div>

              <div className="lg:col-span-4 space-y-5">
                <div>
                  <span className="inline-block px-2.5 py-1 rounded bg-[#11221B] text-[#C59B6D] text-[11px] font-semibold uppercase tracking-wider">
                    {aerialGallery[activePhotoIndex].tag}
                  </span>
                  <h4 className="font-serif text-2xl sm:text-3xl text-[#11221B] mt-3 leading-snug">
                    {aerialGallery[activePhotoIndex].title}
                  </h4>
                  <p className="text-sm sm:text-base text-[#11221B]/80 mt-3 leading-relaxed">
                    {aerialGallery[activePhotoIndex].caption}
                  </p>
                </div>

                <div className="rounded-xl bg-[#152820] border border-[#C59B6D]/35 p-5 space-y-2.5 text-[#F7F5F0]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C59B6D]">
                    Destaques desta vista
                  </div>
                  {aerialGallery[activePhotoIndex].highlights.map((h) => (
                    <div
                      key={h}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-[#E6DFD3]/90"
                    >
                      <Check className="w-4 h-4 text-[#C59B6D] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 02 — MAPA INTERATIVO GOOGLE MAPS (2D) */}
      <section
        id="mapa"
        className="bg-[#11221B] text-[#F7F5F0] py-16 lg:py-24 border-b border-[#C59B6D]/25"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C59B6D] block">
                02 · Localização & Google Maps
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0] mt-2 leading-[1.08]">
                Limites do terreno, acessos e entorno comercial.
              </h2>
            </div>
            <p className="text-sm text-[#E6DFD3]/80 lg:max-w-sm">
              10.361 m² demarcados via satélite, a 220 m da BR-470. Clique nos
              pontos do mapa para ver distâncias e rotas.
            </p>
          </div>

          <InteractiveMap />
        </div>
      </section>

      {/* SEÇÃO 03 — PLANTA TÉCNICA 2D, ZONEAMENTO & DOSSIÊ */}
      <section
        id="ficha-tecnica"
        className="bg-[#162921] text-[#F7F5F0] py-16 lg:py-24 border-b border-[#C59B6D]/25"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C59B6D] block">
              03 · Planta Técnica 2D & Zoneamento
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0] mt-2 leading-[1.08]">
              Planta Planialtimétrica e Potencial de Uso.
            </h2>
          </div>

          {/* Static 2D Technical CAD Blueprint */}
          <TopographicBlueprint />

          {/* Zoning & On-Request Dossier (Side by Side, Clean & Direct) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
            {/* Zoning Cards */}
            <div className="lg:col-span-7 rounded-xl bg-[#11221B] border border-[#C59B6D]/25 p-6 lg:p-8">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B6D] block">
                Zoneamento Municipal (Prefeitura de Blumenau)
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F7F5F0] mt-1">
                Duas zonas que ampliam as possibilidades do terreno
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {PROPERTY_SUMMARY.zoning.zones.map((zone) => (
                  <div
                    key={zone.code}
                    className="rounded-lg p-5 bg-[#162921] border border-[#C59B6D]/25 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded bg-[#C59B6D] text-[#11221B] text-xs font-bold">
                          {zone.code}
                        </span>
                        <span className="text-xs text-[#E6DFD3]/80">
                          Lote mín. {zone.minLotArea}
                        </span>
                      </div>
                      <div className="font-serif text-xl text-[#F7F5F0] mt-3 font-semibold">
                        {zone.name}
                      </div>
                      <div className="text-xs text-[#C59B6D] mt-1">
                        {zone.position}
                      </div>
                      <p className="text-xs sm:text-sm text-[#E6DFD3]/85 mt-3 leading-relaxed">
                        {zone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matrícula & Condicionantes Técnicos (WhatsApp Request + Temporary Owner Edit Button) */}
            <div className="lg:col-span-5 rounded-xl bg-[#1D352B] border border-[#C59B6D]/45 p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B6D]">
                  <Lock className="w-4 h-4" />
                  <span>Documentação Completa sob Solicitação</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#F7F5F0] mt-2">
                  Matrícula e Condicionantes Técnicos
                </h3>
                <p className="text-sm text-[#E6DFD3]/90 mt-3 leading-relaxed">
                  Para segurança da negociação, o documento completo com o{" "}
                  <strong>número da Matrícula</strong>,{" "}
                  <strong>Inscrição Cadastral (IPTU)</strong> e os{" "}
                  <strong>pareceres técnicos da Prefeitura</strong> (Defesa Civil,
                  Planejamento e Meio Ambiente) é enviado diretamente pelo
                  corretor via WhatsApp.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <a
                  href={BROKER_DATA.dossierWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-lg bg-[#C59B6D] text-[#11221B] text-xs uppercase tracking-[0.18em] font-bold hover:bg-[#d6b084] transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>Solicitar Dossiê Completo via WhatsApp</span>
                </a>

                {/* Temporary Owner Preview Notice */}
                <div className="rounded-lg p-3.5 bg-[#11221B]/90 border border-amber-400/50 text-xs text-amber-200/90 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Acesso Interno (Ajustar antes do lançamento)</span>
                  </div>
                  <p className="text-[11px] text-[#E6DFD3]/80 leading-relaxed">
                    Este botão abaixo está visível apenas para você conferir e
                    editar o modelo do Dossiê Técnico. Antes de publicar o site
                    oficialmente, basta remover este atalho para que o envio seja
                    feito exclusivamente pelo WhatsApp.
                  </p>
                  <Link
                    href="/dossie-tecnico"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-400/15 border border-amber-400/50 text-amber-200 text-[11px] font-medium hover:bg-amber-400/25 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Ver / Editar Página do Dossiê Técnico →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 04 — O QUE JÁ EXISTE NO TERRENO (Com fotos placeholder Costela-de-Adão indicando as fotos reais) */}
      <section
        id="estrutura"
        className="bg-[#F7F5F0] text-[#11221B] py-20 lg:py-24 border-b border-[#11221B]/15"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end border-b border-[#11221B]/15 pb-8">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C6239] block">
                04 · O Que Já Existe no Terreno
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#11221B] mt-2 leading-[1.08]">
                Jardim formado, espaço de eventos ativo e casa pronta para Airbnb.
              </h2>
            </div>
            <div className="lg:col-span-5 text-sm sm:text-base text-[#11221B]/80 leading-relaxed">
              Mais do que uma área bruta, a propriedade já conta com um{" "}
              <strong>belo jardim arborizado</strong>, uma estrutura aberta que{" "}
              <strong>já gera renda com eventos</strong> e duas construções com
              perfis bem definidos.
            </div>
          </div>

          {/* 3 Existing Structures / Features Cards with Photo Slots */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
            {/* 1. Casa Aconchegante com Deck (Airbnb) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="rounded-xl overflow-hidden bg-[#152820] border border-[#11221B] shadow-md flex flex-col justify-between text-[#F7F5F0]"
            >
              <div>
                {/* Photo Slot 01 */}
                <div className="relative h-52 w-full overflow-hidden bg-[#11221B] border-b border-[#C59B6D]/30">
                  <img
                    src="/media/placeholder-costela-adao.jpg"
                    alt="Foto sugerida: Casa aconchegante com amplo deck e vista para a natureza"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#152820] via-transparent to-black/30" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#11221B]/90 border border-[#C59B6D]/60 text-[10px] font-semibold uppercase tracking-wider text-[#C59B6D]">
                    Foto 01 · Casa com Deck & Sacada
                  </span>
                </div>

                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B6D]">
                      Construção 01 · Pronta para Uso
                    </span>
                    <Sparkles className="w-4 h-4 text-[#C59B6D]" />
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-[#F7F5F0] mt-2 font-normal">
                    Casa Aconchegante com Amplo Deck
                  </h3>

                  <div className="inline-block mt-2.5 px-3 py-1 rounded bg-[#C59B6D]/15 border border-[#C59B6D]/45 text-[#C59B6D] text-xs font-semibold tracking-wide">
                    Ideal para Airbnb ou Hospedagem
                  </div>

                  <p className="text-sm text-[#E6DFD3]/90 mt-4 leading-relaxed">
                    Residência super charmosa e bem conservada com{" "}
                    <strong className="text-[#F7F5F0]">1 quarto</strong>,{" "}
                    <strong className="text-[#F7F5F0]">1 banheiro</strong> e{" "}
                    <strong className="text-[#F7F5F0]">
                      sala e cozinha integradas
                    </strong>{" "}
                    a uma sacada externa com amplo deck de madeira. Pela sua
                    integração total com a natureza do terreno, está pronta para
                    começar a render imediatamente no <strong>Airbnb</strong>.
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 border-t border-[#F7F5F0]/12 flex flex-wrap gap-2 text-[11px] text-[#E6DFD3]/80">
                <span className="px-2.5 py-1 rounded bg-[#11221B] border border-[#C59B6D]/25">
                  1 Quarto + 1 Banheiro
                </span>
                <span className="px-2.5 py-1 rounded bg-[#11221B] border border-[#C59B6D]/25">
                  Sala & Cozinha Integradas
                </span>
                <span className="px-2.5 py-1 rounded bg-[#11221B] border border-[#C59B6D]/25">
                  Sacada & Amplo Deck
                </span>
              </div>
            </motion.div>

            {/* 2. Estrutura Externa para Eventos + Jardim + 30 vagas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="rounded-xl overflow-hidden bg-[#152820] border border-[#11221B] shadow-md flex flex-col justify-between text-[#F7F5F0]"
            >
              <div>
                {/* Photo Slot 02 */}
                <div className="relative h-52 w-full overflow-hidden bg-[#11221B] border-b border-[#C59B6D]/30">
                  <img
                    src="/media/placeholder-costela-adao.jpg"
                    alt="Foto sugerida: Estrutura externa aberta para eventos e jardim arborizado"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#152820] via-transparent to-black/30" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#11221B]/90 border border-[#C59B6D]/60 text-[10px] font-semibold uppercase tracking-wider text-[#C59B6D]">
                    Foto 02 · Espaço de Eventos & Jardim
                  </span>
                </div>

                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B6D]">
                      Natureza & Eventos · Operação Ativa
                    </span>
                    <Trees className="w-4 h-4 text-[#C59B6D]" />
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-[#F7F5F0] mt-2 font-normal">
                    Espaço para Eventos & Belo Jardim
                  </h3>

                  <div className="inline-block mt-2.5 px-3 py-1 rounded bg-[#C59B6D]/15 border border-[#C59B6D]/45 text-[#C59B6D] text-xs font-semibold tracking-wide">
                    Estacionamento para ~30 carros
                  </div>

                  <p className="text-sm text-[#E6DFD3]/90 mt-4 leading-relaxed">
                    O terreno conta com uma{" "}
                    <strong className="text-[#F7F5F0]">
                      estrutura externa aberta
                    </strong>{" "}
                    preparada para eventos de médio porte em meio à natureza —
                    atualmente já alugada pelo proprietário para{" "}
                    <strong className="text-[#F7F5F0]">
                      eventos familiares e corporativos
                    </strong>
                    . Tudo cercado por um jardim maduro com grande diversidade de
                    plantas e estacionamento próprio para cerca de{" "}
                    <strong className="text-[#F7F5F0]">30 veículos</strong>.
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 border-t border-[#F7F5F0]/12 flex flex-wrap gap-2 text-[11px] text-[#E6DFD3]/80">
                <span className="px-2.5 py-1 rounded bg-[#11221B] border border-[#C59B6D]/25 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C59B6D]" /> Eventos
                  Familiares & Corporativos
                </span>
                <span className="px-2.5 py-1 rounded bg-[#11221B] border border-[#C59B6D]/25 flex items-center gap-1">
                  <Car className="w-3 h-3 text-[#C59B6D]" /> ~30 Vagas Internas
                </span>
              </div>
            </motion.div>

            {/* 3. Segunda Casa (Transparência Comercial) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="rounded-xl overflow-hidden bg-[#152820] border border-[#11221B] shadow-md flex flex-col justify-between text-[#F7F5F0]"
            >
              <div>
                {/* Photo Slot 03 */}
                <div className="relative h-52 w-full overflow-hidden bg-[#11221B] border-b border-[#C59B6D]/30">
                  <img
                    src="/media/placeholder-costela-adao.jpg"
                    alt="Foto sugerida: Paisagismo, alameda interna e estacionamento para 30 carros"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#152820] via-transparent to-black/30" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#11221B]/90 border border-[#C59B6D]/60 text-[10px] font-semibold uppercase tracking-wider text-[#C59B6D]">
                    Foto 03 · Paisagismo & Área de Acesso
                  </span>
                </div>

                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B6D]">
                      Construção 02 · Área Livre para Projeto
                    </span>
                    <Home className="w-4 h-4 text-[#C59B6D]" />
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-[#F7F5F0] mt-2 font-normal">
                    Segunda Casa (Pronta para Desocupação)
                  </h3>

                  <div className="inline-block mt-2.5 px-3 py-1 rounded bg-[#C59B6D]/15 border border-[#C59B6D]/45 text-[#C59B6D] text-xs font-semibold tracking-wide">
                    Sem amarras para demolição ou obra
                  </div>

                  <p className="text-sm text-[#E6DFD3]/90 mt-4 leading-relaxed">
                    Com total transparência: a segunda casa existente no terreno{" "}
                    <strong className="text-[#F7F5F0]">
                      já viu dias melhores
                    </strong>{" "}
                    e está pronta para ser desocupada. Para construtoras ou
                    empresas, isso significa liberdade imediata para demolir e
                    limpar o setor frontal sem custo emocional, ou adaptá-la como
                    canteiro e apoio de obra.
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 border-t border-[#F7F5F0]/12 flex flex-wrap gap-2 text-[11px] text-[#E6DFD3]/80">
                <span className="px-2.5 py-1 rounded bg-[#11221B] border border-[#C59B6D]/25">
                  Pronta para Desocupar
                </span>
                <span className="px-2.5 py-1 rounded bg-[#11221B] border border-[#C59B6D]/25">
                  Facilidade para Nova Implantação
                </span>
              </div>
            </motion.div>
          </div>

          {/* Investor Value Callout Banner */}
          <div className="mt-8 rounded-2xl bg-[#E6DFD3] border border-[#11221B]/15 p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C6239] block">
                Vantagem Estratégica para o Comprador
              </span>
              <h4 className="font-serif text-2xl sm:text-3xl text-[#11221B] mt-1">
                Renda imediata enquanto você aprova seu projeto ou decide o futuro da área
              </h4>
              <p className="text-sm sm:text-base text-[#11221B]/80 mt-2 leading-relaxed">
                Enquanto projetos de incorporação ou galpões tramitam nas etapas
                de engenharia e prefeitura, o imóvel já pode gerar caixa desde o
                primeiro mês com a <strong>locação da casa no Airbnb</strong> e a{" "}
                <strong>agenda de eventos corporativos e familiares</strong> em
                meio à natureza.
              </p>
            </div>

            <div className="shrink-0">
              <a
                href="#contato"
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-lg bg-[#11221B] text-[#F7F5F0] text-xs uppercase tracking-[0.18em] font-bold hover:bg-[#1D352B] transition"
              >
                <Phone className="w-4 h-4 text-[#C59B6D]" />
                <span>Agendar Visita Presencial</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 05 — CONTATO COMERCIAL (Robert Wolff) */}
      <section
        id="contato"
        className="bg-[#11221B] text-[#F7F5F0] py-20 lg:py-28"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Broker Credential Card */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C59B6D] block">
                  05 · Atendimento Direto
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl text-[#F7F5F0] mt-3 leading-[1.08]">
                  Converse com o corretor responsável.
                </h2>
                <p className="text-sm sm:text-base text-[#E6DFD3]/85 mt-4 leading-relaxed">
                  Tire dúvidas, solicite o Dossiê Técnico do terreno ou agende uma
                  visita presencial diretamente com <strong>Robert Wolff</strong>.
                </p>
              </div>

              {/* Broker Official Card */}
              <div className="rounded-xl bg-[#162B22] border border-[#C59B6D]/45 p-7 sm:p-8 relative overflow-hidden shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-[#F7F5F0]/12 pb-6">
                  <div className="rounded-lg bg-[#11221B] border border-[#C59B6D]/35 px-5 py-4 flex items-center justify-center shrink-0">
                    <RWLogo className="h-16" variant="light" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B6D]">
                      Atendimento Exclusivo
                    </div>
                    <h3 className="font-serif text-3xl text-[#F7F5F0] mt-1">
                      {BROKER_DATA.name}
                    </h3>
                    <div className="text-xs uppercase tracking-wider text-[#E6DFD3]/85 mt-1">
                      {BROKER_DATA.role} ·{" "}
                      <span className="text-[#C59B6D] font-bold">
                        {BROKER_DATA.creci}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5 mt-6 text-sm">
                  {/* Phone / WhatsApp */}
                  <div className="rounded-lg flex items-center justify-between gap-3 bg-[#11221B]/70 border border-[#F7F5F0]/10 p-3.5">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#C59B6D] shrink-0" />
                      <div>
                        <div className="text-[11px] text-[#E6DFD3]/65">
                          Telefone & WhatsApp
                        </div>
                        <a
                          href={BROKER_DATA.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-sm text-[#F7F5F0] hover:text-[#C59B6D] transition"
                        >
                          {BROKER_DATA.phoneDisplay}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(BROKER_DATA.phoneDisplay, "phone")
                      }
                      className="rounded px-2.5 py-1 text-xs border border-[#F7F5F0]/20 text-[#E6DFD3] hover:border-[#C59B6D] transition cursor-pointer flex items-center gap-1"
                    >
                      {copiedField === "phone" ? (
                        <>
                          <Check className="w-3 h-3 text-[#52B788]" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#C59B6D]" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Email */}
                  <div className="rounded-lg flex items-center justify-between gap-3 bg-[#11221B]/70 border border-[#F7F5F0]/10 p-3.5">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#C59B6D] shrink-0" />
                      <div>
                        <div className="text-[11px] text-[#E6DFD3]/65">
                          E-mail
                        </div>
                        <a
                          href={`mailto:${BROKER_DATA.email}`}
                          className="font-medium text-sm text-[#F7F5F0] hover:text-[#C59B6D] transition break-all"
                        >
                          {BROKER_DATA.email}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(BROKER_DATA.email, "email")}
                      className="rounded px-2.5 py-1 text-xs border border-[#F7F5F0]/20 text-[#E6DFD3] hover:border-[#C59B6D] transition cursor-pointer flex items-center gap-1"
                    >
                      {copiedField === "email" ? (
                        <>
                          <Check className="w-3 h-3 text-[#52B788]" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#C59B6D]" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Location */}
                  <div className="rounded-lg flex items-center gap-3 bg-[#11221B]/70 border border-[#F7F5F0]/10 p-3.5">
                    <MapPin className="w-4 h-4 text-[#C59B6D] shrink-0" />
                    <div>
                      <div className="text-[11px] text-[#E6DFD3]/65">
                        Localização
                      </div>
                      <div className="text-sm text-[#F7F5F0]">
                        {BROKER_DATA.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#F7F5F0]/12">
                  <a
                    href={BROKER_DATA.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-lg bg-[#C59B6D] text-[#11221B] text-xs uppercase tracking-[0.18em] font-bold hover:bg-[#d6b084] transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Chamar no WhatsApp Agora</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Lead Form */}
            <div className="lg:col-span-7 rounded-xl bg-[#152820] border border-[#C59B6D]/35 p-7 sm:p-10 shadow-lg">
              <div className="border-b border-[#F7F5F0]/12 pb-5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B6D] block">
                  Mensagem Rápida
                </span>
                <h3 className="font-serif text-3xl text-[#F7F5F0] mt-1">
                  Solicitar informações ou agendar visita
                </h3>
              </div>

              <form onSubmit={handleWhatsAppSubmit} className="space-y-5 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="lead-name"
                      className="block text-xs font-medium text-[#E6DFD3]/90 mb-2"
                    >
                      Seu Nome *
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Digite seu nome"
                      className="w-full bg-[#11221B] border border-[#F7F5F0]/20 px-4 py-3 text-sm text-[#F7F5F0] placeholder:text-[#E6DFD3]/35 focus:outline-none focus:border-[#C59B6D]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lead-company"
                      className="block text-xs font-medium text-[#E6DFD3]/90 mb-2"
                    >
                      Empresa / Construtora (Opcional)
                    </label>
                    <input
                      id="lead-company"
                      type="text"
                      value={leadCompany}
                      onChange={(e) => setLeadCompany(e.target.value)}
                      placeholder="Nome da empresa"
                      className="w-full bg-[#11221B] border border-[#F7F5F0]/20 px-4 py-3 text-sm text-[#F7F5F0] placeholder:text-[#E6DFD3]/35 focus:outline-none focus:border-[#C59B6D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="lead-phone"
                      className="block text-xs font-medium text-[#E6DFD3]/90 mb-2"
                    >
                      Telefone / WhatsApp *
                    </label>
                    <input
                      id="lead-phone"
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="(47) 99999-9999"
                      className="w-full bg-[#11221B] border border-[#F7F5F0]/20 px-4 py-3 text-sm text-[#F7F5F0] placeholder:text-[#E6DFD3]/35 focus:outline-none focus:border-[#C59B6D]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lead-email"
                      className="block text-xs font-medium text-[#E6DFD3]/90 mb-2"
                    >
                      E-mail *
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="seu@email.com.br"
                      className="w-full bg-[#11221B] border border-[#F7F5F0]/20 px-4 py-3 text-sm text-[#F7F5F0] placeholder:text-[#E6DFD3]/35 focus:outline-none focus:border-[#C59B6D]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lead-profile"
                    className="block text-xs font-medium text-[#E6DFD3]/90 mb-2"
                  >
                    Qual o seu objetivo com o terreno?
                  </label>
                  <select
                    id="lead-profile"
                    value={leadProfile}
                    onChange={(e) => setLeadProfile(e.target.value)}
                    className="w-full bg-[#11221B] border border-[#F7F5F0]/20 px-4 py-3 text-sm text-[#F7F5F0] focus:outline-none focus:border-[#C59B6D]"
                  >
                    <option value="Incorporadora / Construtora">
                      Incorporadora / Construtora
                    </option>
                    <option value="Galpão Logístico / Comercial (BR-470)">
                      Galpão Logístico / Comercial (BR-470)
                    </option>
                    <option value="Sede de Empresa / Indústria">
                      Sede de Empresa / Indústria
                    </option>
                    <option value="Investimento Patrimonial">
                      Investimento Patrimonial
                    </option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="bg-[#11221B] border border-[#C59B6D]/30 p-4 flex items-start gap-3">
                  <input
                    id="lead-dossier"
                    type="checkbox"
                    checked={requestDossier}
                    onChange={(e) => setRequestDossier(e.target.checked)}
                    className="mt-1 accent-[#C59B6D] w-4 h-4"
                  />
                  <label
                    htmlFor="lead-dossier"
                    className="text-xs text-[#E6DFD3]/90 leading-relaxed cursor-pointer"
                  >
                    <strong className="text-[#F7F5F0] block">
                      Quero receber o Dossiê Técnico do Terreno
                    </strong>
                    Inclui número da Matrícula, Inscrição Cadastral e resumo dos
                    pareceres da Prefeitura.
                  </label>
                </div>

                <div>
                  <label
                    htmlFor="lead-message"
                    className="block text-xs font-medium text-[#E6DFD3]/90 mb-2"
                  >
                    Mensagem (Opcional)
                  </label>
                  <textarea
                    id="lead-message"
                    rows={3}
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    placeholder="Escreva sua dúvida ou sugestão de horário para conversa..."
                    className="w-full bg-[#11221B] border border-[#F7F5F0]/20 px-4 py-3 text-sm text-[#F7F5F0] placeholder:text-[#E6DFD3]/35 focus:outline-none focus:border-[#C59B6D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#C59B6D] text-[#11221B] text-xs uppercase tracking-[0.16em] font-bold hover:bg-[#d6b084] transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar pelo WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-[#C59B6D]/50 text-[#F7F5F0] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#C59B6D]/15 transition cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#C59B6D]" />
                    <span>Enviar por E-mail</span>
                  </button>
                </div>

                {submittedChannel && (
                  <div className="p-4 bg-[#1D352B] border border-[#52B788] text-xs text-[#F7F5F0]">
                    Sua mensagem foi preparada para envio direto a{" "}
                    <strong>
                      {BROKER_DATA.name} ({BROKER_DATA.creci})
                    </strong>
                    !
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* EDITORIAL FOOTER */}
      <footer className="bg-[#0B1712] text-[#E6DFD3]/70 border-t border-[#C59B6D]/25 py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <RWLogo className="h-12" variant="bronze" />
            <div>
              <div className="font-serif text-xl text-[#F7F5F0] tracking-widest">
                TERRA / BLUMENAU
              </div>
              <div className="text-xs text-[#E6DFD3]/75 mt-0.5">
                {PROPERTY_SUMMARY.address} · {PROPERTY_SUMMARY.neighborhood} ·{" "}
                {PROPERTY_SUMMARY.city}/{PROPERTY_SUMMARY.state}
              </div>
              <div className="text-xs text-[#C59B6D] mt-1">
                Corretor Responsável: {BROKER_DATA.name} · {BROKER_DATA.creci} ·{" "}
                {BROKER_DATA.phoneDisplay} · {BROKER_DATA.email}
              </div>
            </div>
          </div>

          <div className="text-xs text-[#E6DFD3]/60 max-w-md md:text-right leading-relaxed">
            Área total de 10.361,46 m² conforme levantamento planialtimétrico. A
            viabilidade de projetos específicos depende de aprovação junto aos
            órgãos municipais.
          </div>
        </div>
      </footer>
    </div>
  );
}
