export abstract class TokenFunctionalRepository {
  abstract generateAccessToken(payload: any): Promise<string>;
  abstract generateRefreshToken(payload: any): Promise<string>;
}
