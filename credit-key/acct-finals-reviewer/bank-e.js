/* The Ledger - chapters 12-13 and supplements for the uploaded exam notes */
window.BANK = (window.BANK || []).concat([

/* ---------- CHAPTER 12: STATEMENT OF CASH FLOWS ---------- */
{c:12,p:"Which cash flow is an operating activity?",o:["Cash collected from customers","Cash paid to purchase equipment","Cash received from issuing shares","Cash paid for dividends"],a:0,r:["","Purchasing equipment is investing.","Issuing shares is financing.","Paying dividends is financing."],e:"Operating activities are the day-to-day revenue-producing activities, including customer collections."},

{c:12,p:"Which cash flow is an investing activity?",o:["Cash paid to purchase machinery","Cash paid to suppliers","Cash borrowed from a bank","Cash received from customers"],a:0,r:["","Suppliers are operating.","Borrowing is financing.","Customer collections are operating."],e:"Investing activities involve acquiring or disposing of long-term assets and investments."},

{c:12,p:"Which cash flow is a financing activity?",o:["Cash paid for dividends","Cash paid to employees","Cash paid for inventory","Cash received from customers"],a:0,r:["","Employees are operating.","Inventory is operating.","Customer collections are operating."],e:"Financing activities involve owners and borrowings, including dividends and share issuance."},

{c:12,p:"A company issues shares to purchase land. How is this reported?",o:["Separately as a non-cash investing and financing activity","As an operating inflow","As an investing inflow","As a financing inflow"],a:0,r:["","No cash moved, so it is not in operating activities.","No cash moved, so it is not an investing cash inflow.","No cash moved, so it is not a financing cash inflow."],e:"Non-cash investing and financing activities are reported separately. They do not appear in the three cash flow sections."},

{c:12,s:"Cash collected from customers is ₱2,000,000. Cash paid to suppliers is ₱800,000, to employees ₱500,000, and other operating payments ₱200,000.",p:"What is net cash from operating activities?",o:["₱500,000","₱1,200,000","₱2,000,000","₱700,000"],a:0,r:["","That ignores the other operating payments.","That is total collections.","That subtracts only suppliers and employees."],e:"₱2,000,000 − ₱800,000 − ₱500,000 − ₱200,000 = ₱500,000."},

{c:12,s:"Operating cash flow is ₱800,000, investing cash flow is −₱500,000, financing cash flow is ₱200,000, and beginning cash is ₱300,000.",p:"What is ending cash?",o:["₱800,000","₱500,000","₱300,000","₱1,000,000"],a:0,r:["","That is the net change, not the ending balance.","That is the beginning balance.","That adds the net change twice."],e:"Net change = ₱800,000 − ₱500,000 + ₱200,000 = ₱500,000. Ending cash = ₱300,000 + ₱500,000 = ₱800,000."},

{c:12,s:"Net cash from operating activities is ₱1,500,000. Capital expenditures are ₱900,000.",p:"What is free cash flow?",o:["₱600,000","₱2,400,000","₱900,000","₱1,500,000"],a:0,r:["","That adds capex instead of subtracting it.","That is the capex amount.","That is operating cash flow before capex."],e:"FCF = Operating cash flow − Capital expenditures = ₱1,500,000 − ₱900,000 = ₱600,000."},

{c:12,p:"Which statement about the direct and indirect methods is correct?",o:["Both produce the same net cash from operating activities","Only the direct method is allowed under PFRS","The indirect method starts with cash collected from customers","The direct method starts with net income"],a:0,r:["","Both are acceptable presentations under the standards.","The indirect method starts with net income, not cash collections.","The direct method shows cash receipts and payments, not net income."],e:"The two methods differ in presentation but reconcile to the same net operating cash flow."},

{c:12,s:"A company has positive operating cash flow, negative investing cash flow, and negative financing cash flow.",p:"What is the most likely interpretation?",o:["It is generating operating cash, investing in assets, and repaying or distributing cash","It is relying on new financing to fund losses","It is selling assets to pay operating costs","It is not generating any cash from operations"],a:0,r:["","Positive operating cash flow means operations are generating cash.","Negative investing means buying assets, not selling them.","Operating cash flow is positive."],e:"This pattern is typical of a mature company funding investment and returning cash to lenders or owners."},

{c:12,s:"Net income is ₱500,000. Depreciation expense is ₱80,000. Accounts receivable increased by ₱30,000 and accounts payable increased by ₱20,000.",p:"What is net cash from operating activities under the indirect method?",o:["₱570,000","₱500,000","₱630,000","₱530,000"],a:0,r:["","That ignores depreciation and working capital changes.","That adds the receivables increase and ignores the payable.","That subtracts the payables increase."],e:"Start with net income ₱500,000, add depreciation ₱80,000, subtract the AR increase ₱30,000, add the AP increase ₱20,000 = ₱570,000."},

/* ---------- CHAPTER 13: TREND ANALYSIS & BENCHMARKING ---------- */
{c:13,s:"Sales were ₱6,000,000 in 2025 and ₱7,500,000 in 2026.",p:"What is the percentage change?",o:["25%","20%","125%","80%"],a:0,r:["","That divides the change by the current year.","That is the trend percentage, not the change.","That inverts the ratio."],e:"Peso change = ₱1,500,000. ₱1,500,000 ÷ ₱6,000,000 = 25%."},

{c:13,s:"Net income was ₱900,000 in 2025 and ₱750,000 in 2026.",p:"What is the percentage change?",o:["−16.7%","−20.0%","+16.7%","−25.0%"],a:0,r:["","That divides the change by the current year.","Net income decreased, so the change is negative.","That uses the wrong base."],e:"Change = −₱150,000. −₱150,000 ÷ ₱900,000 = −16.7%."},

{c:13,s:"Net sales are ₱7,500,000 and cost of goods sold is ₱5,250,000.",p:"What is COGS as a percentage of net sales?",o:["70%","30%","140%","7%"],a:0,r:["","That is the gross profit percentage.","That divides sales by COGS.","That misplaces the decimal."],e:"₱5,250,000 ÷ ₱7,500,000 = 70%. For every ₱100 of sales, ₱70 goes to COGS."},

{c:13,s:"Inventory is ₱1,500,000 and total assets are ₱5,000,000.",p:"What percentage of total assets is inventory?",o:["30%","20%","40%","33.3%"],a:0,r:["","That is accounts receivable's share in the example.","That is PPE's share.","That divides total assets by inventory."],e:"₱1,500,000 ÷ ₱5,000,000 = 30%."},

{c:13,s:"Company A has net income of ₱10 million on sales of ₱100 million. Company B has net income of ₱3 million on sales of ₱20 million.",p:"Which company has the higher net profit margin?",o:["Company B at 15%","Company A at 10%","They are equal","Company A at 15%"],a:0,r:["","Company A's margin is 10%, not 15%.","Company B's margin is 15%, so they are not equal.","Company A's margin is 10%."],e:"Company A: 10%. Company B: ₱3M ÷ ₱20M = 15%. B is more profitable per peso of sales."},

{c:13,s:"Aurora's gross margin is 30%. The industry average is 38%.",p:"What does the comparison suggest?",o:["Aurora is underperforming the industry on gross margin","Aurora is outperforming the industry","Aurora has no pricing or cost issue","The industry average is irrelevant"],a:0,r:["","A lower gross margin than the benchmark suggests underperformance.","A 30% margin is below 38%.","Benchmarking provides useful context for performance."],e:"Aurora's 30% gross margin is 8 points below the industry average, so it should investigate pricing and cost control."},

{c:13,s:"Sales were ₱5,000,000 in the base year and ₱7,500,000 in the current year.",p:"What is the trend percentage?",o:["150%","50%","125%","75%"],a:0,r:["","That is the percentage increase, not the trend index.","That divides current by base incorrectly.","That is below the base."],e:"Trend percentage = current ÷ base × 100 = ₱7,500,000 ÷ ₱5,000,000 × 100 = 150%."},

{c:13,p:"Which is a limitation of trend analysis?",o:["Accounting methods and estimates may differ across periods or companies","It uses percentages instead of pesos","It can compare companies of different sizes","It is based on financial statements"],a:0,r:["","Using percentages is a feature, not a limitation.","Common-size analysis helps compare different sizes.","Using financial statements is the basis of the analysis."],e:"Changes in accounting methods, estimates, inflation, seasonality, and one-time events can distort comparisons."},

{c:13,p:"Which analysis compares a company's performance across periods?",o:["Horizontal analysis","Vertical analysis","Common-size analysis","Benchmarking"],a:0,r:["","Vertical analysis compares items within one period.","Common-size is a form of vertical analysis.","Benchmarking compares against other companies or standards."],e:"Horizontal analysis measures change over time. Vertical analysis measures composition within a period."},

/* ---------- CHAPTER 1 SUPPLEMENTS ---------- */
{c:1,p:"Which form of business is a separate legal entity with limited liability for its owners?",o:["Corporation","Sole proprietorship","Partnership","Freelance practice"],a:0,r:["","A sole proprietorship is not legally separate, and the owner bears the risks personally.","A partnership is not a separate legal entity in the same way, and liability depends on the structure.","A freelance practice is usually a sole proprietorship."],e:"A corporation is legally separate from its owners. Ownership is represented by shares, and shareholders have limited liability."},

{c:1,p:"Which set of financial reporting standards is used in the Philippines?",o:["PFRS","U.S. GAAP","IFRS only","None, each company chooses"],a:0,r:["","U.S. GAAP is used in the United States.","IFRS is used internationally, but the Philippines has adopted PFRS.","Standards are required for comparability."],e:"PFRS (Philippine Financial Reporting Standards) is the reporting framework used in the Philippines."},

{c:1,p:"Why are ethics and accounting standards important?",o:["They make financial information trustworthy and comparable","They guarantee that every company earns a profit","They eliminate the need for auditors","They let each company choose its own rules"],a:0,r:["","Accounting cannot guarantee profitability.","Auditors still provide independent assurance.","Standards exist precisely so companies do not each choose their own rules."],e:"Ethics and standards create a common, trustworthy language for financial reporting."},

{c:1,s:"A company purchased equipment for ₱100,000 cash but recorded the transaction as Dr Supplies ₱100,000 / Cr Cash ₱100,000.",p:"What is the correcting entry?",o:[
["DR|Equipment|₱100,000","CR|Supplies|₱100,000"],
["DR|Supplies|₱100,000","CR|Equipment|₱100,000"],
["DR|Equipment|₱100,000","CR|Cash|₱100,000"],
["DR|Cash|₱100,000","CR|Supplies|₱100,000"]],a:0,r:["","That reverses the correction and leaves the wrong account in place.","That records a second cash purchase, but cash was already credited.","That increases cash, which was correctly reduced."],e:"The cash credit was correct. Reclassify the debit from Supplies to Equipment: Dr Equipment / Cr Supplies."},

{c:1,p:"A ₱540 payment was recorded as ₱450 on both the debit and credit sides. Will the trial balance balance?",o:["Yes, because both sides are equally wrong","No, because the amount is wrong","No, because cash is involved","Yes, but only after the error is corrected"],a:0,r:["","The trial balance only checks equality, and both sides are equally wrong.","Cash being involved does not affect the balance.","The trial balance still balances before correction."],e:"A wrong amount recorded on both sides keeps total debits equal to total credits. The trial balance balances despite the error."},

{c:1,p:"Which step comes immediately after preparing the unadjusted trial balance?",o:["Record adjusting entries","Prepare the financial statements","Close the temporary accounts","Prepare the post-closing trial balance"],a:0,r:["","The financial statements come after the adjusted trial balance.","Closing comes after the statements.","The post-closing trial balance is the final step."],e:"The unadjusted trial balance is reviewed, then adjusting entries are recorded."},

{c:1,p:"Which step comes immediately after preparing the adjusted trial balance?",o:["Prepare the financial statements","Record adjusting entries","Post to the general ledger","Prepare the post-closing trial balance"],a:0,r:["","Adjusting entries come before the adjusted trial balance.","Posting comes before the unadjusted trial balance.","The post-closing trial balance comes after closing."],e:"The adjusted trial balance is the direct source for the financial statements."},

{c:1,p:"Which statement links net income to ending retained earnings?",o:["Statement of retained earnings","Income statement","Balance sheet","Statement of cash flows"],a:0,r:["","The income statement computes net income but does not show retained earnings.","The balance sheet reports ending retained earnings but does not show the reconciliation.","The cash flow statement explains cash movements."],e:"The statement of retained earnings starts with beginning RE, adds net income, subtracts dividends, and ends with ending RE."},

/* ---------- CHAPTER 3 SUPPLEMENTS ---------- */
{c:3,p:"Under the direct write-off method, when is bad debt expense recognized?",o:["When a specific account is deemed uncollectible","At the end of every period based on an estimate","When credit sales are made","When the allowance is created"],a:0,r:["","That is the allowance method.","Credit sales do not trigger the expense under direct write-off.","The direct write-off method does not use an allowance."],e:"Direct write-off waits until a specific customer account is identified as uncollectible, then writes it off to expense."},

{c:3,p:"Which receivable is a formal written promise with a specified maturity date and usually earns interest?",o:["Notes receivable","Accounts receivable","Prepaid expense","Unearned revenue"],a:0,r:["","Accounts receivable are informal promises from normal credit sales.","A prepaid expense is an asset, not a receivable.","Unearned revenue is a liability."],e:"Notes receivable are supported by a promissory note, have a maturity date, and usually carry interest."},

/* ---------- CHAPTER 4 SUPPLEMENTS ---------- */
{c:4,s:"A natural resource costs ₱5,000,000, has no residual value, and is estimated to contain 1,000,000 tons. In the first year, 200,000 tons are extracted.",p:"What is depletion for the year?",o:["₱1,000,000","₱5,000,000","₱200,000","₱4,000,000"],a:0,r:["","That is the full cost, not the year's depletion.","That is the tonnage, not the peso amount.","That is the remaining cost after one year."],e:"Depletion rate = ₱5,000,000 ÷ 1,000,000 tons = ₱5 per ton. 200,000 × ₱5 = ₱1,000,000."},

{c:4,s:"Goodwill has a carrying value of ₱2,000,000. Its fair value is now ₱1,700,000.",p:"What is the impairment loss?",o:["₱300,000","₱2,000,000","₱1,700,000","₱0"],a:0,r:["","That is the carrying value, not the loss.","That is the fair value, not the loss.","An impairment loss exists because fair value is below carrying value."],e:"Impairment loss = ₱2,000,000 − ₱1,700,000 = ₱300,000. Goodwill is written down and the loss is recognized."},

{c:4,s:"A company buys equipment for ₱400,000. It pays ₱15,000 delivery, ₱25,000 installation, ₱10,000 employee training, and ₱12,000 for an annual maintenance contract.",p:"What amount is capitalized as the cost of the equipment?",o:["₱440,000","₱452,000","₱465,000","₱400,000"],a:0,r:["","That includes the annual maintenance contract, which is expensed.","That includes training and maintenance, both expensed.","That excludes delivery and installation, which are capitalized."],e:"Capitalize the purchase price, delivery, and installation: ₱400,000 + ₱15,000 + ₱25,000 = ₱440,000. Training and routine maintenance are expensed."},

/* ---------- CHAPTER 5 SUPPLEMENTS ---------- */
{c:5,p:"A company estimates ₱90,000 in warranty costs for the year. What is the entry to record the estimate?",o:[
["DR|Warranty Expense|₱90,000","CR|Warranty Provision|₱90,000"],
["DR|Warranty Provision|₱90,000","CR|Cash|₱90,000"],
["DR|Warranty Provision|₱90,000","CR|Warranty Expense|₱90,000"],
["DR|Warranty Expense|₱90,000","CR|Cash|₱90,000"]],a:0,r:["","That records payment of claims, not the estimate.","That reduces the provision and the expense.","That records the expense only when cash is paid, which is not accrual accounting."],e:"Match the estimated warranty cost to the period of sale: Dr Warranty Expense / Cr Warranty Provision."},

{c:5,s:"A company estimated ₱90,000 in warranty costs. It has paid ₱55,000 in claims, leaving ₱35,000 in the provision. Management now determines that only ₱20,000 is still required.",p:"What is the December 31 adjusting entry?",o:[
["DR|Warranty Provision|₱15,000","CR|Warranty Expense|₱15,000"],
["DR|Warranty Expense|₱15,000","CR|Warranty Provision|₱15,000"],
["DR|Warranty Provision|₱35,000","CR|Cash|₱35,000"],
["DR|Warranty Expense|₱20,000","CR|Warranty Provision|₱20,000"]],a:0,r:["","That increases the provision and expense.","That records the claims paid, not the adjustment.","That writes off the entire provision."],e:"The provision is ₱15,000 too high (₱35,000 − ₱20,000). Reduce it and credit the expense."},

{c:5,s:"Gross salaries are ₱180,000. Employee deductions are ₱27,000. The company pays the net salaries immediately.",p:"What is the entry?",o:[
["DR|Salaries Expense|₱180,000","CR|Withholding Taxes Payable|₱27,000","CR|Cash|₱153,000"],
["DR|Salaries Expense|₱153,000","CR|Cash|₱153,000"],
["DR|Salaries Expense|₱180,000","CR|Cash|₱180,000"],
["DR|Salaries Payable|₱180,000","CR|Cash|₱180,000"]],a:0,r:["","That records only the net pay as expense and ignores the deductions.","That ignores the payable for the deductions.","That debits a liability instead of recording the expense."],e:"Salaries expense is the gross ₱180,000. Cash paid is ₱153,000, and the ₱27,000 deduction is a payable."},

{c:5,s:"A company previously recognized a ₱200,000 provision for a lawsuit. Legal counsel now estimates a probable settlement of ₱350,000.",p:"What is the adjusting entry?",o:[
["DR|Litigation Expense|₱150,000","CR|Provision for Lawsuit|₱150,000"],
["DR|Litigation Expense|₱350,000","CR|Provision for Lawsuit|₱350,000"],
["DR|Provision for Lawsuit|₱200,000","CR|Cash|₱200,000"],
["DR|Provision for Lawsuit|₱150,000","CR|Litigation Expense|₱150,000"]],a:0,r:["","That records the full settlement instead of the ₱150,000 increase.","That records payment of the old provision. The case is not settled yet.","That reverses the provision and reduces the expense, the opposite of the additional loss."],e:"The provision must increase by ₱150,000 to reach the new estimate. Recognize the additional litigation expense."},

{c:5,s:"On September 1, a company borrows ₱900,000 at 8% annual interest. Interest is payable annually beginning August 31 of the next year.",p:"What is the December 31 adjusting entry?",o:[
["DR|Interest Expense|₱24,000","CR|Interest Payable|₱24,000"],
["DR|Interest Expense|₱72,000","CR|Interest Payable|₱72,000"],
["DR|Interest Payable|₱24,000","CR|Cash|₱24,000"],
["DR|Notes Payable|₱24,000","CR|Interest Payable|₱24,000"]],a:0,r:["","That records a full year of interest.","That credits cash before payment.","That debits the note principal instead of interest expense."],e:"Interest = ₱900,000 × 8% × 4/12 = ₱24,000. Accrue the expense and a payable."},

{c:5,s:"A company expects to receive ₱500,000 four years from now. The appropriate annual interest rate is 6%.",p:"What is the present value?",o:["₱396,047","₱500,000","₱631,238","₱444,998"],a:0,r:["","That is the future amount, not its present value.","That is the future value of ₱500,000 invested today.","That is the value after three years, not four."],e:"PV = ₱500,000 ÷ (1.06)^4 ≈ ₱396,047."},

{c:5,s:"A company invests ₱500,000 today at 6% annual interest for four years.",p:"What is the future value?",o:["₱631,238","₱500,000","₱396,047","₱530,000"],a:0,r:["","That is the present amount, not the future value.","That is the present value of ₱500,000 due in four years.","That is the value after one year."],e:"FV = ₱500,000 × (1.06)^4 ≈ ₱631,238."},

{c:5,s:"A company has 8% bonds ready to issue. Market rates suddenly rise from 8% to 11%.",p:"What happens?",o:["The bonds sell at a discount because the coupon is now below the market rate","The bonds sell at a premium because the coupon is now below the market rate","The coupon rate rises to 11%","The bonds still sell at par"],a:0,r:["","A below-market coupon means investors pay less than face, which is a discount.","The coupon rate is fixed on the bond certificate and does not change.","Par requires the coupon to equal the market rate."],e:"The coupon stays at 8%, but investors now demand 11%, so the price falls below face. The bond sells at a discount."},

{c:5,p:"How is the issue price of a bond determined?",o:["Present value of future interest payments plus present value of the face amount","Face value plus total future interest","Face value minus the coupon rate","The market price of the issuer's shares"],a:0,r:["","That ignores the time value of money.","The coupon rate is used to compute cash interest, not to reduce face value.","Bond price is based on the bond's cash flows, not the share price."],e:"Investors discount the bond's future interest and principal at the market rate. The sum of those present values is the issue price."},

/* ---------- CHAPTER 6 SUPPLEMENTS ---------- */
{c:6,p:"Which step comes immediately after recording the closing entries?",o:["Prepare the post-closing trial balance","Prepare the adjusted trial balance","Prepare the income statement","Record adjusting entries"],a:0,r:["","The adjusted trial balance comes before the statements and closing.","The income statement comes before closing.","Adjusting entries come before the adjusted trial balance."],e:"After closing, the post-closing trial balance confirms that debits equal credits and only permanent accounts remain."}

]);
