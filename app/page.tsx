export default function Page() {
  const buildTime = new Date().toISOString();
  
  // Define reusable styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      padding: '2rem'
    },
    maxWidth: {
      maxWidth: '896px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '3rem'
    },
    title: {
      fontSize: 'clamp(2.5rem, 8vw, 4rem)',
      fontWeight: 700,
      color: '#111827',
      marginBottom: '1rem',
      lineHeight: 1.1
    },
    subtitle: {
      fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
      color: '#4b5563',
      marginBottom: '2rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      borderLeft: '4px solid'
    },
    cardTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#111827',
      marginBottom: '0.5rem'
    },
    debugBox: {
      backgroundColor: '#111827',
      color: '#f3f4f6',
      borderRadius: '8px',
      padding: '1.5rem',
      fontFamily: 'Monaco, Consolas, monospace',
      fontSize: '0.875rem'
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>
            Trevor Miller
          </h1>
          <h2 style={styles.subtitle}>
            Full-Stack Developer & Data Engineer
          </h2>
        </header>

        {/* Status Cards */}
        <div style={styles.grid}>
          {/* Deployment Status */}
          <div style={{...styles.card, borderLeftColor: '#22c55e'}}>
            <h3 style={styles.cardTitle}>
              🚀 Deployment Status
            </h3>
            <p style={{color: '#15803d', fontWeight: 500, marginBottom: '0.5rem'}}>
              ✅ Next.js App Router Working
            </p>
            <p style={{fontSize: '0.875rem', color: '#6b7280'}}>
              Vercel deployment successful
            </p>
          </div>

          {/* Feature Progress */}
          <div style={{...styles.card, borderLeftColor: '#0077B6'}}>
            <h3 style={styles.cardTitle}>
              ⚡ Feature Progress
            </h3>
            <p style={{color: '#0077B6', fontWeight: 500, marginBottom: '0.5rem'}}>
              Phase 1a: Enhanced Styling
            </p>
            <p style={{fontSize: '0.875rem', color: '#6b7280'}}>
              Improved layout & typography with inline styles
            </p>
          </div>
        </div>

        {/* Debug Information */}
        <div style={styles.debugBox}>
          <h3 style={{color: '#22d3ee', fontWeight: 'bold', marginBottom: '0.75rem'}}>
            🔧 Debug Information
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
            <p><span style={{color: '#60a5fa'}}>Build Time:</span> {buildTime}</p>
            <p><span style={{color: '#60a5fa'}}>Phase:</span> 1a - Enhanced Styling (Inline)</p>
            <p><span style={{color: '#60a5fa'}}>CSS Processing:</span> <span style={{color: '#fbbf24'}}>Disabled</span></p>
            <p><span style={{color: '#60a5fa'}}>Features:</span> Responsive Grid, Cards, Typography</p>
            <p><span style={{color: '#60a5fa'}}>Next:</span> Add Tailwind Processing & Components</p>
          </div>
        </div>
      </div>
    </div>
  );
}