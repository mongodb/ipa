import type { DefaultParseFrontMatter } from "@docusaurus/types";
import { ipaFrontmatterSchema } from "../types/ipa";

/** Pattern matching IPA doc paths — any numbered file under ipa/ */
const IPA_DOC_PATTERN = /(?:^|\/)ipa\/.*\/\d+.*\.mdx?$/;

function isIpaDoc(filePath: string): boolean {
  return IPA_DOC_PATTERN.test(filePath);
}

export default async function parseFrontMatter({
  filePath,
  fileContent,
  defaultParseFrontMatter,
}: {
  filePath: string;
  fileContent: string;
  defaultParseFrontMatter: DefaultParseFrontMatter;
}) {
  const result = await defaultParseFrontMatter({ filePath, fileContent });

  if (!isIpaDoc(filePath)) {
    return result;
  }

  const parsed = ipaFrontmatterSchema.safeParse(result.frontMatter);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid frontmatter in ${filePath}: ${issues}`);
  }

  // Write back normalized values and derive slug from id
  result.frontMatter.state = parsed.data.state;
  result.frontMatter.slug = `/${parsed.data.id}`;
  return result;
}
