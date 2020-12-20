export interface IMessage {
  userId: number;
  calendarId: number;
  description: string;
  otherNickname: string;
  nickname: string;
  messageId: number;
  answer: boolean;
  read: boolean;
  write: boolean;
  auth: boolean;
}
