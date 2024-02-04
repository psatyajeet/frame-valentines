import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Pick who to send it to ->',
    },
  ],
  image: `${NEXT_PUBLIC_URL}/frame_cupid.png`,
  input: {
    text: 'What do you want to say?',
  },
  post_url: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: 'CupidCast',
  description: 'Framed love notes',
  openGraph: {
    title: 'CupidCast',
    description: 'Framed love notes',
    images: [`${NEXT_PUBLIC_URL}/frame_cupid.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>CupidCast</h1>
    </>
  );
}
