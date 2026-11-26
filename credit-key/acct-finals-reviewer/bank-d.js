/* The Ledger - chapters 9-11: cash and bank reconciliation, inventory, shareholders' equity */
window.BANK = (window.BANK || []).concat([

/* ---------- CHAPTER 9: CASH, CONTROLS & BANK RECONCILIATION ---------- */
{c:9,p:"Which item is reported as cash?",o:["A ₱5,000 petty cash fund","An employee IOU for ₱3,000","A customer's postdated check","Cash restricted for an equipment purchase"],a:0,r:["","An employee IOU is a receivable, not cash.","A postdated check is not available for immediate use.","Restricted cash is reported separately, not as cash."],e:"Cash must be available and unrestricted. Petty cash qualifies. IOUs, postdated checks, and restricted balances do not."},

{c:9,p:"Which investment is a cash equivalent?",o:["A 60-day Treasury bill","A 5-year government bond","A long-term equity investment","A 2-year time deposit"],a:0,r:["","A 5-year bond has price risk and is not a cash equivalent.","An equity investment is not a cash equivalent.","A 2-year time deposit is not short-term enough."],e:"Cash equivalents are short-term, highly liquid investments with insignificant risk of value change, generally maturing within three months."},

{c:9,p:"The same employee receives customer cash, records the collection, and reconciles the bank account. Which control principle is violated?",o:["Segregation of duties","Establishing responsibilities","Physical controls","Documentation"],a:0,r:["","Responsibilities are assigned, but the problem is that incompatible duties are combined.","Physical controls are about safes, locks, and access.","Documentation is about receipts and prenumbered forms."],e:"Custody, recording, and reconciliation should be separated so one person cannot hide a shortage."},

{c:9,s:"A ₱38,500 deposit is recorded in the company's books but has not yet appeared on the bank statement.",p:"How is it treated in the bank reconciliation?",o:["Add to the bank balance","Deduct from the bank balance","Add to the book balance","Deduct from the book balance"],a:0,r:["","The bank has not recorded the deposit yet, so its balance is too low.","The company already recorded the deposit, so the books need no adjustment.","The books already include it, so deducting would double count."],e:"A deposit in transit is added to the bank side. No journal entry is needed because the company already recorded it."},

{c:9,s:"Checks totaling ₱27,400 have been issued and recorded by the company but have not cleared the bank.",p:"How is the amount treated?",o:["Deduct from the bank balance","Add to the bank balance","Deduct from the book balance","Add to the book balance"],a:0,r:["","The bank has not deducted them yet, so its balance is too high.","The company already recorded the checks, so the books need no adjustment.","Adding to the books would overstate cash."],e:"Outstanding checks are deducted from the bank side. No journal entry is needed."},

{c:9,s:"The bank deducted an ₱800 service charge that the company has not recorded.",p:"What is the required treatment?",o:[
["DR|Bank Service Charge Expense|₱800","CR|Cash|₱800"],
["DR|Cash|₱800","CR|Bank Service Charge Expense|₱800"],
["DR|Bank Service Charge Expense|₱800","CR|Accounts Payable|₱800"],
["DR|Accounts Receivable|₱800","CR|Cash|₱800"]],a:0,r:["","That increases cash and reduces the expense, the reverse of the charge.","The bank has already taken the cash, so a payable is wrong.","A service charge is not a receivable."],e:"A service charge is a book-side item. Cash is reduced and an expense is recorded."},

{c:9,s:"A customer's ₱9,600 check was returned by the bank for insufficient funds. The company had recorded the collection.",p:"What is the required treatment?",o:[
["DR|Accounts Receivable|₱9,600","CR|Cash|₱9,600"],
["DR|Cash|₱9,600","CR|Accounts Receivable|₱9,600"],
["DR|Bad Debt Expense|₱9,600","CR|Cash|₱9,600"],
["DR|Cash|₱9,600","CR|Sales Revenue|₱9,600"]],a:0,r:["","That records a new sale and increases cash for a check that bounced.","That records a bad debt before the account is deemed uncollectible.","That records revenue for a collection that was reversed."],e:"An NSF check reverses the collection: restore the receivable and reduce cash."},

{c:9,s:"The bank collected ₱12,000 from a customer on behalf of the company and credited the account. The company has not recorded it.",p:"What is the required treatment?",o:[
["DR|Cash|₱12,000","CR|Accounts Receivable|₱12,000"],
["DR|Accounts Receivable|₱12,000","CR|Cash|₱12,000"],
["DR|Cash|₱12,000","CR|Service Revenue|₱12,000"],
["DR|Cash|₱12,000","CR|Notes Payable|₱12,000"]],a:0,r:["","That reverses the collection and increases a receivable.","The customer already owed for services, so this is not new revenue.","The collection is not a borrowing."],e:"A bank collection is a book-side item. Record the cash receipt and reduce the receivable."},

{c:9,s:"The company issued a ₱5,400 check for utilities but recorded it as ₱4,500.",p:"What is the required treatment?",o:[
["DR|Utilities Expense|₱900","CR|Cash|₱900"],
["DR|Cash|₱900","CR|Utilities Expense|₱900"],
["DR|Utilities Expense|₱5,400","CR|Cash|₱5,400"],
["DR|Accounts Payable|₱900","CR|Cash|₱900"]],a:0,r:["","That increases cash and reduces the expense.","That records the full check again, double counting.","The check was already paid, so there is no payable."],e:"Cash is overstated by ₱900. Deduct ₱900 from the book side and correct the expense and cash."},

{c:9,s:"Bank statement balance is ₱284,600. Deposits in transit are ₱38,500. Outstanding checks are ₱27,400. The bank collected ₱12,000 for the company. The bank charged ₱800. An NSF check was ₱9,600. The company recorded a ₱5,400 check as ₱4,500.",p:"What is the adjusted cash balance?",o:["₱295,700","₱284,600","₱295,000","₱306,500"],a:0,r:["","That is the unadjusted bank balance.","That is the unadjusted book balance.","That adds items that should be deducted."],e:"Bank side: ₱284,600 + ₱38,500 − ₱27,400 = ₱295,700. Book side: ₱295,000 + ₱12,000 − ₱800 − ₱9,600 − ₱900 = ₱295,700."},

{c:9,p:"Which pair of bank reconciliation items requires a journal entry?",o:["Bank service charge and NSF check","Deposit in transit and outstanding check","Deposit in transit and bank service charge","Outstanding check and bank error"],a:0,r:["","Deposits in transit and outstanding checks are already in the books.","A deposit in transit is already recorded, so no entry.","Outstanding checks are already recorded, and a bank error is corrected by the bank."],e:"Book-side items require entries: service charges, NSF checks, interest, EFT, and book errors. Bank-side timing items do not."},

{c:9,p:"Which statement about internal control is correct?",o:["It provides reasonable assurance, not absolute assurance","It eliminates all fraud","It removes the need for a bank reconciliation","It guarantees accurate financial statements"],a:0,r:["","Collusion, management override, and human error can still defeat controls.","A bank reconciliation is still an independent check.","Controls reduce risk but do not guarantee accuracy."],e:"Internal control is designed for reasonable assurance. It can be defeated by collusion, override, or human error."},

/* ---------- CHAPTER 10: INVENTORY & COST FLOW ---------- */
{c:10,p:"Which system updates the Inventory account continuously with each purchase and sale?",o:["Perpetual","Periodic","Direct write-off","Specific identification"],a:0,r:["","Periodic updates inventory only at period-end.","Direct write-off is a receivables method.","Specific identification is a cost-flow method, not an inventory system."],e:"Perpetual inventory records update with every transaction. Periodic systems rely on a period-end count."},

{c:10,s:"A company purchases ₱100,000 of merchandise on credit under the periodic inventory system.",p:"How is the purchase recorded?",o:[
["DR|Purchases|₱100,000","CR|Accounts Payable|₱100,000"],
["DR|Inventory|₱100,000","CR|Accounts Payable|₱100,000"],
["DR|Purchases|₱100,000","CR|Cash|₱100,000"],
["DR|Cost of Goods Sold|₱100,000","CR|Accounts Payable|₱100,000"]],a:0,r:["","Perpetual inventory debits Inventory. Periodic uses Purchases.","Cash was not paid, because the purchase was on credit.","Cost of goods sold is recorded at period-end under periodic."],e:"Periodic systems use a Purchases account during the period. Inventory and COGS are updated at period-end."},

{c:10,p:"Under the periodic inventory system, when is cost of goods sold recorded?",o:["At period-end, after a physical count","With every sale","When inventory is purchased","When cash is collected from customers"],a:0,r:["","Perpetual records COGS with each sale.","Purchases are recorded during the period, not COGS.","Collections do not determine COGS."],e:"Periodic systems calculate COGS at period-end: Beginning Inventory + Purchases − Ending Inventory."},

{c:10,s:"Beginning inventory is ₱100,000, purchases are ₱400,000, and ending inventory is ₱120,000.",p:"What is cost of goods sold?",o:["₱380,000","₱420,000","₱500,000","₱120,000"],a:0,r:["","That adds ending inventory instead of subtracting it.","That is goods available for sale before subtracting ending inventory.","That is ending inventory, not COGS."],e:"COGS = Beginning + Purchases − Ending = ₱100,000 + ₱400,000 − ₱120,000 = ₱380,000."},

{c:10,s:"A company has 10 units at ₱100, 10 units at ₱120, and 10 units at ₱140. It sells 20 units.",p:"Under FIFO, what is cost of goods sold?",o:["₱2,200","₱2,400","₱2,600","₱1,400"],a:0,r:["","That is weighted average COGS.","That is LIFO COGS.","That is ending inventory under FIFO."],e:"FIFO sends the oldest costs to COGS: 10 × ₱100 + 10 × ₱120 = ₱2,200. Ending inventory is 10 × ₱140 = ₱1,400."},

{c:10,s:"A company has 10 units at ₱100, 10 units at ₱120, and 10 units at ₱140. It sells 20 units.",p:"Under weighted average, what is cost of goods sold?",o:["₱2,400","₱2,200","₱2,600","₱1,200"],a:0,r:["","That is FIFO COGS.","That is LIFO COGS.","That is ending inventory under weighted average."],e:"Total cost is ₱3,600 for 30 units, or ₱120 per unit. 20 × ₱120 = ₱2,400."},

{c:10,p:"Which cost-flow method is not permitted under PFRS/IFRS?",o:["LIFO","FIFO","Weighted average","Specific identification"],a:0,r:["","FIFO is permitted.","Weighted average is permitted.","Specific identification is permitted."],e:"LIFO is not permitted under PFRS/IFRS. It is included for comparison only."},

{c:10,s:"Inventory costs ₱100,000. Its net realizable value is ₱82,000.",p:"At what amount is inventory reported, and what is the write-down?",o:["₱82,000; write-down ₱18,000","₱100,000; no write-down","₱82,000; write-down ₱82,000","₱100,000; write-down ₱18,000"],a:0,r:["","Inventory must be reported at the lower of cost and NRV.","The write-down is the difference between cost and NRV, not the NRV itself.","If cost is above NRV, inventory is written down."],e:"Report at the lower amount, ₱82,000. The ₱18,000 difference is a loss on inventory write-down."},

{c:10,p:"What is the entry to write inventory down from ₱100,000 to its ₱82,000 NRV?",o:[
["DR|Loss on Inventory Write-Down|₱18,000","CR|Inventory|₱18,000"],
["DR|Inventory|₱18,000","CR|Loss on Inventory Write-Down|₱18,000"],
["DR|Cost of Goods Sold|₱18,000","CR|Cash|₱18,000"],
["DR|Inventory|₱18,000","CR|Cash|₱18,000"]],a:0,r:["","That increases inventory and creates a gain, the opposite of a write-down.","The write-down is not a cash transaction.","That increases inventory, but the value has fallen."],e:"The loss is recognized and inventory is reduced to the lower NRV."},

{c:10,s:"Inventory records show 100 units. A physical count shows 96 units. Each unit costs ₱1,000.",p:"What is the shrinkage and the adjusting entry?",o:["₱4,000; Dr Inventory Shrinkage Loss ₱4,000 / Cr Inventory ₱4,000","₱4,000; Dr Inventory ₱4,000 / Cr Cash ₱4,000","₱96,000; Dr Inventory ₱96,000 / Cr Cash ₱96,000","₱100,000; Dr Cost of Goods Sold ₱100,000 / Cr Cash ₱100,000"],a:0,r:["","The loss reduces inventory, and cash is not affected.","That is the physical count value, not the shrinkage.","That is the recorded value, not the shrinkage."],e:"Shrinkage is 4 units × ₱1,000 = ₱4,000. Record a loss and reduce inventory."},

{c:10,s:"Inventory records show 100 units, but a physical count shows 104 units. Each unit costs ₱1,000.",p:"What is the overage and the adjusting entry?",o:["₱4,000; Dr Inventory ₱4,000 / Cr Inventory Overage Gain ₱4,000","₱4,000; Dr Inventory Overage Loss ₱4,000 / Cr Inventory ₱4,000","₱104,000; Dr Inventory ₱104,000 / Cr Cash ₱104,000","No entry because physical counts do not affect records"],a:0,r:["","An overage increases inventory and recognizes a gain.","The physical count is higher than the records, so inventory must increase.","The difference is 4 units, not the full count."],e:"Overage is 4 units × ₱1,000 = ₱4,000. Increase inventory and recognize the overage."},

{c:10,p:"If ending inventory is overstated, what is the effect?",o:["COGS is understated and net income is overstated","COGS is overstated and net income is understated","COGS and net income are both understated","There is no effect on net income"],a:0,r:["","Overstating ending inventory lowers COGS, which raises gross profit and net income.","That is the effect of understating ending inventory.","COGS and net income move in opposite directions."],e:"Ending inventory is subtracted in the COGS formula. Overstating it understates COGS and overstates net income and assets."},

{c:10,s:"COGS is ₱4,000,000. Beginning inventory is ₱700,000 and ending inventory is ₱900,000.",p:"What is inventory turnover?",o:["5.0×","4.0×","4.44×","2.5×"],a:0,r:["","That divides by ending inventory only.","That divides by beginning inventory only.","That inverts the ratio."],e:"Average inventory is ₱800,000. ₱4,000,000 ÷ ₱800,000 = 5.0×."},

/* ---------- CHAPTER 11: SHAREHOLDERS' EQUITY ---------- */
{c:11,s:"Diwata Corporation issues 100,000 common shares with a ₱10 par value for ₱20 per share.",p:"What is the issuance entry?",o:[
["DR|Cash|₱2,000,000","CR|Common Stock|₱1,000,000","CR|Additional Paid-in Capital|₱1,000,000"],
["DR|Cash|₱2,000,000","CR|Common Stock|₱2,000,000"],
["DR|Cash|₱1,000,000","CR|Common Stock|₱1,000,000"],
["DR|Cash|₱2,000,000","CR|Preferred Stock|₱1,000,000","CR|Additional Paid-in Capital|₱1,000,000"]],a:0,r:["","Common Stock is credited only at par. The excess is APIC.","Only ₱1,000,000 is received, not ₱2,000,000.","These are common shares, not preferred."],e:"Cash is ₱2,000,000. Common Stock is credited for par (100,000 × ₱10 = ₱1,000,000), and the ₱1,000,000 excess goes to APIC."},

{c:11,s:"A company issues 50,000 common shares with a ₱10 par value for ₱16 per share.",p:"How much is recorded as Additional Paid-in Capital?",o:["₱300,000","₱500,000","₱800,000","₱160,000"],a:0,r:["","That is the par value credited to Common Stock.","That is the total cash received.","That is the issue price per share, not the APIC total."],e:"Cash is 50,000 × ₱16 = ₱800,000. Common Stock is 50,000 × ₱10 = ₱500,000. APIC is ₱300,000."},

{c:11,p:"Which share value is the amount investors pay when the corporation issues new shares?",o:["Issue price","Par value","Market price","Book value"],a:0,r:["","Par value is the legal value assigned by the corporation.","Market price is what investors pay each other in the market.","Book value is based on accounting equity."],e:"The issue price is the amount paid to the corporation in the primary issuance. Market price applies to later trades between investors."},

{c:11,p:"Which statement about preferred stock is correct?",o:["It usually has dividend priority over common and often has limited voting rights","It always has greater voting rights than common","It is a liability of the corporation","Its dividends are an expense"],a:0,r:["","Preferred stock typically has limited or no voting rights.","Preferred stock is equity, not debt.","Dividends are distributions of equity, not expenses."],e:"Preferred shareholders receive a fixed dividend preference, usually with limited voting rights. It is still equity."},

{c:11,s:"On October 15, the board declares a ₱100,000 cash dividend payable November 15 to shareholders of record on October 31.",p:"What is the entry on October 15?",o:[
["DR|Dividends|₱100,000","CR|Dividends Payable|₱100,000"],
["DR|Dividends Payable|₱100,000","CR|Cash|₱100,000"],
["DR|Retained Earnings|₱100,000","CR|Cash|₱100,000"],
["DR|Cash|₱100,000","CR|Dividends Payable|₱100,000"]],a:0,r:["","That records payment, which happens on November 15.","Cash is not paid on the declaration date.","That records a cash receipt, not a dividend declaration."],e:"Declaration creates a liability. Debit Dividends and credit Dividends Payable."},

{c:11,p:"What entry is made on the dividend record date?",o:["No entry","Dr Dividends Payable / Cr Cash","Dr Dividends / Cr Dividends Payable","Dr Retained Earnings / Cr Cash"],a:0,r:["","Payment happens later.","The liability was recorded on the declaration date.","No cash moves on the record date."],e:"The record date only determines who receives the dividend. No journal entry is made."},

{c:11,s:"A company declared a ₱100,000 cash dividend and recorded the liability. It now pays the dividend on the payment date.",p:"What is the entry on the dividend payment date?",o:[
["DR|Dividends Payable|₱100,000","CR|Cash|₱100,000"],
["DR|Dividends|₱100,000","CR|Cash|₱100,000"],
["DR|Retained Earnings|₱100,000","CR|Dividends Payable|₱100,000"],
["DR|Cash|₱100,000","CR|Dividends Payable|₱100,000"]],a:0,r:["","The dividend expense was recorded at declaration. Payment clears the liability.","That records the dividend twice.","That records a cash receipt and increases the liability, not a payment."],e:"Pay the liability: debit Dividends Payable and credit Cash."},

{c:11,s:"A company has 5,000 preferred shares with a ₱100 par value and an 8% dividend rate. It declares ₱100,000 in total cash dividends.",p:"How much goes to preferred shareholders?",o:["₱40,000","₱60,000","₱100,000","₱8,000"],a:0,r:["","That is the common shareholders' share.","That is the total dividend.","That is the rate, not the peso amount."],e:"Preferred dividend = 5,000 × ₱100 × 8% = ₱40,000. The remaining ₱60,000 goes to common."},

{c:11,s:"Diwata Corporation buys back 5,000 of its own shares for ₱15 per share.",p:"What is the entry?",o:[
["DR|Treasury Stock|₱75,000","CR|Cash|₱75,000"],
["DR|Investment in Own Shares|₱75,000","CR|Cash|₱75,000"],
["DR|Common Stock|₱75,000","CR|Cash|₱75,000"],
["DR|Cash|₱75,000","CR|Treasury Stock|₱75,000"]],a:0,r:["","Treasury stock is a contra-equity account, not an investment asset.","The repurchase does not reduce Common Stock at par.","That records a sale of treasury stock, not a purchase."],e:"Treasury stock is a contra-equity account. Debit it for the cost and credit cash."},

{c:11,p:"What is the normal balance of Treasury Stock?",o:["Debit","Credit","Zero","It is an asset with a debit balance"],a:0,r:["","Treasury stock is a contra-equity account, so it has a debit balance.","It is not an asset.","It does not have a zero balance while shares are held."],e:"Treasury stock is contra-equity with a debit balance. It reduces total stockholders' equity."},

{c:11,s:"A corporation issued 60,000 common shares and later repurchased 8,000 as treasury stock.",p:"How many shares are outstanding?",o:["52,000","60,000","68,000","8,000"],a:0,r:["","Issued shares include the treasury shares.","That adds the treasury shares instead of subtracting them.","That is the treasury shares, not the outstanding shares."],e:"Outstanding = issued − treasury = 60,000 − 8,000 = 52,000."},

{c:11,s:"Total equity is ₱2,500,000. Preferred equity is ₱500,000. Common shares outstanding are 100,000.",p:"What is book value per common share?",o:["₱20.00","₱25.00","₱5.00","₱30.00"],a:0,r:["","That divides total equity by common shares and ignores the preferred claim.","That is the preferred equity per share.","That adds the preferred claim instead of subtracting it."],e:"Common equity is ₱2,500,000 − ₱500,000 = ₱2,000,000. ₱2,000,000 ÷ 100,000 = ₱20.00."},

{c:11,s:"Beginning retained earnings are ₱845,750. Net income is ₱628,450. Cash dividends declared are ₱137,850.",p:"What is ending retained earnings?",o:["₱1,336,350","₱1,474,200","₱1,198,500","₱845,750"],a:0,r:["","That adds dividends instead of subtracting them.","That ignores net income.","That is the beginning balance."],e:"₱845,750 + ₱628,450 − ₱137,850 = ₱1,336,350."},

{c:11,p:"Which transaction does not change total stockholders' equity?",o:["Paying a previously declared cash dividend","Declaring a cash dividend","Issuing shares at a premium","Buying treasury stock"],a:0,r:["","Declaring a dividend creates a liability and reduces equity.","Issuing shares increases equity.","Buying treasury stock reduces equity."],e:"Paying a declared dividend reduces cash and dividends payable, both assets and liabilities. Equity was already reduced at declaration."},

{c:11,s:"A company issues 7,250 shares of 7% preferred stock with an ₱80 par value for ₱112.50 per share.",p:"What is the issuance entry?",o:[
["DR|Cash|₱815,625","CR|Preferred Stock|₱580,000","CR|Additional Paid-in Capital|₱235,625"],
["DR|Cash|₱815,625","CR|Preferred Stock|₱815,625"],
["DR|Cash|₱580,000","CR|Preferred Stock|₱580,000"],
["DR|Cash|₱815,625","CR|Common Stock|₱580,000","CR|Additional Paid-in Capital|₱235,625"]],a:0,r:["","Preferred Stock is credited only at par. The excess is APIC.","Only ₱580,000 is received, not ₱815,625.","These are preferred shares, not common."],e:"Cash = 7,250 × ₱112.50 = ₱815,625. Preferred Stock = 7,250 × ₱80 = ₱580,000. APIC = ₱235,625."}

]);
