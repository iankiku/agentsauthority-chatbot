import * as React from 'react';

interface MagicLinkEmailTemplateProps {
  magicLink: string;
  userEmail: string;
}

export function MagicLinkEmailTemplate({ magicLink, userEmail }: MagicLinkEmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          background: 'linear-gradient(135deg, #ff6b35 0%, #4ecdc4 100%)', 
          borderRadius: '12px', 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>A</span>
        </div>
        <h1 style={{ color: '#1a1a1a', fontSize: '28px', fontWeight: 'bold', margin: '0' }}>
          Agents Authority
        </h1>
        <p style={{ color: '#666', fontSize: '16px', margin: '8px 0 0 0' }}>
          AI Marketing Intelligence Platform
        </p>
      </div>

      {/* Main Content */}
      <div style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '32px', marginBottom: '32px' }}>
        <h2 style={{ color: '#1a1a1a', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          Sign in to your account
        </h2>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
          Click the button below to securely sign in to your Agents Authority account. This link will expire in 10 minutes for your security.
        </p>
        
        {/* Magic Link Button */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <a 
            href={magicLink}
            style={{
              display: 'inline-block',
              backgroundColor: '#4ecdc4',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(78, 205, 196, 0.3)'
            }}
          >
            Sign In to Agents Authority
          </a>
        </div>

        <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', margin: '0' }}>
          Or copy and paste this link in your browser:
        </p>
        <p style={{ 
          color: '#4ecdc4', 
          fontSize: '14px', 
          textAlign: 'center', 
          wordBreak: 'break-all',
          backgroundColor: '#fff',
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid #e0e0e0',
          margin: '8px 0 0 0'
        }}>
          {magicLink}
        </p>
      </div>

      {/* Security Notice */}
      <div style={{ backgroundColor: '#fff3cd', borderRadius: '8px', padding: '16px', marginBottom: '32px', border: '1px solid #ffeaa7' }}>
        <h3 style={{ color: '#856404', fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
          🔒 Security Notice
        </h3>
        <p style={{ color: '#856404', fontSize: '14px', margin: '0', lineHeight: '1.5' }}>
          This magic link was requested for <strong>{userEmail}</strong>. If you didn't request this, please ignore this email. The link will expire automatically.
        </p>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', borderTop: '1px solid #e0e0e0', paddingTop: '24px' }}>
        <p style={{ color: '#888', fontSize: '14px', margin: '0 0 8px 0' }}>
          © {new Date().getFullYear()} Agents Authority. All rights reserved.
        </p>
        <p style={{ color: '#888', fontSize: '12px', margin: '0' }}>
          This email was sent to {userEmail} because you requested to sign in to Agents Authority.
        </p>
        <div style={{ marginTop: '16px' }}>
          <a href="https://agentsauthority.ai" style={{ color: '#4ecdc4', textDecoration: 'none', fontSize: '14px', marginRight: '16px' }}>
            Visit Website
          </a>
          <a href="https://agentsauthority.ai/support" style={{ color: '#4ecdc4', textDecoration: 'none', fontSize: '14px' }}>
            Get Support
          </a>
        </div>
      </div>
    </div>
  );
}
