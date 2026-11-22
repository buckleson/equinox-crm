import { useState } from 'react'
import { Logo } from '../ui'
import { PASSWORD, ROLES, roleForEmail, type Role } from './roles'

export function Login({ onSignIn }: { onSignIn: (role: Role) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div className="login">
      <div className="login-box">
        <div className="login-brand"><Logo size={44} /><h1>Sterlitee Sales CRM</h1><p>Sign in to your workspace</p></div>
        <form onSubmit={e => { e.preventDefault(); onSignIn(roleForEmail(email)) }}>
          <label className="in"><span>Email</span><input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@sterlitee.in" /></label>
          <label className="in"><span>Password</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" /></label>
          <button className="btn pri wide" type="submit">Sign in</button>
        </form>
      </div>
      <div className="demo">
        <h2>Demo credentials</h2>
        <p className="muted">Pick a role to sign in instantly. Password for all accounts: <b>{PASSWORD}</b></p>
        <div className="demo-grid">
          {ROLES.map(role => (
            <div className="demo-card" key={role.id}>
              <div className="demo-role">{role.label}</div>
              <div className="demo-person">{role.person}</div>
              <dl><dt>Email</dt><dd>{role.email}</dd><dt>Password</dt><dd>{PASSWORD}</dd></dl>
              <p>{role.description}</p>
              <button className="btn pri wide" onClick={() => onSignIn(role)}>Sign in as {role.label}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
