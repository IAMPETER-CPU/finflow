import { NextRequest, NextResponse } from 'next/server';
import { inMemoryInvoices, addInMemoryInvoice } from '@/lib/mock-data/store';
import { delay, formatCurrency } from '@/lib/utils';
import { Invoice, InvoiceItem } from '@/types';

export async function GET(request: NextRequest) {
  await delay(500);
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') || 'all';

  let filtered = [...inMemoryInvoices];
  if (status !== 'all') {
    filtered = filtered.filter((i) => i.status === status);
  }

  return NextResponse.json({
    success: true,
    data: filtered,
  });
}

export async function POST(request: NextRequest) {
  await delay(800);

  try {
    const body = await request.json();
    const { customerName, customerEmail, customerId, dueDate, items, notes } = body;

    if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Customer details and at least one item are required.' },
        { status: 400 }
      );
    }

    const processedItems: InvoiceItem[] = items.map((item: { description?: string; quantity?: number | string; unitPrice?: number | string }, idx: number) => {
      const qty = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity || '1') || 1;
      const price = typeof item.unitPrice === 'number' ? item.unitPrice : parseFloat(item.unitPrice || '0') || 0;
      return {
        id: `item_${Date.now()}_${idx}`,
        description: item.description || 'Service Line Item',
        quantity: qty,
        unitPrice: price,
        total: qty * price,
      };
    });

    const subtotal = processedItems.reduce((sum, i) => sum + i.total, 0);
    const tax = 0;
    const total = subtotal + tax;

    const invCount = inMemoryInvoices.length + 1;
    const invNumber = `INV-2026-${String(invCount).padStart(3, '0')}`;

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: invNumber,
      customerId: customerId || `cust_${Date.now()}`,
      customerName,
      customerEmail: customerEmail || 'client@example.com',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items: processedItems,
      subtotal,
      tax,
      total,
      formattedTotal: formatCurrency(total),
      status: 'pending',
      notes,
    };

    addInMemoryInvoice(newInvoice);

    return NextResponse.json({
      success: true,
      data: newInvoice,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
