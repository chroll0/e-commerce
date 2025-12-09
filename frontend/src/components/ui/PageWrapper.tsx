"use client";

import { FC, ReactNode } from "react";
import { motion, Variants, TargetAndTransition } from "framer-motion";
import classNames from "classnames";

type PageWrapperProps = {
  children: ReactNode;
  className?: string;
  // Either simple TargetAndTransition for initial/animate/exit
  initial?: TargetAndTransition | string;
  animate?: TargetAndTransition | string;
  exit?: TargetAndTransition | string;
  // Or full variants
  variants?: Variants;
};

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

const PageWrapper: FC<PageWrapperProps> = ({
  children,
  className,
  initial,
  animate,
  exit,
  variants,
}) => {
  return (
    <motion.div
      className={classNames(
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
      variants={variants ?? defaultVariants}
      initial={initial ?? "hidden"}
      animate={animate ?? "visible"}
      exit={exit ?? "exit"}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
