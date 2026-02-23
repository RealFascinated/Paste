/**
 * Set up global Prism so component modules (prism-java, etc.) can register.
 * This module must be imported before any prismjs/components/* imports.
 */
import Prism from "prismjs";

if (typeof globalThis !== "undefined") {
  (globalThis as unknown as { Prism: typeof Prism }).Prism = Prism;
}

export default Prism;
