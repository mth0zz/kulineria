"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export function FAQSection() {
  const faqs = [
    {
      question: "Apa itu Kuliner Nusantara?",
      answer:
        "Kuliner Nusantara adalah platform untuk menemukan dan mengeksplorasi makanan tradisional autentik dari seluruh kepulauan Indonesia, mulai dari Sabang hingga Merauke.",
    },
    {
      question: "Bagaimana cara mencari kuliner?",
      answer:
        "Anda dapat mencari kuliner melalui search bar utama dengan mengetikkan nama makanan, kota, atau provinsi. Atau gunakan filter kategori, harga, dan area untuk menemukan kuliner sesuai preferensi Anda.",
    },
    {
      question: "Apakah harga yang ditampilkan akurat?",
      answer:
        "Harga yang ditampilkan adalah rentang harga dari berbagai penjual. Harga aktual dapat berbeda tergantung lokasi, musim, dan penjual tertentu.",
    },
    {
      question: "Bagaimana jika ingin menambahkan kuliner baru?",
      answer:
        "Kami menerima kontribusi dari komunitas. Jika Anda memiliki kuliner tradisional yang ingin dibagikan, kunjungi portal UMKM kami untuk mendaftarkan kuliner baru.",
    },
    {
      question: "Adakah fitur favorit atau wishlist?",
      answer:
        "Ya, Anda dapat menyimpan kuliner favorit dengan mengklik ikon bookmark di setiap kartu kuliner. Kuliner yang disimpan akan disimpan di device Anda.",
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-6">Pertanyaan Umum</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-border">
                <AccordionTrigger className="text-foreground font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Cara Berkontribusi</h3>
            <div className="space-y-3 text-muted-foreground mb-6">
              <p>
                <span className="font-semibold text-foreground">1. Daftarkan Kuliner Anda</span>
                <br />
                Kami terbuka untuk kuliner tradisional dari seluruh nusantara
              </p>
              <p>
                <span className="font-semibold text-foreground">2. Bagikan Informasi Lengkap</span>
                <br />
                Ceritakan tentang asal, bahan, dan keunikan kuliner Anda
              </p>
              <p>
                <span className="font-semibold text-foreground">3. Raih Mitra dan Promosi</span>
                <br />
                Dapatkan eksposur dan peluang kerjasama melalui platform kami
              </p>
            </div>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl">
            Portal UMKM
          </Button>
        </div>
      </div>
    </section>
  )
}
