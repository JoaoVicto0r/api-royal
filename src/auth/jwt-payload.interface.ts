export interface JwtPayload {
  sub: string; // geralmente o userId
  role: string; // perfil do usuário (admin, user, etc.)
}
