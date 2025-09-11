export default function Page() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem', 
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>
        Trevor Miller
      </h1>
      <h2 style={{ fontSize: '1.5rem', color: '#666', margin: '0 0 2rem 0' }}>
        Full-Stack Developer & Data Engineer
      </h2>
      <div style={{
        backgroundColor: '#dcfce7',
        border: '1px solid #22c55e',
        borderRadius: '8px',
        padding: '1rem',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <p style={{ color: '#166534', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
          ✅ Next.js App Router Working
        </p>
        <p style={{ color: '#15803d', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
          If you see this, the deployment succeeded!
        </p>
        <p style={{ color: '#15803d', fontSize: '0.875rem', margin: '0' }}>
          Build time: {new Date().toISOString()} - CSS Fix Applied
        </p>
      </div>
    </div>
  );
}