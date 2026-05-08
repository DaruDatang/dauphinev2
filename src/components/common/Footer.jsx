import { FaInstagram, FaTiktok, FaMapPin, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#ffffff] pt-24 pb-0 overflow-hidden border-dark/10 relative">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20 md:mb-32">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-dark uppercase tracking-tighter">
              Dauphine Creative ©{currentYear}
            </span>
            <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">
              All rights reserved
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-dark uppercase tracking-tighter text-dark/40">
              Follow & Locate Us
            </span>
            <div className="flex gap-4 text-dark/40">
              <a href="https://www.instagram.com/dauphinecreative.id?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="hover:text-dark transition-colors"><FaInstagram size={20} /></a>
              <a href="https://www.google.com/maps/place/Dauphine+Creative/@-6.227685,106.845254,17z/data=!3m1!4b1!4m5!3m4!1s0x2e69f43b3c9c9c9d:0x2e69f43b3c9c9c9d!8m2!3d-6.227685!4d106.845254" className="hover:text-dark transition-colors"><FaMapPin size={18} /></a>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-1 md:items-start">
            <span className="text-sm font-bold text-dark uppercase tracking-tighter">
              Interested to work with us?
            </span>
            <a href="mailto:dauphinecreative@gmail.com" className="text-sm font-medium text-dark/40 hover:text-dark transition-colors uppercase tracking-tighter">
              dauphinecreative@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-end leading-none select-none px-4">
        <h1 
          className="font-black text-dark tracking-tighter leading-[0.7] mb-[-1.5vw] whitespace-nowrap text-center"
          style={{ 
            fontSize: 'clamp(100px, 20vw, 380px)' 
          }}
        >
          Dauphiné
        </h1>
      </div>

      <a 
        href="https://wa.me/628112128038" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-dark text-white rounded-full flex items-center justify-center hover:bg-dark/80 hover:scale-110 transition-all duration-300 shadow-xl"
      >
        <FaWhatsapp size={28} />
      </a>
    </footer>
  );
};

export default Footer;