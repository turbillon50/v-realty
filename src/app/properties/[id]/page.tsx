'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PropertyPage({ params }: { params: { id: string } }) {
  const [p, setP] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [sent, setSent] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    fetch(`/api/properties/${params.id}`)
      .then(r => r.json())
      .then(d => { setP(d.property); setLoading(false); });
  }, [params.id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/leads', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...form, property_id: parseInt(params.id) })
    });
    if (res.ok) setSent(true);
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-[#6B6B6B]">Cargando...</div>;
  if (!p) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-[#6B6B6B]">Propiedad no encontrada.</div>;

  const imgs = p.images || [];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8]">
      <nav className="fixed top-0 w-full z-50 border-b border-[#1E1E1E] bg-[#0A0A0A]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="text-xl font-bold tracking-wider text-[#C9A84C]">V·REALTY</Link>
          <span className="text-[#1E1E1E]">/</span>
          <Link href="/properties" className="text-sm text-[#6B6B6B] hover:text-[#C9A84C]">Propiedades</Link>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-24">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: images + info */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            {imgs.length > 0 && (
              <div className="rounded-2xl overflow-hidden mb-6">
                <div className="relative h-80 md:h-[460px]">
                  <img src={imgs[imgIdx]} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-black/70 text-[#C9A84C] text-xs rounded-full capitalize">{p.type}</span>
                    <span className="px-3 py-1 bg-[#C9A84C] text-black text-xs rounded-full capitalize">{p.operation}</span>
                  </div>
                </div>
                {imgs.length > 1 && (
                  <div className="flex gap-2 mt-2">
                    {imgs.map((img: string, i: number) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        className={"rounded-lg overflow-hidden border-2 transition-all " + (i===imgIdx?"border-[#C9A84C]":"border-transparent")}>
                        <img src={img} alt="" className="w-20 h-14 object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
              <h1 className="text-3xl font-bold mb-2">{p.title}</h1>
              <p className="text-[#6B6B6B] mb-4">{p.address || ''} {p.city}, {p.state}</p>
              <div className="text-3xl font-bold text-[#C9A84C] mb-6">
                {new Intl.NumberFormat('es-MX',{style:'currency',currency:p.price_currency||'MXN',maximumFractionDigits:0}).format(p.price)}
                {p.operation==='renta' && <span className="text-base text-[#6B6B6B] ml-2">/mes</span>}
              </div>
              {/* Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  p.area_m2 && [p.area_m2+'m²','Superficie'],
                  p.rooms && [p.rooms,'Recámaras'],
                  p.bathrooms && [p.bathrooms,'Baños'],
                  p.parking && [p.parking,'Estacionamiento'],
                ].filter(Boolean).map(([v,l]:any) => (
                  <div key={l} className="bg-[#111] border border-[#1E1E1E] rounded-xl p-4 text-center">
                    <div className="text-xl font-bold text-[#C9A84C]">{v}</div>
                    <div className="text-xs text-[#6B6B6B] mt-1">{l}</div>
                  </div>
                ))}
              </div>
              {p.description && <p className="text-[#6B6B6B] leading-relaxed mb-8">{p.description}</p>}
              {p.amenities?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Amenidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {p.amenities.map((a: string) => (
                      <span key={a} className="px-3 py-1 bg-[#111] border border-[#1E1E1E] rounded-full text-sm text-[#6B6B6B] capitalize">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          {/* Right: Contact form */}
          <div>
            <div className="sticky top-24 bg-[#111] border border-[#1E1E1E] rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-6">¿Te interesa esta propiedad?</h3>
              {sent ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">✓</div>
                  <p className="text-[#C9A84C] font-semibold">¡Solicitud enviada!</p>
                  <p className="text-[#6B6B6B] text-sm mt-2">Te contactaremos en menos de 24h.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[['name','Nombre completo','text',true],['email','Email','email',true],['phone','Teléfono','tel',false]].map(([field,placeholder,type,req]:any) => (
                    <input key={field} type={type} placeholder={placeholder} required={req}
                      value={(form as any)[field]} onChange={e => setForm(f=>({...f,[field]:e.target.value}))}
                      className="w-full bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] placeholder-[#6B6B6B]" />
                  ))}
                  <textarea placeholder="Mensaje (opcional)" rows={3}
                    value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))}
                    className="w-full bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] placeholder-[#6B6B6B] resize-none" />
                  <button type="submit"
                    className="w-full py-4 bg-[#C9A84C] text-black font-semibold rounded-xl hover:bg-[#E0BB60] transition-all">
                    Solicitar información
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
