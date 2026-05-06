import { motion } from 'framer-motion';
import logoDp from '../../assets/logo-dp.svg'; 

const PageLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.8, ease: "easeInOut" } 
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#ffffff]"
    >
      <div className="flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
          className="relative"
        >
          <img 
            src={logoDp} 
            alt="Dauphiné Creative"
            className="w-28 h-28 md:w-36 md:h-36 object-contain grayscale opacity-80"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-10 flex flex-col items-center gap-3"
        >

          <motion.span 
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-[1px] bg-dark/20 w-16"
          />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default PageLoader;