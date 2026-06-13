import { auth, currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await currentUser();
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8]">
      <nav className="fixed top-0 w-full z-50 border-b border-[#1E1E1E] bg-[#0A0A0A]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-wider text-[#C9A84C]">V·REALTY</Link>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-24">
        <h1 className="text-3xl font-bold mb-2">
          Hola, <span className="text-[#C9A84C]">{user?.firstName || 'Usuario'}</span>
        </h1>
        <p className="text-[#6B6B6B] mb-10">Panel de usuario · V-Realty</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label:'Propiedades guardadas', icon:'♥', href:'/favorites', desc:'Ver mis favoritos' },
            { label:'Mis solicitudes', icon:'✉', href:'#', desc:'Historial de contactos' },
            { label:'Explorar', icon:'⌂', href:'/properties', desc:'Ver todas las propiedades' },
          ].map(({ label, icon, href, desc }) => (
            <Link key={label} href={href}
              className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-6 hover:border-[#C9A84C]/40 transition-all group">
              <div className="text-3xl mb-4 text-[#C9A84C]">{icon}</div>
              <div className="font-semibold mb-1">{label}</div>
              <div className="text-sm text-[#6B6B6B]">{desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
