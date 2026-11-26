/* The Ledger - question bank, chapters 1-4.
   o = options, a = correct index, r = per-option reason when wrong, e = why the correct answer works. */
window.BANK = (window.BANK || []).concat([

/* ---------- CHAPTER 1: FOUNDATIONS & THE CYCLE ---------- */
{c:1,p:"A company issues common stock for \u20b1500,000 cash. What happens to the accounting equation?",o:["Assets increase \u20b1500,000; equity increases \u20b1500,000","Assets increase \u20b1500,000; liabilities increase \u20b1500,000","Assets increase \u20b1500,000; revenue increases \u20b1500,000","Total assets are unchanged"],a:0,r:["","A share issuance creates no obligation to repay anyone, so no liability arises. The other side of the entry is equity.","Invested capital is not earned income. Revenue only arises from delivering goods or services to customers.","Cash actually increased, so assets did change. The other side of the entry is equity, not a reduction in another asset."],e:"Cash, an asset, rises and Common Stock, an equity account, rises by the same amount. Issuing shares is a financing transaction, never revenue."},

{c:1,p:"Which of these accounts has a normal credit balance?",o:["Accumulated Depreciation","Equipment","Dividends","Supplies Expense"],a:0,r:["","Equipment is a normal asset with a debit balance. It increases on the debit side.","Dividends is a contra equity account with a debit balance, not a credit balance.","Expenses increase with debits. A credit balance in an expense account would be unusual."],e:"Accumulated Depreciation is a contra asset. It carries a credit balance and is deducted from the related asset on the balance sheet."},

{c:1,p:"You have just posted all journal entries to the general ledger. Which step comes next in the accounting cycle?",o:["Prepare the unadjusted trial balance","Record adjusting entries","Prepare the post-closing trial balance","Close the temporary accounts"],a:0,r:["","Adjustments come after the unadjusted trial balance is prepared and reviewed. You cannot adjust before you know the balances.","That is the final step, after closing entries.","Closing happens after the adjusted trial balance and the financial statements, not straight after posting."],e:"Posting is step 3. Step 4 proves the ledger with an unadjusted trial balance before any adjustments are made."},

{c:1,p:"To increase an expense account and increase a liability account, you would:",o:["Debit the expense and credit the liability","Credit the expense and debit the liability","Debit both accounts","Credit both accounts"],a:0,r:["","That reverses both rules: it would decrease the expense and decrease the liability.","A liability increases on the credit side, so debiting it would reduce the obligation.","An expense increases on the debit side. Crediting it would reduce the expense."],e:"Expenses increase on the debit side and liabilities increase on the credit side. Every entry needs at least one of each."},

{c:1,p:"Which statement about dividends is correct?",o:["They reduce retained earnings but are not an expense","They are reported as an operating expense","They increase net income","They are closed into Income Summary"],a:0,r:["","Dividends are a distribution of profit to owners, not a cost of running the business, so they never appear on the income statement.","Dividends reduce retained earnings. They cannot increase income.","Dividends bypass Income Summary and close directly to Retained Earnings."],e:"Dividends are a distribution of earnings to owners. They reduce retained earnings directly and never touch the income statement."},

{c:1,p:"A trial balance has equal total debits and credits. What does that prove?",o:["Only that the ledger is arithmetically balanced","That every transaction was recorded correctly","That no transaction was omitted","That every account has the right balance"],a:0,r:["","Balance only proves the two sides are equal in total. A wrong account on both sides still balances.","An omitted transaction removes a debit and a credit equally, so the trial balance still balances.","A transposition or a wrong account can balance perfectly while being wrong."],e:"A balanced trial balance catches arithmetic errors only. It cannot detect an omitted transaction, a double posting, or the wrong account used on both sides."},

{c:1,p:"In what order are the financial statements prepared?",o:["Income statement, retained earnings, balance sheet, cash flows","Balance sheet, income statement, retained earnings, cash flows","Income statement, balance sheet, retained earnings, cash flows","Retained earnings, income statement, cash flows, balance sheet"],a:0,r:["","The balance sheet needs ending retained earnings, which comes from the retained earnings statement, which needs net income.","Retained earnings must be updated before the balance sheet can show ending equity.","Retained earnings cannot be computed before net income exists."],e:"Net income feeds retained earnings; ending retained earnings feeds the balance sheet; the cash flow statement reconciles the change in cash."},

{c:1,p:"Which accounts appear on the post-closing trial balance?",o:["Assets, liabilities, common stock, and retained earnings only","All accounts, including revenues and expenses","Assets, liabilities, and dividends","Revenue, expenses, and Income Summary"],a:0,r:["","Revenues and expenses are closed to zero, so they cannot appear.","Dividends is also a temporary account and is closed to retained earnings.","All three are temporary. Income Summary is cleared completely during closing."],e:"Closing zeroes every temporary account. Only permanent balance sheet accounts survive into the next period."},

{c:1,p:"Journalize the issuance of common stock for \u20b1500,000 cash.",o:[
["DR|Cash|\u20b1500,000","CR|Common Stock|\u20b1500,000"],
["DR|Cash|\u20b1500,000","CR|Service Revenue|\u20b1500,000"],
["DR|Common Stock|\u20b1500,000","CR|Cash|\u20b1500,000"],
["DR|Cash|\u20b1500,000","CR|Retained Earnings|\u20b1500,000"]],a:0,r:["","Stock issuance is financing, not a sale. Crediting revenue overstates income and understates contributed capital.","That reverses the entry: it would reduce equity while reducing cash.","Retained earnings comes from profits. Contributed capital belongs in Common Stock."],e:"Cash comes in as a debit and the owners' contribution is credited to Common Stock. Revenue is earned, not invested."},

/* ---------- CHAPTER 2: DAILY OPERATING ENTRIES ---------- */
{c:2,p:"The business signs a formal note and borrows \u20b1100,000 cash from the bank.",o:[
["DR|Cash|\u20b1100,000","CR|Notes Payable|\u20b1100,000"],
["DR|Cash|\u20b1100,000","CR|Accounts Payable|\u20b1100,000"],
["DR|Cash|\u20b1100,000","CR|Common Stock|\u20b1100,000"],
["DR|Notes Payable|\u20b1100,000","CR|Cash|\u20b1100,000"]],a:0,r:["","Accounts Payable is for open-account trade purchases. A signed promissory note is a formal borrowing, so it belongs in Notes Payable.","The bank is a creditor, not an owner. No equity is issued.","That reduces a liability and reduces cash, the opposite of borrowing."],e:"A signed note creates a formal liability. Cash increases and Notes Payable is credited."},

{c:2,p:"Purchased office equipment for \u20b1120,000 cash.",o:[
["DR|Equipment|\u20b1120,000","CR|Cash|\u20b1120,000"],
["DR|Equipment Expense|\u20b1120,000","CR|Cash|\u20b1120,000"],
["DR|Cash|\u20b1120,000","CR|Equipment|\u20b1120,000"],
["DR|Supplies|\u20b1120,000","CR|Accounts Payable|\u20b1120,000"]],a:0,r:["","Equipment is a long-term asset, not an expense. Its cost is allocated through depreciation over its life.","That records a sale of equipment, not a purchase.","The asset received is equipment, and the payment was cash. Neither account fits."],e:"Equipment is an asset recorded at cost. It is capitalized, not expensed on the purchase date."},

{c:2,p:"Bought production machinery worth \u20b1150,000, paying \u20b150,000 cash with the remaining \u20b1100,000 due in 30 days.",o:[
["DR|Equipment|\u20b1150,000","CR|Cash|\u20b150,000","CR|Accounts Payable|\u20b1100,000"],
["DR|Equipment|\u20b1150,000","CR|Cash|\u20b1150,000"],
["DR|Equipment|\u20b150,000","CR|Cash|\u20b150,000"],
["DR|Equipment|\u20b1150,000","CR|Notes Payable|\u20b1150,000"]],a:0,r:["","Only \u20b150,000 was paid in cash. Crediting the full cost overstates the cash outflow.","The full cost of the asset is \u20b1150,000 regardless of how it was financed.","The balance is due on account in 30 days, which is a trade payable, not a formal note."],e:"The full cost is capitalized. The entry splits the credit between the cash paid now and the payable created for the balance."},

{c:2,p:"Rendered \u20b180,000 of design services and collected cash immediately.",o:[
["DR|Cash|\u20b180,000","CR|Service Revenue|\u20b180,000"],
["DR|Accounts Receivable|\u20b180,000","CR|Service Revenue|\u20b180,000"],
["DR|Cash|\u20b180,000","CR|Unearned Revenue|\u20b180,000"],
["DR|Service Revenue|\u20b180,000","CR|Cash|\u20b180,000"]],a:0,r:["","Cash was collected immediately, so there is no receivable.","The service was already performed, so the obligation is satisfied. Unearned Revenue is for prepayments.","That reverses the entry and reduces revenue for work actually done."],e:"The work is done and cash is received, so revenue is earned and recognized immediately."},

{c:2,p:"Delivered \u20b130,000 of consulting services and billed the client.",o:[
["DR|Accounts Receivable|\u20b130,000","CR|Service Revenue|\u20b130,000"],
["DR|Cash|\u20b130,000","CR|Service Revenue|\u20b130,000"],
["DR|Accounts Receivable|\u20b130,000","CR|Unearned Revenue|\u20b130,000"],
["DR|Service Revenue|\u20b130,000","CR|Accounts Receivable|\u20b130,000"]],a:0,r:["","No cash was received. Billing creates a receivable.","The work is done, so revenue is earned. Unearned Revenue is only for cash received before performance.","That reduces revenue and reduces the receivable, the reverse of billing a client."],e:"Revenue is recognized when the service is performed, not when cash arrives. The receivable records the client's obligation."},

{c:2,p:"Provided \u20b196,000 of services, collecting \u20b160,000 cash and billing the client for the rest.",o:[
["DR|Cash|\u20b160,000","DR|Accounts Receivable|\u20b136,000","CR|Service Revenue|\u20b196,000"],
["DR|Cash|\u20b196,000","CR|Service Revenue|\u20b196,000"],
["DR|Cash|\u20b160,000","CR|Service Revenue|\u20b160,000"],
["DR|Accounts Receivable|\u20b196,000","CR|Service Revenue|\u20b196,000"]],a:0,r:["","Only \u20b160,000 was collected. Recording \u20b196,000 cash invents money that has not arrived.","That records only the cash collected. The remaining \u20b136,000 of work was also earned, so revenue is understated and the receivable is missing.","Part was paid in cash, so the receivable is only \u20b136,000."],e:"Two debits fund one revenue credit: the cash collected plus the amount still owed. Total debits equal total credits."},

{c:2,p:"Collected \u20b120,000 cash from a customer previously billed on account.",o:[
["DR|Cash|\u20b120,000","CR|Accounts Receivable|\u20b120,000"],
["DR|Cash|\u20b120,000","CR|Service Revenue|\u20b120,000"],
["DR|Accounts Receivable|\u20b120,000","CR|Cash|\u20b120,000"],
["DR|Cash|\u20b120,000","CR|Unearned Revenue|\u20b120,000"]],a:0,r:["","The revenue was already recognized when the work was billed. Collection is not a new sale.","That is the reverse: it increases the receivable and decreases cash.","The customer is paying an existing bill, not prepaying future work."],e:"The revenue was recorded when the service was performed. Collection only swaps one asset for another."},

{c:2,p:"Purchased \u20b1100,000 of retail inventory on credit.",o:[
["DR|Inventory|\u20b1100,000","CR|Accounts Payable|\u20b1100,000"],
["DR|Inventory|\u20b1100,000","CR|Cash|\u20b1100,000"],
["DR|Purchases|\u20b1100,000","CR|Accounts Payable|\u20b1100,000"],
["DR|Cost of Goods Sold|\u20b1100,000","CR|Accounts Payable|\u20b1100,000"]],a:0,r:["","The purchase was on credit, so no cash left the business.","Purchases is used under the periodic system. Perpetual inventory debits the Inventory asset directly.","The goods have not been sold yet, so their cost is still inventory, not an expense."],e:"Under the perpetual system, purchased goods go straight into the Inventory asset. Cost of goods sold waits until the goods are sold."},

{c:2,p:"Sold inventory costing \u20b160,000 for \u20b1100,000 cash under the perpetual system. Which pair of entries is correct?",o:[
["DR|Cash|\u20b1100,000","CR|Sales Revenue|\u20b1100,000","SEP","DR|Cost of Goods Sold|\u20b160,000","CR|Inventory|\u20b160,000"],
["DR|Cash|\u20b1100,000","CR|Sales Revenue|\u20b1100,000"],
["DR|Cash|\u20b1100,000","CR|Sales Revenue|\u20b1100,000","SEP","DR|Inventory|\u20b160,000","CR|Cost of Goods Sold|\u20b160,000"],
["DR|Cash|\u20b1100,000","CR|Inventory|\u20b1100,000"]],a:0,r:["","Inventory and cost of goods sold are left untouched, so the balance sheet still carries goods that have left the building.","That increases inventory and creates negative cost of goods sold. The cost must move out of inventory into expense.","Inventory is relieved at cost, \u20b160,000, not at the selling price. The \u20b1100,000 is revenue."],e:"Perpetual inventory needs two entries: record the sale at the selling price, then relieve inventory at cost into Cost of Goods Sold."},

{c:2,p:"Sold goods costing \u20b145,000 on account for \u20b175,000. Which entries are correct?",o:[
["DR|Accounts Receivable|\u20b175,000","CR|Sales Revenue|\u20b175,000","SEP","DR|Cost of Goods Sold|\u20b145,000","CR|Inventory|\u20b145,000"],
["DR|Cash|\u20b175,000","CR|Sales Revenue|\u20b175,000","SEP","DR|Cost of Goods Sold|\u20b145,000","CR|Inventory|\u20b145,000"],
["DR|Accounts Receivable|\u20b145,000","CR|Sales Revenue|\u20b145,000","SEP","DR|Cost of Goods Sold|\u20b175,000","CR|Inventory|\u20b175,000"],
["DR|Accounts Receivable|\u20b175,000","CR|Sales Revenue|\u20b175,000"]],a:0,r:["","The sale was on account, so the debit is a receivable, not cash.","The selling price and the cost are swapped. Revenue is \u20b175,000 and cost is \u20b145,000.","The cost layer must also move: inventory is reduced and cost of goods sold is recognized."],e:"Revenue is recorded at the selling price on account, and the cost layer moves from Inventory to Cost of Goods Sold."},

/* ---------- CHAPTER 3: ADJUSTING ENTRIES & RECEIVABLES ---------- */
{c:3,s:"On October 1 the company paid \u20b124,000 for a one-year insurance policy. On October 31, one month has expired.",p:"What is the October 31 adjusting entry?",o:[
["DR|Insurance Expense|\u20b12,000","CR|Prepaid Insurance|\u20b12,000"],
["DR|Prepaid Insurance|\u20b124,000","CR|Cash|\u20b124,000"],
["DR|Insurance Expense|\u20b124,000","CR|Prepaid Insurance|\u20b124,000"],
["DR|Prepaid Insurance|\u20b12,000","CR|Insurance Expense|\u20b12,000"]],a:0,r:["","That is the original October 1 entry, not the adjustment.","Only one month has expired. Expensing the whole policy overstates expense and understates the asset.","That reverses the adjustment and increases the asset."],e:"One twelfth of the policy has expired: \u20b124,000 \u00f7 12 = \u20b12,000. The asset shrinks and expense grows."},

{c:3,s:"Supplies began at \u20b130,000. A physical count on October 31 shows \u20b19,000 still on hand.",p:"What is the October 31 adjusting entry?",o:[
["DR|Supplies Expense|\u20b121,000","CR|Supplies|\u20b121,000"],
["DR|Supplies|\u20b121,000","CR|Supplies Expense|\u20b121,000"],
["DR|Supplies Expense|\u20b19,000","CR|Supplies|\u20b19,000"],
["DR|Supplies Expense|\u20b130,000","CR|Cash|\u20b130,000"]],a:0,r:["","That would increase the asset, but supplies were consumed.","The \u20b19,000 is what remains on hand. The used amount is \u20b121,000.","Cash was paid when supplies were bought. The adjustment only moves the used portion out of the asset."],e:"The plug is the used amount, not the ending count: \u20b130,000 \u2212 \u20b19,000 = \u20b121,000. What remains on hand stays in the asset."},

{c:3,s:"On October 5 the company received \u20b160,000 in advance for services. By October 31, \u20b120,000 of the work has been performed.",p:"What is the adjusting entry?",o:[
["DR|Unearned Revenue|\u20b120,000","CR|Service Revenue|\u20b120,000"],
["DR|Cash|\u20b160,000","CR|Service Revenue|\u20b160,000"],
["DR|Service Revenue|\u20b120,000","CR|Unearned Revenue|\u20b120,000"],
["DR|Unearned Revenue|\u20b160,000","CR|Service Revenue|\u20b160,000"]],a:0,r:["","Cash was received in October and already recorded. The adjustment recognizes the work performed.","That reduces revenue; earning the revenue should increase it.","Only \u20b120,000 of the obligation has been satisfied. The remaining \u20b140,000 is still unearned."],e:"The liability is satisfied only to the extent the work is done. \u20b120,000 moves from Unearned Revenue into revenue; \u20b140,000 stays a liability."},

{c:3,s:"Employees earned \u20b18,000 in wages through October 31. They will be paid on November 5.",p:"What is the October 31 adjusting entry?",o:[
["DR|Salaries Expense|\u20b18,000","CR|Salaries Payable|\u20b18,000"],
["DR|Salaries Expense|\u20b18,000","CR|Cash|\u20b18,000"],
["DR|Salaries Payable|\u20b18,000","CR|Salaries Expense|\u20b18,000"],
["DR|Prepaid Salaries|\u20b18,000","CR|Salaries Payable|\u20b18,000"]],a:0,r:["","Wages have not been paid yet, so cash is untouched. The offset is a payable.","That reduces the liability; the liability is being created, not settled.","The wages have been earned by employees, not prepaid. The cost belongs in expense."],e:"The cost was incurred in October, so it is expensed now with a payable. Cash moves in November and no expense is recorded then."},

{c:3,s:"By month-end, \u20b115,000 of consulting work has been completed for a client but not yet billed.",p:"What is the adjusting entry?",o:[
["DR|Accounts Receivable|\u20b115,000","CR|Service Revenue|\u20b115,000"],
["DR|Cash|\u20b115,000","CR|Service Revenue|\u20b115,000"],
["DR|Unearned Revenue|\u20b115,000","CR|Service Revenue|\u20b115,000"],
["DR|Accounts Receivable|\u20b115,000","CR|Unearned Revenue|\u20b115,000"]],a:0,r:["","Nothing has been collected or billed, so there is no cash entry.","The work is already done, so the revenue is earned, not deferred.","Unearned is a liability for future work. This work is complete, so it is revenue."],e:"Accrued revenue is earned but unbilled. The receivable and the revenue are both recorded at period end."},

{c:3,p:"Which statement about adjusting entries is always true?",o:["They never involve Cash","They always increase revenue","They always decrease an asset","They are recorded before the unadjusted trial balance"],a:0,r:["","Accrued expenses and prepaid expense adjustments can reduce income or assets without touching revenue.","Accrued revenues increase assets, and unearned revenue adjustments decrease a liability.","Adjustments are made after the unadjusted trial balance, using it as the starting point."],e:"Adjustments update accruals and deferrals at period end. Cash either moved earlier or will move later, in a separate transaction."},

{c:3,s:"On November 1, 2026 the company accepts a \u20b1100,000, 90-day, 6% note from a customer. The company uses a 360-day year.",p:"How much interest has accrued by December 31 (60 days)?",o:["\u20b11,000","\u20b11,500","\u20b16,000","\u20b1500"],a:0,r:["","That is the full 90-day interest. Only 60 days had elapsed by December 31.","That is a full year of interest at 6%. The note only ran 60 days in the period.","That is the interest for the remaining 30 days, not the 60 days accrued."],e:"\u20b1100,000 \u00d7 6% \u00d7 60/360 = \u20b11,000."},

{c:3,s:"On November 1, 2026 the company accepted a ₱100,000, 90-day, 6% note from a customer. By December 31, 60 days have elapsed, so ₱1,000 of interest has accrued.",p:"What is the December 31 adjusting entry for that accrued interest?",o:[
["DR|Interest Receivable|\u20b11,000","CR|Interest Revenue|\u20b11,000"],
["DR|Cash|\u20b11,000","CR|Interest Revenue|\u20b11,000"],
["DR|Interest Expense|\u20b11,000","CR|Interest Payable|\u20b11,000"],
["DR|Accounts Receivable|\u20b11,000","CR|Interest Revenue|\u20b11,000"]],a:0,r:["","No cash has been received. Interest is accrued, so the asset is Interest Receivable.","The company is the payee earning interest, not the borrower paying it.","Interest gets its own receivable account. It is not trade accounts receivable."],e:"Interest has been earned but not collected, so the asset is Interest Receivable and the income is Interest Revenue."},

{c:3,s:"A company holds a ₱100,000, 90-day, 6% note receivable dated November 1, 2026. On January 30, 2027 the note matures. Interest for all 90 days is \u20b11,500, and \u20b11,000 was already accrued at year-end.",p:"What is the entry on January 30?",o:[
["DR|Cash|\u20b1101,500","CR|Notes Receivable|\u20b1100,000","CR|Interest Receivable|\u20b11,000","CR|Interest Revenue|\u20b1500"],
["DR|Cash|\u20b1101,500","CR|Notes Receivable|\u20b1101,500"],
["DR|Cash|\u20b1101,500","CR|Notes Receivable|\u20b1100,000","CR|Interest Revenue|\u20b11,500"],
["DR|Cash|\u20b1100,000","CR|Notes Receivable|\u20b1100,000"]],a:0,r:["","The note principal is \u20b1100,000. The extra \u20b11,500 is interest and must be split between the receivable, the prior accrual, and current revenue.","That double counts. \u20b11,000 was already recognized last year, so only \u20b1500 is revenue now.","The note pays interest, so cash is \u20b1101,500, not \u20b1100,000."],e:"Cash includes principal plus all interest. The receivable clears, the prior accrual clears, and only the 30 days earned this year hit revenue."},

{c:3,s:"Net credit sales are \u20b11,000,000. History shows 2% of credit sales are uncollectible. The Allowance account currently has a \u20b15,000 credit balance.",p:"Under the percentage-of-sales method, what is Bad Debt Expense?",o:["\u20b120,000","\u20b115,000","\u20b125,000","\u20b15,000"],a:0,r:["","That nets the existing \u20b15,000 against the expense, which is the aging approach, not the sales approach.","That adds the existing balance instead of ignoring it.","That is the existing allowance, not the current-period expense."],e:"Percentage of sales ignores the existing allowance balance. \u20b11,000,000 \u00d7 2% = \u20b120,000."},

{c:3,s:"An aging schedule shows the required allowance is \u20b125,000. Before adjustment, Allowance has a \u20b15,000 credit balance.",p:"What is the required adjustment?",o:["\u20b120,000","\u20b125,000","\u20b130,000","\u20b15,000"],a:0,r:["","That ignores the \u20b15,000 already in the account.","That adds the credit balance instead of subtracting it.","That is the existing balance. The adjustment is the gap to the target."],e:"Target \u20b125,000 minus the existing \u20b15,000 credit = \u20b120,000. The aging method sets the ending balance, not the expense."},

{c:3,s:"An aging schedule shows the required allowance is \u20b125,000. Before adjustment, Allowance has a \u20b13,000 debit balance.",p:"What is the required adjustment?",o:["\u20b128,000","\u20b122,000","\u20b125,000","\u20b13,000"],a:0,r:["","That subtracts the debit balance, but a debit must be cleared and then the target built, so it adds.","That ignores the \u20b13,000 debit already sitting in the account.","That is the existing debit, not the adjustment needed."],e:"You must clear the debit balance and build the target: \u20b125,000 + \u20b13,000 = \u20b128,000."},

{c:3,s:"A \u20b14,000 account receivable is judged permanently uncollectible and is written off under the allowance method.",p:"What is the effect of the write-off?",o:["Net realizable value is unchanged","Net income decreases by \u20b14,000","Net realizable value decreases by \u20b14,000","Bad Debt Expense increases by \u20b14,000"],a:0,r:["","No expense is recorded at write-off. The expense was estimated when the allowance was created.","Both gross AR and the allowance fall by \u20b14,000, so the net amount is unchanged.","The debit goes to the allowance, not to expense."],e:"Gross receivables and the allowance fall by the same \u20b14,000, so NRV and total net assets do not move. No expense is recorded at write-off."},

{c:3,s:"A customer whose \u20b14,000 account was written off now unexpectedly pays in full.",p:"Which entries restore the account and record the cash?",o:[
["DR|Accounts Receivable|\u20b14,000","CR|Allowance for Doubtful Accounts|\u20b14,000","SEP","DR|Cash|\u20b14,000","CR|Accounts Receivable|\u20b14,000"],
["DR|Cash|\u20b14,000","CR|Accounts Receivable|\u20b14,000"],
["DR|Bad Debt Expense|\u20b14,000","CR|Accounts Receivable|\u20b14,000"],
["DR|Cash|\u20b14,000","CR|Allowance for Doubtful Accounts|\u20b14,000"]],a:0,r:["","The account was written off, so the customer ledger has to be reinstated before cash can be applied.","That records a new expense and writes off the account a second time, which double counts the loss.","That skips the receivable. The customer's account stays at zero and the ledger no longer tells the truth."],e:"Reinstate the receivable first, then record the collection. Skipping the reinstatement leaves the customer ledger wrong."},

{c:3,s:"Gross accounts receivable are \u20b1200,000 and the Allowance for Doubtful Accounts has a \u20b112,000 credit balance.",p:"What is net realizable value?",o:["\u20b1188,000","\u20b1212,000","\u20b1200,000","\u20b112,000"],a:0,r:["","That adds the allowance. It is a contra asset and must be subtracted.","That is gross receivables. NRV must reflect the expected uncollectible portion.","That is the allowance itself, not the net amount expected to be collected."],e:"NRV = gross receivables minus the allowance: \u20b1200,000 \u2212 \u20b112,000 = \u20b1188,000."},

/* ---------- CHAPTER 4: PPE, DEPRECIATION & DISPOSALS ---------- */
{c:4,p:"Which cost is expensed rather than capitalized when acquiring equipment?",o:["Damage from improper handling during transit","Freight and shipping insurance","Installation and assembly","Non-refundable sales tax"],a:0,r:["","Freight and transit insurance are necessary to get the asset to the site, so they are capitalized.","Installation is required to make the asset operational, so it is capitalized.","Non-refundable sales tax is part of the purchase cost and is capitalized."],e:"Necessary costs to get the asset ready for use are capitalized. Damage caused by careless handling is not a normal cost of the asset."},

{c:4,s:"Equipment costs \u20b1640,000 with a \u20b140,000 residual value and a 6-year life.",p:"What is annual straight-line depreciation?",o:["\u20b1100,000","\u20b1106,667","\u20b1640,000","\u20b1600,000"],a:0,r:["","That divides the full cost by 6 and ignores the residual value.","That is the asset cost, not the annual expense.","That is the depreciable base, spread over 6 years."],e:"(\u20b1640,000 \u2212 \u20b140,000) \u00f7 6 = \u20b1100,000. Residual value is removed first."},

{c:4,s:"Equipment costs ₱640,000, has a ₱40,000 residual value, and a 6-year useful life. Depreciation is straight-line.",p:"What is book value at the end of Year 4?",o:["\u20b1240,000","\u20b1280,000","\u20b1300,000","\u20b1400,000"],a:0,r:["","That assumes only 3 years of depreciation. Year 4 has also been recorded.","That assumes 2.5 years. Four full years at \u20b1100,000 have expired.","That is accumulated depreciation, not book value."],e:"Accumulated depreciation after 4 years is \u20b1400,000. \u20b1640,000 \u2212 \u20b1400,000 = \u20b1240,000."},

{c:4,s:"Equipment costs ₱640,000, has a ₱40,000 residual value, and a 6-year useful life. It is placed in service on July 1. Depreciation is straight-line.",p:"What is first-year depreciation?",o:["\u20b150,000","\u20b1100,000","\u20b125,000","\u20b160,000"],a:0,r:["","A full year would apply only if the asset was in service on January 1.","That is a quarter year. July 1 to December 31 is six months.","That is 7.2 months. The half-year convention here is exactly 6/12."],e:"Half a year of the \u20b1100,000 annual charge: \u20b1100,000 \u00d7 6/12 = \u20b150,000."},

{c:4,s:"Machinery costs \u20b1420,000, has a \u20b160,000 residual value, and an estimated lifetime output of 90,000 units.",p:"What is the depreciation rate per unit?",o:["\u20b14.00","\u20b14.67","\u20b13.60","\u20b16.00"],a:0,r:["","That divides cost only by units and ignores residual value.","That is cost divided by more units than exist. Depreciable cost is \u20b1360,000 over 90,000 units.","That uses cost minus nothing over 70,000 units. The base is \u20b1360,000 over 90,000 units."],e:"(\u20b1420,000 \u2212 \u20b160,000) \u00f7 90,000 units = \u20b14.00 per unit."},

{c:4,s:"Machinery costs ₱420,000, has a ₱60,000 residual value, and an estimated lifetime output of 90,000 units. Year 1 production is 18,000 units.",p:"What is Year 1 depreciation?",o:["\u20b172,000","\u20b118,000","\u20b184,000","\u20b1100,000"],a:0,r:["","That is the unit count, not the expense.","That uses a \u20b14.67 rate, which ignores residual value.","That is the straight-line amount for the 6-year equipment, not this machine."],e:"18,000 units \u00d7 \u20b14.00 = \u20b172,000. Expense follows actual usage, not time."},

{c:4,s:"Equipment costs \u20b1500,000, has a 5-year life and a \u20b150,000 residual value. The company uses double-declining balance.",p:"What is the DDB rate?",o:["40%","20%","33\u2153%","50%"],a:0,r:["","That is the straight-line rate. DDB doubles it.","That is the rate for a 6-year life, not 5 years.","That would be 2.5 times straight-line. DDB is exactly double."],e:"Straight-line is 1/5 = 20%. Double-declining doubles it to 40%."},

{c:4,s:"Equipment costs ₱500,000, has a 5-year life and a ₱50,000 residual value. The company uses double-declining balance.",p:"What is Year 1 DDB depreciation?",o:["\u20b1200,000","\u20b1180,000","\u20b1100,000","\u20b1250,000"],a:0,r:["","That applies 40% to the \u20b1450,000 depreciable base after residual, which DDB does not do.","That is straight-line depreciation.","That is 50% of cost, not the 40% DDB rate."],e:"\u20b1500,000 \u00d7 40% = \u20b1200,000. Residual value is ignored when computing the rate and the charge."},

{c:4,s:"Equipment costs ₱500,000, has a 5-year life and a ₱50,000 residual value. The company uses double-declining balance.",p:"What is Year 2 DDB depreciation?",o:["\u20b1120,000","\u20b1200,000","\u20b172,000","\u20b1150,000"],a:0,r:["","That repeats Year 1 on the original cost. Year 2 applies the rate to the reduced book value.","That jumps to Year 3. Year 2 begins at \u20b1300,000 book value.","That is 30% of cost, not 40% of beginning book value."],e:"Beginning book value is \u20b1300,000. \u20b1300,000 \u00d7 40% = \u20b1120,000."},

{c:4,p:"In the final year of double-declining balance, depreciation expense is:",o:["Limited so book value ends exactly at residual value","Always the same as the prior year","Residual value times the DDB rate","Zero, because the asset is fully depreciated"],a:0,r:["","The rate stays the same, but the base shrinks, so the expense falls each year.","Residual value is a floor, not a base. The rate applies to beginning book value.","Book value is above residual, so there is still depreciable amount left."],e:"DDB never depreciates below residual value. The last year becomes a plug that brings book value down to the residual."},

{c:4,s:"A patent is acquired for \u20b1360,000 with a 6-year useful life.",p:"What is the annual amortization entry?",o:[
["DR|Amortization Expense|\u20b160,000","CR|Accumulated Amortization (Patent)|\u20b160,000"],
["DR|Amortization Expense|\u20b160,000","CR|Cash|\u20b160,000"],
["DR|Patent|\u20b160,000","CR|Amortization Expense|\u20b160,000"],
["DR|Amortization Expense|\u20b1360,000","CR|Accumulated Amortization (Patent)|\u20b1360,000"]],a:0,r:["","Amortization is a non-cash allocation. Cash was paid when the patent was acquired.","That increases the asset. Amortization reduces it through the contra account.","That expenses the whole patent in year one. The cost is spread over 6 years."],e:"Finite-life intangibles are amortized straight-line: \u20b1360,000 \u00f7 6 = \u20b160,000 a year, using a contra account."},

{c:4,p:"How is goodwill treated after a business acquisition?",o:["Not amortized; tested annually for impairment","Amortized over 40 years","Amortized over its estimated useful life","Written off immediately against equity"],a:0,r:["","Goodwill is no longer amortized. It is tested for impairment.","Goodwill has an indefinite life, so there is no amortization schedule.","That would bypass the impairment test and understate assets at acquisition."],e:"Goodwill has an indefinite life. It is tested for impairment and written down only when fair value falls below carrying value."},

{c:4,s:"Equipment costing \u20b1500,000 with \u20b1400,000 of accumulated depreciation is sold for \u20b1130,000 cash.",p:"What is the disposal entry?",o:[
["DR|Cash|\u20b1130,000","DR|Accumulated Depreciation|\u20b1400,000","CR|Equipment|\u20b1500,000","CR|Gain on Sale|\u20b130,000"],
["DR|Cash|\u20b1130,000","CR|Equipment|\u20b1130,000"],
["DR|Cash|\u20b1130,000","DR|Loss on Sale|\u20b130,000","CR|Equipment|\u20b1160,000"],
["DR|Cash|\u20b1130,000","DR|Accumulated Depreciation|\u20b1400,000","CR|Equipment|\u20b1500,000","CR|Retained Earnings|\u20b130,000"]],a:0,r:["","The equipment account must be cleared at its full historical cost of \u20b1500,000.","The loss is \u20b130,000 and the proceeds are a debit. The credit must clear the full \u20b1500,000 cost.","A disposal gain goes to the income statement, not directly to retained earnings."],e:"Book value is \u20b1100,000 and proceeds are \u20b1130,000, so the gain is \u20b130,000. Both the asset and its accumulated depreciation are removed."},

{c:4,s:"Equipment costing \u20b1500,000 has accumulated depreciation of \u20b1400,000, so its book value is \u20b1100,000. It is sold for \u20b170,000 cash.",p:"What is the disposal entry?",o:[
["DR|Cash|\u20b170,000","DR|Accumulated Depreciation|\u20b1400,000","DR|Loss on Sale|\u20b130,000","CR|Equipment|\u20b1500,000"],
["DR|Cash|\u20b170,000","DR|Accumulated Depreciation|\u20b1400,000","CR|Equipment|\u20b1470,000"],
["DR|Cash|\u20b170,000","CR|Equipment|\u20b170,000"],
["DR|Cash|\u20b170,000","DR|Equipment|\u20b130,000","CR|Accumulated Depreciation|\u20b1100,000"]],a:0,r:["","That credits only \u20b1470,000 of the \u20b1500,000 cost, leaving \u20b130,000 on the books. The \u20b130,000 loss is missing.","That clears only \u20b170,000 of the cost and leaves the \u20b1400,000 accumulated depreciation on the books.","That increases both Equipment and Accumulated Depreciation instead of removing them, and it records no loss."],e:"Proceeds of \u20b170,000 are below the \u20b1100,000 book value, so a \u20b130,000 loss is recognized. The entry still clears the full cost and accumulated depreciation."},

{c:4,s:"Equipment costing \u20b150,000 with \u20b145,000 accumulated depreciation is scrapped for no proceeds.",p:"What is the entry?",o:[
["DR|Accumulated Depreciation|\u20b145,000","DR|Loss on Disposal|\u20b15,000","CR|Equipment|\u20b150,000"],
["DR|Accumulated Depreciation|\u20b150,000","CR|Equipment|\u20b150,000"],
["DR|Loss on Disposal|\u20b150,000","CR|Equipment|\u20b150,000"],
["DR|Cash|\u20b15,000","DR|Accumulated Depreciation|\u20b145,000","CR|Equipment|\u20b150,000"]],a:0,r:["","Accumulated depreciation is only \u20b145,000. Debiting more than exists creates a negative contra balance.","The loss is the \u20b15,000 book value, not the full cost.","There were no proceeds. Scrapping yields nothing."],e:"With no proceeds, the remaining book value of \u20b15,000 becomes a loss. Cost and accumulated depreciation are both cleared."}

]);
