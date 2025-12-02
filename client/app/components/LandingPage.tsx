// components/LandingPage.tsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


type Feature = {
    title: string
    desc: string
    icon?: React.ReactNode
}

const FEATURES: Feature[] = [
    { title: 'Konu Takibi', desc: 'Müfredattaki konuları takip et, tamamlananları işaretle.' },
    { title: 'Haftalık Rapor', desc: 'Haftalık özetler ve ilerleme grafikleri üret.' },
    { title: 'Görev Yönetimi', desc: 'Öğrenci ve öğretmen için görev atama ve takip köprüsü.' },
    { title: 'Bildirim & Hatırlatıcı', desc: 'Planlanan çalışmaları hatırlatan bildirimler.' },
]

export default function LandingPage(): React.ReactNode {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
            {/* Header */}
            <header className="bg-white shadow sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/images/pusulam_logo.png"
                            alt="Pusulam Logo"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                        <div className={`font-sans font-bold text-2xl text-[#1087BB]`}>
                            Pusulam
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm">
                        <Link href="#features" className="hover:text-[#1087BB] transition">Özellikler</Link>
                        <Link href="#roles" className="hover:text-[#1087BB] transition">Roller</Link>
                        <Link href="#about" className="hover:text-[#1087BB] transition">Hakkında</Link>
                        <Link href="/login" className="px-4 py-2 rounded-md border border-slate-200 hover:bg-slate-50 transition">Giriş</Link>
                        <Link href="/register" className="px-4 py-2 rounded-md bg-[#1087BB] text-white hover:bg-indigo-700 transition">Kayıt Ol</Link>
                    </nav>

                    <div className="md:hidden">
                        <MobileMenu />
                    </div>
                </div>
            </header>

            <main>
                {/* Hero */}
                <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col-reverse lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2">
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                            Öğrenci başarı takibini <span className="text-[#1087BB]">kolaylaştır</span>
                        </h1>
                        <p className="mt-4 text-slate-600">Öğrenciler, veliler ve öğretmenler için kişiselleştirilmiş çalışma planı, görev takibi ve haftalık raporlar.</p>

                        <div className="mt-6 flex items-center gap-4 flex-wrap">
                            <Link href="/register" className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#1087BB] text-white font-medium hover:bg-indigo-700 transition transform hover:scale-105 duration-300">
                                Hemen Başla
                            </Link>
                            <Link href="/about" className="text-sm text-slate-600 hover:underline transition">Daha fazla bilgi</Link>
                        </div>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                            <div className="p-3 bg-white border rounded shadow-sm hover:shadow-lg transition transform hover:-translate-y-1">Öğrenci dostu arayüz</div>
                            <div className="p-3 bg-white border rounded shadow-sm hover:shadow-lg transition transform hover:-translate-y-1">Öğretmenler için yönetim paneli</div>
                            <div className="p-3 bg-white border rounded shadow-sm hover:shadow-lg transition transform hover:-translate-y-1">Haftalık performans raporu</div>
                            <div className="p-3 bg-white border rounded shadow-sm hover:shadow-lg transition transform hover:-translate-y-1">Konu seviye takibi</div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 flex justify-center">
                        <div className="w-full max-w-md rounded-2xl shadow-xl p-6 bg-gradient-to-b from-white to-slate-50">
                            <div className="h-64 bg-slate-100 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center">
                                <div className="text-slate-400">Panel ekran görüntüsü (yer tutucu)</div>
                            </div>
                            <div className="mt-4 flex gap-3 flex-wrap">
                                <div className="flex-1 bg-white p-3 border rounded shadow-sm hover:shadow-lg transition">
                                    <div className="text-xs text-slate-500">Bugün</div>
                                    <div className="font-semibold">3/5 görev tamamlandı</div>
                                </div>
                                <div className="w-24 bg-white p-3 border rounded text-center shadow-sm hover:shadow-lg transition">
                                    <div className="text-xs text-slate-500">Skor</div>
                                    <div className="font-semibold text-indigo-600">82%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Roles */}
                <section id="roles" className="bg-white py-12">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-2xl font-semibold">Kimler Kullanır?</h2>
                        <p className="text-slate-600 mt-2">Öğrenciler, veliler ve eğitim koçları için farklı paneller ve roller.</p>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <RoleCard title="Öğrenci" desc="Kendi çalışma planını görür, görevleri tamamlar ve ilerlemesini takip eder." />
                            <RoleCard title="Veli" desc="Çocuğunun haftalık raporlarını görür ve gelişimi takip eder." />
                            <RoleCard title="Eğitimci" desc="Öğrencileri yönetir, raporlar oluşturur ve görevler atar." />
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="py-12">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-2xl font-semibold">Öne Çıkan Özellikler</h2>
                        <p className="text-slate-600 mt-2">Sistemin sunduğu başlıca imkanlar.</p>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {FEATURES.map((f) => (
                                <div key={f.title} className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-lg hover:scale-105 transition transform duration-300">
                                    <div className="text-lg font-semibold">{f.title}</div>
                                    <div className="mt-2 text-sm text-slate-600">{f.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Callout / Demo */}
                <section className="bg-[#1087BB] text-white py-12">
                    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-semibold">Projeyi şimdi dene — ücretsiz</h3>
                            <p className="mt-2 text-indigo-100 text-sm">Hesap oluştur, kendi çalışma planını oluştur ve öğrenci ilerlemeni takip etmeye başla.</p>
                        </div>
                        <div>
                            <Link href="/register" className="inline-block px-5 py-3 bg-white text-[#1087BB] rounded-md font-medium hover:bg-indigo-100 transition transform hover:scale-105">
                                Kayıt Ol
                            </Link>
                        </div>
                    </div>
                </section>

                {/* About */}
                <section id="about" className="py-12">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-2xl font-semibold">Hakkında</h2>
                        <p className="text-slate-600 mt-2">Bu sistem, öğrencilerin ders çalışma süreçlerini izlemek, öğretmenlerin öğrencilerini yönetmek ve velilerin çocuklarının ilerlemesini görebilmesi amacıyla tasarlandı. Proje, öğrenme alışkanlıklarını düzenlemeye ve veriye dayalı kararlar vermeye yardımcı olur.</p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-12">
                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">© {new Date().getFullYear()} Pusulam Başarı Takip — Bitirme Projesi</div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <Link href="/privacy" className="text-sm text-slate-600 hover:underline transition">Gizlilik</Link>
                        <Link href="/contact" className="text-sm text-slate-600 hover:underline transition">İletişim</Link>
                        <a href="https://github.com/" target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:underline transition">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function RoleCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg hover:-translate-y-1 transition transform duration-300">
            <div className="text-lg font-semibold">{title}</div>
            <p className="mt-2 text-slate-600 text-sm">{desc}</p>
            <div className="mt-4">
                <Link href={title === 'Öğrenci' ? '/student' : title === 'Veli' ? '/parent' : '/coach'} className="inline-block px-4 py-2 rounded-md bg-[#1087BB] text-white text-sm hover:bg-black transition">
                    Paneli Gör
                </Link>
            </div>
        </div>
    )
}

function MobileMenu() {
    return (
        <details className="relative">
            <summary className="cursor-pointer px-3 py-2 border rounded-md hover:bg-slate-100 transition">Menu</summary>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border p-3 z-50">
                <nav className="flex flex-col gap-2 text-sm">
                    <Link href="#features" className="block px-2 py-1 rounded hover:bg-indigo-50 transition">Özellikler</Link>
                    <Link href="#roles" className="block px-2 py-1 rounded hover:bg-indigo-50 transition">Roller</Link>
                    <Link href="/login" className="block px-2 py-1 rounded hover:bg-indigo-50 transition">Giriş</Link>
                    <Link href="/register" className="block px-2 py-1 rounded hover:bg-indigo-50 transition">Kayıt Ol</Link>
                </nav>
            </div>
        </details>
    )
}
