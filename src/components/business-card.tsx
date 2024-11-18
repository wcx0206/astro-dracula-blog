
import { motion } from "framer-motion";
import avatarImage from "@/assets/avatar.webp";
import { AUTHOR, SOCIALS } from "../config";

export default function BusinessCard() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }}
            className="p-8 bg-dracula-dark/20 text-pretty flex flex-col sm:flex-row gap-12 items-center w-full md:w-2/3"
        >
            <motion.img
                src={avatarImage.src}
                alt="avatar" className="w-32 h-32 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            />
            <div className="flex flex-col gap-4 text-center sm:text-left">
                <h2 className="font-bold text-3xl text-dracula-pink">{AUTHOR.name}</h2>
                <p className="text-pretty">
                    {AUTHOR.bio}
                </p>
                <p className="flex gap-4 justify-center sm:justify-start">
                    {
                        SOCIALS.map((social) =>
                            <a
                                className="text-dracula-cyan hover:text-dracula-purple transition
                                underline underline-offset-4"
                                href={social.href}
                                title={social.linkTitle}
                                key={social.name}>
                                {social.name}
                            </a>)
                    }
                </p>
            </div>
        </motion.div>
    );
}