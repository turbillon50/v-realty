'use client';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
import { IconDashboard, IconBuilding, IconUsers, IconSignOut } from './Icons';

const navItems = [
  { href: '/admin',            label: 'Dashboard',    icon: <IconDashboard /> },
  { href: '/admin/properties', label: 'Propiedades',  icon: <IconBuilding /> },
  { href: '/admin/leads',      label: 'Leads',        icon: <IconUsers /> },
];

export default function Sidebar({ active }: { active: string }) {
  const { signOut } = useClerk();
  return (
    <aside style={{ width:240, background:'#0D0D14', borderRight:'1px solid #1A1A2E', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:50 }}>
      <div style={{ padding:'28px 24px 20px', borderBottom:'1px solid #1A1A2E' }}>
        <Link href="/" style={{ textDecoration:'none' }}>
          <p style={{ fontSize:11, color:'#5A5A8A', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:4 }}>V·REALTY</p>
          <p style={{ fontSize:18, fontWeight:900, letterSpacing:'-0.03em', background:'linear-gradient(135deg,#0051FF,#7C3AED)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Admin Panel</p>
        </Link>
      </div>
      <nav style={{ flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:4 }}>
        {navItems.map(n => {
          const isActive = active === n.href;
          return (
            <Link key={n.href} href={n.href}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:10, textDecoration:'none', fontSize:14, fontWeight:500, transition:'all 0.15s',
                background: isActive ? '#1A1A2E' : 'transparent',
                color: isActive ? '#E8E8F8' : '#5A5A8A',
              }}>
              {n.icon}{n.label}
              {isActive && <span style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'#0051FF' }} />}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding:'16px 12px', borderTop:'1px solid #1A1A2E' }}>
        <button onClick={() => signOut({ redirectUrl: '/' })}
          style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:10, color:'#5A5A8A', background:'none', border:'none', cursor:'pointer', fontSize:14, width:'100%', transition:'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color='#E8E8F8')}
          onMouseLeave={e => (e.currentTarget.style.color='#5A5A8A')}>
          <IconSignOut /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
