export interface QuizQuestion {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TrainerLevel {
  level: number;
  title: string;
  minXp: number;
  badge: string;
}

export const TRAINER_LEVELS: TrainerLevel[] = [
  { level: 1, title: "Rookie Trader", minXp: 0, badge: "🌱" },
  { level: 2, title: "PokéMart Regular", minXp: 100, badge: "🛒" },
  { level: 3, title: "Professor's Aide", minXp: 250, badge: "📖" },
  { level: 4, title: "Gym Challenger", minXp: 450, badge: "⚔️" },
  { level: 5, title: "Elite Strategist", minXp: 700, badge: "🧠" },
  { level: 6, title: "League Veteran", minXp: 1000, badge: "🏆" },
  { level: 7, title: "Champion Investor", minXp: 1350, badge: "👑" },
  { level: 8, title: "Master of the Market", minXp: 1700, badge: "⭐" },
];

export const XP_PER_CORRECT = 15;
export const XP_BONUS_PERFECT = 10;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── SUPPLY & DEMAND (8) ──────────────────────────────────────────
  {
    id: "supply-demand-q1",
    lessonId: "supply-demand",
    question:
      "A shiny Gyarados card is super rare and tons of trainers want one. What usually happens to its price?",
    options: [
      "The price goes down because it's hard to find",
      "The price goes up because supply is low and demand is high",
      "The price stays the same no matter what",
      "Nintendo prints more copies to lower the price",
    ],
    correctIndex: 1,
    explanation:
      "When something is scarce (low supply) and lots of people want it (high demand), prices rise — just like a shiny Gyarados at a card show!",
  },
  {
    id: "supply-demand-q2",
    lessonId: "supply-demand",
    question:
      "A shop suddenly has 10,000 common Caterpie cards and not many buyers. What will likely happen to Caterpie prices?",
    options: [
      "Prices will skyrocket",
      "Prices will drop because supply is high and demand is low",
      "Prices will double overnight",
      "The government will set a minimum price",
    ],
    correctIndex: 1,
    explanation:
      "Too much supply and not enough demand pushes prices down — even common cards can flood the market!",
  },
  {
    id: "supply-demand-q3",
    lessonId: "supply-demand",
    question: "In economics, what does 'demand' mean?",
    options: [
      "How many items a company can produce",
      "How much people want to buy something at a given price",
      "The cost of making a product",
      "How rare a Pokémon card is",
    ],
    correctIndex: 1,
    explanation:
      "Demand is how much buyers want a product. More demand usually means higher prices — like everyone rushing to buy the latest Pikachu promo!",
  },
  {
    id: "supply-demand-q4",
    lessonId: "supply-demand",
    question:
      "A new Pikachu card form gets announced and hype explodes, but only a few copies exist. What happens?",
    options: [
      "Price drops because Pikachu is too popular",
      "Price stays flat until more copies are printed",
      "Price shoots up because demand is high and supply is low",
      "The card becomes worthless from overhype",
    ],
    correctIndex: 2,
    explanation:
      "Hype creates demand, but if supply is tiny, prices can soar fast — classic supply and demand in action!",
  },
  {
    id: "supply-demand-q5",
    lessonId: "supply-demand",
    question: "True or false: A rare card is always a good investment.",
    options: [
      "True — rare always means valuable",
      "False — rarity alone doesn't guarantee a good investment",
      "True — supply is always low for rare cards",
      "False — only common cards are good investments",
    ],
    correctIndex: 1,
    explanation:
      "Rarity helps, but you also need demand! A rare card nobody wants won't gain value — same with stocks nobody believes in.",
  },
  {
    id: "supply-demand-q6",
    lessonId: "supply-demand",
    question:
      "Eevee is one of the most popular Pokémon ever. How does that popularity affect demand for Eevee cards?",
    options: [
      "It lowers demand because everyone already has one",
      "It has no effect on demand",
      "It increases demand because more people want Eevee products",
      "It only affects supply, not demand",
    ],
    correctIndex: 2,
    explanation:
      "Popularity drives demand! When lots of fans love a Pokémon (or a brand), more people want to buy related cards and products.",
  },
  {
    id: "supply-demand-q7",
    lessonId: "supply-demand",
    question:
      "A card is suddenly trending on social media and prices are climbing fast. What's the smartest move?",
    options: [
      "Buy immediately before it goes higher",
      "Don't rush — research why it's trending and check if the price makes sense",
      "Sell everything you own to buy more",
      "Ignore it completely — trends never matter",
    ],
    correctIndex: 1,
    explanation:
      "Trending hype can inflate prices temporarily. Smart trainers research before buying — FOMO (fear of missing out) can lead to overpaying!",
  },
  {
    id: "supply-demand-q8",
    lessonId: "supply-demand",
    question: "Stock prices are mainly driven by…",
    options: [
      "The CEO's favorite Pokémon",
      "Supply and demand — how many shares are available vs. how many people want them",
      "Government-set prices",
      "The company's age in years",
    ],
    correctIndex: 1,
    explanation:
      "Just like cards at a trade show, stock prices move based on how many buyers and sellers are in the market!",
  },

  // ── WHO SETS VALUE (8) ───────────────────────────────────────────
  {
    id: "who-sets-value-q1",
    lessonId: "who-sets-value",
    question: "Who ultimately sets the price of a Pokémon card at a trade show?",
    options: [
      "The Pokémon Company",
      "Nintendo headquarters",
      "The buyers and sellers negotiating with each other",
      "A single expert appraiser",
    ],
    correctIndex: 2,
    explanation:
      "Markets are conversations between buyers and sellers. The price is whatever both sides agree on — not what a company dictates!",
  },
  {
    id: "who-sets-value-q2",
    lessonId: "who-sets-value",
    question:
      "You think your Venusaur card is worth $50, but similar cards are selling for $20. What's the real market price?",
    options: [
      "$50 — your opinion sets the price",
      "$20 — what buyers are actually paying",
      "$35 — the average of your guess and the market",
      "Whatever you paid for it originally",
    ],
    correctIndex: 1,
    explanation:
      "Market price is what people actually pay, not what you hope it's worth. Your personal value and market value can differ!",
  },
  {
    id: "who-sets-value-q3",
    lessonId: "who-sets-value",
    question:
      "A seller wants $100 for a card but the highest buyer offer (bid) is only $60. What happens?",
    options: [
      "The trade happens at $80 automatically",
      "No trade happens until buyer and seller agree on a price",
      "The government sets the price at $80",
      "The seller must accept $60",
    ],
    correctIndex: 1,
    explanation:
      "When bid (what buyers offer) and ask (what sellers want) don't match, no trade occurs. This is how stock exchanges work too!",
  },
  {
    id: "who-sets-value-q4",
    lessonId: "who-sets-value",
    question:
      "Nintendo announces an amazing new Pokémon game and its stock price jumps the same day. Who caused that jump?",
    options: [
      "Nintendo set the price directly",
      "Traders buying and selling based on the news",
      "The government approved the price change",
      "Random chance with no reason",
    ],
    correctIndex: 1,
    explanation:
      "Good news makes more people want to buy (higher demand), so traders bid prices up. The market reacts — companies don't set stock prices!",
  },
  {
    id: "who-sets-value-q5",
    lessonId: "who-sets-value",
    question: "What is 'intrinsic value'?",
    options: [
      "The price a card sold for yesterday",
      "The true underlying worth based on real facts, not just hype",
      "Whatever the most expensive listing says",
      "The price printed on the card",
    ],
    correctIndex: 1,
    explanation:
      "Intrinsic value is what something is truly worth based on fundamentals — like a company's earnings — separate from what the market is charging right now.",
  },
  {
    id: "who-sets-value-q6",
    lessonId: "who-sets-value",
    question: "True or false: A single expert always sets the price of every stock.",
    options: [
      "True — experts control all prices",
      "False — millions of buyers and sellers set prices through trading",
      "True — only on the NYSE",
      "False — only the CEO sets prices",
    ],
    correctIndex: 1,
    explanation:
      "No single person controls the stock market. Prices emerge from all the trades happening every second!",
  },
  {
    id: "who-sets-value-q7",
    lessonId: "who-sets-value",
    question:
      "A stock you own drops 10% in one day. What's the best first step?",
    options: [
      "Panic-sell immediately",
      "Research why it dropped and decide calmly based on facts",
      "Buy more without thinking",
      "Ignore it forever no matter what",
    ],
    correctIndex: 1,
    explanation:
      "Price drops happen! Smart investors research the reason before acting — sometimes it's just noise, sometimes it's a real warning sign.",
  },
  {
    id: "who-sets-value-q8",
    lessonId: "who-sets-value",
    question:
      "The same Charizard card sells for $200 at one shop and $150 at another. Why?",
    options: [
      "One shop is breaking the law",
      "Different buyers, sellers, and conditions create different prices in different places",
      "The card changed value between shops",
      "Prices are always identical everywhere",
    ],
    correctIndex: 1,
    explanation:
      "Markets aren't perfectly uniform. Location, timing, condition, and who's buying all affect the price — just like stocks on different exchanges!",
  },

  // ── FUNDAMENTALS (8) ─────────────────────────────────────────────
  {
    id: "fundamentals-q1",
    lessonId: "fundamentals",
    question: "What are a company's 'fundamentals'?",
    options: [
      "Its logo and mascot design",
      "Real financial facts like revenue, profit, and debt",
      "How many social media followers it has",
      "The stock price from last week",
    ],
    correctIndex: 1,
    explanation:
      "Fundamentals are the real numbers — how much money a company makes, owes, and grows. They're like a Pokémon's true battle stats!",
  },
  {
    id: "fundamentals-q2",
    lessonId: "fundamentals",
    question:
      "A Charizard card looks amazing but has weak stats in battle. What's the investing lesson?",
    options: [
      "Looks are everything — buy the prettiest card",
      "Check the real stats (fundamentals), not just the hype or appearance",
      "Weak stats mean it's a better investment",
      "Stats don't matter at all",
    ],
    correctIndex: 1,
    explanation:
      "A flashy company (or card) might look great but have weak fundamentals. Always check the real numbers before investing!",
  },
  {
    id: "fundamentals-q3",
    lessonId: "fundamentals",
    question: "What are a company's 'earnings'?",
    options: [
      "How much revenue it brings in total",
      "Its profit — revenue minus expenses",
      "How many employees it has",
      "The amount of stock it issued",
    ],
    correctIndex: 1,
    explanation:
      "Earnings = profit. A company can have huge revenue but low earnings if expenses are too high — like spending all your prize money on Poké Balls!",
  },
  {
    id: "fundamentals-q4",
    lessonId: "fundamentals",
    question:
      "A company reports 20% revenue growth this year. What does that signal?",
    options: [
      "The company is definitely going bankrupt",
      "The company is growing its sales — a positive fundamental signal",
      "Revenue growth doesn't matter for investors",
      "The stock price must drop",
    ],
    correctIndex: 1,
    explanation:
      "Strong revenue growth means the company is selling more — like a Pokémon gaining XP and leveling up. It's a healthy sign!",
  },
  {
    id: "fundamentals-q5",
    lessonId: "fundamentals",
    question:
      "A hot new tech startup has tons of hype but hasn't made a profit yet. What's the risk?",
    options: [
      "No risk — hype guarantees success",
      "It's risky because hype without profit can fade if the company never earns money",
      "Unprofitable companies are always the best investments",
      "Profit doesn't matter for startups",
    ],
    correctIndex: 1,
    explanation:
      "Hype can pump up prices temporarily, but companies need real earnings eventually. Investing on hype alone is like betting on a Magikarp without checking if it can evolve!",
  },
  {
    id: "fundamentals-q6",
    lessonId: "fundamentals",
    question: "What is a 'competitive advantage'?",
    options: [
      "Having the most expensive stock",
      "Something that helps a company beat competitors, like a unique product or brand",
      "Being the oldest company in an industry",
      "Having the most employees",
    ],
    correctIndex: 1,
    explanation:
      "A competitive advantage is like a Pokémon's signature move — it gives the company an edge that others can't easily copy!",
  },
  {
    id: "fundamentals-q7",
    lessonId: "fundamentals",
    question:
      "True or false: If a stock price is rising, the company must have great fundamentals.",
    options: [
      "True — price always reflects fundamentals perfectly",
      "False — prices can rise on hype before fundamentals catch up (or fall apart)",
      "True — the market is never wrong",
      "False — rising prices always mean bad fundamentals",
    ],
    correctIndex: 1,
    explanation:
      "Stock prices can move on emotion and hype, not just facts. Always check fundamentals separately from the price chart!",
  },
  {
    id: "fundamentals-q8",
    lessonId: "fundamentals",
    question:
      "What's the most important fundamental question to ask about a company?",
    options: [
      "Does it have a cool logo?",
      "Does it actually make money (or have a clear path to profit)?",
      "Is the stock price going up today?",
      "How many Pokémon are in its ads?",
    ],
    correctIndex: 1,
    explanation:
      "At the core, investing is about owning a piece of a business. Does that business make money? That's the fundamental question every trainer should ask!",
  },

  // ── BALANCE SHEET (8) ────────────────────────────────────────────
  {
    id: "balance-sheet-q1",
    lessonId: "balance-sheet",
    question: "What are a company's ASSETS?",
    options: [
      "Money the company owes to others",
      "Everything the company owns that has value (cash, buildings, inventory)",
      "The company's stock price",
      "Employee salaries",
    ],
    correctIndex: 1,
    explanation:
      "Assets are what a company owns — like everything in your trainer's backpack: cash, items, and equipment!",
  },
  {
    id: "balance-sheet-q2",
    lessonId: "balance-sheet",
    question: "What are a company's LIABILITIES?",
    options: [
      "Things the company owns",
      "Debts and obligations the company owes",
      "The CEO's personal savings",
      "Future revenue predictions",
    ],
    correctIndex: 1,
    explanation:
      "Liabilities are debts — money the company owes to banks, suppliers, or bondholders. Like owing money on a loan!",
  },
  {
    id: "balance-sheet-q3",
    lessonId: "balance-sheet",
    question: "The balance sheet equation is…",
    options: [
      "Assets = Liabilities + Equity",
      "Assets = Revenue − Expenses",
      "Equity = Assets + Liabilities",
      "Liabilities = Assets − Revenue",
    ],
    correctIndex: 0,
    explanation:
      "Assets = Liabilities + Equity. What you own equals what you owe plus what's truly yours. It's the foundation of every balance sheet!",
  },
  {
    id: "balance-sheet-q4",
    lessonId: "balance-sheet",
    question:
      "A company has $500,000 in assets and $200,000 in liabilities. What's its equity?",
    options: ["$700,000", "$300,000", "$200,000", "$500,000"],
    correctIndex: 1,
    explanation:
      "Equity = Assets − Liabilities = $500,000 − $200,000 = $300,000. That's the company's net worth!",
  },
  {
    id: "balance-sheet-q5",
    lessonId: "balance-sheet",
    question:
      "Alex's card shop has $80 in cash and cards (assets) and owes $30 to a supplier (liabilities). What's Alex's equity?",
    options: ["$110", "$50", "$80", "$30"],
    correctIndex: 1,
    explanation:
      "Equity = $80 − $30 = $50. After paying debts, Alex truly owns $50 worth of the business!",
  },
  {
    id: "balance-sheet-q6",
    lessonId: "balance-sheet",
    question:
      "A company borrows money to buy a new factory. What happens on the balance sheet?",
    options: [
      "Only assets go up",
      "Both assets (the factory) and liabilities (the loan) go up",
      "Only liabilities go up",
      "Equity goes up with no change to assets or liabilities",
    ],
    correctIndex: 1,
    explanation:
      "Borrowing to buy something increases both sides: you gain an asset (factory) and a liability (loan). The balance sheet stays balanced!",
  },
  {
    id: "balance-sheet-q7",
    lessonId: "balance-sheet",
    question:
      "A company has more liabilities than assets. What is this a red flag for?",
    options: [
      "The company is too profitable",
      "The company may be in financial trouble — it owes more than it owns",
      "It's a sign of fast growth",
      "It means the stock price will definitely rise",
    ],
    correctIndex: 1,
    explanation:
      "When liabilities exceed assets, equity is negative — the company owes more than it owns. That's a serious warning sign!",
  },
  {
    id: "balance-sheet-q8",
    lessonId: "balance-sheet",
    question:
      "True or false: A balance sheet shows how a company performed over the entire year.",
    options: [
      "True — it's the same as an income statement",
      "False — a balance sheet is a snapshot of what a company owns and owes at one point in time",
      "True — it tracks revenue and expenses",
      "False — balance sheets only show stock prices",
    ],
    correctIndex: 1,
    explanation:
      "A balance sheet is a snapshot (like a photo of your backpack right now). Yearly performance is shown on the income statement, not the balance sheet!",
  },

  // ── DIVERSIFICATION (8) ──────────────────────────────────────────
  {
    id: "diversification-q1",
    lessonId: "diversification",
    question: "What does diversifying your investments mean?",
    options: [
      "Putting all your money into one amazing stock",
      "Spreading your money across different investments so one bad pick doesn't wipe you out",
      "Only buying the cheapest stocks",
      "Selling everything and keeping cash",
    ],
    correctIndex: 1,
    explanation:
      "Diversification means not putting all your eggs in one basket — spread across different companies, sectors, and types of investments!",
  },
  {
    id: "diversification-q2",
    lessonId: "diversification",
    question:
      "Why is building a Pokémon team with only Fire types risky in investing terms?",
    options: [
      "Fire types are too weak",
      "It's like investing in only one sector — if Water types (a downturn) show up, you lose badly",
      "Fire cards are always overpriced",
      "It's against Pokémon League rules",
    ],
    correctIndex: 1,
    explanation:
      "A one-type team is like a one-sector portfolio. If that sector struggles, everything drops. Variety protects you!",
  },
  {
    id: "diversification-q3",
    lessonId: "diversification",
    question: "What is an index fund?",
    options: [
      "A fund that buys only one company's stock",
      "A fund that holds many stocks to match a market index, giving you broad diversification",
      "A savings account at a bank",
      "A type of Pokémon card collection",
    ],
    correctIndex: 1,
    explanation:
      "An index fund holds hundreds of stocks in one package — like getting a whole region's worth of Pokémon instead of just one!",
  },
  {
    id: "diversification-q4",
    lessonId: "diversification",
    question:
      "You own stock in a food company and a gaming company. Why is that good diversification?",
    options: [
      "They're in the same industry so they move together",
      "They're in different industries, so if one sector struggles the other might do fine",
      "You should only own one industry",
      "Different industries always lose money together",
    ],
    correctIndex: 1,
    explanation:
      "Different industries react differently to events. If gamers stop spending but people still buy food, your portfolio is more balanced!",
  },
  {
    id: "diversification-q5",
    lessonId: "diversification",
    question:
      "True or false: Diversification guarantees you will never lose money.",
    options: [
      "True — diversified portfolios never drop",
      "False — diversification reduces risk but doesn't eliminate it",
      "True — if you own 10 stocks you can't lose",
      "False — diversification always causes losses",
    ],
    correctIndex: 1,
    explanation:
      "Diversification spreads risk but can't prevent all losses. In a market crash, most stocks can fall — but diversified portfolios usually recover better!",
  },
  {
    id: "diversification-q6",
    lessonId: "diversification",
    question:
      "You invest all your money in one Poké Ball manufacturing company. What's this risk called?",
    options: [
      "Inflation risk",
      "Concentration risk — too much in one place",
      "Liquidity risk",
      "Currency risk",
    ],
    correctIndex: 1,
    explanation:
      "Concentration risk means your fate depends on one investment. If that company fails, your whole portfolio takes a huge hit!",
  },
  {
    id: "diversification-q7",
    lessonId: "diversification",
    question:
      "You're investing for 10 years. What's a sensible diversification approach?",
    options: [
      "Put everything in one hot stock tip",
      "Spread across multiple sectors or use a broad index fund",
      "Keep all money in cash for 10 years",
      "Only buy meme stocks",
    ],
    correctIndex: 1,
    explanation:
      "For long-term goals, spreading across sectors or using an index fund gives you broad exposure and reduces the impact of any single company failing.",
  },
  {
    id: "diversification-q8",
    lessonId: "diversification",
    question: "Which portfolio is the MOST diversified?",
    options: [
      "100% in one tech stock",
      "50% tech, 50% in the same tech company's bonds",
      "Stocks across tech, healthcare, energy, and consumer goods plus some bonds",
      "All cash under a mattress",
    ],
    correctIndex: 2,
    explanation:
      "True diversification means spreading across sectors AND asset types. Multiple industries plus some bonds gives the broadest protection!",
  },

  // ── LONG-TERM (8) ────────────────────────────────────────────────
  {
    id: "long-term-q1",
    lessonId: "long-term",
    question: "What does 'long-term investing' mean?",
    options: [
      "Buying and selling every day",
      "Holding investments for many years and being patient",
      "Only investing for one week",
      "Avoiding the stock market entirely",
    ],
    correctIndex: 1,
    explanation:
      "Long-term investing means staying in the game for years — like Ash's journey, the best results come from patience and persistence!",
  },
  {
    id: "long-term-q2",
    lessonId: "long-term",
    question: "What does 'time in the market' mean?",
    options: [
      "Trading only during market hours",
      "Staying invested over long periods rather than trying to jump in and out",
      "Timing exactly when to buy and sell",
      "Checking stock prices every minute",
    ],
    correctIndex: 1,
    explanation:
      "Time IN the market beats timing THE market. Historically, patient investors who stay invested tend to do better than frequent traders!",
  },
  {
    id: "long-term-q3",
    lessonId: "long-term",
    question:
      "The stock market drops 15% in a month. You're a long-term investor. What should you do?",
    options: [
      "Panic-sell everything immediately",
      "Stay calm — short-term drops are normal and markets have historically recovered over time",
      "Never invest again",
      "Borrow money to buy more without thinking",
    ],
    correctIndex: 1,
    explanation:
      "Markets go up and down! Long-term investors know that dips are part of the journey. Staying calm (and invested) has historically paid off.",
  },
  {
    id: "long-term-q4",
    lessonId: "long-term",
    question:
      "You want to buy a bike in 18 months. Is the stock market a good place for that money?",
    options: [
      "Yes — stocks always go up quickly",
      "No — 18 months is short-term; stocks are too risky for near-term goals",
      "Yes — put it all in one volatile stock",
      "It doesn't matter what your timeline is",
    ],
    correctIndex: 1,
    explanation:
      "Short-term goals (under ~3–5 years) need safer options like savings accounts. Stocks can drop right when you need the money!",
  },
  {
    id: "long-term-q5",
    lessonId: "long-term",
    question:
      "Ash didn't become a Pokémon Master overnight. What's the investing lesson?",
    options: [
      "You should expect to get rich in one week",
      "Building wealth takes time, consistency, and patience — gradual progress wins",
      "Only lucky people succeed at investing",
      "Quitting early is the best strategy",
    ],
    correctIndex: 1,
    explanation:
      "Like Ash's years-long journey, building wealth through investing is a marathon, not a sprint. Small, consistent steps compound over time!",
  },
  {
    id: "long-term-q6",
    lessonId: "long-term",
    question:
      "True or false: Timing the market (buying low, selling high) is easy to do consistently.",
    options: [
      "True — anyone can predict market tops and bottoms",
      "False — even professionals struggle to time the market consistently",
      "True — just follow social media tips",
      "False — the market never changes",
    ],
    correctIndex: 1,
    explanation:
      "Market timing sounds great but is extremely hard. Missing just a few of the best days can seriously hurt long-term returns!",
  },
  {
    id: "long-term-q7",
    lessonId: "long-term",
    question:
      "A sealed Base Set booster box was worth $100 in 1999 and sold for thousands years later. What's the lesson?",
    options: [
      "Always sell immediately",
      "Patience and holding quality assets long-term can lead to big rewards",
      "All old boxes are worthless",
      "Only buy things you plan to sell tomorrow",
    ],
    correctIndex: 1,
    explanation:
      "Holding quality assets over decades can pay off hugely — but it requires patience and picking things with lasting value!",
  },
  {
    id: "long-term-q8",
    lessonId: "long-term",
    question:
      "You're 12 and saving for college in 10 years. What's a sensible plan?",
    options: [
      "Keep everything in cash — stocks are too scary",
      "Invest regularly in a diversified portfolio and stay patient for the long haul",
      "Bet everything on one stock tip from a friend",
      "Spend it all on cards now",
    ],
    correctIndex: 1,
    explanation:
      "With 10 years, you have time to ride out market ups and downs. Regular investing in a diversified portfolio is a smart long-term strategy!",
  },

  // ── WHAT IS A STOCK (8) ──────────────────────────────────────────
  {
    id: "what-is-a-stock-q1",
    lessonId: "what-is-a-stock",
    question: "What does owning a share of stock mean?",
    options: [
      "You lent the company money",
      "You own a small slice of the company",
      "You work for the company",
      "You get free products forever",
    ],
    correctIndex: 1,
    explanation:
      "A stock is an ownership slice! If you own shares, you own a tiny piece of that company — like owning part of a Poké Mart franchise!",
  },
  {
    id: "what-is-a-stock-q2",
    lessonId: "what-is-a-stock",
    question:
      "A company has 1,000 total shares and you own 10. What percentage do you own?",
    options: ["10%", "1%", "0.1%", "100%"],
    correctIndex: 1,
    explanation:
      "10 ÷ 1,000 = 0.01 = 1%. You own 1% of the company. More shares = bigger ownership slice!",
  },
  {
    id: "what-is-a-stock-q3",
    lessonId: "what-is-a-stock",
    question: "Why do companies sell stock to the public?",
    options: [
      "To give away free money",
      "To raise money for growth, projects, and operations",
      "Because the government requires it",
      "To reduce their profits",
    ],
    correctIndex: 1,
    explanation:
      "Companies sell stock (go public) to raise capital — money for new factories, research, expansion, and more!",
  },
  {
    id: "what-is-a-stock-q4",
    lessonId: "what-is-a-stock",
    question: "Where are stocks bought and sold in the U.S.?",
    options: [
      "Only at banks",
      "On stock exchanges like the NYSE and NASDAQ",
      "At grocery stores",
      "Only through the company's website",
    ],
    correctIndex: 1,
    explanation:
      "Stock exchanges like the NYSE and NASDAQ are marketplaces where buyers and sellers trade shares — like a giant digital card show!",
  },
  {
    id: "what-is-a-stock-q5",
    lessonId: "what-is-a-stock",
    question:
      "What's the difference between being a customer and being a shareholder?",
    options: [
      "They're the same thing",
      "A customer buys products; a shareholder owns part of the company",
      "Shareholders always get free products",
      "Customers own the company",
    ],
    correctIndex: 1,
    explanation:
      "Buying a Nintendo game makes you a customer. Buying Nintendo stock makes you a partial owner (shareholder). Different roles!",
  },
  {
    id: "what-is-a-stock-q6",
    lessonId: "what-is-a-stock",
    question:
      "Nintendo is a public company, but The Pokémon Company is private. What does that mean?",
    options: [
      "Both are the same thing",
      "Anyone can buy Nintendo stock on an exchange, but you can't buy Pokémon Company stock on the open market",
      "Pokémon Company stock is cheaper",
      "Private companies don't make money",
    ],
    correctIndex: 1,
    explanation:
      "Public companies sell shares to anyone on stock exchanges. Private companies' shares aren't available to everyday investors on the open market.",
  },
  {
    id: "what-is-a-stock-q7",
    lessonId: "what-is-a-stock",
    question:
      "True or false: Owning one share of a company means you can boss everyone around.",
    options: [
      "True — one share gives you full control",
      "False — one share is a tiny ownership stake with very limited influence",
      "True — shareholders run daily operations",
      "False — shareholders own the products, not the company",
    ],
    correctIndex: 1,
    explanation:
      "One share is a small slice! You might get to vote on big decisions, but you don't run the company day-to-day. CEOs and boards handle that.",
  },
  {
    id: "what-is-a-stock-q8",
    lessonId: "what-is-a-stock",
    question:
      "If a company does really well, what might happen to its stock price?",
    options: [
      "The price will definitely crash",
      "The price might rise as more investors want to own a piece",
      "The price never changes",
      "The government sets a higher price",
    ],
    correctIndex: 1,
    explanation:
      "When a company performs well, more people want to buy its stock (higher demand), which can push the price up. But it's not guaranteed!",
  },

  // ── COMPOUND GROWTH (8) ──────────────────────────────────────────
  {
    id: "compound-growth-q1",
    lessonId: "compound-growth",
    question: "What is compound growth?",
    options: [
      "Earning returns only on your original money",
      "Earning returns on your returns — your money grows on itself over time",
      "Saving money without any interest",
      "Spending your gains each year",
    ],
    correctIndex: 1,
    explanation:
      "Compound growth means your gains earn more gains — like a Pokémon that gains XP on top of XP already earned. It's investing's superpower!",
  },
  {
    id: "compound-growth-q2",
    lessonId: "compound-growth",
    question:
      "You invest $100 and earn 10% in year 1 ($110 total). In year 2 you earn 10% again. How much do you gain in year 2?",
    options: ["$10", "$11", "$1", "$20"],
    correctIndex: 1,
    explanation:
      "Year 2's 10% is on $110, not $100. So you gain $11 (10% × $110). That's compounding — each year's base is bigger!",
  },
  {
    id: "compound-growth-q3",
    lessonId: "compound-growth",
    question:
      "Why is starting to invest early considered a superpower?",
    options: [
      "Young people get higher interest rates",
      "More years of compounding means your money has more time to grow exponentially",
      "Markets only go up for young investors",
      "It doesn't matter when you start",
    ],
    correctIndex: 1,
    explanation:
      "Time is the fuel for compounding! Starting at 12 vs. 22 gives you 10 extra years of growth on growth. That's a massive advantage!",
  },
  {
    id: "compound-growth-q4",
    lessonId: "compound-growth",
    question:
      "The Rule of 72 says you divide 72 by your annual return rate to estimate…",
    options: [
      "How much tax you'll pay",
      "How many years it takes to double your money",
      "Your credit score",
      "The best stock to buy",
    ],
    correctIndex: 1,
    explanation:
      "Rule of 72: at 8% annual return, 72 ÷ 8 ≈ 9 years to double. It's a quick trick to see the power of compounding!",
  },
  {
    id: "compound-growth-q5",
    lessonId: "compound-growth",
    question:
      "What's one of the best habits to maximize compound growth?",
    options: [
      "Withdraw gains every month",
      "Reinvest your returns regularly and keep adding money",
      "Only invest once and never add more",
      "Wait until you're 50 to start",
    ],
    correctIndex: 1,
    explanation:
      "Reinvesting gains and adding money regularly supercharges compounding. Every dollar you add becomes a worker earning more dollars!",
  },
  {
    id: "compound-growth-q6",
    lessonId: "compound-growth",
    question:
      "True or false: Compounding only works in the first year and then stops.",
    options: [
      "True — only year 1 matters",
      "False — compounding accelerates over many years as your base keeps growing",
      "True — after year 1 growth is linear",
      "False — compounding only works for banks",
    ],
    correctIndex: 1,
    explanation:
      "Compounding gets stronger over time! Year 10's gains are much bigger than year 1's because your base has grown so much larger.",
  },
  {
    id: "compound-growth-q7",
    lessonId: "compound-growth",
    question:
      "You earn $50 in investment gains. Instead of spending it, you reinvest it. What's the benefit?",
    options: [
      "Nothing — reinvesting doesn't help",
      "That $50 joins your team and can earn returns too, boosting future compounding",
      "Reinvesting always loses money",
      "You should always spend gains immediately",
    ],
    correctIndex: 1,
    explanation:
      "Reinvested gains become part of your growing base. That $50 can earn its own returns — like adding a strong Pokémon to your team!",
  },
  {
    id: "compound-growth-q8",
    lessonId: "compound-growth",
    question:
      "What hurts compound growth the most over decades?",
    options: [
      "Starting early",
      "Pulling money out frequently and interrupting the compounding cycle",
      "Reinvesting dividends",
      "Adding money regularly",
    ],
    correctIndex: 1,
    explanation:
      "Every time you pull money out, you shrink the base that compounds. Staying invested and reinvesting lets the snowball keep rolling!",
  },

  // ── RISK AND REWARD (8) ──────────────────────────────────────────
  {
    id: "risk-and-reward-q1",
    lessonId: "risk-and-reward",
    question: "In investing, what does 'risk' mean?",
    options: [
      "A guaranteed loss",
      "The chance that an investment's value could go up or down — uncertainty about the outcome",
      "A type of bank fee",
      "How fast you can sell a stock",
    ],
    correctIndex: 1,
    explanation:
      "Risk is uncertainty — the possibility that things don't go as planned. All investments carry some risk, but the amount varies!",
  },
  {
    id: "risk-and-reward-q2",
    lessonId: "risk-and-reward",
    question:
      "What's the general relationship between risk and potential reward?",
    options: [
      "Higher potential reward usually comes with higher risk",
      "Higher risk always means lower reward",
      "Risk and reward are unrelated",
      "Low risk always gives the highest returns",
    ],
    correctIndex: 0,
    explanation:
      "Investments promising big returns usually carry bigger risk. Safe savings accounts have low risk but lower returns. It's a tradeoff!",
  },
  {
    id: "risk-and-reward-q3",
    lessonId: "risk-and-reward",
    question:
      "A savings account has lower risk than a single volatile stock. Why?",
    options: [
      "Savings accounts can lose 50% overnight",
      "Savings accounts are insured and stable; individual stocks can swing wildly",
      "Stocks are always safer than savings",
      "There's no difference in risk",
    ],
    correctIndex: 1,
    explanation:
      "Savings accounts (especially insured ones) are very stable. Individual stocks can rise or fall sharply — that's higher risk!",
  },
  {
    id: "risk-and-reward-q4",
    lessonId: "risk-and-reward",
    question: "What is 'risk tolerance'?",
    options: [
      "How much money you have",
      "How comfortable you are with the possibility of losing money in the short term",
      "How many stocks you own",
      "Your age in years",
    ],
    correctIndex: 1,
    explanation:
      "Risk tolerance is personal — how much ups and downs you can handle without panicking. Know yours before picking investments!",
  },
  {
    id: "risk-and-reward-q5",
    lessonId: "risk-and-reward",
    question:
      "You need money for a school trip in 3 months. Where should you keep it?",
    options: [
      "In a volatile meme stock",
      "In a safe, stable place like a savings account",
      "In cryptocurrency only",
      "Invested in a risky startup",
    ],
    correctIndex: 1,
    explanation:
      "Short-term needs require safety! You can't afford a stock crash right before your trip. Keep near-term money in low-risk options.",
  },
  {
    id: "risk-and-reward-q6",
    lessonId: "risk-and-reward",
    question: "How does diversification help manage risk?",
    options: [
      "It eliminates all risk completely",
      "It spreads risk so one bad investment doesn't destroy your whole portfolio",
      "It increases risk by owning more stocks",
      "It only works for bonds, not stocks",
    ],
    correctIndex: 1,
    explanation:
      "Diversification won't eliminate risk, but it spreads it out — like having a balanced Pokémon team instead of relying on one type!",
  },
  {
    id: "risk-and-reward-q7",
    lessonId: "risk-and-reward",
    question:
      "True or false: Anyone promising 'zero risk' and 'guaranteed high returns' is probably misleading you.",
    options: [
      "True — all investments carry some risk; guarantees of high returns with no risk are red flags",
      "False — zero-risk high returns are common and safe",
      "True — only government bonds have risk",
      "False — social media tips are always trustworthy",
    ],
    correctIndex: 0,
    explanation:
      "If it sounds too good to be true, it probably is! Legitimate investments always carry some risk. Beware of scams promising guaranteed riches.",
  },
  {
    id: "risk-and-reward-q8",
    lessonId: "risk-and-reward",
    question:
      "You're investing for a goal 15 years away. What risk approach makes sense?",
    options: [
      "Avoid all risk by keeping only cash",
      "Accept some ups and downs because you have time to recover from dips",
      "Put everything in the riskiest stock possible",
      "Never check your portfolio again",
    ],
    correctIndex: 1,
    explanation:
      "With 15 years, you can ride out market storms. Some risk is okay — and even necessary — to earn returns that beat inflation over time!",
  },

  // ── DIVIDENDS (8) ────────────────────────────────────────────────
  {
    id: "dividends-q1",
    lessonId: "dividends",
    question: "What is a dividend?",
    options: [
      "A fee you pay to buy stock",
      "A payment of company profits to shareholders",
      "A type of bond",
      "The price change of a stock in one day",
    ],
    correctIndex: 1,
    explanation:
      "Dividends are profit payouts to shareholders — like a company sharing its prize money with everyone who owns a piece of it!",
  },
  {
    id: "dividends-q2",
    lessonId: "dividends",
    question:
      "You own 20 shares and the company pays a $0.50 dividend per share. How much do you receive?",
    options: ["$5", "$10", "$20", "$0.50"],
    correctIndex: 1,
    explanation:
      "20 shares × $0.50 = $10 total. Each share you own earns the per-share dividend — more shares = bigger payout!",
  },
  {
    id: "dividends-q3",
    lessonId: "dividends",
    question:
      "A young startup reinvests all its profits into growth instead of paying dividends. Why?",
    options: [
      "It's illegal for startups to pay dividends",
      "It wants to use profits to grow the business rather than distribute cash now",
      "Startups never make profits",
      "Dividends are only for banks",
    ],
    correctIndex: 1,
    explanation:
      "Growing companies often skip dividends to fund expansion — like a young trainer spending prize money on training instead of buying snacks!",
  },
  {
    id: "dividends-q4",
    lessonId: "dividends",
    question: "What is 'dividend yield'?",
    options: [
      "The total profit a company made",
      "The annual dividend per share divided by the stock price, shown as a percentage",
      "How many shares you own",
      "The company's debt level",
    ],
    correctIndex: 1,
    explanation:
      "Dividend yield = annual dividend ÷ stock price. It tells you what percentage return you're getting from dividends alone!",
  },
  {
    id: "dividends-q5",
    lessonId: "dividends",
    question:
      "A stock's dividend yield jumps to 8% after its price crashes. What should you do?",
    options: [
      "Buy immediately — high yield is always great",
      "Check the fundamentals — a high yield after a crash might signal trouble, not a bargain",
      "Ignore the yield completely",
      "Sell all your other stocks to buy this one",
    ],
    correctIndex: 1,
    explanation:
      "A soaring yield after a price crash can be a warning sign — the company might be struggling. Always check if the dividend is sustainable!",
  },
  {
    id: "dividends-q6",
    lessonId: "dividends",
    question: "What is 'reinvesting dividends'?",
    options: [
      "Spending dividend cash on snacks",
      "Using dividend payments to buy more shares, boosting compound growth",
      "Returning dividends to the company",
      "Paying extra taxes on dividends",
    ],
    correctIndex: 1,
    explanation:
      "Reinvesting dividends buys more shares, which earn more dividends — a compounding loop that can seriously boost long-term returns!",
  },
  {
    id: "dividends-q7",
    lessonId: "dividends",
    question:
      "True or false: Companies always pay dividends forever and never cut them.",
    options: [
      "True — dividends are guaranteed",
      "False — companies can reduce or stop dividends if profits fall or they need cash",
      "True — once a dividend starts it never changes",
      "False — only private companies pay dividends",
    ],
    correctIndex: 1,
    explanation:
      "Dividends aren't guaranteed! Companies can cut or suspend them during tough times. Always check if payouts are sustainable.",
  },
  {
    id: "dividends-q8",
    lessonId: "dividends",
    question:
      "A Pokémon League pays prize money to top trainers. What's the investing analogy?",
    options: [
      "It's like paying trading fees",
      "It's like dividends — the organization sharing earnings with participants (shareholders)",
      "It's like buying new cards",
      "It's like a stock split",
    ],
    correctIndex: 1,
    explanation:
      "Prize money is like dividends — profits distributed to those who earned a stake in the success. Shareholders get dividends; trainers get prizes!",
  },
];

export function getQuestionsForLesson(lessonId: string): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.lessonId === lessonId);
}

export function getLevelForXp(xp: number): TrainerLevel {
  let current = TRAINER_LEVELS[0];
  for (const lvl of TRAINER_LEVELS) {
    if (xp >= lvl.minXp) current = lvl;
  }
  return current;
}

export function getNextLevel(xp: number): TrainerLevel | null {
  const current = getLevelForXp(xp);
  return TRAINER_LEVELS.find((l) => l.level === current.level + 1) ?? null;
}

export function xpProgressInLevel(xp: number): {
  current: TrainerLevel;
  next: TrainerLevel | null;
  progress: number;
  xpIntoLevel: number;
  xpNeeded: number;
} {
  const current = getLevelForXp(xp);
  const next = getNextLevel(xp);
  if (!next) {
    return { current, next: null, progress: 100, xpIntoLevel: xp - current.minXp, xpNeeded: 0 };
  }
  const xpIntoLevel = xp - current.minXp;
  const xpNeeded = next.minXp - current.minXp;
  const progress = Math.min(100, (xpIntoLevel / xpNeeded) * 100);
  return { current, next, progress, xpIntoLevel, xpNeeded };
}