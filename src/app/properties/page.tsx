'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Property {
  id: number; title: string; price: number; price_currency: string;
  type: string; operation: string; area_m2: number; rooms: number;
  bathrooms: number; city: string; state: string; featured: boolean; images: string[];
}

export default function PropertiesPage() {
  const [props, setProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [opFilter, setOpFilter] = useState('all');

  useEffect(() => {
    fetch('/api/properties')
      .then(r => r.json())
      .then(d => { setProps(d.properties || []); setLoading(false); });
  }, []);

  const filtered = props.filter(p => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    if (opFilter !== 'all' && p.operation !== opFilter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8]">
      <nav className="fixed top-0 w-full z-50 border-b border-[#1E1E1E] bg-[#0A0A0A]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-wider text-[#C9A84C]">V·REALTY</Link>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-24">
        <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="text-4xl font-bold mb-8">
          Todas las <span className="text-[#C9A84C]">propiedades</span>
        </motion.h1>
        {/* Search + Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o ciudad..."
            className="flex-1 min-w-48 bg-[#111] border border-[#1E1E1E] rounded-full px-5 py-2.5 text-sm text-[#E8E8E8] placeholder-[#6B6B6B] focus:outline-none focus:border-[#C9A84C]" />
          {[['all','Todos'],['casa','Casas'],['departamento','Deptos'],['terreno','Terrenos']].map(([v,l]) => (
            <button key={v} onClick={() => setTypeFilter(v)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${typeFilter===v?'bg-[#C9A84C] text-black':'border border-[#1E1E1E] text-[#6B6B6B] hover:border-[#C9A84C]'}`}>{l}</button>
          ))}
          {[['all','Todos'],['venta','Venta'],['renta','Renta']].map(([v,l]) => (
            <button key={v} onClick={() => setOpFilter(v)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${opFilter===v?'bg-[#C9A84C] text-black':'border border-[#1E1E1E] text-[#6B6B6B] hover:border-[#C9A84C]'}`}>{l}</button>
          ))}
        </div>
        {loading && <p className="text-[#6B6B6B] text-center py-20">Cargando...</p>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i*0.05 }} whileHover={{ y:-4 }}>
              <Link href={`/properties/${p.id}`}
                className="block bg-[#111] border border-[#1E1E1E] rounded-2xl overflow-hidden hover:border-[#C9A84C]/40 transition-all group">
                <div className="relative h-48 overflow-hidden">
                  <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                    alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 bg-black/70 text-[#C9A84C] text-xs rounded-full capitalize">{p.type}</span>
                    <span className="px-3 py-1 bg-[#C9A84C] text-black text-xs rounded-full font-semibold capitalize">{p.operation}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold mb-1 line-clamp-1">{p.title}</h3>
                  <p className="text-[#6B6B6B] text-sm mb-3">{p.city}, {p.state}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#C9A84C] font-bold">
                      {new Intl.NumberFormat('es-MX',{style:'currency',currency:p.price_currency||'MXN',maximumFractionDigits:0}).format(p.price)}
                    </span>
                    <div className="flex gap-3 text-xs text-[#6B6B6B]">
                      {p.rooms && <span>{p.rooms}rec</span>}
                      {p.bathrooms && <span>{p.bathrooms}baños</span>}
                      {p.area_m2 && <span>{p.area_m2}m²</span>}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-20 text-[#6B6B6B]">Sin resultados para esa búsqueda.</div>
        )}
      </div>
    </div>
  );
}
