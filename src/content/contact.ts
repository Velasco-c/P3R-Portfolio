import type { MailRow } from '../types/content';


export const mailRows: MailRow[] = [
  {
    kind: 'channel',
    icon: 'gmail',
    sender: 'Gmail',
    address: 'carlos.velasco.est@gmail.com',
    href: 'mailto:carlos.velasco.est@gmail.com',
    ariaLabel: 'Email via Gmail',
  },
  {
    kind: 'channel',
    icon: 'linkedin',
    sender: 'LinkedIn',
    address: 'linkedin.com/in/carlos-tzoy-velasco',
    href: 'https://www.linkedin.com/in/carlos-tzoy-velasco/',
    ariaLabel: 'Profile on LinkedIn',
  },
  {
    kind: 'channel',
    icon: 'github',
    sender: 'GitHub',
    address: 'github.com/Velasco-c',
    href: 'https://github.com/Velasco-c',
    ariaLabel: 'Profile on GitHub',
  },
  {
    kind: 'channel',
    icon: 'web',
    sender: 'Portafolio',
    address: 'velasco-c.github.io/Portafolio',
    href: 'https://velasco-c.github.io/Portafolio/',
    ariaLabel: 'Portfolio website',
  },

];