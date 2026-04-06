export const ADMIN_EMAILS = [
  'mistorsush@gmail.com',
  'vladislav.chistov1337@gmail.com',
  'admin@mistorsush.com'
];

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
