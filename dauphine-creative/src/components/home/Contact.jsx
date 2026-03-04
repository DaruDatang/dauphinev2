import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-dark text-light relative overflow-hidden">
      {/* Background dekoratif (Scribble effect placeholder) */}
      <div className="absolute -bottom-20 -left-20 text-[20rem] font-black text-white/5 pointer-events-none">
        hello
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">Let's <span className="text-primary">talk</span></h2>
            <p className="text-light/70 text-xl mb-8 font-medium">Tell us about your need and we will help.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Menggunakan action mailto agar langsung membuka email client */}
            <form 
              action="mailto:dauphinecreative@gmail.com" 
              method="POST" 
              encType="text/plain"
              className="space-y-8"
            >
              <div>
                <label className="block text-sm font-bold mb-2 text-light/80">Full name *</label>
                <input 
                  type="text" 
                  name="Name"
                  required
                  className="w-full bg-transparent border-b-2 border-light/30 focus:border-primary outline-none py-2 text-light transition-colors"
                  placeholder="Masukan nama lengkap anda..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-light/80">Email *</label>
                <input 
                  type="email" 
                  name="Email"
                  required
                  className="w-full bg-transparent border-b-2 border-light/30 focus:border-primary outline-none py-2 text-light transition-colors"
                  placeholder="Masukan email anda..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-light/80">Tell us how we can help</label>
                <textarea 
                  name="Message"
                  rows="4"
                  className="w-full bg-transparent border-b-2 border-light/30 focus:border-primary outline-none py-2 text-light transition-colors resize-none"
                  placeholder="Masukan pesan anda..."
                ></textarea>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-light/50 max-w-[60%]">
                  Your personal data is processed in accordance with our Privacy Notice.
                </p>
                <button 
                  type="submit"
                  className="comic-box bg-primary text-white py-3 px-8 font-bold text-lg hover:bg-white hover:text-dark border-transparent hover:border-dark"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;