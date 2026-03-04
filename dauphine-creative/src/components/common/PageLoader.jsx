import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-light"
    >
      <div className="flex flex-col items-center">
        {/* Animasi Logo atau Simbol Scribble */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0] 
          }}
          transition={{ 
            duration: 0.8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="w-16 h-16 border-4 border-dark rounded-xl bg-primary shadow-comic flex items-center justify-center text-white font-black text-2xl"
        >
          D
        </motion.div>
        
        {/* Teks Loading bergaya Hand-drawn */}
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-6 font-bold text-secondary tracking-widest uppercase text-sm"
        >
          Creating Magic...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default PageLoader;