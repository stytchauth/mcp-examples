/**
 * Extract domain from email address
 * @param email - Email address
 * @returns Domain name (e.g., "mycompany" from "hi@mycompany.com")
 */
export function extractDomainFromEmail(email: string): string {
  const domain = email.split('@')[1];
  if (!domain) {
    throw new Error('Invalid email address');
  }
  
  // Remove common TLDs to get the base domain
  // For now, we'll just use the full domain as-is
  // Later we could add logic to normalize similar domains
  return domain.toLowerCase();
}

/**
 * Check if a domain organization exists
 * @param domain - Domain name
 * @returns Promise<boolean>
 */
export async function domainOrgExists(domain: string): Promise<boolean> {
  // This will be implemented in the organizations service
  // For now, return false as placeholder
  return false;
}
