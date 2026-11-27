/** Server-side J2 boundary; all identities are resolved from trusted cookies. */
export type J2Environment = Readonly<Record<string, string | undefined>>;
export type J2StudentIdentity = Readonly<{ role: "student"; studentId: string; environment: "private-preview" }>;
export function handleParentOtpTest(request: Request, env: J2Environment): Promise<Response>;
export function handleStudentAuth(request: Request, env: J2Environment): Promise<Response>;
export function resolveJ2Student(request: Request, env: J2Environment): Promise<J2StudentIdentity | null>;
export function readJ12345VerifiedChild(studentId:string,env:J2Environment):Promise<unknown>;
