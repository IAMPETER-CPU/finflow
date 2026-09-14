import { NextRequest, NextResponse } from 'next/server';
import { addInMemoryTransaction, inMemoryDashboardSummary } from '@/lib/mock-data/store';
import { delay, formatCurrency } from '@/lib/utils';
import { Transaction } from '@/types';

export async function POST(request: NextRequest) {
  // Artificial network latency for real fintech API feel
  await delay(900);

  try {
    const body = await request.json();
    const { recipient, recipientAccount, amount, category, description } = body;

    const numAmount = parseFloat(amount);

    if (!recipient || !numAmount || numAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid recipient and payment amount.' },
        { status: 400 }
      );
    }

    if (numAmount > inMemoryDashboardSummary.totalBalance) {
      return NextResponse.json(
        { success: false, message: 'Insufficient funds. Total account balance exceeded.' },
        { status: 400 }
      );
    }

    // Optional simulated intermittent failure toggle (if amount is exactly 9999)
    if (numAmount === 9999) {
      return NextResponse.json(
        { success: false, message: 'Simulated network routing error. Please try again.' },
        { status: 500 }
      );
    }

    const newTxnId = `txn_${Date.now()}`;
    const randomRef = `TXN-${Math.floor(100000 + Math.random() * 900000)}FF`;

    const newTransaction: Transaction = {
      id: newTxnId,
      name: recipient,
      type: 'expense',
      category: category || 'Transfer',
      date: new Date().toISOString(),
      timestamp: Date.now(),
      amount: -Math.abs(numAmount),
      formattedAmount: `-${formatCurrency(numAmount)}`,
      status: 'completed',
      reference: randomRef,
      description: description || `Transfer payment to ${recipient}`,
      recipientAccount: recipientAccount || 'External Bank Account',
    };

    // Update in-memory transactions
    addInMemoryTransaction(newTransaction);

    // Deduct balance
    inMemoryDashboardSummary.totalBalance -= numAmount;
    inMemoryDashboardSummary.formattedBalance = formatCurrency(inMemoryDashboardSummary.totalBalance);

    return NextResponse.json({
      success: true,
      message: 'Transfer processed successfully',
      transaction: newTransaction,
      newBalance: inMemoryDashboardSummary.totalBalance,
      formattedNewBalance: inMemoryDashboardSummary.formattedBalance,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid payload or server error processing transfer' },
      { status: 500 }
    );
  }
}
