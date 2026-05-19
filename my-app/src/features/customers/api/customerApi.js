const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const CUSTOMER_URL = `${API_BASE_URL}/api/customers`

async function request(url, options) {
  const response = await fetch(url, options)
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function listCustomers() {
  return request(CUSTOMER_URL)
}

export function createCustomer(payload) {
  return request(CUSTOMER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function updateCustomer(id, payload) {
  return request(`${CUSTOMER_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function deleteCustomer(id) {
  return request(`${CUSTOMER_URL}/${id}`, {
    method: 'DELETE',
  })
}
