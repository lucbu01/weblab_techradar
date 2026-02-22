import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminLoginAuditDocument = HydratedDocument<AdminLoginAudit>;

@Schema({ collection: 'admin_login_audit' })
export class AdminLoginAudit {
  @Prop({ type: String, required: true, index: true })
  sub: string;

  @Prop({ type: Number, required: true, index: true })
  iat: number;

  @Prop({ type: [String], required: true })
  roles: string[];

  @Prop({ type: String, required: false })
  username?: string;

  @Prop({ type: String, required: false })
  ip?: string;

  @Prop({ type: String, required: false })
  userAgent?: string;

  @Prop({ type: Date, required: true, default: () => new Date() })
  createdAt: Date;
}

export const AdminLoginAuditSchema =
  SchemaFactory.createForClass(AdminLoginAudit);

// Nur ein Eintrag pro (sub (User), iat(Token-Erstellungszeitpunkt)) => ein Eintrag pro Login/Token
AdminLoginAuditSchema.index({ sub: 1, iat: 1 }, { unique: true });
