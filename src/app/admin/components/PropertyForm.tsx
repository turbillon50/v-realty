'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconCheck, IconX } from './Icons';

interface FormData {
  title: string; description: string; price: string; price_currency: string;
  type: string; operation: string; status: string;
  area_m2: string; rooms: string; bathrooms: string; parking: string;
  address: string; city: string; state: string;
  featured: boolean; images: string; amenities: string;
}

const INITIAL: FormData = {
  title:'', description:'', price:'', price_currency:'MXN',
  type:'casa', operation:'venta', status:'available',
  area_m2:'', rooms:'', bathrooms:'', parking:'0',
  address:'', city:'', state:'Jalisco',
  featured:false, images:'', amenities:'',
};

const Field = ({ label, children, required=false }: any) => (
  <div>
    <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#5A5A8A', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>
      {label}{required && <span style={{ color:'#FF4A6E', marginLeft:4 }}>*</span>}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width:'100%', background:'#0A0A0F', border:'1px solid #1A1A2E', borderRadius:10,
  padding:'10px 14px', color:'#E8E8F8', fontSize:14, outline:'none', boxSizing:'border-box',
};

const selectStyle: React.CSSProperties = { ...inputStyle, cursor:'pointer' };

export default function PropertyForm({ initial, mode, propertyId }:
  { initial?: Partial<FormData>; mode: 'create'|'edit'; propertyId?: number }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ ...INITIAL, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (k: keyof FormData, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        price_currency: form.price_currency,
        type: form.type,
        operation: form.operation,
        status: form.status,
        area_m2: form.area_m2 ? parseFloat(form.area_m2) : null,
        rooms: form.rooms ? parseInt(form.rooms) : null,
        bathrooms: form.bathrooms ? parseFloat(form.bathrooms) : null,
        parking: parseInt(form.parking) || 0,
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        featured: form.featured,
        images: form.images.split('\n').map(s=>s.trim()).filter(Boolean),
        amenities: form.amenities.split(',').map(s=>s.trim()).filter(Boolean),
      };
      const url = mode === 'create' ? '/api/admin/properties' : `/api/admin/properties/${propertyId}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      setSuccess(true);
      setTimeout(() => router.push('/admin/properties'), 1200);
    } catch (e: any) {
      setError(e.message || 'Error al guardar');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        {/* Título */}
        <div style={{ gridColumn:'1/-1' }}>
          <Field label="Título" required>
            <input value={form.title} onChange={e=>set('title',e.target.value)} required
              placeholder="Casa en Zapopan con alberca" style={inputStyle} />
          </Field>
        </div>
        {/* Precio */}
        <Field label="Precio" required>
          <div style={{ display:'flex', gap:8 }}>
            <input value={form.price} onChange={e=>set('price',e.target.value)} required type="number"
              placeholder="4500000" style={{ ...inputStyle, flex:1 }} />
            <select value={form.price_currency} onChange={e=>set('price_currency',e.target.value)} style={{ ...selectStyle, width:90 }}>
              <option>MXN</option><option>USD</option>
            </select>
          </div>
        </Field>
        {/* Tipo + Operación */}
        <Field label="Tipo" required>
          <select value={form.type} onChange={e=>set('type',e.target.value)} style={selectStyle}>
            {['casa','departamento','terreno','local','oficina'].map(v=><option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Operación" required>
          <select value={form.operation} onChange={e=>set('operation',e.target.value)} style={selectStyle}>
            <option value="venta">Venta</option>
            <option value="renta">Renta</option>
          </select>
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={e=>set('status',e.target.value)} style={selectStyle}>
            {['available','sold','rented','reserved'].map(v=><option key={v}>{v}</option>)}
          </select>
        </Field>
        {/* Specs */}
        <Field label="Superficie (m²)">
          <input value={form.area_m2} onChange={e=>set('area_m2',e.target.value)} type="number" placeholder="280" style={inputStyle} />
        </Field>
        <Field label="Recámaras">
          <input value={form.rooms} onChange={e=>set('rooms',e.target.value)} type="number" placeholder="4" style={inputStyle} />
        </Field>
        <Field label="Baños">
          <input value={form.bathrooms} onChange={e=>set('bathrooms',e.target.value)} type="number" step="0.5" placeholder="3.5" style={inputStyle} />
        </Field>
        <Field label="Estacionamientos">
          <input value={form.parking} onChange={e=>set('parking',e.target.value)} type="number" placeholder="2" style={inputStyle} />
        </Field>
        {/* Ubicación */}
        <div style={{ gridColumn:'1/-1' }}>
          <Field label="Dirección">
            <input value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Av. López Mateos 1234" style={inputStyle} />
          </Field>
        </div>
        <Field label="Ciudad" required>
          <input value={form.city} onChange={e=>set('city',e.target.value)} required placeholder="Zapopan" style={inputStyle} />
        </Field>
        <Field label="Estado" required>
          <input value={form.state} onChange={e=>set('state',e.target.value)} required placeholder="Jalisco" style={inputStyle} />
        </Field>
        {/* Imágenes */}
        <div style={{ gridColumn:'1/-1' }}>
          <Field label="URLs de imágenes (una por línea)">
            <textarea value={form.images} onChange={e=>set('images',e.target.value)} rows={3}
              placeholder={'https://images.unsplash.com/...\nhttps://images.unsplash.com/...'}
              style={{ ...inputStyle, resize:'vertical' }} />
          </Field>
        </div>
        {/* Amenidades */}
        <div style={{ gridColumn:'1/-1' }}>
          <Field label="Amenidades (separadas por coma)">
            <input value={form.amenities} onChange={e=>set('amenities',e.target.value)}
              placeholder="alberca, jardín, seguridad 24h, estacionamiento" style={inputStyle} />
          </Field>
        </div>
        {/* Descripción */}
        <div style={{ gridColumn:'1/-1' }}>
          <Field label="Descripción">
            <textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={4}
              placeholder="Residencia moderna con acabados de lujo..."
              style={{ ...inputStyle, resize:'vertical' }} />
          </Field>
        </div>
        {/* Featured */}
        <div style={{ gridColumn:'1/-1' }}>
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
            <div onClick={() => set('featured', !form.featured)}
              style={{ width:20, height:20, border:`2px solid ${form.featured?'#0051FF':'#1A1A2E'}`, borderRadius:5, background: form.featured?'#0051FF':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s', cursor:'pointer' }}>
              {form.featured && <IconCheck size={12} />}
            </div>
            <span style={{ color:'#A0A0C0', fontSize:14 }}>Propiedad destacada (aparece en home)</span>
          </label>
        </div>
      </div>

      {error && (
        <div style={{ background:'#2A0A14', border:'1px solid #FF4A6E44', borderRadius:10, padding:'12px 16px', color:'#FF4A6E', fontSize:13, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
          <IconX size={16} /> {error}
        </div>
      )}
      {success && (
        <div style={{ background:'#002A14', border:'1px solid #00E5A044', borderRadius:10, padding:'12px 16px', color:'#00E5A0', fontSize:13, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
          <IconCheck size={16} /> {mode === 'create' ? '¡Propiedad creada!' : '¡Cambios guardados!'} Redirigiendo...
        </div>
      )}

      <div style={{ display:'flex', gap:12 }}>
        <button type="submit" disabled={saving}
          style={{ padding:'13px 28px', background: saving ? '#1A1A2E' : 'linear-gradient(135deg,#0051FF,#7C3AED)', borderRadius:10, color:'#fff', fontWeight:700, fontSize:14, border:'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, display:'flex', alignItems:'center', gap:8 }}>
          {saving ? 'Guardando...' : (mode === 'create' ? '+ Crear propiedad' : 'Guardar cambios')}
        </button>
        <button type="button" onClick={() => router.push('/admin/properties')}
          style={{ padding:'13px 20px', background:'#1A1A2E', borderRadius:10, color:'#A0A0C0', fontWeight:600, fontSize:14, border:'none', cursor:'pointer' }}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
