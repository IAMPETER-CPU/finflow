import { NextRequest, NextResponse } from 'next/server';
import { defaultKycStatus } from '@/lib/mock-data/seed';
import { delay } from '@/lib/utils';
import { KYCVerification } from '@/types';

let currentKyc: KYCVerification = { ...defaultKycStatus };

export async function GET() {
  await delay(400);
  return NextResponse.json({
    success: true,
    data: currentKyc,
  });
}

export async function POST(request: NextRequest) {
  await delay(1000);

  try {
    const body = await request.json();
    const { action, personalInfo, document, selfieVerified } = body;

    if (action === 'submit_personal') {
      currentKyc.personalInfo = { ...currentKyc.personalInfo, ...personalInfo };
      currentKyc.step = 2;
      currentKyc.progressPercentage = 50;
      currentKyc.status = 'in_progress';
    } else if (action === 'upload_document') {
      currentKyc.document = { ...currentKyc.document, ...document };
      currentKyc.step = 3;
      currentKyc.progressPercentage = 75;
    } else if (action === 'verify_selfie') {
      currentKyc.selfieVerified = selfieVerified !== undefined ? selfieVerified : true;
      currentKyc.step = 4;
      currentKyc.progressPercentage = 90;
    } else if (action === 'final_submit') {
      currentKyc.status = 'verified';
      currentKyc.step = 4;
      currentKyc.progressPercentage = 100;
      currentKyc.submittedAt = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      data: currentKyc,
      message: 'KYC status updated successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Failed to process KYC update' },
      { status: 500 }
    );
  }
}
