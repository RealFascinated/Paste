/**
 * Prism instance with language grammars loaded so the highlighter supports
 * Java and every other language. Import prism-global first so Prism is on
 * globalBefore before component modules run (they expect global Prism).
 */
import "@/lib/prism-global";
import Prism from "prismjs";

// Java (and other C-like languages) – must load clike first
import "prismjs/components/prism-clike";
import "prismjs/components/prism-java";
// Other common languages – explicit imports ensure they're in the client bundle
import "prismjs/components/prism-python";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-scala";
import "prismjs/components/prism-swift";
// PHP requires markup and markup-templating (they define tokenizePlaceholders)
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-groovy";
import "prismjs/components/prism-haskell";
import "prismjs/components/prism-lua";
import "prismjs/components/prism-perl";
import "prismjs/components/prism-r";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-powershell";

export default Prism;
