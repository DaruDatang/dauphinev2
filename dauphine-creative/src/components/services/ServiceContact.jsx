import { motion } from 'framer-motion';

const ServiceContact = ({ serviceName }) => {
  // Membuat URL mailto dinamis dengan subjek khusus
  const mailtoLink = `mailto:dauphinecreative@gmail.com?subject=Inquiry%20for%20${encodeURIComponent(serviceName)}`;

  return (
    <section className="py-24 bg-dark text-light relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Tertarik dengan layanan <span className="text-primary">{serviceName}</span> kami?</h2>
            <p className="text-light/70 text-xl mb-8 font-medium">Mari diskusikan kebutuhan spesifik Anda dan wujudkan bersama.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form action={mailtoLink} method="POST" encType="text/plain" className="space-y-8">
              <div>
                <label className="block text-sm font-bold mb-2 text-light/80">Full name *</label>
                <input type="text" name="Name" required className="w-full bg-transparent border-b-2 border-light/30 focus:border-primary outline-none py-2 text-light transition-colors" placeholder="Masukan nama lengkap anda..." />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-light/80">Email *</label>
                <input type="email" name="Email" required className="w-full bg-transparent border-b-2 border-light/30 focus:border-primary outline-none py-2 text-light transition-colors" placeholder="Masukan alamat email anda..." />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-light/80">Ceritakan Kebutuhan Anda</label>
                <textarea name="Message" rows="4" className="w-full bg-transparent border-b-2 border-light/30 focus:border-primary outline-none py-2 text-light transition-colors resize-none" placeholder="Silahkan masukan pesan anda..."></textarea>
              </div>
              <button type="submit" className="comic-box bg-primary text-white py-3 px-8 font-bold text-lg hover:bg-white hover:text-dark">
                Kirim Email
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceContact;