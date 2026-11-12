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
  category: "acesso" | "mercado" | "comercio" | "educacao" | "parque" | "logistica";
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
    lat: -26.85724,
    lng: -49.07572,
    dms: "26°51'26.1\"S 49°04'32.6\"W",
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
      "Situado integralmente a partir da cota altimétrica de 30 m acima do nível do mar — muito acima das cotas de alerta e inundação de Blumenau (10 m e 12 m).",
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
 * Calibrated directly over Google Satellite imagery
 */
export const PROPERTY_POLYGON_VERTICES: Coordinate[] = [
  { lat: -26.856627, lng: -49.076316, utmE: 691121.52, utmN: 7027994.68, label: "P1 · R. 1º de Janeiro (Início Esquina)" },
  { lat: -26.856589, lng: -49.076295, utmE: 691123.71, utmN: 7027998.87, label: "P2 · Curva de Esquina (Chanfro 10,63m)" },
  { lat: -26.856578, lng: -49.076240, utmE: 691129.16, utmN: 7027999.98, label: "P3 · Esquina R. Frieda Beck" },
  { lat: -26.856649, lng: -49.075920, utmE: 691160.84, utmN: 7027991.65, label: "P4 · R. Frieda Beck (32,74m)" },
  { lat: -26.856729, lng: -49.075678, utmE: 691184.78, utmN: 7027982.43, label: "P5 · R. Frieda Beck (25,65m)" },
  { lat: -26.856954, lng: -49.075812, utmE: 691165.43, utmN: 7027953.27, label: "P6 · Recorte Ewaldo Mund Oeste (35,00m)" },
  { lat: -26.857081, lng: -49.075563, utmE: 691192.57, utmN: 7027940.52, label: "P7 · Recorte Ewaldo Mund Sul (30,00m)" },
  { lat: -26.856838, lng: -49.075406, utmE: 691211.59, utmN: 7027969.90, label: "P8 · Retorno R. Frieda Beck (35,00m)" },
  { lat: -26.856889, lng: -49.075333, utmE: 691218.72, utmN: 7027964.21, label: "P9 · R. Frieda Beck (9,12m)" },
  { lat: -26.856954, lng: -49.075272, utmE: 691224.74, utmN: 7027956.89, label: "P10 · R. Frieda Beck (9,48m)" },
  { lat: -26.857043, lng: -49.075224, utmE: 691229.33, utmN: 7027946.92, label: "P11 · R. Frieda Beck (10,98m)" },
  { lat: -26.857115, lng: -49.075197, utmE: 691231.91, utmN: 7027938.90, label: "P12 · R. Frieda Beck (8,41m)" },
  { lat: -26.857233, lng: -49.075162, utmE: 691235.14, utmN: 7027925.82, label: "P13 · R. Frieda Beck (13,46m)" },
  { lat: -26.857357, lng: -49.075135, utmE: 691237.70, utmN: 7027911.99, label: "P14 · R. Frieda Beck (14,07m)" },
  { lat: -26.857482, lng: -49.075111, utmE: 691239.82, utmN: 7027898.12, label: "P15 · R. Frieda Beck (14,04m)" },
  { lat: -26.857593, lng: -49.075086, utmE: 691242.14, utmN: 7027885.82, label: "P16 · R. Frieda Beck (12,51m)" },
  { lat: -26.857702, lng: -49.075041, utmE: 691246.38, utmN: 7027873.61, label: "P17 · R. Frieda Beck (12,92m)" },
  { lat: -26.857787, lng: -49.074984, utmE: 691251.93, utmN: 7027864.21, label: "P18 · R. Frieda Beck (10,93m)" },
  { lat: -26.857822, lng: -49.074933, utmE: 691256.94, utmN: 7027860.18, label: "P19 · Extremo Sudeste R. Frieda Beck (6,41m)" },
  { lat: -26.857765, lng: -49.075849, utmE: 691153.65, utmN: 7027868.72, label: "P20 · Divisa Sul JE Comércio (103,64m)" },
  { lat: -26.857306, lng: -49.075689, utmE: 691172.13, utmN: 7027921.52, label: "P21 · Divisa Ademir Goldacker Leste (55,94m)" },
  { lat: -26.857233, lng: -49.076386, utmE: 691113.55, utmN: 7027927.66, label: "P22 · Divisa Ademir Goldacker Norte (58,59m)" },
  { lat: -26.857052, lng: -49.076352, utmE: 691117.24, utmN: 7027947.60, label: "P23 · R. 1º de Janeiro (20,29m)" },
];

/**
 * Exact 220m route along Rua 1º de Janeiro from the property frontage to the BR-470 (Rod. Ingo Hering) interchange
 */
export const BR470_ROUTE_COORDS: [number, number][] = [
  [-26.857233, -49.076386],
  [-26.857253, -49.076512],
  [-26.857479, -49.076599],
  [-26.857778, -49.076747],
  [-26.858372, -49.077034],
  [-26.858823, -49.077266],
  [-26.859226, -49.077568],
  [-26.859411, -49.077283],
];

/**
 * Zoning sub-polygons for interactive map overlay (ZI-1 West/South vs ZOC Central/East)
 */
export const ZONING_ZI1_POLYGON: [number, number][] = [
  [-26.856627, -49.076316],
  [-26.856578, -49.076240],
  [-26.856625, -49.076020],
  [-26.857250, -49.076050],
  [-26.857280, -49.075796],
  [-26.857759, -49.075974],
  [-26.857795, -49.075380],
  [-26.857822, -49.074933],
  [-26.857759, -49.075974],
  [-26.857280, -49.075796],
  [-26.857233, -49.076386],
  [-26.857052, -49.076352],
];

/**
 * Verified Real-World POIs around Rua 1º de Janeiro, 2650 (Fidélis / Itoupava Norte / Fortaleza / Salto do Norte)
 * Coordinates verified via OpenStreetMap building centroids.
 */
export const MAP_POIS: MapPOI[] = [
  // Acessos & Logística
  {
    id: "trevo-br470",
    name: "Trevo & Marginal BR-470 (Rod. Ingo Hering)",
    category: "acesso",
    categoryLabel: "Acesso Rodoviário",
    lat: -26.859411,
    lng: -49.077283,
    distance: "220 m ao sul",
    travelTime: "1 min",
    description:
      "Ligação direta pela Rua 1º de Janeiro até a marginal e o trevo da BR-470 (Rodovia Ingo Hering), principal corredor logístico do Vale do Itajaí.",
  },
  {
    id: "acesso-principal",
    name: "Frente Principal · Rua 1º de Janeiro, 2.650",
    category: "acesso",
    categoryLabel: "Testada Principal",
    lat: -26.856840,
    lng: -49.076335,
    distance: "67,58 m de frente",
    travelTime: "Acesso imediato",
    description:
      "Via arterial pavimentada (gabarito de 24 m), ligando o imóvel diretamente à BR-470 (220 m ao sul) e ao corredor comercial da Itoupava Norte / Fortaleza.",
  },
  {
    id: "acesso-frieda-beck",
    name: "Frente Secundária · Rua Frieda Beck",
    category: "acesso",
    categoryLabel: "Testada Secundária",
    lat: -26.856649,
    lng: -49.075920,
    distance: "180,72 m de frente",
    travelTime: "Esquina + lateral",
    description:
      "Segunda frente oficial que contorna o setor norte e leste do terreno, permitindo separar acessos de moradores, clientes ou docas de serviço.",
  },

  // Supermercados & Atacadistas próximos
  {
    id: "brasil-atacadista",
    name: "Brasil Atacadista (Rio Branco / BR-470)",
    category: "mercado",
    categoryLabel: "Supermercado & Atacado",
    lat: -26.854295,
    lng: -49.085471,
    distance: "1,0 km",
    travelTime: "2 min",
    description:
      "Grande atacarejo e centro de compras diárias situado a apenas 1 km do terreno, junto ao eixo da BR-470.",
  },
  {
    id: "fort-atacadista-norte",
    name: "Fort Atacadista (Itoupava Norte / BR-470)",
    category: "mercado",
    categoryLabel: "Supermercado & Atacado",
    lat: -26.862137,
    lng: -49.087042,
    distance: "1,3 km",
    travelTime: "3 min",
    description:
      "Unidade do Fort Atacadista às margens da BR-470 na Itoupava Norte, a 3 minutos do imóvel.",
  },
  {
    id: "cooper-mafisa",
    name: "Cooper Super Mafisa (Itoupava Norte)",
    category: "mercado",
    categoryLabel: "Supermercado & Serviços",
    lat: -26.861976,
    lng: -49.088923,
    distance: "1,4 km",
    travelTime: "3 min",
    description:
      "Unidade da Cooper (Cooperativa Mafisa) com supermercado completo, farmácia e lojas de apoio na região norte.",
  },
  {
    id: "atacadao-br470",
    name: "Atacadão (BR-470)",
    category: "mercado",
    categoryLabel: "Supermercado & Atacado",
    lat: -26.863933,
    lng: -49.089980,
    distance: "1,6 km",
    travelTime: "3 min",
    description:
      "Centro de abastecimento e atacarejo junto ao polo comercial do Norte Shopping na BR-470.",
  },
  {
    id: "rede-top-fortaleza",
    name: "Rede Top Supermercados (Fortaleza)",
    category: "mercado",
    categoryLabel: "Supermercado",
    lat: -26.872231,
    lng: -49.061951,
    distance: "2,1 km",
    travelTime: "4 min",
    description:
      "Supermercado completo no coração comercial do bairro Fortaleza.",
  },

  // Shoppings, Gastronomia & Centros Comerciais
  {
    id: "wila-gastronomica",
    name: "Wila Gastronômica (Trevo BR-470)",
    category: "comercio",
    categoryLabel: "Gastronomia & Convivência",
    lat: -26.855902,
    lng: -49.085934,
    distance: "1,0 km",
    travelTime: "2 min",
    description:
      "Polo gastronômico e espaço de lazer na Rua Dr. Pedro Zimmermann, a apenas 2 minutos do terreno.",
  },
  {
    id: "norte-shopping",
    name: "Blumenau Norte Shopping",
    category: "comercio",
    categoryLabel: "Shopping Center",
    lat: -26.863733,
    lng: -49.092081,
    distance: "1,8 km",
    travelTime: "3 min",
    description:
      "Principal shopping center da zona norte de Blumenau, com âncoras nacionais, cinema, bancos, praça de alimentação e serviços.",
  },
  {
    id: "shopping-park-europeu",
    name: "Shopping Park Europeu (Via Expressa)",
    category: "comercio",
    categoryLabel: "Shopping Center",
    lat: -26.886682,
    lng: -49.068455,
    distance: "3,3 km",
    travelTime: "6 min",
    description:
      "Grande shopping center na Via Expressa (Rua 2 de Setembro / Fortaleza), com rápido deslocamento a partir da Rua 1º de Janeiro.",
  },

  // Faculdades, Universidades & Saúde
  {
    id: "uniasselvi-campus1",
    name: "Uniasselvi — Campus I (BR-470)",
    category: "educacao",
    categoryLabel: "Faculdade & Ensino Superior",
    lat: -26.865554,
    lng: -49.087093,
    distance: "1,4 km",
    travelTime: "3 min",
    description:
      "Sede universitária da Uniasselvi às margens da BR-470, gerando forte demanda estudantil, residencial e de serviços no entorno imediato.",
  },
  {
    id: "furb-campus5-hospital",
    name: "FURB — Campus 5 & Hospital Universitário",
    category: "educacao",
    categoryLabel: "Universidade & Hospital",
    lat: -26.856604,
    lng: -49.054253,
    distance: "2,1 km",
    travelTime: "4 min",
    description:
      "Campus da saúde da FURB e Hospital Universitário na Fortaleza Alta, a poucos minutos do imóvel.",
  },
  {
    id: "ufsc-blumenau",
    name: "UFSC — Universidade Federal (Campus Blumenau)",
    category: "educacao",
    categoryLabel: "Universidade Federal",
    lat: -26.872489,
    lng: -49.094740,
    distance: "2,5 km",
    travelTime: "5 min",
    description:
      "Campus das Engenharias e Ciências Exatas da UFSC na Rua João Pessoa / Salto do Norte.",
  },
  {
    id: "furb-campus2",
    name: "FURB — Campus 2 (Complexo Tecnológico)",
    category: "educacao",
    categoryLabel: "Universidade & Inovação",
    lat: -26.891006,
    lng: -49.084290,
    distance: "3,8 km",
    travelTime: "7 min",
    description:
      "Centro Tecnológico e de Engenharias da FURB e Instituto Gene de Inovação na Rua São Paulo.",
  },
  {
    id: "furb-campus1",
    name: "FURB — Campus 1 (Sede Central)",
    category: "educacao",
    categoryLabel: "Universidade (Sede Central)",
    lat: -26.905493,
    lng: -49.078723,
    distance: "5,4 km",
    travelTime: "8 min",
    description:
      "Principal campus universitário de Blumenau (Rua Antônio da Veiga), com rápido deslocamento pelos corredores viários da região norte.",
  },

  // Parque Público Municipal
  {
    id: "parque-das-itoupavas",
    name: "Parque das Itoupavas (Parque Alcântaro Corrêa)",
    category: "parque",
    categoryLabel: "Parque Público Municipal",
    lat: -26.860171,
    lng: -49.082002,
    distance: "700 m",
    travelTime: "1 min",
    description:
      "Principal parque público da Região Norte de Blumenau (mais de 14.000 m²), na Rua 1º de Janeiro junto à BR-470, com ciclovia, pista de caminhada, quadras, playground e pet place.",
  },

  // Infraestrutura Regional
  {
    id: "aeroporto-quero-quero",
    name: "Aeroporto Regional de Blumenau (Quero-Quero)",
    category: "logistica",
    categoryLabel: "Infraestrutura Aérea",
    lat: -26.832500,
    lng: -49.090200,
    distance: "3,1 km",
    travelTime: "5 min",
    description:
      "Aeródromo executivo e regional situado na Itoupava Central, com acesso rápido pela BR-470.",
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
        "Imóvel inserido em Zona Industrial 1 (ZI-1) na porção oeste/sul e Zona de Ocupação Controlada (ZOC) na porção central/leste. Totalmente livre das manchas de inundação de 10 m e 12 m (cota altimétrica do terreno a partir de 30 m).",
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
