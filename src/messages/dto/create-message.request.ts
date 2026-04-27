import { IsString, Length, Matches } from 'class-validator';

export class CreateMessageRequest {
  @IsString()
  @Length(1, 256, {
    message: 'content must be between 1 and 256 characters',
  })
  content: string;
}
