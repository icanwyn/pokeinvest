import type {
  AdventureStep,
  GlossaryTerm,
  LessonConcept,
} from "@/types/card";

export const LESSON_CONCEPTS: LessonConcept[] = [
  {
    id: "supply-demand",
    title: "Supply & Demand",
    summary: "When lots of people want something rare, the price goes up!",
    pokemonAnalogy:
      "Imagine a shiny Charizard card appears at a tournament. Only 3 copies exist, but 50 trainers want it. Trainers start offering more and more Poké Dollars until someone finally wins the trade. The card didn't change — it's still the same Charizard — but because so many people wanted it and so few were available, the price shot up. Flip the story: if a shop has 500 common Pidgey cards and nobody is buying, the shop might lower the price just to clear shelf space. That's supply and demand in action!",
    investingConcept:
      "When demand exceeds supply, prices rise; when supply exceeds demand, prices fall.",
    kidExplanation:
      "If everyone wants a Pikachu plushie but the store only has two, the price goes up because lots of buyers are chasing a tiny amount. If the store has a mountain of plushies and nobody cares, the price drops. Stocks work the same way — when tons of people want to buy a company's shares and not many are for sale, the price climbs!",
    sections: [
      {
        heading: "What Is Demand?",
        emoji: "🙋",
        body: "Demand means how much people WANT to buy something at a given price. At a Pokémon League, demand for a brand-new booster box is huge on release day. In the stock market, demand shows up when investors are excited about a company and rush to buy its shares.",
      },
      {
        heading: "What Is Supply?",
        emoji: "📦",
        body: "Supply is how much of something is available to sell. A card shop with one sealed Base Set box has low supply. A company that issues millions of new shares — or insiders selling lots of stock — increases supply. More stuff for sale usually puts downward pressure on price.",
      },
      {
        heading: "When They Meet: The Price",
        emoji: "⚖️",
        body: "Price is where buyers and sellers agree. High demand + low supply = prices rise (think: shiny chase card). Low demand + high supply = prices fall (think: bulk commons in a discount bin). Neither side 'picks' the number alone — they negotiate through trades until a deal happens.",
      },
      {
        heading: "Short-Term vs. Long-Term",
        emoji: "⏳",
        body: "Hype can spike demand fast — like a new Pokémon reveal making a card trendy overnight. But supply and demand also change slowly: companies grow, new products launch, trends fade. Smart trainers notice whether a price move is a quick battle or a real shift in the meta.",
      },
      {
        heading: "Supply & Demand in Stocks",
        emoji: "📈",
        body: "When a company reports amazing news, more investors want in (demand up). If many shareholders sell at once, supply floods the market. The stock price moves as buyers and sellers react. Understanding this helps you ask: 'Is everyone chasing this, or is hardly anyone interested?'",
      },
    ],
    keyTakeaways: [
      "Demand = how much people want to buy; supply = how much is available to sell.",
      "When many buyers chase few items, prices tend to rise.",
      "When few buyers face lots of items for sale, prices tend to fall.",
      "Prices change when supply, demand, or both shift.",
      "Hype can move prices quickly — always ask if the change makes sense.",
    ],
    tryItActivity: {
      title: "Supply & Demand Detective",
      steps: [
        "Pick a Pokémon card you know (or a snack at a store) and write down why YOU would want it — that's demand!",
        "Guess how many are easy to find nearby — that's supply.",
        "Would you expect a high or low price? Write one sentence explaining why.",
        "Now pick a stock ticker you've heard of (like AAPL or DIS). Search why people might want to own it today.",
        "Ask a grown-up: 'Has this company's news been good or bad lately?' Link that to demand.",
      ],
      reflectionQuestion:
        "Can you think of something that got MORE expensive because everyone wanted it at the same time?",
    },
    coachNote:
      "Kids often think a company 'makes' the stock price. Gently redirect: prices come from how many people want to buy versus how many want to sell — just like at a card trade table.",
    pokemonExample:
      "At a regional tournament, a vendor displays a near-mint 1st Edition Charizard. Three copies exist in the whole hall. Trainers line up, each offering a little more than the last. By afternoon, the winning offer is triple the morning price — not because Charizard learned a new move, but because demand crushed supply.",
    difficulty: "beginner",
    estimatedMinutes: 12,
  },
  {
    id: "who-sets-value",
    title: "Who Sets the Price?",
    summary:
      "Nobody picks a price alone — buyers and sellers agree together in the market.",
    pokemonAnalogy:
      "At a weekend card show, a kid tapes a sign on their binder: 'Holographic Mewtwo — $40.' A shopper offers $30. They talk, check recent sales online, and shake hands at $35. Nintendo didn't set $35 — the buyer and seller did. The stock market is a giant, nonstop card show: millions of traders posting prices they'd pay (bids) and prices they'd sell for (asks) until trades happen.",
    investingConcept:
      "Market price is set by buyers and sellers trading together — not by the company alone.",
    kidExplanation:
      "The Pokémon Company prints cards, but it doesn't walk around the playground setting prices on your trades. YOU and your friends decide what feels fair. Stocks work like that too: the 'market' is all the people buying and selling, and the price is whatever deal they make right now.",
    sections: [
      {
        heading: "The Market Is a Meeting Place",
        emoji: "🏟️",
        body: "A market is anywhere buyers and sellers come together — a card table, an online marketplace, or the New York Stock Exchange. No single person runs the show; everyone brings their own opinions and wallets.",
      },
      {
        heading: "Bids and Asks",
        emoji: "💬",
        body: "A bid is the highest price someone will PAY to buy. An ask is the lowest price someone will ACCEPT to sell. When they match, a trade happens! If bids are strong and asks are scarce, price drifts up — like trainers outbidding each other for a graded card.",
      },
      {
        heading: "Market Price vs. Sticker Price",
        emoji: "🏷️",
        body: "A seller can ASK for anything, but the market price is what people actually pay. A shop might sticker a card at $100, but if nobody bites and it sells at $70 online, $70 is closer to the real market price.",
      },
      {
        heading: "Intrinsic Value — What's It Really Worth?",
        emoji: "🔍",
        body: "Trainers debate a card's 'true' worth based on condition, rarity, and usefulness in battles. Investors debate a company's intrinsic value based on earnings, growth, and assets. Market price can be above or below that 'true' value — sometimes the crowd is excited, sometimes scared.",
      },
      {
        heading: "Why Prices Move All Day",
        emoji: "📊",
        body: "New info — earnings reports, news, even rumors — changes what buyers and sellers are willing to pay. Thousands of small decisions pile up into the price you see on the screen, updating whenever a new trade occurs.",
      },
    ],
    keyTakeaways: [
      "Companies don't set their stock price — traders do through buying and selling.",
      "A bid is what buyers offer; an ask is what sellers want.",
      "Market price = what people actually trade at right now.",
      "Intrinsic value is your estimate of 'real' worth — price can differ.",
      "Prices update as new information and opinions change.",
    ],
    tryItActivity: {
      title: "Bid & Ask Role-Play",
      steps: [
        "With a friend, pick a card (real or imaginary). One person is the seller, one is the buyer.",
        "Seller names an ask price; buyer names a bid. Negotiate until you agree — that's your market price!",
        "Switch roles and try again with 'hot news' (card won a tournament) — does the price change?",
        "Look up a stock price online. Notice it updates — each tick is a new trade between real people.",
        "Write: Who set the price in your role-play? Who sets a real stock price?",
      ],
      reflectionQuestion:
        "Why might two trainers disagree on a card's price even when they both love Pokémon?",
    },
    coachNote:
      "Use the card-show image often. Kids grasp negotiation quickly; connect that comfort to stocks so the market feels familiar, not mysterious.",
    pokemonExample:
      "Two collectors haggle over a PSA 9 Blastoise. Seller asks $120; buyer bids $95. They pull up recent eBay sales ($110 average), agree on $108, and both walk away happy. No official price list forced their hand — the market did.",
    difficulty: "beginner",
    estimatedMinutes: 12,
  },
  {
    id: "what-is-a-stock",
    title: "What Is a Stock?",
    summary:
      "A tiny ownership slice of a real company — you're a part-owner!",
    pokemonAnalogy:
      "Imagine your favorite Pokémon Gym is opening a second location, but building it costs a fortune. The Gym Leader sells 1,000 membership tokens. Each token costs $10 and gives you a tiny ownership stake — you share in future success (and risks!). If the Gym thrives, your token could be worth more; you might even get a share of tournament prize money. A stock is that membership token for a real company like Nintendo or Apple.",
    investingConcept:
      "A stock represents partial ownership in a company and a claim on its future success.",
    kidExplanation:
      "When you buy one share of stock, you own a super-small piece of a real business — like holding one puzzle piece of a giant jigsaw. If the company does well, your piece can become more valuable. If it struggles, your piece might lose value. You're not lending money; you're becoming a part-owner!",
    sections: [
      {
        heading: "Ownership, Not a Loan",
        emoji: "🧩",
        body: "Buying stock means buying ownership (equity), not lending money like a loan. Shareholders are part-owners. That comes with upside if the company grows — and risk if it doesn't.",
      },
      {
        heading: "Shares and Tickers",
        emoji: "🔤",
        body: "Companies split ownership into shares. AAPL is Apple's ticker symbol — a short nickname traders use. If Apple has billions of shares and you own 1, you own a tiny fraction of the whole company.",
      },
      {
        heading: "Why Companies Sell Stock",
        emoji: "🏗️",
        body: "Companies raise money to build factories, hire teams, create products, or expand. Selling shares brings in cash from investors who believe in the plan. It's like pooling trainer badges to fund a new battle arena.",
      },
      {
        heading: "What Shareholders Get",
        emoji: "🎁",
        body: "Shareholders may benefit if the stock price rises. Some companies pay dividends — cash profit shared with owners. Shareholders often vote on big decisions (though one small share = a tiny voice).",
      },
      {
        heading: "Public vs. Private",
        emoji: "🌐",
        body: "Public companies sell shares on stock exchanges — anyone can buy. Private companies have fewer owners and you usually can't buy shares at the corner store. Most big names kids know (Disney, McDonald's) are public.",
      },
    ],
    keyTakeaways: [
      "A stock = a slice of company ownership.",
      "Ticker symbols (like DIS or KO) identify stocks.",
      "Companies sell shares to raise money for growth.",
      "Owners can gain if price rises; some get dividend payments.",
      "Owning stock means sharing the company's wins AND risks.",
    ],
    tryItActivity: {
      title: "Build Your Mini-Company",
      steps: [
        "Invent a Pokémon-themed business (e.g., 'Pikachu Smoothie Stand').",
        "Decide you need $100 to open. Split into 10 shares at $10 each.",
        "Draw a share certificate for a family member who 'invests.'",
        "Pretend a great month: would each share be worth more? Why?",
        "Look up one real ticker and read what the company sells.",
      ],
      reflectionQuestion:
        "What's the difference between owning a stock and owning a Pokémon card?",
    },
    coachNote:
      "Emphasize that stocks are real businesses, not video game points. A share of Disney means you literally own a speck of the Magic Kingdom's company.",
    pokemonExample:
      "A fan club wants to publish a custom playmat. They sell 50 supporter badges at $5 each to fund printing. Each badge-holder owns a piece of the project and gets a mat if it succeeds. That's a mini version of buying stock in a startup!",
    difficulty: "beginner",
    estimatedMinutes: 12,
  },
  {
    id: "fundamentals",
    title: "Company Fundamentals",
    summary:
      "Look at what's INSIDE — stats, growth, and health — not just hype.",
    pokemonAnalogy:
      "Before a big battle, great trainers study a Pokémon's base stats — HP, Attack, Defense — not just how cool it looks. A flashy Fire type with low HP might lose fast. In PokeInvest, the HP number on the card top is company health (higher = sturdier). Stats below include TKT (P/E ticket price), ATK (revenue growth), and DEF (debt). Fundamentals are those inner stats for a real company: Is it growing? Profitable? Buried in debt?",
    investingConcept:
      "Fundamentals measure a company's financial health and growth — the stats behind the hype.",
    kidExplanation:
      "You wouldn't trade your best card just because someone says 'trust me, it's amazing' — you'd check its condition and moves! Fundamentals are how investors check a company's condition: Are sales growing? Is it making money? Does it owe a lot? Strong stats don't guarantee wins, but they help you understand what you're buying.",
    sections: [
      {
        heading: "Stats on the Card",
        emoji: "📋",
        body: "PokeInvest maps real metrics to card stats: HP on the header (company health — higher is better, like Pokémon hit points), TKT (P/E ratio — the ticket price for earnings), ATK (revenue growth), DEF (debt/equity), SPD (beta/volatility), SPC (return on equity), ACC (profit margin). These numbers summarize how the company is performing financially.",
      },
      {
        heading: "Growth vs. Hype",
        emoji: "🚀",
        body: "A stock can jump because everyone is talking about it (demand!), but fundamentals ask: Is the business actually getting stronger? Revenue growth shows if customers are buying more. Profit margin shows if sales turn into real profit.",
      },
      {
        heading: "Health Checks",
        emoji: "❤️",
        body: "Debt isn't always bad — but too much is like a Pokémon with amazing Attack and zero Defense. Debt-to-equity and cash flow help you see if a company can handle tough times or needs to borrow constantly.",
      },
      {
        heading: "Earnings — The Score Report",
        emoji: "📣",
        body: "Every quarter, public companies report earnings — how much money they made. It's like post-battle stats: did the strategy work? Surprises (beat or miss expectations) often move the stock price.",
      },
      {
        heading: "Using Fundamentals Wisely",
        emoji: "🧠",
        body: "Fundamentals don't tell you tomorrow's price. They help you compare companies and avoid betting only on buzz. Pair stats with stories: What does this company sell? Who are its competitors? Would YOU use its product in ten years?",
      },
    ],
    keyTakeaways: [
      "Fundamentals = financial health stats, not just popularity.",
      "Revenue growth and profit show if the business is winning customers.",
      "Debt and cash flow show how tough the company can stand.",
      "Earnings reports are regular 'score updates' from the company.",
      "Strong fundamentals support long-term thinking; hype is short-term noise.",
    ],
    tryItActivity: {
      title: "Stat Card Scavenger Hunt",
      steps: [
        "Open any stock card in PokeInvest and find the ATK stat.",
        "Write in kid words: 'This company's revenue growth is ___ because ___.'",
        "Find DEF (debt). Is it high or low? What might that mean?",
        "Compare two cards — which has stronger overall stats?",
        "Bonus: Which company would you rather own for five years and why?",
      ],
      reflectionQuestion:
        "Can a company be popular in the news but have weak fundamentals? What could happen?",
    },
    coachNote:
      "Kids love comparing stats — lean into that. Remind them that one weak stat doesn't always mean 'bad'; context matters (young companies vs. giants).",
    pokemonExample:
      "Two Electric types look equally cool. One has 60 HP and 20 Attack; the other has 120 HP, 90 Attack, and a useful ability. Serious trainers pick the second for battles. Investors do the same with fundamentals versus flashy logos.",
    difficulty: "beginner",
    estimatedMinutes: 15,
  },
  {
    id: "balance-sheet",
    title: "Balance Sheet Basics",
    summary: "A snapshot of what a company OWNS vs. what it OWES.",
    pokemonAnalogy:
      "Before a long adventure, you inventory your bag: 12 Potions, 3 Revives, $4,000 Poké Dollars — those are assets. You also owe your friend 2 Rare Candies you borrowed — that's a liability. What's left after paying debts is yours — your equity. A company's balance sheet is that same bag check, but with factories, cash, inventory, and loans instead of items.",
    investingConcept:
      "A balance sheet lists assets, liabilities, and equity at a moment in time: Assets = Liabilities + Equity.",
    kidExplanation:
      "Imagine listing everything your room owns (games, savings jar) and everything you owe (allowance you promised to pay back). What's left is yours. Companies do this on a big scale. It helps you see if they're rich in stuff and cash, or drowning in what they owe.",
    sections: [
      {
        heading: "Assets — What They Own",
        emoji: "💰",
        body: "Assets include cash, buildings, equipment, inventory, and investments. Cash is like Poké Dollars in hand. A factory is like a permanent item that helps earn more. More useful assets can mean more power — if they're managed well.",
      },
      {
        heading: "Liabilities — What They Owe",
        emoji: "📜",
        body: "Liabilities are debts and bills: bank loans, bonds, money owed to suppliers. Some debt funds growth (like borrowing to build a new lab), but too much debt can squeeze a company if sales slow down.",
      },
      {
        heading: "Equity — The Leftover Slice",
        emoji: "🥧",
        body: "Equity = Assets minus Liabilities. It's the shareholders' stake — the net worth belonging to owners. Growing equity over time often signals a company is building value.",
      },
      {
        heading: "The Golden Equation",
        emoji: "✨",
        body: "Assets = Liabilities + Equity. Always. Think of a scale: what the company owns balances what it owes plus what owners have. If you know two pieces, you can find the third.",
      },
      {
        heading: "Reading It Like a Trainer",
        emoji: "🔎",
        body: "Check cash (can they pay bills?), debt (are loans huge?), and current ratio (can they cover short-term debts?). PokeInvest shows a balance sheet summary on each card — use it like a quick bag inspection before a big trade.",
      },
    ],
    keyTakeaways: [
      "Assets = what the company owns; liabilities = what it owes.",
      "Equity = assets minus liabilities (owners' net stake).",
      "The balance sheet always balances: Assets = Liabilities + Equity.",
      "Lots of cash and manageable debt usually mean a sturdier company.",
      "One snapshot isn't forever — compare over time.",
    ],
    tryItActivity: {
      title: "My Balance Sheet",
      steps: [
        "List 5 things you 'own' (assets): toys, savings, books…",
        "List anything you 'owe' (liabilities): borrowed money, promised chores.",
        "Subtract liabilities from assets — that's your equity!",
        "Open a stock in PokeInvest and find cash and total debt.",
        "Which has more — cash or debt? What story does that tell?",
      ],
      reflectionQuestion:
        "Why is owing a little bit different from owing so much you can't pay?",
    },
    coachNote:
      "The equation can feel abstract. The personal bag inventory exercise makes it click before kids touch corporate numbers.",
    pokemonExample:
      "A trading post owner has $50,000 cash, $200,000 of shop inventory, and a $80,000 loan. Assets = $250,000; liabilities = $80,000; equity = $170,000. The shop is worth more than it owes — a healthy backpack for expansion.",
    difficulty: "intermediate",
    estimatedMinutes: 15,
  },
  {
    id: "diversification",
    title: "Diversify Your Portfolio",
    summary: "Don't put all your Poké Balls in one pocket — spread out!",
    pokemonAnalogy:
      "You wouldn't enter the Pokémon League with six Charizards and nothing else — one Water-type rival would wash your team away. Trainers mix types: Fire, Grass, Electric, Psychic. Investing is building a team of companies across different sectors (tech, food, healthcare) so one bad day doesn't knock out your whole squad.",
    investingConcept:
      "Diversification spreads risk by owning many different investments instead of betting on one.",
    kidExplanation:
      "If you only own one company's stock and it has a rough year, your whole pile suffers. If you own many different companies — like collecting different Pokémon types — one might have a bad day while others do fine. Spreading out is safer than betting everything on a single card.",
    sections: [
      {
        heading: "What's a Portfolio?",
        emoji: "📁",
        body: "Your portfolio is your whole collection of investments — stocks, funds, etc. Like a binder of cards, it's what you actually hold, not just one favorite.",
      },
      {
        heading: "Sector = Pokémon Type",
        emoji: "🎨",
        body: "PokeInvest colors companies by sector (Tech = Electric, Healthcare = Fairy, etc.). Different sectors react differently to news. A storm hurting travel might not hurt a cereal company much.",
      },
      {
        heading: "Correlation — Do They Move Together?",
        emoji: "🔗",
        body: "Some stocks move in similar patterns. Owning ten tech stocks might feel diverse but they're still one 'type.' True diversification mixes things that don't all rise and fall on the same day.",
      },
      {
        heading: "Index Funds — Pre-Built Teams",
        emoji: "📚",
        body: "An index fund holds hundreds of companies in one purchase — like buying a theme deck instead of one card. It's a simple way for young investors to spread risk without picking every stock alone.",
      },
      {
        heading: "Balance, Not Chaos",
        emoji: "⚖️",
        body: "Diversification doesn't mean own everything randomly. It means thoughtful variety: different sizes, sectors, and even countries. You can still have favorites — just don't make them 100% of your plan.",
      },
    ],
    keyTakeaways: [
      "A portfolio is your full collection of investments.",
      "Owning only one stock concentrates risk.",
      "Mix sectors (types) so one problem doesn't sink everything.",
      "Index funds can diversify quickly for beginners.",
      "Spreading out protects you — it doesn't guarantee profits.",
    ],
    tryItActivity: {
      title: "Build a 6-Stock Dream Team",
      steps: [
        "Pick 6 stocks in PokeInvest from at least 4 different Pokémon types (sectors).",
        "Name one risk each stock faces (competition, weather, new tech…).",
        "If one stock dropped 20%, would your whole team be okay?",
        "Draw your team like a Pokémon lineup with type icons.",
        "Explain to a family member why you didn't pick all one type.",
      ],
      reflectionQuestion:
        "Is it boring to own companies you don't think are the 'coolest'? Why might boring help?",
    },
    coachNote:
      "Kids may want only 'legendary' hot stocks. Praise enthusiasm, then show a Water gym beating an all-Fire team — diversification is strategy, not lack of faith.",
    pokemonExample:
      "Maya's binder was 90% one rare set. When reprints flooded the market, her binder value dipped hard. Her friend's mixed collection — different sets and rarities — barely wobbled. Maya learned to spread her trades.",
    difficulty: "intermediate",
    estimatedMinutes: 14,
  },
  {
    id: "risk-and-reward",
    title: "Risk & Reward",
    summary:
      "Bigger possible wins usually come with bigger possible bumps — choose wisely.",
    pokemonAnalogy:
      "A Magikarp is low risk — it probably won't win, but it won't surprise you either. A legendary with huge Attack might one-shot opponents… or faint if it misses. High-power Pokémon often have high stakes. Stocks work similarly: steady cereal companies usually move gently; young tech companies can soar or stumble fast. You choose how much roller-coaster you can handle.",
    investingConcept:
      "Higher potential returns usually come with higher risk of loss — there's no free lunch.",
    kidExplanation:
      "If you bet all your lunch money on one super-rare pull, you might win big or get nothing. Safer choices (like saving in a piggy bank) grow slowly but rarely shock you. Investing asks: How bumpy a ride are you okay with for a chance at bigger rewards?",
    sections: [
      {
        heading: "What Is Investment Risk?",
        emoji: "🎢",
        body: "Risk means the chance that results differ from what you hoped — especially losing money. Prices wiggle daily. Some companies fail. Even good companies have bad years. Risk isn't always bad; it's the price of aiming for growth.",
      },
      {
        heading: "Volatility — How Bumpy Is the Ride?",
        emoji: "🌊",
        body: "Volatility measures how wildly prices swing. Beta on a PokeInvest card is like a Speed stat for price moves. High beta = fast jumps; low beta = calmer path. Match volatility to your patience and timeline.",
      },
      {
        heading: "Risk Tolerance",
        emoji: "💪",
        body: "Risk tolerance is how much loss or drama you can stomach without panic-selling. Younger investors with long timelines might accept more bumps. Money needed soon (a near-term goal) usually belongs in steadier choices.",
      },
      {
        heading: "Rewards Take Time",
        emoji: "🏅",
        body: "Big rewards rarely come from guaranteed-safe bets. Savings accounts are steady but slow. Stocks historically offered higher long-term averages partly BECAUSE they're riskier. You earn potential reward for bearing uncertainty.",
      },
      {
        heading: "Smart Risk — Not Gambling",
        emoji: "🎯",
        body: "Gambling hopes for luck without research. Investing risk means accepting uncertainty AFTER learning fundamentals, diversifying, and planning. Never risk money you need for essentials.",
      },
    ],
    keyTakeaways: [
      "Higher possible gains often mean higher possible losses.",
      "Volatility (beta) shows how bumpy a stock's price can be.",
      "Know your risk tolerance before choosing investments.",
      "Time horizon matters — longer can smooth out bumps.",
      "Research and diversification manage risk; they don't erase it.",
    ],
    tryItActivity: {
      title: "Risk Meter Game",
      steps: [
        "Rate three investments 1–5 on 'bumpiness': savings account, one famous stock, a brand-new startup story.",
        "Find SPD (beta) on two PokeInvest cards. Which is bumpier?",
        "Write one reason a calm stock might be good for near-term goals.",
        "Write one reason a bumpier stock might suit long-term goals.",
        "Share with a grown-up: What would make YOU nervous about investing?",
      ],
      reflectionQuestion:
        "Why isn't 'no risk' the same as 'best choice'?",
    },
    coachNote:
      "Normalize fear — even pros feel it. Teach breathing and planning before reacting to a red day on the chart.",
    pokemonExample:
      "Leo chased only the highest-Attack cards with low HP. Spectacular when they worked — disastrous when they didn't. He added a tanky Defender type and started winning more consistently. His portfolio learned the same lesson.",
    difficulty: "intermediate",
    estimatedMinutes: 14,
  },
  {
    id: "long-term",
    title: "Think Long-Term",
    summary:
      "Great trainers — and investors — plan for the journey, not just one battle.",
    pokemonAnalogy:
      "Some trainers sell their first-edition cards the week after buying because the price dipped $5. Years later, those cards tripled. Others kept training one partner Pokémon from level 5 to 100, unlocking moves along the way. Long-term trainers trust growth over time. Investors who hold quality companies through ups and downs often do better than those who jump in and out every headline.",
    investingConcept:
      "Time in the market beats timing the market — patience and consistency matter.",
    kidExplanation:
      "Pokémon training takes many battles to evolve. You don't quit because you lost once. Good investing is similar: pick solid companies (or diversified funds), give them years, and avoid selling just because of a scary news day. Time helps smooth out the bumps.",
    sections: [
      {
        heading: "Timing vs. Time",
        emoji: "⏰",
        body: "'Timing the market' means guessing the perfect buy and sell days — even experts struggle! 'Time in the market' means staying invested so compounding and growth can work. Long horizons turn many small wins into big journeys.",
      },
      {
        heading: "Historical Perspective",
        emoji: "📜",
        body: "Stock markets have had many down years — and recovered over long periods before. Past performance never guarantees the future, but history shows patience helped investors who owned diversified stock holdings.",
      },
      {
        heading: "Panic-Selling",
        emoji: "😰",
        body: "Panic-selling is dumping investments because prices dropped and fear took over — like trading away a rare card during a bad week. Sometimes sales are smart, but fear-driven exits often lock in losses right before recoveries.",
      },
      {
        heading: "Goals and Horizons",
        emoji: "🗺️",
        body: "Match investments to goals. Money for a bike next summer needs a different plan than money for college in ten years. Long-term money can ride out storms; short-term money needs stability.",
      },
      {
        heading: "Keep Learning Along the Way",
        emoji: "📖",
        body: "Long-term doesn't mean 'buy and forget forever.' Check in yearly — read earnings, rebalance if needed, update goals. Like reviewing your team between gyms, stay engaged without obsessing daily.",
      },
    ],
    keyTakeaways: [
      "Long-term investing focuses on years, not days.",
      "Trying to guess every market move is extremely hard.",
      "Panic-selling often hurts more than riding out volatility.",
      "Match risk to how soon you need the money.",
      "Review regularly, but don't react to every headline.",
    ],
    tryItActivity: {
      title: "10-Year Trainer Pledge",
      steps: [
        "Pick a company you believe will still matter in 10 years.",
        "Write three reasons it could grow (product, customers, innovation).",
        "Write one scary thing that could go wrong — be honest!",
        "Draft a 'pledge': What would you do if the price dropped 15% next month?",
        "Discuss with a grown-up: What's a goal that's at least 5 years away?",
      ],
      reflectionQuestion:
        "Why might a patient trainer beat a trader who swaps cards every single day?",
    },
    coachNote:
      "Stories about missed gains from early selling resonate. Pair with empathy — fear is real. Plans written in calm moments help in scary ones.",
    pokemonExample:
      "In 2010, a kid's dad bought Disney stock as a birthday gift and tucked the certificate away. There were scary years, but dividends arrived and the business grew. Fifteen years later, the gift was worth far more — not from luck on one day, but from time.",
    difficulty: "intermediate",
    estimatedMinutes: 14,
  },
  {
    id: "compound-growth",
    title: "Compound Growth",
    summary:
      "Earnings on your earnings — like a Pokémon that levels up faster the higher it gets!",
    pokemonAnalogy:
      "A Pokémon at level 50 earns more experience per battle than it did at level 10 — growth builds on itself. Compound growth is money making money, and that new money making MORE money. Invest $100, earn $10, now you have $110 earning returns. Leave it alone for years and the snowball rolls bigger — like an Avalanche move that keeps hitting turn after turn.",
    investingConcept:
      "Compound growth reinvests returns so your money earns returns on returns over time.",
    kidExplanation:
      "If you plant a berry and it drops seeds that grow more berries, your patch spreads without you planting every single one. Compound growth is your investment earnings producing their own earnings. The longer you wait, the more the snowball effect shows up!",
    sections: [
      {
        heading: "Simple vs. Compound",
        emoji: "➕",
        body: "Simple growth adds the same amount each year ($10 on $100 every year). Compound growth calculates returns on the NEW total ($100 → $110 → $121…). The difference starts small, then becomes huge over decades.",
      },
      {
        heading: "The Role of Time",
        emoji: "⌛",
        body: "Compound growth loves time. Starting early — even with small amounts — gives money more years to stack. Two trainers investing the same annual amount can end miles apart if one starts ten years sooner.",
      },
      {
        heading: "Reinvesting Dividends",
        emoji: "🔄",
        body: "When companies pay dividends, reinvesting them buys more shares, which can earn more dividends later — a compound loop. It's like using prize money to buy more training gear that wins more prizes.",
      },
      {
        heading: "The Rule of 72 (Bonus Trick)",
        emoji: "🧮",
        body: "Divide 72 by an average yearly return to estimate years to double your money. At ~8% growth, money doubles in about 9 years (72 ÷ 8). It's a rough trainer hack, not exact math.",
      },
      {
        heading: "Realistic Expectations",
        emoji: "🌤️",
        body: "Markets don't grow in a straight line — some years are negative. Compounding works best with steady contributions, diversification, and patience through bumps. No magic — just math plus time.",
      },
    ],
    keyTakeaways: [
      "Compound growth = earning returns on your returns.",
      "Time is a superpower — starting early helps a lot.",
      "Reinvesting dividends fuels the snowball.",
      "Small regular contributions can grow surprisingly large.",
      "Growth isn't linear every year, but long horizons help.",
    ],
    tryItActivity: {
      title: "Snowball Calculator",
      steps: [
        "Imagine you invest $50 at age 10 and add $10 each year.",
        "Pretend 7% average growth (kid-level estimate, not a promise).",
        "Use an online compound interest calculator with a grown-up.",
        "See the total at age 18 vs. what you put in.",
        "Write one sentence: What surprised you about the snowball?",
      ],
      reflectionQuestion:
        "Why does waiting one more decade sometimes matter more than adding a little extra money?",
    },
    coachNote:
      "Kids love 'double your money' demos. Always note returns vary — we're teaching the engine of growth, not promising lottery outcomes.",
    pokemonExample:
      "Two trainers save tournament prize money. Alex spends wins on snacks. Jordan reinvests $20 each month into a broad fund. Ten years later, Jordan's snowball is large enough to fund a dream trip to Worlds — Alex remembers delicious berries.",
    difficulty: "intermediate",
    estimatedMinutes: 15,
  },
  {
    id: "dividends",
    title: "Dividends",
    summary:
      "Some companies share their profits with owners — like prize money for shareholders!",
    pokemonAnalogy:
      "After winning a Gym battle, the leader sometimes hands out prize money or TM discs. Companies that earn profit may share cash with shareholders as dividends — a thank-you payment for owning stock. You still own your shares; you just also get a little Poké Dollar rain for being on the team.",
    investingConcept:
      "Dividends are cash payments some companies distribute to shareholders from profits.",
    kidExplanation:
      "Imagine you and friends co-own a lemonade stand. On a great Saturday, you split the extra cash instead of keeping it all in the till. Dividends are that split for real companies. Not every company pays them — some reinvest everything to grow faster.",
    sections: [
      {
        heading: "What Is a Dividend?",
        emoji: "💵",
        body: "A dividend is cash (sometimes stock) paid to shareholders, usually from profits. It's quoted as dollars per share per year or as a yield (% of price). On PokeInvest cards, dividend info appears in fundamentals.",
      },
      {
        heading: "Who Pays and Who Doesn't?",
        emoji: "🏢",
        body: "Mature, profitable companies (think consumer brands) often pay steady dividends. Fast-growing companies may pay zero because they reinvest every dollar into expansion — like spending all prize money on better training equipment.",
      },
      {
        heading: "Dividend Yield",
        emoji: "📐",
        body: "Yield = annual dividend ÷ stock price. A $2 dividend on a $50 stock ≈ 4% yield. Higher yield isn't always better — super high yields can signal trouble. Compare yields within similar companies.",
      },
      {
        heading: "Reinvest or Spend?",
        emoji: "🔁",
        body: "You can spend dividends like allowance or reinvest to buy more shares (dividend reinvestment plans). Reinvesting feeds compound growth — the snowball from the last lesson!",
      },
      {
        heading: "Dividends Aren't Guaranteed",
        emoji: "⚠️",
        body: "Companies can cut or pause dividends if earnings fall. Dividends reward owners, but the stock price can still go up or down. Think total return: price change + dividends received.",
      },
    ],
    keyTakeaways: [
      "Dividends are profit-sharing payments to shareholders.",
      "Not all companies pay dividends — some reinvest to grow.",
      "Dividend yield shows payment size relative to stock price.",
      "Reinvesting dividends can boost compound growth.",
      "Dividends can change — they're not promised forever.",
    ],
    tryItActivity: {
      title: "Dividend Detective",
      steps: [
        "Find a stock in PokeInvest with a dividend yield listed.",
        "If you owned 10 shares, estimate yearly cash (yield × price × 10).",
        "Would you reinvest or spend? Write why.",
        "Find a fast-growing tech stock — does it pay a dividend? Why might that be?",
        "Ask a grown-up if they know a company famous for paying dividends.",
      ],
      reflectionQuestion:
        "Why might a growing company choose NOT to pay dividends?",
    },
    coachNote:
      "Kids may chase the highest yield like rarest cards. Teach that sustainability matters — steady trainers beat flashy one-season wonders.",
    pokemonExample:
      "A theme park company earns millions each summer. Instead of keeping all cash, it mails shareholders a portion every quarter. Owners cheer for big crowds AND enjoy small checks — like badge winners sharing league prize pools.",
    difficulty: "intermediate",
    estimatedMinutes: 13,
  },
];

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: "asset",
    term: "Asset",
    definition:
      "Something valuable that a person or company owns — cash, buildings, inventory, or investments.",
    pokemonTieIn:
      "Like all the items and Poké Dollars in your trainer bag — useful stuff you control.",
  },
  {
    id: "liability",
    term: "Liability",
    definition:
      "Money or obligations owed to others — loans, bills, or debts that must be repaid.",
    pokemonTieIn:
      "Rare Candies you borrowed from a friend — you still owe them back!",
  },
  {
    id: "equity",
    term: "Equity",
    definition:
      "What's left after subtracting liabilities from assets; for shareholders, their ownership stake in the company.",
    pokemonTieIn:
      "Your net worth after paying back what you owe — the part that's truly yours.",
  },
  {
    id: "stock",
    term: "Stock",
    definition:
      "A share representing partial ownership in a corporation, traded on markets.",
    pokemonTieIn:
      "A membership token for a real-world 'gym' (company) that you can trade with others.",
  },
  {
    id: "dividend",
    term: "Dividend",
    definition:
      "A cash payment some companies send to shareholders from profits.",
    pokemonTieIn:
      "Prize money handed out after a big win — except for owning stock.",
  },
  {
    id: "supply",
    term: "Supply",
    definition:
      "How much of a good or service is available for sale at various prices.",
    pokemonTieIn:
      "How many booster packs the shop has on the shelf right now.",
  },
  {
    id: "demand",
    term: "Demand",
    definition:
      "How much people want to buy a good or service at various prices.",
    pokemonTieIn:
      "How badly trainers want that chase card everyone is talking about.",
  },
  {
    id: "market-price",
    term: "Market Price",
    definition:
      "The current price at which buyers and sellers actually trade an asset.",
    pokemonTieIn:
      "The final handshake price at a card trade table — not just the sticker on the binder.",
  },
  {
    id: "fundamentals",
    term: "Fundamentals",
    definition:
      "Financial measures of a company's health — earnings, growth, debt, margins, and cash flow.",
    pokemonTieIn:
      "Base stats on a Pokémon card — the numbers behind the cool artwork.",
  },
  {
    id: "earnings",
    term: "Earnings",
    definition:
      "A company's profit over a period after costs; reported quarterly as EPS (earnings per share).",
    pokemonTieIn:
      "Your battle score after expenses — did the strategy actually work?",
  },
  {
    id: "diversification",
    term: "Diversification",
    definition:
      "Spreading investments across many assets to reduce reliance on any single one.",
    pokemonTieIn:
      "Building a balanced team with multiple types instead of six of the same Pokémon.",
  },
  {
    id: "compound-growth",
    term: "Compound Growth",
    definition:
      "Growth that builds on prior growth — returns earning additional returns over time.",
    pokemonTieIn:
      "Experience points stacking so each level-up comes faster than the last.",
  },
  {
    id: "risk",
    term: "Risk",
    definition:
      "The chance that an investment's outcome will differ from expectations, including loss.",
    pokemonTieIn:
      "Using a high-Attack glass cannon — thrilling wins and sudden faints.",
  },
  {
    id: "portfolio",
    term: "Portfolio",
    definition:
      "The full collection of investments a person holds — stocks, funds, bonds, etc.",
    pokemonTieIn:
      "Your entire card binder plus sealed products — everything you own as a collector.",
  },
  {
    id: "index-fund",
    term: "Index Fund",
    definition:
      "A fund that tracks a market index (like the S&P 500), holding many companies in one basket.",
    pokemonTieIn:
      "Buying a pre-built theme deck with lots of different cards instead of hunting one single rare.",
  },
  {
    id: "shareholder",
    term: "Shareholder",
    definition:
      "A person or institution that owns shares of a company's stock.",
    pokemonTieIn:
      "A gym member who owns one of those ownership tokens and shares in its success.",
  },
  {
    id: "bull-market",
    term: "Bull Market",
    definition:
      "A period when prices broadly rise and investor confidence is strong.",
    pokemonTieIn:
      "When every trade feels like a winning streak and prices keep climbing.",
  },
  {
    id: "bear-market",
    term: "Bear Market",
    definition:
      "A period when prices broadly fall — often 20%+ from recent highs — and mood is cautious.",
    pokemonTieIn:
      "A tough season where losses stack up and trainers play extra carefully.",
  },
  {
    id: "inflation",
    term: "Inflation",
    definition:
      "A general rise in prices over time, reducing what each dollar can buy.",
    pokemonTieIn:
      "When the same Poké Dollar buys fewer Potions than it did last year.",
  },
  {
    id: "reinvest",
    term: "Reinvest",
    definition:
      "Using investment returns (like dividends) to buy more assets instead of spending the cash.",
    pokemonTieIn:
      "Putting tournament prize money back into training gear to win even more later.",
  },
];

export const ADVENTURE_PATH: AdventureStep[] = [
  {
    lessonId: "supply-demand",
    order: 1,
    prerequisites: [],
    badgeName: "Market Scout",
    badgeEmoji: "🔍",
  },
  {
    lessonId: "who-sets-value",
    order: 2,
    prerequisites: ["supply-demand"],
    badgeName: "Price Tracker",
    badgeEmoji: "💹",
  },
  {
    lessonId: "what-is-a-stock",
    order: 3,
    prerequisites: ["who-sets-value"],
    badgeName: "Shareholder Badge",
    badgeEmoji: "📜",
  },
  {
    lessonId: "fundamentals",
    order: 4,
    prerequisites: ["what-is-a-stock"],
    badgeName: "Stats Reader",
    badgeEmoji: "📊",
  },
  {
    lessonId: "balance-sheet",
    order: 5,
    prerequisites: ["fundamentals"],
    badgeName: "Balance Keeper",
    badgeEmoji: "⚖️",
  },
  {
    lessonId: "diversification",
    order: 6,
    prerequisites: ["balance-sheet"],
    badgeName: "Deck Builder",
    badgeEmoji: "🎴",
  },
  {
    lessonId: "risk-and-reward",
    order: 7,
    prerequisites: ["diversification"],
    badgeName: "Risk Ranger",
    badgeEmoji: "⚡",
  },
  {
    lessonId: "long-term",
    order: 8,
    prerequisites: ["risk-and-reward"],
    badgeName: "Patient Trainer",
    badgeEmoji: "🌱",
  },
  {
    lessonId: "compound-growth",
    order: 9,
    prerequisites: ["long-term"],
    badgeName: "Growth Guru",
    badgeEmoji: "📈",
  },
  {
    lessonId: "dividends",
    order: 10,
    prerequisites: ["compound-growth"],
    badgeName: "Dividend Champion",
    badgeEmoji: "💰",
  },
];

export const XP_RULES = {
  perCorrectAnswer: 15,
  perfectQuizBonus: 10,
  lessonCompletionBonus: 25,
  tryItActivityBonus: 15,
  passThresholdPercent: 67,
  questionsPerLesson: 8,
} as const;