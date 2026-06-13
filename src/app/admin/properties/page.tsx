'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import { IconBuilding, IconPlus, IconPencil, IconTrash, IconStar, IconMagnify } from '../components/Icons';

interface Prop {
  id: number; title: string; price: number; price_currency: string;
  type: string; operation: string; status: string; city: string;
  state: string; featured: boolean; lead_count: number; images: string[];
}

const STATUS_COLOR: Record<string, string> = {
  available: '#00E5A0', sold: '#FF4A6E', rented: '#F5A623', reserved: '#0051FF',
};

export default function PropertiesAdmin() {
  const [props, setProps] = useState<Prop[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number|null>(null);

  const load = () => {
    fetch('/api/admin/properties').then(r => r.json())
      .then(d => { setProps(d.properties || []); setLoading(false); });
  };
  useEffect(load, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta propiedad?')) return;
    setDeleting(id);
    await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
    setProps(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  };

  const toggleFeatured = async (id: number, current: boolean) => {
    await fetch(`/api/admin/properties/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !current }),
    });
    setProps(prev => prev.map(p => p.id === id ? { ...p, featured: !current } : p));
  };

  const filtered = props.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0F', color:'#E8E8F8', display:'flex' }}>
      <Sidebar active="/admin/properties" />
      <main style={{ marginLeft:240, flex:1, padding:'40px' }}>
        {/* Header */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <IconBuilding size={22} />
              <h1 style={{ fontSize:28, fontWeight:900, letterSpacing:'-0.03em' }}>Propiedades</h1>
            </div>
            <p style={{ color:'#5A5A8A', fontSize:14 }}>{filtered.length} propiedades</p>
          </div>
          <Link href="/admin/properties/new"
            style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 20px', background:'linear-gradient(135deg,#0051FF,#7C3AED)', borderRadius:10, color:'#fff', fontWeight:700, fontSize:14, textDecoration:'none' }}>
            <IconPlus /> Nueva propiedad
          </Link>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}
          style={{ position:'relative', marginBottom:24, maxWidth:400 }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#5A5A8A' }}>
            <IconMagnify size={16} />
          </span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar propiedad o ciudad..."
            style={{ width:'100%', background:'#0D0D14', border:'1px solid #1A1A2E', borderRadius:10, padding:'10px 14px 10px 40px', color:'#E8E8F8', fontSize:14, outline:'none' }} />
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }}
          style={{ background:'#0D0D14', border:'1px solid #1A1A2E', borderRadius:16, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid #1A1A2E' }}>
                {['Propiedad', 'Tipo', 'Operación', 'Precio', 'Ciudad', 'Status', 'Leads', ''].map(h => (
                  <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontSize:11, color:'#5A5A8A', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={8} style={{ padding:40, textAlign:'center', color:'#5A5A8A' }}>Cargando...</td></tr>
              )}
              {filtered.map((p, i) => (
                <motion.tr key={p.id}
                  initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i * 0.04 }}
                  style={{ borderBottom:'1px solid #0F0F1A', transition:'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background='#0F0F1A')}
                  onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt="" style={{ width:44, height:36, objectFit:'cover', borderRadius:8, flexShrink:0 }} />
                      )}
                      <div>
                        <p style={{ fontWeight:600, fontSize:14, marginBottom:2 }}>{p.title}</p>
                        <button onClick={() => toggleFeatured(p.id, p.featured)}
                          style={{ background:'none', border:'none', cursor:'pointer', padding:0, color: p.featured ? '#F5A623' : '#2A2A4E', display:'flex', alignItems:'center', gap:4, fontSize:11 }}>
                          <IconStar size={12} filled={p.featured} />
                          {p.featured ? 'Destacada' : 'Sin destacar'}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ padding:'3px 10px', borderRadius:20, background:'#1A1A2E', fontSize:12, textTransform:'capitalize', color:'#A0A0C0' }}>{p.type}</span>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ padding:'3px 10px', borderRadius:20, fontSize:12, textTransform:'capitalize',
                      background: p.operation === 'venta' ? '#0051FF22' : '#7C3AED22',
                      color: p.operation === 'venta' ? '#6699FF' : '#A78BFA',
                    }}>{p.operation}</span>
                  </td>
                  <td style={{ padding:'14px 16px', fontWeight:700, color:'#E8E8F8', fontSize:14 }}>
                    {new Intl.NumberFormat('es-MX',{style:'currency',currency:p.price_currency||'MXN',maximumFractionDigits:0}).format(Number(p.price))}
                  </td>
                  <td style={{ padding:'14px 16px', color:'#A0A0C0', fontSize:14 }}>{p.city}, {p.state}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ padding:'3px 10px', borderRadius:20, fontSize:12, textTransform:'capitalize',
                      background: `${STATUS_COLOR[p.status] || '#5A5A8A'}22`,
                      color: STATUS_COLOR[p.status] || '#5A5A8A',
                    }}>{p.status}</span>
                  </td>
                  <td style={{ padding:'14px 16px', color: Number(p.lead_count)>0 ? '#7C3AED' : '#5A5A8A', fontWeight:700, fontSize:14 }}>
                    {p.lead_count}
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', gap:8 }}>
                      <Link href={`/admin/properties/${p.id}/edit`}
                        style={{ padding:'6px 10px', background:'#1A1A2E', borderRadius:8, color:'#A0A0C0', textDecoration:'none', display:'flex', alignItems:'center' }}>
                        <IconPencil size={14} />
                      </Link>
                      <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                        style={{ padding:'6px 10px', background:'#2A0A14', borderRadius:8, color:'#FF4A6E', border:'none', cursor:'pointer', display:'flex', alignItems:'center' }}>
                        <IconTrash size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding:40, textAlign:'center', color:'#5A5A8A' }}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </main>
    </div>
  );
}
