"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import styles from "./Sales.module.css";

interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  discount: number;
  subtotal: number;
}

interface Sale {
  id: string;
  saleNumber: string;
  type: "ONLINE" | "PHYSICAL";
  status: "COMPLETED" | "PENDING" | "CANCELLED" | "REFUNDED";
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerRut?: string;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  registeredBy?: string;
  notes?: string;
  createdAt: string;
  items: SaleItem[];
  _count: {
    items: number;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  // Filtros
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Formulario de nueva venta
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerRut: "",
    paymentMethod: "EFECTIVO",
    discount: 0,
    shipping: 0,
    notes: "",
    items: [] as Array<{ productId: string; quantity: number; discount: number }>,
  });

  const [currentItem, setCurrentItem] = useState({
    productId: "",
    quantity: 1,
    discount: 0,
  });
  
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    loadSales();
    loadProducts();
  }, [filterType, filterStatus, searchTerm, startDate, endDate]);

  const loadSales = async () => {
    try {
      const params = new URLSearchParams();
      if (filterType) params.append("type", filterType);
      if (filterStatus) params.append("status", filterStatus);
      if (searchTerm) params.append("search", searchTerm);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(`/api/admin/sales?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSales(Array.isArray(data) ? data : []);
      } else {
        setSales([]);
      }
    } catch (error) {
      console.error("Error al cargar ventas:", error);
      alert("Error al cargar ventas");
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/admin/inventory?limit=1000");
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result; // Manejar ambos formatos
        console.log("Productos cargados:", Array.isArray(data) ? data.length : 0); // Debug
        setProducts(Array.isArray(data) ? data : []);
      } else {
        console.error("Error al cargar productos, status:", response.status);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProducts([]);
    }
  };

  const handleAddItem = () => {
    if (!currentItem.productId || currentItem.quantity <= 0) {
      alert("Seleccione un producto y cantidad válida");
      return;
    }

    const product = products.find((p) => p.id === currentItem.productId);
    if (!product) return;

    if (product.stock < currentItem.quantity) {
      alert(`Stock insuficiente. Disponible: ${product.stock}`);
      return;
    }

    setFormData({
      ...formData,
      items: [...formData.items, { ...currentItem }],
    });

    setCurrentItem({ productId: "", quantity: 1, discount: 0 });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const calculateTotal = () => {
    let subtotal = 0;
    formData.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        subtotal += product.price * item.quantity - item.discount;
      }
    });

    const afterDiscount = subtotal - formData.discount;
    const tax = afterDiscount * 0.19;
    const total = afterDiscount + tax + formData.shipping;

    return { subtotal, tax, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      alert("Debe agregar al menos un producto");
      return;
    }

    try {
      const response = await fetch("/api/admin/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PHYSICAL",
          ...formData,
        }),
      });

      if (response.ok) {
        alert("Venta registrada exitosamente");
        setShowModal(false);
        setFormData({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          customerRut: "",
          paymentMethod: "EFECTIVO",
          discount: 0,
          shipping: 0,
          notes: "",
          items: [],
        });
        loadSales();
      } else {
        const error = await response.json();
        alert(error.error || "Error al registrar venta");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al registrar venta");
    }
  };

  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setShowDetailsModal(true);
  };

  const handleOpenModal = async () => {
    // Asegurar que los productos estén cargados
    if (products.length === 0) {
      await loadProducts();
    }
    setShowModal(true);
  };

  const handleImportFile = async () => {
    if (!importFile) {
      alert("Por favor seleccione un archivo");
      return;
    }

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", importFile);

      const response = await fetch("/api/admin/sales/import", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Importación exitosa!\n\nVentas creadas: ${result.created}\nErrores: ${result.errors}`);
        setShowImportModal(false);
        setImportFile(null);
        loadSales();
      } else {
        const error = await response.json();
        alert(error.error || "Error al importar ventas");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al importar archivo");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `Fecha,Cliente,RUT,Email,Teléfono,Método de Pago,SKU Producto,Cantidad,Descuento,Notas
2024-11-09,Juan Pérez,12345678-9,juan@email.com,+56912345678,EFECTIVO,producto-1,2,0,
2024-11-09,María González,98765432-1,maria@email.com,+56987654321,TRANSFERENCIA,producto-2,1,1000,Descuento especial`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "plantilla_ventas.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totals = calculateTotal();

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <p>Cargando ventas...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Control de Ventas</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setShowImportModal(true)} className={styles.btnSecondary}>
              📁 Importar Ventas
            </button>
            <button onClick={handleOpenModal} className={styles.btnPrimary}>
              + Registrar Venta Física
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className={styles.filters}>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={styles.select}
          >
            <option value="">Todos los tipos</option>
            <option value="ONLINE">Online</option>
            <option value="PHYSICAL">Físico</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.select}
          >
            <option value="">Todos los estados</option>
            <option value="COMPLETED">Completada</option>
            <option value="PENDING">Pendiente</option>
            <option value="CANCELLED">Cancelada</option>
            <option value="REFUNDED">Reembolsada</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.input}
            placeholder="Fecha desde"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.input}
            placeholder="Fecha hasta"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por número, cliente..."
            className={styles.input}
          />
        </div>

        {/* Resumen */}
        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <h3>Total Ventas</h3>
            <p className={styles.summaryValue}>{sales.length}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Total Ingresos</h3>
            <p className={styles.summaryValue}>
              ${sales.reduce((acc, sale) => acc + sale.total, 0).toLocaleString("es-CL")}
            </p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Ventas Online</h3>
            <p className={styles.summaryValue}>
              {sales.filter((s) => s.type === "ONLINE").length}
            </p>
          </div>
          <div className={styles.summaryCard}>
            <h3>Ventas Físicas</h3>
            <p className={styles.summaryValue}>
              {sales.filter((s) => s.type === "PHYSICAL").length}
            </p>
          </div>
        </div>

        {/* Tabla de ventas */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>N° Venta</th>
                <th>Tipo</th>
                <th>Cliente</th>
                <th>Items</th>
                <th>Total</th>
                <th>Método Pago</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(sales) && sales.length > 0 ? (
                sales.map((sale) => (
                <tr key={sale.id}>
                  <td>
                    <strong>{sale.saleNumber}</strong>
                  </td>
                  <td>
                    <span
                      className={
                        sale.type === "ONLINE" ? styles.badgeOnline : styles.badgePhysical
                      }
                    >
                      {sale.type === "ONLINE" ? "Online" : "Físico"}
                    </span>
                  </td>
                  <td>{sale.customerName || "Sin nombre"}</td>
                  <td>{sale._count.items}</td>
                  <td>
                    <strong>${sale.total.toLocaleString("es-CL")}</strong>
                  </td>
                  <td>{sale.paymentMethod}</td>
                  <td>
                    <span
                      className={
                        sale.status === "COMPLETED"
                          ? styles.badgeCompleted
                          : sale.status === "PENDING"
                          ? styles.badgePending
                          : styles.badgeCancelled
                      }
                    >
                      {sale.status === "COMPLETED"
                        ? "Completada"
                        : sale.status === "PENDING"
                        ? "Pendiente"
                        : sale.status === "CANCELLED"
                        ? "Cancelada"
                        : "Reembolsada"}
                    </span>
                  </td>
                  <td>{new Date(sale.createdAt).toLocaleDateString("es-CL")}</td>
                  <td>
                    <button
                      onClick={() => handleViewDetails(sale)}
                      className={styles.btnSecondary}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                    {loading ? 'Cargando ventas...' : 'No hay ventas registradas'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de nueva venta */}
        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Registrar Venta Física</h2>
                <button onClick={() => setShowModal(false)} className={styles.closeBtn}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Nombre del Cliente</label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({ ...formData, customerName: e.target.value })
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>RUT</label>
                    <input
                      type="text"
                      value={formData.customerRut}
                      onChange={(e) =>
                        setFormData({ ...formData, customerRut: e.target.value })
                      }
                      className={styles.input}
                      placeholder="12.345.678-9"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, customerEmail: e.target.value })
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, customerPhone: e.target.value })
                      }
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Método de Pago *</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                    className={styles.select}
                    required
                  >
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
                    <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                  </select>
                </div>

                {/* Agregar productos */}
                <div className={styles.itemsSection}>
                  <h3>Productos {products.length > 0 && `(${products.length} disponibles)`}</h3>
                  <div className={styles.addItemForm}>
                    <div className={styles.formGroup} style={{ flex: 2 }}>
                      <input
                        type="text"
                        placeholder="🔍 Buscar producto..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <select
                      value={currentItem.productId}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, productId: e.target.value })
                      }
                      className={styles.select}
                      style={{ flex: 3 }}
                    >
                      <option value="">
                        {products.length === 0 ? "Cargando productos..." : "Seleccionar producto"}
                      </option>
                      {Array.isArray(products) && products
                        .filter(product => 
                          !productSearch || 
                          product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          product.slug.toLowerCase().includes(productSearch.toLowerCase())
                        )
                        .map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ${product.price.toLocaleString("es-CL")} (Stock:{" "}
                          {product.stock})
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={currentItem.quantity}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      className={styles.input}
                      placeholder="Cant."
                    />

                    <input
                      type="number"
                      min="0"
                      value={currentItem.discount}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          discount: parseFloat(e.target.value),
                        })
                      }
                      className={styles.input}
                      placeholder="Desc."
                    />

                    <button
                      type="button"
                      onClick={handleAddItem}
                      className={styles.btnSecondary}
                    >
                      Agregar
                    </button>
                  </div>

                  {formData.items.length > 0 && (
                    <table className={styles.itemsTable}>
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Precio</th>
                          <th>Descuento</th>
                          <th>Subtotal</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(formData.items) && formData.items.length > 0 ? (
                          formData.items.map((item, index) => {
                          const product = products.find((p) => p.id === item.productId);
                          const subtotal =
                            (product?.price || 0) * item.quantity - item.discount;
                          return (
                            <tr key={index}>
                              <td>{product?.name}</td>
                              <td>{item.quantity}</td>
                              <td>${product?.price.toLocaleString("es-CL")}</td>
                              <td>${item.discount.toLocaleString("es-CL")}</td>
                              <td>${subtotal.toLocaleString("es-CL")}</td>
                              <td>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(index)}
                                  className={styles.btnDanger}
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          );
                        })
                        ) : (
                          <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>
                              No hay productos en la venta
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Descuento General</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({ ...formData, discount: parseFloat(e.target.value) })
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Envío</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.shipping}
                      onChange={(e) =>
                        setFormData({ ...formData, shipping: parseFloat(e.target.value) })
                      }
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Notas</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className={styles.textarea}
                    rows={3}
                  />
                </div>

                {/* Total */}
                <div className={styles.totalSection}>
                  <div className={styles.totalRow}>
                    <span>Subtotal:</span>
                    <span>${totals.subtotal.toLocaleString("es-CL")}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>IVA (19%):</span>
                    <span>${totals.tax.toLocaleString("es-CL")}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <strong>TOTAL:</strong>
                    <strong>${totals.total.toLocaleString("es-CL")}</strong>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={styles.btnSecondary}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className={styles.btnPrimary}>
                    Registrar Venta
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de detalles */}
        {showDetailsModal && selectedSale && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Detalle de Venta {selectedSale.saleNumber}</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className={styles.closeBtn}
                >
                  ×
                </button>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailsSection}>
                  <h3>Información General</h3>
                  <p>
                    <strong>Tipo:</strong>{" "}
                    {selectedSale.type === "ONLINE" ? "Online" : "Físico"}
                  </p>
                  <p>
                    <strong>Estado:</strong> {selectedSale.status}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(selectedSale.createdAt).toLocaleString("es-CL")}
                  </p>
                  <p>
                    <strong>Método de Pago:</strong> {selectedSale.paymentMethod}
                  </p>
                  {selectedSale.registeredBy && (
                    <p>
                      <strong>Registrado por:</strong> {selectedSale.registeredBy}
                    </p>
                  )}
                </div>

                <div className={styles.detailsSection}>
                  <h3>Cliente</h3>
                  <p>
                    <strong>Nombre:</strong> {selectedSale.customerName || "N/A"}
                  </p>
                  <p>
                    <strong>RUT:</strong> {selectedSale.customerRut || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedSale.customerEmail || "N/A"}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {selectedSale.customerPhone || "N/A"}
                  </p>
                </div>
              </div>

              <div className={styles.detailsSection}>
                <h3>Productos</h3>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Descuento</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(selectedSale.items) && selectedSale.items.length > 0 ? (
                      selectedSale.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toLocaleString("es-CL")}</td>
                        <td>${item.discount.toLocaleString("es-CL")}</td>
                        <td>${item.subtotal.toLocaleString("es-CL")}</td>
                      </tr>
                    ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>
                          No hay productos en esta venta
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className={styles.totalSection}>
                <div className={styles.totalRow}>
                  <span>Subtotal:</span>
                  <span>${selectedSale.subtotal.toLocaleString("es-CL")}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Descuento:</span>
                  <span>-${selectedSale.discount.toLocaleString("es-CL")}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>IVA:</span>
                  <span>${selectedSale.tax.toLocaleString("es-CL")}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Envío:</span>
                  <span>${selectedSale.shipping.toLocaleString("es-CL")}</span>
                </div>
                <div className={styles.totalRow}>
                  <strong>TOTAL:</strong>
                  <strong>${selectedSale.total.toLocaleString("es-CL")}</strong>
                </div>
              </div>

              {selectedSale.notes && (
                <div className={styles.detailsSection}>
                  <h3>Notas</h3>
                  <p>{selectedSale.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de importación */}
        {showImportModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
              <div className={styles.modalHeader}>
                <h2>Importar Ventas Diarias</h2>
                <button onClick={() => setShowImportModal(false)} className={styles.closeBtn}>
                  ×
                </button>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                  <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#1976d2' }}>📋 Formato del archivo CSV</h3>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    El archivo debe contener las siguientes columnas:
                  </p>
                  <ul style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    <li><strong>Fecha</strong>: Formato YYYY-MM-DD (ej: 2024-11-09)</li>
                    <li><strong>Cliente</strong>: Nombre del cliente</li>
                    <li><strong>RUT</strong>: RUT del cliente (opcional)</li>
                    <li><strong>Email</strong>: Email del cliente (opcional)</li>
                    <li><strong>Teléfono</strong>: Teléfono del cliente (opcional)</li>
                    <li><strong>Método de Pago</strong>: EFECTIVO, TRANSFERENCIA, DEBITO, CREDITO</li>
                    <li><strong>SKU Producto</strong>: Slug del producto</li>
                    <li><strong>Cantidad</strong>: Cantidad vendida</li>
                    <li><strong>Descuento</strong>: Descuento aplicado (opcional, 0 por defecto)</li>
                    <li><strong>Notas</strong>: Notas adicionales (opcional)</li>
                  </ul>
                  <button 
                    onClick={downloadTemplate} 
                    className={styles.btnSecondary}
                    style={{ marginTop: '1rem', width: '100%' }}
                  >
                    📥 Descargar Plantilla CSV
                  </button>
                </div>

                <div className={styles.formGroup}>
                  <label>Seleccionar archivo CSV</label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    className={styles.input}
                  />
                  {importFile && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#2d4a4a' }}>
                      📄 {importFile.name} ({(importFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    onClick={() => setShowImportModal(false)}
                    className={styles.btnSecondary}
                    style={{ flex: 1 }}
                    disabled={importing}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleImportFile}
                    className={styles.btnPrimary}
                    style={{ flex: 1 }}
                    disabled={!importFile || importing}
                  >
                    {importing ? "Importando..." : "Importar Ventas"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
