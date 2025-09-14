/**
 * Post-Edit Context7 Validation Workflow
 * This module validates code quality after changes are made using Context7
 * and updates the knowledge base with any new mistakes discovered
 */

import { validateFile, ValidationResult, logMistakeToKnowledgeBase } from './claude-validation';

export interface PostEditValidation {
  filePath: string;
  validationResults: ValidationResult[];
  performanceMetrics?: PerformanceMetrics;
  newMistakes: DiscoveredMistake[];
  overallScore: number;
  recommendations: string[];
  requiresFixing: boolean;
}

export interface PerformanceMetrics {
  bundleSize?: number;
  loadTime?: number;
  lighthouseScore?: number;
}

export interface DiscoveredMistake {
  type: string;
  description: string;
  location: string;
  severity: 'error' | 'warning' | 'info';
  solution: string;
  context7Reference?: string;
}

/**
 * Run comprehensive post-edit validation
 */
export async function runPostEditValidation(
  filePath: string,
  changedContent: string
): Promise<PostEditValidation> {
  console.log(`🔍 Running post-edit validation for: ${filePath}`);

  // Step 1: Run all Context7 validations
  const validationResults = await validateFile(filePath, changedContent);

  // Step 2: Check performance impact if applicable
  const performanceMetrics = await checkPerformanceImpact(filePath, changedContent);

  // Step 3: Analyze results for new mistakes
  const newMistakes = analyzeForNewMistakes(filePath, validationResults);

  // Step 4: Calculate overall quality score
  const overallScore = calculateQualityScore(validationResults, performanceMetrics);

  // Step 5: Generate actionable recommendations
  const recommendations = generatePostEditRecommendations(validationResults, newMistakes);

  // Step 6: Determine if fixes are required
  const requiresFixing = determineIfFixingRequired(validationResults, overallScore);

  // Step 7: Log new mistakes to knowledge base
  await logNewMistakesToKnowledgeBase(newMistakes);

  return {
    filePath,
    validationResults,
    performanceMetrics,
    newMistakes,
    overallScore,
    recommendations,
    requiresFixing
  };
}

/**
 * Validate React components against Context7 best practices
 */
export async function validateReactComponentWithContext7(
  componentCode: string,
  componentName: string
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  // Query Context7 for React patterns
  try {
    // This would use the actual MCP Context7 tools
    const reactValidation = await queryContext7ForPattern('react', {
      topic: 'component patterns',
      code: componentCode
    });

    results.push(reactValidation);
  } catch (error) {
    results.push({
      isValid: false,
      suggestions: ['Failed to validate against Context7 React patterns'],
      documentation: 'Context7 React validation failed',
      severity: 'warning'
    });
  }

  // Check for common React anti-patterns
  const antiPatterns = detectReactAntiPatterns(componentCode);
  if (antiPatterns.length > 0) {
    results.push({
      isValid: false,
      suggestions: antiPatterns,
      documentation: 'React anti-patterns detected',
      severity: 'warning'
    });
  }

  return results;
}

/**
 * Validate Next.js patterns with Context7
 */
export async function validateNextjsWithContext7(
  code: string,
  filePath: string
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  try {
    // Determine Next.js pattern type
    let patternType = 'general';
    if (filePath.includes('app/')) patternType = 'app-router';
    if (filePath.includes('api/')) patternType = 'api-routes';
    if (filePath.includes('page.')) patternType = 'pages';
    if (filePath.includes('layout.')) patternType = 'layouts';

    const nextjsValidation = await queryContext7ForPattern('nextjs', {
      topic: patternType,
      code: code
    });

    results.push(nextjsValidation);
  } catch (error) {
    results.push({
      isValid: false,
      suggestions: ['Failed to validate against Context7 Next.js patterns'],
      documentation: 'Context7 Next.js validation failed',
      severity: 'warning'
    });
  }

  // Check Next.js performance patterns
  const performanceIssues = detectNextjsPerformanceIssues(code);
  if (performanceIssues.length > 0) {
    results.push({
      isValid: false,
      suggestions: performanceIssues,
      documentation: 'Next.js performance optimization needed',
      severity: 'warning'
    });
  }

  return results;
}

/**
 * Check performance impact of changes
 */
async function checkPerformanceImpact(
  filePath: string,
  content: string
): Promise<PerformanceMetrics | undefined> {
  // Only check performance for key files
  if (!shouldCheckPerformance(filePath)) {
    return undefined;
  }

  const metrics: PerformanceMetrics = {};

  // Estimate bundle size impact
  const estimatedSize = estimateBundleSize(content);
  if (estimatedSize > 150000) { // 150KB limit from CLAUDE.md
    metrics.bundleSize = estimatedSize;
  }

  // Check for performance anti-patterns
  const hasPerformanceIssues = detectPerformanceAntiPatterns(content);
  if (hasPerformanceIssues) {
    metrics.lighthouseScore = 75; // Estimated reduced score
  }

  return Object.keys(metrics).length > 0 ? metrics : undefined;
}

/**
 * Analyze validation results for new types of mistakes
 */
function analyzeForNewMistakes(
  filePath: string,
  validationResults: ValidationResult[]
): DiscoveredMistake[] {
  const mistakes: DiscoveredMistake[] = [];

  validationResults.forEach(result => {
    if (!result.isValid) {
      result.suggestions.forEach(suggestion => {
        // Check if this is a new type of mistake
        if (isNewMistakePattern(suggestion)) {
          mistakes.push({
            type: categorizesMistakeType(suggestion),
            description: suggestion,
            location: filePath,
            severity: result.severity,
            solution: generateSolutionFromSuggestion(suggestion),
            context7Reference: result.documentation
          });
        }
      });
    }
  });

  return mistakes;
}

/**
 * Calculate overall quality score (0-100)
 */
function calculateQualityScore(
  validationResults: ValidationResult[],
  performanceMetrics?: PerformanceMetrics
): number {
  let score = 100;

  // Deduct points for validation issues
  validationResults.forEach(result => {
    if (!result.isValid) {
      const deduction = result.severity === 'error' ? 20 :
                       result.severity === 'warning' ? 10 : 5;
      score -= deduction;
    }
  });

  // Deduct points for performance issues
  if (performanceMetrics?.bundleSize && performanceMetrics.bundleSize > 150000) {
    score -= 15;
  }
  if (performanceMetrics?.lighthouseScore && performanceMetrics.lighthouseScore < 90) {
    score -= 10;
  }

  return Math.max(0, score);
}

/**
 * Generate post-edit recommendations
 */
function generatePostEditRecommendations(
  validationResults: ValidationResult[],
  newMistakes: DiscoveredMistake[]
): string[] {
  const recommendations: string[] = [];

  // Add validation recommendations
  validationResults.forEach(result => {
    if (!result.isValid) {
      recommendations.push(`🔧 ${result.documentation}`);
      result.suggestions.forEach(suggestion => {
        recommendations.push(`  • ${suggestion}`);
      });
    }
  });

  // Add new mistake recommendations
  newMistakes.forEach(mistake => {
    recommendations.push(`🆕 NEW MISTAKE PATTERN: ${mistake.description}`);
    recommendations.push(`  ✅ SOLUTION: ${mistake.solution}`);
  });

  return recommendations;
}

/**
 * Determine if immediate fixing is required
 */
function determineIfFixingRequired(
  validationResults: ValidationResult[],
  overallScore: number
): boolean {
  // Require fixing if there are errors
  const hasErrors = validationResults.some(result =>
    result.severity === 'error' && !result.isValid
  );

  // Or if quality score is too low
  const qualityTooLow = overallScore < 70;

  return hasErrors || qualityTooLow;
}

/**
 * Log new mistakes to knowledge base
 */
async function logNewMistakesToKnowledgeBase(mistakes: DiscoveredMistake[]): Promise<void> {
  for (const mistake of mistakes) {
    logMistakeToKnowledgeBase(
      mistake.description,
      mistake.solution,
      mistake.location,
      mistake.context7Reference
    );
  }
}

/**
 * Helper Functions
 */
async function queryContext7ForPattern(
  library: string,
  options: { topic: string; code: string }
): Promise<ValidationResult> {
  // This would integrate with actual Context7 MCP tools
  // For now, return simulated validation
  return {
    isValid: true,
    suggestions: [`Follow ${library} best practices for ${options.topic}`],
    documentation: `${library} validation from Context7`,
    severity: 'info'
  };
}

function detectReactAntiPatterns(code: string): string[] {
  const issues: string[] = [];

  if (code.includes('useState') && code.includes('useEffect') && code.includes('[]')) {
    issues.push('Consider if effect dependencies are correctly specified');
  }

  if (code.includes('any') && code.includes('props')) {
    issues.push('Avoid using "any" for props - define proper TypeScript interfaces');
  }

  if (code.includes('innerHTML')) {
    issues.push('Avoid innerHTML - use dangerouslySetInnerHTML if necessary');
  }

  return issues;
}

function detectNextjsPerformanceIssues(code: string): string[] {
  const issues: string[] = [];

  if (code.includes('import') && !code.includes('dynamic')) {
    if (code.split('import').length > 10) {
      issues.push('Consider dynamic imports for better code splitting');
    }
  }

  if (code.includes('useEffect') && code.includes('fetch')) {
    issues.push('Consider using Next.js data fetching methods instead of useEffect + fetch');
  }

  return issues;
}

function shouldCheckPerformance(filePath: string): boolean {
  return filePath.includes('app/') ||
         filePath.includes('components/') ||
         filePath.includes('page.') ||
         filePath.includes('layout.');
}

function estimateBundleSize(content: string): number {
  // Simple estimation based on content length and imports
  const baseSize = content.length * 1.5; // Rough estimate
  const importCount = (content.match(/import/g) || []).length;
  return baseSize + (importCount * 1000); // Add estimated size per import
}

function detectPerformanceAntiPatterns(content: string): boolean {
  const antiPatterns = [
    'while (true)',
    'setInterval',
    'setTimeout.*0',
    'for.*while',
    'JSON.parse.*JSON.stringify'
  ];

  return antiPatterns.some(pattern => new RegExp(pattern).test(content));
}

function isNewMistakePattern(suggestion: string): boolean {
  // Check if this suggestion represents a new type of mistake
  // This would check against the existing knowledge base
  return suggestion.includes('avoid') || suggestion.includes('don\'t') || suggestion.includes('never');
}

function categorizesMistakeType(suggestion: string): string {
  if (suggestion.includes('TypeScript')) return 'typescript';
  if (suggestion.includes('React')) return 'react';
  if (suggestion.includes('performance')) return 'performance';
  if (suggestion.includes('security')) return 'security';
  return 'general';
}

function generateSolutionFromSuggestion(suggestion: string): string {
  // Convert negative suggestion to positive solution
  return suggestion.replace(/avoid|don't|never/gi, 'use proper approach for');
}

/**
 * Main entry point for post-edit validation
 */
export async function afterEdit(
  filePath: string,
  newContent: string
): Promise<PostEditValidation> {
  return await runPostEditValidation(filePath, newContent);
}

export default {
  runPostEditValidation,
  validateReactComponentWithContext7,
  validateNextjsWithContext7,
  afterEdit
};