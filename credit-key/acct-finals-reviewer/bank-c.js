/* The Ledger - coverage supplements for the full review guide */
window.BANK = (window.BANK || []).concat([

/* ---------- CH1 SUPPLEMENTS ---------- */
{c:1,p:"Which source document would you examine first to record a sale made on credit?",o:["Sales invoice","Bank deposit slip","Purchase order","Payroll register"],a:0,r:["","A bank deposit slip supports a cash receipt, not a credit sale.","A purchase order is a buying document. It does not evidence a sale to a customer.","A payroll register supports wage payments, not sales."],e:"The sales invoice shows the customer, the amount billed, and the date, which are the inputs for the receivable and revenue entry."},

{c:1,p:"Which statement best distinguishes financial accounting from managerial accounting?",o:["Financial accounting reports to external users under standards; managerial accounting supports internal decisions","Financial accounting is optional; managerial accounting is required by law","Financial accounting uses only the cash basis; managerial accounting uses only the accrual basis","Financial accounting covers the future; managerial accounting covers only the past"],a:0,r:["","Both are core functions. Managerial reports are not legally mandated in the way external reporting is.","Both can use accrual concepts. The distinction is the audience and purpose, not the basis.","Managerial accounting is heavily forward-looking through budgets. Financial reporting is historical."],e:"Financial accounting serves investors, creditors, and regulators through general-purpose statements. Managerial accounting serves insiders with budgets, cost analysis, and decisions."},

{c:1,p:"Which transaction increases retained earnings?",o:["Earning net income","Issuing common stock","Borrowing cash from a bank","Paying a dividend"],a:0,r:["","Stock issuance increases contributed capital, not retained earnings.","Borrowing increases assets and liabilities. Equity is unchanged.","Dividends reduce retained earnings."],e:"Retained earnings accumulates profits not distributed. Net income increases it; dividends decrease it. Stock issuance goes to contributed capital."},

/* ---------- CH2 SUPPLEMENTS ---------- */
{c:2,p:"On October 1 the company paid \u20b124,000 cash for a one-year insurance policy. What is the October 1 entry?",o:[
["DR|Prepaid Insurance|\u20b124,000","CR|Cash|\u20b124,000"],
["DR|Insurance Expense|\u20b124,000","CR|Cash|\u20b124,000"],
["DR|Cash|\u20b124,000","CR|Prepaid Insurance|\u20b124,000"],
["DR|Insurance Expense|\u20b12,000","CR|Prepaid Insurance|\u20b12,000"]],a:0,r:["","That expenses the whole policy on day one. Only one month has expired by October 31, and the payment buys a future benefit.","That records a refund or a sale of the policy, not a purchase.","That is the October 31 adjusting entry, not the October 1 payment."],e:"Paying in advance creates an asset. The cost sits in Prepaid Insurance until each month expires."},

{c:2,p:"On October 5 the company received \u20b160,000 cash in advance for services to be performed later. What is the October 5 entry?",o:[
["DR|Cash|\u20b160,000","CR|Unearned Revenue|\u20b160,000"],
["DR|Cash|\u20b160,000","CR|Service Revenue|\u20b160,000"],
["DR|Unearned Revenue|\u20b160,000","CR|Cash|\u20b160,000"],
["DR|Accounts Receivable|\u20b160,000","CR|Service Revenue|\u20b160,000"]],a:0,r:["","That recognizes revenue before any work is done. The obligation is still outstanding.","That reverses the entry and records a payment, not a receipt.","No receivable exists. The customer paid cash."],e:"Cash received before performance creates a liability. Revenue is recognized only as the work is completed."},

/* ---------- CH3 SUPPLEMENTS ---------- */
{c:3,p:"A customer settles an overdue account by signing a \u20b1100,000, 90-day, 6% note on November 1. What is the November 1 entry?",o:[
["DR|Notes Receivable|\u20b1100,000","CR|Accounts Receivable|\u20b1100,000"],
["DR|Cash|\u20b1100,000","CR|Notes Receivable|\u20b1100,000"],
["DR|Notes Receivable|\u20b1100,000","CR|Service Revenue|\u20b1100,000"],
["DR|Accounts Receivable|\u20b1100,000","CR|Notes Receivable|\u20b1100,000"]],a:0,r:["","No cash changed hands. The customer signed a note instead of paying.","The customer already owed for services. Replacing the receivable with a note is not new revenue.","That reverses the entry and leaves the overdue receivable on the books."],e:"The trade receivable is converted into a formal note receivable. The customer still owes the same principal, now with interest."},

{c:3,s:"Net credit sales are \u20b11,000,000 and 2% is estimated uncollectible. The Allowance account already has a \u20b15,000 credit balance.",p:"What is the year-end entry under the percentage-of-sales method?",o:[
["DR|Bad Debt Expense|\u20b120,000","CR|Allowance for Doubtful Accounts|\u20b120,000"],
["DR|Bad Debt Expense|\u20b115,000","CR|Allowance for Doubtful Accounts|\u20b115,000"],
["DR|Bad Debt Expense|\u20b125,000","CR|Allowance for Doubtful Accounts|\u20b125,000"],
["DR|Allowance for Doubtful Accounts|\u20b120,000","CR|Bad Debt Expense|\u20b120,000"]],a:0,r:["","That nets the existing balance against the expense. The percentage-of-sales method ignores the existing balance.","That adds the existing balance to the expense.","That reverses the entry and reduces the allowance."],e:"The income statement approach computes expense directly: \u20b11,000,000 \u00d7 2% = \u20b120,000, regardless of the existing balance."},

{c:3,p:"A \u20b14,000 receivable from a customer is judged uncollectible and written off under the allowance method. What is the entry?",o:[
["DR|Allowance for Doubtful Accounts|\u20b14,000","CR|Accounts Receivable|\u20b14,000"],
["DR|Bad Debt Expense|\u20b14,000","CR|Accounts Receivable|\u20b14,000"],
["DR|Accounts Receivable|\u20b14,000","CR|Allowance for Doubtful Accounts|\u20b14,000"],
["DR|Bad Debt Expense|\u20b14,000","CR|Allowance for Doubtful Accounts|\u20b14,000"]],a:0,r:["","The expense was already estimated. Writing off now would double count it.","That reinstates the receivable, the opposite of a write-off.","That creates a new expense instead of using the allowance that was already built."],e:"The write-off clears the specific receivable against the allowance. No expense is recorded on that date."},

{c:3,s:"On December 31, \u20b12,000 of interest has accrued on a bank note payable. It will be paid on January 15.",p:"What is the December 31 adjusting entry?",o:[
["DR|Interest Expense|\u20b12,000","CR|Interest Payable|\u20b12,000"],
["DR|Interest Payable|\u20b12,000","CR|Interest Expense|\u20b12,000"],
["DR|Interest Expense|\u20b12,000","CR|Cash|\u20b12,000"],
["DR|Notes Payable|\u20b12,000","CR|Interest Payable|\u20b12,000"]],a:0,r:["","That reduces the liability and reduces expense, the reverse of accruing.","Cash has not been paid yet. The offset is a payable.","Principal is not interest. The note payable balance is unchanged by an interest accrual."],e:"The company owes interest for December, so expense and a payable are recorded. Cash moves in January."},

/* ---------- CH4 SUPPLEMENTS ---------- */
{c:4,s:"A machine is purchased for \u20b1500,000. The company also pays \u20b120,000 freight, \u20b130,000 installation, and \u20b110,000 for damage caused during unloading.",p:"What amount is capitalized as the cost of the machine?",o:["\u20b1550,000","\u20b1560,000","\u20b1540,000","\u20b1500,000"],a:0,r:["","That includes the \u20b110,000 damage, which is expensed rather than capitalized.","That excludes installation, which is a necessary cost to make the machine operational.","That excludes freight, which is part of getting the asset to the site."],e:"\u20b1500,000 + \u20b120,000 freight + \u20b130,000 installation = \u20b1550,000. Damage from improper handling is expensed."},

{c:4,s:"The company pays \u20b180,000 cash to replace a building's roof with a longer-life material that extends the building's useful life.",p:"What is the entry?",o:[
["DR|Building|\u20b180,000","CR|Cash|\u20b180,000"],
["DR|Maintenance Expense|\u20b180,000","CR|Cash|\u20b180,000"],
["DR|Accumulated Depreciation|\u20b180,000","CR|Cash|\u20b180,000"],
["DR|Repair Expense|\u20b180,000","CR|Accounts Payable|\u20b180,000"]],a:0,r:["","A life-extending replacement is a capital improvement, not routine maintenance.","That credits cash but debits accumulated depreciation, which reduces the contra account without adding the asset.","The work was paid in cash, and the cost is capital, not a payable expense."],e:"The new roof extends useful life, so the cost is capitalized into the building asset."},

{c:4,s:"The company pays \u20b115,000 cash for routine oil changes and cleaning of its delivery equipment.",p:"What is the entry?",o:[
["DR|Maintenance Expense|\u20b115,000","CR|Cash|\u20b115,000"],
["DR|Equipment|\u20b115,000","CR|Cash|\u20b115,000"],
["DR|Accumulated Depreciation|\u20b115,000","CR|Cash|\u20b115,000"],
["DR|Prepaid Maintenance|\u20b115,000","CR|Cash|\u20b115,000"]],a:0,r:["","Routine servicing does not extend life or add capacity, so it is not capitalized.","That reduces the contra asset instead of recording the expense.","The service was consumed immediately, so there is no future benefit to prepay."],e:"Ordinary repairs keep the asset in normal condition and are expensed as incurred."},

{c:4,s:"Machinery costing \u20b1420,000 has a \u20b160,000 residual value and an estimated lifetime output of 90,000 units. The rate is \u20b14.00 per unit. Year 2 production is 25,000 units.",p:"What is Year 2 depreciation?",o:["\u20b1100,000","\u20b172,000","\u20b190,000","\u20b125,000"],a:0,r:["","That is Year 1 depreciation at 18,000 units.","That uses a \u20b13.60 rate, which ignores residual value.","That is the unit count, not the expense."],e:"25,000 units \u00d7 \u20b14.00 = \u20b1100,000. Expense tracks actual output each period."},

{c:4,s:"A company pays \u20b12,000,000 to acquire a business. The fair value of the target's identifiable net assets is \u20b11,700,000.",p:"How much goodwill is recorded?",o:["\u20b1300,000","\u20b11,700,000","\u20b12,000,000","\u20b10"],a:0,r:["","That is the fair value of the net assets, not the excess.","That is the purchase price, not goodwill.","Goodwill exists because the price exceeds the fair value of identifiable net assets."],e:"Goodwill = \u20b12,000,000 \u2212 \u20b11,700,000 = \u20b1300,000. It is recorded only in an acquisition and tested for impairment."},

/* ---------- CH5 SUPPLEMENTS ---------- */
{c:5,p:"On January 1 a company issues \u20b11,000,000 of 8% bonds at par. What is the issuance entry?",o:[
["DR|Cash|\u20b11,000,000","CR|Bonds Payable|\u20b11,000,000"],
["DR|Cash|\u20b11,000,000","CR|Interest Payable|\u20b11,000,000"],
["DR|Bonds Payable|\u20b11,000,000","CR|Cash|\u20b11,000,000"],
["DR|Cash|\u20b11,080,000","CR|Bonds Payable|\u20b11,000,000","CR|Premium on Bonds Payable|\u20b180,000"]],a:0,r:["","Interest is paid periodically, not at issuance. The credit is the principal liability.","That records retirement of the bonds, not issuance.","At par there is no premium. The extra \u20b180,000 is the first year's interest, not part of the issue price."],e:"At par, cash received equals face value and Bonds Payable is credited for the principal."},

{c:5,s:"A \u20b11,000,000 bond issue reaches maturity. All interest has already been paid and the carrying value is \u20b11,000,000.",p:"What is the entry to retire the bonds?",o:[
["DR|Bonds Payable|\u20b11,000,000","CR|Cash|\u20b11,000,000"],
["DR|Cash|\u20b11,000,000","CR|Bonds Payable|\u20b11,000,000"],
["DR|Bonds Payable|\u20b11,000,000","CR|Gain on Retirement|\u20b11,000,000"],
["DR|Interest Expense|\u20b11,000,000","CR|Cash|\u20b11,000,000"]],a:0,r:["","That records borrowing, not repayment.","Retiring debt at face produces no gain.","Repaying principal is not interest expense."],e:"The liability is debited and cash is credited for face value. No gain or loss arises at maturity."},

/* ---------- CH6 SUPPLEMENTS ---------- */
{c:6,p:"Which statement explains the net change in cash across operating, investing, and financing activities?",o:["Statement of cash flows","Income statement","Statement of retained earnings","Balance sheet"],a:0,r:["","The income statement reports revenues and expenses, not cash movements.","That statement tracks retained earnings, not cash.","The balance sheet shows ending cash but not the flows that changed it."],e:"The statement of cash flows classifies cash receipts and payments into operating, investing, and financing activities."},

{c:6,p:"Which account is classified as a current liability?",o:["Current portion of long-term debt","Bonds payable due in eight years","Common stock","Accumulated depreciation"],a:0,r:["","A bond maturing in eight years is long-term.","Common stock is equity.","Accumulated depreciation is a contra asset."],e:"The current portion is the principal due within one year or the operating cycle. It is reclassified out of long-term debt."},

{c:6,p:"Which report is the direct source for preparing the financial statements?",o:["Adjusted trial balance","Unadjusted trial balance","Post-closing trial balance","General journal"],a:0,r:["","It still contains balances before period-end adjustments.","It comes after the statements and closing entries.","The journal is the book of original entry, not a summarized source for statements."],e:"After all adjustments are posted, the adjusted trial balance holds the final balances used to build each statement."},

/* ---------- CH7 SUPPLEMENTS ---------- */
{c:7,s:"Cash and cash equivalents are \u20b1120,000 and current liabilities are \u20b1300,000.",p:"What is the cash ratio?",o:["0.40","2.50","1.20","0.12"],a:0,r:["","That divides current liabilities by cash, the inverse.","That uses total current assets, not cash alone.","That misplaces a decimal."],e:"\u20b1120,000 \u00f7 \u20b1300,000 = 0.40. It is the most conservative liquidity test because it counts only cash."},

{c:7,s:"Net sales are \u20b12,400,000 and average total assets are \u20b11,200,000.",p:"What is total asset turnover?",o:["2.0","0.5","1.2","2.4"],a:0,r:["","That inverts the ratio.","That divides sales by 2,000,000, not average assets.","That uses the sales figure as the ratio."],e:"\u20b12,400,000 \u00f7 \u20b11,200,000 = 2.0. Each peso of assets generates \u20b12.00 of sales."},

{c:7,s:"Net income is \u20b1600,000 and average shareholders' equity is \u20b12,400,000.",p:"What is return on equity?",o:["25%","12.5%","40%","4%"],a:0,r:["","That divides net income by total assets, not equity.","That is the inverse of the equity base.","That misplaces a decimal."],e:"\u20b1600,000 \u00f7 \u20b12,400,000 = 25%. ROE measures the return on owners' capital."},

{c:7,s:"Total liabilities are \u20b12,400,000 and total assets are \u20b14,000,000.",p:"What is the debt-to-assets ratio?",o:["60%","40%","1.5","166.7%"],a:0,r:["","That is the equity-to-assets share.","That is debt-to-equity, not debt-to-assets.","That divides assets by liabilities."],e:"\u20b12,400,000 \u00f7 \u20b14,000,000 = 60%. Creditors finance 60% of the asset base."},

{c:7,s:"The market price per share is \u20b145 and earnings per share is \u20b13.00.",p:"What is the price-to-earnings ratio?",o:["15.0","3.0","45.0","0.067"],a:0,r:["","That is the EPS, not the multiple.","That is the share price, not the multiple.","That inverts the ratio."],e:"\u20b145 \u00f7 \u20b13.00 = 15.0. Investors pay \u20b115 for each \u20b11 of current earnings."}

]);
