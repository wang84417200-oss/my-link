"use client";

import { motion, Variants } from "framer-motion";
import { Code, Mail, ArrowRight } from "lucide-react";

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <motion.div
        className="w-full max-w-3xl overflow-hidden rounded-3xl backdrop-blur-3xl bg-white/40 dark:bg-black/40 border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="px-6 py-12 sm:px-12 sm:py-20 flex flex-col items-center text-center">
          <motion.div
            className="mb-8 relative group"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white/50 dark:border-white/20 bg-gradient-to-tr from-indigo-200 to-purple-300 dark:from-indigo-900 dark:to-purple-800 flex items-center justify-center shadow-2xl overflow-hidden">
              <span className="text-4xl sm:text-5xl font-extrabold text-white/80 mix-blend-overlay">WH</span>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-6 text-center w-full"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 pb-2"
            >
              왕하은
            </motion.h1>
            
            <motion.h2 
              variants={itemVariants}
              className="text-lg sm:text-xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl"
            >
              프론트엔드 개발자
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed mt-2"
            >
              안녕하세요. 심플하고 명확한 가치를 전달하는 개발자 왕하은입니다. 
              사용자 경험(UX)을 중요하게 생각하며, 아름답고 동적인 웹 애플리케이션을 만드는 것에 열정이 있습니다.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4 mt-8 w-full"
            >
              <a
                href="mailto:contact@example.com"
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-slate-900 dark:bg-white px-8 font-medium text-white dark:text-slate-900 transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-xl dark:shadow-white/10"
              >
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] bg-white/20 dark:bg-black/10" />
                <Mail className="mr-2 h-5 w-5" />
                <span>Contact Me</span>
              </a>

              <a
                href="https://github.com/wang84417200-oss"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 px-8 font-medium text-slate-900 dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 shadow-sm backdrop-blur-sm"
              >
                <Code className="mr-2 h-5 w-5" />
                <span>GitHub</span>
                <ArrowRight className="ml-2 h-4 w-4 opacity-50 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
