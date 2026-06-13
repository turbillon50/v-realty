'use client';
import { motion } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import PropertyForm from '../../components/PropertyForm';
import { IconBuilding } from '../../components/Icons';

export default function NewPropertyPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0F', color:'#E8E8F8', display:'flex' }}>
      <Sidebar active="/admin/properties" />
      <main style={{ marginLeft:240, flex:1, padding:'40px', maxWidth:900 }}>
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <IconBuilding size={22} />
            <h1 style={{ fontSize:28, fontWeight:900, letterSpacing:'-0.03em' }}>Nueva propiedad</h1>
          </div>
          <p style={{ color:'#5A5A8A', fontSize:14 }}>Completa los datos para publicar la propiedad</p>
        </motion.div>
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
          style={{ background:'#0D0D14', border:'1px solid #1A1A2E', borderRadius:20, padding:32 }}>
          <PropertyForm mode="create" />
        </motion.div>
      </main>
    </div>
  );
}
