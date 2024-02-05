import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { neynarApiKey } from '../../lib/neynar';

const signerUUID = process.env.SIGNER_UUID || '';

// make sure to set your NEYNAR_API_KEY .env
const client = new NeynarAPIClient(neynarApiKey);

async function sendCast(username: string, message: string) {
  const response = await client.publishCast(
    signerUUID,
    `❤️ @${username}, you got an anon Valentine!  ❤️\n\n"${message}"`,
    { replyTo: 'https://warpcast.com/pal/0x4598f463' },
  );

  return response;
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let username: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  if (message?.input) {
    username = message.input;
    username = username.replace('@', '');
    username = username.charAt(0).toLowerCase() + username.slice(1);
  }

  if (!username) {
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `You didn't enter a username 😭! Try again."`,
          },
        ],
        image: `${NEXT_PUBLIC_URL}/frame_cupid.png`,
        post_url: `${NEXT_PUBLIC_URL}/api/finish`,
      }),
    );
  }

  const msgText = req.nextUrl.searchParams.get('text') || 'you are based!';

  const response = await sendCast(username, msgText);

  if (response?.hash) {
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'Send another! ❤️',
            action: 'post',
          },
          {
            label: 'See valentine',
            action: 'post_redirect',
          },
        ],
        image: `${NEXT_PUBLIC_URL}/frame_cupid.png`,
        post_url: `${NEXT_PUBLIC_URL}/api/finish?hash=${response.hash}`,
      }),
    );
  } else {
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `Didn't work 😭! Try again."`,
          },
        ],
        image: `${NEXT_PUBLIC_URL}/frame_cupid.png`,
        post_url: `${NEXT_PUBLIC_URL}`,
      }),
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
