const BASE_URL = 'https://iza-y-cas-production.up.railway.app';

async function testBackend() {
  console.log('🧪 Probando backend...\n');
  
  try {
    // 1. Health check
    console.log('1️⃣ Health check...');
    const health = await fetch(`${BASE_URL}/api/health`);
    console.log('✅ Health:', await health.json());
    
    // 2. Categorías
    console.log('\n2️⃣ Obteniendo categorías...');
    const categories = await fetch(`${BASE_URL}/api/categories`);
    const cats = await categories.json();
    console.log('✅ Categorías encontradas:', cats.length);
    cats.forEach(cat => console.log(`   - ${cat.name} (${cat._count.products} productos)`));
    
    // 3. Productos
    console.log('\n3️⃣ Obteniendo productos...');
    const products = await fetch(`${BASE_URL}/api/products`);
    const prods = await products.json();
    console.log('✅ Productos encontrados:', prods.length);
    
    if (prods.length === 0) {
      console.log('\n⚠️  NO HAY PRODUCTOS - Necesitas cargarlos a la base de datos');
    } else {
      console.log('\nPrimeros 3 productos:');
      prods.slice(0, 3).forEach(p => {
        console.log(`   - ${p.name} ($${p.price}) - ${p.images?.length || 0} imágenes`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testBackend();
