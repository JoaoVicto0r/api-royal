import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleService {
  private oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Gera URL para login do Google
  getAuthUrl(): string {
    const scopes = ['https://www.googleapis.com/auth/contacts.readonly'];
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  // Troca code por token
  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  // Puxar contatos da conta Google
  async getContacts() {
    const peopleService = google.people({ version: 'v1', auth: this.oauth2Client });
    const response = await peopleService.people.connections.list({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,phoneNumbers',
      pageSize: 2000,
    });

    const connections = response.data.connections || [];
    return connections.map(person => ({
      name: person.names?.[0]?.displayName || 'Sem nome',
      email: person.emailAddresses?.[0]?.value,
      number: person.phoneNumbers?.[0]?.value,
    }));
  }
}
