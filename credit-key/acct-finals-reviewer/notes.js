/* The Ledger - exam notes for two short bond papers, front and back */
window.NOTES = [
  {
    side: "Side 1 / front",
    title: "Foundations, cycle, and daily entries",
    blocks: [
      { h: "The equation", m: true, items: [
        "Assets = Liabilities + Equity",
        "Equity = Common Stock + Beg. RE + Revenues − Expenses − Dividends"
      ]},
      { h: "Normal balances", m: true, items: [
        "Debit: assets, expenses, dividends",
        "Credit: liabilities, equity, revenues, contra assets"
      ]},
      { h: "Standards and ownership", items: [
        "GAAP: U.S. standards. IFRS: international. PFRS: Philippines",
        "Sole proprietorship: one owner, personal liability",
        "Partnership: two or more owners, liability depends on structure",
        "Corporation: separate legal entity, limited liability, shares"
      ]},
      { h: "The cycle", m: true, items: [
        "1 Analyze → 2 Journalize → 3 Post → 4 Unadjusted TB",
        "5 Adjust → 6 Adjusted TB → 7 Statements → 8 Close → 9 Post-closing TB"
      ]},
      { h: "Closing entries", m: true, items: [
        "1 Dr Revenues / Cr Income Summary",
        "2 Dr Income Summary / Cr Expenses",
        "3 Dr Income Summary / Cr Retained Earnings (reverse for a loss)",
        "4 Dr Retained Earnings / Cr Dividends"
      ]},
      { h: "Daily entries", m: true, items: [
        "Stock issue: Dr Cash / Cr Common Stock",
        "Bank loan: Dr Cash / Cr Notes Payable",
        "Buy asset: Dr Equipment / Cr Cash",
        "Part cash, part credit: Dr Equipment (full) / Cr Cash + Cr AP",
        "Service for cash: Dr Cash / Cr Service Revenue",
        "Service on account: Dr AR / Cr Service Revenue",
        "Split cash and credit: Dr Cash + Dr AR / Cr Service Revenue",
        "Collect AR: Dr Cash / Cr AR",
        "Buy inventory on credit: Dr Inventory / Cr AP",
        "Perpetual sale: Dr Cash/AR / Cr Sales; Dr COGS / Cr Inventory"
      ]},
      { h: "Correcting entries and errors", items: [
        "Wrong account: Dr correct account / Cr wrong account",
        "Wrong amount on both sides: trial balance still balances",
        "Omitted or double-recorded transaction: trial balance still balances",
        "Debit posted without its credit: trial balance is out of balance"
      ]},
      { h: "Rules that decide entries", items: [
        "Revenue is earned, not collected",
        "Expense is incurred, not paid",
        "Stock issuance is not revenue; dividends are not an expense",
        "Every entry has total debits = total credits"
      ]}
    ]
  },
  {
    side: "Side 1 / back",
    title: "Adjustments, receivables, cash, inventory",
    blocks: [
      { h: "Four adjustments", m: true, items: [
        "Prepaid expense: Dr Expense / Cr Prepaid",
        "Unearned revenue: Dr Unearned Revenue / Cr Revenue",
        "Accrued expense: Dr Expense / Cr Payable",
        "Accrued revenue: Dr Receivable / Cr Revenue"
      ]},
      { h: "Adjustment rules", items: [
        "Never involve Cash",
        "One balance sheet account + one income statement account",
        "Deferral: cash first. Accrual: cash later"
      ]},
      { h: "Interest", m: true, items: [
        "I = P × R × T, using a 360-day year unless told otherwise",
        "₱100,000 × 6% × 60/360 = ₱1,000"
      ]},
      { h: "Note receivable", m: true, items: [
        "Receive note: Dr Notes Receivable / Cr AR",
        "Accrue interest: Dr Interest Receivable / Cr Interest Revenue",
        "Maturity: Dr Cash / Cr Notes Receivable + Interest Receivable + Interest Revenue"
      ]},
      { h: "Allowance method", m: true, items: [
        "NRV = Gross AR − Allowance",
        "% of sales: Bad Debt Expense = Credit Sales × % (ignore existing allowance)",
        "Aging: adjustment = target allowance − existing credit balance",
        "Existing debit: adjustment = target + debit balance",
        "Write-off: Dr Allowance / Cr AR, no expense, NRV unchanged",
        "Recovery: Dr AR / Cr Allowance; then Dr Cash / Cr AR",
        "Direct write-off: expense only when a specific account is uncollectible"
      ]},
      { h: "Bank reconciliation", m: true, items: [
        "Bank side: deposits in transit (+), outstanding checks (−), bank errors (±). No entry",
        "Book side: service charges (−), NSF checks (−), interest/EFT (+), book errors (±). Entry",
        "Adjusted bank balance = adjusted book balance",
        "Service charge: Dr Bank Service Charge Expense / Cr Cash",
        "NSF: Dr Accounts Receivable / Cr Cash",
        "Interest or EFT: Dr Cash / Cr Interest Revenue or Accounts Receivable",
        "Book error: correct the expense or revenue and Cash"
      ]},
      { h: "Inventory", m: true, items: [
        "Perpetual updates continuously; periodic uses Purchases and a period-end count",
        "Beginning Inventory + Purchases − Ending Inventory = COGS",
        "FIFO: oldest costs first. Weighted average: blend. LIFO: newest first",
        "LIFO is not permitted under PFRS/IFRS",
        "Lower of cost and NRV: report the lower; write-down Dr Loss / Cr Inventory",
        "Shrinkage: records > count. Overage: count > records",
        "Inventory turnover = COGS ÷ Average Inventory"
      ]}
    ]
  },
  {
    side: "Side 2 / front",
    title: "PPE, liabilities, bonds, and equity",
    blocks: [
      { h: "Capitalize vs expense", items: [
        "Capitalize purchase price, non-refundable tax, freight, transit insurance, installation, testing",
        "Expense transit damage, fines, training, routine maintenance",
        "Repairs are expensed; improvements are capitalized"
      ]},
      { h: "Depreciation", m: true, items: [
        "Straight-line: (Cost − Residual) ÷ Life",
        "Units-of-production: (Cost − Residual) ÷ Total units × units used",
        "DDB rate = 2 ÷ Life; expense = beginning book value × rate",
        "DDB ignores residual in the rate, but book value never goes below residual",
        "Final DDB year is a plug to residual. Partial year: months/12",
        "Book value = cost − accumulated depreciation"
      ]},
      { h: "Disposal and intangibles", m: true, items: [
        "Disposal: Dr Cash + Dr Accumulated Depreciation + Dr Loss (or Cr Gain) / Cr Asset at cost",
        "Patent: amortize cost ÷ useful life",
        "Goodwill: only from an acquisition, not amortized, tested for impairment",
        "Depletion = (Cost − Residual) ÷ Total units × units extracted"
      ]},
      { h: "Liabilities and provisions", m: true, items: [
        "Current: due within one year or the operating cycle",
        "Warranty estimate: Dr Warranty Expense / Cr Warranty Provision",
        "Claims paid: Dr Warranty Provision / Cr Cash. Adjust the provision to the required balance",
        "Payroll: Dr Salaries Expense (gross) / Cr Withholding Taxes Payable + Cr Cash (net)",
        "Probable lawsuit: Dr Litigation Expense / Cr Provision for Lawsuit",
        "Note interest: Dr Interest Expense / Cr Interest Payable",
        "Current portion: Dr Long-Term Notes Payable / Cr Current Portion of LTD"
      ]},
      { h: "Bonds", m: true, items: [
        "Coupon = market → par. Coupon < market → discount. Coupon > market → premium",
        "Cash interest = Face × Coupon",
        "Discount: interest expense = cash interest + amortization; carrying value rises",
        "Premium: interest expense = cash interest − amortization; carrying value falls",
        "Straight-line amortization = total discount or premium ÷ years",
        "Issue: Dr Cash + Dr Discount (or Cr Premium) / Cr Bonds Payable",
        "Interest: Dr Interest Expense + Dr Premium (or Cr Discount) / Cr Cash",
        "Bond price = PV of future interest + PV of face. At maturity, carrying value = face"
      ]},
      { h: "Time value", m: true, items: [
        "Future value: FV = PV(1 + r)^n",
        "Present value: PV = FV ÷ (1 + r)^n"
      ]},
      { h: "Shareholders' equity", m: true, items: [
        "Common issue above par: Dr Cash / Cr Common Stock at par + Cr APIC for the excess",
        "Preferred: dividend preference, usually limited voting, priority over common",
        "Treasury stock: Dr Treasury Stock / Cr Cash. Contra-equity, debit balance",
        "Outstanding shares = issued shares − treasury shares",
        "Cash dividend declaration: Dr Dividends / Cr Dividends Payable",
        "Record date: no entry. Payment: Dr Dividends Payable / Cr Cash",
        "Preferred dividend = Par × Shares × Rate",
        "Book value per common share = (Total equity − Preferred equity) ÷ Common shares outstanding",
        "Ending RE = Beginning RE + Net Income − Dividends"
      ]}
    ]
  },
  {
    side: "Side 2 / back",
    title: "Statements, cash flows, ratios, and trends",
    blocks: [
      { h: "Statements and closing", m: true, items: [
        "Order: Income statement → Retained earnings → Balance sheet → Cash flows",
        "Ending RE = Beginning RE + Net Income − Dividends",
        "Closing: revenues → Income Summary → expenses → Income Summary → RE → Dividends",
        "Income Summary is temporary and never appears on a statement",
        "Dividends bypass Income Summary. Post-closing TB: permanent accounts only"
      ]},
      { h: "Statement of cash flows", m: true, items: [
        "Operating: customers, suppliers, employees, rent, taxes",
        "Investing: buy or sell long-term assets and investments",
        "Financing: borrow, repay principal, issue shares, repurchase shares, pay dividends",
        "Direct method: cash collections − cash payments = net operating cash",
        "Net change in cash = operating + investing + financing",
        "Beginning cash + net change = ending cash",
        "Non-cash investing/financing: report separately, not in the three sections",
        "Free cash flow = Operating cash flow − Capital expenditures",
        "Indirect: Net income + depreciation − increase in AR + increase in AP"
      ]},
      { h: "Ratios", m: true, items: [
        "Current = Current Assets ÷ Current Liabilities",
        "Quick = (Cash + Marketable Securities + Net AR) ÷ CL",
        "Cash = Cash ÷ CL",
        "AR turnover = Net Credit Sales ÷ Average Net AR",
        "DSO = 365 ÷ AR turnover",
        "Inventory turnover = COGS ÷ Average Inventory",
        "DIO = 365 ÷ Inventory turnover",
        "Total asset turnover = Net Sales ÷ Average Total Assets",
        "Gross margin = Gross Profit ÷ Net Sales",
        "Net margin = Net Income ÷ Net Sales",
        "ROA = Net Income ÷ Average Total Assets",
        "ROE = Net Income ÷ Average Equity",
        "Debt-to-assets = Total Liabilities ÷ Total Assets",
        "Debt-to-equity = Total Liabilities ÷ Total Equity",
        "TIE = EBIT ÷ Interest Expense",
        "EPS = (Net Income − Preferred Dividends) ÷ Weighted Common Shares",
        "P/E = Market Price per Share ÷ EPS",
        "Average = (Beginning + Ending) ÷ 2"
      ]},
      { h: "DuPont", m: true, items: [
        "ROE = Net Margin × Asset Turnover × Equity Multiplier",
        "Net margin = NI ÷ Sales; asset turnover = Sales ÷ Assets; equity multiplier = Assets ÷ Equity"
      ]},
      { h: "Trend analysis", items: [
        "Horizontal: change over time. Percentage change = (Current − Base) ÷ Base × 100",
        "Trend percentage = Current ÷ Base × 100",
        "Vertical: item ÷ base. IS base: net sales. BS base: total assets",
        "Common-size: vertical analysis in percentage form",
        "Benchmarking: compare with history, competitors, or industry averages"
      ]},
      { h: "Traps", items: [
        "Adjusting entries never touch Cash",
        "A trial balance only proves debits = credits",
        "A write-off records no expense and leaves NRV unchanged",
        "% of sales ignores the existing allowance; aging targets the ending balance",
        "Land is never depreciated. DDB residual is a floor, not a base",
        "Repairs are expensed; improvements are capitalized",
        "Discount carrying value rises; premium falls; at maturity both equal face",
        "Dividends bypass Income Summary",
        "Bank-side items and the dividend record date need no entry",
        "Treasury stock is contra-equity; LIFO is not permitted under PFRS"
      ]}
    ]
  }
];
