'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

interface Property {
  id: number;
  title: string;
  price: number;
  price_currency: string;
  type: string;
  operation: string;
  area_m2: number;
  rooms: number;
  bathrooms: number;
  city: string;
  state: string;
  featured: boolean;
  images: string[];
  amenities: string[];
}

const FadeIn = ({ children, delay = 0, className = "" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(price);

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState({ type: 'all', operation: 'all' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties')
      .then(r => r.json())
      .then(d => { setProperties(d.properties || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = properties.filter(p => {
    if (filter.type !== 'all' && p.type !== filter.type) return false;
    if (filter.operation !== 'all' && p.operation !== filter.operation) return false;
    return true;
  });

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8]">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#1E1E1E] bg-[#0A0A0A]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-['var(--font-playfair)'] text-xl font-bold tracking-wider text-[#C9A84C]">
            V·REALTY
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/properties" className="text-sm text-[#6B6B6B] hover:text-[#C9A84C] transition-colors">Propiedades</Link>
            <SignedOut>
              <Link href="/sign-in" className="text-sm px-4 py-2 border border-[#C9A84C] text-[#C9A84C] rounded-full hover:bg-[#C9A84C] hover:text-black transition-all">
                Ingresar
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-sm text-[#6B6B6B] hover:text-[#C9A84C] transition-colors">Mi cuenta</Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #C9A84C 0%, transparent 50%), radial-gradient(circle at 75% 20%, #C9A84C 0%, transparent 40%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <FadeIn>
            <span className="inline-block text-[#C9A84C] text-sm tracking-widest uppercase mb-4">Propiedades de lujo en México</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Encuentra tu<br />
              <span className="text-[#C9A84C]">propiedad ideal</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-[#6B6B6B] text-lg md:text-xl max-w-xl mb-10">
              Casas, departamentos y terrenos premium. Asesoría personalizada para encontrar el hogar que mereces.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-4">
              <Link href="/properties"
                className="px-8 py-4 bg-[#C9A84C] text-black font-semibold rounded-full hover:bg-[#E0BB60] transition-all text-sm tracking-wide">
                Ver propiedades
              </Link>
              <Link href="/contact"
                className="px-8 py-4 border border-[#1E1E1E] text-[#E8E8E8] rounded-full hover:border-[#C9A84C] transition-all text-sm">
                Hablar con un asesor
              </Link>
            </div>
          </FadeIn>
          {/* Stats */}
          <FadeIn delay={0.5} className="mt-20 grid grid-cols-3 gap-8 max-w-lg">
            {[['200+', 'Propiedades'], ['98%', 'Satisfacción'], ['15+', 'Años de exp.']].map(([n, l]) => (
              <div key={l}>
                <div className="text-3xl font-bold text-[#C9A84C]">{n}</div>
                <div className="text-xs text-[#6B6B6B] mt-1">{l}</div>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* FILTERS */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="text-[#6B6B6B] text-sm self-center">Filtrar:</span>
          {[['all','Todos'], ['casa','Casas'], ['departamento','Deptos'], ['terreno','Terrenos']].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(f => ({ ...f, type: v }))}
              className={`px-4 py-2 rounded-full text-sm transition-all ${filter.type === v ? 'bg-[#C9A84C] text-black' : 'border border-[#1E1E1E] text-[#6B6B6B] hover:border-[#C9A84C]'}`}>
              {l}
            </button>
          ))}
          <div className="w-px h-8 bg-[#1E1E1E] self-center mx-1" />
          {[['all','Venta y Renta'], ['venta','En Venta'], ['renta','En Renta']].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(f => ({ ...f, operation: v }))}
              className={`px-4 py-2 rounded-full text-sm transition-all ${filter.operation === v ? 'bg-[#C9A84C] text-black' : 'border border-[#1E1E1E] text-[#6B6B6B] hover:border-[#C9A84C]'}`}>
              {l}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-8">
          <h2 className="text-xl font-semibold mb-6 text-[#C9A84C]">✦ Propiedades destacadas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p, i) => <PropertyCard key={p.id} property={p} delay={i * 0.08} />)}
          </div>
        </section>
      )}

      {/* ALL */}
      {rest.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-24">
          {featured.length > 0 && <h2 className="text-xl font-semibold mb-6">Más propiedades</h2>}
          {loading && <div className="text-[#6B6B6B] text-center py-12">Cargando propiedades...</div>}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((p, i) => <PropertyCard key={p.id} property={p} delay={i * 0.05} />)}
          </div>
          {filtered.length === 0 && !loading && (
            <div className="text-center py-12 text-[#6B6B6B]">No hay propiedades con ese filtro.</div>
          )}
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[#1E1E1E] py-12 text-center text-[#6B6B6B] text-sm">
        <div className="text-[#C9A84C] font-bold mb-2">V·REALTY</div>
        <p>© {new Date().getFullYear()} V-Realty. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

function PropertyCard({ property: p, delay }: { property: Property; delay: number }) {
  const img = p.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/properties/${p.id}`}
        className="block bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden hover:border-[#C9A84C]/40 transition-all group">
        <div className="relative h-52 overflow-hidden">
          <img src={img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-3 py-1 bg-[#0A0A0A]/80 backdrop-blur text-[#C9A84C] text-xs rounded-full capitalize">{p.type}</span>
            <span className="px-3 py-1 bg-[#C9A84C] text-black text-xs rounded-full font-semibold capitalize">{p.operation}</span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-base mb-1 line-clamp-1">{p.title}</h3>
          <p className="text-[#6B6B6B] text-sm mb-3">{p.city}, {p.state}</p>
          <div className="flex items-center justify-between">
            <span className="text-[#C9A84C] font-bold text-lg">
              {new Intl.NumberFormat('es-MX', { style: 'currency', currency: p.price_currency || 'MXN', maximumFractionDigits: 0 }).format(p.price)}
            </span>
            <div className="flex gap-3 text-xs text-[#6B6B6B]">
              {p.rooms && <span>{p.rooms} rec</span>}
              {p.bathrooms && <span>{p.bathrooms} baños</span>}
              {p.area_m2 && <span>{p.area_m2}m²</span>}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
