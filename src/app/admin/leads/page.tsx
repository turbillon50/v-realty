'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { IconUsers, IconCheck } from '../components/Icons';

interface Lead {
  id: number; name: string; email: string; phone: string;
  message: string; status: string; source: string;
  created_at: string; property_title: string;
}

const STATUS_COLORS: Record<string, { bg:string; text:string }> = {
  new:       { bg:'#0051FF22', text:'#6699FF' },
  contacted: { bg:'#7C3AED22', text:'#A78BFA' },
  qualified: { bg:'#00E5A022', text:'#00E5A0' },
  closed:    { bg:'#F5A62322', text:'#F5A623' },
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => {
    fetch('/api/admin/leads').then(r=>r.json())
      .then(d => { setLeads(d.leads||[]); setLoading(false); });
  };
  useEffect(load, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch('/api/admin/leads', {
      method: 'PATCH', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ id, status }),
    });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);
  const counts = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status]||0)+1; return acc; }, {} as Record<string,number>);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('es-MX',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0F', color:'#E8E8F8', display:'flex' }}>
      <Sidebar active="/admin/leads" />
      <main style={{ marginLeft:240, flex:1, padding:'40px' }}>
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <IconUsers size={22} />
            <h1 style={{ fontSize:28, fontWeight:900, letterSpacing:'-0.03em' }}>Leads</h1>
          </div>
          <p style={{ color:'#5A5A8A', fontSize:14 }}>{leads.length} leads en total</p>
        </motion.div>

        {/* Filter pills */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}
          style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
          {[['all','Todos',leads.length],['new','Nuevos',counts.new||0],['contacted','Contactados',counts.contacted||0],['qualified','Calificados',counts.qualified||0],['closed','Cerrados',counts.closed||0]].map(([v,l,c]) => {
            const active = filter === v;
            return (
              <button key={String(v)} onClick={() => setFilter(String(v))}
                style={{ padding:'7px 16px', borderRadius:20, fontSize:13, fontWeight:600, cursor:'pointer', border:'none', transition:'all 0.15s',
                  background: active ? 'linear-gradient(135deg,#0051FF,#7C3AED)' : '#1A1A2E',
                  color: active ? '#fff' : '#5A5A8A',
                }}>
                {String(l)} <span style={{ opacity:0.7, fontSize:11 }}>({c})</span>
              </button>
            );
          })}
        </motion.div>

        {/* Leads cards grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(380px,1fr))', gap:16 }}>
          {loading && <p style={{ color:'#5A5A8A', gridColumn:'1/-1', textAlign:'center', paddingTop:40 }}>Cargando...</p>}
          {!loading && filtered.length === 0 && (
            <p style={{ color:'#5A5A8A', gridColumn:'1/-1', textAlign:'center', paddingTop:40 }}>Sin leads en esta categoría.</p>
          )}
          {filtered.map((l, i) => {
            const sc = STATUS_COLORS[l.status] || { bg:'#1A1A2E', text:'#5A5A8A' };
            return (
              <motion.div key={l.id}
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.04 }}
                style={{ background:'#0D0D14', border:'1px solid #1A1A2E', borderRadius:16, padding:20, position:'relative' }}>
                {/* Header */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                  <div>
                    <p style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>{l.name}</p>
                    <a href={`mailto:${l.email}`} style={{ color:'#0051FF', fontSize:13, textDecoration:'none' }}>{l.email}</a>
                    {l.phone && <p style={{ color:'#5A5A8A', fontSize:12, marginTop:2 }}>{l.phone}</p>}
                  </div>
                  <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, textTransform:'capitalize', background:sc.bg, color:sc.text }}>
                    {l.status}
                  </span>
                </div>
                {/* Propiedad */}
                {l.property_title && (
                  <div style={{ background:'#0A0A0F', borderRadius:8, padding:'8px 12px', marginBottom:10, borderLeft:'2px solid #0051FF' }}>
                    <p style={{ fontSize:11, color:'#5A5A8A', marginBottom:2 }}>Propiedad</p>
                    <p style={{ fontSize:13, color:'#A0A0C0' }}>{l.property_title}</p>
                  </div>
                )}
                {/* Mensaje */}
                {l.message && (
                  <p style={{ color:'#A0A0C0', fontSize:13, fontStyle:'italic', marginBottom:12, lineHeight:1.5 }}>"{l.message}"</p>
                )}
                {/* Footer */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #1A1A2E', paddingTop:12 }}>
                  <p style={{ color:'#5A5A8A', fontSize:11 }}>{fmtDate(l.created_at)}</p>
                  <div style={{ display:'flex', gap:6 }}>
                    {['new','contacted','qualified','closed'].filter(s => s !== l.status).slice(0,2).map(s => (
                      <button key={s} onClick={() => updateStatus(l.id, s)}
                        style={{ padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:600, border:'none', cursor:'pointer',
                          background: STATUS_COLORS[s]?.bg || '#1A1A2E',
                          color: STATUS_COLORS[s]?.text || '#5A5A8A',
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
