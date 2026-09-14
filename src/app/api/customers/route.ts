import { NextRequest, NextResponse } from 'next/server';
import { inMemoryCustomers, addInMemoryCustomer } from '@/lib/mock-data/store';
import { delay, formatCurrency } from '@/lib/utils';
import { Customer } from '@/types';

export async function GET(request: NextRequest) {
  await delay(500);

  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q')?.toLowerCase() || '';

  let filtered = [...inMemoryCustomers];

  if (q) {
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    data: filtered,
  });
}

export async function POST(request: NextRequest) {
  await delay(700);

  try {
    const body = await request.json();
    const { name, email, phone, company } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and Email are required' },
        { status: 400 }
      );
    }

    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      name,
      email,
      phone: phone || '+234 800 000 0000',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      company: company || 'Independent Client',
      totalPaid: 0,
      formattedTotalPaid: formatCurrency(0),
      transactionCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    addInMemoryCustomer(newCustomer);

    return NextResponse.json({
      success: true,
      data: newCustomer,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
