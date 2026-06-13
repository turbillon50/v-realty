'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../../../components/Sidebar';
import PropertyForm from '../../../components/PropertyForm';
import { IconBuilding } from '../../../components/Icons';

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const [prop, setProp] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/properties/${params.id}`).then(r=>r.json()).then(d => setProp(d.property));
  }, [params.id]);

  const toFormData = (p: any) => ({
    title: p.title || '',
    description: p.description || '',
    price: String(p.price || ''),
    price_currency: p.price_currency || 'MXN',
    type: p.type || 'casa',
    operation: p.operation || 'venta',
    status: p.status || 'available',
    area_m2: p.area_m2 ? String(p.area_m2) : '',
    rooms: p.rooms ? String(p.rooms) : '',
    bathrooms: p.bathrooms ? String(p.bathrooms) : '',
    parking: p.parking ? String(p.parking) : '0',
    address: p.address || '',
    city: p.city || '',
    state: p.state || '',
    featured: !!p.featured,
    images: (p.images || []).join('\n'),
    amenities: (p.amenities || []).join(', '),
  });

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0F', color:'#E8E8F8', display:'flex' }}>
      <Sidebar active="/admin/properties" />
      <main style={{ marginLeft:240, flex:1, padding:'40px', maxWidth:900 }}>
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <IconBuilding size={22} />
            <h1 style={{ fontSize:28, fontWeight:900, letterSpacing:'-0.03em' }}>Editar propiedad</h1>
          </div>
          <p style={{ color:'#5A5A8A', fontSize:14 }}>ID #{params.id}</p>
        </motion.div>
        {!prop && <p style={{ color:'#5A5A8A' }}>Cargando...</p>}
        {prop && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
            style={{ background:'#0D0D14', border:'1px solid #1A1A2E', borderRadius:20, padding:32 }}>
            <PropertyForm mode="edit" initial={toFormData(prop)} propertyId={parseInt(params.id)} />
          </motion.div>
        )}
      </main>
    </div>
  );
}
