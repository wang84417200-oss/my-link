"use client";

import { motion, Variants } from "framer-motion";
import { Mail, ArrowRight, Code } from "lucide-react";

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 250, damping: 20 },
    },
  };

  const borderClass = "border-4 border-black dark:border-[#FFFBEB]";
  const shadowClass = "shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_#FFFBEB]";
  const hoverClass = "hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0_0_#FFFBEB] hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-200";

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 lg:p-12 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[1200px] flex flex-col gap-6 sm:gap-8 mt-8 sm:mt-12"
      >
        {/* Header Section */}
        <motion.header
          variants={itemVariants}
          className={`w-full ${borderClass} bg-[#FEF08A] dark:bg-zinc-900 p-8 sm:p-12 lg:p-16 ${shadowClass}`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-black dark:text-[#FFFBEB]">
                HaEun<br />Wang
              </h1>
            </div>
            <div className={`mt-4 w-fit px-6 py-3 bg-white dark:bg-black text-black dark:text-white font-bold text-xl sm:text-2xl uppercase border-4 border-black dark:border-[#FFFBEB]`}>
              Frontend Dev
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* About Section */}
          <motion.section
            variants={itemVariants}
            className={`lg:col-span-2 ${borderClass} bg-white dark:bg-black p-8 sm:p-12 ${shadowClass}`}
          >
            <h3 className="text-3xl sm:text-4xl font-black mb-6 uppercase border-b-4 border-black dark:border-[#FFFBEB] pb-4 inline-block">
              About Me
            </h3>
            <p className="text-lg sm:text-xl md:text-2xl font-medium leading-relaxed mt-4">
              안녕하세요. 심플하고 명확한 가치를 전달하는 개발자 <strong className="bg-[#FEF08A] dark:bg-zinc-800 px-2 py-1 mx-1 border-2 border-black dark:border-white">왕하은</strong>입니다.
              <br /><br />
              사용자 경험(UX)을 가장 중요하게 생각하며, 구조적이면서도 아름답고 생동감 넘치는 웹 애플리케이션을 만드는 일에 열정을 쏟고 있습니다. 복잡한 문제를 직관적으로 풀고, 사용자에게 강렬하고 즐거운 인터페이스를 제공하는 것을 지향합니다.
            </p>
          </motion.section>

          {/* Contact / Links Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row lg:flex-col gap-6 sm:gap-8"
          >
            <a
              href="mailto:contact@example.com"
              className={`flex-1 flex flex-col items-center justify-center gap-4 ${borderClass} bg-[#F472B6] p-8 sm:p-10 group ${shadowClass} ${hoverClass}`}
            >
              <div className="bg-black text-[#F472B6] p-4 rounded-full">
                <Mail className="w-10 h-10" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-black">CONTACT</span>
            </a>

            <a
              href="https://github.com/wang84417200-oss"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex flex-col items-center justify-center gap-4 ${borderClass} bg-[#60A5FA] p-8 sm:p-10 group ${shadowClass} ${hoverClass}`}
            >
              <div className="bg-black text-[#60A5FA] p-4 rounded-full">
                <Code className="w-10 h-10" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-black">GITHUB</span>
            </a>
          </motion.div>
        </div>

        {/* Footer Banner */}
        <motion.footer
          variants={itemVariants}
          className={`w-full ${borderClass} bg-[#34D399] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 sm:mt-4 ${shadowClass}`}
        >
          <span className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">Let's build something bold</span>
          <ArrowRight className="w-10 h-10 text-black hidden sm:block animate-pulse" />
        </motion.footer>

      </motion.div>
    </div>
  );
}
