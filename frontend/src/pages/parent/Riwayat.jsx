import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { getSelectedChild } from "../../utils/child";

function Riwayat() {
  const child = getSelectedChild();

  const [allData, setAllData] = useState(
    JSON.parse(localStorage.getItem("growthHistory")) || []
  );

  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    bb: "",
    tb: "",
    usia: "",
  });

  // 🔥 FILTER PER ANAK
  const data = child
    ? allData.filter((item) => item.childId === child.id)
    : [];

  // 🗑️ DELETE
  const handleDelete = (index) => {
    const confirmDelete = confirm("Yakin mau hapus?");
    if (!confirmDelete) return;

    const globalIndex = allData.findIndex(
      (item) => item === data[index]
    );

    const updated = [...allData];
    updated.splice(globalIndex, 1);

    setAllData(updated);
    localStorage.setItem("growthHistory", JSON.stringify(updated));
  };

  // ✏️ EDIT
  const handleEdit = (index) => {
    const item = data[index];

    setForm({
      bb: item.bb,
      tb: item.tb,
      usia: item.usia,
    });

    const globalIndex = allData.findIndex(
      (i) => i === item
    );

    setEditIndex(globalIndex);
  };


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        Riwayat Pertumbuhan
      </h2>

      {/* 👶 Anak Aktif */}
      {child ? (
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Anak Aktif</p>
          <h3 className="font-bold">{child.nama}</h3>
        </div>
      ) : (
        <div className="bg-yellow-100 p-4 rounded-xl">
          Pilih anak dulu
        </div>
      )}

      {/* ✏️ FORM EDIT */}
      {editIndex !== null && (
        <form
          onSubmit={handleUpdate}
          className="bg-white p-6 rounded-xl shadow max-w-md"
        >
          <h3 className="font-bold mb-3">Edit Data</h3>

          <input
            type="number"
            placeholder="BB"
            className="w-full mb-2 p-2 border rounded"
            value={form.bb}
            onChange={(e) =>
              setForm({ ...form, bb: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="TB"
            className="w-full mb-2 p-2 border rounded"
            value={form.tb}
            onChange={(e) =>
              setForm({ ...form, tb: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Usia"
            className="w-full mb-3 p-2 border rounded"
            value={form.usia}
            onChange={(e) =>
              setForm({ ...form, usia: e.target.value })
            }
          />

          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Simpan Perubahan
          </button>
        </form>
      )}

      {/* 📊 CHART */}
      {data.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tanggal" />
              <YAxis />
              <Tooltip />
              <Line dataKey="bb" stroke="#3b82f6" />
              <Line dataKey="tb" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 📋 TABLE */}
      {data.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th>Tanggal</th>
                <th>BB</th>
                <th>TB</th>
                <th>Usia</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b">
                  <td>{item.tanggal}</td>
                  <td>{item.bb}</td>
                  <td>{item.tb}</td>
                  <td>{item.usia}</td>
                  <td>{item.status}</td>

                  <td className="space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-400 px-2 py-1 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Riwayat;