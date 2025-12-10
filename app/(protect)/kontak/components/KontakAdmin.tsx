'use client';

import { useState } from 'react';

export default function KontakAdminPage() {
  const ADMIN_WA = '6282220222185';

  const [form, setForm] = useState({
    nama: '',
    email: '',
    pesan: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `Halo Admin,

Saya ingin menghubungi admin melalui website.

Nama  : ${form.nama}
Email : ${form.email}

Pesan:
${form.pesan}

Terima kasih.`;

    const waUrl = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    setForm({ nama: '', email: '', pesan: '' });
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-slate-200">
        <header className="px-6 py-4 border-b border-slate-200">
          <h1 className="text-xl font-semibold text-slate-800">
            Kontak Administrator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Silakan isi formulir di bawah untuk menghubungi admin.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              required
              placeholder="Masukkan nama lengkap"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="contoh@email.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pesan
            </label>
            <textarea
              name="pesan"
              value={form.pesan}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Tuliskan pesan Anda…"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition"
          >
            Hubungi via WhatsApp
          </button>
        </form>

        <footer className="px-6 py-3 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Anda akan diarahkan langsung ke WhatsApp Admin
          </p>
        </footer>
      </section>
    </main>
  );
}
