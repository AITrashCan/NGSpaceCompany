import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const en = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/en.json'), 'utf8'));
const fr = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/fr.json'), 'utf8'));

const enReplacements = {
    // 星体→Spirit Realm
    "leilingT5_desc": "This massive array is as vast as a spirit realm, fusing Leiling from common spirit elements via spirit core fusion.",
    "taiyiT4_desc": "Flying spirit buckets into the atmosphere of a gaseous spirit realm — this is our best plan!",
    "planets": "Spirit Realms",

    // build→forge/construct
    "help1_desc1": "The first thing you can do is start gathering spirit materials. Click the Spirit Materials tab at the top left of the screen to enter the spirit materials interface. You can click any spirit material to enter its operation interface, where you can manually gain spirit materials or forge spirit artifacts for self-production. While all spirit materials can be forged, it is recommended to prioritize Lingstone and Lingmu in the early game.",
    "help2_desc1": "To unlock technique research, you must first forge a Lingstone Collector, requiring 10 Lingstone and 5 Lingmu. This is the first step toward self-operation. The Techniques tab is where you set up Wudao Platforms to produce Wudao, and where you discover and research new techniques.",
    "help2_desc2": "The first technique you can research is 'Sumeru Mustard Seed', which allows you to forge Storage to expand the maximum holding of each spirit material. This becomes necessary when forging spirit artifacts costs over 50 spirit materials. You can also research 'Qi Gathering Art', opening a new world of Zhenqi production.",
    "help4_desc1": "To unlock Mystic Realm exploration, you first need to forge a Sky Ship. This should be your first major goal. Forging a Sky Ship requires substantial spirit materials; you may need to use higher-tier spirit artifacts to obtain them in reasonable time. Secondly, launching the Sky Ship requires Lingmai, which can be refined in Lingmai Prospecting. These consume substantial Lingye and Xuantan. Once your Sky Ship is ready, press the Ascend button to unlock Mystic Realm exploration and new techniques.",
    "help3_desc1": "Each spirit artifact in the game produces different amounts, which can make spirit material balance difficult, especially Zhenqi, Xuantan, and Lingmu, as they are consumed by other spirit artifacts. It is recommended to first decide which spirit material's spirit artifact to forge — in most cases Lingstone — then produce the Zhenqi needed for Qi Gathering Arrays. Don't upgrade everything to spirit artifacts at once, or you will face Zhenqi shortage (which is bad, as spirit artifacts cannot operate without Zhenqi). Accumulate Xuantan to forge more spirit artifacts, or enhance the number of Tuna Arts to address this issue.",
    "feizhouPane_desc": "Here you can forge Sky Ships to travel to the stars.",
    "techCangku_desc": "Allows you to forge Storage upgrades, expanding the maximum holding of spirit materials.",
    "techYuanshenCang2_desc": "Upgraded Yuanshen Halls store Yuanshen more efficiently but are larger, requiring more spirit materials to forge.",
    "yuanshenT4_desc": "The Deification Supreme Array is a massive array forged of Xuangang, channeling quasispirit realm power toward gaseous spirit realms, instantly converting spiritual qi into Yuanshen for collection.",
    "mijingYunjin1_desc": "The Celestial Lord is proud of the new monument, teaching you array spirit artifacts and the path of advanced spirit material gathering. Activating this Legacy will allow you to forge Tier 3 spirit artifacts, a more efficient method of spirit material gathering.",
    "mijingTiandao1_desc": "The Celestial Lord observes the newly forged Legacy, granting you a new wave of spirit artifact power surpassing the past. Activating this Legacy enables you to forge Tier 4 spirit material gathering artifacts, more powerful and efficient than any before.",
    "multiBuy": "Batch Forge",
    "build": "Forge",
    "calcModal": "Forge Cost Calculator",

    // extract→gather
    "tiandaoT1": "Tiandao Shard Gathering",
    "lingyeT1": "Lingye Gathering",
    "techTiandao1": "Tiandao Shard Gathering Art",
    "qingqiT5_desc": "'Steal' is too heavy a word. We prefer 'borrowed without return' — when we gather from the periphery of the stars.",
    "hanbingPane_desc": "Hanbing can be refined in the mortal realm, but traveling to the Mingxing Realm and returning fully loaded is far more rewarding. Primarily used for the extreme-cold spirit arts required by Tier 4 spirit artifacts.",

    // speed→rate
    "lingstoneT3_desc": "Spirit Gathering Arrays draw forth Lingstone at astonishing rates.",
    "lingstoneT4_desc": "Lingstone Furnaces twist time and space, drawing forth Lingstone at rates beyond physical limits.",
    "baoshiT2_desc": "Meteorite Iron Veins can gather Meteorite Iron on a large scale. Due to spirit drill hardness requirements, the rate is slower than Lingstone Veins.",
    "baoshiT3_desc": "Iron Condensing Art is one of the strongest spirit drill arts in the spirit realm, thus the rate of gathering Meteorite Iron surpasses all before.",
    "baoshiT4_desc": "Carbyne Spirit Drill is one of the strongest spirit drill arts in the spirit realm, thus the rate of gathering Meteorite Iron surpasses all before.",
    "baoshiT5_desc": "This special spirit artifact condenses spiritual qi into Meteorite Iron, faster in rate than any spirit drill.",
    "yunjinT5_desc": "This array harnesses the power of distant stars, heating Ling Sand into Yunjin at record rates.",
    "hanbingT5_desc": "Extracting heat from spirit materials at extreme rates; you are unsure how to handle it safely, but you did it anyway.",
    "speed": "Rate",

    // yield→production
    "lingmuT3_desc": "Ten Thousand Wood Art accelerates Lingmu growth; though it consumes Lingmai, the production is astonishing.",

    // efficiency→efficacy
    "lingmuT2_desc": "Lingmu Spirit Gardens use spiritual power to drive artifacts gathering Lingmu, with efficacy far exceeding manual labor.",
    "dmResearches_desc": "Every 25 levels of repeatable technique research efficacy grants 2 Tiandao Laws.",

    // upgrade→advancement
    "upgradeJinglian_desc": "Make your spirit artifacts produce more spirit materials. This advancement doubles the spirit material refined per unit of Zhenqi.",
    "upgradeZhenqi1_desc": "After advancing Tuna Art, each produces 4 Zhenqi per second instead of 2.",
    "upgradeZhenqi2_desc": "After advancing Qi Gathering Array, each produces 3 Zhenqi per second instead of 1.5.",
    "upgrade": "Advancement",
    "lingyinT1_desc": "The theoretical problem of star domain travel is about to be overcome. Use this advancement to solve it. This is a one-time advancement that expands your exploration range by 5 light-years.",
    "chiyanMijingPane_desc": "The Chiyan Sect is a fierce sect with strong hatred toward those in power — especially the Biluo Sect. They persistently fight back with all-out attacks. Thus, their enhancements mainly favor more active playstyles.",
    "biluoMijingPane_desc": "The Biluo Sect is the ruling power in the star domain, most dedicated to maintaining the status quo. Opposing change, they practice authoritarian rule, mainly offering enhancements regarding Defensive Grand Arrays and Legacies.",
    "jinguangMijingPane_desc": "The Jinguang Sect grows ever stronger in the star domain, driven by profit, allying with those who support their goals. Their enhancements focus on passive benefits, with numerous self-operating functions.",
    "chiyanChuanchengPane_desc": "The Chiyan Sect is a fierce sect with strong hatred toward those in power — especially the Biluo Sect. They persistently fight back with all-out attacks. Thus, their enhancements mainly favor more active playstyles.",
    "biluoChuanchengPane_desc": "The Biluo Sect is the ruling power in the star domain, most dedicated to maintaining the status quo. Opposing change, they practice authoritarian rule, mainly offering enhancements regarding Defensive Grand Arrays and Legacies.",
    "jinguangChuanchengPane_desc": "The Jinguang Sect grows ever stronger in the star domain, driven by profit, allying with those who support their goals. Their enhancements focus on passive benefits, with numerous self-operating functions.",
    "tiandaoChuanchengPane_desc": "This sect is shrouded in mystery. Though not well understood, a powerful force overlooks the entire star domain, seemingly above the other five sects and their 'trivial' disputes. Enhancements from the Celestial Lord you serve are not constrained by type, varying greatly.",
    "rebirth_desc": "Stepping into new life is a great decision, not to be taken lightly. Once confirmed, you can start anew, preserving the knowledge and experience of your past life, reborn and transcending the past. You will retain all unused Tiandao Laws and your enhancements. Taking this step is a leap not just for this life, but for every ascension. Once activated, you will no longer feel so weak. Note: Even the second ascension requires a completed Grand Array. Note: You will retain all enhancements purchased in your past life.",

    // resource→spirit material
    "tiandaoPane_desc": "Tiandao Shards can only be refined from spiritual power purer than mortal arts, thus Yuanshen is essential for refining this precious spirit material.",
    "techWuhua1_desc": "This technique not only lets you create existing spirit materials but also allows you to refine new spirit elements obtainable only through transformation, such as Tiandao Shards.",
    "techTiandao0_desc": "Tiandao Shards are among the rarest spirit materials in the star domain, artificially refined. All Tiandao Shards that once existed in the star domain have been gathered; now they can only be refined from Zhenqi in spirit artifacts.",
    "techChongqun1_desc": "Imagine a plague of locusts, but worse. These spirit insects double the production of one spirit material for every ten! At the cost of rare Xuantan-based spirit materials, we gladly offer the diagrams of this exquisite art.",
    "techWuhua0_desc": "Five Elements Transformation is an art that mortals only dare dream of. Here, it has become reality. You can convert Zhenqi and Yuanshen into common spirit materials, or with substantial investment into rare spirit materials — those you cannot find and can only obtain through refining.",
    "wuhuaPane_desc": "Five Elements Transformation is an art that mortals only dare dream of. Here, it has become reality. You can convert Zhenqi and Yuanshen into common spirit materials, or with substantial investment into rare spirit materials — those you cannot find and can only obtain through refining.",
    "chongqun_desc": "Imagine a plague of locusts, but worse. These spirit insects double your production for every ten! They can replicate the form of other spirit artifacts and take on their roles. You can choose one spirit material to boost, and change at any time.",
    "boostChanwu_desc": "Production Boost enhances spirit material income by 1%/s per level.",
    "boostLingyun_desc": "For each spirit material that reaches storage capacity, all other spirit materials gain 5% production bonus. Enhance relations by 18 points.",
    "boostTiandaoLaw_desc": "Each unused Tiandao Law enhances all spirit materials (including Wudao) by 1%. Enhance relations by 20 points.",
    "upgradeCangku1_desc": "At the start of each ascension, the maximum storage for all spirit materials is 6,400. (No effect if already above 6,400). Enhance relations by 6 points.",
    "upgradeCangku2_desc": "All Storage no longer consumes 100% of primary spirit material, but 75%. Enhance relations by 14 points.",
    "upgradeCangku3_desc": "Opens a rift in multidimensional space, allowing you to store spirit materials in other dimensions, exceeding default capacity by up to 10x, with production reduced 95% after overflow. Enhance relations by 26 points.",
    "upgradeTier1_desc": "Spirit cost for Tier 1 spirit artifacts of all spirit materials (in spirit materials tab) is reduced by 10%. Enhance relations by 4 points.",
    "techTier5_desc": "Gain research access to Tier 5 spirit material spirit artifacts. These unlock after activating the Tier 4 Tiandao Legacy. Enhance relations by 20 points.",
    "techChongqun0_desc": "Imagine a plague of locusts, but worse. These spirit insects double your production for every ten! They can replicate the form of other spirit artifacts and take on their roles. You can choose one spirit material to boost, and change at any time. Note: Appears in the Furnace of Creation after unlocking. Enhance relations by 17 points.",
    "xuangangT3_desc": "This spirit artifact has been modified with five spirit drills on its front. Greatly enhances spirit material acquisition per second.",
    "leilingT4_desc": "Recycle used Leiling, giving it a second use. Greatly enhances available Leiling per second.",

    // increase→enhance/boost
    "zhenqiS5_desc": "Using spirit insect arts, improve the cluster pools to near-spirit particle scale, causing spirit force fields to stack and overlap, exponentially enhancing the storable Zhenqi capacity.",
    "qingqiT2_desc": "The Gathering Array draws forth Qingqi with spirit-magnetic power, enhancing the gathering rate per second.",
    "upgradeLingmai1_desc": "Lingmai Prospecting (Tier 1) Lingmai production enhanced by 100%. Enhance relations by 7 points.",
    "upgradeZongmen_desc": "All sect relations enhanced by 20. Enhance relations by 20 points.",
    "techYuanshenCang1_desc": "Yuanshen Halls expand the maximum Yuanshen you can store at once.",
    "boostWudao_desc": "Wudao Boost enhances Wudao production by 2% per level.",
    "boostZhenqiCang_desc": "Zhenqi Storage Boost enhances Zhenqi Pool capacity by 1% per level.",

    // auto→self
    "autoWuhua": "Self Five Elements",
    "autoWuhua_desc": "Once activated on a Five Elements spirit material, that spirit material will self-convert at the spirit frequency. Enhance relations by 17 points.",
    "upgradeMijing3_desc": "Dongtian Fudi Legacy self-preforges each ascension. Still needs activation. Enhance relations by 11 points.",
    "jingjiePane_desc": "Here is the current player ranking. Simply register an account to participate; everything self-operates.",
    "jingjiePane_nodata": "Wait for the next self-save to view rankings.",
    "auto": "Self",
    "selectAutoEmcInterval": "Self Spirit Frequency",
    "showToastAutoSave": "Show Self-Save Notification",
    "autoSavingDuration": "Self-Save Interval",
    "account_desc": "Once connected, your achievement spirit messages will be sent to the server spirit archive during self-save, ranking with other players.",

    // system→order/system
    "donatingPane_desc2": "However, I like the matter of donations, because nothing forces you to donate, purely from people's goodwill. If you like this game and want more content faster, if I feel this game is worth investing in, I would gladly spend more time on it.",
    "dmSwarms_desc": "One of the more esoteric systems: Tiandao Laws from spirit insect swarms are calculated using an ancient number sequence: triangular numbers. You gain 1 Tiandao Law when passing each triangular number of spirit insect swarms. For example: 1, 3, 6, 10, 15, 21...",

    // labels
    "help3": "Spirit Material & Zhenqi Balance",
    "resources": "Producing Spirit Materials",
    "producers": "Forged Artifacts",
    "fansuHeading": "Mortal Spirit Materials",
    "lingjieHeading": "Spirit Realm Materials",
    "xianyuHeading": "Immortal Realm Materials",
    "selectResource": "Select Spirit Material",
    "upgradeZhenqiBoost": "Zhenqi Boost Expansion",
    "tiandaoT4_desc": "No need to destroy the star domain — directly forge spirit clouds to create Tiandao Shards!",
    "boostZhenqi_desc": "Zhenqi Boost reduces Zhenqi consumption of all spirit artifacts by 1%/s per level.",

    // speed→agility for disciples
    "diziT2_desc": "Stronger than outer disciples, inner disciples are medium combatants. Stronger attack, but notably slow agility.",
    "diziT3_desc": "Spirit Core Disciples are medium disciples, with decent agility among other attributes. Slightly weaker defense, but attack and agility make up for it, a good choice to fill the disciple team.",
    "diziT4_desc": "Elders are expensive investments, but reward with balanced attack, defense, and agility. They are high-end disciples, both in attributes and cost.",
    "diziT5_desc": "Sect Masters are defensive-heavy disciples, yet can still deal heavy blows with powerful attacks. The main drawback is slow agility, hampering the team's mobility.",
    "wudaoT2_desc": "Set up more efficient Wudao Platforms to explore the Wudao Domain at a swifter rate. Each produces 1 Wudao/s.",
};

const frReplacements = {
    // 星体→Royaume Spirituel
    "leilingT5_desc": "Ce vaste array est aussi immense qu'un royaume spirituel, fusionnant le Leiling des éléments spirituels courants via la fusion de noyaux spirituels.",
    "taiyiT4_desc": "Voler avec des seaux spirituels dans l'atmosphère d'un royaume spirituel gazeux — c'est notre meilleur plan !",
    "planets": "Royaumes Spirituels",

    // build→forger
    "help1_desc1": "La première chose que vous pouvez faire est de commencer à rassembler des matériaux spirituels. Cliquez sur l'onglet Matériaux Spirituels en haut à gauche de l'écran pour accéder à l'interface des matériaux spirituels. Vous pouvez cliquer sur n'importe quel matériau spirituel pour accéder à son interface, où vous pouvez obtenir manuellement des matériaux spirituels ou forger des artéfacts spirituels pour une production autonome. Bien que tous les matériaux spirituels puissent être forgés, il est recommandé de privilégier la Lingstone et le Lingmu au début du jeu.",
    "help2_desc1": "Pour débloquer la recherche de techniques, vous devez d'abord forger un Collecteur de Lingstone, nécessitant 10 Lingstone et 5 Lingmu. C'est la première étape vers le fonctionnement autonome. L'onglet Techniques est l'endroit où vous installez des Plateformes Wudao pour produire du Wudao, et où vous découvrez et recherchez de nouvelles techniques.",
    "help2_desc2": "La première technique que vous pouvez rechercher est 'Graine de Moutarde du Sumeru', qui vous permet de forger des Stockages pour étendre la capacité maximale de chaque matériau spirituel. Cela devient nécessaire quand le coût de forge des artéfacts dépasse 50 matériaux spirituels. Vous pouvez aussi rechercher 'Art du Rassemblement du Qi', ouvrant un nouveau monde de production de Zhenqi.",
    "help4_desc1": "Pour débloquer l'exploration du Royaume Mystique, vous devez d'abord forger un Navire Céleste. C'est votre premier grand objectif. Forger un Navire Céleste nécessite d'importants matériaux spirituels ; vous devrez peut-être utiliser des artéfacts spirituels de niveau supérieur pour les obtenir en temps raisonnable. Ensuite, l'ascension du Navire Céleste nécessite du Lingmai, qui peut être raffiné dans la Prospection Lingmai. Ceux-ci consomment d'importants Lingye et Xuantan. Une fois votre Navire Céleste prêt, appuyez sur le bouton Ascension pour débloquer l'exploration du Royaume Mystique et de nouvelles techniques.",
    "help3_desc1": "Chaque artéfact spirituel du jeu produit différentes quantités, ce qui peut rendre l'équilibre des matériaux spirituels difficile, surtout le Zhenqi, le Xuantan et le Lingmu, car ils sont consommés par d'autres artéfacts. Il est recommandé de déterminer d'abord quels artéfacts spirituels de matériaux forger — dans la plupart des cas la Lingstone — puis produire le Zhenqi nécessaire pour les Arrays de Rassemblement du Qi. Ne transformez pas tout en artéfacts d'un coup, sinon vous ferez face à une pénurie de Zhenqi (ce qui est grave, car les artéfacts ne fonctionnent pas sans Zhenqi). Accumulez du Xuantan pour forger plus d'artéfacts, ou augmentez le nombre d'Arts Tuna pour y remédier.",
    "feizhouPane_desc": "Ici vous pouvez forger des Navires Célestes pour voyager vers les étoiles.",
    "techCangku_desc": "Vous permet de forger des avancées de Stockage, étendant la capacité maximale de matériaux spirituels.",
    "techYuanshenCang2_desc": "Les Salles Yuanshen améliorées stockent le Yuanshen plus efficacement mais sont plus grandes, nécessitant plus de matériaux spirituels à forger.",
    "yuanshenT4_desc": "L'Array Suprême de Déification est un vaste array forgé en Xuangang, canalisant la puissance quasi-spirituelle vers les royaumes spirituels gazeux, convertissant instantanément le qi spirituel en Yuanshen pour la collecte.",
    "mijingYunjin1_desc": "Le Seigneur Céleste est fier du nouveau monument, vous enseignant les artéfacts spirituels d'array et la voie de collecte avancée de matériaux spirituels. Activer cet Héritage vous permettra de forger des artéfacts spirituels de Tier 3, une méthode plus efficace de collecte de matériaux spirituels.",
    "mijingTiandao1_desc": "Le Seigneur Céleste observe l'Héritage nouvellement forgé, vous accordant une nouvelle vague de puissance d'artéfact spirituel dépassant le passé. Activer cet Héritage vous permet de forger des artéfacts de collecte de matériaux spirituels de Tier 4, plus puissants et efficaces que jamais.",
    "multiBuy": "Forge par Lot",
    "build": "Forger",
    "calcModal": "Calculateur de Coût de Forge",

    // extract→rassembler
    "tiandaoT1": "Collecte de Fragments Tiandao",
    "lingyeT1": "Collecte de Lingye",
    "techTiandao1": "Art de Collecte des Fragments Tiandao",
    "qingqiT5_desc": "'Voler' est un mot trop lourd. Nous préférons 'emprunté sans retour' — lorsque nous puisons à la périphérie des étoiles.",
    "hanbingPane_desc": "Le Hanbing peut être raffiné dans le royaume mortel, mais voyager au Royaume Mingxing et revenir chargé est bien plus lucratif. Principalement utilisé pour les arts spirituels de froid extrême requis par les artéfacts de Tier 4.",

    // speed→rythme
    "lingstoneT3_desc": "Les Arrays de Rassemblement Spirituel puisent la Lingstone à des rythmes astonishing.",
    "lingstoneT4_desc": "Les Fourneaux de Lingstone tordent le temps et l'espace, puisant la Lingstone à des rythmes au-delà des limites physiques.",
    "baoshiT2_desc": "Les Veines de Fer de Météorite peuvent puiser le Fer de Météorite à grande échelle. En raison des exigences de dureté des forets spirituels, le rythme est plus lent que les Veines de Lingstone.",
    "baoshiT3_desc": "L'Art de Condensation du Fer est l'un des arts de foret spirituel les plus puissants du royaume spirituel, le rythme de collecte du Fer de Météorite surpassant tout ce qui précède.",
    "baoshiT4_desc": "Le Foret Spirituel Carbyne est l'un des arts de foret spirituels les plus puissants du royaume spirituel, le rythme de collecte du Fer de Météorite surpassant tout ce qui précède.",
    "baoshiT5_desc": "Cet artéfact spirituel spécial condense le qi spirituel en Fer de Météorite, plus rapide en rythme que tout foret spirituel.",
    "yunjinT5_desc": "Cet array exploite la puissance d'étoiles lointaines, chauffant le Sable Spirituel en Yunjin à des rythmes records.",
    "hanbingT5_desc": "Extraire la chaleur des matériaux spirituels à des rythmes extrêmes ; vous n'êtes pas sûr de la manipuler en toute sécurité, mais vous l'avez fait quand même.",
    "speed": "Rythme",

    // yield→production
    "lingmuT3_desc": "L'Art des Dix Mille Bois accélère la croissance du Lingmu ; bien qu'il consume du Lingmai, la production est astonishing.",

    // efficiency→efficacité
    "lingmuT2_desc": "Les Jardins Spirituels Lingmu utilisent la puissance spirituelle pour actionner des artéfacts puisant le Lingmu, avec une efficacité dépassant de loin le travail manuel.",
    "dmResearches_desc": "Tous les 25 niveaux d'efficacité de recherche de techniques répétable accordent 2 Lois Tiandao.",

    // upgrade→avancement
    "upgradeJinglian_desc": "Faites produire plus de matériaux spirituels par vos artéfacts. Cet avancement double les matériaux spirituels raffinés par unité de Zhenqi.",
    "upgradeZhenqi1_desc": "Après l'avancement de l'Art Tuna, chacun produit 4 Zhenqi/s au lieu de 2.",
    "upgradeZhenqi2_desc": "Après l'avancement de l'Array de Rassemblement du Qi, chacun produit 3 Zhenqi/s au lieu de 1,5.",
    "upgrade": "Avancement",
    "lingyinT1_desc": "Le problème théorique du voyage inter-domaine stellaire est sur le point d'être résolu. Utilisez cet avancement pour le résoudre. C'est un avancement unique qui étend votre portée d'exploration de 5 années-lumière.",
    "chiyanMijingPane_desc": "La Secte Chiyan est une secte féroce avec une forte haine envers les détenteurs du pouvoir — surtout la Secte Biluo. Ils luttent persistemment avec des attaques totales. Ainsi, leurs améliorations favorisent principalement un style de jeu plus actif.",
    "biluoMijingPane_desc": "La Secte Biluo est le pouvoir régnant du domaine stellaire, la plus dédiée à maintenir le statu quo. Opposée au changement, elle pratique un règne autoritaire, offrant principalement des améliorations concernant les Grands Arrays Défensifs et les Héritages.",
    "jinguangMijingPane_desc": "La Secte Jinguang grandit sans cesse dans le domaine stellaire, mue par le profit, s'alliant à ceux qui soutiennent ses objectifs. Leurs améliorations se concentrent sur les bénéfices passifs, avec de nombreuses fonctions autonomes.",
    "chiyanChuanchengPane_desc": "La Secte Chiyan est une secte féroce avec une forte haine envers les détenteurs du pouvoir — surtout la Secte Biluo. Ils luttent persistemment avec des attaques totales. Ainsi, leurs améliorations favorisent principalement un style de jeu plus actif.",
    "biluoChuanchengPane_desc": "La Secte Biluo est le pouvoir régnant du domaine stellaire, la plus dédiée à maintenir le statu quo. Opposée au changement, elle pratique un règne autoritaire, offrant principalement des améliorations concernant les Grands Arrays Défensifs et les Héritages.",
    "jinguangChuanchengPane_desc": "La Secte Jinguang grandit sans cesse dans le domaine stellaire, mue par le profit, s'alliant à ceux qui soutiennent ses objectifs. Leurs améliorations se concentrent sur les bénéfices passifs, avec de nombreuses fonctions autonomes.",
    "tiandaoChuanchengPane_desc": "Cette secte est shroudée de mystère. Bien que mal comprise, une force puissante surplombe le domaine stellaire, semblant au-dessus des cinq autres sectes et leurs disputes 'triviales'. Les améliorations du Seigneur Céleste que vous servez ne sont pas contraintes par type, variant grandement.",
    "rebirth_desc": "Entrer dans une nouvelle vie est une grande décision, à ne pas prendre à la légère. Une fois confirmé, vous pouvez recommencer, préservant le savoir et l'expérience de votre vie antérieure, renaissant et transcendant le passé. Vous conserverez toutes les Lois Tiandao inutilisées et vos améliorations. Ce pas est un bond non seulement pour cette vie, mais pour chaque ascension. Une fois activé, vous ne vous sentirez plus si faible. Note : Même la deuxième ascension nécessite un Grand Array complété. Note : Vous conserverez toutes les améliorations achetées dans votre vie antérieure.",

    // resource→matériau spirituel
    "tiandaoPane_desc": "Les Fragments Tiandao ne peuvent être raffinés qu'à partir de puissance spirituelle plus pure que les arts mortels, le Yuanshen est donc essentiel pour raffiner ce précieux matériau spirituel.",
    "techWuhua1_desc": "Cette technique vous permet non seulement de créer des matériaux spirituels existants, mais aussi de raffiner de nouveaux éléments spirituels obtenus uniquement par transformation, comme les Fragments Tiandao.",
    "techTiandao0_desc": "Les Fragments Tiandao sont parmi les matériaux spirituels les plus rares du domaine stellaire, raffinés artificiellement. Tous les Fragments Tiandao ayant existé dans le domaine stellaire ont été puisés ; ils ne peuvent plus être raffinés qu'à partir de Zhenqi dans des artéfacts spirituels.",
    "techChongqun1_desc": "Imaginez une invasion de criquets, mais pire. Ces insectes spirituels doublent la production d'un matériau spirituel pour chaque dixaine ! Au coût de matériaux spirituels rares à base de Xuantan, nous offrons gracieusement les diagrammes de cet art exquis.",
    "techWuhua0_desc": "La Transformation des Cinq Éléments est un art que les mortels n'osent que rêver. Ici, c'est devenu réalité. Vous pouvez convertir Zhenqi et Yuanshen en matériaux spirituels courants, ou avec un investissement important en matériaux spirituels rares — ceux que vous ne pouvez pas trouver et obtenir uniquement par raffinage.",
    "wuhuaPane_desc": "La Transformation des Cinq Éléments est un art que les mortels n'osent que rêver. Ici, c'est devenu réalité. Vous pouvez convertir Zhenqi et Yuanshen en matériaux spirituels courants, ou avec un investissement important en matériaux spirituels rares — ceux que vous ne pouvez pas trouver et obtenir uniquement par raffinage.",
    "chongqun_desc": "Imaginez une invasion de criquets, mais pire. Ces insectes spirituels doublent votre production pour chaque dizaine ! Ils peuvent reproduire la forme d'autres artéfacts spirituels et assumer leurs rôles. Vous pouvez choisir un matériau spirituel à renforcer, et changer à tout moment.",
    "boostChanwu_desc": "Le Boost de Production améliore le revenu de matériaux spirituels de 1%/s par niveau.",
    "boostLingyun_desc": "Pour chaque matériau spirituel atteignant la capacité de stockage, tous les autres matériaux spirituels gagnent 5% de bonus de production. Améliore les relations de 18 points.",
    "boostTiandaoLaw_desc": "Chaque Loi Tiandao inutilisée améliore tous les matériaux spirituels (y compris Wudao) de 1%. Améliore les relations de 20 points.",
    "upgradeCangku1_desc": "Au début de chaque ascension, le stockage maximum de tous les matériaux spirituels est de 6 400. (Sans effet si déjà au-dessus de 6 400). Améliore les relations de 6 points.",
    "upgradeCangku2_desc": "Tous les Stockages ne consomment plus 100% du matériau spirituel principal, mais 75%. Améliore les relations de 14 points.",
    "upgradeCangku3_desc": "Ouvre une faille dans l'espace multidimensionnel, permettant de stocker les matériaux spirituels dans d'autres dimensions, dépassant la capacité par défaut jusqu'à 10x, avec la production réduite de 95% après débordement. Améliore les relations de 26 points.",
    "upgradeTier1_desc": "Le coût spirituel des artéfacts spirituels de Tier 1 pour tous les matériaux spirituels (dans l'onglet matériaux spirituels) est réduit de 10%. Améliore les relations de 4 points.",
    "techTier5_desc": "Accédez à la recherche d'artéfacts spirituels de matériaux spirituels de Tier 5. Ceux-ci se débloquent après activation de l'Héritage Tiandao de Tier 4. Améliore les relations de 20 points.",
    "techChongqun0_desc": "Imaginez une invasion de criquets, mais pire. Ces insectes spirituels doublent votre production pour chaque dizaine ! Ils peuvent reproduire la forme d'autres artéfacts spirituels et assumer leurs rôles. Vous pouvez choisir un matériau spirituel à renforcer, et changer à tout moment. Note : Apparaît dans le Fourneau de Création après déverrouillage. Améliore les relations de 17 points.",
    "xuangangT3_desc": "Cet artéfact spirituel a été modifié avec cinq forets spirituels à l'avant. Améliore grandement l'acquisition de matériaux spirituels par seconde.",
    "leilingT4_desc": "Recyclez le Leiling utilisé, lui donnant une seconde utilisation. Améliore grandement le Leiling disponible par seconde.",

    // increase→améliorer/renforcer
    "zhenqiS5_desc": "Utilisant des arts d'insectes spirituels, améliorez les bassins en grappe à l'échelle quasi-particulaire, faisant se chevaucher les champs de force spirituelle, augmentant exponentiellement la capacité de Zhenqi stockable.",
    "qingqiT2_desc": "L'Array de Rassemblement puise le Qingqi avec la puissance spirituelle-magnétique, améliorant le rythme de puisement par seconde.",
    "upgradeLingmai1_desc": "La Prospection Lingmai (Tier 1) améliore la production de Lingmai de 100%. Améliore les relations de 7 points.",
    "upgradeZongmen_desc": "Toutes les relations de secte améliorées de 20. Améliore les relations de 20 points.",
    "techYuanshenCang1_desc": "Les Salles Yuanshen étendent le maximum de Yuanshen que vous pouvez stocker à la fois.",
    "boostWudao_desc": "Le Boost Wudao améliore la production de Wudao de 2% par niveau.",
    "boostZhenqiCang_desc": "Le Boost de Stockage Zhenqi améliore la capacité du Bassin Zhenqi de 1% par niveau.",

    // auto→auto/autonome
    "autoWuhua": "Cinq Éléments Autonomes",
    "autoWuhua_desc": "Une fois activé sur un matériau spirituel des Cinq Éléments, ce matériau se convertira de lui-même à la fréquence spirituelle. Améliore les relations de 17 points.",
    "upgradeMijing3_desc": "L'Héritage Dongtian Fudi se pré-forge de lui-même à chaque ascension. Nécessite toujours activation. Améliore les relations de 11 points.",
    "jingjiePane_desc": "Voici le classement actuel des joueurs. Enregistrez simplement un compte pour participer ; tout fonctionne de lui-même.",
    "jingjiePane_nodata": "Attendez la prochaine sauvegarde automatique pour voir le classement.",
    "auto": "Autonome",
    "selectAutoEmcInterval": "Fréquence Spirituelle Autonome",
    "showToastAutoSave": "Afficher la Notification de Sauvegarde Autonome",
    "autoSavingDuration": "Intervalle de Sauvegarde Autonome",
    "account_desc": "Une fois connecté, vos messages spirituels d'accomplissements seront envoyés à l'archive spirituelle du serveur lors de la sauvegarde autonome, pour le classement avec d'autres joueurs.",

    // system→système
    "donatingPane_desc2": "Cependant, j'aime les dons, car rien ne vous force à donner, purement par la bonne volonté des gens. Si vous aimez ce jeu et voulez plus de contenu plus vite, si je sens que ce jeu vaut l'investissement, je serais ravi d'y consacrer plus de temps.",
    "dmSwarms_desc": "L'un des systèmes les plus ésotériques : les Lois Tiandao des essaims d'insectes spirituels sont calculées avec une ancienne séquence numérique : les nombres triangulaires. Vous gagnez 1 Loi Tiandao en passant chaque nombre triangulaire d'essaims d'insectes spirituels. Par exemple : 1, 3, 6, 10, 15, 21...",

    // labels
    "help3": "Équilibre des Matériaux Spirituels & Zhenqi",
    "resources": "Production de Matériaux Spirituels",
    "producers": "Artéfacts Forgés",
    "fansuHeading": "Matériaux Spirituels Mortels",
    "lingjieHeading": "Matériaux du Royaume Spirituel",
    "xianyuHeading": "Matériaux du Royaume Immortel",
    "selectResource": "Sélectionner un Matériau Spirituel",
    "upgradeZhenqiBoost": "Expansion du Boost Zhenqi",
    "tiandaoT4_desc": "Nul besoin de détruire le domaine stellaire — forgez directement des nuages spirituels pour créer des Fragments Tiandao !",
    "boostZhenqi_desc": "Le Boost Zhenqi réduit la consommation de Zhenqi de tous les artéfacts spirituels de 1%/s par niveau.",

    // speed→agilité for disciples
    "diziT2_desc": "Plus forts que les disciples extérieurs, les disciples intérieurs sont des combattants moyens. Attaque plus forte, mais agilité notablement lente.",
    "diziT3_desc": "Les Disciples à Noyau Spirituel sont des disciples moyens, avec une agilité décente parmi les autres attributs. Défense légèrement plus faible, mais l'attaque et l'agilité compensent, un bon choix pour remplir l'équipe de disciples.",
    "diziT4_desc": "Les Anciens sont des investissements coûteux, mais récompensent avec un équilibre d'attaque, défense et agilité. Ce sont des disciples de haut niveau, tant en attributs qu'en coût.",
    "diziT5_desc": "Les Maîtres de Secte sont des disciples à forte défense, mais peuvent encore infliger de lourds coups avec des attaques puissantes. Le principal inconvénient est une agilité lente, entravant la mobilité de l'équipe.",
    "wudaoT2_desc": "Installez des Plateformes Wudao plus efficaces pour explorer le Domaine Wudao à un rythme plus rapide. Chacune produit 1 Wudao/s.",
};

let enCount = 0;
for (const [key, newVal] of Object.entries(enReplacements)) {
    if (en[key] !== undefined) { en[key] = newVal; enCount++; }
    else { console.warn('EN Key not found: ' + key); }
}

let frCount = 0;
for (const [key, newVal] of Object.entries(frReplacements)) {
    if (fr[key] !== undefined) { fr[key] = newVal; frCount++; }
    else { console.warn('FR Key not found: ' + key); }
}

fs.writeFileSync(path.join(__dirname, '../src/locales/en.json'), JSON.stringify(en, null, 4) + '\n');
fs.writeFileSync(path.join(__dirname, '../src/locales/fr.json'), JSON.stringify(fr, null, 4) + '\n');
console.log('EN: ' + enCount + ' entries updated');
console.log('FR: ' + frCount + ' entries updated');
