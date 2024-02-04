import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { neynarApiKey } from '../../lib/neynar';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  if (message?.button === 1) {
    return NextResponse.redirect(`${NEXT_PUBLIC_URL}`, { status: 302 });
  }

  if (message?.button === 2) {
    const castHash = req.nextUrl.searchParams.get('hash') || '';

    return NextResponse.redirect(`https://www.warpcast.com/pal/${castHash}`, { status: 302 });
  }

  return NextResponse.redirect(`${NEXT_PUBLIC_URL}`, { status: 302 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
