// src/utils/getInitials.ts
// Palauttaa yhden ison kirjaimen käyttäjän tiedoista
// Prioriteetti: displayName -> username -> email -> ?

export function getInitials(opts: {
    displayName?: string | null
    username?: string | null
    email?: string | null
}) {
    const base =
        opts.displayName?.trim() ||
        opts.username?.trim() ||
        opts.email?.trim() ||
        "?"

    return base.charAt(0).toUpperCase()
}