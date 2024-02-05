import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { neynarApiKey } from '../../lib/neynar';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: neynarApiKey });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  if (message?.input) {
    text = message.input;
  }

  if (!text) {
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `You didn't write anything 😭! Try again."`,
          },
        ],
        image: `${NEXT_PUBLIC_URL}/frame_cupid.png`,
        post_url: `${NEXT_PUBLIC_URL}/api/finish`,
      }),
    );
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Send it! ❤️ "${text}"`,
        },
      ],
      image: `${NEXT_PUBLIC_URL}/frame_cupid.png`,
      input: {
        text: 'Who do you want to send it to? Include the @',
      },
      post_url: `${NEXT_PUBLIC_URL}/api/send?text=${text}`, // <------
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
