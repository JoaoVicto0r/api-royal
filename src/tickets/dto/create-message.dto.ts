export class CreateMessageDto {
  body: string;
  fromMe?: boolean;
  userId?: number;
}