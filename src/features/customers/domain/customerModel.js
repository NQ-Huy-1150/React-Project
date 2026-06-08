export const emptyCustomer = {
  name: '',
  email: '',
}

export function normalizeCustomer(raw) {
  return {
    id: raw?.id ?? '',
    name: raw?.name ?? '',
    email: raw?.email ?? '',
  }
}
