async function Login(username: string, password: string): Promise<string> {
  const raw = JSON.stringify({
    username: username,
    password: password
  })

  // Send the request
  const resp = await fetch('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: raw
  })

  // Parse the response
  const data = await resp.json()
  if (data.code === 0) {
    return data.data.token
  }

  // Throw an error if the request failed
  throw new Error(data.message)
}

async function Register(username: string, password: string) {
  const raw = JSON.stringify({
    username: username,
    password: password
  })

  // Send the request
  const resp = await fetch('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: raw
  })

  // Parse the response
  const data = await resp.json()
  if (data.code === 0) {
    return
  }

  // Throw an error if the request failed
  throw new Error(data.message)
}

export { Login, Register }
