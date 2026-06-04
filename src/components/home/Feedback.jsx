import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

const Feedback = () => {
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    project: '',
    rating: '5',
    comment: ''
  });

  useEffect(() => {
    if (statusMessage.text) {
      const timer = setTimeout(() => setStatusMessage({ type: '', text: '' }), 6000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('feedbacks')
        .insert([
          {
            name: formData.name,
            project: formData.project,
            rating: parseInt(formData.rating),
            comment: formData.comment
          }
        ]);

      if (error) throw error;

      setStatusMessage({ type: 'success', text: 'Thank you! Your feedback has been recorded.' });
      setFormData({ name: '', project: '', rating: '5', comment: '' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to submit feedback. Please try again.' });
    } finally {
      setIsSending(false);
    }
  };

  const inputClass = "w-full bg-transparent border-b border-dark/20 focus:border-dark outline-none py-4 text-dark transition-all text-lg placeholder:text-dark/20";

  return (
    <section id="feedback" className="py-32 bg-white border-t border-dark/5">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="hidden md:block">
            <span className="text-sm font-medium text-dark/40 uppercase tracking-tighter">Share Experience</span>
          </div>

          <div className="md:col-start-2 md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-7xl font-medium text-dark tracking-tight leading-tight mb-16">
                Leave your <br />
                <span className="text-dark/40">feedback here.</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-dark/40 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-dark/40 mb-2">Project / Company</label>
                    <input 
                      type="text" 
                      name="project"
                      value={formData.project}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="e.g. CNC Bandung"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-dark/40 mb-2">Rating Score</label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      className={`${inputClass} bg-transparent cursor-pointer`}
                    >
                      <option value="5">Excellent (5/5)</option>
                      <option value="4">Very Good (4/5)</option>
                      <option value="3">Good (3/5)</option>
                      <option value="2">Average (2/5)</option>
                      <option value="1">Poor (1/5)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-dark/40 mb-2">Review Comment</label>
                  <textarea 
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows="4"
                    required
                    className={`${inputClass} resize-none`}
                    placeholder="Describe your experience working with Dauphiné Creative"
                  ></textarea>
                </div>

                <div className="flex flex-col gap-6">
                  <AnimatePresence>
                    {statusMessage.text && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`text-sm font-bold p-4 border ${
                          statusMessage.type === 'success' ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'
                        }`}
                      >
                        {statusMessage.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <p className="text-xs text-dark/40 max-w-sm leading-relaxed uppercase tracking-tighter">
                      Your feedback will be reviewed internally and processed into our studio dashboard repository.
                    </p>
                    
                    <button 
                      type="submit"
                      disabled={isSending}
                      className="group relative flex items-center gap-4 text-xl font-bold uppercase tracking-tighter transition-all"
                    >
                      <span className={`${isSending ? 'opacity-50' : 'group-hover:pr-4'} transition-all duration-300`}>
                        {isSending ? 'Submitting...' : 'Submit Feedback'}
                      </span>
                      {!isSending && <span className="text-3xl">→</span>}
                      <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-dark scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;