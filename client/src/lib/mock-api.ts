export interface EmailMessage {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: Date;
}

export const generateEmail = (): string => {
  const domains = ['cybermail.net', 'neonbox.io', 'quantum-mail.xyz'];
  const randomStr = Math.random().toString(36).substring(2, 10);
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${randomStr}@${domain}`;
};

export const fetchInbox = async (email: string): Promise<EmailMessage[]> => {
  // Simulate fetching from a mock database or returning empty for a new email
  return new Promise(resolve => setTimeout(() => resolve([]), 200));
};

export const subscribeRealtime = (email: string, onNewEmail: (msg: EmailMessage) => void) => {
  // Simulate emails arriving randomly between 20s and 60s
  const scheduleNext = () => {
    const delay = Math.random() * 40000 + 20000;
    return setTimeout(() => {
      const id = Math.random().toString(36).substring(2, 10);
      const senders = ['system@cybercorp.net', 'agent.k@nexus.io', 'unknown@darkweb.org', 'admin@hyperion.co'];
      const sender = senders[Math.floor(Math.random() * senders.length)];
      const msg: EmailMessage = {
        id,
        sender,
        subject: `Transmission [${id.toUpperCase()}]`,
        preview: 'Encrypted payload received. Decrypt to view contents...',
        body: `ACCESS GRANTED.\n\nThis is a securely transmitted message for ${email}.\n\nOperation coordinates have been updated. Ensure this data is wiped after reading.\n\n// END OF TRANSMISSION`,
        timestamp: new Date()
      };
      onNewEmail(msg);
      timerId = scheduleNext();
    }, delay);
  };
  
  let timerId = scheduleNext();
  return () => clearTimeout(timerId);
};

export const resetSession = (): string => {
  return generateEmail();
};
