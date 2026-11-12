"use client";

import React from "react";
import Link from "next/link";
import {
  BROKER_DATA,
  PERIMETER_SEGMENTS_TABLE,
  PROPERTY_SUMMARY,
  TECHNICAL_DOSSIER_DATA,
} from "@/data/propertyData";
import { RWLogo } from "@/components/RWLogo";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  MapPin,
  Phone,
  Printer,
  ShieldCheck,
} from "lucide-react";

export default function DossieTecnicoPage() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#11221B] print:bg-white">
      {/* Top Action Bar (Hidden when printing to PDF) */}
      <header className="sticky top-0 z-40 bg-[#11221B] text-[#F7F5F0] border-b border-[#C59B6D]/30 print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#E6DFD3] hover:text-[#C59B6D] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Site</span>
            </Link>
            <span className="text-[#C59B6D]/40">|</span>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C59B6D]">
              {TECHNICAL_DOSSIER_DATA.documentCode}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/docs/579_PLANTA_PLANIALT_WOLFF_A2_V1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider border border-[#C59B6D]/50 text-[#E6DFD3] hover:bg-[#C59B6D]/15 transition"
            >
              <Download className="w-3.5 h-3.5 text-[#C59B6D]" />
              <span>Baixar Planta A2 (PDF)</span>
            </a>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#C59B6D] text-[#11221B] font-semibold hover:bg-[#d6b084] transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar em PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Printable Document Sheet */}
      <main className="max-w-5xl mx-auto my-8 print:my-0 bg-white border border-[#11221B]/15 print:border-none shadow-xl print:shadow-none">
        {/* Dossier Editorial Cover Header */}
        <section className="bg-[#11221B] text-[#F7F5F0] p-8 md:p-12 border-b-4 border-[#C59B6D]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C59B6D]/15 border border-[#C59B6D]/40 text-[#C59B6D] text-[11px] font-mono uppercase tracking-[0.22em]">
                Memorando Técnico Confidencial · Investidores & Incorporadoras
              </div>
              <h1 className="font-serif text-4xl md:text-5xl tracking-tight mt-4 text-[#F7F5F0]">
                TERRA / BLUMENAU
              </h1>
              <p className="text-lg text-[#E6DFD3]/90 mt-2 font-light max-w-2xl">
                Dossiê Registral, Cadastral, Topográfico e Condicionantes Técnicos da
                Gleba — {PROPERTY_SUMMARY.address}, {PROPERTY_SUMMARY.neighborhood}
              </p>
              <div className="mt-5 flex flex-wrap gap-6 text-xs font-mono text-[#E6DFD3]/80">
                <span>ÁREA DE PLANTA: {PROPERTY_SUMMARY.totalAreaM2}</span>
                <span>COORDENADAS: {PROPERTY_SUMMARY.centerCoordinates.dms}</span>
                <span>ATUALIZAÇÃO: {TECHNICAL_DOSSIER_DATA.updatedAt}</span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end justify-between shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-[#F7F5F0]/15">
              <RWLogo className="h-16" variant="light" />
              <div className="mt-3 text-left md:text-right">
                <div className="text-sm font-medium text-[#F7F5F0]">
                  {BROKER_DATA.name}
                </div>
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C59B6D]">
                  {BROKER_DATA.role} · {BROKER_DATA.creci}
                </div>
                <div className="text-xs font-mono text-[#E6DFD3]/80 mt-1">
                  {BROKER_DATA.phoneDisplay} · {BROKER_DATA.email}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="p-8 md:p-12 space-y-10">
          {/* 1. Dados Registrais e Cadastrais */}
          <section>
            <div className="flex items-center justify-between border-b border-[#11221B]/15 pb-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#8C6239] block">
                  Seção 01 · Identificação Oficial
                </span>
                <h2 className="font-serif text-2xl text-[#11221B] mt-0.5">
                  Dados Registrais, Cadastrais e Endereço
                </h2>
              </div>
              <FileText className="w-5 h-5 text-[#8C6239]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="bg-[#F7F5F0] border border-[#11221B]/10 p-4">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#8C6239]">
                  Registro Imobiliário (CRI)
                </div>
                <div className="font-serif text-xl font-semibold text-[#11221B] mt-1">
                  {TECHNICAL_DOSSIER_DATA.registry.matricula}
                </div>
              </div>

              <div className="bg-[#F7F5F0] border border-[#11221B]/10 p-4">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#8C6239]">
                  Inscrição Cadastral & IPTU
                </div>
                <div className="font-serif text-xl font-semibold text-[#11221B] mt-1">
                  IC {TECHNICAL_DOSSIER_DATA.registry.inscricaoCadastral}
                </div>
                <div className="text-xs font-mono text-[#11221B]/70 mt-0.5">
                  Cadastro Municipal IPTU: {TECHNICAL_DOSSIER_DATA.registry.cadastroIptu}
                </div>
              </div>

              <div className="bg-[#F7F5F0] border border-[#11221B]/10 p-4">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#8C6239]">
                  Área Total Mensurada (Planta A2)
                </div>
                <div className="font-serif text-xl font-semibold text-[#11221B] mt-1">
                  {TECHNICAL_DOSSIER_DATA.registry.areaPlanta}
                </div>
                <div className="text-xs font-mono text-[#11221B]/70 mt-0.5">
                  Valor Comercial: {PROPERTY_SUMMARY.priceStatus}
                </div>
              </div>
            </div>

            <div className="mt-4 bg-[#E6DFD3]/45 border border-[#11221B]/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <strong className="uppercase font-mono tracking-wider text-[#11221B]">
                  Logradouro Oficial:
                </strong>{" "}
                <span className="text-[#11221B]/85">
                  {TECHNICAL_DOSSIER_DATA.registry.enderecoOficial} (Esquina com Rua
                  Frieda Beck, a 220 m da Rodovia Federal BR-470)
                </span>
              </div>
              <div className="font-mono text-[#8C6239] shrink-0">
                UTM 22S: {PROPERTY_SUMMARY.centerCoordinates.utmCenter}
              </div>
            </div>
          </section>

          {/* 2. Zoneamento e Parâmetros Viários */}
          <section>
            <div className="border-b border-[#11221B]/15 pb-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#8C6239] block">
                Seção 02 · Enquadramento Urbanístico (SEPLAN)
              </span>
              <h2 className="font-serif text-2xl text-[#11221B] mt-0.5">
                Zoneamento Incidentes & Alinhamentos Viários
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              {PROPERTY_SUMMARY.zoning.zones.map((z) => (
                <div
                  key={z.code}
                  className="border border-[#11221B]/15 bg-[#F7F5F0]/70 p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-[#11221B] text-[#C59B6D] font-mono text-xs font-bold">
                      {z.code}
                    </span>
                    <span className="text-xs font-mono text-[#8C6239]">
                      Lote mín.: {z.minLotArea} · Testada mín.: {z.minFrontage}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#11221B] mt-2">
                    {z.name}
                  </h3>
                  <div className="text-xs font-mono text-[#11221B]/65 mt-0.5">
                    {z.position}
                  </div>
                  <p className="text-xs text-[#11221B]/80 mt-2.5 leading-relaxed">
                    {z.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 border border-[#11221B]/15 p-4 bg-white">
              <div className="text-xs font-mono uppercase tracking-wider text-[#8C6239] mb-2">
                Gabaritos e Distâncias entre Alinhamentos Prediais (SEPLAN)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {TECHNICAL_DOSSIER_DATA.roadAlignments.map((ra) => (
                  <div
                    key={ra.street}
                    className="flex flex-col bg-[#F7F5F0] p-3 border border-[#11221B]/10"
                  >
                    <span className="font-semibold text-[#11221B]">{ra.street}</span>
                    <span className="font-mono text-[#8C6239] mt-1">
                      Distância entre alinhamentos: {ra.widthBetweenAlignments}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Condicionantes Técnicos e Pareceres Municipais */}
          <section>
            <div className="border-b border-[#11221B]/15 pb-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#8C6239] block">
                Seção 03 · Due Diligence Técnica Preliminar
              </span>
              <h2 className="font-serif text-2xl text-[#11221B] mt-0.5">
                Condicionantes Técnicos, Geológicos, Ambientais e Aeronáuticos
              </h2>
            </div>

            <div className="space-y-4 mt-5">
              {TECHNICAL_DOSSIER_DATA.technicalOpinions.map((op) => (
                <div
                  key={op.agency}
                  className="border border-[#11221B]/15 bg-[#F7F5F0]/60 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-serif text-lg font-semibold text-[#11221B]">
                      {op.agency}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#11221B] text-[#E6DFD3] font-mono text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B6D]" />
                      {op.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#8C6239] mt-1">
                    Base Legal / Referência: {op.reference}
                  </div>
                  <p className="text-xs text-[#11221B]/85 mt-2.5 leading-relaxed">
                    {op.summary}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Quadro de Dimensões Perimetrais e Confrontações */}
          <section>
            <div className="border-b border-[#11221B]/15 pb-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#8C6239] block">
                Seção 04 · Levantamento Planialtimétrico Cadastral
              </span>
              <h2 className="font-serif text-2xl text-[#11221B] mt-0.5">
                Quadro Descritivo de Testadas, Segmentos e Confrontantes
              </h2>
            </div>

            <div className="mt-5 overflow-x-auto border border-[#11221B]/15">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#11221B] text-[#F7F5F0] font-mono uppercase text-[10px] tracking-wider">
                    <th className="p-3 border-r border-[#F7F5F0]/15">Setor / Limite</th>
                    <th className="p-3 border-r border-[#F7F5F0]/15">
                      Segmentos de Planta
                    </th>
                    <th className="p-3 border-r border-[#F7F5F0]/15">Extensão Total</th>
                    <th className="p-3">Confrontante / Matrícula</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#11221B]/10">
                  {PERIMETER_SEGMENTS_TABLE.map((row) => (
                    <tr key={row.sector} className="odd:bg-[#F7F5F0]/60 even:bg-white">
                      <td className="p-3 font-medium text-[#11221B]">{row.sector}</td>
                      <td className="p-3 font-mono text-[#11221B]/80">{row.segments}</td>
                      <td className="p-3 font-mono font-bold text-[#8C6239]">
                        {row.totalLength}
                      </td>
                      <td className="p-3 text-[#11221B]/80">{row.confrontation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Footer / Broker Sign-off */}
          <footer className="border-t-2 border-[#11221B] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#11221B]/75">
            <div>
              <div className="font-serif text-base font-semibold text-[#11221B]">
                Atendimento Comercial & Incorporações: {BROKER_DATA.name} (
                {BROKER_DATA.creci})
              </div>
              <div className="mt-1">
                Telefone / WhatsApp: <strong>{BROKER_DATA.phoneDisplay}</strong> ·
                E-mail: <strong>{BROKER_DATA.email}</strong> · {BROKER_DATA.location}
              </div>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-[#8C6239] text-right">
              TERRA / BLUMENAU · {TECHNICAL_DOSSIER_DATA.documentCode}
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

