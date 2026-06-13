'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/leads', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    });
    if (res.ok) setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8]">
      <nav className="fixed top-0 w-full z-50 border-b border-[#1E1E1E] bg-[#0A0A0A]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-wider text-[#C9A84C]">V·REALTY</Link>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-4 pt-32 pb-24">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <h1 className="text-4xl font-bold mb-3">Contáctanos</h1>
          <p className="text-[#6B6B6B] mb-10">Un asesor se pondrá en contacto contigo en menos de 24 horas.</p>
          {sent ? (
            <div className="text-center py-16 bg-[#111] border border-[#1E1E1E] rounded-2xl">
              <div className="text-5xl mb-4">✓</div>
              <p className="text-[#C9A84C] font-semibold text-xl">¡Mensaje enviado!</p>
              <p className="text-[#6B6B6B] mt-2">Te contactaremos pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-8 space-y-5">
              {[['name','Nombre completo','text',true],['email','Email','email',true],['phone','Teléfono','tel',false]].map(([f,pl,t,r]:any)=>(
                <input key={f} type={t} placeholder={pl} required={r}
                  value={(form as any)[f]} onChange={e=>setForm(x=>({...x,[f]:e.target.value}))}
                  className="w-full bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C9A84C] placeholder-[#6B6B6B]" />
              ))}
              <textarea placeholder="¿En qué podemos ayudarte?" rows={5} required
                value={form.message} onChange={e=>setForm(x=>({...x,message:e.target.value}))}
                className="w-full bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C9A84C] placeholder-[#6B6B6B] resize-none" />
              <button type="submit"
                className="w-full py-4 bg-[#C9A84C] text-black font-bold rounded-xl hover:bg-[#E0BB60] transition-all">
                Enviar mensaje
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
