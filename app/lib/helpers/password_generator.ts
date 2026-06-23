export function generatePassword(): string {
  const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower   = 'abcdefghijklmnopqrstuvwxyz'
  const digits  = '0123456789'
//   const special = '!@#$%^&*'
//   const all     = upper + lower + digits + special
  const all     = upper + lower + digits

  // guarantee at least one of each required type
  const pwd = [
    upper[Math.floor(Math.random() * upper.length)],
    digits[Math.floor(Math.random() * digits.length)],
    // special[Math.floor(Math.random() * special.length)],
    ...Array.from({ length: 9 }, () => all[Math.floor(Math.random() * all.length)]),
  ]

  // shuffle so required chars aren't always at the start
  return pwd.sort(() => Math.random() - 0.5).join('')
}