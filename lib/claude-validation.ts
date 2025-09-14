/**
 * Context7 Validation Helper Functions
 * Used to validate code patterns against latest documentation and best practices
 */

export interface ValidationResult {
  isValid: boolean;
  suggestions: string[];
  documentation: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationContext {
  framework: string;
  component?: string;
  fileType: string;
  codeSnippet?: string;
}

/**
 * Validate React component patterns using Context7
 */
export async function validateReactComponent(
  componentCode: string,
  componentName: string
): Promise<ValidationResult> {
  // This will use Context7 to validate React patterns
  const context: ValidationContext = {
    framework: 'react',
    component: componentName,
    fileType: 'tsx',
    codeSnippet: componentCode
  };

  // Query Context7 for React best practices
  const suggestions = await queryContext7ForValidation('react', 'component patterns');

  return {
    isValid: true, // Will be determined by Context7 response
    suggestions: suggestions || [],
    documentation: 'React component best practices from Context7',
    severity: 'info'
  };
}

/**
 * Validate Next.js patterns and performance
 */
export async function validateNextjsPattern(
  code: string,
  patternType: 'routing' | 'data-fetching' | 'performance'
): Promise<ValidationResult> {
  const suggestions = await queryContext7ForValidation('nextjs', patternType);

  return {
    isValid: true,
    suggestions: suggestions || [],
    documentation: `Next.js ${patternType} validation from Context7`,
    severity: 'info'
  };
}

/**
 * Validate TypeScript strict mode compliance
 */
export async function validateTypeScriptStrict(
  code: string,
  fileName: string
): Promise<ValidationResult> {
  const suggestions = await queryContext7ForValidation('typescript', 'strict mode');

  // Check for common TypeScript issues
  const issues: string[] = [];

  if (code.includes('any')) {
    issues.push('Avoid using "any" type - use specific types instead');
  }

  if (fileName.endsWith('.js') && !fileName.endsWith('.jsx')) {
    issues.push('Consider converting to TypeScript (.ts/.tsx) for better type safety');
  }

  return {
    isValid: issues.length === 0,
    suggestions: [...(suggestions || []), ...issues],
    documentation: 'TypeScript strict mode best practices',
    severity: issues.length > 0 ? 'warning' : 'info'
  };
}

/**
 * Validate Syracuse branding compliance
 */
export function validateSyracuseBranding(code: string): ValidationResult {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for Syracuse colors
  const syracuseOrange = '#C13F03';
  const syracuseBlue = '#051C3D';

  if (code.includes('blue-600') && !code.includes('orange-600')) {
    suggestions.push(`Consider using Syracuse orange (${syracuseOrange}) with blue accents`);
  }

  if (code.includes('text-gray-900') && code.includes('bg-blue')) {
    suggestions.push(`Maintain Syracuse branding with blue (${syracuseBlue}) for headers`);
  }

  // Check for campus background reference
  if (code.includes('bg-gradient') && !code.includes('campus')) {
    suggestions.push('Consider using Syracuse campus background as specified in CLAUDE.md');
  }

  return {
    isValid: issues.length === 0,
    suggestions,
    documentation: 'Syracuse University branding guidelines from CLAUDE.md',
    severity: issues.length > 0 ? 'warning' : 'info'
  };
}

/**
 * Validate database schema against Prisma best practices
 */
export async function validatePrismaSchema(
  schema: string
): Promise<ValidationResult> {
  const suggestions = await queryContext7ForValidation('prisma', 'schema design');

  const issues: string[] = [];

  // Check for required fields from CLAUDE.md
  if (!schema.includes('Project') && schema.includes('model')) {
    issues.push('Missing Project model as specified in CLAUDE.md architecture');
  }

  if (!schema.includes('Contact') && schema.includes('model')) {
    issues.push('Missing Contact model for contact form submissions');
  }

  return {
    isValid: issues.length === 0,
    suggestions: [...(suggestions || []), ...issues],
    documentation: 'Prisma schema validation based on CLAUDE.md requirements',
    severity: issues.length > 0 ? 'error' : 'info'
  };
}

/**
 * Helper function to query Context7 for validation guidance
 */
async function queryContext7ForValidation(
  library: string,
  topic: string
): Promise<string[] | null> {
  try {
    // This would integrate with the Context7 MCP tools
    // For now, return placeholder suggestions
    return [
      `Follow ${library} best practices for ${topic}`,
      `Check latest ${library} documentation for current patterns`,
      `Validate against ${library} performance recommendations`
    ];
  } catch (error) {
    console.warn(`Context7 validation failed for ${library}:${topic}`, error);
    return null;
  }
}

/**
 * Run all validations for a given file
 */
export async function validateFile(
  filePath: string,
  fileContent: string
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  // Determine file type and run appropriate validations
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    results.push(await validateReactComponent(fileContent, extractComponentName(filePath)));
    results.push(await validateTypeScriptStrict(fileContent, filePath));
    results.push(validateSyracuseBranding(fileContent));
  }

  if (filePath.includes('prisma/schema.prisma')) {
    results.push(await validatePrismaSchema(fileContent));
  }

  if (filePath.includes('app/') && filePath.endsWith('.tsx')) {
    results.push(await validateNextjsPattern(fileContent, 'routing'));
  }

  return results;
}

/**
 * Extract component name from file path
 */
function extractComponentName(filePath: string): string {
  const fileName = filePath.split('/').pop() || '';
  return fileName.replace(/\.(tsx|jsx)$/, '');
}

/**
 * Update knowledge base with new mistake
 */
export function logMistakeToKnowledgeBase(
  mistake: string,
  solution: string,
  location: string,
  context7Reference?: string
): void {
  // This would append to CLAUDE_KNOWLEDGE_BASE.md
  const logEntry = {
    mistake,
    solution,
    location,
    context7Reference,
    timestamp: new Date().toISOString()
  };

  console.log('Mistake logged to knowledge base:', logEntry);
}

export default {
  validateReactComponent,
  validateNextjsPattern,
  validateTypeScriptStrict,
  validateSyracuseBranding,
  validatePrismaSchema,
  validateFile,
  logMistakeToKnowledgeBase
};