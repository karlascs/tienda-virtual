'use client'

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import styles from "./Stats.module.css";

interface Stats {
  totalSales: number;
  totalRevenue: number;
  salesByType: Array<{ type: string; count: number; total: number }>;
  salesByStatus: Array<{ status: string; count: number }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
  salesByDay: Array<{ date: string; count: number; total: number }>;
  paymentMethods: Array<{ method: string; count: number; total: number }>;
}

export default function SalesStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadStats();
  }, [startDate, endDate]);

  const loadStats = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(`/api/admin/sales/stats?${params}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <p>Cargando estadísticas...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <p>No se pudieron cargar las estadísticas</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Estadísticas de Ventas</h1>
        </div>

        {/* Filtros de fecha */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Desde:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Hasta:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.input}
            />
          </div>
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className={styles.btnSecondary}
          >
            Limpiar Filtros
          </button>
        </div>

        {/* Resumen general */}
        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>📊</div>
            <div className={styles.cardContent}>
              <h3>Total Ventas</h3>
              <p className={styles.cardValue}>{stats.totalSales}</p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>💰</div>
            <div className={styles.cardContent}>
              <h3>Ingresos Totales</h3>
              <p className={styles.cardValue}>
                ${stats.totalRevenue.toLocaleString("es-CL")}
              </p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>🌐</div>
            <div className={styles.cardContent}>
              <h3>Ventas Online</h3>
              <p className={styles.cardValue}>
                {stats.salesByType.find((s) => s.type === "ONLINE")?.count || 0}
              </p>
              <p className={styles.cardSubtext}>
                ${(stats.salesByType.find((s) => s.type === "ONLINE")?.total || 0).toLocaleString("es-CL")}
              </p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>🏪</div>
            <div className={styles.cardContent}>
              <h3>Ventas Físicas</h3>
              <p className={styles.cardValue}>
                {stats.salesByType.find((s) => s.type === "PHYSICAL")?.count || 0}
              </p>
              <p className={styles.cardSubtext}>
                ${(stats.salesByType.find((s) => s.type === "PHYSICAL")?.total || 0).toLocaleString("es-CL")}
              </p>
            </div>
          </div>
        </div>

        {/* Gráficos y detalles */}
        <div className={styles.chartsGrid}>
          {/* Productos más vendidos */}
          <div className={styles.card}>
            <h2>🏆 Top 10 Productos Más Vendidos</h2>
            <div className={styles.table}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topProducts.map((product, index) => (
                    <tr key={product.productId}>
                      <td>{index + 1}</td>
                      <td>{product.productName}</td>
                      <td>{product.quantity}</td>
                      <td>${product.revenue.toLocaleString("es-CL")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Métodos de pago */}
          <div className={styles.card}>
            <h2>💳 Métodos de Pago</h2>
            <div className={styles.paymentMethods}>
              {stats.paymentMethods.map((method) => (
                <div key={method.method} className={styles.paymentMethod}>
                  <div className={styles.methodInfo}>
                    <h3>{method.method}</h3>
                    <p>{method.count} transacciones</p>
                  </div>
                  <div className={styles.methodAmount}>
                    ${method.total.toLocaleString("es-CL")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ventas por estado */}
          <div className={styles.card}>
            <h2>📋 Estados de Ventas</h2>
            <div className={styles.statusList}>
              {stats.salesByStatus.map((status) => (
                <div key={status.status} className={styles.statusItem}>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[`status${status.status}`]
                    }`}
                  >
                    {status.status === "COMPLETED"
                      ? "Completadas"
                      : status.status === "PENDING"
                      ? "Pendientes"
                      : status.status === "CANCELLED"
                      ? "Canceladas"
                      : "Reembolsadas"}
                  </span>
                  <span className={styles.statusCount}>{status.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ventas por día */}
          <div className={styles.card}>
            <h2>📅 Ventas por Día</h2>
            <div className={styles.salesByDay}>
              {stats.salesByDay.slice(0, 10).map((day: any) => (
                <div key={day.date} className={styles.dayItem}>
                  <div className={styles.dayDate}>
                    {new Date(day.date).toLocaleDateString("es-CL", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                  <div className={styles.dayBar}>
                    <div
                      className={styles.dayBarFill}
                      style={{
                        width: `${(day.total / Math.max(...stats.salesByDay.map((d: any) => d.total))) * 100}%`,
                      }}
                    />
                  </div>
                  <div className={styles.dayInfo}>
                    <span>{day.count} ventas</span>
                    <span>${day.total.toLocaleString("es-CL")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
