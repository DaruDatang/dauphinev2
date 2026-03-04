import { Link } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-16 pb-8 relative overflow-hidden">
      {/* Background dekoratif (Scribble effect placeholder) */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none text-[20rem] font-black leading-none -mt-20 -mr-10">
        dc.
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 border-b border-light/20 pb-12">
          {/* Kolom 1: Brand & Alamat */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-black mb-4 flex items-center gap-1 text-white">
              <span className="text-primary">.</span>Dauphine
            </h2>
            <p className="text-light/70 text-sm mb-4">
              We help turn ideas into reliable, scalable digital products and creative experiences.
            </p>
            <p className="text-sm font-bold text-primary">
              Jl. Buana Indah IV No. 2,<br />
              Kota Bandung, Jawa Barat
            </p>
          </div>

          {/* Kolom 2: Layanan */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Our Services</h3>
            <ul className="space-y-2 text-sm text-light/70">
              <li><Link to="/service/social-media" className="hover:text-primary transition-colors">Social Media Management</Link></li>
              <li><Link to="/service/it-solution" className="hover:text-primary transition-colors">IT Solution</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact Info</h3>
            <ul className="space-y-2 text-sm text-light/70">
              <li><a href="mailto:dauphinecreative@gmail.com" className="hover:text-primary transition-colors">dauphinecreative@gmail.com</a></li>
              <li><a href="https://wa.me/6281234567890" className="hover:text-primary transition-colors">+62 811-2128-038</a></li>
            </ul>
          </div>

          {/* Kolom 4: Sosial Media */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/dauphinecreative.id/?utm_source=ig_web_button_share_sheet" className="w-10 h-10 rounded-full bg-light/10 flex items-center justify-center hover:bg-primary transition-colors border-2 border-transparent hover:border-white">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-light/10 flex items-center justify-center hover:bg-black transition-colors border-2 border-transparent hover:border-white">
                <FaTiktok className="text-xl" />
              </a>
              <a href="mailto:dauphinecreative@gmail.com" className="w-10 h-10 rounded-full bg-light/10 flex items-center justify-center hover:bg-secondary transition-colors border-2 border-transparent hover:border-white">
                <FaEnvelope className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-light/50">
          <p>© {new Date().getFullYear()} Dauphine Creative. All Rights Reserved.</p>
        </div>
      </div>

      {/* Floating WhatsApp Button bergaya komik */}
      <a 
        href="https://wa.me/628112128038" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 comic-box bg-[#25D366] text-white p-3 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-4xl" />
      </a>
    </footer>
  );
};

export default Footer;