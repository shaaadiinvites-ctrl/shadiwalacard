"use client";

import { motion, Variants } from "framer-motion";
import { WeddingRecord } from "@/types/wedding";

export function InvitationSection({ wedding }: { wedding?: WeddingRecord }) {
  const revealVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section className="relative overflow-hidden bg-transparent pb-[200px] mt-[20vh] lg:mt-[calc(143vw-100vh-100px)] z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1e5064]/35 to-transparent pointer-events-none"></div>

      {/* Floating Petals (can be animated later) */}
      <img loading="lazy" alt="" src="/project3-assets/champagne_lotus.png" className="absolute left-[3%] top-[10%] w-[clamp(60px,14vw,140px)] opacity-75 blur-[1px] pointer-events-none -rotate-12" />
      <img loading="lazy" alt="" src="/project3-assets/burgundy_rose.png" className="absolute right-[4%] top-[18%] w-[clamp(45px,11vw,110px)] opacity-60 blur-[2px] pointer-events-none rotate-[30deg]" />
      <img loading="lazy" alt="" src="/project3-assets/marigold_petals.png" className="absolute left-[8%] bottom-[30%] w-[clamp(70px,18vw,180px)] opacity-85 drop-shadow-md pointer-events-none z-[2] -rotate-45" />
      <img loading="lazy" alt="" src="/project3-assets/champagne_lotus.png" className="absolute right-[5%] bottom-[15%] w-[clamp(50px,12vw,120px)] opacity-65 blur-[1px] pointer-events-none rotate-60" />

      <div className="relative max-w-[560px] mx-auto mt-[clamp(160px,25vh,220px)] px-4 md:px-7 pb-[clamp(40px,8vh,80px)] flex flex-col items-center text-center text-white">

        <motion.img 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={revealVariants}
          src="/project3-assets/ganesh-opt.png" alt="Lord Ganesha" 
          className="w-[clamp(100px,18vw,238px)] opacity-90 mb-8 drop-shadow-lg" 
        />

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="font-yatra text-[clamp(30px,8vw,52px)] leading-[1.2] text-[#FBF6F5] drop-shadow-md mb-10">
          || श्री गणेशाय नमः ||
        </motion.div>

        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="font-lora text-[clamp(16px,3.8vw,20px)] leading-[1.7] text-white/90 max-w-[420px]">
          With the heavenly blessings of<br/>our beloved grandparents
        </motion.p>

        {/* Ornate Gold Flourish Divider */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="flex items-center justify-center gap-[clamp(10px,3vw,24px)] my-12 w-full">
          <span className="flex-1 h-[1px] max-w-[120px] bg-gradient-to-r from-transparent to-[#C8912A]/50"></span>
          <img loading="lazy" src="/project3-assets/burgundy_rose.png" alt="Rose" className="w-[clamp(30px,6vw,45px)] opacity-85 drop-shadow-md -rotate-15" />
          <img loading="lazy" src="/project3-assets/champagne_lotus.png" alt="Lotus" className="w-[clamp(50px,9vw,75px)] opacity-95 drop-shadow-[0_0_12px_rgba(255,248,220,0.4)]" />
          <img loading="lazy" src="/project3-assets/burgundy_rose.png" alt="Rose" className="w-[clamp(30px,6vw,45px)] opacity-85 drop-shadow-md rotate-15 -scale-x-100" />
          <span className="flex-1 h-[1px] max-w-[120px] bg-gradient-to-r from-[#C8912A]/50 to-transparent"></span>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="font-montserrat text-[clamp(18px,5vw,28px)] tracking-[5px] text-[#FFF8DC]/85 uppercase mb-4">
          We Invite
        </motion.div>
        
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="font-lora text-[clamp(15px,3.5vw,18px)] text-white/85 mb-12 tracking-[1.5px] leading-[1.6]">
          you and your family to join us in the wedding celebrations of
        </motion.p>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="relative w-full max-w-[600px] mt-5 py-10">
          
          <div className="relative z-10 w-full flex flex-col items-center text-center">
            <h2 className="font-playfair font-normal text-[clamp(44px,12vw,76px)] leading-[1.1] text-white tracking-[1.5px] drop-shadow-lg m-0">{wedding?.groom_name || "Groom"}</h2>
            {(wedding?.groom_father_name || wedding?.groom_mother_name) && (
              <p className="font-lora text-[clamp(13px,3.5vw,16px)] leading-[1.5] text-white/65 mt-3 tracking-[2.5px] uppercase">
                Son of {wedding.groom_mother_name ? `Mrs. ${wedding.groom_mother_name}` : ""}
                {wedding.groom_mother_name && wedding.groom_father_name ? " & " : ""}
                {wedding.groom_father_name ? `Mr. ${wedding.groom_father_name}` : ""}
              </p>
            )}
          </div>
          
          <div className="relative z-10 flex items-center justify-center w-full my-9">
             <span className="font-playfair italic font-normal text-[clamp(34px,8vw,50px)] text-[#C8912A]/90 leading-none">&amp;</span>
          </div>
          
          <div className="relative z-10 w-full flex flex-col items-center text-center">
            <h2 className="font-playfair font-normal text-[clamp(44px,12vw,76px)] leading-[1.1] text-white tracking-[1.5px] drop-shadow-lg m-0">{wedding?.bride_name || "Bride"}</h2>
            {(wedding?.bride_father_name || wedding?.bride_mother_name) && (
              <p className="font-lora text-[clamp(13px,3.5vw,16px)] leading-[1.5] text-white/65 mt-3 tracking-[2.5px] uppercase">
                Daughter of {wedding.bride_mother_name ? `Mrs. ${wedding.bride_mother_name}` : ""}
                {wedding.bride_mother_name && wedding.bride_father_name ? " & " : ""}
                {wedding.bride_father_name ? `Mr. ${wedding.bride_father_name}` : ""}
              </p>
            )}
          </div>
          
        </motion.div>

      </div>
    </section>
  );
}
