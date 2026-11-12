export interface Coordinate {
  lat: number;
  lng: number;
  utmE?: number;
  utmN?: number;
  label?: string;
}

export interface BoundarySegment {
  id: string;
  from: [number, number];
  to: [number, number];
  lengthMeters: string;
  confrontante: string;
  type: "frontage-primary" | "frontage-secondary" | "chamfer" | "neighbor";
}

export interface MapPOI {
  id: string;
  name: string;
  category: "acesso" | "logistica" | "servico-publico" | "infraestrutura";
  categoryLabel: string;
  lat: number;
  lng: number;
  distance: string;
  travelTime: string;
  description: string;
}

export const BROKER_DATA = {
  name: "Robert Wolff",
  role: "Corretor de Imóveis",
  creci: "CRECI 2758",
  phoneDisplay: "(47) 9 8889-1211",
  phoneClean: "5547988891211",
  email: "rrwimoveis@gmail.com",
  location: "Blumenau, Santa Catarina",
  whatsappUrl:
    "https://wa.me/5547988891211?text=Ol%C3%A1%20Robert%2C%20acessei%20o%20portal%20TERRA%20%2F%20BLUMENAU%20(Rua%201%C2%BA%20de%20Janeiro%2C%202650)%20e%20gostaria%20de%20solicitar%20o%20Dossi%C3%AA%20T%C3%A9cnico%20e%20informa%C3%A7%C3%B5es%20comerciais.",
  dossierWhatsappUrl:
    "https://wa.me/5547988891211?text=Ol%C3%A1%20Robert%2C%20gostaria%20de%20solicitar%20o%20Dossi%C3%AA%20T%C3%A9cnico%20Completo%20(Matr%C3%ADcula%20e%20Condicionantes%20T%C3%A9cnicas)%20do%20terreno%20na%20Rua%201%C2%BA%20de%20Janeiro%2C%202650.",
};

export const PROPERTY_SUMMARY = {
  conceptTitle: "TERRA / BLUMENAU",
  subtitle: "Ativo Territorial para Incorporação, Logística & Operações Corporativas",
  address: "Rua 1º de Janeiro, nº 2.650",
  secondaryFrontage: "Esquina com Rua Frieda Beck",
  neighborhood: "Bairro Fidélis",
  city: "Blumenau",
  state: "Santa Catarina",
  cep: "89055-000",
  totalAreaM2: "10.361,46 m²",
  totalAreaNumeric: 10361.46,
  approximateHeadlineArea: "10.000 m²",
  priceStatus: "Sob Consulta",
  centerCoordinates: {
    lat: -26.857203,
    lng: -49.075768,
    dms: "26°51'25.9\"S 49°04'32.8\"W",
    utmZone: "22S (SIRGAS 2000)",
    utmCenter: "E 691.175 m · N 7.027.930 m",
  },
  frontages: {
    rua1DeJaneiro: {
      name: "Rua 1º de Janeiro",
      totalMeters: "67,58 m",
      segments: "47,29 m + 20,29 m",
      chamfer: "10,63 m (esquina)",
      roadAlignmentWidth: "24,00 m entre alinhamentos prediais (12,00 m do eixo)",
      orientation: "Frente Oeste (Principal)",
    },
    ruaFriedaBeck: {
      name: "Rua Frieda Beck",
      totalMeters: "180,72 m",
      northwestSection: "58,39 m (32,74 m + 25,65 m)",
      eastCurvedSection: "122,33 m (11 segmentos contínuos)",
      roadAlignmentWidth: "10,00 m entre alinhamentos prediais (5,00 m do eixo)",
      orientation: "Frentes Norte e Leste",
    },
  },
  topography: {
    minElevation: "30 m",
    maxElevation: "60 m",
    amplitude: "30 m (aclive gradual Oeste → Sudeste)",
    floodSafety: "100% Livre de Cota de Enchente",
    floodSafetyDetail:
      "Situado integralmente entre as cotas altimétricas de 30 m e 60 m acima do nível do mar — muito acima das cotas de alerta e inundação de Blumenau (10 m e 12 m).",
  },
  zoning: {
    summary: "Duplo Zoneamento: ZI-1 & ZOC",
    zones: [
      {
        code: "ZI-1",
        name: "Zona Industrial 1",
        position: "Porção Frontal Oeste (Rua 1º de Janeiro) e Faixa Sul",
        minLotArea: "125,00 m²",
        minFrontage: "5,00 m",
        description:
          "Vocação para operações logísticas, galpões corporativos, indústria limpa, comércio e serviços de apoio ao eixo rodoviário da BR-470.",
      },
      {
        code: "ZOC",
        name: "Zona de Ocupação Controlada",
        position: "Porção Central, Norte e Leste (Rua Frieda Beck)",
        minLotArea: "500,00 m²",
        minFrontage: "12,00 m",
        description:
          "Porção mais elevada do terreno, com topografia em anfiteatro natural, vista aberta e vocação para implantação controlada integrada ao relevo.",
      },
    ],
  },
};

/**
 * Exact georeferenced vertices of the 10.361,46 m² property polygon
 * Converted from UTM Zone 22S (SIRGAS 2000 / WGS84) survey 579_PLANTA_PLANIALT_WOLFF_A2_V1.pdf
 */
export const PROPERTY_POLYGON_VERTICES: Coordinate[] = [
  { lat: -26.856582, lng: -49.076318, utmE: 691121.5, utmN: 7027999.5, label: "V1 · R. 1º de Janeiro (Início Chanfro)" },
  { lat: -26.856521, lng: -49.076236, utmE: 691129.8, utmN: 7028006.1, label: "V2 · Esquina R. Frieda Beck (10,63m)" },
  { lat: -26.856600, lng: -49.075918, utmE: 691161.2, utmN: 7027996.8, label: "V3 · R. Frieda Beck (32,74m)" },
  { lat: -26.856695, lng: -49.075683, utmE: 691184.4, utmN: 7027985.8, label: "V4 · R. Frieda Beck (25,65m)" },
  { lat: -26.856973, lng: -49.075851, utmE: 691167.2, utmN: 7027955.3, label: "V5 · Divisa Ewaldo Mund Oeste (35,00m)" },
  { lat: -26.857103, lng: -49.075586, utmE: 691193.3, utmN: 7027940.5, label: "V6 · Divisa Ewaldo Mund Sul (30,00m)" },
  { lat: -26.856825, lng: -49.075418, utmE: 691210.5, utmN: 7027971.0, label: "V7 · Retorno R. Frieda Beck (35,00m)" },
  { lat: -26.856871, lng: -49.075343, utmE: 691217.9, utmN: 7027965.7, label: "V8 · R. Frieda Beck (9,12m)" },
  { lat: -26.856931, lng: -49.075275, utmE: 691224.5, utmN: 7027958.9, label: "V9 · R. Frieda Beck (9,48m)" },
  { lat: -26.857015, lng: -49.075216, utmE: 691230.2, utmN: 7027949.5, label: "V10 · R. Frieda Beck (10,98m)" },
  { lat: -26.857085, lng: -49.075184, utmE: 691233.3, utmN: 7027941.7, label: "V11 · R. Frieda Beck (8,41m)" },
  { lat: -26.857203, lng: -49.075150, utmE: 691236.4, utmN: 7027928.6, label: "V12 · R. Frieda Beck (13,46m)" },
  { lat: -26.857328, lng: -49.075123, utmE: 691238.9, utmN: 7027914.7, label: "V13 · R. Frieda Beck (14,07m)" },
  { lat: -26.857452, lng: -49.075096, utmE: 691241.3, utmN: 7027900.9, label: "V14 · R. Frieda Beck (14,04m)" },
  { lat: -26.857563, lng: -49.075069, utmE: 691243.8, utmN: 7027888.6, label: "V15 · R. Frieda Beck (12,51m)" },
  { lat: -26.857674, lng: -49.075032, utmE: 691247.3, utmN: 7027876.2, label: "V16 · R. Frieda Beck (12,92m)" },
  { lat: -26.857762, lng: -49.074981, utmE: 691252.2, utmN: 7027866.4, label: "V17 · R. Frieda Beck (10,93m)" },
  { lat: -26.857795, lng: -49.074928, utmE: 691257.4, utmN: 7027862.6, label: "V18 · Extremo Sudeste R. Frieda Beck (6,41m)" },
  { lat: -26.857701, lng: -49.075965, utmE: 691154.5, utmN: 7027874.8, label: "V19 · Divisa Sul JE Comércio (103,64m)" },
  { lat: -26.857220, lng: -49.075795, utmE: 691172.3, utmN: 7027927.8, label: "V20 · Divisa Ademir Goldacker Leste (55,94m)" },
  { lat: -26.857172, lng: -49.076382, utmE: 691114.1, utmN: 7027934.2, label: "V21 · Divisa Ademir Goldacker Norte (58,59m)" },
  { lat: -26.856990, lng: -49.076356, utmE: 691117.0, utmN: 7027954.3, label: "V22 · R. 1º de Janeiro (20,29m)" },
];

/**
 * Zoning sub-polygons for interactive map overlay (ZI-1 West/South vs ZOC Central/East)
 */
export const ZONING_ZI1_POLYGON: [number, number][] = [
  [-26.856582, -49.076318],
  [-26.856521, -49.076236],
  [-26.856575, -49.076020],
  [-26.857195, -49.076060],
  [-26.857220, -49.075795],
  [-26.857701, -49.075965],
  [-26.857765, -49.075350],
  [-26.857795, -49.074928],
  [-26.857701, -49.075965],
  [-26.857220, -49.075795],
  [-26.857172, -49.076382],
  [-26.856990, -49.076356],
];

export const MAP_POIS: MapPOI[] = [
  {
    id: "acesso-principal",
    name: "Frente Principal · Rua 1º de Janeiro, 2.650",
    category: "acesso",
    categoryLabel: "Ponto de Acesso",
    lat: -26.85678,
    lng: -49.07634,
    distance: "Testada 67,58 m",
    travelTime: "Acesso imediato",
    description:
      "Via arterial pavimentada (gabarito de 24 m no trecho), com ligação direta de 220 m até a marginal e o trevo da Rodovia Federal BR-470.",
  },
  {
    id: "acesso-frieda-beck",
    name: "Frente Secundária · Rua Frieda Beck",
    category: "acesso",
    categoryLabel: "Ponto de Acesso",
    lat: -26.85662,
    lng: -49.07595,
    distance: "Testada 180,72 m",
    travelTime: "Esquina + lateral leste",
    description:
      "Segunda frente oficial que contorna o setor norte e leste da gleba, viabilizando acessos independentes de carga, serviço ou portaria.",
  },
  {
    id: "trevo-br470",
    name: "Trevo & Marginal Rodovia BR-470",
    category: "logistica",
    categoryLabel: "Eixo Logístico",
    lat: -26.85465,
    lng: -49.07615,
    distance: "220 m ao norte",
    travelTime: "1 min",
    description:
      "Conexão direta com o principal corredor logístico do Vale do Itajaí (BR-470), ligando rapidamente à BR-101, portos de Itajaí/Navegantes e interior de SC.",
  },
  {
    id: "aeroporto-quero-quero",
    name: "Aeroporto Regional de Blumenau (Quero-Quero)",
    category: "logistica",
    categoryLabel: "Infraestrutura Aérea",
    lat: -26.8325,
    lng: -49.0902,
    distance: "3,1 km",
    travelTime: "5 min",
    description:
      "Aeródromo executivo e regional situado na Itoupava Central, com acesso rápido pela BR-470.",
  },
  {
    id: "terminal-fortaleza",
    name: "Terminal Urbano Fortaleza & Eixo Comercial",
    category: "servico-publico",
    categoryLabel: "Transporte Público",
    lat: -26.8669,
    lng: -49.0631,
    distance: "2,2 km",
    travelTime: "4 min",
    description:
      "Integração do transporte coletivo municipal para colaboradores e operação urbana no eixo Fidélis / Fortaleza / Itoupava Norte.",
  },
  {
    id: "ambulancia-saude-fidelis",
    name: "Unidade de Saúde ESF Fidélis / Rede Pública",
    category: "servico-publico",
    categoryLabel: "Saúde & Serviços Públicos",
    lat: -26.8518,
    lng: -49.0815,
    distance: "1,1 km",
    travelTime: "3 min",
    description:
      "Equipamentos públicos de saúde, educação básica e infraestrutura urbana consolidada (rede elétrica trifásica, água e fibra óptica).",
  },
  {
    id: "norte-shopping",
    name: "Norte Shopping & Polo Empresarial BR-470",
    category: "infraestrutura",
    categoryLabel: "Serviços & Comércio",
    lat: -26.8462,
    lng: -49.0985,
    distance: "3,4 km",
    travelTime: "5 min",
    description:
      "Principal centro de compras, serviços, hotelaria e gastronomia da zona norte de Blumenau, às margens da BR-470.",
  },
  {
    id: "centro-blumenau",
    name: "Centro Financeiro & Prefeitura de Blumenau",
    category: "infraestrutura",
    categoryLabel: "Centro Urbano",
    lat: -26.9165,
    lng: -49.0661,
    distance: "7,8 km",
    travelTime: "14 min",
    description:
      "Conexão fluida ao centro administrativo de Blumenau através do corredor da Rua 1º de Janeiro / Rua 2 de Setembro e Via Expressa.",
  },
];

/**
 * Technical Perimeter Table from 579_PLANTA_PLANIALT_WOLFF_A2_V1.pdf
 */
export const PERIMETER_SEGMENTS_TABLE = [
  {
    sector: "Frente Oeste · Rua 1º de Janeiro",
    segments: "47,29 m + 20,29 m",
    totalLength: "67,58 m",
    confrontation: "Logradouro Público (Alinhamento predial de 24,00 m)",
  },
  {
    sector: "Esquina Noroeste (Chanfro)",
    segments: "10,63 m",
    totalLength: "10,63 m",
    confrontation: "Confluência Rua 1º de Janeiro × Rua Frieda Beck",
  },
  {
    sector: "Frente Norte · Rua Frieda Beck (Trecho 1)",
    segments: "32,74 m + 25,65 m",
    totalLength: "58,39 m",
    confrontation: "Logradouro Público (Alinhamento predial de 10,00 m)",
  },
  {
    sector: "Divisa Interna Norte (Recorte Confrontante)",
    segments: "35,00 m + 30,00 m + 35,00 m",
    totalLength: "100,00 m",
    confrontation: "Ewaldo Mund (Matrícula nº 25.220 – 3º Ofício CRI)",
  },
  {
    sector: "Frente Leste · Rua Frieda Beck (Trecho 2 em Curva)",
    segments: "9,12 + 9,48 + 10,98 + 8,41 + 13,46 + 14,07 + 14,04 + 12,51 + 12,92 + 10,93 + 6,41 m",
    totalLength: "122,33 m",
    confrontation: "Logradouro Público (Rua Frieda Beck)",
  },
  {
    sector: "Divisa Sul",
    segments: "103,64 m",
    totalLength: "103,64 m",
    confrontation: "JE - Comércio e Locações Ltda EPP (Matrícula nº 25.679 – 3º Ofício CRI)",
  },
  {
    sector: "Divisa Sudoeste",
    segments: "55,94 m + 58,59 m",
    totalLength: "114,53 m",
    confrontation: "Ademir Goldacker (Matrícula nº 25.018 – 3º Ofício CRI)",
  },
];

/**
 * Confidential Technical Dossier Data (Reserved for the ready-to-send Executive Dossier page/document)
 * Never mentions any subdivision/desmembramento proposal.
 */
export const TECHNICAL_DOSSIER_DATA = {
  documentCode: "DOSSIÊ EXECUTIVO · TERRA-BNU-2650",
  updatedAt: "Novembro 2026",
  registry: {
    matricula: "Matrícula nº 14.093 — 3º Ofício de Registro de Imóveis de Blumenau/SC",
    inscricaoCadastral: "2-5-11-3-7 (Lote Cadastral 268)",
    cadastroIptu: "8878",
    enderecoOficial: "Rua 1º de Janeiro, nº 2.650 — Bairro Fidélis — Blumenau/SC",
    areaPlanta: "10.361,46 m²",
  },
  roadAlignments: [
    {
      street: "Rua 1º de Janeiro (Trecho entre BR-470 e imóvel nº 3509)",
      widthBetweenAlignments: "24,00 m (12,00 m para cada lado do eixo da via)",
    },
    {
      street: "Rua Frieda Beck",
      widthBetweenAlignments: "10,00 m (5,00 m para cada lado do eixo da via)",
    },
  ],
  technicalOpinions: [
    {
      agency: "SEDECI / DGeo — Diretoria de Geologia, Análise e Riscos Naturais",
      status: "Parecer Favorável ao Uso e Ocupação",
      reference: "Decreto Municipal nº 12.227/2019",
      summary:
        "A Diretoria de Geologia, Análise e Riscos Naturais (DGeo) atesta formalmente que não se opõe ao uso e ocupação do solo no imóvel. Na carta geotécnica municipal, a gleba apresenta faixa frontal em classe de Baixo a Inexistente Perigo/Risco e porção central/leste em classe de Médio Perigo/Risco potencial, cabendo ao projeto executivo o estudo geotécnico padrão de engenharia conforme art. 8º do Decreto nº 12.227/2019.",
    },
    {
      agency: "SEPLAN — Secretaria de Planejamento Urbano",
      status: "Zoneamento Misto ZI-1 e ZOC · Fora de Cota de Enchente",
      reference: "Plano Diretor LC nº 1.181/2018 e Código de Zoneamento",
      summary:
        "Imóvel inserido em Zona Industrial 1 (ZI-1) na porção oeste/sul e Zona de Ocupação Controlada (ZOC) na porção central/leste. Totalmente livre das manchas de inundação de 10 m e 12 m (cotas altimétricas do terreno entre 30 m e 60 m).",
    },
    {
      agency: "SEMMAS — Secretaria Municipal do Meio Ambiente e Sustentabilidade",
      status: "Diretrizes Ambientais de Licenciamento",
      reference: "Lei Federal nº 12.651/2012, Lei nº 11.428/2006 e LC Municipal nº 1.735/2026",
      summary:
        "Para futura aprovação de projetos no imóvel urbano, deve-se observar a locação topográfica de eventuais recursos hídricos e faixas de APP no quadrante sudoeste (projeção oriunda de lotes lindeiros) e a verificação de Área de Cobertura Florestal Mínima Preservada (ACFMP) nos termos da IN 01 SEMMAS.",
    },
    {
      agency: "DECEA / ANAC — Área de Influência do Aeródromo (AIA)",
      status: "Superfície de Proteção de Voo Visual / Área Cônica",
      reference: "PBZPA / PBZPH Aeródromo de Blumenau",
      summary:
        "Por estar no setor norte do município (próximo ao Aeroporto Quero-Quero), o imóvel integra a Área Cônica / Superfície de Proteção de Voo Visual, devendo o gabarito vertical de futuras edificações observar as cotas do COMAER/DECEA.",
    },
  ],
};

