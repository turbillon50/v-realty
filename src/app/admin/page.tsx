'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
import {
  IconDashboard, IconBuilding, IconUsers,
  IconStar, IconSignOut
} from './components/Icons';

interface Stats {
  properties: { total: number; available: number };
  leads: { total: number; new: number };
  favorites: { total: number };
  byType: { type: string; total: number }[];
  byOp:   { operation: string; total: number }[];
  recentLeads: { name: string; email: string; created_at: string; property: string }[];
}

const FadeUp = ({ children, delay=0, className='' }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >{children}</motion.div>
);

const StatCard = ({ label, value, sub, color, delay }: any) => (
  <FadeUp delay={delay}>
    <div style={{ background:'#0D0D14', border:'1px solid #1A1A2E', borderRadius:16, padding:'24px 28px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 80% 20%, ${color}18 0%, transparent 60%)`, pointerEvents:'none' }} />
      <p style={{ color:'#5A5A8A', fontSize:12, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>{label}</p>
      <p style={{ fontSize:40, fontWeight:900, letterSpacing:'-0.03em', color:'#E8E8F8', lineHeight:1 }}>{value}</p>
      {sub && <p style={{ color:color, fontSize:13, marginTop:6 }}>{sub}</p>}
    </div>
  </FadeUp>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const { signOut } = useClerk();

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => setStats(d));
  }, []);

  const nav = [
    { href:'/admin', label:'Dashboard', icon: <IconDashboard /> },
    { href:'/admin/properties', label:'Propiedades', icon: <IconBuilding /> },
    { href:'/admin/leads', label:'Leads', icon: <IconUsers /> },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0F', color:'#E8E8F8', display:'flex' }}>
      {/* SIDEBAR */}
      <aside style={{ width:240, background:'#0D0D14', borderRight:'1px solid #1A1A2E', display:'flex', flexDirection:'column', padding:'0', position:'fixed', top:0, left:0, bottom:0, zIndex:50 }}>
        {/* Logo */}
        <div style={{ padding:'28px 24px 20px', borderBottom:'1px solid #1A1A2E' }}>
          <Link href="/" style={{ textDecoration:'none' }}>
            <p style={{ fontSize:11, color:'#5A5A8A', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:4 }}>V·REALTY</p>
            <p style={{ fontSize:18, fontWeight:900, letterSpacing:'-0.03em', background:'linear-gradient(135deg,#0051FF,#7C3AED)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Admin Panel</p>
          </Link>
        </div>
        {/* Nav */}
        <nav style={{ flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:4 }}>
          {nav.map(n => (
            <Link key={n.href} href={n.href}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:10, color:'#5A5A8A', textDecoration:'none', fontSize:14, fontWeight:500, transition:'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as any).style.background='#1A1A2E'; (e.currentTarget as any).style.color='#E8E8F8'; }}
              onMouseLeave={e => { (e.currentTarget as any).style.background='transparent'; (e.currentTarget as any).style.color='#5A5A8A'; }}
            >
              {n.icon}{n.label}
            </Link>
          ))}
        </nav>
        {/* Sign out */}
        <div style={{ padding:'16px 12px', borderTop:'1px solid #1A1A2E' }}>
          <button onClick={() => signOut({ redirectUrl: '/' })}
            style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:10, color:'#5A5A8A', background:'none', border:'none', cursor:'pointer', fontSize:14, width:'100%' }}>
            <IconSignOut /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft:240, flex:1, padding:'40px 40px' }}>
        <FadeUp>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
            <IconDashboard size={22} />
            <h1 style={{ fontSize:28, fontWeight:900, letterSpacing:'-0.03em' }}>Dashboard</h1>
          </div>
          <p style={{ color:'#5A5A8A', marginBottom:36, fontSize:14 }}>Resumen general de V-Realty</p>
        </FadeUp>

        {/* Stats grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:16, marginBottom:36 }}>
          <StatCard label="Propiedades" value={stats?.properties.total ?? '—'} sub={`${stats?.properties.available ?? '—'} disponibles`} color="#0051FF" delay={0.05} />
          <StatCard label="Leads totales" value={stats?.leads.total ?? '—'} sub={`${stats?.leads.new ?? '—'} nuevos`} color="#7C3AED" delay={0.1} />
          <StatCard label="Favoritos" value={stats?.favorites.total ?? '—'} sub="guardados por usuarios" color="#00E5A0" delay={0.15} />
        </div>

        {/* Two columns */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          {/* Por tipo */}
          <FadeUp delay={0.2}>
            <div style={{ background:'#0D0D14', border:'1px solid #1A1A2E', borderRadius:16, padding:24 }}>
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16, color:'#E8E8F8', textTransform:'uppercase', letterSpacing:'0.08em' }}>Por Tipo</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {stats?.byType.map(t => (
                  <div key={t.type} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ textTransform:'capitalize', color:'#A0A0C0', fontSize:14 }}>{t.type}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:80, height:6, background:'#1A1A2E', borderRadius:3, overflow:'hidden' }}>
                        <div style={{ height:'100%', borderRadius:3, background:'linear-gradient(90deg,#0051FF,#7C3AED)', width:`${Math.min(100, (Number(t.total) / (stats?.properties.total||1)) * 100)}%` }} />
                      </div>
                      <span style={{ color:'#E8E8F8', fontWeight:700, fontSize:14, minWidth:20 }}>{t.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Leads recientes */}
          <FadeUp delay={0.25}>
            <div style={{ background:'#0D0D14', border:'1px solid #1A1A2E', borderRadius:16, padding:24 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <h3 style={{ fontSize:14, fontWeight:700, color:'#E8E8F8', textTransform:'uppercase', letterSpacing:'0.08em' }}>Leads Recientes</h3>
                <Link href="/admin/leads" style={{ color:'#0051FF', fontSize:12, textDecoration:'none' }}>Ver todos →</Link>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {stats?.recentLeads.length === 0 && <p style={{ color:'#5A5A8A', fontSize:13 }}>Sin leads aún.</p>}
                {stats?.recentLeads.map((l, i) => (
                  <div key={i} style={{ padding:'10px 14px', background:'#0A0A0F', borderRadius:10, border:'1px solid #1A1A2E' }}>
                    <p style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{l.name}</p>
                    <p style={{ color:'#5A5A8A', fontSize:12 }}>{l.email}</p>
                    {l.property && <p style={{ color:'#0051FF', fontSize:11, marginTop:4 }}>↳ {l.property}</p>}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Quick actions */}
        <FadeUp delay={0.3} className="mt-6">
          <div style={{ marginTop:24, display:'flex', gap:12, flexWrap:'wrap' }}>
            <Link href="/admin/properties/new"
              style={{ padding:'12px 24px', background:'linear-gradient(135deg,#0051FF,#7C3AED)', borderRadius:10, color:'#fff', fontWeight:700, fontSize:14, textDecoration:'none', letterSpacing:'-0.01em' }}>
              + Nueva propiedad
            </Link>
            <Link href="/admin/leads"
              style={{ padding:'12px 24px', background:'#1A1A2E', border:'1px solid #2A2A4E', borderRadius:10, color:'#E8E8F8', fontWeight:600, fontSize:14, textDecoration:'none' }}>
              Ver leads
            </Link>
            <Link href="/"
              style={{ padding:'12px 24px', background:'transparent', border:'1px solid #1A1A2E', borderRadius:10, color:'#5A5A8A', fontWeight:600, fontSize:14, textDecoration:'none' }}>
              Ver sitio →
            </Link>
          </div>
        </FadeUp>
      </main>
    </div>
  );
}
