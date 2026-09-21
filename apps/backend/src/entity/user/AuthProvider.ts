export enum ProviderType {
  CREDENTIALS = 'credentials',
  EMAIL = 'email',
  GOOGLE = 'google',
  GITHUB = 'github'
}

export class AuthProvider {
  constructor(
    public type: ProviderType,
    public providerId: string
  ) {}

  static credentials(email: string): AuthProvider {
    return new AuthProvider(ProviderType.CREDENTIALS, email);
  }

  static google(id: string): AuthProvider {
    return new AuthProvider(ProviderType.GOOGLE, id);
  }
}
