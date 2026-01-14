    <script type="text/babel">
        const { useState, useEffect, useMemo } = React;

        // --- CONFIG ---
        const firebaseConfig = {
          apiKey: "AIzaSyD1XQbCn5DjBr6mSJ2LyAihW6_pRpcMdLs",
          authDomain: "nini-app-61a6a.firebaseapp.com",
          projectId: "nini-app-61a6a",
          storageBucket: "nini-app-61a6a.firebasestorage.app",
          messagingSenderId: "1019944365082",
          appId: "1:1019944365082:web:3e921a4207a846306235a3"
        };
        const ADMIN_EMAIL = "worlddigital2011@gmail.com";
        const SHEET_ID = "1Yz_Br2J41diPtd-PL8lLE_Q8eQex-Vf7ifkIqdEqQEQ";
        const LINK_HOJA_PRODUCTOS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=LINK_HOJA_PRODUCTOS`; 

        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const db = firebase.firestore();

        const COLORS = {
            blue: '#004aad', red: '#e31d2b', bg: '#f8f9fa',
            bar1: '#93C5FD', bar2: '#60A5FA', gray: '#E5E7EB',
            pie: ['#93C5FD', '#FCA5A5', '#86EFAC', '#FDE047', '#D8B4FE', '#F9A8D4', '#67E8F9']
        };

        // --- ICONOS ---
        const IconBase = ({ children, size=24, className="", ...rest }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>{children}</svg>
        );

        const Icons = {
            Search: (props) => <IconBase {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></IconBase>,
            Trash: (props) => <IconBase {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></IconBase>,
            Plus: (props) => <IconBase {...props}><path d="M5 12h14"/><path d="M12 5v14"/></IconBase>,
            Minus: (props) => <IconBase {...props}><path d="M5 12h14"/></IconBase>,
            Lock: (props) => <IconBase {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></IconBase>,
            Unlock: (props) => <IconBase {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></IconBase>,
            Filter: (props) => <IconBase {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></IconBase>,
            Save: (props) => <IconBase {...props}><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></IconBase>,
            List: (props) => <IconBase {...props}><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></IconBase>,
            PieChart: (props) => <IconBase {...props}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></IconBase>,
            Database: (props) => <IconBase {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></IconBase>,
            Copy: (props) => <IconBase {...props}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></IconBase>,
            X: (props) => <IconBase {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></IconBase>,
            ChevronDown: (props) => <IconBase {...props}><path d="m6 9 6 6 6-6"/></IconBase>,
            ChevronUp: (props) => <IconBase {...props}><path d="m18 15-6-6-6 6"/></IconBase>,
            Download: (props) => <IconBase {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></IconBase>,
            Share: (props) => <IconBase {...props}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></IconBase>,
            User: (props) => <IconBase {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></IconBase>,
            LogOut: (props) => <IconBase {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></IconBase>,
            AlertTriangle: (props) => <IconBase {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></IconBase>,
            Settings: (props) => <IconBase {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></IconBase>,
            RefreshCw: (props) => <IconBase {...props}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></IconBase>,
            Edit: (props) => <IconBase {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></IconBase>,
            Broom: (props) => <IconBase {...props}><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2.5 1.52S4.16 21 7.82 21c1.67 0 3.02-1.35 3.02-3.02v-3.03"/></IconBase>,
            Google: (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
            Help: (props) => <IconBase {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></IconBase>,
            Check: (props) => <IconBase {...props}><polyline points="20 6 9 17 4 12"/></IconBase>
        };

        const INITIAL_PRODUCTS = [];

        class ErrorBoundary extends React.Component {
            constructor(props) { super(props); this.state = { hasError: false, error: null }; this.copyError = this.copyError.bind(this); }
            static getDerivedStateFromError(error) { return { hasError: true, error }; }
            copyError() { navigator.clipboard.writeText(this.state.error?.toString()).then(()=>alert("Copiado al portapapeles.")); }
            render() {
                if (this.state.hasError) return <div className="p-10 text-center"><Icons.AlertTriangle className="mx-auto text-red-500 mb-2"/><h2 className="font-bold">Error</h2><p className="text-xs text-gray-500 mb-4">{this.state.error?.message}</p><button onClick={this.copyError} className="bg-blue-600 text-white px-4 py-2 rounded font-bold mb-2 w-full">COPIAR ERROR</button><button onClick={()=>{localStorage.clear(); window.location.reload()}} className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-bold w-full">REINICIAR</button></div>;
                return this.props.children;
            }
        }

        const AdBanner = () => <div className="bg-white border-b border-gray-100 py-3 px-4 flex justify-center shrink-0"><div className="w-full max-w-sm h-12 bg-gray-100 rounded border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">ESPACIO PUBLICITARIO (ADS)</div></div>;

        // --- COMPONENTES MODALES Y FORMS ---
        const TutorialModal = ({ title, steps, onClose, id }) => {
            const [dontShow, setDontShow] = useState(false);
            const handleClose = () => { if(dontShow) localStorage.setItem(id, 'true'); onClose(); };
            return (
                <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4 fade-in">
                    <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl relative">
                        <button onClick={handleClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"><Icons.X size={24}/></button>
                        <div className="mb-4 text-center"><h3 className="text-xl font-black text-blue-700 mb-1">{title}</h3><div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div></div>
                        <div className="space-y-4 text-sm text-gray-600 mb-6">{steps.map((step, i) => (<div key={i} className="flex gap-3"><div className="font-bold text-blue-600 bg-blue-50 w-6 h-6 flex items-center justify-center rounded-full shrink-0">{i+1}</div><p dangerouslySetInnerHTML={{__html: step}}></p></div>))}</div>
                        <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg cursor-pointer" onClick={()=>setDontShow(!dontShow)}><div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${dontShow ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}>{dontShow && <Icons.Check size={14} className="text-white"/>}</div><span className="text-xs text-gray-500 select-none">No mostrar de nuevo</span></div>
                        <button onClick={handleClose} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition">¡Entendido!</button>
                    </div>
                </div>
            );
        };

        const ProductFormModal = ({ products, productToEdit, onClose, onSave, onDelete }) => {
            const [name, setName] = useState('');
            const [cat, setCat] = useState('');
            const [isNewCat, setIsNewCat] = useState(false);
            const [brand, setBrand] = useState('');
            const [isNewBrand, setIsNewBrand] = useState(false);
            const [price, setPrice] = useState('');
            
            useEffect(() => {
                if (productToEdit) { setName(productToEdit.name); setCat(productToEdit.category); setBrand(productToEdit.brand); setPrice(productToEdit.price); setIsNewCat(false); setIsNewBrand(false); }
            }, [productToEdit]);
            
            const existingCats = useMemo(() => { const cats = new Set(['Almacén', 'Bebidas', 'Limpieza', 'Perfumería', 'Frescos', 'Galletitas', 'Carnicería', 'Verdulería']); products.forEach(p => { if(p.category) cats.add(p.category.trim()) }); return Array.from(cats).sort(); }, [products]);
            const existingBrands = useMemo(() => { if (!cat || isNewCat) return []; const brands = new Set(); products.filter(p => p.category === cat).forEach(p => { if(p.brand) brands.add(p.brand.trim()) }); return Array.from(brands).sort(); }, [products, cat, isNewCat]);

            const handleSubmit = (e) => { e.preventDefault(); const cleanNum = s => parseFloat(String(s).replace(/\./g,'').replace(',','.')) || 0; onSave({ name, category: cat || 'Varios', brand: brand || 'Genérico', price: cleanNum(price) }); };

            return (
                <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
                    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl w-full max-w-xs shadow-2xl space-y-3">
                        <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-lg">{productToEdit ? 'Editar' : 'Nuevo'}</h3><button type="button" onClick={onClose}><Icons.X size={20}/></button></div>
                        <div><label className="text-xs font-bold text-gray-500">Nombre</label><input value={name} onChange={e=>setName(e.target.value)} className="w-full border p-2 rounded" required autoFocus/></div>
                        <div><label className="text-xs font-bold text-gray-500">Rubro</label>{!isNewCat ? (<select value={cat} onChange={e=>{if(e.target.value==='NEW'){setIsNewCat(true);setCat('')}else setCat(e.target.value)}} className="w-full border p-2 rounded bg-white"><option value="" disabled>Seleccionar...</option>{existingCats.map(c=><option key={c} value={c}>{c}</option>)}<option value="NEW">+ Nuevo...</option></select>) : (<div className="flex gap-1"><input value={cat} onChange={e=>setCat(e.target.value)} className="w-full border p-2 rounded" placeholder="Nombre del rubro" required/><button type="button" onClick={()=>setIsNewCat(false)} className="text-red-500 p-2"><Icons.X size={16}/></button></div>)}</div>
                        <div><label className="text-xs font-bold text-gray-500">Marca</label>{!isNewBrand && existingBrands.length > 0 ? (<select value={brand} onChange={e=>{if(e.target.value==='NEW'){setIsNewBrand(true);setBrand('')}else setBrand(e.target.value)}} className="w-full border p-2 rounded bg-white"><option value="">Genérico</option>{existingBrands.map(b=><option key={b} value={b}>{b}</option>)}<option value="NEW">+ Nueva...</option></select>) : (<div className="flex gap-1"><input value={brand} onChange={e=>setBrand(e.target.value)} className="w-full border p-2 rounded" placeholder="Marca" />{existingBrands.length > 0 && <button type="button" onClick={()=>setIsNewBrand(false)} className="text-red-500 p-2"><Icons.X size={16}/></button>}</div>)}</div>
                        <div><label className="text-xs font-bold text-gray-500">Precio</label><input value={price} onChange={e=>setPrice(e.target.value)} type="number" className="w-full border p-2 rounded" placeholder="$0" /></div>
                        <div className="flex gap-2 mt-2">
                             {productToEdit && onDelete && (<button type="button" onClick={() => onDelete(productToEdit.id, productToEdit.isGlobal)} className="flex-1 bg-red-100 text-red-600 font-bold py-3 rounded">Eliminar</button>)}
                             <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded">Guardar</button>
                        </div>
                    </form>
                </div>
            );
        };

        const HistoryView = ({ history, onDelete, onUpdateTotal }) => {
            const [filterDate, setFilterDate] = useState('all');
            const [expandedId, setExpandedId] = useState(null);
            const [showHelp, setShowHelp] = useState(false);

            const availableMonths = useMemo(() => { const unique = new Set(); history.forEach(h => { try{const d = new Date(h.date); if(!isNaN(d)) unique.add(JSON.stringify({ value: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`, label: d.toLocaleString('es-AR', { month: 'long', year: 'numeric' }) })); } catch(e){} }); return Array.from(unique).map(s => JSON.parse(s)).sort((a,b) => b.value.localeCompare(a.value)); }, [history]);
            const pieData = useMemo(() => { const src = filterDate === 'all' ? history : history.filter(h => h.date.startsWith(filterDate)); const map = {}; let tot = 0; src.forEach(h => { if(h.items) h.items.forEach(i => { const sub = (i.actualQty||0)*(i.price||0); map[i.category] = (map[i.category] || 0) + sub; tot += sub; }); }); return Object.entries(map).map(([k,v]) => ({name:k, value:v, percent: tot ? (v/tot)*100 : 0})).sort((a,b)=>b.value-a.value); }, [history, filterDate]);
            const monthlyData = useMemo(() => { const months = Array.from({length: 12}, (_, i) => ({ label: new Date(2024, i, 1).toLocaleString('es-AR', { month: 'short' }).toUpperCase(), total: 0 })); history.forEach(h => { const d = new Date(h.date); if(!isNaN(d)) months[d.getMonth()].total += h.total; }); return months; }, [history]);
            const maxMonthly = Math.max(...monthlyData.map(d => d.total), 1);
            const totalAnnual = monthlyData.reduce((acc, curr) => acc + curr.total, 0);
            const pieGradient = pieData.length > 0 ? pieData.reduce((acc, cat, idx) => { const prev = pieData.slice(0, idx).reduce((p, c) => p + c.percent, 0); const color = COLORS.pie[idx % COLORS.pie.length]; return `${acc}, ${color} ${prev}% ${prev + cat.percent}%`; }, '').slice(2) : '#eee 0% 100%';

            const handleEditTotal = (e, h) => {
                e.stopPropagation();
                const newTotal = prompt("Ingresa el monto final pagado en caja:", h.total);
                if (newTotal !== null && !isNaN(newTotal)) {
                    onUpdateTotal(h.id, parseFloat(newTotal));
                }
            };

            return (
                <div className="p-4 space-y-6 pb-24">
                     <div className="flex items-center gap-2 mb-2">
                        <h2 className="font-bold text-lg text-gray-700">Historial de Compras</h2>
                        <button onClick={()=>setShowHelp(true)} className="text-gray-400 hover:text-blue-500"><Icons.Help size={18}/></button>
                    </div>

                    {showHelp && <TutorialModal 
                        id="nini_help_history_v1"
                        title="Historial y Precios 🏷️"
                        steps={[
                            "Aquí verás todas tus compras guardadas.",
                            "Si el total en caja fue distinto (por promociones), tocá el <strong>Lápiz ✏️</strong> al lado del precio para corregirlo.",
                            "Si el precio real es menor al calculado, verás una etiqueta verde de <strong>Promo</strong>."
                        ]}
                        onClose={()=>setShowHelp(false)}
                    />}

                    <div className="bg-white rounded-xl shadow border p-4">
                        <div className="flex justify-between mb-4"><h3 className="font-bold text-gray-700 flex gap-2 text-blue-600"><Icons.PieChart size={18} className="text-blue-500"/> Gasto Rubro</h3><div className="relative"><select onChange={e=>setFilterDate(e.target.value)} className="text-xs border rounded bg-gray-50"><option value="all">Todo el Año</option>{availableMonths.map(m=><option key={m.value} value={m.value}>{m.label}</option>)}</select></div></div>
                        <div className="flex items-center gap-4"><div className="w-32 h-32 rounded-full flex items-center justify-center flex-col shadow-inner" style={{background: `conic-gradient(${pieGradient})`}}><div className="bg-white w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-sm"><span className="text-[9px] text-gray-400">TOTAL</span><span className="text-xs font-bold">${Math.round(pieData.reduce((a,b)=>a+b.value,0)).toLocaleString('es-AR')}</span></div></div><div className="flex-1 space-y-1">{pieData.slice(0,5).map((c,i)=>(<div key={i} className="flex justify-between text-xs"><span>{c.name}</span><span className="font-bold">{Math.round(c.percent)}%</span></div>))}</div></div>
                    </div>
                    <div className="bg-white rounded-xl shadow border p-4">
                        <div className="flex justify-between mb-4"><h3 className="font-bold text-gray-700">Anual</h3><span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded">${totalAnnual.toLocaleString('es-AR')}</span></div>
                        <div className="flex items-end gap-1 h-32 border-b pb-2">
                             <div className="w-full md:max-w-md md:mx-auto flex items-end gap-1 h-full">
                                {monthlyData.map((d,i)=>(<div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group"><div className="w-full relative flex items-end justify-center h-full"><div className="w-full rounded-t-sm transition-all bg-gray-100" style={{height: '100%'}}><div className="w-full rounded-t-sm transition-all absolute bottom-0" style={{height: d.total>0?`${(d.total/maxMonthly)*100}%`:'4px', background: d.total>0?(i%2===0?COLORS.bar1:COLORS.bar2):'transparent'}}></div></div>{d.total > 0 && <div className="absolute -top-6 bg-black text-white text-[9px] px-1 rounded opacity-0 group-hover:opacity-100">${d.total.toLocaleString('es-AR')}</div>}</div><span className="text-[8px] font-bold text-gray-500">{d.label}</span></div>))}
                             </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow border overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b font-bold text-xs text-gray-500">REGISTROS</div>
                        {history.map(h => {
                            const calculatedTotal = (h.items||[]).reduce((sum, i) => sum + (i.price * i.actualQty), 0);
                            const isPromo = h.total < calculatedTotal;
                            const diff = calculatedTotal - h.total;
                            
                            return (
                                <div key={h.id} className="border-b last:border-0">
                                    <div onClick={()=>setExpandedId(expandedId===h.id?null:h.id)} className="px-4 py-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                                        <div>
                                            <div className="font-bold text-sm">{new Date(h.date).toLocaleDateString('es-AR')}</div>
                                            <div className="text-xs text-gray-400">{(h.items||[]).length} items</div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-blue-600 text-lg">${h.total.toLocaleString('es-AR')}</span>
                                                <button onClick={(e)=>handleEditTotal(e, h)} className="text-gray-300 hover:text-blue-500"><Icons.Edit size={14}/></button>
                                                <button onClick={(e) => { e.stopPropagation(); onDelete(h.id); }} className="p-1 text-gray-300 hover:text-red-500"><Icons.Trash size={14}/></button>
                                                <Icons.ChevronDown size={16}/>
                                            </div>
                                            {isPromo && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded font-bold">🏷️ Promo: -${diff.toLocaleString('es-AR')}</span>}
                                            {h.total !== calculatedTotal && !isPromo && <span className="text-[10px] text-gray-400 line-through">${calculatedTotal.toLocaleString('es-AR')}</span>}
                                        </div>
                                    </div>
                                    {expandedId === h.id && <div className="bg-gray-50 p-3 text-xs border-t">{(h.items||[]).map((i,x)=><div key={x} className="flex justify-between mb-1 pb-1 border-b border-dashed last:border-0 pb-1"><span>{i.actualQty}x {i.name}</span><span>${i.price}</span></div>)}</div>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        };

        function App() {
            const [user, setUser] = useState(null);
            const [view, setView] = useState('login'); 
            const [products, setProducts] = useState(INITIAL_PRODUCTS);
            const [globalProducts, setGlobalProducts] = useState([]);
            const [userProducts, setUserProducts] = useState([]);
            const [history, setHistory] = useState([]);
            const [loading, setLoading] = useState(true);
            const [statusMsg, setStatusMsg] = useState('');
            const [showSettings, setShowSettings] = useState(false);
            const [isDemo, setIsDemo] = useState(false);
            const [isLoggingIn, setIsLoggingIn] = useState(false);
            
            // Share
            const [viewTargetUid, setViewTargetUid] = useState(null); 
            const [myShareCode, setMyShareCode] = useState(null);
            const [incomingRequests, setIncomingRequests] = useState([]);
            const [connectCode, setConnectCode] = useState('');
            const [following, setFollowing] = useState([]);

            const [filter, setFilter] = useState('Todos'); 
            const [brandFilter, setBrandFilter] = useState('Todas');
            const [showBrandFilter, setShowBrandFilter] = useState(false);
            const [searchTerm, setSearchTerm] = useState('');
            const [isLocked, setIsLocked] = useState(() => localStorage.getItem('nini_is_locked') === 'true');
            const [showProductModal, setShowProductModal] = useState(false);
            const [productToEdit, setProductToEdit] = useState(null);
            const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
            const [showHistoryDeleteConfirm, setShowHistoryDeleteConfirm] = useState(null);
            const [deferredPrompt, setDeferredPrompt] = useState(null);
            const [showInstallModal, setShowInstallModal] = useState(false);
            const [showExportModal, setShowExportModal] = useState(false);
            const [exportContent, setExportContent] = useState('');

            // Tutorials
            const [showMainHelp, setShowMainHelp] = useState(false);
            const [showSharedHelp, setShowSharedHelp] = useState(false);

            const isAdmin = user && user.email === ADMIN_EMAIL;
            const isReadOnly = !!viewTargetUid && viewTargetUid !== user?.uid;

            useEffect(() => {
                const unsub = auth.onAuthStateChanged(u => {
                    setUser(u); setLoading(false);
                    if(u) {
                        setView('list'); setViewTargetUid(u.uid);
                        if(u.uid && u.uid.length>6) {
                            const code = u.uid.slice(0,6).toUpperCase();
                            setMyShareCode(code);
                            db.collection('public_codes').doc(code).set({ uid: u.uid, name: u.displayName || 'Anon' });
                        }
                        // Check Tutorial Main
                        if(!localStorage.getItem('nini_help_main')) setShowMainHelp(true);
                    } else { setView('login'); }
                });
                return () => unsub();
            }, []);

            useEffect(() => {
                if(!user || isDemo) return;
                const targetUid = viewTargetUid || user.uid;
                const unsubGlobal = db.collection('global_products').onSnapshot(snap => setGlobalProducts(snap.docs.map(d => ({id: d.id, ...d.data(), isGlobal: true}))));
                const unsubUserProd = db.collection(`users/${targetUid}/products`).onSnapshot(snap => setUserProducts(snap.docs.map(d => ({id: d.id, ...d.data(), isGlobal: false}))));
                const unsubCart = db.collection(`users/${targetUid}/cart`).doc('main').onSnapshot(snap => { if(snap.exists) setCart(snap.data()); else setCart({}); });
                const unsubHist = db.collection(`users/${targetUid}/history`).orderBy("date", "desc").onSnapshot(snap => setHistory(snap.docs.map(d => ({id: d.id, ...d.data()}))));
                let unsubReq = () => {};
                let unsubFollow = () => {};
                if (targetUid === user.uid) {
                    unsubReq = db.collection(`users/${user.uid}/requests`).where("status", "==", "pending").onSnapshot(snap => { setIncomingRequests(snap.docs.map(d => ({id: d.id, ...d.data()}))); });
                    unsubFollow = db.collection(`users/${user.uid}/following`).onSnapshot(snap => { setFollowing(snap.docs.map(d => ({uid: d.id, ...d.data()}))); });
                }
                return () => { unsubGlobal(); unsubUserProd(); unsubCart(); unsubHist(); unsubReq(); unsubFollow(); };
            }, [user, viewTargetUid]);

            const [cart, setCart] = useState({});
            const productsWithCart = useMemo(() => {
                const allProds = [...globalProducts, ...userProducts];
                return allProds.map(p => {
                    const c = cart[p.id] || {};
                    return { ...p, plannedQty: c.p || 0, actualQty: c.a || 0 };
                }).sort((a,b) => (a.name||'').localeCompare(b.name||''));
            }, [globalProducts, userProducts, cart]);

            useEffect(() => localStorage.setItem('nini_is_locked', isLocked), [isLocked]);
            useEffect(() => { window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); setDeferredPrompt(e); }); }, []);

            const sendRequest = async () => { /* ... */ };
            const acceptRequest = async (reqId, requesterUid) => {
                await db.collection(`users/${user.uid}/allowed_viewers`).doc(requesterUid).set({ active: true });
                await db.collection(`users/${user.uid}/requests`).doc(reqId).update({ status: "accepted" });
            };
            const switchToFriend = (uid) => { setViewTargetUid(uid); setView('list'); };
            const viewMyList = () => setViewTargetUid(user.uid);
            const handleLogin = async () => {
                if(isLoggingIn) return; setIsLoggingIn(true);
                try { await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); } 
                catch(e) { alert("Error: "+e.message); enableDemo(); } finally { setIsLoggingIn(false); }
            };
            const handleAnon = async () => { try { await auth.signInAnonymously(); } catch(e) { alert(e.message); } };
            const handleLogout = () => auth.signOut().then(()=>window.location.reload());
            const enableDemo = () => { setIsDemo(true); setUser({ uid: 'demo', displayName: 'Invitado' }); setLoading(false); setView('list'); setGlobalProducts([]); };
            const handleSaveProduct = (item) => {
                if(isAdmin) {
                    if(productToEdit) db.collection('global_products').doc(productToEdit.id).update(item);
                    else db.collection('global_products').add(item);
                } else {
                    db.collection(`users/${user.uid}/products`).add(item);
                }
                setShowProductModal(false); setProductToEdit(null);
            };
            const handleDeleteProduct = (id, isGlobal) => {
                if(isAdmin && isGlobal) db.collection('global_products').doc(id).delete();
                else if (!isGlobal) db.collection(`users/${user.uid}/products`).doc(id).delete();
                setShowDeleteConfirm(null);
            };
            const onDeleteFromModal = (id, isGlobal) => { setShowProductModal(false); setShowDeleteConfirm({id, isGlobal}); };
            const handleAdminCleanDuplicates = async () => { /* ... */ };
            const handleAdminImport = async () => { /* ... */ };
            const cleanDB = async () => { /* ... */ };
            const handleQty = (id, delta, type) => {
                if(isReadOnly) return;
                const current = cart[id] || {p:0, a:0};
                const val = Math.max(0, (type==='p'?current.p:current.a) + delta);
                db.collection(`users/${user.uid}/cart`).doc('main').set({ [id]: { p: type==='p'?val:current.p||0, a: type==='a'?val:current.a||0 } }, {merge:true});
            };
            const handleQtyWrapper = (id, delta, type) => handleQty(id, delta, type);
            const handleResetPlan = async () => {
                if(!confirm("¿Resetear?")) return;
                const newC = {...cart}; Object.keys(newC).forEach(k => newC[k].p = 0);
                db.collection(`users/${user.uid}/cart`).doc('main').set(newC);
                setShowSettings(false);
            };
            const finishPurchase = async () => {
                const bought = productsWithCart.filter(p=>p.actualQty>0);
                if(bought.length===0) return alert("Vacío");
                if(!confirm("¿Finalizar?")) return;
                if(user && !isDemo && !isReadOnly) {
                   await db.collection(`users/${user.uid}/history`).add({
                        date: new Date().toISOString(),
                        total: bought.reduce((a,b)=>a+(b.price*b.actualQty),0),
                        items: bought.map(i=>({name:i.name, brand:i.brand, category:i.category, price:i.price, actualQty:i.actualQty}))
                    });
                    const newC = {...cart}; bought.forEach(p => { if(newC[p.id]) newC[p.id].a = 0; });
                    await db.collection(`users/${user.uid}/cart`).doc('main').set(newC);
                }
                setView('history');
            };
            
            const handleHistoryUpdate = (id, newTotal) => {
                db.collection(`users/${viewTargetUid}/history`).doc(id).update({ total: newTotal });
            };

            const openAddModal = () => { setProductToEdit(null); setShowProductModal(true); };
            const openEditModal = (p) => { setProductToEdit(p); setShowProductModal(true); };
            const handleInstallClick = () => { if(deferredPrompt) deferredPrompt.prompt(); else setShowInstallModal(true); };
            const copyShareCode = () => navigator.clipboard.writeText(myShareCode).then(()=>alert("Copiado"));
            const copyToClip = () => { const el = document.getElementById('exportarea'); el.select(); document.execCommand('copy'); alert("Copiado."); };
            
            const handleDeleteHistory = (id) => {
                db.collection(`users/${viewTargetUid}/history`).doc(id).delete();
                setShowHistoryDeleteConfirm(null);
            };

            const resetHelp = () => {
                localStorage.removeItem('nini_help_main');
                localStorage.removeItem('nini_help_shared');
                localStorage.removeItem('nini_help_history_v1');
                setShowMainHelp(true);
                setShowSettings(false);
            }

            const changeView = (v) => {
                setView(v);
                if(v === 'shared' && !localStorage.getItem('nini_help_shared')) setShowSharedHelp(true);
            }

            if(loading) return <div className="h-screen flex flex-col items-center justify-center text-blue-600 font-bold gap-4"><div className="loader"></div>Cargando...</div>;
            if(!user) return (
                <div className="h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col items-center justify-center p-8 text-white text-center">
                    <img src="https://i.imgur.com/23tlEnQ.jpeg" className="w-40 rounded-3xl shadow-xl mb-8"/>
                    <button onClick={handleLogin} disabled={isLoggingIn} className={`bg-white text-gray-800 w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-3 active:scale-95 transition ${isLoggingIn?'opacity-70':''}`}><Icons.Google size={24}/> {isLoggingIn ? 'Iniciando...' : 'Continuar con Google'}</button>
                    <button onClick={handleAnon} disabled={isLoggingIn} className="mt-4 text-sm text-blue-300 underline hover:text-white">Invitado</button>
                </div>
            );

            // COMPUTED VARS
            const cats = ['Todos', ...new Set(productsWithCart.map(p => p.category || 'Varios'))].sort();
            const brands = ['Todas', ...new Set(productsWithCart.filter(p => filter === 'Todos' || p.category === filter).map(p => p.brand || 'Genérico'))].sort();
            const filtered = productsWithCart.filter(p => (filter === 'Todos' || p.category === filter) && (brandFilter === 'Todas' || p.brand === brandFilter) && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
            const totalPlan = productsWithCart.reduce((a,b)=>a+(b.price*(b.plannedQty||0)),0);
            const totalCart = productsWithCart.reduce((a,b)=>a+(b.price*(b.actualQty||0)),0);

            return (
                <div className="flex flex-col h-full bg-gray-50 font-sans overflow-hidden">
                    <div className="flex-none bg-white shadow-md z-50">
                        <div className="flex justify-between items-center px-4 py-2 border-b">
                            <div className="h-14 w-40 overflow-hidden flex items-center -ml-3"><img src="https://i.imgur.com/23tlEnQ.jpeg" className="h-full w-full object-contain scale-[1.8]" /></div>
                            <div className="flex flex-col items-center justify-center">
                                <div className={`text-[10px] font-bold flex flex-col items-center ${isReadOnly ? 'text-orange-600' : 'text-blue-800'}`}><span>Hola, {user?.displayName ? user.displayName.split(' ')[0] : 'Invitado'} 👋</span></div>
                            </div>
                            <div className="flex gap-2 items-center">
                                {view === 'list' && <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-gray-50 rounded-lg p-1 px-3 border shadow-sm">
                                        <div className="flex flex-col items-end mr-3">
                                            <span className="text-[9px] text-orange-600 font-bold uppercase">Plan</span>
                                            <span className="text-sm font-medium text-orange-800">${totalPlan.toLocaleString('es-AR')}</span>
                                        </div>
                                        <div className="w-px h-6 bg-gray-300"></div>
                                        <div className="flex flex-col items-end ml-3">
                                            <span className="text-[10px] text-blue-600 font-black uppercase">Carrito</span>
                                            <span className="text-2xl font-black text-blue-900 leading-none">${totalCart.toLocaleString('es-AR')}</span>
                                        </div>
                                    </div>
                                    <button onClick={finishPurchase} disabled={isReadOnly} className={`text-white p-2 rounded-full shadow active:scale-95 ${isReadOnly?'bg-gray-400':'bg-blue-600'}`}><Icons.Save size={18}/></button>
                                </div>}
                                {view === 'shared' && <div className="text-xs font-bold text-orange-600 flex items-center gap-1 bg-orange-50 px-3 py-1 rounded border border-orange-100"><Icons.User size={14}/> Compartido</div>}
                                {view === 'history' && <div className="text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 px-3 py-1 rounded border border-green-100"><Icons.Database size={14}/> En Línea</div>}
                                {view === 'list' && !isReadOnly && <button onClick={()=>setShowSettings(true)} className="p-2 text-gray-400 hover:text-gray-600"><Icons.Settings size={20}/></button>}
                            </div>
                        </div>

                        {view === 'list' && (
                            <div className="bg-white p-3 border-b flex flex-col gap-3">
                                {isReadOnly && <div className="bg-orange-100 p-2 text-center text-xs text-orange-800 font-bold flex justify-between items-center px-4 rounded mb-2"><span>Modo Espejo (Solo Lectura)</span><button onClick={()=>setViewTargetUid(user.uid)} className="underline">Salir</button></div>}
                                <div className="flex gap-2">
                                    <button onClick={()=>setIsLocked(!isLocked)} className={`w-10 h-10 flex items-center justify-center rounded-lg border ${isLocked?'bg-orange-50 text-orange-600':'bg-gray-50 text-gray-400'}`}>{isLocked?<Icons.Lock size={18}/>:<Icons.Unlock size={18}/>}</button>
                                    <div className="relative flex-1"><span className="absolute left-3 top-2 text-gray-400"><Icons.Search size={16}/></span><input className="w-full h-10 pl-9 pr-3 rounded-lg border bg-gray-50 focus:bg-white outline-none text-sm" placeholder="Buscar..." onChange={e=>setSearchTerm(e.target.value)}/></div>
                                    {!isReadOnly && <button onClick={openAddModal} className="bg-blue-600 text-white w-10 rounded flex items-center justify-center shadow"><Icons.Plus size={18}/></button>}
                                    <button onClick={()=>setShowBrandFilter(!showBrandFilter)} className={`w-10 h-10 rounded-lg border flex items-center justify-center ${showBrandFilter?'bg-blue-100':'bg-white'}`}><Icons.Filter size={18}/></button>
                                    <button onClick={()=>{if(!isReadOnly && confirm('Limpiar cantidades?')) productsWithCart.forEach(p=>p.actualQty>0 && handleQty(p.id, -p.actualQty, 'a'))}} className={`w-10 h-10 flex items-center justify-center ${isReadOnly?'text-gray-200':'text-gray-400 hover:text-red-500'}`}><Icons.Trash size={18}/></button>
                                </div>
                                {showBrandFilter && <div className="px-3 py-2 bg-blue-50 border-b"><select onChange={e=>setBrandFilter(e.target.value)} className="w-full p-2 text-sm border rounded"><option value="Todas">Todas las marcas</option>{brands.map(b=><option key={b} value={b}>{b}</option>)}</select></div>}
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">{cats.map(c=><button key={c} onClick={()=>setFilter(c)} className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter===c?'bg-blue-600 text-white':'bg-gray-100 text-gray-600'}`}>{c}</button>)}</div>
                                <div className="flex text-[10px] font-bold px-3 py-1 border-t uppercase tracking-wider shadow-sm">
                                    <div className="flex-1 text-gray-400">Producto</div>
                                    <div className="w-16 text-center text-orange-600 bg-orange-50 rounded-t px-1">Plan</div>
                                    <div className="w-28 text-center text-blue-600 bg-blue-50 rounded-t px-1 ml-2">Carrito</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SCROLLABLE LIST */}
                    <div className="flex-1 overflow-y-auto pb-20 bg-white overscroll-contain">
                        {view === 'list' ? (
                            <div className="pb-4 pt-2">
                                {filtered.map(p => (
                                    <div key={p.id} className={`flex items-center px-4 py-4 border-b transition-colors ${p.actualQty>0?'bg-green-50':'bg-white'}`}>
                                        <div className="flex-1 min-w-0 pr-2">
                                            <div className="flex items-center justify-between">
                                                <div className="font-bold text-gray-800 text-lg truncate">{p.name}</div>
                                                {!isLocked && (isAdmin && p.isGlobal || !p.isGlobal) && !isReadOnly && <div className="flex gap-1"><button onClick={()=>openEditModal(p)} className="text-gray-300 hover:text-blue-500"><Icons.Edit size={14}/></button><button onClick={()=>setShowDeleteConfirm({id:p.id, isGlobal:p.isGlobal})} className="text-gray-300 hover:text-red-500"><Icons.X size={14}/></button></div>}
                                                {!isLocked && !p.isGlobal && !isReadOnly && <button onClick={()=>handleDeleteProduct(p.id, false)} className="text-gray-300 hover:text-red-500"><Icons.X size={14}/></button>}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">{p.brand} • {p.category}</div>
                                            <div className="flex items-center mt-1"><span className="text-sm text-gray-400 mr-1">$</span><span className="font-bold text-gray-700 w-20">{p.price}</span></div>
                                        </div>
                                        {/* COLUMNA PLAN */}
                                        <div className={`w-16 flex items-center justify-center border-x border-orange-100 bg-orange-50 px-1 ${isLocked?'opacity-40':''}`}>
                                            {!isReadOnly && <button onClick={()=>{const n=Math.max(0,(p.plannedQty||0)-1); handleQty(p.id, -1, 'p')}} className="px-1 text-orange-400"><Icons.Minus size={12}/></button>}
                                            <span className="font-bold text-orange-800 w-6 text-center text-lg">{p.plannedQty}</span>
                                            {!isReadOnly && <button onClick={()=>{const n=(p.plannedQty||0)+1; handleQty(p.id, 1, 'p')}} className="px-1 text-orange-400"><Icons.Plus size={12}/></button>}
                                        </div>
                                        {/* COLUMNA CARRITO */}
                                        <div className="w-28 flex items-center justify-between pl-3 bg-blue-50 rounded-l-lg ml-2 py-1">
                                            {!isReadOnly && <button onClick={()=>{const n=Math.max(0,(p.actualQty||0)-1); handleQty(p.id, -1, 'a')}} className="w-10 h-10 bg-white border border-blue-200 rounded shadow-sm flex items-center justify-center text-blue-600"><Icons.Minus size={18}/></button>}
                                            <span className={`text-xl font-bold ${p.actualQty>0?'text-blue-800':'text-blue-300'}`}>{p.actualQty}</span>
                                            {!isReadOnly && <button onClick={()=>{const n=(p.actualQty||0)+1; handleQty(p.id, 1, 'a')}} className="w-10 h-10 bg-blue-600 text-white rounded shadow-md flex items-center justify-center active:scale-95"><Icons.Plus size={18}/></button>}
                                        </div>
                                    </div>
                                ))}
                                {filtered.length===0 && isAdmin && <div className="flex flex-col items-center justify-center p-10"><p className="text-gray-400 mb-4">Góndola vacía</p><button onClick={handleAdminImport} className="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg animate-bounce">📥 Llenar Góndola Ahora</button></div>}
                                {filtered.length===0 && !isAdmin && <div className="p-10 text-center text-gray-400">Sin productos.</div>}
                            </div>
                        ) : view === 'shared' ? (
                             <div className="p-6 text-center space-y-6">
                                <h3 className="text-xl font-bold text-gray-800">Modo Compartido</h3>
                                <div className="bg-gray-100 p-4 rounded text-center"><div className="text-xs uppercase text-gray-500 font-bold mb-1">Tu Código</div><div className="text-3xl font-black text-blue-600 tracking-widest">{myShareCode}</div><button onClick={copyShareCode} className="mt-2 text-blue-600 text-xs font-bold flex items-center justify-center gap-1"><Icons.Copy size={12}/> Copiar</button></div>
                                <div className="border-t pt-4"><p className="text-sm font-bold text-gray-700 mb-2">Ver lista de otro:</p><div className="flex gap-2"><input value={connectCode} onChange={e=>setConnectCode(e.target.value)} placeholder="Ingresa código..." className="flex-1 border p-3 rounded uppercase text-center font-bold tracking-wider" maxLength={6}/><button onClick={sendRequest} className="bg-blue-600 text-white px-4 font-bold rounded">PEDIR</button></div></div>
                                {incomingRequests.map(req=><div key={req.id} className="flex justify-between items-center bg-white p-2 rounded border"><span className="text-xs font-bold">{req.fromName}</span><button onClick={()=>acceptRequest(req.id, req.fromUid)} className="bg-green-500 text-white text-[10px] px-3 py-1 rounded font-bold">Aceptar</button></div>)}
                                <div className="text-left"><p className="text-sm font-bold text-gray-700 mb-2">Mis Amigos:</p>{following.map(f => (<div key={f.uid} className="flex justify-between items-center bg-blue-50 p-3 rounded mb-2 border border-blue-100"><div><p className="text-sm font-bold text-blue-800">{f.name || 'Usuario'}</p><p className="text-xs text-blue-400">ID: {f.uid.slice(0,4)}</p></div><button onClick={()=>switchToFriend(f.uid)} className="bg-blue-600 text-white text-xs px-3 py-2 rounded font-bold shadow">Ver Lista</button></div>))}</div>
                             </div>
                        ) : (
                            <HistoryView history={history} onDelete={(id) => setShowHistoryDeleteConfirm(id)} onUpdateTotal={handleHistoryUpdate} />
                        )}

                        <footer className="app-footer">
                             by MöLDEA.STUDIO
                        </footer>
                    </div>

                    {showMainHelp && <TutorialModal 
                        id="nini_help_main_v1"
                        title="¡Bienvenido a Nini Cloud!" 
                        steps={[
                            "<strong>1. Plan (Casa):</strong> Agregá lo que te falta en la columna <span class='text-orange-600'>naranja</span>. Usá el candado 🔒 para bloquear y no borrar sin querer.",
                            "<strong>2. Carrito (Súper):</strong> Al comprar, pasá del Plan al Carrito (<span class='text-blue-600'>Azul</span>). Se suma el total arriba.",
                            "<strong>3. Guardar:</strong> Al terminar, tocá el disquete 💾 para guardar la compra en el Historial."
                        ]} 
                        onClose={()=>setShowMainHelp(false)} 
                    />}

                    {showSharedHelp && <TutorialModal 
                        id="nini_help_shared_v1"
                        title="Modo Compartido 👥" 
                        steps={[
                            "Comparte tu <strong>código</strong> con tu pareja o familia.",
                            "Ellos podrán ver tu lista en tiempo real para saber qué falta.",
                            "<strong>Importante:</strong> Los invitados solo pueden VER, no editar."
                        ]} 
                        onClose={()=>setShowSharedHelp(false)} 
                    />}

                    {showProductModal && <ProductFormModal products={productsWithCart} productToEdit={productToEdit} onClose={()=>setShowProductModal(false)} onSave={handleSaveProduct} onDelete={onDeleteFromModal} />}
                    {showDeleteConfirm && <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-6"><div className="bg-white rounded-xl p-6 max-w-xs text-center shadow-2xl border-t-4 border-red-500"><Icons.AlertTriangle size={40} className="mx-auto text-red-500 mb-4"/><h3 className="font-bold text-lg text-gray-800 mb-2">¿Eliminar Producto?</h3><p className="text-sm text-gray-600 mb-6">Esta acción borrará el producto de la Base de Datos General permanentemente.</p><div className="flex gap-3"><button onClick={()=>setShowDeleteConfirm(null)} className="flex-1 py-2 border rounded font-bold text-gray-600">Cancelar</button><button onClick={()=>handleDeleteProduct(showDeleteConfirm.id, showDeleteConfirm.isGlobal)} className="flex-1 py-2 bg-red-600 text-white rounded font-bold shadow">ELIMINAR</button></div></div></div>}
                    {showHistoryDeleteConfirm && <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-6"><div className="bg-white rounded-xl p-6 max-w-xs text-center shadow-2xl border-t-4 border-red-500"><Icons.AlertTriangle size={40} className="mx-auto text-red-500 mb-4"/><h3 className="font-bold text-lg text-gray-800 mb-2">¿Borrar Historial?</h3><p className="text-sm text-gray-600 mb-6">Se eliminará este registro de compra.</p><div className="flex gap-3"><button onClick={()=>setShowHistoryDeleteConfirm(null)} className="flex-1 py-2 border rounded font-bold text-gray-600">Cancelar</button><button onClick={()=>handleDeleteHistory(showHistoryDeleteConfirm)} className="flex-1 py-2 bg-red-600 text-white rounded font-bold shadow">BORRAR</button></div></div></div>}
                    {showSettings && <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-sm p-5 space-y-3"><div className="flex justify-between mb-4"><h3 className="font-bold">Ajustes</h3><button onClick={()=>setShowSettings(false)}><Icons.X size={20}/></button></div><div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">ID: {user.uid}</div>{isAdmin && <button onClick={handleAdminImport} className="w-full py-3 bg-green-600 text-white rounded font-bold flex justify-center gap-2 mb-2"><Icons.Download size={18}/> Llenar Góndola (Sheet)</button>}{isAdmin && <button onClick={handleAdminCleanDuplicates} className="w-full py-3 border border-orange-200 text-orange-600 rounded font-bold flex justify-center gap-2 mb-2"><Icons.Broom size={18}/> Limpiar Duplicados</button>}<button onClick={handleResetPlan} className="w-full py-3 border border-orange-200 text-orange-600 rounded font-bold flex justify-center gap-2 mb-2"><Icons.List size={18}/> Reset Plan</button><button onClick={cleanDB} className="w-full py-3 border text-red-600 font-bold flex justify-center gap-2"><Icons.Trash size={18}/> Resetear Cuenta</button><button onClick={resetHelp} className="w-full py-3 bg-blue-50 text-blue-700 font-bold rounded flex justify-center gap-2 mb-2">❓ Ver Ayuda / Tutorial</button><button onClick={handleLogout} className="w-full py-3 border font-bold flex justify-center gap-2"><Icons.LogOut size={18}/> Salir</button></div></div>}
                    {showInstallModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 animate-fade-in" onClick={() => setShowInstallModal(false)}><div className="bg-white rounded-xl p-6 max-w-sm text-center shadow-2xl relative" onClick={e => e.stopPropagation()}><button onClick={() => setShowInstallModal(false)} className="absolute top-2 right-2 text-gray-400"><Icons.X size={20}/></button><h3 className="text-lg font-bold text-gray-800 mb-2">Instalar Nini App</h3><p className="text-sm text-gray-600 mb-4">Para instalar: menú del navegador > Agregar a inicio</p></div></div>}
                    {showExportModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[80vh]"><div className="p-4 border-b flex justify-between"><h3 className="font-bold">Copiar al Excel</h3><button onClick={() => setShowExportModal(false)}><Icons.X size={20}/></button></div><div className="p-4 flex-1 bg-gray-50"><textarea id="exportarea" readOnly value={exportContent} className="w-full h-32 p-2 text-xs border rounded mb-2" onClick={e => e.target.select()} /><button onClick={copyToClip} className="w-full py-2 bg-green-600 text-white font-bold rounded">COPIAR AHORA</button></div><div className="p-4 border-t"><button onClick={() => { setProducts(prev => prev.map(p => ({...p, actualQty:0}))); setShowExportModal(false); }} className="w-full py-2 text-blue-600 font-bold border border-blue-600 rounded">Limpiar Carrito</button></div></div></div>}

                    {/* 3. FOOTER (FIJO) */}
                    <div className="flex-none bg-blue-700 shadow-lg text-white z-50">
                        <div className="flex justify-around items-center h-16">
                            <button onClick={() => { changeView('list'); setViewTargetUid(user?.uid); }} className={`flex flex-col items-center justify-center w-full h-full ${view === 'list' && !isReadOnly ? 'text-white' : 'text-white/50'}`}><Icons.List size={24} strokeWidth={2.5} /><span className="text-[10px] font-bold mt-1">Lista</span></button>
                            <button onClick={() => changeView('shared')} className={`flex flex-col items-center justify-center w-full h-full ${view === 'shared' ? 'text-white' : 'text-white/50'}`}><Icons.User size={24} strokeWidth={2.5} /><span className="text-[10px] font-bold mt-1">Compartido</span></button>
                            <button onClick={() => changeView('history')} className={`flex flex-col items-center justify-center w-full h-full ${view === 'history' ? 'text-white' : 'text-white/50'}`}><Icons.PieChart size={24} strokeWidth={2.5} /><span className="text-[10px] font-bold mt-1">Historial</span></button>
                        </div>
                    </div>

                    {statusMsg && <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50">{statusMsg}</div>}
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<ErrorBoundary><App /></ErrorBoundary>);
    </script>
