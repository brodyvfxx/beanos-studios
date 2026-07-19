// Beanos Studios — film catalog
// tags are used by the "What should I watch?" quiz to score matches
const FILMS = [
  {
    id: "cf1",
    order: 1,
    title: "CF 1: Hats in Crime",
    videoId: "epjDG_ZHP0g",
    tags: ["mystery", "crime", "parody"],
    description: "When the sister of a cowgirl dies to an unknown killer, Detective Cheesy Fingers must come to the case and solve the mystery.",
    cast: [
      ["Noran Keefer", "Murdered Lady, News Reporter"],
      ["Brodizzle Mooligan", "Sister of Murdered Lady"],
      ["TeeJay Part", "Detective Cheesy Fingers"],
      ["Norah Johncocks", "The Killer"]
    ]
  },
  {
    id: "prison-heist",
    order: 2,
    title: "Prison Heist",
    videoId: "dKyTSjdEg6c",
    tags: ["crime", "heist", "action"],
    description: "When three prisoners escape from prison, they go on a quest to run from the police.",
    cast: [
      ["Noran Keefer", "Spit Boy, Prison Guard #2"],
      ["Brodizzle Mooligan", "Prison Escapee"],
      ["TeeJay Part", "Prison Guard"],
      ["Norah Johncocks", "Prison Escapee"],
      ["Jorey Tree", "Prison Escapee"]
    ]
  },
  {
    id: "alone-at-home",
    order: 3,
    title: "Alone at Home",
    videoId: "215Lrny2YZU",
    tags: ["family", "home", "parody"],
    description: "When Clevin wishes his family would all go away, they actually do. He faces the consequences of his wishes when a group of robbers pretend to be Loofa delivery drivers.",
    cast: [
      ["Noran Keefer", "Mother"],
      ["Brodizzle Mooligan", "Weird Boy, Loofa Robber"],
      ["TeeJay Part", "Faint Boy, Robber"],
      ["Norah Johncocks", "Shoulder Boy, Robber"],
      ["Jorey Tree", "Home Alone Kid (Clevin)"],
      ["Tricky Leyasu", "Mouth Boy, Jeremy (Robber)"],
      ["Caden Johncocks", "Little Boy"]
    ]
  },
  {
    id: "tales-of-a-tender",
    order: 4,
    title: "Tales of a Tender",
    videoId: "QWANDmqDGpQ",
    tags: ["western", "absurd"],
    description: "A set of stories taking place in a Wild Western bar.",
    cast: [
      ["Noran Keefer", "Bartender"],
      ["Norah Johncocks", "Lead, Fisher Man Boy"],
      ["Jorey Tree", "Jorkitus Smithen, Fish"],
      ["Tricky Leyasu", "Billy Bob, Toenail the Tiger"]
    ]
  },
  {
    id: "planet-battles",
    order: 5,
    title: "Planet Battles",
    videoId: "jcLOyLJUUKI",
    tags: ["scifi", "alien", "epic", "parody"],
    description: "In this unlikely tale, 2 twins are birthed and split up across the galaxy. When they meet in a bar, they have to face something they've never even imagined before.",
    cast: [
      ["Noran Keefer", "Leia"],
      ["Norah Johncocks", "Luke"],
      ["TeeJay Part", "Darth Vader"],
      ["Hoodsen Fountain", "Padme, Yoda, Bounty Hunter #1"],
      ["Colin Wood", "Obi Wan Colinobi, Bounty Hunter #2"],
      ["Brodizzle Mooligan", "Han Solo"]
    ]
  },
  {
    id: "starvation-games",
    order: 6,
    title: "Starvation Games",
    videoId: "GOqKleUGhbw",
    tags: ["dystopian", "competition", "parody"],
    description: "A group of people's survival skills are put to the test in an intense game in the wilderness.",
    cast: [
      ["Noran Keefer", "Scissorland, Rue"],
      ["Norah Johncocks", "Baggy Pants Sidekick"],
      ["TeeJay Part", "Baggy Pants, Announcer"],
      ["Hoodsen Fountain", "Pink Haired Guy"],
      ["Colin Wood", "Carrot"],
      ["Brodizzle Mooligan", "Sheryl"],
      ["Ken Taco", "Katshit Everdeed"],
      ["Tricky Leyasu", "Mr. Leyasu"],
      ["Sterla Bell", "Random Girl At Start"]
    ]
  },
  {
    id: "the-experiment",
    order: 7,
    title: "The Experiment",
    videoId: "JK2OboEArRM",
    tags: ["horror", "scifi", "mystery", "dark"],
    description: "An evil scientist places a group of people into a simulation where something is most definitely off.",
    cast: [
      ["Noran Keefer", "Entity"],
      ["Norah Johncocks", "Boy In Blue Sweatshirt"],
      ["TeeJay Part", "Celery"],
      ["Colin Wood", "Scientist, Carrot"],
      ["Brodizzle Mooligan", "Kid In Grey, Entity"],
      ["Ken Taco", "Entity"],
      ["Tricky Leyasu", "Trickey"],
      ["Mudison Morgan", "Red Haired Girl"],
      ["Muckenzie Oldwater", "Random Girl"]
    ]
  },
  {
    id: "water-bottle-kicker",
    order: 8,
    title: "The Water Bottle Kicker",
    videoId: "Wiciwd39vIQ",
    tags: ["mystery", "absurd"],
    description: "A mystery of who kicked the water bottle.",
    cast: [
      ["Noran Keefer", "Cameraman Guy Who Dies"],
      ["Norah Johncocks", "Yacob, Pink Cowboy Hat Guy"],
      ["TeeJay Part", "Ball Bouncer, Jorkus"],
      ["Colin Wood", "The Water Bottle Kicker/Carrot"],
      ["Brodizzle Mooligan", "The Water Bottle Kickee"]
    ]
  },
  {
    id: "health-project",
    order: 9,
    title: "Health Project",
    videoId: "9-VqUQglzFs",
    tags: ["family", "satire"],
    description: "A gaming addiction ruins the life of a high school student named Jordan.",
    cast: [
      ["Noran Keefer", "Mr. Diffensmirchtz (Teacher), Mr. Diffensmirchtz Twin Brother (Principal)"],
      ["Norah Johncocks", "Mrs. Palford (Jordan's Mom)"],
      ["Tricky Leyasu", "Jordan (Fat Guy)"]
    ]
  },
  {
    id: "the-gabafather",
    order: 10,
    title: "The Gabafather",
    videoId: "v_pMh7-lo1g",
    tags: ["crime", "parody"],
    description: "An old narcoleptic cop tries to teach a young cop how to be a cop. They have to face a master Mafia gang.",
    cast: [
      ["Noran Keefer", "Police Chief Dickens"],
      ["Norah Johncocks", "Mafia Boss"],
      ["TeeJay Part", "Young Cop"],
      ["Brodizzle Mooligan", "Old Cop"],
      ["Hoodsen Fountain", "Tony"],
      ["Tricky Leyasu", "Josepie"],
      ["Oliver (Cat)", "Kitty Meow Meow"],
      ["Caden Johncocks", "Lil Pepperoni"],
      ["Jorey Tree", "Don"]
    ]
  },
  {
    id: "earthcake-debbie",
    order: 11,
    title: "Earthcake Debbie",
    videoId: "JfMGUuLt1C0",
    tags: ["family", "absurd", "apocalyptic"],
    description: "When an earthquake strikes the world, a family has to go into a secret bunker. A giant king takes over the world, or something.",
    cast: [
      ["Noran Keefer", "Chip/Chud"],
      ["Norah Johncocks", "Grandma/Lucielle/Hairy Ball"],
      ["Hoodsen Fountain", "Dutch"],
      ["Tricky Leyasu", "King Debbie"],
      ["Jorey Tree", "Grandpa Jo"],
      ["Colin Wood", "Chip/Chud"]
    ]
  },
  {
    id: "bolan-supreme",
    order: 12,
    title: "Bolan Supreme",
    videoId: "1iNQXZE1X6w",
    tags: ["sports", "epic", "absurd"],
    description: "Bolan, a young man with a dream to play ping pong, has to go to hell and back in pursuit of greatness.",
    cast: [
      ["Noran Keefer", "Bolan"],
      ["Norah Johncocks", "Guger"],
      ["Hoodsen Fountain", "Guger's Girl, Judson"],
      ["Tricky Leyasu", "Mrs. MacGarvi"],
      ["Jorey Tree", "Jorkus"]
    ]
  },
  {
    id: "fixation",
    order: 13,
    title: "Fixation",
    videoId: "sjVKc8wiJeY",
    tags: ["romance", "dark", "twisted"],
    description: "After breaking the mysterious \"One Wish Willow\" to win his crush's heart, a hopeless romantic finds himself getting exactly what he asked for, but he soon discovers that some desires come at a dark, sinister price.",
    cast: [
      ["Noran Keefer", "Bear"],
      ["Norah Johncocks", "Ian"],
      ["TeeJay Part", "Cat Killer, Shaniqua"],
      ["Hoodsen Fountain", "Waitress, Steve"],
      ["Ken Taco", "Nikki"],
      ["Tricky Leyasu", "Joe's Jewelry Man, Music Store Owner"],
      ["Jorey Tree", "Sarah"]
    ]
  },
  {
    id: "project-slarp",
    order: 14,
    title: "Project Slarp",
    videoId: "NeSjgCYG_qQ",
    tags: ["scifi", "alien", "absurd"],
    description: "After a group of friends try on a mysterious cream called \"SLARP\", they soon discover Earth is being invaded by aliens from Uranus.",
    cast: [
      ["Noran Keefer", "Salesman"],
      ["Norah Johncocks", "Friend"],
      ["TeeJay Part", "Scattergories Guy"],
      ["Tricky Leyasu", "Friend, President Supporter"],
      ["Brodizzle Mooligan", "Alien, President"]
    ]
  }
];

if (typeof module !== "undefined") module.exports = FILMS;
