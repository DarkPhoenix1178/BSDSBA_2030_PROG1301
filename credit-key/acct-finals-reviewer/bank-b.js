/* The Ledger - question bank, chapters 5-8 */
window.BANK = (window.BANK || []).concat([

/* ---------- CHAPTER 5: LIABILITIES & BONDS ---------- */
{c:5,s:"A company has a \u20b11,200,000 long-term loan with \u20b1400,000 of principal due next June 30. It is December 31.",p:"What is the reclassification entry?",o:[
["DR|Long-Term Notes Payable|\u20b1400,000","CR|Current Portion of Long-Term Debt|\u20b1400,000"],
["DR|Current Portion of Long-Term Debt|\u20b1400,000","CR|Long-Term Notes Payable|\u20b1400,000"],
["DR|Interest Expense|\u20b1400,000","CR|Interest Payable|\u20b1400,000"],
["DR|Long-Term Notes Payable|\u20b11,200,000","CR|Current Portion of Long-Term Debt|\u20b11,200,000"]],a:0,r:["","That reverses the reclassification. The non-current balance falls and the current liability rises.","Principal is not interest. No expense arises from moving a maturity date.","Only the portion due within one year moves. \u20b1800,000 stays long-term."],e:"The principal due within one year becomes a current liability. The long-term account is debited and a current portion account is credited."},

{c:5,p:"A bond's coupon rate is below the market rate. Which statement is correct?",o:["It sells at a discount; interest expense exceeds cash interest","It sells at a premium; interest expense exceeds cash interest","It sells at a discount; interest expense is less than cash interest","It sells at par; the rates are equal"],a:0,r:["","A below-market coupon is unattractive, so investors pay less than face. That is a discount.","The discount adds to interest expense, so expense is higher than the cash coupon.","Par requires the coupon to equal the market rate."],e:"Investors pay less than face to earn the market yield. The discount amortizes into interest expense, so expense is higher than the cash coupon."},

{c:5,p:"\u20b11,000,000 of 8% bonds are issued at par. What is the annual interest entry?",o:[
["DR|Interest Expense|\u20b180,000","CR|Cash|\u20b180,000"],
["DR|Interest Expense|\u20b180,000","CR|Bonds Payable|\u20b180,000"],
["DR|Cash|\u20b180,000","CR|Interest Revenue|\u20b180,000"],
["DR|Interest Expense|\u20b1100,000","CR|Cash|\u20b1100,000"]],a:0,r:["","Interest is paid in cash each year; it does not increase the bond principal.","That records receipt of interest, not payment by the issuer.","Interest is 8% of face: \u20b180,000, not 10%."],e:"At par, cash interest equals interest expense: \u20b11,000,000 \u00d7 8% = \u20b180,000."},

{c:5,s:"\u20b11,000,000 face, 5-year, 8% bonds are issued for \u20b1950,000. The company uses straight-line amortization.",p:"What is annual discount amortization?",o:["\u20b110,000","\u20b150,000","\u20b190,000","\u20b18,000"],a:0,r:["","That is the total discount, not the annual amount.","That is total annual interest expense, which combines cash interest and amortization.","That is 8% of the discount. Straight-line divides by the 5-year life."],e:"Total discount \u20b150,000 \u00f7 5 years = \u20b110,000 per year."},

{c:5,s:"₱1,000,000 face, 5-year, 8% bonds are issued for ₱950,000. The company uses straight-line amortization.",p:"What is annual interest expense on the discount bond?",o:["\u20b190,000","\u20b180,000","\u20b170,000","\u20b1100,000"],a:0,r:["","That is only the cash coupon. The discount amortization must be added.","That subtracts amortization, which is the premium treatment.","That adds the full discount instead of one year's amortization."],e:"Cash interest \u20b180,000 plus discount amortization \u20b110,000 = \u20b190,000."},

{c:5,s:"₱1,000,000 face, 5-year, 8% bonds are issued for ₱950,000. The company uses straight-line amortization.",p:"What is the issuance entry for the discount bond?",o:[
["DR|Cash|\u20b1950,000","DR|Discount on Bonds Payable|\u20b150,000","CR|Bonds Payable|\u20b11,000,000"],
["DR|Cash|\u20b1950,000","CR|Bonds Payable|\u20b1950,000"],
["DR|Cash|\u20b11,050,000","CR|Bonds Payable|\u20b11,000,000","CR|Premium on Bonds Payable|\u20b150,000"],
["DR|Cash|\u20b11,000,000","CR|Bonds Payable|\u20b11,000,000"]],a:0,r:["","Bonds Payable is always credited at face. Moving the \u20b150,000 difference into a contra account is correct here.","The bonds were issued at a price above face, not below.","That records the bond at face and ignores the \u20b150,000 discount. Cash received was only \u20b1950,000."],e:"Cash is debited for the proceeds, the discount is debited as a contra liability, and Bonds Payable is credited at face."},

{c:5,s:"₱1,000,000 face, 5-year, 8% bonds are issued for ₱950,000. The company uses straight-line amortization.",p:"What is the annual interest and amortization entry for the discount bond?",o:[
["DR|Interest Expense|\u20b190,000","CR|Discount on Bonds Payable|\u20b110,000","CR|Cash|\u20b180,000"],
["DR|Interest Expense|\u20b180,000","CR|Cash|\u20b180,000"],
["DR|Interest Expense|\u20b190,000","CR|Cash|\u20b190,000"],
["DR|Interest Expense|\u20b170,000","DR|Premium on Bonds Payable|\u20b110,000","CR|Cash|\u20b180,000"]],a:0,r:["","That ignores the discount amortization. Expense must include the \u20b110,000.","Cash interest is fixed at \u20b180,000. The extra \u20b110,000 is non-cash amortization.","A discount bond amortizes its discount, not a premium."],e:"Expense is \u20b190,000: \u20b180,000 paid in cash plus \u20b110,000 of discount amortization."},

{c:5,s:"₱1,000,000 face, 5-year, 8% bonds are issued for ₱950,000. The company uses straight-line amortization.",p:"What is the carrying value at the end of Year 3?",o:["\u20b1980,000","\u20b1970,000","\u20b11,000,000","\u20b1950,000"],a:0,r:["","That is the end of Year 2. Three years of amortization total \u20b130,000.","That is face value, reached only at maturity.","That is the issue price, before any amortization."],e:"Unamortized discount is \u20b150,000 \u2212 (3 \u00d7 \u20b110,000) = \u20b120,000. Face minus discount = \u20b1980,000."},

{c:5,s:"\u20b11,000,000 face, 5-year, 8% bonds are issued for \u20b11,050,000 with straight-line amortization.",p:"What is annual interest expense?",o:["\u20b170,000","\u20b180,000","\u20b190,000","\u20b150,000"],a:0,r:["","That is cash interest only. The premium reduces expense.","That adds amortization, which is the discount treatment.","That subtracts the whole premium instead of one year's amortization."],e:"Cash interest \u20b180,000 minus premium amortization \u20b110,000 = \u20b170,000."},

{c:5,s:"₱1,000,000 face, 5-year, 8% bonds are issued for ₱1,050,000. The company uses straight-line amortization.",p:"What is the issuance entry for the premium bond?",o:[
["DR|Cash|\u20b11,050,000","CR|Bonds Payable|\u20b11,000,000","CR|Premium on Bonds Payable|\u20b150,000"],
["DR|Cash|\u20b11,050,000","CR|Bonds Payable|\u20b11,050,000"],
["DR|Cash|\u20b1950,000","DR|Discount on Bonds Payable|\u20b150,000","CR|Bonds Payable|\u20b11,000,000"],
["DR|Cash|\u20b11,000,000","CR|Bonds Payable|\u20b11,000,000"]],a:0,r:["","Bonds Payable is credited at face. The excess is a separate premium account.","A premium is a credit, and cash received is a debit.","That records only face value and ignores the \u20b150,000 premium actually received. Cash should be \u20b11,050,000."],e:"Cash is debited for \u20b11,050,000, Bonds Payable is credited at face, and the \u20b150,000 excess is credited to Premium on Bonds Payable."},

{c:5,s:"₱1,000,000 face, 5-year, 8% bonds are issued for ₱1,050,000. The company uses straight-line amortization.",p:"What is the annual interest and amortization entry for the premium bond?",o:[
["DR|Interest Expense|\u20b170,000","DR|Premium on Bonds Payable|\u20b110,000","CR|Cash|\u20b180,000"],
["DR|Interest Expense|\u20b180,000","CR|Cash|\u20b180,000"],
["DR|Interest Expense|\u20b190,000","CR|Premium on Bonds Payable|\u20b110,000","CR|Cash|\u20b180,000"],
["DR|Interest Expense|\u20b170,000","CR|Cash|\u20b170,000"]],a:0,r:["","That ignores the premium amortization, which lowers expense to \u20b170,000.","Cash paid is the coupon, \u20b180,000. The premium is non-cash.","Cash paid is the full \u20b180,000 coupon. The premium is debited, not credited, and it reduces expense."],e:"Expense is \u20b170,000, the premium absorbs \u20b110,000, and cash paid is the full \u20b180,000 coupon."},

{c:5,s:"₱1,000,000 face, 5-year, 8% bonds are issued for ₱1,050,000. The company uses straight-line amortization.",p:"What is the carrying value at the end of Year 4?",o:["\u20b11,010,000","\u20b11,020,000","\u20b11,000,000","\u20b11,050,000"],a:0,r:["","That is the end of Year 3. Four years of amortization total \u20b140,000.","That is face, reached only at maturity.","That is the issue price, before amortization."],e:"Remaining premium is \u20b150,000 \u2212 \u20b140,000 = \u20b110,000, added to face."},

{c:5,p:"At the maturity date, the carrying value of a bond is:",o:["Always equal to face value","Equal to the original issue price","Higher than face for a discount bond","Lower than face for a premium bond"],a:0,r:["","Amortization moves carrying value to face, away from the issue price.","A discount bond starts below face and rises to face.","A premium bond starts above face and falls to face."],e:"Amortization drives the carrying value to face over the bond's life, whichever way it started."},

/* ---------- CHAPTER 6: STATEMENTS & CLOSING ---------- */
{c:6,s:"Beginning retained earnings are \u20b140,000. Net income is \u20b1100,000 and dividends are \u20b110,000.",p:"What is ending retained earnings?",o:["\u20b1130,000","\u20b1140,000","\u20b1150,000","\u20b1120,000"],a:0,r:["","That adds net income but forgets dividends.","That adds dividends instead of subtracting them.","That subtracts both net income and dividends."],e:"\u20b140,000 + \u20b1100,000 \u2212 \u20b110,000 = \u20b1130,000."},

{c:6,p:"Which statement reports financial position at a single point in time?",o:["Balance sheet","Income statement","Statement of retained earnings","Statement of cash flows"],a:0,r:["","The income statement covers a period of activity, not a point in time.","That explains changes over a period.","That explains cash movements over a period."],e:"The balance sheet is a snapshot at a date. The other statements cover a period."},

{c:6,p:"How are accounts receivable shown on a classified balance sheet?",o:["Gross receivables less the allowance for doubtful accounts","Gross receivables at full amount","Net of all liabilities","Only the allowance balance"],a:0,r:["","That overstates receivables by the amount expected to be uncollectible.","Receivables are assets and are not netted against liabilities.","The allowance is a deduction, not the amount shown."],e:"Contra assets are netted against their paired asset, not listed separately at the bottom."},

{c:6,s:"Central Perk Dance Academy: service revenue ₱170,000, total expenses ₱70,000, dividends ₱10,000. The four closing steps are: 1 close revenues to Income Summary, 2 close expenses to Income Summary, 3 close Income Summary to Retained Earnings, 4 close Dividends to Retained Earnings.",p:"What is the first closing entry in the four-step closing process?",o:[
["DR|Service Revenue|\u20b1170,000","CR|Income Summary|\u20b1170,000"],
["DR|Income Summary|\u20b1170,000","CR|Service Revenue|\u20b1170,000"],
["DR|Cash|\u20b1170,000","CR|Service Revenue|\u20b1170,000"],
["DR|Service Revenue|\u20b1170,000","CR|Retained Earnings|\u20b1170,000"]],a:0,r:["","That reverses the closing entry and increases revenue.","Closing does not touch cash. It zeroes the revenue account.","Revenue closes to Income Summary first, not directly to retained earnings."],e:"Debit the revenue account to zero it and credit Income Summary for the total."},

{c:6,s:"Central Perk Dance Academy: service revenue ₱170,000; salaries ₱33,000, supplies ₱21,000, rent ₱11,000, depreciation ₱3,000, insurance ₱2,000; dividends ₱10,000. The four closing steps are: 1 close revenues to Income Summary, 2 close expenses to Income Summary, 3 close Income Summary to Retained Earnings, 4 close Dividends to Retained Earnings. The first entry has already closed Service Revenue to Income Summary.",p:"What is the second closing entry in the four-step closing process?",o:[
["DR|Income Summary|\u20b170,000","CR|Salaries Expense|\u20b133,000","CR|Supplies Expense|\u20b121,000","CR|Rent Expense|\u20b111,000","CR|Depreciation Expense|\u20b13,000","CR|Insurance Expense|\u20b12,000"],
["DR|Salaries Expense|\u20b133,000","DR|Supplies Expense|\u20b121,000","DR|Rent Expense|\u20b111,000","DR|Depreciation Expense|\u20b13,000","DR|Insurance Expense|\u20b12,000","CR|Income Summary|\u20b170,000"],
["DR|Retained Earnings|\u20b170,000","CR|Income Summary|\u20b170,000"],
["DR|Income Summary|\u20b1100,000","CR|Salaries Expense|\u20b133,000","CR|Other Expenses|\u20b167,000"]],a:0,r:["","That increases expenses instead of zeroing them.","Expenses close through Income Summary first, not straight to retained earnings.","Expenses total \u20b170,000, not \u20b1100,000. That figure is net income."],e:"Debit Income Summary for total expenses and credit each expense account to zero it."},

{c:6,s:"Central Perk Dance Academy: service revenue ₱170,000; salaries ₱33,000, supplies ₱21,000, rent ₱11,000, depreciation ₱3,000, insurance ₱2,000; dividends ₱10,000. The four closing steps are: 1 close revenues to Income Summary, 2 close expenses to Income Summary, 3 close Income Summary to Retained Earnings, 4 close Dividends to Retained Earnings. The first two entries have closed revenues and expenses, leaving a ₱100,000 credit balance in Income Summary.",p:"What is the third closing entry in the four-step closing process?",o:[
["DR|Income Summary|\u20b1100,000","CR|Retained Earnings|\u20b1100,000"],
["DR|Retained Earnings|\u20b1100,000","CR|Income Summary|\u20b1100,000"],
["DR|Income Summary|\u20b1100,000","CR|Cash|\u20b1100,000"],
["DR|Service Revenue|\u20b1100,000","CR|Income Summary|\u20b1100,000"]],a:0,r:["","That records a loss. Here the balance is a profit.","Closing does not involve cash.","That is the revenue closing entry, already done."],e:"Income Summary has a \u20b1100,000 credit balance after revenues and expenses close. Debiting it clears the account into Retained Earnings."},

{c:6,s:"Central Perk Dance Academy: service revenue ₱170,000; salaries ₱33,000, supplies ₱21,000, rent ₱11,000, depreciation ₱3,000, insurance ₱2,000; dividends ₱10,000. The four closing steps are: 1 close revenues to Income Summary, 2 close expenses to Income Summary, 3 close Income Summary to Retained Earnings, 4 close Dividends to Retained Earnings. The first three entries have been recorded.",p:"What is the fourth closing entry in the four-step closing process?",o:[
["DR|Retained Earnings|\u20b110,000","CR|Dividends|\u20b110,000"],
["DR|Income Summary|\u20b110,000","CR|Dividends|\u20b110,000"],
["DR|Dividends|\u20b110,000","CR|Retained Earnings|\u20b110,000"],
["DR|Cash|\u20b110,000","CR|Dividends|\u20b110,000"]],a:0,r:["","Dividends bypass Income Summary entirely.","That increases dividends and reduces retained earnings in the wrong direction.","Dividends are not closed through cash."],e:"Dividends close directly to Retained Earnings because they are a distribution of capital, not an operating expense."},

{c:6,p:"What is Income Summary?",o:["A temporary clearing account used only during closing","A permanent equity account on the balance sheet","An expense account on the income statement","A contra-revenue account"],a:0,r:["","It is temporary. It has no balance after closing and never appears on a statement.","It is a clearing account, not an expense.","It collects both revenues and expenses, so it is neither."],e:"Income Summary exists only long enough to close revenues and expenses, then it is closed to retained earnings. It never appears on a statement."},

{c:6,p:"The company has a net loss for the year. How is Income Summary closed?",o:["Debit Retained Earnings, credit Income Summary","Debit Income Summary, credit Retained Earnings","Debit Dividends, credit Income Summary","Debit Cash, credit Retained Earnings"],a:0,r:["","That records a profit. A loss reduces retained earnings.","Dividends are separate from the loss.","A loss is not a cash transaction."],e:"A loss reduces equity, so retained earnings is debited and Income Summary is credited to zero it."},

{c:6,p:"Which accounts have a zero balance after closing?",o:["Revenues, expenses, and dividends","Assets, liabilities, and equity","Cash, inventory, and receivables","Common stock and retained earnings"],a:0,r:["","Those are permanent and carry forward.","Those are assets and stay open.","Those are permanent equity accounts."],e:"Only temporary accounts close. Permanent accounts carry their balances forward."},

/* ---------- CHAPTER 7: RATIOS & DUPONT ---------- */
{c:7,s:"Current assets are \u20b1450,000 and current liabilities are \u20b1180,000.",p:"What is the current ratio?",o:["2.5","0.4","2.7","1.5"],a:0,r:["","That divides liabilities by assets, the inverse.","That uses a different denominator; current liabilities are \u20b1180,000.","That is not \u20b1450,000 \u00f7 \u20b1180,000."],e:"\u20b1450,000 \u00f7 \u20b1180,000 = 2.5. The company holds \u20b12.50 of current assets per \u20b11.00 of current debt."},

{c:7,p:"Which items are excluded from the quick ratio?",o:["Inventory and prepaid expenses","Cash and marketable securities","Net accounts receivable","Current liabilities"],a:0,r:["","Those are the most liquid assets and stay in the numerator.","Receivables are included; they are collectible within the cycle.","Those are the denominator, not an exclusion."],e:"The acid-test keeps only the most liquid current assets: cash, marketable securities, and net receivables."},

{c:7,s:"Net credit sales are \u20b11,800,000. Beginning net receivables were \u20b1160,000 and ending net receivables are \u20b1240,000.",p:"What is accounts receivable turnover?",o:["9.0","7.5","11.25","2.0"],a:0,r:["","That divides by ending receivables only. Turnover uses the average.","That divides by beginning receivables only.","That is the change in receivables, not turnover."],e:"Average net AR is \u20b1200,000. \u20b11,800,000 \u00f7 \u20b1200,000 = 9.0."},

{c:7,s:"Net credit sales are ₱1,800,000. Beginning net receivables were ₱160,000 and ending net receivables are ₱240,000.",p:"What is days sales outstanding?",o:["40.6 days","45.6 days","60.8 days","9.0 days"],a:0,r:["","That is 365 divided by 8, not 9.","That is the inventory days figure.","That is turns per year, not days."],e:"365 \u00f7 9.0 = 40.6 days."},

{c:7,s:"Cost of goods sold is \u20b1900,000 and average inventory is \u20b1150,000.",p:"What is inventory turnover?",o:["6.0","0.17","5.0","9.0"],a:0,r:["","That inverts the ratio.","That uses a different average inventory.","That is receivables turnover, not inventory."],e:"\u20b1900,000 \u00f7 \u20b1150,000 = 6.0 times per year."},

{c:7,s:"Cost of goods sold is ₱900,000 and average inventory is ₱150,000.",p:"What is days inventory outstanding?",o:["60.8 days","40.6 days","73.0 days","6.0 days"],a:0,r:["","That belongs to receivables.","That is 365 divided by 5, not 6.","That is turns, not days."],e:"365 \u00f7 6.0 = 60.8 days."},

{c:7,s:"Sales are \u20b11,200,000 and cost of goods sold is \u20b1720,000.",p:"What is the gross profit margin?",o:["40%","60%","8%","33%"],a:0,r:["","That is the cost ratio, COGS divided by sales.","That is the net margin.","That divides gross profit by COGS instead of sales."],e:"Gross profit is \u20b1480,000. \u20b1480,000 \u00f7 \u20b11,200,000 = 40%."},

{c:7,s:"Sales are \u20b11,200,000 and net income is \u20b196,000.",p:"What is the net profit margin?",o:["8%","10%","12.5%","6%"],a:0,r:["","That assumes net income of \u20b1120,000.","That is the ROA figure from another scenario.","That divides by the wrong sales figure."],e:"\u20b196,000 \u00f7 \u20b11,200,000 = 8%."},

{c:7,s:"Net income is \u20b1500,000 and average total assets are \u20b14,000,000.",p:"What is return on assets?",o:["12.5%","8.0%","20.0%","1.25%"],a:0,r:["","That is a margin, not a return on assets.","That doubles the actual return.","That misplaces a decimal."],e:"\u20b1500,000 \u00f7 \u20b14,000,000 = 12.5%."},

{c:7,s:"Total liabilities are \u20b12,400,000 and total equity is \u20b11,600,000.",p:"What is the debt-to-equity ratio?",o:["1.5","0.67","2.4","0.4"],a:0,r:["","That inverts the ratio, equity over liabilities.","That is liabilities over total assets, not equity.","That is equity divided by total assets."],e:"\u20b12,400,000 \u00f7 \u20b11,600,000 = 1.5. Creditors fund \u20b11.50 for every \u20b11.00 of equity."},

{c:7,s:"EBIT is \u20b1900,000 and interest expense is \u20b1150,000.",p:"What is times interest earned?",o:["6.0","5.0","7.0","0.17"],a:0,r:["","That subtracts interest from EBIT before dividing.","That adds interest to EBIT.","That inverts the ratio."],e:"\u20b1900,000 \u00f7 \u20b1150,000 = 6.0. Operating profit covers interest six times."},

{c:7,s:"Net income is \u20b12,000,000, preferred dividends are \u20b1200,000, and weighted common shares are 450,000.",p:"What is earnings per share?",o:["\u20b14.00","\u20b14.44","\u20b15.00","\u20b13.56"],a:0,r:["","That ignores preferred dividends.","That ignores preferred dividends and rounds up.","That subtracts preferred dividends twice."],e:"(\u20b12,000,000 \u2212 \u20b1200,000) \u00f7 450,000 = \u20b14.00."},

{c:7,s:"Net income \u20b110,000,000, sales \u20b1100,000,000, total assets \u20b162,500,000, equity \u20b131,250,000.",p:"What is ROE under DuPont?",o:["32%","16%","10%","20%"],a:0,r:["","That is asset turnover times margin without the multiplier, or ROA.","That is the net margin alone.","That is margin times the multiplier, skipping turnover."],e:"10% margin \u00d7 1.6 turnover \u00d7 2.0 equity multiplier = 32%."},

{c:7,p:"In the DuPont framework, the equity multiplier measures:",o:["Financial leverage","Profitability per sale","Asset efficiency","Liquidity"],a:0,r:["","That is the net profit margin.","That is total asset turnover.","DuPont does not measure liquidity."],e:"Total assets \u00f7 equity. A higher multiplier means more of the asset base is funded by debt."},

{c:7,s:"Company SR earns 32% ROE with a 16% margin and a 2.0\u00d7 multiplier. Company TS earns 32% with an 8% margin and 2.0\u00d7 turnover. Company TO earns 32% with an 8% margin and a 4.0\u00d7 equity multiplier.",p:"Which company carries the greatest financial risk?",o:["Company TO","Company SR","Company TS","All three are identical"],a:0,r:["","SR earns its return through pricing power, with only 2.0\u00d7 leverage.","TS earns it through asset velocity, with 2.0\u00d7 leverage.","The returns match, but the risk profiles do not. 4.0\u00d7 debt is far riskier."],e:"The 4.0\u00d7 multiplier means heavy debt financing. The same ROE comes with far more vulnerability to downturns and rate shocks."},

/* ---------- CHAPTER 8: EXAM TRAPS ---------- */
{c:8,p:"Which entry could never be an adjusting entry?",o:[
["DR|Insurance Expense|\u20b12,000","CR|Cash|\u20b12,000"],
["DR|Insurance Expense|\u20b12,000","CR|Prepaid Insurance|\u20b12,000"],
["DR|Salaries Expense|\u20b18,000","CR|Salaries Payable|\u20b18,000"],
["DR|Accounts Receivable|\u20b115,000","CR|Service Revenue|\u20b115,000"]],a:0,r:["","This is a legitimate deferral adjustment.","This is a legitimate accrual adjustment.","This is a legitimate accrued revenue adjustment."],e:"Adjusting entries never touch cash. Cash moved before or after the period, not at adjustment time."},

{c:8,p:"A transaction was completely omitted from the journal. What will the trial balance show?",o:["It still balances, because debits and credits are both missing","A debit-heavy imbalance","A credit-heavy imbalance","It will not balance"],a:0,r:["","An omission removes both sides, so no imbalance appears.","Same reasoning: both a debit and a credit disappear.","It will balance perfectly, which is exactly why omission is hard to catch."],e:"A trial balance proves only that total debits equal total credits. An omission keeps that equality, so the error survives the check."},

{c:8,p:"A \u20b14,000 receivable is written off under the allowance method. What happens to Bad Debt Expense on that date?",o:["Nothing; the expense was recognized when the allowance was estimated","It increases by \u20b14,000","It decreases by \u20b14,000","It increases by \u20b12,000"],a:0,r:["","The expense was recognized when the allowance was estimated.","Write-offs do not reverse expense.","No partial expense arises at write-off."],e:"Write-off only clears a specific account against the existing allowance. The estimate already carried the expense."},

{c:8,p:"Which method sets the ending balance of the Allowance account rather than the expense amount?",o:["Aging of receivables","Percentage of credit sales","Direct write-off","Percentage of net sales"],a:0,r:["","That method computes expense directly and ignores the existing balance.","That is not an allowance method and does not set a target balance.","Same as percentage of sales: it targets expense, not the allowance balance."],e:"Aging targets an ending allowance, so the adjustment is the difference between target and current balance."},

{c:8,p:"Why is land never depreciated?",o:["It has an indefinite useful life","It is always held for resale","Its value always rises","It is a current asset"],a:0,r:["","Land held for resale would be inventory, but operational land is a PPE asset.","Accounting does not depreciate on market value movements.","Land is a non-current asset."],e:"Land is not consumed by operations. Land improvements, such as paving and lighting, are depreciated separately."},

{c:8,p:"Under double-declining balance, residual value is:",o:["Ignored in the rate but honored as a floor on book value","Subtracted from cost before applying the rate","Added to the rate each year","Depreciated first"],a:0,r:["","That is straight-line and units-of-production.","Residual value never changes the rate.","It is the floor, not the first layer."],e:"DDB applies its rate to beginning book value and ignores residual in the computation, but never depreciates book value below residual."},

{c:8,p:"Replacing a building's roof with a longer-life material is:",o:["Capitalized as a capital improvement","Expensed as routine maintenance","Debited to Retained Earnings","Ignored until disposal"],a:0,r:["","A life-extending roof replacement is a capital improvement.","Improvements go through the asset, not equity.","The cost must be recorded somewhere."],e:"It extends useful life or capacity, so it is capitalized. Routine patching and cleaning would be expensed."},

{c:8,p:"A discount bond's carrying value over its life:",o:["Rises toward face value","Falls toward face value","Stays at the issue price","Falls below the issue price"],a:0,r:["","That is premium behavior.","Amortization changes carrying value every period.","The discount amortizes upward, never below issue."],e:"Amortizing the discount increases carrying value each period until it equals face at maturity. Premium bonds move the other way."},

{c:8,p:"For a bond issued at a discount, interest expense each year is:",o:["Cash interest plus discount amortization","Cash interest minus discount amortization","Equal to cash interest","Lower than cash interest"],a:0,r:["","That is the premium treatment.","Equal only at par.","The discount makes borrowing cost higher, not lower."],e:"The discount adds to the cost of borrowing, so expense exceeds the coupon paid in cash."},

{c:8,p:"Which account is never closed?",o:["Retained Earnings","Service Revenue","Dividends","Rent Expense"],a:0,r:["","Temporary, closed.","Temporary, closed.","Temporary, closed."],e:"Retained earnings is permanent. Revenues, expenses, and dividends are temporary and close each period."}

]);
