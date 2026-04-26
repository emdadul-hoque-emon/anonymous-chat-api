import { IsString, Length, Matches } from 'class-validator';

export class CreateRoomRequest {
  @IsString()
  @Length(3, 32, {
    message: 'name must be between 3 and 32 characters',
  })
  @Matches(/^[a-zA-Z0-9--]+$/, {
    message: 'name can only contain alphanumeric characters and hyphens',
  })
  name: string;

  @IsString()
  ownerId: string;
}
