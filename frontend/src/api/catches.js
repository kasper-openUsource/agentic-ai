import axios from 'axios'

const API_BASE = 'http://localhost:8000'

export async function getCatches(catchType = null) {
  const params = catchType ? { catch_type: catchType } : {}
  const response = await axios.get(`${API_BASE}/catches`, { params })
  return response.data
}

export async function getCatch(id) {
  const response = await axios.get(`${API_BASE}/catches/${id}`)
  return response.data
}

export async function createCatch(data) {
  const response = await axios.post(`${API_BASE}/catches`, data)
  return response.data
}

export async function updateCatch(id, data) {
  const response = await axios.put(`${API_BASE}/catches/${id}`, data)
  return response.data
}

export async function deleteCatch(id) {
  const response = await axios.delete(`${API_BASE}/catches/${id}`)
  return response.data
}

export async function getStats() {
  const response = await axios.get(`${API_BASE}/stats`)
  return response.data
}
