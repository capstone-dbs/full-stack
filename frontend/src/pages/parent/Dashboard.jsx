import { useEffect, useState } from "react";

import API from "../../services/api";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

import { Card } from "../../components/common/Card";


function Dashboard() {

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      setLoading(true);

      const response =
        await API.get("/dashboard");

      setDashboardData(
        response.data.data
      );

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Gagal mengambil dashboard"
      );

    } finally {

      setLoading(false);

    }

  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 text-lg font-semibold">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg font-semibold">
          {error}
        </p>
      </div>
    );
  }

  const totalChildren =
    dashboardData?.totalChildren || 0;

  const totalData =
    dashboardData?.totalPredictions || 0;

  const normalCount =
    dashboardData?.normalCount || 0;

  const stuntingCount =
    dashboardData?.stuntingCount || 0;

  const giziBurukCount =
    dashboardData?.giziBurukCount || 0;

  const lastData =
    dashboardData?.latestPrediction;

  const histories =
    dashboardData?.histories || [];

  const chartData = [
    {
      name: "Normal",
      value: normalCount,
      color: "#10b981"
    },
    {
      name: "Risiko Stunting",
      value: stuntingCount,
      color: "#ef4444"
    },
    {
      name: "Risiko Gizi Buruk",
      value: giziBurukCount,
      color: "#f59e0b"
    },
  ];

  return (
    <div className="space-y-10 min-h-screen pb-20 animate-in fade-in duration-700">

      {/* HEADER SECTION */}
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Ringkasan Statistik
        </h1>

        <p className="text-slate-500 mt-1">
          Gambaran umum kesehatan dan pertumbuhan seluruh anak Anda.
        </p>
      </header>

      {/* 📊 GLOBAL STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {[
          {
            label: "Total Anak",
            value: totalChildren,
            icon:
              "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
            color: "blue"
          },
          {
            label: "Total Data",
            value: totalData,
            icon:
              "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            color: "purple"
          },
          {
            label: "Anak Normal",
            value: normalCount,
            icon:
              "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            color: "emerald"
          },
          {
            label: "Risiko Stunting",
            value: stuntingCount,
            icon:
              "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
            color: "red"
          },
          {
            label: "Risiko Gizi Buruk",
            value: giziBurukCount,
            icon:
              "M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8zm0 10c-4.418 0-8-2.91-8-6.5S7.582 5 12 5s8 2.91 8 6.5S16.418 18 12 18z",
            color: "amber"
          }
        ].map((stat, i) => (

          <div
            key={i}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
          >

            <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl group-hover:scale-110 transition-transform`}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={stat.icon}
                />
              </svg>
            </div>

            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>

              <h3 className="text-2xl font-black text-slate-900">
                {stat.value}
              </h3>
            </div>

          </div>

        ))}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* CHART SECTION */}
        <Card
          title="Distribusi Status Kesehatan"
          className="lg:col-span-2"
        >

          <div className="h-80 w-full pt-4">

            {totalData > 0 ? (

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <PieChart>

                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >

                    {chartData.map((entry, index) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />

                    ))}

                  </Pie>

                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '20px',
                      border: 'none',
                      boxShadow:
                        '0 20px 25px -5px rgba(0,0,0,0.1)'
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-[2.5rem] gap-4">

                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 shadow-sm">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>

                <p className="font-bold text-slate-900">
                  Belum ada data statistik
                </p>

                <p className="text-xs max-w-[250px] text-center">
                  Data akan muncul di sini setelah Anda melakukan pengecekan pertumbuhan pada anak.
                </p>

              </div>

            )}

          </div>

        </Card>

        {/* ACTIVE CHILD SUMMARY */}
        <div className="space-y-6">

          <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">

            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>

            <span className="relative z-10 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
              Prediksi Terakhir
            </span>

            {lastData ? (

              <div className="relative z-10 mt-6 space-y-6">

                <div>
                  <h2 className="text-3xl font-black tracking-tight">
                    {lastData.children?.full_name}
                  </h2>

                  <p className="text-blue-100 mt-1 font-medium">
                    {lastData.children?.gender}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10">
                    <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1">
                      BB Akhir
                    </p>

                    <p className="text-2xl font-black">
                      {lastData.weight} kg
                    </p>
                  </div>

                  <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10">
                    <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1">
                      TB Akhir
                    </p>

                    <p className="text-2xl font-black">
                      {lastData.height} cm
                    </p>
                  </div>

                </div>

                <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 flex items-center justify-between">

                  <span className="text-xs font-bold text-blue-50">
                    Status Terakhir
                  </span>

                  <span className={`px-4 py-1.5 rounded-xl text-xs font-black shadow-lg ${
                    lastData.prediction_result ===
                    "Normal"
                      ? "bg-emerald-400 text-white"
                      : "bg-red-400 text-white shadow-red-500/20"
                  }`}>

                    {lastData.prediction_result}

                  </span>

                </div>

              </div>

            ) : (

              <div className="relative z-10 mt-10 py-6 text-blue-100 italic text-sm leading-relaxed">
                Belum ada prediksi yang tersedia.
              </div>

            )}

          </div>

          <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex gap-4">

            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div>

              <h4 className="text-amber-900 font-extrabold text-sm mb-1">
                Tips Pertumbuhan
              </h4>

              <p className="text-amber-700 text-[11px] leading-relaxed font-medium">
                Berikan ASI eksklusif dan MPASI bergizi untuk mencegah stunting sejak dini. Rutinlah menimbang berat badan setiap bulan.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* HISTORIES */}
      <Card title="Riwayat Prediksi">

        <div className="space-y-4">

          {histories.length > 0 ? (

            histories.map((item) => (

              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-100 bg-white flex justify-between items-center"
              >

                <div>

                  <h3 className="font-bold text-slate-900">
                    {item.children?.full_name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {item.height} cm • {item.weight} kg
                  </p>

                </div>

                <span className={`px-4 py-2 rounded-xl text-xs font-bold text-white ${
                  item.prediction_result ===
                  "Normal"
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}>

                  {item.prediction_result}

                </span>

              </div>

            ))

          ) : (

            <p className="text-slate-500">
              Belum ada riwayat prediksi
            </p>

          )}

        </div>

      </Card>

    </div>
  );
}

export default Dashboard;
