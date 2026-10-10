import type { AboutContent } from '../types/content';
import { assetUrl } from '../lib/assets';

/** The ABOUT screen: photo, identity, two bio paragraphs and a quote. */
export const about: AboutContent = {
  name: 'CARLOS VELASCO',
  role: 'Software Development Technician',
  photo: {
    webp: assetUrl('images/profile.webp'),
    jpg: assetUrl('images/profile.jpg'),
    alt: 'Carlos Velasco',
  },
  paragraphs: [
    [
      'Hi! I am ',
      { strong: 'Carlos Velasco' },
      ', a software development technician from ',
      { strong: 'Guatemala City' },
      ', passionate about building web applications.',
    ],
    [
      'I work with ',
      { strong: 'HTML, CSS, JavaScript, Node.js and MySQL' },
      ', and I am currently learning ',
      { em: 'n8n' },
      ' and artificial intelligence. I am looking for internship or junior developer opportunities.',
    ],
  ],
  quote: {
    text: 'I love understanding how technology works from its fundamentals.',
    author: 'Carlos Velasco',
  },
};