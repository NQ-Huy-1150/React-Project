import { useEffect, useMemo, useState } from 'react'
import {
  createCustomer,
  deleteCustomer,
  listCustomers,
  updateCustomer,
} from '../api/customerApi'
import { emptyCustomer, normalizeCustomer } from '../domain/customerModel'

function CustomerPage() {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState(emptyCustomer)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEditing = useMemo(() => editingId !== null, [editingId])

  async function loadCustomers() {
    setLoading(true)
    setError('')
    try {
      const data = await listCustomers()
      const normalized = Array.isArray(data)
        ? data.map(normalizeCustomer)
        : []
      setCustomers(normalized)
    } catch (err) {
      setError(err.message || 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function startEdit(customer) {
    setEditingId(customer.id)
    setForm({ name: customer.name, email: customer.email })
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyCustomer)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      if (isEditing) {
        await updateCustomer(editingId, form)
      } else {
        await createCustomer(form)
      }
      resetForm()
      await loadCustomers()
    } catch (err) {
      setError(err.message || 'Save failed')
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Delete this customer?')
    if (!confirmed) return

    setError('')
    try {
      await deleteCustomer(id)
      await loadCustomers()
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px' }}>
      <h1>Customer CRUD</h1>

      <section style={{ marginBottom: 24 }}>
        <h2>{isEditing ? 'Edit customer' : 'Create customer'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit">
                {isEditing ? 'Update' : 'Create'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </section>

      <section>
        <h2>Customers</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        {!loading && customers.length === 0 && <p>No customers yet.</p>}
        <ul style={{ display: 'grid', gap: 12, padding: 0 }}>
          {customers.map((customer) => (
            <li
              key={customer.id}
              style={{ listStyle: 'none', border: '1px solid #ddd', padding: 12 }}
            >
              <div style={{ fontWeight: 600 }}>{customer.name}</div>
              <div style={{ color: '#666' }}>{customer.email}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="button" onClick={() => startEdit(customer)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(customer.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default CustomerPage
