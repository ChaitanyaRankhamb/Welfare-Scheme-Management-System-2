import { AppError } from "../../Error/appError";
import { AuthProvider, ProviderType } from "./AuthProvider";
import { UserId } from "./userId";

export interface UserProfile {
  caste?: string;
  religion?: string;
  income?: number;
  profession?: string;
  state?: string;
}

export class User {
  private providers: AuthProvider[] = [];
  private verificationCode?: number;
  private verificationExpiry?: Date;

  constructor(
    public readonly id: UserId,
    private email: string,
    private username?: string,
    private avatar?: string,
    private emailVerified: boolean = false,
    private isActive: boolean = true,
    providers: AuthProvider[] = [],
    verificationCode?: number,
    verificationExpiry?: Date,
    public readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
    // Additional fields for welfare logic
    private passwordHash?: string,
    private role: 'citizen' | 'admin' = 'citizen',
    private profile?: UserProfile
  ) {
    this.providers = providers;
    this.verificationCode = verificationCode;
    this.verificationExpiry = verificationExpiry;
  }

  addProvider(provider: AuthProvider) {
    const exists = this.providers.find((p) => p.type === provider.type);

    if (exists) {
      throw new AppError("Provider Already Linked", 400);
    }

    this.providers.push(provider);
    this.touch();
  }

  getProviders(): AuthProvider[] {
    return this.providers;
  }

  hasProvider(type: ProviderType): boolean {
    return this.providers.some((p) => p.type === type);
  }

  setVerification(code: number, expiry: Date) {
    this.verificationCode = code;
    this.verificationExpiry = expiry;
    this.touch();
  }

  clearVerificationData(): void {
    this.verificationCode = undefined;
    this.verificationExpiry = undefined;
  }

  isEmailVerified(): boolean {
    return this.emailVerified;
  }

  setEmailVerified(value: boolean): void {
    this.emailVerified = value;
    this.touch();
  }

  getEmail(): string {
    return this.email;
  }

  getUsername(): string | undefined {
    return this.username;
  }

  getAvatar(): string | undefined {
    return this.avatar;
  }

  isUserActive(): boolean {
    return this.isActive;
  }

  getVerificationCode(): number | undefined {
    return this.verificationCode;
  }

  getVerificationExpiry(): Date | undefined {
    return this.verificationExpiry;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // --- Added Methods for Core Business Logic ---
  getPasswordHash(): string | undefined {
    return this.passwordHash;
  }

  setPasswordHash(hash: string): void {
    this.passwordHash = hash;
    this.touch();
  }

  getRole(): 'citizen' | 'admin' {
    return this.role;
  }

  getProfile(): UserProfile | undefined {
    return this.profile;
  }

  updateProfile(newProfile: Partial<UserProfile>): void {
    this.profile = { ...this.profile, ...newProfile };
    this.touch();
  }

  setActiveStatus(status: boolean): void {
    this.isActive = status;
    this.touch();
  }

  private touch() {
    this.updatedAt = new Date();
  }
}
