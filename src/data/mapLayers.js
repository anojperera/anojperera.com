export const mapLayers = [
  {
    id: "human-migration",
    title: "Human migration",
    summary:
      "Schematic paths of early modern humans after they left Africa. The lines follow the broad routes supported by archaeology and genetics. They are not exact tracks, and the dates are rounded.",
    routes: [
      {
        id: "southern",
        name: "Southern route",
        label: "Sahul",
        origin: "Africa",
        when: "about 70,000–50,000 years ago",
        coordinates: [
          [36, -1],
          [40, 8],
          [43, 11],
          [48, 14],
          [56, 18],
          [66, 24],
          [72, 21],
          [76, 10],
          [80, 9],
          [92, 16],
          [98, 8],
          [103, 2],
          [114, -3],
          [124, -6],
          [132, -5],
          [138, -6],
          [143, -9],
          [146, -16],
        ],
      },
      {
        id: "europe",
        name: "Into Europe",
        label: "Europe",
        when: "about 45,000 years ago",
        coordinates: [
          [36, -1],
          [34, 15],
          [32, 26],
          [35, 32],
          [35, 37],
          [29, 41],
          [22, 43],
          [14, 47],
          [5, 49],
          [-1, 51],
        ],
      },
      {
        id: "east-asia",
        name: "Into East Asia",
        label: "East Asia",
        when: "about 45,000–40,000 years ago",
        coordinates: [
          [67, 35],
          [76, 40],
          [88, 45],
          [104, 48],
          [118, 45],
          [128, 42],
          [138, 37],
        ],
      },
      {
        id: "americas",
        name: "Into the Americas",
        label: "South America",
        when: "about 20,000–15,000 years ago",
        coordinates: [
          [142, 52],
          [156, 54],
          [165, 54],
          [175, 52],
          [-175, 52],
          [-164, 55],
          [-152, 60],
          [-135, 58],
          [-125, 50],
          [-123, 40],
          [-116, 30],
          [-106, 22],
          [-92, 14],
          [-80, 8],
          [-76, -4],
          [-72, -16],
          [-68, -28],
          [-68, -40],
        ],
      },
    ],
  },
];

/**
 * Population centres, not geometric centroids, so an arrow ends where people live.
 * The map has the Americas on the west. `via` keeps an Asia–Americas arrow on
 * the Pacific, so it meets the Americas from the west instead of crossing Europe.
 */
const place = {
  Mexico: [-102.0, 23.6],
  "United States": [-98.5, 39.0],
  Afghanistan: [66.0, 33.9],
  Iran: [53.5, 32.5],
  Syria: [38.4, 35.0],
  Turkey: [35.2, 39.0],
  Russia: [40.0, 56.0],
  Ukraine: [31.4, 49.0],
  India: [78.8, 22.5],
  "United Arab Emirates": [54.3, 24.3],
  Venezuela: [-66.6, 7.5],
  Colombia: [-74.0, 4.6],
  China: [113.0, 32.5],
  "Hong Kong": [114.2, 22.3],
  Palestine: [35.2, 31.9],
  Jordan: [36.4, 31.2],
  Bangladesh: [90.3, 23.8],
  "Saudi Arabia": [44.5, 24.0],
  Philippines: [121.8, 13.5],
  Yemen: [47.6, 15.6],
  Pakistan: [69.5, 30.3],
  "Puerto Rico": [-66.5, 18.2],
  Poland: [19.4, 52.0],
  Germany: [10.4, 51.2],
  "Burkina Faso": [-1.6, 12.3],
  "Côte d'Ivoire": [-5.6, 7.5],
  Indonesia: [110.4, -7.3],
  Malaysia: [102.0, 4.0],
  Myanmar: [96.2, 21.2],
  Thailand: [100.8, 15.0],
  Peru: [-75.0, -9.5],
  "El Salvador": [-88.9, 13.7],
  Singapore: [103.8, 1.35],
  "South Sudan": [31.3, 7.3],
  Sudan: [30.2, 15.6],
  Egypt: [30.8, 26.8],
  "Dominican Republic": [-70.2, 18.8],
  Vietnam: [106.0, 16.0],
  Morocco: [-6.8, 31.8],
  Algeria: [2.6, 28.0],
  France: [2.4, 46.6],
  Cuba: [-79.0, 21.7],
  Kazakhstan: [67.0, 48.5],
  Guatemala: [-90.4, 15.5],
  Kuwait: [47.6, 29.3],
  "United Kingdom": [-1.6, 52.6],
  Australia: [145.5, -34.5],
  Spain: [-3.7, 40.2],
  "South Korea": [127.8, 36.4],
  Zimbabwe: [29.8, -19.0],
  "South Africa": [25.5, -28.8],
  Chad: [18.7, 15.0],
  Canada: [-97.0, 53.0],
  Italy: [12.5, 42.5],
  Belgium: [4.4, 50.7],
  Netherlands: [5.3, 52.2],
  Portugal: [-8.2, 39.6],
  Nigeria: [7.5, 9.1],
  Comoros: [43.3, -11.7],
  Angola: [17.5, -12.3],
  Senegal: [-14.5, 14.5],
  Madagascar: [47.0, -19.4],
  Cameroon: [12.0, 5.7],
  Mali: [-3.5, 16.4],
  Guinea: [-11.0, 10.2],
  Mozambique: [34.5, -18.2],
  Tunisia: [9.4, 34.1],
  Congo: [15.2, -0.7],
  "Democratic Republic of the Congo": [23.7, -2.9],
  Ghana: [-1.2, 7.9],
  Kenya: [37.9, 0.2],
};

const viaPacific = {
  "India|United States": [
    [115, 28],
    [150, 36],
    [-170, 40],
    [-135, 40],
  ],
  "China|United States": [
    [145, 36],
    [-175, 40],
    [-135, 40],
  ],
  "Philippines|United States": [
    [155, 24],
    [-165, 32],
    [-130, 38],
  ],
  "Vietnam|United States": [
    [145, 26],
    [-170, 36],
    [-130, 40],
  ],
  "South Korea|United States": [
    [165, 42],
    [-155, 45],
    [-125, 43],
  ],
  "India|Canada": [
    [125, 36],
    [170, 48],
    [-155, 54],
    [-120, 55],
  ],
};

/** Every bilateral stock of at least one million people. UN DESA, mid-2024. */
const corridors = [
  ["Mexico", "United States", 11279561],
  ["Afghanistan", "Iran", 3752317],
  ["Syria", "Turkey", 3563983],
  ["Russia", "Ukraine", 3375095],
  ["India", "United Arab Emirates", 3248545],
  ["India", "United States", 3165238],
  ["Venezuela", "Colombia", 2904873],
  ["Ukraine", "Russia", 2872612],
  ["China", "Hong Kong", 2490414],
  ["China", "United States", 2488775],
  ["Palestine", "Jordan", 2379525],
  ["Bangladesh", "Saudi Arabia", 2362680],
  ["Bangladesh", "India", 2293959],
  ["Philippines", "United States", 2263697],
  ["Yemen", "Saudi Arabia", 1999619],
  ["India", "Saudi Arabia", 1953496],
  ["Pakistan", "Saudi Arabia", 1937044],
  ["Puerto Rico", "United States", 1924799],
  ["Afghanistan", "Pakistan", 1923453],
  ["Poland", "Germany", 1883559],
  ["Burkina Faso", "Côte d'Ivoire", 1820882],
  ["Indonesia", "Malaysia", 1761502],
  ["Myanmar", "Thailand", 1708695],
  ["India", "Pakistan", 1597134],
  ["Venezuela", "Peru", 1596667],
  ["Syria", "Jordan", 1593643],
  ["El Salvador", "United States", 1569946],
  ["Malaysia", "Singapore", 1553249],
  ["South Sudan", "Sudan", 1507976],
  ["Turkey", "Germany", 1504743],
  ["Egypt", "Saudi Arabia", 1498313],
  ["Dominican Republic", "United States", 1483418],
  ["Vietnam", "United States", 1434631],
  ["Ukraine", "Germany", 1416521],
  ["Algeria", "France", 1405235],
  ["Cuba", "United States", 1394750],
  ["Kazakhstan", "Russia", 1321004],
  ["Guatemala", "United States", 1298936],
  ["Myanmar", "Bangladesh", 1246705],
  ["India", "Kuwait", 1231094],
  ["Germany", "United States", 1137577],
  ["Russia", "Germany", 1137448],
  ["United Kingdom", "Australia", 1107102],
  ["Ukraine", "Poland", 1102774],
  ["Morocco", "Spain", 1088408],
  ["South Korea", "United States", 1083174],
  ["Zimbabwe", "South Africa", 1072620],
  ["Sudan", "Chad", 1071034],
  ["Morocco", "France", 1066129],
  ["India", "United Kingdom", 1044779],
  ["Bangladesh", "United Arab Emirates", 1024949],
  ["India", "Canada", 1015630],
  ["Colombia", "United States", 1008875],
];

function corridor(origin, destination, people, via = []) {
  const from = place[origin];
  const to = place[destination];
  if (!from || !to) {
    throw new Error(`Missing place for ${origin} → ${destination}`);
  }
  const id = `${origin}-${destination}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return {
    id,
    name: `${origin} → ${destination}`,
    label: destination === "United Arab Emirates" ? "UAE" : destination,
    origin,
    when:
      people >= 1_000_000
        ? `${(people / 1_000_000).toFixed(1)} million`
        : `${(people / 1_000_000).toFixed(2)} million`,
    people,
    coordinates: [from, ...via, to],
  };
}

const modernMigration = {
  id: "modern-migration",
  title: "Modern migration",
  ink: "text",
  summary:
    "Mid-2024. Each arrow runs from the country of birth to the country of residence. The figure is the number of people in that stock, not the number who moved that year. Thicker arrows are larger. These are all 53 corridors of at least one million people in the UN International Migrant Stock 2024. Arrows between Asia and the Americas cross the Pacific and meet the Americas from the west.",
  routes: corridors.map(([origin, destination, people]) =>
    corridor(origin, destination, people, viaPacific[`${origin}|${destination}`])
  ),
};

mapLayers.push(modernMigration);

/**
 * Africa → Europe stocks of at least 80,000 that are not already on the
 * modern layer. Same UN DESA mid-2024 stock, both sexes. Somalia and Eritrea
 * are omitted: those European stocks are mainly people who fled war.
 * Algeria → France, Morocco → France, and Morocco → Spain stay on the modern layer.
 */
const africaEurope = [
  ["Morocco", "Italy", 472734],
  ["Tunisia", "France", 444223],
  ["Nigeria", "United Kingdom", 324007],
  ["Morocco", "Belgium", 246575],
  ["South Africa", "United Kingdom", 245446],
  ["Comoros", "France", 231788],
  ["Angola", "Portugal", 201961],
  ["Senegal", "France", 176632],
  ["Morocco", "Netherlands", 176423],
  ["Côte d'Ivoire", "France", 169206],
  ["Madagascar", "France", 162751],
  ["Egypt", "Italy", 157018],
  ["Morocco", "Germany", 156555],
  ["Ghana", "United Kingdom", 154782],
  ["Kenya", "United Kingdom", 137817],
  ["Zimbabwe", "United Kingdom", 132869],
  ["Cameroon", "France", 127995],
  ["Senegal", "Italy", 127427],
  ["Mali", "France", 120393],
  ["Democratic Republic of the Congo", "France", 120178],
  ["Tunisia", "Italy", 117917],
  ["Nigeria", "Italy", 112792],
  ["Senegal", "Spain", 101026],
  ["Congo", "France", 94890],
  ["Guinea", "France", 92446],
  ["Mozambique", "Portugal", 90640],
  ["Democratic Republic of the Congo", "Belgium", 88896],
  ["Algeria", "Spain", 83122],
];

const africaEuropeLayer = {
  id: "africa-europe",
  title: "Africa to Europe",
  ink: "accent",
  dash: true,
  summary:
    "Mid-2024. People born in Africa and living in Europe, for every such corridor of at least 80,000 people that is not already on the modern layer. These are the work, family, and older labor routes. Stocks of people who fled the wars in Somalia and Eritrea are left off. Algeria → France, Morocco → France, and Morocco → Spain stay on the modern layer. The figure is the stock, not the number who moved that year. United Nations Department of Economic and Social Affairs, Population Division (2024). International Migrant Stock 2024.",
  routes: africaEurope.map(([origin, destination, people]) =>
    corridor(origin, destination, people)
  ),
};

mapLayers.push(africaEuropeLayer);
